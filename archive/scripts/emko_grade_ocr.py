"""Read ЕМКО graded tables (Table x.4: one column per base typical figure) from OCR text, validate
every row, and write a graded table + rules file per garment. No reading by hand.

Each row is accepted only if:
  * its 176-100-88 column equals the garment's validated Table x.2 draft value (when x.2 has the row);
  * every value is on the 0.05 grid the book prints to;
  * the eight values grade linearly in the figures' chest and waist (value ≈ a + b·chest + c·waist),
    every residual within FIT_TOL. The book's grading is linear in the typical figures' measurements
    and rounds to 0.05, so a misread digit shows up as one large residual. It is repaired only when
    exactly one plausible misreading of that one cell (emko_ocr.variants) makes the row fit;
  * row 9 = rows 6 + 7 + 8 in every column, where all four rows were read.
Rows that fail are held (reported, not written); anything the recipes then lack stops their builds.

usage: python scripts/emko_grade_ocr.py [table ...]      (default: all of 2.4–6.4)
writes data/emko/<garment>_table_graded.yaml and data/emko/<garment>_graded.yaml
"""
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from ccat.sources import emko, emko_ocr      # noqa: E402

OCR = ROOT / 'data' / 'emko' / 'ocr'
OUT = ROOT / 'data' / 'emko'
FIGURES = ['176-92-74', '176-100-82', '176-100-88', '176-100-94', '176-100-100', '176-112-100', '176-112-106',
           '176-112-112']
CHEST = [92, 100, 100, 100, 100, 112, 112, 112]
WAIST = [74, 82, 88, 94, 100, 100, 106, 112]
BASE = FIGURES.index('176-100-88')
FIT_TOL = 0.1          # cm: the book rounds to 0.05, and the typical figures grade near-linearly
BASE_TOL = 0.026       # cm: the x.4 base column must reproduce x.2 to its printed step
TABLES = {'2.4': ((36, 40), 'coat_demi'), '3.4': ((53, 57), 'coat_winter'), '4.4': ((76, 80), 'summer_jacket'),
          '5.4': ((93, 97), 'jacket_insulated'), '6.4': ((108, 110), 'waistcoat')}


def lines(pages):
    out = []
    for p in range(pages[0], pages[1] + 1):
        out += [l for l in (OCR / f'p-{p:03d}.txt').read_text(encoding='utf-8').splitlines() if not l.startswith('# page')]
    return out


def residuals(vals, use=None):
    """Least-squares fit vals ≈ a + b·chest + c·waist over the columns `use` (default: every column
    with a value); returns every column's residual, None where there is no value (pure Python, 3×3
    normal eqns)."""
    use = [i for i in range(8) if vals[i] is not None] if use is None else use
    X = [(1.0, CHEST[i], WAIST[i]) for i in use]
    A = [[sum(x[i] * x[j] for x in X) for j in range(3)] for i in range(3)]
    y = [sum(x[i] * vals[k] for x, k in zip(X, use)) for i in range(3)]
    # Gaussian elimination
    M = [row[:] + [yi] for row, yi in zip(A, y)]
    for i in range(3):
        p = max(range(i, 3), key=lambda r: abs(M[r][i]))
        M[i], M[p] = M[p], M[i]
        for r in range(3):
            if r != i:
                f = M[r][i] / M[i][i]
                M[r] = [a - f * b for a, b in zip(M[r], M[i])]
    coef = [M[i][3] / M[i][i] for i in range(3)]
    return [None if v is None else v - (coef[0] + coef[1] * c + coef[2] * w) for v, c, w in zip(vals, CHEST, WAIST)]


def on_grid(vals):
    """The book prints every draft value to 0.05 (every Table x.2 value and the hand-checked Table 1.4
    hold to it), so a value off that grid is a misread, however well it fits."""
    return all(abs(v * 20 - round(v * 20)) < 1e-6 for v in vals if v is not None)


