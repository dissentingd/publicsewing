"""ЕМКО demi coat ИМК (Table 2.3, Figs. 9–10): the rows hold as printed + gate.

No pilot built this garment's ИМК, so each test re-derives a row's relation from the
table text. The two-piece sleeve is the jacket's construction (imk_sleeve.yaml), already
covered against the pilot in test_emko_jacket.py.
"""
from pathlib import Path

import pytest

from ccat import geom as G
from ccat import recipe as R
from ccat.checks import run_checks
from ccat.sources import emko

ROOT = Path(__file__).resolve().parents[1]
RECIPE = R.load(ROOT / 'recipes' / 'emko' / 'coat_demi_imk.yaml')
DOC = emko.load(ROOT / 'data' / 'emko' / 'coat_demi_176-100-88.yaml')
DATA = emko.inputs_from_garment(DOC)


@pytest.fixture(scope='module')
def coat():
    return R.build(RECIPE, DATA)


def test_data_has_table_2_3_rows():
    assert DOC['imk'][9] == 7.4 and DOC['imk'][17] == 1.9 and DOC['imk'][32] == 1.0
    assert sorted(DOC['imk_sleeve']) == [3, 3.1, 4, 5, 10, 11, 12, 13, 14, 15]


def test_garment_pieces(coat):
    assert {'imk_back', 'imk_side', 'imk_front', 'top_sleeve', 'under_sleeve'} <= set(coat.pieces)
    omitted = {n for n, e in RECIPE['export'].items() if e.get('omit')}
    assert omitted == {'back', 'front', 'sleeve', 'sleeve_under'}


def test_suppression_budget():
    m = {k: DATA[k] for k in DATA if k.startswith('m')}
    # waist: centre back + 2 × seam A + 2 × seam B + chest dart = d_т; hip: centre back + 2 × seam A = d_б
    assert m['m10'] + m['m11'] + m['m12'] + m['m13'] + m['m14'] + m['m15'] + m['m16'] == pytest.approx(m['m9'])
    assert m['m18'] + m['m19'] + m['m20'] == pytest.approx(m['m17'])


def test_back_shoulder_rows(coat):
    P = coat.points
    assert G.dist(P["123'"], P["123''"]) == pytest.approx(1.0)                              # row 32
    # row 33: 22–23 on the armhole's normal; the dart left after the ease opens 23–22–23'
    assert G.cross(G.sub(P['22'], P["342''"]), G.sub(P['23'], P["342''"])) == pytest.approx(0, abs=1e-9)
    assert abs(G.angle_deg(P['23'], P['22'], P["23'"])) == pytest.approx(
        abs(G.angle_deg(P['123'], P['22'], P["123''"])), abs=1e-9)
    assert G.dist(P['22'], P["23'"]) == pytest.approx(G.dist(P['22'], P['23']))             # row 34
    assert G.dist(P["23'"], P['142']) == pytest.approx(G.dist(P['23'], P["14'"]))           # row 35
    assert G.dist(P['22'], P['142']) == pytest.approx(G.dist(P['22'], P["14'"]))            # on arc 14'⌒141
    # rows 36–37.3: O at |142–n| from 142 and 332
    r = G.dist(P['142'], P['n'])
    assert G.dist(P['O'], P['142']) == pytest.approx(r) and G.dist(P['O'], P['332']) == pytest.approx(r)


def test_front_rows(coat):
    P = coat.points
    # rows 24–26: 462' on the continuation of 36–46; triangle 46–462–453 turned to it
    assert G.cross(G.sub(P['46'], P['36']), G.sub(P["462'"], P['46'])) == pytest.approx(0, abs=1e-9)
    assert G.dist(P["462'"], P["453'"]) == pytest.approx(G.dist(P['462'], P['453']))
    assert G.angle_deg(P['46'], P['462'], P['453']) == pytest.approx(G.angle_deg(P['46'], P["462'"], P["453'"]))
    # rows 27–31 lengths
    for a, b, c, d in (("471'", "971'", '471', '971'), ("971'", "96'", '971', '96'), ("971'", "571'", '971', '571'),
                       ("571'", "551''", '571', '551'), ("551''", "952''", '551', '952')):
        assert G.dist(P[a], P[b]) == pytest.approx(G.dist(P[c], P[d])), (a, b)


def test_gate(coat):
    rep = run_checks(coat, emko.PRINTED_STEP)
    by_id = {r.id: r for r in rep.results}
    assert 'sleeve-cap-vs-DOR' not in by_id
    assert by_id['two-piece-cap-vs-DOR'].measured == pytest.approx(66.550, abs=0.005)    # 66.175: +0.57%
    assert by_id['imk-armhole-vs-DP'].measured == pytest.approx(61.916, abs=0.005)       # ДП 61.45: +0.76%
    assert by_id['seam-B-front-vs-side'].measured == pytest.approx(81.582, abs=0.005)
    assert by_id['d_b-row17'].measured == pytest.approx(1.9, abs=1e-9)
    assert rep.passed
