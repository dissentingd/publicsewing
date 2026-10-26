"""GarmentCode export: a gated pattern → a GarmentCode pattern specification (JSON),
for a 3D drape in the garmentcode container. Pure Python.

Two recipe sections drive it (both merged through `extends:` like `points:`):

    seams:                        # what sews to what; a run lists named outline points in order
      shoulder:
        a: [{piece: imk_back, along: ["121", "122'"]}, {piece: imk_back, along: ["122", "14'"]}]
        b: [{piece: imk_front, along: ["16", "14\""]}]
      armhole:                    # a side may span pieces; anchors pin points that must meet
        a: [...]
        b: [...]
        anchors: [[s14, "14\""], ...]
      centre_back: {a: [{piece: imk_back, along: [...]}], mirror: true}   # right copy to left copy

    drape:
      body: m_smpl_average_A40
      pieces:                     # placement of the RIGHT-hand copy; the left is its mirror
        imk_back: {origin: ["11", "11"], map: [[-1, 0], [0, -1]], ccw: false,
                   rotation: [0, 0, 0], translation: [0, 152.5, -16]}

A run follows the piece's drafted outline (darts left open: they are sewn as seams)
from its first named point through the others, the short way round. Both sides of a
seam are resampled to edges of about STEP cm and stitched edge to edge. GarmentCode
sews edge 1's end to edge 2's start, i.e. the two outlines must run along the seam
in opposite directions; that holds when every panel's outward face points away from
the body, so a seam where they run the same way stops the export (placement or
winding error) instead of producing a twisted drape.

`close_darts: [[run]]` on a piece closes those dart runs across their mouths on the
drape panel (e.g. a dart whose bent legs cross, which a simple panel can't hold);
such a dart's shaping is then not in the drape.

`map` takes drafting coordinates (x right, y down, minus the origin) to the panel's
2D frame (y up); `ccw` is the winding that makes the panel face outward after
`rotation` (degrees, about x/y/z). Left copies negate x, mirror the rotation about
y and z and the translation's x, and keep the winding.
"""
import math

from . import geom as G
from .recipe import RecipeError

STEP = 1.0        # cm, target edge length on seams and free edges
NAME_TOL = 1e-6   # cm, a named point must be an outline vertex


def _outline(pattern, name, where, close=()):
    """A piece's drafted outline as a vertex loop, with the dart runs in `close` (a
    drape spec's `close_darts`) closed across their mouths."""
    if name not in pattern.pieces:
        raise RecipeError(f'{where}: unknown piece {name!r}')
    pts = list(pattern.pieces[name])
    if close:
        from .export import _close_darts
        pts, _, _ = _close_darts(pattern, pts, close, where)
    if G.dist(pts[0], pts[-1]) < NAME_TOL:
        pts = pts[:-1]
    out = [pts[0]]
    for p in pts[1:]:                                       # drop zero-length steps
        if G.dist(p, out[-1]) > NAME_TOL:
            out.append(p)
    if G.dist(out[0], out[-1]) < NAME_TOL:
        out.pop()
    return out


def _index(pattern, loop, point, where):
    if point not in pattern.points:
        raise RecipeError(f'{where}: unknown point {point!r}')
    hits = [i for i, q in enumerate(loop) if G.dist(q, pattern.points[point]) < NAME_TOL]
    if len(hits) != 1:
        raise RecipeError(f'{where}: point {point!r} is not a single vertex of the outline')
    return hits[0]


def _walk(n, i, j):
    """The two index paths from i to j on a loop of n vertices: (forward, backward)."""
    fwd = [i]
    while fwd[-1] != j:
        fwd.append((fwd[-1] + 1) % n)
    bwd = [i]
    while bwd[-1] != j:
        bwd.append((bwd[-1] - 1) % n)
    return fwd, bwd


