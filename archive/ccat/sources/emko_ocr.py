"""ЕМКО table rows from OCR text: parse, validate by row identities, repair misreads.

A Table x.2 row reads: n, segment, formula, then the numeric columns, then an
optional note (e.g. "ПС=1,0", "к81 = 0,4"). Numeric columns, right-aligned:
  with ПТ (8):    base ПС ПП ПК fin ПТ П draft
  without ПТ (7): base ПС ПП ПК fin П draft    (Tables 4.2, 5.2: П = ПК, draft = fin)
Constructive rows print only the draft value; those stay 'draft-only' (unverified):
nothing in the row can check them.

Repair policy (fail closed): a row that breaks its identities is fixed only when
exactly one cell has exactly one plausible OCR misreading (dropped decimal comma,
merged footnote digit, a known glyph confusion) that makes every identity hold.
Anything else stays 'invalid' and is reported, never guessed.
"""
import re

from ..ocr import to_number

COLUMNS = {8: ['base', 'ps', 'pp', 'pk', 'fin', 'pt', 'p', 'draft'],
           7: ['base', 'ps', 'pp', 'pk', 'fin', 'p', 'draft']}
IDENTITIES = {8: [('pk', ('ps', 'pp')), ('fin', ('base', 'pk')), ('p', ('pk', 'pt')), ('draft', ('base', 'p'))],
              7: [('pk', ('ps', 'pp')), ('fin', ('base', 'pk')), ('p', ('pk',)), ('draft', ('base', 'p'))]}
# allowance columns that may be printed blank (no dash) when the allowance is zero
BLANKABLE = {'ps', 'pp', 'pk', 'pt', 'p'}
MAX_BLANKS = 4
TOL = 0.06                                   # the book rounds to 0.05
CONFUSE = {'3': '8', '8': '30', '1': '74', '7': '1', '4': '1', '5': '6', '6': '58', '0': '8'}   # glyphs tesseract swaps here

ROW = re.compile(r'^\s*(\d{1,3}(?:[.,]\d{1,2})?)\s+(\S.*)$')
SEG = re.compile(r"^R?\d{2,3}['’\"]*[—–-]+\d")       # segment like 131—344
NOTE_START = re.compile(r'^[A-Za-zА-Яа-яЁё]+\d*=|^=')


def split_note(tokens):
    """Tokens before the note, and the note's (label, value) pairs. The note starts at
    the first token with '=' joined to a label or a value (or a label followed by
    '=value'). A lone '=' or '==' is the book's mark for an empty cell, not a note."""
    cut = len(tokens)
    for i, t in enumerate(tokens):
        nxt = tokens[i + 1] if i + 1 < len(tokens) else ''
        if (re.search(r'[\wА-Яа-яЁё]=|=\s*[—–-]?\d', t)              # a19=, ПС=1,0, =0,4 (not a lone '=' cell)
                or (re.match(r'^[A-Za-zА-Яа-яЁё]+\d*$', t) and re.match(r'^=\s*[—–-]?\d', nxt))
                or (re.match(r'^[A-Za-zА-Яа-яЁё]+\d*$', t) and nxt == '='
                    and re.match(r'^[—–-]?\d', tokens[i + 2] if i + 2 < len(tokens) else ''))):
            cut = i
            break
    note = ' '.join(tokens[cut:])
    pairs = [(lab, float(v.replace(',', '.')))
             for lab, v in re.findall(r'([A-Za-zА-Яа-яЁё]+\d*)?\s*=\s*(\d+(?:[.,]\d+)?)', note)]
    return tokens[:cut], note, pairs


JUNK = ".!'’\"|}{)(:;*[]"


def numeric_tail(tokens):
    out = []
    for t in reversed(tokens):
        t = t.strip(JUNK) or t
        v = to_number(t)
        if v is None:
            break
        out.append((t, v))
    return out[::-1]


def parse_lines(lines):
    """Candidate rows: {'n', 'raw', 'tail': [(token, value)], 'note', 'notes'}."""
    rows = []
    for line in lines:
        m = ROW.match(line)
        if not m:
            continue
        n = float(m.group(1).replace(',', '.'))
        toks = [t for t in m.group(2).split() if t.strip(JUNK + '[]')]      # drop stray column rules: | [ ]
        head, note, pairs = split_note(toks)
        seg = next((t for t in head[:3] if SEG.match(t)), None)
        rows.append({'n': int(n) if n.is_integer() else n, 'raw': line.strip(), 'seg': seg, 'head': head,
                     'tail': numeric_tail(head), 'note': note, 'notes': pairs})
    return rows


def width(rows):
    """Numeric columns in this table: the commoner of 8 and 7 among full-looking rows."""
    n8 = sum(1 for r in rows if len(r['tail']) >= 8)
    n7 = sum(1 for r in rows if len(r['tail']) == 7)
    return 8 if n8 >= n7 else 7


def holds(cells, w):
    return all(abs(cells[a] - sum(cells[x] for x in bs)) <= TOL for a, bs in IDENTITIES[w])


