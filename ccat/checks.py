"""Independent checks and the catalog accuracy gate.

A check compares something measured on the built pattern against a value
the SOURCE prints (a table row, a printed dimension, the matching seam).
Never against our own earlier outputs. Recipe syntax:

    checks:
      - id: armhole
        measure: {length: armhole}        # or {dist: [A, B]} or {value: "expr"}
        expect: "DP"                      # number or expression (inputs/values)
        source: "Table 1.2 row 63.1"
      - id: seam-A
        equal: [seamA_back, seamA_side]   # path lengths; the second is the reference
        source: "seams sew together"

`reports:` (same `measure` syntax, plus id/note) are printed for review but
never gate: use them for quantities the source does not print.

Gate (PIPELINE.md, settled): every check within max(1% relative, half the
source's printed step). The step is how finely the source prints its values
(ЕМКО 0.05 cm, an inch source printed to 1/4" 0.635 cm). Each source adapter
declares it as PRINTED_STEP, in cm, and the caller passes it to run_checks.
Without a step the gate is strict 1%. Where the expected value is ~0, an
absolute floor applies instead. A recipe may tighten `tol` (the relative
part) on a check but never loosen it past the gate; the step comes from the
source, not the recipe.
"""
from dataclasses import dataclass, field

import math

from . import geom as G
from .expr import names
from .recipe import RecipeError

GATE_REL = 0.01      # 1% relative, every check (or the printed-step floor, if larger)
ZERO_ABS = 0.05      # cm, used only when |expected| < ZERO_EPS
ZERO_EPS = 1e-6
MAX_STEP = 0.635     # cm (1/4 inch): the coarsest printed step an adapter may declare
CHECK_KEYS = {'id', 'measure', 'expect', 'equal', 'source', 'tol', 'note', 'base_only'}


@dataclass
class CheckResult:
    id: str
    measured: float
    expected: float
    tol: float
    source: str = ''
    absolute: bool = False
    missing: tuple = ()          # check inputs the data lacks: unverified, never a pass
    skipped: bool = False        # a base_only check on data without the base size's printed value
    floor: float = 0.0           # cm: half the source's printed step (0 = strict relative)

    @property
    def error(self):
        return self.measured - self.expected

    @property
    def rel(self):
        return None if self.absolute or self.missing else abs(self.error) / abs(self.expected)

    @property
    def passed(self):
        if self.skipped:
            return True
        if self.missing:
            return False
        if self.absolute:
            return abs(self.error) <= self.tol
        return self.rel <= self.tol + 1e-12 or abs(self.error) <= self.floor + 1e-12

    @property
    def by_floor(self):
        """Passed only because of the printed-step floor (outside the relative limit)."""
        return self.passed and not (self.absolute or self.skipped) and self.rel > self.tol + 1e-12


@dataclass
class GateReport:
    recipe: str
    results: list = field(default_factory=list)
    interps: list = field(default_factory=list)
    reports: list = field(default_factory=list)     # (id, value, note), never gating
    printed_step: float = None                      # cm, from the source adapter; None = strict 1%

    @property
    def passed(self):
        # at least one check must actually run: skipped base-only checks verify nothing
        return any(not r.skipped for r in self.results) and all(r.passed for r in self.results)

    @property
    def failures(self):
        return [r for r in self.results if not r.passed]

    def as_dict(self):
        return {'recipe': self.recipe, 'passed': self.passed, 'gate_rel': GATE_REL,
                'printed_step': self.printed_step,
                'checks': [{'id': r.id, 'measured': round(r.measured, 4), 'expected': round(r.expected, 4),
                            'error': None if r.missing else round(r.error, 4), 'rel': None if r.rel is None else round(r.rel, 6),
                            'tol': r.tol, 'floor': r.floor, 'by_floor': r.by_floor, 'absolute': r.absolute,
                            'passed': r.passed, 'source': r.source,
                            'missing': list(r.missing), 'skipped': r.skipped}
                           for r in self.results],
                'reports': [{'id': i, 'value': round(v, 4), 'note': n} for i, v, n in self.reports],
                'interpretations': [{'point': p, 'note': n} for p, n in self.interps]}

    def text(self):
        limit = f'{GATE_REL:.0%}' if not self.printed_step else             f'max({GATE_REL:.0%}, {self.printed_step / 2:.3g} cm = half the printed step)'
        lines = [f'gate for {self.recipe}: {"PASS" if self.passed else "FAIL"} '
                 f'({len(self.results) - len(self.failures)}/{len(self.results)} checks, limit {limit})']
        for r in self.results:
            if r.skipped:
                lines.append(f'  skip {r.id:<27} printed for the base size only; this size lacks {", ".join(r.missing)}')
                continue
            if r.missing:
                lines.append(f'  N/A {r.id:<28} unverified: data lacks {", ".join(r.missing)}  {r.source}')
                continue
            dev = f'{r.error:+.3f} cm' if r.absolute else f'{r.error / r.expected:+.2%}'
            mark = 'ok~' if r.by_floor else 'ok ' if r.passed else 'BAD'
            lines.append(f'  {mark} {r.id:<28} {r.measured:9.3f} vs {r.expected:9.3f}  '
                         f'{dev:>9}  {r.source}')
        if not self.results:
            lines.append('  (no checks declared: a recipe without checks never passes the gate)')
        for i, v, n in self.reports:
            lines.append(f'  report {i:<25} {v:9.3f}  {n}')
        for p, n in self.interps:
            lines.append(f'  interp {p}: {n}')
        return '\n'.join(lines)