def _run(pattern, loops, run, where):
    """A run → (piece, [outline indices]) following the short way through each named point."""
    piece, along = str(run.get('piece')), [str(p) for p in run.get('along') or []]
    if set(run) != {'piece', 'along'} or len(along) < 2:
        raise RecipeError(f'{where}: a run is {{piece, along: [point, point, ...]}}')
    loop = loops.setdefault(piece, _outline(pattern, piece, where))
    idx = [_index(pattern, loop, p, f'{where} {piece}') for p in along]
    path = [idx[0]]
    for i, j in zip(idx, idx[1:]):
        fwd, bwd = _walk(len(loop), i, j)
        path += min(fwd, bwd, key=lambda w: _length([loop[k] for k in w]))[1:]     # shorter in cm
    if len(set(path)) != len(path):
        raise RecipeError(f'{where}: run {along} on {piece!r} crosses itself')
    return piece, path


def _length(pts):
    return sum(G.dist(a, b) for a, b in zip(pts, pts[1:]))


def _at(pts, s):
    """Point at arc length s along a polyline."""
    for a, b in zip(pts, pts[1:]):
        d = G.dist(a, b)
        if s <= d or b is pts[-1]:
            t = 0.0 if d == 0 else min(1.0, s / d)
            return (a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]))
        s -= d
    return pts[-1]


def _resample(pts, n):
    L = _length(pts)
    return [pts[0]] + [_at(pts, L * k / n) for k in range(1, n)] + [pts[-1]]


class _Side:
    """One side of a seam: consecutive runs, as (piece, outline indices) segments."""

    def __init__(self, pattern, loops, runs, where):
        if not isinstance(runs, list) or not runs:
            raise RecipeError(f'{where}: expected a list of runs')
        self.parts = [_run(pattern, loops, r, f'{where} run {k}') for k, r in enumerate(runs)]
        self.loops = loops

    def pts(self, part):
        piece, path = part
        return [self.loops[piece][i] for i in path]

    def cuts(self):
        """Arc-length positions where the side passes from one run to the next."""
        out, s = [], 0.0
        for part in self.parts[:-1]:
            s += _length(self.pts(part))
            out.append(s)
        return out

    def total(self):
        return sum(_length(self.pts(p)) for p in self.parts)

    def position(self, pattern, point, where):
        """Arc-length position of a named point on this side."""
        s = 0.0
        for part in self.parts:
            pts = self.pts(part)
            for k, q in enumerate(pts):
                if G.dist(q, pattern.points[point]) < NAME_TOL:
                    return s + _length(pts[:k + 1])
            s += _length(pts)
        raise RecipeError(f'{where}: anchor {point!r} is not on this side')

    def pieces_between(self, s0, s1):
        """[(piece, polyline)] covering arc length s0..s1 (s0 < s1), one entry per run touched."""
        out, s = [], 0.0
        for piece, path in self.parts:
            pts = [self.loops[piece][i] for i in path]
            L = _length(pts)
            a, b = max(s0, s), min(s1, s + L)
            if b - a > 1e-9:
                out.append((piece, path, a - s, b - s))
            s += L
        return out


def _segments(side_a, side_b, anchors):
    """Split both sides at anchors and at every run boundary of either side (mapped
    proportionally between anchors), so each segment pair is single-run on both sides."""
    knots = [(0.0, 0.0)] + sorted(anchors) + [(side_a.total(), side_b.total())]
    pairs = []
    for (a0, b0), (a1, b1) in zip(knots, knots[1:]):
        if a1 - a0 <= 1e-9 or b1 - b0 <= 1e-9:
            raise RecipeError('seam anchors must be in the same order on both sides')
        to_b = lambda s: b0 + (s - a0) * (b1 - b0) / (a1 - a0)        # noqa: E731
        to_a = lambda s: a0 + (s - b0) * (a1 - a0) / (b1 - b0)        # noqa: E731
        cuts = {a0, a1} | {c for c in side_a.cuts() if a0 < c < a1} | {to_a(c) for c in side_b.cuts() if b0 < c < b1}
        cs = sorted(cuts)
        pairs += [((u, v), (to_b(u), to_b(v))) for u, v in zip(cs, cs[1:]) if v - u > 1e-6]
    return pairs