def variants(token):
    """Plausible true values for one misread numeric token (excluding the read value)."""
    t = token.strip().rstrip('.')
    out = set()
    digits = t.replace(',', '').replace('.', '')
    if not digits.isdigit():
        return out
    if ',' not in t and '.' not in t and len(digits) >= 2:          # dropped decimal comma
        for k in (1, 2):
            if len(digits) > k:
                out.add(float(digits[:-k] + '.' + digits[-k:]))
    if ',' in t or '.' in t:
        whole, frac = re.split('[.,]', t)
        if len(frac) >= 2:                                           # merged footnote digit: 76,21 -> 76,2
            out.add(float(whole + '.' + frac[:-1]))
    for i, ch in enumerate(t):                                       # single glyph confusions
        for rep in CONFUSE.get(ch, ''):
            s = t[:i] + rep + t[i + 1:]
            v = to_number(s)
            if v is not None:
                out.add(v)
    read = to_number(t)
    out.discard(read)
    return out


def aligned(tail, w):
    """Readings of a short tail with zero allowances printed blank: every way to place
    the tokens (in order) into the columns with the gaps on BLANKABLE columns, that
    satisfies the identities. Leading tokens may be formula debris and are dropped."""
    from itertools import combinations
    cols = COLUMNS[w]
    found = []
    for k in range(min(len(tail), w), 1, -1):
        toks = tail[-k:]
        for blanks in combinations(range(w - 1), w - k):     # draft (last column) is always printed
            if w - k > MAX_BLANKS or any(cols[i] not in BLANKABLE for i in blanks):
                continue
            it = iter(v for _, v in toks)
            cells = {c: (0.0 if i in blanks else next(it)) for i, c in enumerate(cols)}
            if holds(cells, w):
                found.append(cells)
        if found:
            break
    return found


def resolve(row, w):
    """Map a parsed row to cells and a status: ok / repaired / aligned / draft-only / partial / invalid."""
    tail = row['tail']
    cols = COLUMNS[w]
    row['candidates'] = []          # identity-consistent readings, kept when the row stays unresolved
    if len(tail) == 1:
        return {'draft': tail[0][1]}, 'draft-only', None
    if len(tail) < w:
        found = aligned(tail, w)
        row['candidates'] = found
        drafts = {round(c['draft'], 3) for c in found}
        if found and len(drafts) == 1 and len({tuple(sorted(c.items())) for c in found}) == 1:
            return found[0], 'aligned', 'blank allowance cells read as 0'
        return {'draft': tail[-1][1]} if tail else {}, 'partial', (f'{len(found)} alignments' if found else None)
    toks = tail[-w:]
    cells = {c: v for c, (_, v) in zip(cols, toks)}
    if holds(cells, w):
        return cells, 'ok', None
    found = aligned(tail[-(w - 1):], w)                               # one cell printed blank, debris on the left
    row['candidates'] = list(found)
    if len(found) == 1:
        return found[0], 'aligned', 'blank allowance cell read as 0' 
    fixes = []
    for c, (tok, _) in zip(cols, toks):
        for v in variants(tok):
            trial = dict(cells, **{c: v})
            if holds(trial, w):
                fixes.append((c, tok, v, trial))
    if len(fixes) == 1 and not found:
        c, tok, v, trial = fixes[0]
        return trial, 'repaired', f'{c}: read {tok!r}, identities give {v}'
    row['candidates'] += [f[3] for f in fixes]
    return cells, 'invalid', f'{len(fixes)} candidate repairs' if fixes else 'no single-cell repair'


def k81(rows):
    """Row 81 coefficient (|131–132| = к81·(ШОР − ШП − 4)), as the table states it.

    Returns (value, how) or (None, reason). Read from row 81's note (к81 = …); or,
    when the table has no row 81 and row 82 starts at 131 instead of 132, point
    132 coincides with 131: к81 = 0.
    """
    by_n = {}
    for r in rows:
        by_n.setdefault(r['n'], r)
    r81 = by_n.get(81)
    if r81 is not None:
        vals = [v for _, v in r81['notes']]
        if len(vals) == 1:
            return vals[0], 'row 81 note'
        return None, f'row 81 present but its note gives {vals}'
    r82, r80 = by_n.get(82), by_n.get(80)
    if r80 is not None and r82 is not None and r82['seg'] and re.match(r'^131', r82['seg']):
        return 0.0, 'no row 81; row 82 starts at 131'
    return None, 'row 81 not read and row 82 does not settle it'


def read_table(lines, formulas=True):
    """OCR lines of one table → rows with cells, status and notes. With formulas=True,
    constructive rows are then checked against the rules the table prints
    (ccat.sources.emko_formula)."""
    rows = parse_lines(lines)
    w = width(rows)
    for r in rows:
        r['cells'], r['status'], r['repair'] = resolve(r, w)
    if formulas:
        from . import emko_formula, emko_tsolve
        emko_formula.verify(rows)
        if emko_tsolve.verify(rows, w):
            emko_formula.verify(rows)                     # newly settled rows can feed segment rules
    return rows, w


def read_tables(tables_lines):
    """Several tables at once: {key: lines} -> {key: (rows, w)}. Tables built for the
    same typical figure (header 'РАЗМЕР …') pool their verified rows to solve the
    figure's body measurements (ccat.sources.emko_tsolve)."""
    from . import emko_formula, emko_tsolve
    out = {k: read_table(v, formulas=False) for k, v in tables_lines.items()}
    for rows, _ in out.values():
        emko_formula.verify(rows)
    groups = {}
    for k, v in tables_lines.items():
        groups.setdefault(emko_tsolve.figure(v) or ('alone', k), []).append(k)
    for keys in groups.values():
        if emko_tsolve.verify_pooled([out[k] for k in keys]):
            for k in keys:
                emko_formula.verify(out[k][0])
    return out
