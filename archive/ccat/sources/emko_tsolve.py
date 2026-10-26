"""Verify ЕМКО rows written in body measurements (Т##) by solving the figure.

Every Table x.2 row's base column is its formula over the typical figure's body
measurements, e.g. row 1: Т40+(Т7−Т12). The verified rows (identities / printed
rules) give enough equations to solve the Т values by least squares. The pilot
did this with numpy in emko_check.py; this is the pure-Python pipeline version.
With the Т values known, an unresolved row's formula predicts its base value,
which picks out the one identity-consistent reading whose base matches.

Fail-closed points:
- formulas come from OCR text through a lenient normaliser, so a misparsed one is
  likely; that's why the solve drops any training row whose residual exceeds TOL
  (repeatedly, worst first) and the prediction must match a candidate within TOL;
- a prediction is used only when the row's formula lies in the span of the
  training rows (T7 and T12, for instance, are only ever determined as T7−T12).
"""
import re

from ..expr import ExprError, evaluate

TOL = 0.06
VERIFIED = ('ok', 'repaired', 'aligned', 'formula')
TNAME = re.compile(r'^T\d{1,2}$')


def normalise(text):
    """OCR'd formula text -> arithmetic over T## names without the П term, or None."""
    t = text
    if any(ch in t for ch in '/|°'):                 # segment lengths or angles: not a Т formula
        return None
    t = t.replace('—', '-').replace('–', '-').replace(',', '.')
    t = re.sub(r'\s*[+\-4]\s*(?:П|11|I1|Il|I|H|И|1)\s*\.?$', '', t)        # trailing +П (and its misreads)
    t = re.sub(r'\+\s*П', '', t)
    t = re.sub(r'(?<![\d.])[ТTт7]\s?(\d{1,2})(?![\d.])', r'T\1', t)       # Т40 / T 15 / 740 -> T40
    t = re.sub(r'(\d|\))\s*(?=[T(])', r'\1*', t)                          # implicit products
    t = re.sub(r'\s+', '', t)
    if not t or not re.fullmatch(r'[T\d.+\-*()]+', t) or 'T' not in t:
        return None
    return t


def linear(expr):
    """{name: coefficient}, constant for a linear formula; None if not linear / not parseable."""
    names = sorted(set(re.findall(r'T\d{1,2}', expr)))
    try:
        at = lambda env: evaluate(expr, lambda n: env[n])
        zero = {n: 0.0 for n in names}
        c0 = at(zero)
        coef = {n: at(dict(zero, **{n: 1.0})) - c0 for n in names}
        probe = {n: 1.0 + i for i, n in enumerate(names)}
        if abs(at(probe) - (c0 + sum(coef[n] * probe[n] for n in names))) > 1e-9:
            return None
    except (ExprError, KeyError, ZeroDivisionError):
        return None
    return {n: c for n, c in coef.items() if abs(c) > 1e-12}, c0


def _rank(rows, eps=1e-9):
    m = [list(r) for r in rows]
    rank, col, ncols = 0, 0, len(m[0]) if m else 0
    while rank < len(m) and col < ncols:
        piv = max(range(rank, len(m)), key=lambda i: abs(m[i][col]))
        if abs(m[piv][col]) < eps:
            col += 1
            continue
        m[rank], m[piv] = m[piv], m[rank]
        for i in range(len(m)):
            if i != rank:
                f = m[i][col] / m[rank][col]
                m[i] = [a - f * b for a, b in zip(m[i], m[rank])]
        rank += 1
        col += 1
    return rank


def _lstsq(A, b):
    """A least-squares solution via the normal equations (free directions set to 0)."""
    n = len(A[0])
    M = [[sum(A[k][i] * A[k][j] for k in range(len(A))) for j in range(n)] +
         [sum(A[k][i] * b[k] for k in range(len(A)))] for i in range(n)]
    x, pivots, row = [0.0] * n, [], 0
    for col in range(n):
        piv = max(range(row, n), key=lambda i: abs(M[i][col]), default=None)
        if piv is None or abs(M[piv][col]) < 1e-9:
            continue
        M[row], M[piv] = M[piv], M[row]
        for i in range(n):
            if i != row:
                f = M[i][col] / M[row][col]
                M[i] = [a - f * c for a, c in zip(M[i], M[row])]
        pivots.append((row, col))
        row += 1
    for r, c in pivots:
        x[c] = M[r][n] / M[r][c]
    return x


def formula_of(row, w):
    """Formula text: tokens between the segment and the numeric columns."""
    toks = row.get('head') or []
    start = next((i + 1 for i, t in enumerate(toks[:3]) if t == row['seg']), 0)
    end = len(toks) - min(len(row['tail']), w)
    return ' '.join(toks[start:end])


def solve(rows, w):
    """Fit the Т values on verified rows. Returns (names, A, b, x) or None.
    rows may pool several tables for the same typical figure: pass (row, w) pairs
    via solve_pooled instead."""
    return solve_pooled([(r, w) for r in rows])


