"""2D geometry for drafting constructions. Pure Python, points are (x, y) tuples.

Coordinates follow the drafting convention used throughout the project:
cm, x to the right, y DOWN the page. So "upper" means smaller y, and a
positive rotation angle turns clockwise on the page (standard math rotation
applied in a y-down frame).

Every function either returns an exact construction or raises GeomError:
nothing here picks a "reasonable" answer when the construction is degenerate.
"""
import math

EPS = 1e-9


class GeomError(ValueError):
    pass


def add(a, b): return (a[0] + b[0], a[1] + b[1])
def sub(a, b): return (a[0] - b[0], a[1] - b[1])
def mul(a, k): return (a[0] * k, a[1] * k)
def dot(a, b): return a[0] * b[0] + a[1] * b[1]
def cross(a, b): return a[0] * b[1] - a[1] * b[0]
def norm(a): return math.hypot(a[0], a[1])
def dist(a, b): return norm(sub(a, b))


def unit(v):
    n = norm(v)
    if n < EPS:
        raise GeomError('zero-length direction')
    return (v[0] / n, v[1] / n)


def perp(v):
    """v turned +90° in the y-down frame (clockwise on the page): (x, y) -> (-y, x)."""
    return (-v[1], v[0])


def offset(p, d, length):
    return add(p, mul(unit(d), length))


def lerp(a, b, t):
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


def line_x(p1, d1, p2, d2):
    """Intersection of line p1 + s·d1 with line p2 + t·d2."""
    den = cross(d1, d2)
    if abs(den) < EPS * norm(d1) * norm(d2) + EPS:
        raise GeomError('lines are parallel')
    s = cross(sub(p2, p1), d2) / den
    return add(p1, mul(d1, s))


def perp_foot(p, a, d):
    """Foot of the perpendicular from p to the line a + t·d."""
    u = unit(d)
    return add(a, mul(u, dot(sub(p, a), u)))


def circle_line(c, r, p, d):
    """Intersections of circle (c, r) with line p + t·d, ordered by t. 0, 1 or 2 points."""
    if r < 0:
        raise GeomError(f'negative radius {r}')
    u = unit(d)
    f = perp_foot(c, p, u)
    h2 = r * r - dist(c, f) ** 2
    if h2 < -1e-9 * max(1.0, r * r):
        return []
    if h2 <= 1e-12 * max(1.0, r * r):
        return [f]
    h = math.sqrt(h2)
    return [sub(f, mul(u, h)), add(f, mul(u, h))]


def circle_circle(c1, r1, c2, r2):
    """Intersections of two circles. 0, 1 or 2 points."""
    dvec = sub(c2, c1)
    dd = norm(dvec)
    if dd < EPS:
        raise GeomError('concentric circles')
    if dd > r1 + r2 + 1e-9 or dd < abs(r1 - r2) - 1e-9:
        return []
    a = (r1 * r1 - r2 * r2 + dd * dd) / (2 * dd)
    h2 = r1 * r1 - a * a
    u = mul(dvec, 1 / dd)
    m = add(c1, mul(u, a))
    if h2 <= 1e-12 * max(1.0, r1 * r1):
        return [m]
    h = math.sqrt(h2)
    return [add(m, mul(perp(u), h)), sub(m, mul(perp(u), h))]


def rotate(p, c, deg):
    """Rotate p about c by deg (positive = clockwise on a y-down page)."""
    t = math.radians(deg)
    v = sub(p, c)
    return add(c, (v[0] * math.cos(t) - v[1] * math.sin(t), v[0] * math.sin(t) + v[1] * math.cos(t)))


def mirror(p, a, d):
    """Reflect p across the line a + t·d."""
    f = perp_foot(p, a, d)
    return sub(mul(f, 2), p)


def angle_deg(a, vertex, b):
    """Signed angle from vertex→a to vertex→b, degrees, positive = clockwise on the page."""
    va, vb = sub(a, vertex), sub(b, vertex)
    return math.degrees(math.atan2(cross(va, vb), dot(va, vb)))


ARC_SAG = 1e-5   # cm: max distance between an arc and its sampling chords


def arc_points(c, a, b, way='short', n=None):
    """Sample the arc about c from a to b. |c-a| must equal |c-b|.

    way: 'short' / 'long' (by arc length), 'cw' / 'ccw' (on the page).
    n: number of chords; by default enough that no chord strays more than
    ARC_SAG from the true arc, so lengths and path intersections on arcs are
    exact to ~1e-5 cm.
    """
    r = dist(c, a)
    if abs(dist(c, b) - r) > 1e-4:
        raise GeomError(f'arc end is off the circle: |c-a|={r:.4f}, |c-b|={dist(c, b):.4f}')
    t0 = math.atan2(a[1] - c[1], a[0] - c[0])
    t1 = math.atan2(b[1] - c[1], b[0] - c[0])
    cw = (t1 - t0) % (2 * math.pi)          # increasing atan2 angle = clockwise on a y-down page
    ccw = cw - 2 * math.pi
    if way == 'cw':
        sweep = cw
    elif way == 'ccw':
        sweep = ccw
    elif way == 'short':
        sweep = cw if cw <= math.pi else ccw
    elif way == 'long':
        sweep = cw if cw > math.pi else ccw
    else:
        raise GeomError(f'unknown arc way {way!r}')
    if n is None:
        step = 2 * math.acos(max(-1.0, 1 - ARC_SAG / r)) if r > ARC_SAG else math.pi
        n = max(16, math.ceil(abs(sweep) / step))
    pts = [(c[0] + r * math.cos(t0 + sweep * i / n), c[1] + r * math.sin(t0 + sweep * i / n))
           for i in range(n + 1)]
    pts[0], pts[-1] = a, b
    return pts