def _cut(side, s0, s1):
    """The single run covering s0..s1 of a side, as (piece, start index, end index, polyline)."""
    hits = side.pieces_between(s0, s1)
    if len(hits) != 1:
        raise RecipeError('internal: seam segment spans runs')
    piece, path, a, b = hits[0]
    pts = [side.loops[piece][i] for i in path]
    return piece, path, a, b, pts


def _sub(pts, a, b):
    """Polyline of pts between arc lengths a and b."""
    out, s = [_at(pts, a)], 0.0
    for p, q in zip(pts, pts[1:]):
        s += G.dist(p, q)
        if a < s < b:
            out.append(q)
    out.append(_at(pts, b))
    return out


def build_spec(pattern):
    """Gated pattern → GarmentCode specification dict. Raises RecipeError on any spec problem."""
    drape = pattern.recipe.get('drape')
    seams = pattern.recipe.get('seams') or {}
    if not isinstance(drape, dict) or set(drape) - {'body', 'pieces', 'note'} or 'pieces' not in drape:
        raise RecipeError('drape: expected {body, pieces}')
    specs = {str(k): v for k, v in drape['pieces'].items()}
    loops = {name: _outline(pattern, name, f'drape {name!r}', (sp or {}).get('close_darts') or ())
             for name, sp in specs.items() if isinstance(sp, dict)}
    # 1. every seam, both sides cut into matched segments: per piece, the stretches of its
    #    loop that are stitched, keyed by (start index, end index) → resampled polyline
    plan = {}                 # piece -> list of (i0, i1, pts, stitch key, side)
    links = []                # (key, n edges)
    for sname, s in seams.items():
        where = f'seam {sname!r}'
        if not isinstance(s, dict) or set(s) - {'a', 'b', 'anchors', 'mirror', 'note'}:
            raise RecipeError(f'{where}: expected {{a, b?, anchors?, mirror?}}')
        mirror = bool(s.get('mirror'))
        if mirror == ('b' in s):
            raise RecipeError(f'{where}: give either b, or mirror: true')
        A = _Side(pattern, loops, s['a'], f'{where} a')
        B = A if mirror else _Side(pattern, loops, s['b'], f'{where} b')
        anchors = [(A.position(pattern, str(p), where), B.position(pattern, str(q), where))
                   for p, q in (s.get('anchors') or [])]
        for k, ((a0, a1), (b0, b1)) in enumerate(_segments(A, B, anchors)):
            pa, path_a, ua, va, pts_a = _cut(A, a0, a1)
            pb, path_b, ub, vb, pts_b = _cut(B, b0, b1)
            n = max(1, math.ceil(max(a1 - a0, b1 - b0) / STEP))
            if pa == pb and not mirror:
                n = 1        # a dart: one edge per leg, as GarmentCode's own darts (it rejects
                             # more than one same-panel vertex merge per vertex)
            key = (sname, k)
            plan.setdefault(pa, []).append((path_a, ua, va, _resample(_sub(pts_a, ua, va), n), key, 'a'))
            if not mirror:
                plan.setdefault(pb, []).append((path_b, ub, vb, _resample(_sub(pts_b, ub, vb), n), key, 'b'))
            links.append((key, n, mirror, pa, pb))
    # 2. per piece, rebuild the loop: stitched stretches resampled, free stretches at ~STEP
    missing = sorted(set(plan) - set(specs))
    if missing:
        raise RecipeError(f'drape: pieces in seams without a placement: {missing}')
    panels, marks = {}, {}
    for piece, spec in specs.items():
        where = f'drape {piece!r}'
        loop = loops.setdefault(piece, _outline(pattern, piece, where))
        verts, mk = _rebuild(loop, plan.get(piece, []), where)
        local, flipped = _place(pattern, verts, spec, where)
        if flipped:                                       # winding reversed: vertex i -> (-i) mod n
            mk = {k: [(-i) % len(local) for i in v] for k, v in mk.items()}
        panels[piece], marks[piece] = local, mk
    # 3. right and left copies, edges and stitches
    out_panels, stitches, order = {}, [], []
    for piece, spec in specs.items():
        for side in ('r', 'l'):
            name = f'{piece}_{side}'
            verts = panels[piece] if side == 'r' else [(-x, y) for x, y in panels[piece]]
            if side == 'l':
                verts = [verts[0]] + verts[1:][::-1]           # keep the winding
            rot = list(map(float, spec.get('rotation', [0, 0, 0])))
            tr = list(map(float, spec['translation']))
            if side == 'l':
                rot, tr = [rot[0], -rot[1], -rot[2]], [-tr[0], tr[1], tr[2]]
            out_panels[name] = {'translation': tr, 'rotation': rot,
                                'vertices': [[round(x, 4), round(y, 4)] for x, y in verts],
                                'edges': [{'endpoints': [i, (i + 1) % len(verts)]} for i in range(len(verts))]}
            order.append(name)
    nv = {p: len(panels[p]) for p in panels}
    for key, n, mirror, pa, pb in links:
        ia = marks[pa][(key, 'a')]                     # loop indices of the stretch, in run order
        ib = marks[pa][(key, 'a')] if mirror else marks[pb][(key, 'b')]
        for side in ('r', 'l'):
            sa = side
            sb = ('l' if side == 'r' else None) if mirror else side
            if sb is None:
                continue
            ea = _edges_along(ia, nv[pa], sa)
            eb = _edges_along(ib, nv[pb if not mirror else pa], sb)
            if ea[1] == eb[1]:
                raise RecipeError(f'seam {key[0]!r}: both outlines run the same way along it '
                                  f'({pa}_{sa} and {pb if not mirror else pa}_{sb}); check placement and ccw')
            for k in range(n):                            # resampled point k meets point k
                stitches.append([{'panel': f'{pa}_{sa}', 'edge': ea[0][k]},
                                 {'panel': f'{pb if not mirror else pa}_{sb}', 'edge': eb[0][k]}])
    return {'pattern': {'panels': out_panels, 'stitches': stitches, 'panel_order': order},
            'parameters': {}, 'parameter_order': [],
            'properties': {'curvature_coords': 'relative', 'normalize_panel_translation': False,
                           'normalized_edge_loops': True, 'units_in_meter': 100}}


