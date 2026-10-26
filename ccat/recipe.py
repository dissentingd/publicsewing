"""Declarative construction recipes → points, paths and pieces.

A recipe is written once per garment of a source (see PIPELINE.md). The
size-specific numbers come from a separate data mapping (table rows, body
measurements). The interpreter fails closed: an unknown key or op, a
missing input, an ambiguous intersection without a `pick`, a gap between
path segments — all raise RecipeError. Nothing is guessed.

Recipe layout (YAML):

    recipe: emko-jacket-framework
    source: {book: ..., table: "1.2", figure: 2}
    units: cm
    inputs: [r1, r2, ...]            # names the data file must supply
    values: {half: "r6 + r7 + r8"}   # derived scalars
    points:
      "11": {at: [0, 0]}
      "91": {offset: {from: "11", dir: down, d: r1}, row: 1}
    paths:
      back_cb: [{line: ["11", "91"]}]
    pieces:
      back: {outline: [{path: back_cb}, {line: ["91", "93"]}, ...]}
    checks: [...]                    # see ccat.checks
    export:                          # per piece, see ccat.export (the builder ignores it)
      back: {cut: 2, grain: vertical, notches: [{point: "411"}]}

Scalars (d, r, t, deg, coordinates) are numbers or expressions over inputs,
values and the functions dist("A", "B"), x("A"), y("A"),
angle("A", "V", "B") (degrees, clockwise positive) and length("path").
`extends: base.yaml` builds a recipe on top of another (e.g. ИМК on БК).

Traced sources (a pattern traced from a drawing, e.g. Walker's grid diagrams) pass their
polylines as data['@traces'] ([[x, y], ...] per polyline, cm). Two ops use them:
`trace_near: {at: [x, y], r: d, pick?}` is a traced vertex within r of (x, y): the nearest one,
or by `pick` a feature of the trace itself: `corner` (the sharpest turn), `end` (a polyline
end), `lowest` / `highest` / `leftmost` / `rightmost`;
the segment `trace: {from: P, to: Q, via: [R, ...], bridge: d}` follows the traced lines from
vertex P to vertex Q (through each via, in order), along the shortest route. Polyline ends
within SNAP_CM meet; with `bridge`, ends of different polylines up to d apart may be joined by
a straight line, and each such join is recorded as an interpretation. With `onto: [P2, Q2]`
the traced curve is moved by the similarity that takes P → P2 and Q → Q2 (rotation, scale,
shift: the shape is the drawing's, the ends the source's figures); the scale and turn are
recorded.

To-scale diagrams (a drawing at an unstated reduction, its points marked, e.g. Mitchell 1921)
come as data['@drawings'] = {name: {markers: [[x, y], ...], traces: [polyline, ...]}}, in the
page's own units. The recipe's `drawing:` section fits each one onto the construction:

    drawing:
      p17: {fit: [A, "2", "4", "5", "10", "12", "18"], r: 0.8}

`fit` names points the text places by printed measures alone; the similarity (scale, turn,
shift) that best takes them onto markers is found (each fit point must land within r cm of its
own marker, else the build stops), and that drawing's markers and traces are then in the
recipe's frame. `marker_near: {at: P | [x, y], r, drawing}` is the marker within r of a point
(none, or a second one within r, stops the build): the drawn point, for checks against the
construction. `trace_near` and the `trace` segment take `drawing: name` to use that drawing's
traces instead of data['@traces'].

`path_at: {path, from: P, d}` is the point d along a path from P (on it): d > 0 toward the
path's end, d < 0 toward its start (a dart's legs laid off along a curved waist).

Coordinates: cm, x right, y down (see ccat.geom).
"""
import math
from pathlib import Path

import yaml

from . import geom as G
from .expr import ExprError, evaluate

TOP_KEYS = {'recipe', 'source', 'units', 'inputs', 'check_inputs', 'values', 'points', 'paths', 'pieces', 'checks', 'reports',
            'notes', 'export', 'drop_checks', 'seams', 'drape', 'drawing'}
MAP_SECTIONS = ('values', 'points', 'paths', 'pieces', 'export', 'seams', 'drawing')
LIST_SECTIONS = ('inputs', 'check_inputs', 'checks', 'reports')
META_KEYS = {'row', 'note', 'interp', 'source'}

