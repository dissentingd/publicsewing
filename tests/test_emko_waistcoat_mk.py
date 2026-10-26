"""ЕМКО waistcoat МК (Table 6.3 МК rows 1–13, Fig. 32): the rows hold as printed + gate.

The armhole is traced from Fig. 32 (row МК 13: "по модели"); the tests pin that it runs
between the constructed ends and stays smooth, not where it lies to the millimetre.
"""
from pathlib import Path

import pytest

from ccat import geom as G
from ccat import recipe as R
from ccat.checks import run_checks
from ccat.sources import emko

ROOT = Path(__file__).resolve().parents[1]
RECIPE = R.load(ROOT / 'recipes' / 'emko' / 'waistcoat_mk.yaml')
DOC = emko.load(ROOT / 'data' / 'emko' / 'waistcoat_176-100-88.yaml')
DATA = emko.inputs_from_garment(DOC)


@pytest.fixture(scope='module')
def wc():
    return R.build(RECIPE, DATA)


def test_data():
    assert DOC['mk'] == {1: 2.5, 2: 9.6, 5: 5.0, 6: 4.0, 9: 16, 12: 10.0, 13: 11.0}
    assert len(DOC['traces']['mk_arm_back']) == len(DOC['traces']['mk_arm_front']) == 14
    assert DATA['mk_arm_back_u1'] == DOC['traces']['mk_arm_back'][0][0]        # adapter: traces → inputs


def test_pieces(wc):
    assert {'mk_back', 'mk_front'} <= set(wc.pieces)
    omitted = {n for n, e in RECIPE['export'].items() if e.get('omit')}
    assert omitted == {'back', 'front', 'imk_back', 'imk_front'}


def test_rows(wc):
    P = wc.points
    edge = G.sub(P["17'"], P["571'"])
    assert G.dist(P["571'"], P['572']) == pytest.approx(2.5)                                 # row 1
    for q in ('374', "971''"):                                                              # the stand edge ∥ the front edge
        assert G.cross(edge, G.sub(P[q], P['572'])) == pytest.approx(0, abs=1e-6)
    assert G.dist(P['411'], P['912']) == pytest.approx(9.6)                                  # row 2
    assert G.dist(P["971'"], P['972']) == pytest.approx(5.0)                                 # row 5
    assert G.dist(P['972'], P['973']) == pytest.approx(4.0)                                  # row 6
    assert G.dot(G.sub(P['973'], P['972']), edge) == pytest.approx(0, abs=1e-6)
    assert G.dist(P["461'"], P["961'"]) == pytest.approx(G.dist(P['461'], P['961']))         # row 8
    assert G.dist(P["17'"], P['373']) == pytest.approx(16.0)                                 # row 9
    assert abs(G.angle_deg(P["172'"], P['162'], P['373'])) == pytest.approx(90.0, abs=1e-6)  # rows 10–11: tangent
    assert G.dist(P["16'"], P["143'"]) == pytest.approx(10.0)                                # row 12
    assert G.dist(P['121'], P['143']) == pytest.approx(11.0)                                 # row 13


def test_traced_armhole_is_smooth(wc):
    P = wc.points
    for seq in (['143'] + [f'ab{i}' for i in range(1, 15)] + ["341'"],
                ["341'"] + [f'af{i}' for i in range(1, 15)] + ["143'"]):
        turns = [abs(180 - abs(G.angle_deg(P[a], P[b], P[c]))) for a, b, c in zip(seq, seq[1:], seq[2:])]
        assert max(turns) < 16, seq[0]
    # it meets the shoulders near square, as Fig. 32 draws it
    assert 85 < abs(G.angle_deg(P["16'"], P["143'"], P['af14'])) < 105
    assert 85 < abs(G.angle_deg(P['121'], P['143'], P['ab1'])) < 105


def test_gate(wc):
    rep = run_checks(wc, emko.PRINTED_STEP)
    by_id = {r.id: r for r in rep.results}
    assert by_id['mk-row2-formula'].passed and by_id['mk-side-back-vs-front'].passed
    assert rep.passed