def _edges_along(idx, n, side):
    """Edges covering consecutive loop indices idx (run order) in the r or l copy of a panel.
    Returns (edge indices in run order, direction): +1 if the panel's outline runs the same
    way as the run, -1 if against it."""
    if side == 'l':                                     # left copy: vertex i -> (-i) mod n, order reversed
        idx = [(-i) % n for i in idx]
    step = (idx[1] - idx[0]) % n
    if step == 1:
        return [idx[k] for k in range(len(idx) - 1)], 1
    if step == n - 1:
        return [idx[k + 1] for k in range(len(idx) - 1)], -1
    raise RecipeError('internal: stretch indices are not consecutive')


def _rebuild(loop, stretches, where):
    """New vertex loop with each stitched stretch replaced by its resampled points and the free
    stretches resampled at ~STEP. Returns (vertices, {(key, side): [loop indices in run order]})."""
    n = len(loop)
    # each stretch occupies an interval of the original loop between two arc positions on a path
    owned = []                                        # (start pos, end pos along loop, pts, key, side, forward)
    perim = [0.0]
    for i in range(n):
        perim.append(perim[-1] + G.dist(loop[i], loop[(i + 1) % n]))
    P = perim[-1]

    def loop_pos(path, u):
        """Loop arc position of arc length u along the path (a run of loop indices)."""
        fwd = path[1] == (path[0] + 1) % n if len(path) > 1 else True
        s = 0.0
        for a, b in zip(path, path[1:]):
            d = G.dist(loop[a], loop[b])
            if u <= s + d + 1e-12:
                t = (u - s)
                return (perim[a] + t) % P if fwd else (perim[a] - t) % P
            s += d
        return perim[path[-1]] % P

    for path, u, v, pts, key, side in stretches:
        fwd = len(path) < 2 or path[1] == (path[0] + 1) % n
        p0, p1 = loop_pos(path, u), loop_pos(path, v)
        if not fwd:
            p0, p1, pts = p1, p0, pts[::-1]
        owned.append((p0, p1, pts, key, side, fwd))
    owned.sort(key=lambda o: o[0])
    if not owned:
        return _resample(loop + [loop[0]], max(3, math.ceil(P / STEP)))[:-1], {}
    verts, marks = [], {}
    start = owned[0][0]
    for k, (p0, p1, pts, key, side, fwd) in enumerate(owned):
        i0 = len(verts)
        verts += pts[:-1]
        idx = list(range(i0, i0 + len(pts)))         # last index = first vertex of what follows
        marks[(key, side)] = idx if fwd else idx[::-1]
        nxt = owned[(k + 1) % len(owned)][0]
        gap = (nxt - p1) % P
        if gap > P - 1e-6:                            # adjacent stretches, rounding put nxt a hair before p1
            gap = 0.0
        if gap > 1e-6:                                # free stretch: resample along the loop
            free = _loop_slice(loop, perim, P, p1, nxt)
            m = max(1, math.ceil(gap / STEP))
            verts += _resample(free, m)[:-1]
        elif gap < -1e-6:
            raise RecipeError(f'{where}: seams overlap on the outline')
    total = len(verts)
    for key in marks:
        marks[key] = [i % total for i in marks[key]]
    return verts, marks