def bezier_points(p0, p1, p2, p3, n=48):
    out = []
    for i in range(n + 1):
        t = i / n
        mt = 1 - t
        out.append((mt ** 3 * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t ** 3 * p3[0],
                    mt ** 3 * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t ** 3 * p3[1]))
    return out


def polylen(pts):
    return sum(dist(pts[i], pts[i + 1]) for i in range(len(pts) - 1))


def polyline_line_x(pts, p, d):
    """Crossings of a polyline with the infinite line p + t·d, in order along the polyline."""
    out = []
    for i in range(len(pts) - 1):
        a, b = pts[i], pts[i + 1]
        sa, sb = cross(d, sub(a, p)), cross(d, sub(b, p))
        if sa == sb:
            continue                       # segment parallel to the line (or degenerate)
        if sa * sb > 0:
            continue
        q = lerp(a, b, sa / (sa - sb))
        if not out or dist(out[-1], q) > 1e-9:
            out.append(q)
    return out


def locate(pts, q, tol=1e-6):
    """(segment index, fraction) of point q on a polyline, or None."""
    best = None
    for i in range(len(pts) - 1):
        a, b = pts[i], pts[i + 1]
        ab = sub(b, a)
        L2 = dot(ab, ab)
        t = 0.0 if L2 == 0 else max(0.0, min(1.0, dot(sub(q, a), ab) / L2))
        e = dist(q, lerp(a, b, t))
        if e <= tol and (best is None or e < best[2]):
            best = (i, t, e)
    return None if best is None else best[:2]


def along_polyline(pts, q, d, tol=1e-6):
    """The point d along a polyline from q (on it): d > 0 toward its end, d < 0 toward its start."""
    loc = locate(pts, q, tol)
    if loc is None:
        raise GeomError('path_at: the start point is not on the path')
    i, t = loc
    if d >= 0:
        cur, rest, seq = lerp(pts[i], pts[i + 1], t), d, pts[i + 1:]
    else:
        cur, rest, seq = lerp(pts[i], pts[i + 1], t), -d, pts[i::-1]
    for nxt in seq:
        L = dist(cur, nxt)
        if L >= rest:
            return lerp(cur, nxt, rest / L) if L else cur
        rest -= L
        cur = nxt
    raise GeomError(f'path_at: the path ends {rest:.4f} short of the distance')


def subpolyline(pts, q0, q1, tol=1e-6):
    """Portion of a polyline from q0 to q1 (both on it); reversed when q1 comes first."""
    l0, l1 = locate(pts, q0, tol), locate(pts, q1, tol)
    if l0 is None or l1 is None:
        raise GeomError('sub-path end is not on the path')
    rev = l1 < l0
    if rev:
        l0, l1, q0, q1 = l1, l0, q1, q0
    mid = pts[l0[0] + 1:l1[0] + 1]
    seg = [q0] + [p for p in mid if dist(p, q0) > 1e-12 and dist(p, q1) > 1e-12] + [q1]
    return seg[::-1] if rev else seg


def arc_chain(polygon, touch):
    """ЕМКО unified arc method (т.3 appendix p. 126, Fig. 36), generic form.

    polygon p0..pk is the tangent polygon, with pk the end the book numbers from
    (355 for the sleeve cap); touch[i] is the touch point on side i. The curve runs
    straight p0 → touch[0], then one arc per pair of neighbouring touch points, and
    finally straight to pk. Each arc goes exactly from touch[i] to touch[i+1]. Its
    radius is |touch[i+1] − п|, where п is where the normals at the two touch points
    meet; the radius is measured from the touch point on the pk side (the book's
    R1 = |1–п1| for the arc 1–2, counting from 355). Its centre is where two arcs of
    that radius, drawn from both touch points, cross ("методом засечек"), taking the
    crossing nearer п. Returns (points, breaks), where breaks[i] is the tangent break
    in degrees where arc i ends: the book's arcs are only approximately tangent.
    """
    if len(touch) != len(polygon) - 1 or len(polygon) < 3:
        raise GeomError('arc_chain needs k+1 polygon points and k touch points (k ≥ 2)')
    sides = [sub(polygon[i + 1], polygon[i]) for i in range(len(polygon) - 1)]
    out, arcs = [polygon[0], touch[0]], []
    for k in range(len(sides) - 1):
        a, b = touch[k], touch[k + 1]
        n = line_x(a, perp(sides[k]), b, perp(sides[k + 1]))
        r = dist(b, n)
        cs = circle_circle(a, r, b, r)
        if not cs:
            raise GeomError(f'arc {k}: radius {r:.3f} is shorter than half the chord {dist(a, b) / 2:.3f}')
        c = min(cs, key=lambda q: dist(q, n))
        out.extend(arc_points(c, a, b, 'short')[1:])
        arcs.append(c)
    out.append(polygon[-1])
    breaks = []
    for k, c in enumerate(arcs):
        b = touch[k + 1]
        here = perp(sub(b, c))                                     # tangent of arc k at its end
        nxt = sides[k + 1] if k + 1 == len(arcs) else perp(sub(b, arcs[k + 1]))
        cosang = abs(dot(unit(here), unit(nxt)))
        breaks.append(math.degrees(math.acos(min(1.0, cosang))))
    return out, breaks