def fits(vals, base):
    """On the grid, base column = Table x.2, and linear in chest/waist within FIT_TOL. A 0 may stand
    where the fit of the other columns goes to or below 0: the book prints a quantity that can't be
    negative (a dart, a suppression) as 0 rather than the formula's small negative."""
    if not on_grid(vals) or vals[BASE] is None:
        return False
    if base is not None and abs(vals[BASE] - base) > BASE_TOL:
        return False
    have = [i for i in range(8) if vals[i] is not None]
    if max(abs(residuals(vals, have)[i]) for i in have) <= FIT_TOL:
        return True
    rest = [i for i in have if vals[i] != 0]
    if len(rest) == len(have) or len(rest) < 5:
        return False
    r = residuals(vals, rest)
    return (max(abs(r[i]) for i in rest) <= FIT_TOL
            and all(-r[i] <= FIT_TOL for i in have if vals[i] == 0))


# glyphs tesseract swaps in these pages (wider than emko_ocr.CONFUSE: a repair still has to be the
# unique minimal one that passes the base-column and linear-fit checks)
CONFUSE = {'3': '85', '8': '3650', '1': '74', '7': '12', '4': '1', '5': '68', '6': '58', '0': '86', '9': '20', '2': '79'}
MAX_REPAIRS = 2


def cell_variants(tok):
    """Plausible true values of one OCR cell, other than its reading."""
    t = tok.strip().rstrip('.')
    out = set(emko_ocr.variants(t))
    for i, ch in enumerate(t):
        for rep in CONFUSE.get(ch, ''):
            v = emko_ocr.to_number(t[:i] + rep + t[i + 1:])
            if v is not None:
                out.add(v)
    out.discard(emko_ocr.to_number(t))
    return sorted(out)


def comma_pass(toks):
    """Restore dropped decimal commas: a token with no separator, in a row whose other cells have
    one, is read /10 when that lands it within the row's range. → (values, notes)."""
    sep = [v for t, v in toks if ',' in t or '.' in t]
    if len(sep) < 4:
        return [v for _, v in toks], []
    lo, hi = min(sep), max(sep)
    vals, notes = [], []
    for i, (t, v) in enumerate(toks):
        if ',' not in t and '.' not in t and t.isdigit() and not (lo - 0.5 <= v <= hi + 0.5)                 and lo - 0.5 <= v / 10 <= hi + 0.5:
            vals.append(v / 10)
            notes.append(f'col {i} {t!r} → {v / 10:g} (decimal comma)')
        else:
            vals.append(v)
    return vals, notes


def by_chest(vals, base):
    """Angle rows (°) grade in steps by chest, not linearly: accept them only if equal wherever chest
    is equal, non-decreasing in chest, and the base column matches Table x.2 (when x.2 has the row)."""
    if not on_grid(vals) or (base is not None and abs(vals[BASE] - base) > BASE_TOL):
        return False
    step = {}
    for c, v in zip(CHEST, vals):
        if abs(step.setdefault(c, v) - v) > BASE_TOL:
            return False
    s = [step[c] for c in sorted(step)]
    return all(a <= b + BASE_TOL for a, b in zip(s, s[1:]))


def read_row(row, base):
    """→ (values, how) or (None, why)."""
    from itertools import combinations, product
    tail = row['tail']
    if len(tail) < 8:
        return None, f'{len(tail)} values read'
    toks = tail[-8:]
    vals, notes = comma_pass(toks)
    if '°' in row['raw']:                                  # angle row: step check; the only repair is a
        found = []                                         # '°' read as a trailing 9 or 2 (2,52 → 2.5)
        for k in range(MAX_REPAIRS + 1):
            for cols in combinations(range(8), k):
                if not all(toks[i][0][-1:] in '92' and emko_ocr.to_number(toks[i][0][:-1]) is not None
                           for i in cols):
                    continue
                trial = vals[:]
                for i in cols:
                    trial[i] = emko_ocr.to_number(toks[i][0][:-1])
                if by_chest(trial, base):
                    found.append((trial, notes + [f'col {i} {toks[i][0]!r} → {trial[i]:g} (° read as digit)'
                                                  for i in cols]))
            if found:
                break
        if len(found) != 1:
            return None, ('angle row not graded by chest' if not found else f'{len(found)} competing angle repairs')
        trial, fix = found[0]
        return trial, ('repaired ' + '; '.join(fix) if fix else 'ok') + ' (angle, graded by chest)'
    return unique_fit(vals, [cell_variants(t) for t, _ in toks], base, [t for t, _ in toks], notes)