def solve_pooled(pairs):
    train = []
    for r, w in pairs:
        if r['status'] not in VERIFIED or 'base' not in r['cells']:
            continue
        expr = normalise(formula_of(r, w))
        lin = expr and linear(expr)
        if lin and lin[0]:
            train.append((r, lin))
    while len(train) >= 3:
        names = sorted({n for _, (c, _) in train for n in c})
        A = [[c.get(n, 0.0) for n in names] for _, (c, _) in train]
        b = [r['cells']['base'] - c0 for r, (_, c0) in train]
        x = _lstsq(A, b)
        res = [abs(sum(a * xi for a, xi in zip(Ar, x)) - bi) for Ar, bi in zip(A, b)]
        worst = max(range(len(res)), key=res.__getitem__)
        if res[worst] <= TOL:
            return names, A, b, x
        train.pop(worst)                                 # misread formula or base: leave it out
    return None


def predict(fit, lin):
    """Predicted base for a formula, or None unless it is determined redundantly:
    with any single training row left out it must stay determined and move ≤ TOL."""
    names, A, b, x = fit
    if set(lin[0]) - set(names):
        return None
    coef = [lin[0].get(n, 0.0) for n in names]
    if _rank(A + [coef]) != _rank(A):
        return None
    pred = lin[1] + sum(c * xi for c, xi in zip(coef, x))
    for i in range(len(A)):
        Ai, bi = A[:i] + A[i + 1:], b[:i] + b[i + 1:]
        if not Ai or _rank(Ai + [coef]) != _rank(Ai):
            return None                                   # rests on one row only
        xi = _lstsq(Ai, bi)
        if abs(lin[1] + sum(c * v for c, v in zip(coef, xi)) - pred) > TOL:
            return None
    return pred


def _derive_one(cells, w, free):
    """Fill cell `free` from the first identity that involves it; None if none does."""
    from .emko_ocr import IDENTITIES
    for lhs, rhs in IDENTITIES[w]:
        if lhs == free and free not in rhs:
            return sum(cells[x] for x in rhs)
        if free in rhs and lhs != free:
            return cells[lhs] - sum(cells[x] for x in rhs if x != free)
    return None


def anchored(row, w, base):
    """Readings of the row's tail with the base cell supplied by the prediction.

    First: tokens placed into the columns (blank allowances as 0) so the identities
    hold. Failing that, with the full row read: one non-draft cell may be misread
    beyond the glyph rules; it is re-derived from the identities, and the reading
    counts only if every identity then holds with the printed draft."""
    from itertools import combinations
    from .emko_ocr import BLANKABLE, COLUMNS, holds
    cols = COLUMNS[w]
    tail = [v for _, v in row['tail']]
    found = []
    for k in range(min(len(tail), w - 1), 1, -1):
        toks = tail[-k:]
        for blanks in combinations(range(1, w - 1), w - 1 - k):       # cols 1..w-2 may be blank
            if any(cols[i] not in BLANKABLE for i in blanks):
                continue
            it = iter(toks)
            cells = {c: (base if i == 0 else 0.0 if i in blanks else next(it)) for i, c in enumerate(cols)}
            if holds(cells, w):
                found.append(cells)
        if found:
            return found
    if len(tail) >= w - 1:
        read = dict(zip(cols[1:], tail[-(w - 1):]), base=base)
        for free in cols[1:-1]:
            trial = dict(read)
            v = _derive_one(trial, w, free)
            if v is None:
                continue
            trial[free] = v
            if holds(trial, w):
                found.append(trial)
    return found


def verify(rows, w):
    """Single-table form of verify_pooled."""
    return verify_pooled([(rows, w)])


SIZE = re.compile(r'РАЗМЕР\s*(\d{3})\s*[—–-]\s*(\d{2,3})\s*[—–-]\s*(\d{2,3})')


def figure(lines):
    """Typical figure a table is built for, from its header ('РАЗМЕР 176—100—88'), or None."""
    for line in lines:
        m = SIZE.search(line)
        if m:
            return '-'.join(m.groups())
    return None


def verify_pooled(tables):
    """tables: [(rows, w)] built for the same typical figure, so their base columns
    share one set of body measurements. Settle unresolved rows whose Т formula
    predicts their base (redundantly) when exactly one draft value fits."""
    pairs = [(r, w) for rows, w in tables for r in rows]
    fit = solve_pooled(pairs)
    if fit is None:
        return 0
    n = 0
    for r, w in pairs:
        if r['status'] in VERIFIED or not r['tail']:
            continue
        expr = normalise(formula_of(r, w))
        lin = expr and linear(expr)
        if not lin or not lin[0]:
            continue
        pred = predict(fit, lin)
        if pred is None:
            continue
        hits = [c for c in (r.get('candidates') or []) if abs(c['base'] - pred) <= TOL] or anchored(r, w, pred)
        drafts = {round(c['draft'], 3) for c in hits}
        if hits and len(drafts) == 1:
            r['cells'], r['status'] = hits[0], 'formula'
            r['repair'] = f'Т formula predicts base {pred:.2f} ({len(fit[1])} rows fit the figure)'
            n += 1
    return n
