"""ЕМКО winter coat ИМК (Table 3.3, Figs. 14–15): the rows hold as printed + gate.

No pilot built this garment, so there is no point baseline: each test re-derives a
row's relation from the table text and checks the recipe satisfies it.
"""
from pathlib import Path

import pytest

from ccat import geom as G
from ccat import recipe as R
from ccat.checks import run_checks
from ccat.sources import emko

ROOT = Path(__file__).resolve().parents[1]
RECIPE = R.load(ROOT / 'recipes' / 'emko' / 'coat_winter_imk.yaml')
DOC = emko.load(ROOT / 'data' / 'emko' / 'coat_winter_176-100-88.yaml')
DATA = emko.inputs_from_garment(DOC)


@pytest.fixture(scope='module')
def coat():
    return R.build(RECIPE, DATA)


def test_data_has_table_3_3_rows():
    assert DOC['imk'] == {1: 2.5, 2: 12, 7: 6.45, 9: 6.45}
    assert DOC['imk_sleeve'] == {3: 5.0, 4: 5.0, 5: 1.0, 6: 1.0, 11: 2.5, 12: 2.5, 13: 2.5, 14: 2.5, 15: 2.5, 16: 2.5}


def test_garment_pieces(coat):
    assert {'back_yoke', 'imk_back', 'front_yoke', 'imk_front', 'top_sleeve', 'under_sleeve'} <= set(coat.pieces)
    omitted = {n for n, e in RECIPE['export'].items() if e.get('omit')}
    assert omitted == {'back', 'front', 'sleeve', 'sleeve_under'}


def test_back_yoke_rows(coat):
    P = coat.points
    # Table 3.2 rows 36, 36.1: 141 keeps |22–14'| and |121–14|
    assert G.dist(P['22'], P['141']) == pytest.approx(G.dist(P['22'], P["14'"]), abs=1e-9)
    assert G.dist(P['121'], P['141']) == pytest.approx(G.dist(P['121'], P['14']), abs=1e-9)
    # row 2: 211 on the centre back, 23 and 221 on the ⊥ from it
    assert G.dist(P['111'], P['211']) == pytest.approx(12, abs=1e-9)
    assert P['23'][1] == pytest.approx(P['211'][1]) and P['221'][1] == pytest.approx(P['211'][1])
    # rows 3–4: the dart angle at 221 opens the yoke seam, radius kept; 23' above 23
    assert abs(G.angle_deg(P['23'], P['221'], P["23'"])) == pytest.approx(
        abs(G.angle_deg(P['123'], P['221'], P["123'"])), abs=1e-9)
    assert G.dist(P['221'], P["23'"]) == pytest.approx(G.dist(P['221'], P['23']), abs=1e-9)
    assert P["23'"][1] < P['23'][1]
    # rows 5–5.1: the yoke armhole has the БК upper back armhole's radius
    r = G.dist(P["14'"], P["342''"])
    assert G.dist(P['141'], P["342'''"]) == pytest.approx(r) and G.dist(P["23'"], P["342'''"]) == pytest.approx(r)


def test_front_rows(coat):
    P = coat.points
    assert P['333'][0] - P['331'][0] == pytest.approx(2.5)                              # row 1
    assert P['353'][1] == pytest.approx(P['36'][1])                                     # row 6: horizontal
    # rows 9–10: 461' on the continuation of 36–46; 432' is 461–432 turned with it
    assert G.cross(G.sub(P['46'], P['36']), G.sub(P["461'"], P['46'])) == pytest.approx(0, abs=1e-9)
    assert G.dist(P["461'"], P["432'"]) == pytest.approx(G.dist(P['461'], P['432']), abs=1e-9)
    assert G.dot(G.sub(P["432'"], P["461'"]), G.sub(P["461'"], P['46'])) == pytest.approx(0, abs=1e-9)
    # rows 11–12: the front edge runs on along 371–471', the hem ⊥ to it
    assert G.cross(G.sub(P["471'"], P['371']), G.sub(P["971'"], P["471'"])) == pytest.approx(0, abs=1e-9)
    assert G.dist(P["471'"], P["971'"]) == pytest.approx(G.dist(P['471'], P['971']), abs=1e-9)
    assert G.dist(P["971'"], P["96'"]) == pytest.approx(G.dist(P['971'], P['96']), abs=1e-9)
    # rows 13–13.1, as printed
    assert G.dist(P["96'"], P["931''"]) == pytest.approx(G.dist(P['96'], P['931']), abs=1e-9)
    assert G.dist(P["432'"], P["931''"]) == pytest.approx(G.dist(P['432'], P["931'"]), abs=1e-9)
    # the lower front swings forward (Fig. 14: 931'' right of 931', 971' right of 971)
    assert P["931''"][0] > P["931'"][0] and P["971'"][0] > P['971'][0]


def test_sleeve_rows(coat):
    P = coat.points
    assert G.dist(P['s131'], P['s135']) == pytest.approx(5.0) == G.dist(P['s131'], P["s135'"])  # rows 3–4
    assert P['s434'][0] - P['s431'][0] == pytest.approx(G.dist(P['s432'], P['s433']))           # row 8
    assert G.dist(P['s334'], P['s434']) == pytest.approx(G.dist(P["s334''"], P["s434'"]))      # row 9.1
    for p in ("s434'", "s434''"):                                                              # rows 9, 10
        assert G.dist(P['s431'], P[p]) == pytest.approx(G.dist(P['s431'], P['s434']))
    assert G.dist(P['s952'], P['s452']) == pytest.approx(G.dist(P["s952'"], P["s452''"]))      # row 17
    assert G.dist(P['s451'], P["s452''"]) == pytest.approx(2.5)


def test_gate(coat):
    rep = run_checks(coat, emko.PRINTED_STEP)
    by_id = {r.id: r for r in rep.results}
    assert 'sleeve-cap-vs-DOR' not in by_id
    assert by_id['two-piece-cap-vs-DOR'].measured == pytest.approx(69.297, abs=0.005)    # ДОР 69.5: −0.29%
    assert by_id['imk-armhole-vs-DP'].measured == pytest.approx(63.429, abs=0.005)       # ДП 63.75: −0.50%
    assert by_id['row7-printed-vs-formula'].passed
    assert rep.passed
