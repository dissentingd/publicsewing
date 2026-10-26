"""Row-identity validation for transcribed source tables.

Many sources print redundant columns (ЕМКО: draft = base + П, П = ПК + ПТ, ...).
Each identity is a check on the transcription itself: an OCR error in any one
cell breaks at least one identity. This is separate from the 1% pattern gate:
it decides whether a table row may be used at all.
"""
from dataclasses import dataclass

from .expr import ExprError, evaluate, names


@dataclass
class RowIssue:
    row: object
    identity: str
    lhs: float
    rhs: float

    @property
    def diff(self):
        return self.lhs - self.rhs


def check_identities(rows, identities, tol, key='n'):
    """rows: list of dicts. identities: ["lhs == rhs", ...] over row fields.

    Returns (issues, n_checked, skipped). An identity is skipped for a row
    that lacks one of its fields, and reported in skipped as (row, identity)
    so the caller can see what went unverified.
    """
    parsed = []
    for ident in identities:
        if ident.count('==') != 1:
            raise ExprError(f'identity must be "lhs == rhs": {ident!r}')
        lhs, rhs = (s.strip() for s in ident.split('=='))
        parsed.append((ident, lhs, rhs, names(lhs) | names(rhs)))
    issues, skipped, checked = [], [], 0
    for r in rows:
        for ident, lhs, rhs, need in parsed:
            if any(not isinstance(r.get(n), (int, float)) for n in need):
                skipped.append((r.get(key), ident))
                continue
            look = lambda n: r[n]
            lv, rv = evaluate(lhs, look), evaluate(rhs, look)
            checked += 1
            if abs(lv - rv) > tol:
                issues.append(RowIssue(r.get(key), ident, lv, rv))
    return issues, checked, skipped