# op -> (required args, optional args)
OPS = {
    'at': None,                                        # [x, y]
    'offset': ({'from', 'dir', 'd'}, set()),
    'along': ({'from', 'to', 'd'}, set()),
    'ratio': ({'from', 'to', 't'}, set()),
    'line_x': ({'a', 'b'}, set()),
    'perp_foot': ({'from', 'line'}, set()),
    'circle_line': ({'center', 'r', 'line'}, {'pick'}),
    'circle_circle': ({'c1', 'r1', 'c2', 'r2'}, {'pick'}),
    'rotate': ({'point', 'about', 'deg'}, set()),
    'mirror': ({'point', 'line'}, set()),
    'project': ({'x_of', 'y_of'}, set()),
    'at_y': ({'line'}, {'y', 'y_of'}),
    'at_x': ({'line'}, {'x', 'x_of'}),
    'path_x': ({'path', 'line'}, {'pick'}),
    'trace_near': ({'at', 'r'}, {'pick', 'drawing'}),
    'path_at': ({'path', 'from', 'd'}, set()),
    'marker_near': ({'at', 'r', 'drawing'}, set()),
}
DRAWINGS = '@drawings'
FIT_SCALES = (0.05, 20.0)    # drawing units per recipe unit a fit may find (a hypothesis outside is dropped)
FIT_TURN = 10.0              # degrees: the most a drawing may be turned against the construction
SEGMENTS = {'line', 'polyline', 'arc', 'bezier', 'path', 'subpath', 'arc_chain', 'trace'}
TRACES = '@traces'
SNAP_CM = 0.4                # traced polyline ends this close meet (skeleton junction gaps)
BRIDGE_COST = 2.0           # a bridged gap costs this much more than a traced line of its length
DIRS = {'down': (0.0, 1.0), 'up': (0.0, -1.0), 'right': (1.0, 0.0), 'left': (-1.0, 0.0)}
JOIN_TOL = 1e-6


class RecipeError(ValueError):
    pass


class Pattern:
    """Result of building a recipe for one data set."""

    def __init__(self, recipe, builder):
        self.recipe = recipe
        self.id = recipe.get('recipe', '?')
        self.points = builder.pts
        self.values = builder.vals
        self.paths = builder.paths
        self.pieces = builder.pieces
        self.interps = builder.interps
        self.missing_check_inputs = set(builder.missing_checks)
        self._b = builder

    def eval(self, text, where='expression'):
        return self._b.scalar(text, where)

    def path(self, name):
        if name in self.paths:
            return self.paths[name]
        if name.startswith('piece:') and name[6:] in self.pieces:
            return self.pieces[name[6:]]
        raise RecipeError(f'unknown path {name!r}')

    def length(self, name):
        return G.polylen(self.path(name))


def load(path):
    """Load a recipe. `extends: other.yaml` (relative to this file) builds on a base
    recipe: maps are merged (a name defined twice is an error, except in `export:`,
    where a garment may override its base's spec for a piece), lists appended.
    `extends: [a.yaml, b.yaml]` merges several bases in order the same way (a shared
    component on top of a garment's own base; two bases defining one name is an error).
    `drop_checks: [id, ...]` removes base checks that don't apply to this garment
    (e.g. a construction-stage piece it doesn't use); an id the base lacks is an error."""
    path = Path(path)
    with open(path, encoding='utf-8') as f:
        doc = yaml.safe_load(f)
    if not isinstance(doc, dict) or 'extends' not in doc:
        if isinstance(doc, dict) and 'drop_checks' in doc:
            raise RecipeError(f'{path.name}: drop_checks needs extends')
        return doc
    parents = doc.pop('extends')
    parents = parents if isinstance(parents, list) else [parents]
    if not parents or not all(isinstance(x, str) for x in parents):
        raise RecipeError(f'{path.name}: extends takes a file name or a list of them')
    base = load(path.parent / parents[0])
    for extra in parents[1:]:
        base = _merge(base, load(path.parent / extra), f'{path.name} (base {extra})')
    drop = doc.pop('drop_checks', None) or []
    have = {str(c.get('id')) for c in base.get('checks') or [] if isinstance(c, dict)}
    missing = sorted(set(map(str, drop)) - have)
    if missing:
        raise RecipeError(f'{path.name} drops checks its base does not have: {missing}')
    base = dict(base)
    base['checks'] = [c for c in base.get('checks') or [] if str(c.get('id')) not in set(map(str, drop))]
    return _merge(base, doc, path.name)


def _merge(base, doc, name):
    merged = dict(base)
    for k, v in doc.items():
        if k == 'export':                  # a garment may override its base's export specs
            merged[k] = {**(base.get(k) or {}), **(v or {})}
        elif k in MAP_SECTIONS:
            dup = set(map(str, base.get(k) or {})) & set(map(str, v or {}))
            if dup:
                raise RecipeError(f'{name} redefines {k} from its base: {sorted(dup)}')
            merged[k] = {**(base.get(k) or {}), **(v or {})}
        elif k in LIST_SECTIONS:
            merged[k] = list(base.get(k) or []) + [x for x in (v or []) if k not in ('inputs', 'check_inputs')
                                                   or x not in (base.get(k) or [])]
        else:
            merged[k] = v
    return merged


