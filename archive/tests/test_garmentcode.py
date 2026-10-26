"""GarmentCode export (ccat.garmentcode): ИМК jacket → pattern specification."""
import copy
import math
from pathlib import Path

import pytest

from ccat import garmentcode as GC
from ccat import recipe as R
from ccat.sources import emko

ROOT = Path(__file__).resolve().parents[1]


@pytest.fixture(scope='module')
def jacket():
    data = emko.inputs_from_garment(emko.load(ROOT / 'data' / 'emko' / 'jacket_176-100-88.yaml'))
    return R.build(R.load(ROOT / 'recipes' / 'emko' / 'jacket_imk.yaml'), data)


@pytest.fixture(scope='module')
def spec(jacket):
    return GC.build_spec(jacket)['pattern']


def _edge_len(panel, e):
    i, j = panel['edges'][e]['endpoints']
    return math.dist(panel['vertices'][i], panel['vertices'][j])


def test_ten_panels_right_and_left(spec):
    names = {f'{p}_{s}' for p in ('imk_back', 'imk_side', 'imk_front', 'top_sleeve', 'under_sleeve') for s in 'rl'}
    assert set(spec['panels']) == names


def test_left_copies_mirror_the_right(spec):
    for name, p in spec['panels'].items():
        if name.endswith('_r'):
            q = spec['panels'][name[:-2] + '_l']
            assert q['translation'][0] == -p['translation'][0]
            assert sorted((-x, y) for x, y in p['vertices']) == sorted(map(tuple, q['vertices']))


def test_every_edge_is_stitched_at_most_once_and_edges_close(spec):
    used = {}
    for a, b in spec['stitches']:
        for s in (a, b):
            k = (s['panel'], s['edge'])
            assert k not in used, k                      # GarmentCode's MultiStitchingError
            used[k] = True
    for p in spec['panels'].values():
        n = len(p['vertices'])
        assert [e['endpoints'] for e in p['edges']] == [[i, (i + 1) % n] for i in range(n)]


def test_stitched_edges_have_matching_lengths_seam_by_seam(spec):
    # each stitch pairs resampled edges of about STEP cm; ease spreads evenly, so a pair's
    # lengths differ by the seam's overall length ratio, never wildly
    for a, b in spec['stitches']:
        la, lb = _edge_len(spec['panels'][a['panel']], a['edge']), _edge_len(spec['panels'][b['panel']], b['edge'])
        same = a["panel"] == b["panel"]                         # dart legs are one edge each
        assert 0 < la and 0 < lb and (same or (la <= GC.STEP + 1e-6 and lb <= GC.STEP + 1e-6))
        assert 0.8 < la / lb < 1.25, (a, b, la, lb)


def test_armhole_takes_the_sleeve_cap_with_its_ease(jacket):
    total = jacket.length('top_cap') + jacket.length('under_cap')
    assert total / jacket.length('armhole') == pytest.approx(58.465 / 55.46, rel=2e-3)


def test_a_wrongly_wound_panel_stops(jacket):
    bad = copy.copy(jacket)
    drape = copy.deepcopy(jacket.recipe['drape'])
    drape['pieces']['imk_side']['ccw'] = False
    bad.recipe = {**jacket.recipe, 'drape': drape}
    with pytest.raises(R.RecipeError, match='run the same way'):
        GC.build_spec(bad)


def test_a_run_through_a_point_off_the_outline_stops(jacket):
    bad = copy.copy(jacket)
    seams = copy.deepcopy(jacket.recipe['seams'])
    seams['seam_A']['a'][0]['along'].insert(1, '36')          # 36 is a dart apex on the front
    bad.recipe = {**jacket.recipe, 'seams': seams}
    with pytest.raises(R.RecipeError, match='not a single vertex'):
        GC.build_spec(bad)


def test_every_panel_is_a_simple_polygon(spec):
    # GarmentCode needs simple panels; a doubled stretch or crossing dart legs show up here
    def o(p, q, r):
        return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])
    for name, p in spec['panels'].items():
        V = p['vertices']
        n = len(V)
        for i in range(n):
            for j in range(i + 2, n):
                if i == 0 and j == n - 1:
                    continue
                a, b, c, d = V[i], V[(i + 1) % n], V[j], V[(j + 1) % n]
                assert not (o(a, b, c) * o(a, b, d) < 0 and o(c, d, a) * o(c, d, b) < 0), (name, i, j)


def test_dart_legs_are_one_edge_each(spec):
    # GarmentCode accepts one same-panel vertex merge per vertex, as in its own darts
    same = [(a, b) for a, b in spec['stitches'] if a['panel'] == b['panel']]
    assert len(same) == 2                                 # the shoulder dart, right and left
    for a, b in same:
        assert a['panel'].startswith('imk_back')