def unique_fit(vals, alts, base, labels, notes=(), check=None, max_hold=1):
    """The one way to make `vals` pass fits() by replacing at most MAX_REPAIRS cells, each with one
    of its alternatives (alts[i]), the fewest replacements first. → (values, how) or (None, why)."""
    from itertools import combinations, product
    for k in range(MAX_REPAIRS + 1):
        found = []
        for cols in combinations(range(8), k):
            for vs in product(*(alts[i] for i in cols)):
                trial = vals[:]
                for i, v in zip(cols, vs):
                    trial[i] = v
                if None not in trial and trial not in (CHEST, WAIST) and (check or fits)(trial, base):
                    found.append((trial, [f'col {i} {labels[i]!r} → {v:g}' for i, v in zip(cols, vs)]))
        if len(found) == 1:
            trial, fix = found[0]
            how = '; '.join(list(notes) + fix)
            return trial, (f'repaired {how}' if how else 'ok')
        if len(found) > 1:
            return None, f'{len(found)} competing {k}-cell repairs'
    if check is None:                                     # cells off the row's trend however they are
        for h in range(1, max_hold + 1):                  # read (a misprint, or no reading fits): keep
            held = []                                     # the rest as read, hold those, fewest first
            for cols in combinations(range(8), h):
                keep = [i for i in range(8) if i not in cols]
                if None in [vals[i] for i in keep] or len(keep) < 5:
                    continue
                trial = [None if i in cols else vals[i] for i in range(8)]
                if BASE in cols:                          # an unread base cell: the fit must still
                    if base is None:                      # meet Table x.2 there
                        continue
                    ok = fits(trial[:BASE] + [base] + trial[BASE + 1:], base)
                else:
                    ok = fits(trial, base)
                if ok:
                    held.append((cols, trial))
            if len(held) == 1:
                cols, trial = held[0]
                how = '; '.join(list(notes) + [f'col {i} {labels[i]!r} held' for i in cols])
                return trial, f'cell held (off the row trend: misread or misprint): {how}'
            if len(held) > 1:
                return None, f'{len(held)} competing {h}-cell holds'
    return None, f'does not fit (≤{MAX_REPAIRS} cell repairs)'


LOOKALIKE = str.maketrans('OoSsgqQlIB', '0055999118')   # tesseract's usual letter-for-digit swaps


def reocr_forms(t, angle=False):
    """What one re-OCR reading may stand for: itself without stray edge marks, without a leading
    ruled line read as '1', and, when it has no separator, with a dropped decimal comma restored.
    A dash-only reading is an empty cell (0), as in emko_ocr.to_number; so is a lone 0/O/() (the
    unwhitelisted reads). In an angle row a trailing 9, 2 or 0 may be the ° sign."""
    import re
    t = t.replace(' ', '')
    if t and set(t) <= set('-'):                           # a dash-only cell is printed as 0
        return {0.0}
    if t in ('0', 'O', 'o', '()', '(', ')', '(0)', '0)', '(0'):
        return {0.0}
    t = t.translate(LOOKALIKE)                             # letters the unwhitelisted reads give for digits
    t = re.sub(r'[^0-9,.\-]', '', t)                       # °, other letters, ruled lines
    t = re.sub(r'[,.]+', ',', t.strip('-.,'))
    out = set()
    forms = [t] + ([t[1:]] if len(t) >= 3 and t[0] == '1' else [])
    if angle:
        forms += [f[:-1] for f in forms if len(f) >= 2 and f[-1] in '920']
    for f in forms:
        v = emko_ocr.to_number(f)
        if v is None:
            continue
        out.add(v)
        if ',' not in f and f.isdigit() and len(f) >= 2:
            out.update({v / 10, v / 100} if len(f) >= 3 else {v / 10})
    return out


def reocr_candidates(reads, ref, angle=False):
    """One cell's readings ({text: count}) → (value, [other values], rival). Each reading votes for
    its form nearest `ref` (the row's scale), so 166 and 16,6 count together near 16. `rival` is the
    runner-up when it has at least half the winner's votes (else None): then the vote can't tell."""
    import math
    votes, alts = {}, set()
    for t, n in reads.items():
        forms = reocr_forms(t, angle)
        alts |= forms
        if forms and ref:
            v = min(forms, key=lambda f: abs(math.log(max(f, 1e-3) / ref)))
            votes[v] = votes.get(v, 0) + n * (2 if any(c in t for c in ',.') else 1)   # a reading that
                                                                                     # kept its separator
                                                                                     # read the whole number
    ranked = sorted(votes, key=votes.get, reverse=True)
    top = ranked[0] if ranked else None
    rival = ranked[1] if len(ranked) > 1 and votes[ranked[1]] * 2 >= votes[top] else None
    return top, sorted(alts - {top}), rival