def build(recipe, data):
    """Build every point, path and piece. data: {input name: number}."""
    b = _Builder(recipe, data)
    b.run()
    return Pattern(recipe, b)


class _Builder:
    def __init__(self, recipe, data):
        if not isinstance(recipe, dict):
            raise RecipeError('recipe must be a mapping')
        bad = set(recipe) - TOP_KEYS
        if bad:
            raise RecipeError(f'unknown top-level keys: {sorted(bad)}')
        self.r = recipe
        self.inputs = [str(n) for n in recipe.get('inputs') or []]
        missing = [n for n in self.inputs if n not in data]
        if missing:
            raise RecipeError(f'data is missing inputs: {missing}')
        # check_inputs: source values used only by checks. When absent, construction
        # proceeds and the checks that need them report as unverified (gate fails).
        self.check_inputs = [str(n) for n in recipe.get('check_inputs') or []]
        self.missing_checks = [n for n in self.check_inputs if n not in data]
        self.inputs += [n for n in self.check_inputs if n in data]
        self.data = {str(k): v for k, v in data.items()}
        self.value_defs = {str(k): v for k, v in (recipe.get('values') or {}).items()}
        clash = set(self.value_defs) & set(self.inputs)
        if clash:
            raise RecipeError(f'names are both inputs and values: {sorted(clash)}')
        self.point_defs = {str(k): v for k, v in (recipe.get('points') or {}).items()}
        self.path_defs = {str(k): v for k, v in (recipe.get('paths') or {}).items()}
        self.piece_defs = {str(k): v for k, v in (recipe.get('pieces') or {}).items()}
        self.vals, self.pts, self.paths, self.pieces = {}, {}, {}, {}
        self.interps = []
        self.arc_breaks = []        # (where, tangent break in degrees at each arc end)
        self.stack = []
        self.traces = data.get(TRACES) or []
        if not isinstance(self.traces, list) or not all(
                isinstance(t, (list, tuple)) and len(t) >= 2 and all(len(q) == 2 for q in t) for t in self.traces):
            raise RecipeError(f"data['{TRACES}'] must be a list of polylines [[x, y], ...]")
        self.traces = [[(float(x), float(y)) for x, y in t] for t in self.traces]
        self.drawing_defs = {str(k): v for k, v in (recipe.get('drawing') or {}).items()}
        self.drawing_data = data.get(DRAWINGS) or {}
        if not isinstance(self.drawing_data, dict):
            raise RecipeError(f"data['{DRAWINGS}'] must map a drawing name to {{markers, traces}}")
        self.drawn = {}             # name -> {'markers': [...], 'traces': [...], 'fit': {...}} (recipe frame)

    def run(self):
        for n in self.inputs:
            v = self.data[n]
            if not isinstance(v, (int, float)) or isinstance(v, bool):
                raise RecipeError(f'input {n!r} is not a number: {v!r}')
            self.vals[n] = float(v)
        for n in self.value_defs:
            self.value(n)
        for n in self.point_defs:
            self.point(n)
        for n in self.path_defs:
            self.path(n)
        for n, spec in self.piece_defs.items():
            if not isinstance(spec, dict) or 'outline' not in spec or set(spec) - {'outline', 'closed', 'note'}:
                raise RecipeError(f'piece {n!r}: expected {{outline: [...], closed?: bool}}')
            pts = self.segments(spec['outline'], f'piece {n!r}')
            if spec.get('closed', True) and G.dist(pts[0], pts[-1]) > JOIN_TOL:
                raise RecipeError(f'piece {n!r} outline is not closed (gap {G.dist(pts[0], pts[-1]):.4f} cm)')
            self.pieces[n] = pts

    # ---- to-scale drawings ----
    def drawing(self, name, where):
        """A drawing's markers and traces in the recipe frame, fitted on first use (see the
        module docstring). → {'markers', 'traces', 'fit'}"""
        name = str(name)
        if name in self.drawn:
            return self.drawn[name]
        spec = self.drawing_defs.get(name)
        if spec is None:
            raise RecipeError(f'{where}: no drawing {name!r} in the recipe (drawing: {sorted(self.drawing_defs)})')
        if not isinstance(spec, dict) or set(spec) - {'fit', 'r', 'note'} or not {'fit', 'r'} <= set(spec):
            raise RecipeError(f'drawing {name!r}: expected {{fit: [points], r: cm, note?}}')
        raw = self.drawing_data.get(name)
        if not isinstance(raw, dict) or not raw.get('markers'):
            raise RecipeError(f"drawing {name!r}: data['{DRAWINGS}'] has no markers for it")
        fit = [str(n) for n in spec['fit']]
        if len(fit) < 3 or len(set(fit)) != len(fit):
            raise RecipeError(f'drawing {name!r}: fit needs at least 3 distinct points')
        self._enter('drawing ' + name)
        try:
            P = [complex(*self.point(n)) for n in fit]
            r = self.scalar(spec['r'], f'drawing {name!r} r')
        finally:
            self.stack.pop()
        M = [complex(float(x), float(y)) for x, y in raw['markers']]

        def match(a, b):                         # recipe → drawing: q = a·p + b
            out = []
            for p in P:
                q = a * p + b
                d, j = min((abs(q - m), j) for j, m in enumerate(M))
                out.append((d / abs(a), j))      # residual in recipe units
            return out

        # hypotheses: the first two fit points onto every ordered pair of markers
        best = None
        for i, mi in enumerate(M):
            for j, mj in enumerate(M):
                if i == j or abs(P[1] - P[0]) < 1e-9:
                    continue
                a = (mj - mi) / (P[1] - P[0])
                if not FIT_SCALES[0] <= abs(a) <= FIT_SCALES[1] or abs(math.degrees(math.atan2(a.imag, a.real))) > FIT_TURN:
                    continue
                m = match(a, mi - a * P[0])
                score = (sum(d <= r for d, _ in m), -sum(min(d, r) for d, _ in m))
                if best is None or score > best[0]:
                    best = (score, a, mi - a * P[0])
        if best is None:
            raise RecipeError(f'drawing {name!r}: no fit (no marker pair at a plausible scale and turn)')
        a, b = best[1], best[2]
        for _ in range(3):                       # least-squares similarity on the matched markers
            m = match(a, b)
            Q = [M[j] for _, j in m]
            pc, qc = sum(P) / len(P), sum(Q) / len(Q)
            den = sum(abs(p - pc) ** 2 for p in P)
            a = sum((p - pc).conjugate() * (q - qc) for p, q in zip(P, Q)) / den
            b = qc - a * pc
        m = match(a, b)
        bad = [f'{n} ({d:.2f} cm)' for n, (d, _) in zip(fit, m) if d > r]
        if bad:
            raise RecipeError(f'drawing {name!r}: fit points without a marker within {r:g} cm: {", ".join(bad)}')
        used = [j for _, j in m]
        if len(set(used)) != len(used):
            raise RecipeError(f'drawing {name!r}: two fit points share one marker')
        inv = lambda x, y: ((complex(x, y) - b) / a)
        to = lambda z: (z.real, z.imag)
        res = [d for d, _ in m]
        info = {'scale': abs(a), 'turn': math.degrees(math.atan2(a.imag, a.real)),
                'rms': math.sqrt(sum(d * d for d in res) / len(res)), 'max': max(res), 'points': fit}
        self.drawn[name] = {
            'markers': [to(inv(x, y)) for x, y in raw['markers']],
            'traces': [[to(inv(x, y)) for x, y in t] for t in raw.get('traces') or []],
            'fit': info}
        self.interps.append((f'drawing {name!r}', f'fitted on {len(fit)} points: {info["scale"]:.5f} drawing units '
                             f'per cm, turned {info["turn"]:+.2f}°, residual rms {info["rms"]:.3f} cm, '
                             f'max {info["max"]:.3f} cm'))
        return self.drawn[name]

    def traces_for(self, spec, where):
        return self.drawing(spec, where)['traces'] if spec is not None else self.traces

    # ---- traced lines ----
    def _trace_route(self, p, q, bridge, w, traces=None):
        """Shortest route along the traces from vertex p to vertex q. → (points, bridged gaps)."""
        import heapq
        traces = self.traces if traces is None else traces
        nodes = [v for t in traces for v in t]
        index = {}
        for i, v in enumerate(nodes):
            index.setdefault(v, i)
        for end, name in ((p, 'from'), (q, 'to')):
            if end not in index:
                raise RecipeError(f'{w}: {name} point {end} is not a traced vertex (use trace_near)')
        adj = {i: [] for i in range(len(nodes))}
        ends, k = [], 0
        for t in traces:
            ids = list(range(k, k + len(t)))
            for a_, b_ in zip(ids, ids[1:]):
                d = G.dist(nodes[a_], nodes[b_])
                adj[a_].append((b_, d, False))
                adj[b_].append((a_, d, False))
            ends.append((ids[0], ids[-1], len(ends)))
            k += len(t)
        for v, i in index.items():                       # repeated vertices are one node
            for j, u in enumerate(nodes):
                if u == v and j != i:
                    adj[i].append((j, 0.0, False))
                    adj[j].append((i, 0.0, False))
        tips = [(i, n) for a_, b_, n in ends for i in (a_, b_)]
        reach = max(bridge, SNAP_CM)
        for x, (i, n) in enumerate(tips):
            for j, m in tips[x + 1:]:
                if n == m:
                    continue
                d = G.dist(nodes[i], nodes[j])
                if d <= SNAP_CM:
                    adj[i].append((j, d, False))
                    adj[j].append((i, d, False))
                elif d <= reach:
                    adj[i].append((j, d * BRIDGE_COST, True))
                    adj[j].append((i, d * BRIDGE_COST, True))
        src, dst = index[p], index[q]
        best, prev, heap = {src: 0.0}, {}, [(0.0, src)]
        while heap:
            c, i = heapq.heappop(heap)
            if i == dst:
                break
            if c > best.get(i, float('inf')):
                continue
            for j, d, br in adj[i]:
                if c + d < best.get(j, float('inf')):
                    best[j], prev[j] = c + d, (i, br)
                    heapq.heappush(heap, (c + d, j))
        if dst not in best:
            raise RecipeError(f'{w}: no traced route from {p} to {q}' + ('' if bridge else ' (gaps need bridge: d)'))
        route, gaps, i = [dst], [], dst
        while i != src:
            j, br = prev[i]
            if br:
                gaps.append(G.dist(nodes[i], nodes[j]))
            route.append(j)
            i = j
        pts = [nodes[i] for i in reversed(route)]
        out = [pts[0]] + [b_ for a_, b_ in zip(pts, pts[1:]) if b_ != a_]
        return out, gaps[::-1]

    # ---- dependency resolution (lazy, with cycle detection) ----
    def _enter(self, key):
        if key in self.stack:
            raise RecipeError('circular definition: ' + ' -> '.join(self.stack[self.stack.index(key):] + [key]))
        self.stack.append(key)

    def value(self, name):
        if name in self.vals:
            return self.vals[name]
        if name not in self.value_defs:
            raise KeyError(name)
        self._enter('value ' + name)
        try:
            self.vals[name] = self.scalar(self.value_defs[name], f'value {name!r}')
        finally:
            self.stack.pop()
        return self.vals[name]

    def scalar(self, spec, where):
        if isinstance(spec, bool):
            raise RecipeError(f'{where}: expected a number or expression, got {spec!r}')
        if isinstance(spec, (int, float)):
            return float(spec)
        funcs = {'dist': lambda a, b: G.dist(self.point(a), self.point(b)),
                 'x': lambda a: self.point(a)[0], 'y': lambda a: self.point(a)[1],
                 'angle': lambda a, v, b: G.angle_deg(self.point(a), self.point(v), self.point(b)),
                 'length': lambda p: G.polylen(self.path(p))}
        try:
            return evaluate(spec, self.value, funcs)
        except ExprError as e:
            raise RecipeError(f'{where}: {e}') from None

    def point(self, name):
        name = str(name)
        if name in self.pts:
            return self.pts[name]
        if name not in self.point_defs:
            raise RecipeError(f'unknown point {name!r}' + (f' (needed by {self.stack[-1]})' if self.stack else ''))
        self._enter('point ' + name)
        try:
            self.pts[name] = self._construct(name, self.point_defs[name])
        except G.GeomError as e:
            raise RecipeError(f'point {name!r}: {e}') from None
        finally:
            self.stack.pop()
        return self.pts[name]

    # ---- point ops ----
    def _construct(self, name, spec):
        where = f'point {name!r}'
        if not isinstance(spec, dict):
            raise RecipeError(f'{where}: expected a mapping with one op')
        ops = [k for k in spec if k not in META_KEYS]
        if len(ops) != 1 or ops[0] not in OPS:
            raise RecipeError(f'{where}: expected exactly one op from {sorted(OPS)}, got {ops}')
        op = ops[0]
        if spec.get('interp'):
            self.interps.append((name, str(spec['interp'])))
        a = spec[op]
        if op == 'at':
            if not (isinstance(a, list) and len(a) == 2):
                raise RecipeError(f'{where}: at takes [x, y]')
            return (self.scalar(a[0], where), self.scalar(a[1], where))
        req, opt = OPS[op]
        if not isinstance(a, dict):
            raise RecipeError(f'{where}: {op} takes a mapping of {sorted(req | opt)}')
        if req - set(a) or set(a) - req - opt:
            raise RecipeError(f'{where}: {op} needs {sorted(req)} (optional {sorted(opt)}), got {sorted(a)}')
        s = lambda k: self.scalar(a[k], f'{where} {op}.{k}')
        p = lambda k: self.point(a[k])
        if op == 'offset':
            return G.offset(p('from'), self.direction(a['dir'], where), s('d'))
        if op == 'along':
            return G.offset(p('from'), G.sub(p('to'), p('from')), s('d'))
        if op == 'ratio':
            return G.lerp(p('from'), p('to'), s('t'))
        if op == 'line_x':
            return G.line_x(*self.line(a['a'], where), *self.line(a['b'], where))
        if op == 'perp_foot':
            return G.perp_foot(p('from'), *self.line(a['line'], where))
        if op == 'circle_line':
            lp, ld = self.line(a['line'], where)
            return self.pick(G.circle_line(p('center'), s('r'), lp, ld), a.get('pick'), where, line_dir=ld)
        if op == 'circle_circle':
            return self.pick(G.circle_circle(p('c1'), s('r1'), p('c2'), s('r2')), a.get('pick'), where)
        if op == 'rotate':
            return G.rotate(p('point'), p('about'), s('deg'))
        if op == 'mirror':
            return G.mirror(p('point'), *self.line(a['line'], where))
        if op == 'path_x':
            lp, ld = self.line(a['line'], where)
            return self.pick(G.polyline_line_x(self.path(str(a['path'])), lp, ld), a.get('pick'), where,
                             ordered=True)
        if op == 'path_at':
            return G.along_polyline(self.path(str(a['path'])), p('from'), s('d'))
        if op == 'project':
            return (p('x_of')[0], p('y_of')[1])
        if op == 'trace_near':
            if not (isinstance(a['at'], list) and len(a['at']) == 2):
                raise RecipeError(f'{where}: trace_near.at takes [x, y]')
            q = (self.scalar(a['at'][0], where), self.scalar(a['at'][1], where))
            r = s('r')
            pick = a.get('pick', 'nearest')
            traces = self.traces_for(a.get('drawing'), where)
            cand = []                                     # (vertex, polyline, index) within r
            for t in traces:
                for i, v in enumerate(t):
                    if G.dist(q, v) <= r:
                        cand.append((v, t, i))
            if pick == 'end':
                cand = [c for c in cand if c[2] in (0, len(c[1]) - 1)]
            elif pick == 'corner':
                cand = [c for c in cand if 0 < c[2] < len(c[1]) - 1]
            if not cand:
                near = min((G.dist(q, v) for t in traces for v in t), default=None)
                raise RecipeError(f'{where}: no traced vertex ({pick}) within {r:g} of ({q[0]:.2f}, {q[1]:.2f})'
                                  + (f' (nearest vertex {near:.2f} away)' if near is not None else ' (no traces)'))
            def turn(c):
                v, t, i = c
                u, w_ = G.sub(v, t[i - 1]), G.sub(t[i + 1], v)
                return abs(math.degrees(math.atan2(u[0] * w_[1] - u[1] * w_[0], u[0] * w_[0] + u[1] * w_[1])))
            key = {'nearest': lambda c: G.dist(q, c[0]), 'end': lambda c: G.dist(q, c[0]),
                   'corner': lambda c: -turn(c), 'lowest': lambda c: -c[0][1], 'highest': lambda c: c[0][1],
                   'leftmost': lambda c: c[0][0], 'rightmost': lambda c: -c[0][0]}.get(pick)
            if key is None:
                raise RecipeError(f'{where}: trace_near.pick must be one of nearest, corner, end, lowest, '
                                  f'highest, leftmost, rightmost')
            return min(cand, key=key)[0]
        if op == 'marker_near':
            at = a['at']
            if isinstance(at, list) and len(at) == 2:
                q = (self.scalar(at[0], where), self.scalar(at[1], where))
            elif isinstance(at, (str, int)):
                q = self.point(at)
            else:
                raise RecipeError(f'{where}: marker_near.at takes a point name or [x, y]')
            r = s('r')
            ranked = sorted((G.dist(q, m), m) for m in self.drawing(a['drawing'], where)['markers'])
            if not ranked or ranked[0][0] > r:
                raise RecipeError(f'{where}: no marker within {r:g} of ({q[0]:.2f}, {q[1]:.2f})'
                                  + (f' (nearest {ranked[0][0]:.2f} away)' if ranked else ''))
            if len(ranked) > 1 and ranked[1][0] <= r:
                raise RecipeError(f'{where}: two markers within {r:g} ({ranked[0][0]:.2f} and {ranked[1][0]:.2f} '
                                  f'away); narrow r')
            return ranked[0][1]
        if op in ('at_y', 'at_x'):
            k = 'y' if op == 'at_y' else 'x'
            if (k in a) == (k + '_of' in a):
                raise RecipeError(f'{where}: {op} needs exactly one of {k}, {k}_of')
            level = s(k) if k in a else self.point(a[k + '_of'])[1 if k == 'y' else 0]
            lp, ld = self.line(a['line'], where)
            other = (1.0, 0.0) if k == 'y' else (0.0, 1.0)
            return G.line_x(lp, ld, (0.0, level) if k == 'y' else (level, 0.0), other)
        raise RecipeError(f'{where}: op {op!r} not implemented')  # unreachable while OPS is in sync

    def direction(self, spec, where):
        if isinstance(spec, str):
            if spec not in DIRS:
                raise RecipeError(f'{where}: unknown direction {spec!r} (use {sorted(DIRS)} or a mapping)')
            return DIRS[spec]
        if isinstance(spec, dict) and len(spec) == 1:
            (k, v), = spec.items()
            if k == 'deg':
                d = self.scalar(v, where)
                return G.rotate((1.0, 0.0), (0.0, 0.0), d)
            if k in ('toward', 'perp') and isinstance(v, list) and len(v) == 2:
                d = G.sub(self.point(v[1]), self.point(v[0]))
                return d if k == 'toward' else G.perp(d)
        raise RecipeError(f'{where}: bad direction {spec!r}; use down/up/left/right, '
                          '{deg: e}, {toward: [A, B]} or {perp: [A, B]}')

    def line(self, spec, where):
        if isinstance(spec, list) and len(spec) == 2:
            a, b = self.point(spec[0]), self.point(spec[1])
            return a, G.sub(b, a)
        if isinstance(spec, dict) and set(spec) == {'from', 'dir'}:
            return self.point(spec['from']), self.direction(spec['dir'], where)
        raise RecipeError(f'{where}: bad line {spec!r}; use [A, B] or {{from: A, dir: ...}}')

    def pick(self, cands, spec, where, line_dir=None, ordered=False):
        if not cands:
            raise RecipeError(f'{where}: no intersection')
        if len(cands) == 1 and spec is None:
            return cands[0]
        if spec is None:
            raise RecipeError(f'{where}: {len(cands)} intersections and no pick '
                              f'({[(round(c[0], 3), round(c[1], 3)) for c in cands]})')
        if isinstance(spec, str):
            keyf = {'upper': lambda c: c[1], 'lower': lambda c: -c[1],
                    'left': lambda c: c[0], 'right': lambda c: -c[0]}.get(spec)
            if keyf:
                ranked = sorted(cands, key=keyf)
                if len(ranked) > 1 and abs(keyf(ranked[0]) - keyf(ranked[1])) < 1e-6:
                    raise RecipeError(f'{where}: pick {spec!r} cannot separate the intersections')
                return ranked[0]
            if spec in ('forward', 'backward') and line_dir is not None:
                return cands[-1] if spec == 'forward' else cands[0]
            if spec in ('first', 'last') and ordered:
                return cands[0] if spec == 'first' else cands[-1]
        if isinstance(spec, dict) and len(spec) == 1:
            (k, v), = spec.items()
            if k in ('near', 'far'):
                ref = self.point(v)
                ranked = sorted(cands, key=lambda c: G.dist(c, ref), reverse=(k == 'far'))
                return ranked[0]
            if k == 'toward':
                d = self.direction(v, where)
                ranked = sorted(cands, key=lambda c: -G.dot(c, d))
                if len(ranked) > 1 and abs(G.dot(ranked[0], d) - G.dot(ranked[1], d)) < 1e-6 * G.norm(d):
                    raise RecipeError(f'{where}: pick {spec!r} cannot separate the intersections')
                return ranked[0]
        raise RecipeError(f'{where}: bad pick {spec!r}; use upper/lower/left/right, forward/backward '
                          '(circle_line), first/last (path_x), {near: P}, {far: P} or {toward: DIR}')

    # ---- paths ----
    def path(self, name):
        if name in self.paths:
            return self.paths[name]
        if name not in self.path_defs:
            raise RecipeError(f'unknown path {name!r}')
        self._enter('path ' + name)
        try:
            self.paths[name] = self.segments(self.path_defs[name], f'path {name!r}')
        finally:
            self.stack.pop()
        return self.paths[name]

    def segments(self, segs, where):
        if not isinstance(segs, list) or not segs:
            raise RecipeError(f'{where}: expected a non-empty list of segments')
        out = []
        for i, seg in enumerate(segs):
            w = f'{where} segment {i}'
            if not isinstance(seg, dict) or len(seg) != 1 or next(iter(seg)) not in SEGMENTS:
                raise RecipeError(f'{w}: expected one of {sorted(SEGMENTS)}')
            (kind, a), = seg.items()
            try:
                pts = self._segment(kind, a, w)
            except G.GeomError as e:
                raise RecipeError(f'{w}: {e}') from None
            if out:
                gap = G.dist(out[-1], pts[0])
                if gap > JOIN_TOL:
                    raise RecipeError(f'{w}: starts {gap:.4f} cm from the previous segment end')
                pts = pts[1:]
            out.extend(pts)
        return out

    def _segment(self, kind, a, w):
        if kind in ('line', 'polyline'):
            if not isinstance(a, list) or len(a) < 2 or (kind == 'line' and len(a) != 2):
                raise RecipeError(f'{w}: {kind} takes a list of point names')
            return [self.point(n) for n in a]
        if kind == 'bezier':
            if not isinstance(a, list) or len(a) != 4:
                raise RecipeError(f'{w}: bezier takes [start, ctrl1, ctrl2, end]')
            return G.bezier_points(*[self.point(n) for n in a])
        if kind == 'arc':
            if not isinstance(a, dict) or {'center', 'from', 'to'} - set(a) or set(a) - {'center', 'from', 'to', 'way'}:
                raise RecipeError(f'{w}: arc takes {{center, from, to, way?}}')
            return G.arc_points(self.point(a['center']), self.point(a['from']), self.point(a['to']),
                                a.get('way', 'short'))
        if kind == 'subpath':
            if not isinstance(a, dict) or set(a) != {'name', 'from', 'to'}:
                raise RecipeError(f'{w}: subpath takes {{name, from, to}}')
            return G.subpolyline(self.path(str(a['name'])), self.point(a['from']), self.point(a['to']))
        if kind == 'arc_chain':
            if not isinstance(a, dict) or set(a) != {'polygon', 'touch'}:
                raise RecipeError(f'{w}: arc_chain takes {{polygon: [...], touch: [...]}}')
            pts, breaks = G.arc_chain([self.point(n) for n in a['polygon']], [self.point(n) for n in a['touch']])
            self.arc_breaks.append((w, breaks))
            return pts
        if kind == 'trace':
            if not isinstance(a, dict) or {'from', 'to'} - set(a) or set(a) - {'from', 'to', 'via', 'bridge', 'onto',
                                                                              'drawing'}:
                raise RecipeError(f'{w}: trace takes {{from, to, via?, bridge?, onto?, drawing?}}')
            traces = self.traces_for(a.get('drawing'), w)
            stops = [a['from']] + list(a.get('via') or []) + [a['to']]
            bridge = self.scalar(a.get('bridge', 0), w)
            out, joined = [], []
            for u, v in zip(stops, stops[1:]):
                pts, gaps = self._trace_route(self.point(u), self.point(v), bridge, w, traces)
                out.extend(pts[1:] if out else pts)
                joined += gaps
            if joined:
                self.interps.append((w, f'trace gaps joined by straight lines: '
                                        + ', '.join(f'{g:.2f}' for g in joined) + ' cm'))
            if 'onto' in a:
                if not (isinstance(a['onto'], list) and len(a['onto']) == 2):
                    raise RecipeError(f'{w}: trace.onto takes [P2, Q2]')
                p0, q0 = out[0], out[-1]
                p2, q2 = self.point(a['onto'][0]), self.point(a['onto'][1])
                c0, c2 = complex(*G.sub(q0, p0)), complex(*G.sub(q2, p2))
                if abs(c0) < 1e-9:
                    raise RecipeError(f'{w}: trace.onto needs a route with distinct ends')
                k = c2 / c0
                out = [(p2[0] + z.real, p2[1] + z.imag) for z in (complex(*G.sub(v, p0)) * k for v in out)]
                self.interps.append((w, f'traced curve set onto {a["onto"][0]}–{a["onto"][1]}: scale '
                                        f'{abs(k):.4f}, turned {math.degrees(math.atan2(k.imag, k.real)):+.2f}°'))
            return out
        if kind == 'path':
            if isinstance(a, str):
                return list(self.path(a))
            if isinstance(a, dict) and set(a) <= {'name', 'reverse'} and 'name' in a:
                pts = list(self.path(a['name']))
                return pts[::-1] if a.get('reverse') else pts
            raise RecipeError(f'{w}: path takes a name or {{name, reverse?}}')
        raise RecipeError(f'{w}: unknown segment {kind!r}')