def _measure(pattern, spec, where):
    if not isinstance(spec, dict) or len(spec) != 1:
        raise RecipeError(f'{where}: measure takes one of length/dist/value')
    (k, v), = spec.items()
    if k == 'length':
        return pattern.length(str(v))
    if k == 'dist':
        if not (isinstance(v, list) and len(v) == 2):
            raise RecipeError(f'{where}: dist takes [A, B]')
        missing = [n for n in v if str(n) not in pattern.points]
        if missing:
            raise RecipeError(f'{where}: unknown points {missing}')
        return G.dist(pattern.points[str(v[0])], pattern.points[str(v[1])])
    if k == 'value':
        return pattern.eval(v, where)
    raise RecipeError(f'{where}: unknown measure {k!r}')


def gate_floor(printed_step):
    """Absolute allowance (cm) for a source's printed step; validates the adapter's declaration."""
    if printed_step is None:
        return 0.0
    if isinstance(printed_step, bool) or not isinstance(printed_step, (int, float))             or not 0 < printed_step <= MAX_STEP:
        raise RecipeError(f'printed step {printed_step!r} must be in (0, {MAX_STEP}] cm')
    return printed_step / 2


def run_checks(pattern, printed_step=None):
    """Evaluate the recipe's checks → GateReport. Raises RecipeError on malformed checks.

    printed_step: the source adapter's PRINTED_STEP (cm). Each check passes within
    max(1% relative, printed_step / 2); None keeps the strict 1% gate."""
    floor = gate_floor(printed_step)
    report = GateReport(pattern.id, interps=list(pattern.interps), printed_step=printed_step)
    seen = set()
    for i, c in enumerate(pattern.recipe.get('checks') or []):
        where = f'check {i}'
        if not isinstance(c, dict) or 'id' not in c or set(c) - CHECK_KEYS:
            raise RecipeError(f'{where}: expected keys {sorted(CHECK_KEYS)} with an id')
        cid = str(c['id'])
        where = f'check {cid!r}'
        if cid in seen:
            raise RecipeError(f'{where}: duplicate id')
        seen.add(cid)
        tol = c.get('tol', GATE_REL)
        if not isinstance(tol, (int, float)) or tol <= 0 or tol > GATE_REL:
            raise RecipeError(f'{where}: tol {tol!r} must be in (0, {GATE_REL}]; the gate cannot be loosened')
        refs = set()
        for key in ('measure', 'expect'):
            v = c.get(key)
            if isinstance(v, dict) and 'value' in v:
                refs |= names(v['value'])
            elif isinstance(v, (str, int, float)) and key == 'expect':
                refs |= names(v)
        missing = tuple(sorted(refs & pattern.missing_check_inputs))
        if missing:
            # base_only: the expected value is printed for the base size only (e.g. an ИМК table's
            # values), so on another size it is skipped, not failed
            report.results.append(CheckResult(cid, math.nan, math.nan, float(tol), str(c.get('source', '')),
                                              missing=missing, skipped=bool(c.get('base_only'))))
            continue
        if 'equal' in c:
            if 'measure' in c or 'expect' in c or not (isinstance(c['equal'], list) and len(c['equal']) == 2):
                raise RecipeError(f'{where}: equal takes [path, reference path] and nothing else')
            m, e = pattern.length(str(c['equal'][0])), pattern.length(str(c['equal'][1]))
        else:
            if 'measure' not in c or 'expect' not in c:
                raise RecipeError(f'{where}: needs measure + expect, or equal')
            m, e = _measure(pattern, c['measure'], where), pattern.eval(c['expect'], where)
        absolute = abs(e) < ZERO_EPS
        report.results.append(CheckResult(cid, m, e, max(ZERO_ABS, floor) if absolute else float(tol),
                                          str(c.get('source', '')), absolute, floor=floor))
    for i, c in enumerate(pattern.recipe.get('reports') or []):
        if not isinstance(c, dict) or 'id' not in c or 'measure' not in c or set(c) - {'id', 'measure', 'note'}:
            raise RecipeError(f'report {i}: expected {{id, measure, note?}}')
        m = c['measure']
        if isinstance(m, dict) and 'value' in m and names(m['value']) & pattern.missing_check_inputs:
            continue                    # reads a value printed for the base size only: not on this size
        report.reports.append((str(c['id']), _measure(pattern, c['measure'], f'report {c["id"]!r}'),
                               str(c.get('note', ''))))
    return report
