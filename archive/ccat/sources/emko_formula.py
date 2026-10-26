"""Verify ЕМКО constructive rows by evaluating the formula the table prints.

Constructive rows print one value, so their own columns can't check it. Many of
them are a printed rule over other rows' values, and those can be evaluated:

  scaled segment   0,62/33—35/ + a17   ->  c·|A–B| ± a, with |A–B| the verified
                                           row whose segment is A–B and a from the note
  armhole/cap      63.2 ПОР = Н·ДП, 63.3 ДОР = (1+Н)·ДП, Н from row 63.2's note:
                   both relations holding confirms ДП, ПОР and ДОР together

A row is accepted ('formula') only when exactly one reading of its printed value
(as read, or one plausible OCR misreading) matches the evaluated rule within
TOL. Rules over body measurements (Т##) are not evaluated here.
"""
import re

from .emko_ocr import variants

TOL = 0.03          # values are printed rounded to 0.05; products round once more
VERIFIED = ('ok', 'repaired', 'aligned', 'formula')
SCALED = re.compile(r"(\d+[,.]\d+)\s*/\s*(\d+)['’\"]*\s*[—–-]+\s*(\d+)['’\"]*\s*/(.{0,4})")


def _seg_key(a, b):
    return f'{a}-{b}'


def _seg_regex(a, b):
    """3 and 8 are the commonest OCR swap in point numbers: match either."""
    fuzzy = lambda s: ''.join('[38]' if ch in '38' else re.escape(ch) for ch in s)
    return re.compile(rf"^R?{fuzzy(a)}['’\"]*[—–-]+{fuzzy(b)}['’\"]*$")


def _note_values(row):
    """Candidate values of the note's coefficient (a17 = 1,0 / =—1,0 / =10 ...)."""
    out = set()
    for m in re.finditer(r'=\s*([—–-])?\s*(\d+(?:[.,]\d+)?)', row['note'] or ''):
        sign = -1.0 if m.group(1) else 1.0
        tok = m.group(2)
        v = float(tok.replace(',', '.'))
        out.add(sign * v)
        out.update(sign * x for x in variants(tok))
    return out


def _readings(row):
    """The printed value as read, and its plausible misreadings (read value first)."""
    tail = row['tail']
    if not tail:
        return []
    tok, v = tail[-1]
    two_dp = lambda x: abs(round(x, 2) - x) < 1e-9        # the book prints at most 2 decimals
    return [x for x in [v] + sorted(variants(tok)) if two_dp(x)]


def _match(readings, targets):
    """Accept iff exactly one reading matches some target; prefer the value as read."""
    hits = [r for r in readings if any(abs(r - t) <= TOL for t in targets)]
    if not hits:
        return None
    if hits[0] == readings[0]:
        return readings[0]
    return hits[0] if len(hits) == 1 else None


def verify(rows):
    """Upgrade constructive rows whose printed rule checks out. Mutates rows; returns count."""
    by_n = {}
    for r in rows:
        by_n.setdefault(r['n'], r)
    total = 0
    changed = True
    while changed:                                   # a row verified by formula can feed another
        changed = False
        known = {n: r['cells']['draft'] for n, r in by_n.items()
                 if r['status'] in VERIFIED and 'draft' in r['cells']}
        segs = [(n, r['seg']) for n, r in by_n.items() if r['seg'] and n in known]
        for n, r in by_n.items():
            if r['status'] in VERIFIED or not r['tail']:
                continue
            m = SCALED.search(r['raw'])
            if not m:
                continue
            c = float(m.group(1).replace(',', '.'))
            rx = _seg_regex(m.group(2), m.group(3))
            src = [k for k, s in segs if rx.match(s)]
            if len(src) != 1:
                continue
            base = c * known[src[0]]
            op = m.group(4)
            notes = _note_values(r)
            if '+' in op:
                targets = {base + a for a in notes}
            elif re.search('[—–-]', op):
                targets = {base - a for a in notes}
            elif notes:                              # an a-term whose sign OCR lost: either sign
                targets = {base + a for a in notes} | {base - a for a in notes}
            else:
                targets = {base}
            if not targets:
                continue
            got = _match(_readings(r), targets)
            if got is not None:
                r['cells'] = {'draft': got}
                r['status'] = 'formula'
                r['repair'] = f'{c:g}·|{m.group(2)}–{m.group(3)}| (row {src[0]})' + (
                    f' {op.strip()[:1]} note' if targets != {base} else '')
                changed = True
                total += 1
    total += _verify_armhole(by_n)
    return total


def _verify_armhole(by_n):
    r1, r2, r3 = by_n.get(63.1), by_n.get(63.2), by_n.get(63.3)
    if not (r1 and r2 and r3 and r1['tail'] and r2['tail'] and r3['tail']):
        return 0
    hs = _note_values(r2)
    for dp in _readings(r1):
        for h in hs:
            p2 = _match(_readings(r2), {h * dp})
            p3 = _match(_readings(r3), {(1 + h) * dp})
            if p2 is not None and p3 is not None:
                n = 0
                for r, v, how in ((r1, dp, 'ДП: consistent with ПОР and ДОР'), (r2, p2, f'ПОР = {h:g}·ДП'),
                                  (r3, p3, f'ДОР = (1 + {h:g})·ДП')):
                    if r['status'] not in VERIFIED:
                        r['cells'], r['status'], r['repair'] = {'draft': v}, 'formula', how
                        n += 1
                return n
    return 0
