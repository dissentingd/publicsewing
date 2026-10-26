"""ЕМКО summer jacket ИМК (Table 4.3, Figs. 21–22): the rows hold as printed + gate.

No pilot built this garment's ИМК, so each test re-derives a row's relation from the
table text and checks the recipe satisfies it.
"""
from pathlib import Path

import pytest

from ccat import geom as G
from ccat import recipe as R
from ccat.checks import run_checks
from ccat.sources import emko

ROOT = Path(__file__).resolve().parents[1]
RECIPE = R.load(ROOT / 'recipes' / 'emko' / 'summer_jacket_imk.yaml')
DOC = emko.load(ROOT / 'data' / 'emko' / 'summer_jacket_176-100-88.yaml')
DATA = emko.inputs_from_garment(DOC)


@pytest.fixture(scope='module')
def jk():
    return R.build(RECIPE, DATA)


def test_data_has_table_4_3_rows():
    assert DOC['imk'] == {1: 16.0, 12: 17.0}
    assert DOC['imk_sleeve'] == {7: 2.0}


def test_garment_pieces(jk):
    assert {'back_yoke', 'imk_back', 'front_yoke', 'imk_front', 'imk_sleeve'} <= set(jk.pieces)
    omitted = {n for n, e in RECIPE['export'].items() if e.get('omit')}
    assert omitted == {'back', 'front', 'sleeve', 'sleeve_under'}


def test_back_yoke_rows(jk):
    P = jk.points
    # rows 3–4: 211' is the foot from 221 on 21–111; the yoke's neck rises by |211–211'|
    assert G.dot(G.sub(P['221'], P["211'"]), G.sub(P['111'], P['21'])) == pytest.approx(0, abs=1e-9)
    lift = G.dist(P['211'], P["211'"])
    assert lift > 0.1                                       # nonzero only with 111 beside 11 (БК row 23)
    for a in ('111', '112', '12', '121'):                   # rows 4–7
        assert G.dist(P[a], P[a + "'"]) == pytest.approx(lift)
    # rows 9–11.1: dart angle opens the yoke seam; yoke armhole on the БК radius
    assert abs(G.angle_deg(P['23'], P['221'], P["23'"])) == pytest.approx(
        abs(G.angle_deg(P['123'], P['221'], P["123'"])), abs=1e-9)
    r = G.dist(P["14'"], P["342''"])
    assert G.dist(P['141'], P["342'''"]) == pytest.approx(r) and G.dist(P["23'"], P["342'''"]) == pytest.approx(r)


def test_front_rows(jk):
    P = jk.points
    assert G.dist(P['17'], P["373'"]) == pytest.approx(17.0)                                    # row 12
    assert G.dot(G.sub(P['362'], P["373'"]), G.sub(P["371'"], P['17'])) == pytest.approx(0, abs=1e-9)   # row 13
    assert G.dist(P['36'], P["362'"]) == pytest.approx(G.dist(P['36'], P['362']))              # row 14
    assert G.cross(G.sub(P['371'], P["471'"]), G.sub(P['373'], P["471'"])) == pytest.approx(0, abs=1e-9)  # row 15
    assert G.dist(P['46'], P["96'"]) == pytest.approx(G.dist(P['46'], P['96']))                # row 16
    assert G.dist(P["471'"], P["971'"]) == pytest.approx(G.dist(P['471'], P['971']))           # row 17


def test_sleeve_rows(jk):
    P = jk.points
    # front half mirrors the БК under-cap about the front fold (rows 3–6)
    for a in ('s341', 's354', 's343'):
        assert P[a + "'"][0] - P['s356'][0] == pytest.approx(P['s356'][0] - P[a][0], abs=1e-9)
        assert P[a + "'"][1] == pytest.approx(P[a][1], abs=1e-9)
    # back half: radii from 131 and the under-cap radius kept (rows 10–13)
    for a in ("s341''", "s345'"):
        b = a.rstrip("'")
        assert G.dist(P['s131'], P[a]) == pytest.approx(G.dist(P['s131'], P[b]))
    assert G.dist(P["s342'"], P["s345'"]) == pytest.approx(G.dist(P['s342'], P['s345']))
    # hem narrowed by 2.0 (row 7); the inner seam's two sides match (row 9, rows 14–16)
    assert G.dist(P['s95'], P['s941']) == pytest.approx(G.dist(P['s356'], P['s341']) - 2.0)
    front = G.dist(P["s341'"], P["s941'"])
    back = G.dist(P["s341''"], P["s441'"]) + G.dist(P["s441''"], P["s941''"])
    assert back == pytest.approx(front, abs=1e-6)


def test_gate(jk):
    rep = run_checks(jk, emko.PRINTED_STEP)
    by_id = {r.id: r for r in rep.results}
    assert 'sleeve-cap-vs-DOR' not in by_id
    assert by_id['row1-printed-vs-built'].measured == pytest.approx(16.008, abs=0.001)   # printed 16,0
    assert by_id['imk-cap-vs-DOR'].measured == pytest.approx(57.603, abs=0.005)          # ДОР 57.2: +0.71%
    assert by_id['imk-armhole-vs-DP'].measured == pytest.approx(55.367, abs=0.005)       # ДП 55.25: +0.21%
    assert rep.passed