def row_scale(cells, base):
    """The row's scale: Table x.2's base value, else the median reading that kept its separator."""
    import statistics
    if base:
        return abs(base)
    sep = [emko_ocr.to_number(t.strip('-.,')) for c in cells for t in c if ',' in t.strip('-.,')]
    sep = [v for v in sep if v]
    return statistics.median(sep) if sep else None


def settle_rivals(vals, how, tops, rivals, base, check):
    """A cell kept as its vote's winner, whose close runner-up would fit the row just as well, is
    a coin toss (4,40 ×6 vs 445 ×8 for a printed 4,45): hold it. → (values, how) or (None, why)."""
    ok = check or fits
    out, held = list(vals), []
    for i, (v, t, r) in enumerate(zip(vals, tops, rivals)):
        if v is None or r is None or v != t:
            continue
        trial = out[:i] + [r] + out[i + 1:]
        if trial[BASE] is None and base is not None:
            trial[BASE] = base
        if trial[BASE] is not None and ok(trial, base):
            out[i] = None
            held.append(f'col {i} {v:g} or {r:g}')
    if not held:
        return vals, how
    if sum(v is None for v in out) > 3 or (out[BASE] is None and base is None):
        return None, f'too many cells undecided ({"; ".join(held)})'
    return out, f'{how}; held, the vote cannot tell: {"; ".join(held)}'


ANGLE_ROWS = (34, 87)      # β rows: printed in degrees, graded in steps by chest (by_chest)


def read_reocr(table, n, base):
    """A held or missing row from scripts/emko_ocr_rows.py's cache: every band it found for the row
    is tried with unique_fit; accepted only if exactly one value set passes. → (values, how) or (None, why)."""
    path = OCR / 'rows' / f'{table}.yaml'
    cache = yaml.safe_load(path.read_text(encoding='utf-8')) if path.exists() else None
    bands = (cache or {}).get(n) or (cache or {}).get(str(n)) or []
    if not bands:
        return None, 'no re-OCR'
    passed, conflicts, why = {}, {}, []
    for b in bands:
        ref = row_scale(b['cells'], base)
        tops, alts, rivals = zip(*(reocr_candidates(c, ref, n in ANGLE_ROWS) for c in b['cells']))
        check = by_chest if n in ANGLE_ROWS else None
        vals, how = unique_fit(list(tops), list(alts), base, [str(t) for t in tops], check=check, max_hold=3)
        if vals is not None:
            vals, how = settle_rivals(vals, how, tops, rivals, base, check)
        if vals is None and base is not None and b['how'] == 'line':     # x.4 may disagree with x.2
            alone, how2 = unique_fit(list(tops), list(alts), None, [str(t) for t in tops], check=check, max_hold=1)
            if alone is not None and alone[BASE] is not None:
                conflicts[tuple(alone)] = (f"re-OCR p.{b['page']} y{b['band'][0]} ({b['how']}): {how2}; accepted as "
                                           f"read: its 176-100-88 value {alone[BASE]:g} conflicts with Table "
                                           f"{table[0]}.2 ({base:g})")
        if vals is None:
            why.append(f"p.{b['page']} y{b['band'][0]}: {how}")
        else:
            passed[tuple(None if v is None else round(v, 3) for v in vals)] = f"re-OCR p.{b['page']} y{b['band'][0]} ({b['how']}): {how}"
    if not passed and len(conflicts) == 1:      # only when no band of the row agrees with Table x.2
        passed = conflicts
    if len(passed) == 1:
        (vals, how), = passed.items()
        return list(vals), how
    return None, (f're-OCR: {len(passed)} bands pass with different values' if passed
                  else 're-OCR: ' + '; '.join(why[:3]))


NUM = __import__('re').compile(r'^\d{1,3}(?:[.,]\d{1,2})?$')