def _loop_slice(loop, perim, P, a, b):
    """Polyline along the loop from arc position a forward to b."""
    n = len(loop)
    pts = [_loop_at(loop, perim, P, a)]
    span = (b - a) % P
    for i in range(n):
        d = (perim[i] - a) % P
        if 1e-9 < d < span - 1e-9:
            pts.append((d, loop[i]))
    inner = [q for _, q in sorted(pts[1:])]
    return [pts[0]] + inner + [_loop_at(loop, perim, P, b)]


def _loop_at(loop, perim, P, s):
    s %= P
    n = len(loop)
    for i in range(n):
        if perim[i] <= s <= perim[i + 1]:
            a, b = loop[i], loop[(i + 1) % n]
            d = perim[i + 1] - perim[i]
            t = 0.0 if d == 0 else (s - perim[i]) / d
            return (a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]))
    return loop[0]


def _place(pattern, verts, spec, where):
    keys = {'origin', 'map', 'ccw', 'rotation', 'translation', 'close_darts', 'note'}
    if not isinstance(spec, dict) or set(spec) - keys or not {'origin', 'map', 'ccw', 'translation'} <= set(spec):
        raise RecipeError(f'{where}: expected {{origin, map, ccw, rotation?, translation}}')
    o = spec['origin']
    if isinstance(o, list) and len(o) == 2 and all(str(n) in pattern.points for n in o):
        ox, oy = pattern.points[str(o[0])][0], pattern.points[str(o[1])][1]     # x of one point, y of another
    elif isinstance(o, str) and o in pattern.points:
        ox, oy = pattern.points[o]
    else:
        raise RecipeError(f'{where}: origin is a point name or [x_of, y_of] point names')
    (a, b), (c, d) = spec['map']
    local = [(a * (x - ox) + b * (y - oy), c * (x - ox) + d * (y - oy)) for x, y in verts]
    area = sum(p[0] * q[1] - q[0] * p[1] for p, q in zip(local, local[1:] + local[:1])) / 2
    if (area > 0) != bool(spec['ccw']):
        return [local[0]] + local[1:][::-1], True
    return local, False
