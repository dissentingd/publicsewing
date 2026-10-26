"""Traced sources: the recipe's trace ops, and the Walker night-shirt on its stored trace
(data/walker/trace/, made in the tools image by scripts/walker_trace.py)."""
from pathlib import Path

import pytest

from ccat import geom as G
from ccat import recipe as R
from ccat.checks import run_checks
from ccat.sources import walker

ROOT = Path(__file__).resolve().parents[1]

# an L of two polylines with a 1 cm gap at the corner, and a separate hook
L_SHAPE = [[[0, 0], [0, 10]], [[1, 10], [5, 10], [10, 12]]]


def build(points, paths=None, traces=L_SHAPE):
    return R.build({'recipe': 't', 'points': points, 'paths': paths or {}}, {'@traces': traces})


def test_trace_near_picks_a_vertex_or_a_feature():
    p = build({'a': {'trace_near': {'at': [0.2, 9.5], 'r': 2}},
               'c': {'trace_near': {'at': [5, 11], 'r': 6, 'pick': 'corner'}},
               'e': {'trace_near': {'at': [9, 9], 'r': 4, 'pick': 'end'}},
               'lo': {'trace_near': {'at': [5, 10], 'r': 6, 'pick': 'lowest'}}}).points
    assert p['a'] == (0.0, 10.0) and p['c'] == (5.0, 10.0) and p['e'] == (10.0, 12.0) and p['lo'] == (10.0, 12.0)


def test_trace_near_stops_when_nothing_is_in_reach():
    with pytest.raises(R.RecipeError, match='no traced vertex'):
        build({'a': {'trace_near': {'at': [30, 30], 'r': 1}}})
    with pytest.raises(R.RecipeError, match='pick must be'):
        build({'a': {'trace_near': {'at': [0, 0], 'r': 1, 'pick': 'middle'}}})


def test_trace_route_bridges_only_when_allowed_and_records_it():
    pts = {'s': {'trace_near': {'at': [0, 0], 'r': 1}}, 'e': {'trace_near': {'at': [10, 12], 'r': 1}}}
    with pytest.raises(R.RecipeError, match='no traced route'):
        build(pts, {'p': [{'trace': {'from': 's', 'to': 'e'}}]})
    pat = build(pts, {'p': [{'trace': {'from': 's', 'to': 'e', 'bridge': 1.5}}]})
    assert pat.paths['p'][0] == (0.0, 0.0) and pat.paths['p'][-1] == (10.0, 12.0)
    assert any('gaps joined' in n and '1.00' in n for _, n in pat.interps)


def test_trace_onto_moves_the_curve_onto_new_ends():
    pts = {'s': {'trace_near': {'at': [1, 10], 'r': 0.5}}, 'e': {'trace_near': {'at': [10, 12], 'r': 0.5}},
           'S': {'at': [0, 0]}, 'E': {'at': [18, 4]}}
    pat = build(pts, {'p': [{'trace': {'from': 's', 'to': 'e', 'onto': ['S', 'E']}}]})
    q = pat.paths['p']
    assert q[0] == pytest.approx((0, 0)) and q[-1] == pytest.approx((18, 4))
    assert G.dist(q[0], q[1]) == pytest.approx(2 * 4)              # scale 2: the shape is kept
    assert any('scale 2.0000' in n for _, n in pat.interps)


def test_a_route_end_must_be_a_traced_vertex():
    with pytest.raises(R.RecipeError, match='not a traced vertex'):
        build({'s': {'at': [0, 0.5]}, 'e': {'at': [0, 10]}}, {'p': [{'trace': {'from': 's', 'to': 'e'}}]})


@pytest.fixture(scope='module')
def nightshirt():
    data = walker.inputs_from_garment(walker.load(ROOT / 'data' / 'walker' / 'nightshirt.yaml'), ROOT)
    return R.build(R.load(ROOT / 'recipes' / 'walker' / 'nightshirt.yaml'), data), data


def test_nightshirt_passes_the_gate_on_its_trace(nightshirt):
    pat, _ = nightshirt
    gate = run_checks(pat, walker.PRINTED_STEP)
    assert gate.passed and {c.id for c in gate.results} == {'field-width', 'field-length', 'front-length'}


def test_the_figures_place_the_points(nightshirt):
    pat, d = nightshirt
    IN = walker.IN
    assert pat.points['SL'] == pytest.approx((3 * IN, 1.5 * IN))
    assert pat.points['NR'] == pytest.approx(((34 - 12) * IN, 0))
    assert pat.points['BR'] == pytest.approx(((34 - 5) * IN, 49 * IN))
    for name, (a, b) in {'front': ('NL', 'NR'), 'back': ('NL', 'NR')}.items():
        out = pat.pieces[name]
        assert G.dist(out[0], out[-1]) < 1e-6                         # closed
        assert all(min(G.dist(pat.points[n], q) for q in out) < 1e-6 for n in (a, b))


def test_field_measured_from_its_lines(nightshirt):
    _, d = nightshirt
    assert d['body_w'] / walker.IN == pytest.approx(34.0, abs=0.05)
    assert d['body_h'] / walker.IN == pytest.approx(49.0, rel=0.01)