def parse(line):
    """One OCR line → {'n' (None if the row number didn't read), 'raw', 'tail': [(token, value)]}.
    Cleans what cut the old tails short: trailing commas, degree signs, dash-only tokens, and notes
    whose '=' stands apart from their label (а =— 4,0)."""
    toks = [x for x in line.split() if x.strip(emko_ocr.JUNK + '[]|')]
    n = None
    if toks and NUM.match(toks[0]):
        n = float(toks[0].replace(',', '.'))
        n = int(n) if n.is_integer() else n
        toks = toks[1:]
    for i, x in enumerate(toks):                            # the note starts at the first '='
        if '=' in x:
            cut = i - 1 if i and __import__('re').match(r'^[A-Za-zА-Яа-яЁё]{1,6}\d*$', toks[i - 1]) else i
            toks = toks[:cut]
            break
    tail, skipped = [], 0
    for x in reversed(toks):
        c = x.strip(emko_ocr.JUNK + '°,|')
        if c and set(c) <= set('—–-_'):                    # a dash-only cell mark: skip, not a value
            continue
        v = emko_ocr.to_number(c)
        if v is None:
            if not tail and skipped < 3:                    # trailing junk after the values (ie 0+)
                skipped += 1
                continue
            break
        tail.append((c, v))
    return {'n': n, 'raw': line.strip(), 'tail': tail[::-1]}


def read_table(table):
    pages, name = TABLES[table]
    base_doc = emko.load(OUT / f'{name}_176-100-88.yaml')
    base_rows = {emko.row_name(k): float(v) for k, v in base_doc['draft'].items()}
    rows, log = {}, []
    order = sorted(base_rows, key=lambda k: float(k[1:].replace('_', '.')))
    prev = 0.0             # the last row Table x.2 confirmed: only those move the sequence on
    unverified = []        # rows accepted on their read number alone, in reading order
    def key(n):
        return emko.row_name(n)

    for r in map(parse, lines(pages)):
        tail_vals = [v for _, v in r['tail']]
        if ('Отрезок' in r['raw'] or 'Формула' in r['raw'] or tail_vals[-6:] in (CHEST[-6:], WAIST[-6:])):
            continue                                        # the column header (the figures' chest/waist)
        if len(r['tail']) < 8:
            if r['n'] is not None and len(r['tail']) >= 4:
                log.append(f'held row {r["n"]}: {len(r["tail"])} values read  [{r["raw"][:90]}]')
            continue
        base_val = r['tail'][-8 + BASE][1]
        n = r['n']
        # the number as read, if it is a plausible next row; only such a row may conflict with Table x.2
        seq_ok = n is not None and prev < float(n) <= prev + 12
        # a read number is trusted when Table x.2 agrees on its base value, or when x.2 lacks the row
        # and it is a plausible next row; otherwise recover it by sequence and base value (И for 11, 97 for 27)
        trusted = n is not None and float(n) > prev and (
            (key(n) in base_rows and abs(base_rows[key(n)] - base_val) <= BASE_TOL)
            or (key(n) not in base_rows and float(n) <= prev + 12))
        if not trusted:
            cand = [k for k in order if float(k[1:].replace('_', '.')) > prev
                    and abs(base_rows[k] - base_val) <= BASE_TOL]
            if cand:
                m = float(cand[0][1:].replace('_', '.'))
                m = int(m) if m.is_integer() else m
                if m != n:
                    log.append(f'row {m}: number read as {r["raw"].split()[0]!r}, recovered by sequence and base value')
                n = m
            elif n is None or float(n) <= prev:
                continue
        if n in rows:
            continue
        x2 = base_rows.get(emko.row_name(n))
        vals, how = read_row(r, x2)
        if vals is None and x2 is not None and seq_ok and n == r['n']:   # the x.4 table may disagree with x.2 itself
            alone, how2 = read_row(r, None)
            if alone is not None and how2 == 'ok':
                vals, how = alone, f'accepted as read; its 176-100-88 value {alone[BASE]:g} conflicts with Table {table[0]}.2 ({x2:g})'
        if vals is None:
            if len(r['tail']) >= 4:
                log.append(f'held row {n}: {how}  [{r["raw"][:90]}]')
            continue
        rows[n] = vals
        if x2 is not None and abs(vals[BASE] - x2) <= BASE_TOL:
            prev = float(n)
            # a confirmed row numbered below an unconfirmed one read before it: that one was misnumbered
            for u in [u for u in unverified if float(u) > float(n)]:
                rows.pop(u)
                unverified.remove(u)
                log.append(f'held row {u}: number out of sequence (Table x.2 has no such row; row {n} follows it)')
        else:
            unverified.append(n)
        if how != 'ok':
            log.append(f'row {n}: {how}')
    cache = OCR / 'rows' / f'{table}.yaml'
    for n in (yaml.safe_load(cache.read_text(encoding='utf-8')) or {}) if cache.exists() else ():
        if n in rows and None not in rows[n]:
            continue
        vals, how = read_reocr(table, n, base_rows.get(emko.row_name(n)))
        partial = n in rows                               # page OCR kept it with a cell held
        if vals is None or (partial and None in vals):
            if not partial:
                log = [l for l in log if not l.startswith(f'held row {n}:')]
                log.append(f'held row {n}: {how}')
            continue
        log = [l for l in log if not l.startswith((f'held row {n}:', f'row {n}: cell held'))]
        rows[n] = vals
        log.append(f'row {n}: {how}')
    if all(k in rows for k in (6, 7, 8, 9)):              # row 9 = 31–37 = 6 + 7 + 8, per column
        bad = [i for i in range(8) if None not in (rows[9][i], rows[6][i], rows[7][i], rows[8][i])
               and abs(rows[9][i] - rows[6][i] - rows[7][i] - rows[8][i]) > emko_ocr.TOL]
        if bad:
            log.append(f'held rows 6–9: row 9 ≠ 6 + 7 + 8 in columns {bad}')
            for k in (6, 7, 8, 9):
                rows.pop(k)
    return name, rows, log, base_doc


