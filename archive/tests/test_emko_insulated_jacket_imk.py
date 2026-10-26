"""ЕМКО insulated jacket ИМК (Table 5.3, Figs. 27–28): the rows hold as printed + gate.

No pilot built this garment's ИМК, so each test re-derives a row's relation from the
table text. The back yoke (rows 1–11.2) is shared with the summer jacket
(imk_back_yoke.yaml) and tested there too.
"""
from pathlib import Path

import pytest

from ccat import geom as G
from ccat import recipe as R
from ccat.checks import run_checks
from ccat.sources import emko

ROOT = Path(__file__).resolve().parents[1]
RECIPE = R.load(ROOT / 'recipes' / 'emko' / 'jacket_insulated_imk.yaml')
DOC = emko.load(ROOT / 'data' / 'emko' / 'jacket_insulated_176-100-88.yaml')
DATA = emko.inputs_from_garment(DOC)


@pytest.fixture(scope='module')
def jk():
    return R.build(RECIPE, DATA)


def test_data_has_table_5_3_rows():
    assert DOC['imk'] == {1: 16.75, 12: 17.0, 13: 15.0, 20: 2.5}
    assert DOC['imk_sleeve'] == {7: 2.0}


def test_garment_pieces(jk):
    assert {'back_yoke', 'imk_back', 'front_yoke', 'imk_front', 'top_sleeve', 'under_sleeve'} <= set(jk.pieces)
    omitted = {n for n, e in RECIPE['export'].items() if e.get('omit')}
    assert omitted == {'back', 'front', 'sleeve', 'sleeve_under'}


def test_front_rows(jk):
    P = jk.points
    assert G.dist(P['17'], P["373'"]) == pytest.approx(17.0)                                  # row 12
    assert G.dist(P['351'], P['353']) == pytest.approx(15.0)                                  # row 13
    assert G.cross(G.sub(P['353'], P["373'"]), G.sub(P['354'], P["373'"])) == pytest.approx(0, abs=1e-6)
    assert G.dot(G.sub(P['362'], P['36']), G.sub(P['353'], P["373'"])) == pytest.approx(0, abs=1e-9)   # row 14
    # rows 15–16: the chest dart's angle, turned to the right of 36–362 (toward the front edge)
    assert abs(G.angle_deg(P['362'], P['36'], P["362'"])) == pytest.approx(abs(G.angle_deg(P['371'], P['36'], P["371'"])))
    assert P["362'"][0] > P['362'][0]
    assert G.dist(P['36'], P["362'"]) == pytest.approx(G.dist(P['36'], P['362']))
    assert G.dist(P['371'], P['373']) == pytest.approx(G.dist(P["371'"], P["373'"]))         # row 17
    assert G.dist(P['46'], P["96'"]) == pytest.approx(G.dist(P['46'], P['96']))              # row 18
    assert G.dist(P["471'"], P["971'"]) == pytest.approx(G.dist(P['471'], P['971']))         # row 19
    # row 20: the cut-back edge through 972 runs parallel to the front edge
    assert G.dist(P["971'"], P['972']) == pytest.approx(2.5)
    edge = G.sub(P["971'"], P['373'])
    for q in ('pk_top', 'pk_yoke', 'pk_neck'):
        assert G.cross(edge, G.sub(P[q], P['972'])) == pytest.approx(0, abs=1e-6), q


def test_sleeve_rows(jk):
    P = jk.points
    # rows 3–6: the front part of the БК under-cap mirrored about the front fold 355–356
    for a in ('s341', 's354', 's343'):
        assert G.dist(P['s355'], P[a + "'"]) == pytest.approx(G.dist(P['s355'], P[a]))
        assert G.dist(P['s356'], P[a + "'"]) == pytest.approx(G.dist(P['s356'], P[a])) if a != 's343' else True
    # rows 7–8: 941 and 941' equally far from 951, |356–341| − 2.0
    r = G.dist(P['s356'], P['s341']) - 2.0
    assert G.dist(P['s951'], P['s941']) == pytest.approx(r) and G.dist(P['s951'], P["s941'"]) == pytest.approx(r)


def test_gate(jk):
    rep = run_checks(jk, emko.PRINTED_STEP)
    by_id = {r.id: r for r in rep.results}
    assert 'sleeve-cap-vs-DOR' not in by_id
    assert by_id['row1-printed-vs-built'].measured == pytest.approx(16.757, abs=0.001)   # printed 16,75
    assert by_id['two-piece-cap-vs-DOR'].measured == pytest.approx(64.588, abs=0.005)    # ДОР 64.45: +0.21%
    assert by_id['imk-armhole-vs-DP'].measured == pytest.approx(62.495, abs=0.005)       # ДП 62.55: −0.09%
    assert by_id['sleeve-front-seam-top-vs-under'].passed                                # −0.85%: level БК hem
    assert rep.passed
