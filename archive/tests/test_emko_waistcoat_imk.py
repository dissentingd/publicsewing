"""ЕМКО waistcoat ИМК (Table 6.3 rows 1–27.2, Fig. 31): the rows hold as printed + gate.

No pilot built this garment's ИМК, so each test re-derives a row's relation from the
table text. Table 6.3's МК block (Fig. 32) is not built.
"""
from pathlib import Path

import pytest

from ccat import geom as G
from ccat import recipe as R
from ccat.checks import run_checks
from ccat.sources import emko

ROOT = Path(__file__).resolve().parents[1]
RECIPE = R.load(ROOT / 'recipes' / 'emko' / 'waistcoat_imk.yaml')
DOC = emko.load(ROOT / 'data' / 'emko' / 'waistcoat_176-100-88.yaml')
DATA = emko.inputs_from_garment(DOC)


@pytest.fixture(scope='module')
def wc():
    return R.build(RECIPE, DATA)


def test_data_has_table_6_3_rows():
    assert DOC['imk'][1] == 6.5 and DOC['imk'][12] == -0.85 and DOC['imk'][17] == 1.0


def test_suppression_budget():
    m = {k: DATA[k] for k in DATA if k.startswith('m')}
    # waist: centre back + back dart + side seams + front dart = d_т (rows 5–11)
    assert m['m5'] + m['m6'] + m['m7'] + m['m8'] + m['m9'] + m['m10'] + m['m11'] == pytest.approx(m['m1'])


def test_waist_and_hip_rows(wc):
    P = wc.points
    assert G.dist(P['41'], P['42']) == pytest.approx(0.7 * DATA['r6'])                         # row 2: 0,7|31–33| (printed 15,0)
    assert P['441'][1] - P['442'][1] == pytest.approx(0.5)                                    # row 3
    assert P['443'][0] < P['442'][0] and P["443'"][0] > P["442'"][0]                          # rows 8–9: in
    assert P['542'][0] > P['541'][0] and P["542'"][0] < P["541'"][0]                          # rows 13–14: out
    assert G.dist(P['46'], P["56'"]) == pytest.approx(G.dist(P['46'], P['56']))              # row 15
    assert G.dist(P["471'"], P["571'"]) == pytest.approx(G.dist(P['471'], P['571']))         # row 16


def test_upper_front_turned_about_36(wc):
    P = wc.points
    a = G.angle_deg(P['352'], P['36'], P["352'"])
    assert abs(a) == pytest.approx(abs(G.angle_deg(P['371'], P['36'], P["371'"])))         # row 22
    for b, c in (('352', "352'"), ('14"', "142'"), ('16', "16'")):                           # rows 23–25
        assert G.dist(P['36'], P[c]) == pytest.approx(G.dist(P['36'], P[b]))
    assert G.dist(P["352'"], P["142'"]) == pytest.approx(G.dist(P['352'], P['14"']))        # row 24.1
    assert G.dist(P["142'"], P["16'"]) == pytest.approx(G.dist(P['14"'], P['16']))          # row 25.1


def test_back_shoulder_rows(wc):
    P = wc.points
    assert G.dist(P["123'"], P["123''"]) == pytest.approx(1.0)                               # row 17
    assert G.dist(P['22'], P["23'"]) == pytest.approx(G.dist(P['22'], P['23']))              # row 19
    assert G.dist(P["23'"], P['142']) == pytest.approx(G.dist(P['23'], P["14'"]))            # row 20


def test_gate(wc):
    rep = run_checks(wc, emko.PRINTED_STEP)
    by_id = {r.id: r for r in rep.results}
    assert 'armhole-vs-DP' not in by_id                                  # no ДП in Table 6.2
    assert by_id['d_b-row12'].measured == pytest.approx(-0.85, abs=1e-9)
    assert by_id['neck-row26-vs-26_1'].measured == pytest.approx(by_id['neck-row26-vs-26_1'].expected, abs=1e-6)
    assert rep.passed