def write(table, name, rows, log, base_doc):
    head = [f'# ЕМКО СЭВ т.3 Table {table}: {base_doc["name"].rsplit(" ", 1)[0]}, base typical figures (draft values, cm).',
            '# Generated by scripts/emko_grade_ocr.py from data/emko/ocr/ (no reading by hand). Every row: base column',
            f'# = Table {table[0]}.2, on the 0.05 grid, linear in chest/waist within {FIT_TOL} cm, row 9 = 6 + 7 + 8.']
    head += [f'#   {l}' for l in log]
    body = {'figures': FIGURES, 'rows': {k: rows[k] for k in sorted(rows, key=float)}}
    text = '\n'.join(head) + '\n' + yaml.safe_dump(body, allow_unicode=True, sort_keys=False, default_flow_style=None, width=120)
    (OUT / f'{name}_table_graded.yaml').write_text(text, encoding='utf-8', newline='\n')
    rules = {'table': f'data/emko/{name}_table_graded.yaml'}
    derived = {}
    if 91 not in rows and 90 in rows:                     # row 91 = 0,5|95–931| (Table x.2's formula)
        derived['r91'] = '0.5 * r90'
    draft = {emko.row_name(k): float(v) for k, v in base_doc['draft'].items()}
    if 61 not in rows and 62 in rows and draft.get('r61') == draft.get('r62'):
        derived['r61'] = 'r62'                            # straight silhouette: row 61 printed "К", no
                                                           # waist shaping; the base file reads it as 62
    if derived:
        rules['derived'] = derived
    if base_doc.get('coefficients'):
        rules['coefficients'] = dict(base_doc['coefficients'])
    (OUT / f'{name}_graded.yaml').write_text(
        f'# Graded {base_doc["name"].rsplit(" ", 1)[0]}: Table {table} + what it does not print. Generated by '
        f'scripts/emko_grade_ocr.py.\n' + yaml.safe_dump(rules, allow_unicode=True, sort_keys=False), encoding='utf-8', newline='\n')


def main(tables):
    for t in tables or TABLES:
        name, rows, log, base_doc = read_table(t)
        write(t, name, rows, log, base_doc)
        held = sum(1 for l in log if l.startswith('held'))
        print(f'Table {t} ({name}): {len(rows)} rows, {sum(1 for l in log if "repaired" in l)} repaired, {held} held')
        for l in log:
            print('  ', l)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main(sys.argv[1:])
