import math

import pytest

from ccat import geom as G


def close(a, b, tol=1e-9):
    return abs(a[0] - b[0]) < tol and abs(a[1] - b[1]) < tol


def test_line_x_and_parallel():
    assert close(G.line_x((0, 0), (1, 1), (0, 2), (1, -1)), (1, 1))
    with pytest.raises(G.GeomError):
        G.line_x((0, 0), (1, 0), (0, 1), (2, 0))


def test_perp_foot_and_mirror():
    assert close(G.perp_foot((3, 4), (0, 0), (1, 0)), (3, 0))
    assert close(G.mirror((3, 4), (0, 0), (1, 0)), (3, -4))


def test_circle_line_roots_ordered_along_line():
    two = G.circle_line((0, 0), 5, (-10, 3), (1, 0))
    assert len(two) == 2 and close(two[0], (-4, 3)) and close(two[1], (4, 3))
    assert len(G.circle_line((0, 0), 5, (-10, 5), (1, 0))) == 1     # tangent
    assert G.circle_line((0, 0), 5, (-10, 6), (1, 0)) == []


def test_circle_circle():
    pts = G.circle_circle((0, 0), 5, (8, 0), 5)
    assert sorted(round(p[1], 9) for p in pts) == [-3, 3] and all(abs(p[0] - 4) < 1e-9 for p in pts)
    assert G.circle_circle((0, 0), 1, (10, 0), 1) == []
    with pytest.raises(G.GeomError):
        G.circle_circle((0, 0), 1, (0, 0), 2)


def test_rotation_is_clockwise_on_a_y_down_page():
    # (1, 0) rotated +90° about the origin points down the page: (0, 1)
    assert close(G.rotate((1, 0), (0, 0), 90), (0, 1))
    assert close(G.perp((1, 0)), (0, 1))
    assert G.angle_deg((1, 0), (0, 0), (0, 1)) == pytest.approx(90)


def test_arc_lengths_and_off_circle():
    q = G.arc_points((0, 0), (5, 0), (0, 5), 'short')
    assert G.polylen(q) == pytest.approx(math.pi * 5 / 2, rel=1e-3)
    l = G.arc_points((0, 0), (5, 0), (0, 5), 'long')
    assert G.polylen(l) == pytest.approx(math.pi * 5 * 1.5, rel=1e-3)
    assert q[-1] == (0, 5)
    with pytest.raises(G.GeomError):
        G.arc_points((0, 0), (5, 0), (0, 6))


def test_bezier_straight_and_unit_zero():
    assert G.polylen(G.bezier_points((0, 0), (1, 0), (2, 0), (3, 0))) == pytest.approx(3)
    with pytest.raises(G.GeomError):
        G.unit((0, 0))


def test_arc_chain_runs_each_arc_between_touch_points():
    """ЕМКО p. 126: radius |touch − п| (from the touch on the end side), centre by two arcs."""
    poly = [(0.0, 0.0), (2.0, -3.0), (6.0, -4.0), (9.0, -2.0)]
    touch = [G.lerp(poly[i], poly[i + 1], 0.5) for i in range(3)]
    pts, breaks = G.arc_chain(poly, touch)
    assert pts[0] == poly[0] and pts[-1] == poly[-1] and len(breaks) == 2
    for t in touch:                                              # every touch point lies on the curve
        assert min(G.dist(q, t) for q in pts) < 1e-9
    a, b = touch[0], touch[1]
    n = G.line_x(a, G.perp(G.sub(poly[1], poly[0])), b, G.perp(G.sub(poly[2], poly[1])))
    r = G.dist(b, n)
    i, j = pts.index(a), pts.index(b)
    c = G.circle_circle(a, r, b, r)
    c = min(c, key=lambda q: G.dist(q, n))
    assert all(abs(G.dist(q, c) - r) < 1e-6 for q in pts[i:j + 1])


def test_arc_chain_stops_when_the_radius_cannot_span_the_chord():
    # touch 0 hugs the corner, touch 1 is far along the next side: the normals meet 0.1 from
    # touch 1, so the radius (0.1) can't span the 5 cm chord
    poly = [(0.0, 0.0), (0.0, -10.0), (10.0, -10.0)]
    touch = [(0.0, -9.9), (5.0, -10.0)]
    with pytest.raises(G.GeomError, match='half the chord'):
        G.arc_chain(poly, touch)
