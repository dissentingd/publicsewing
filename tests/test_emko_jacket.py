"""ЕМКО jacket recipe: porting regression against the pilot + gate behaviour.

Regression (recipe vs pilot/emko/emko_jacket.py, captured in
fixtures/pilot_jacket_ref.json) shows the port is faithful. The gate checks
use the book's printed values only.
"""
import json
from pathlib import Path

import pytest

from ccat import recipe as R
from ccat.checks import run_checks
from ccat.sources import emko

ROOT = Path(__file__).resolve().parents[1]
REF = json.loads((ROOT / 'tests' / 'fixtures' / 'pilot_jacket_ref.json').read_text(encoding='utf-8'))
RECIPE = R.load(ROOT / 'recipes' / 'emko' / 'jacket.yaml')
DATA = emko.inputs_from_garment(emko.load(ROOT / 'data' / 'emko' / 'jacket_176-100-88.yaml'))


@pytest.fixture(scope='module')
def jacket():
    return R.build(RECIPE, DATA)


def test_every_pilot_point_reproduced(jacket):
    ref = REF['base']
    pts = {**ref['P'], **{'s' + k: v for k, v in ref['S'].items()}}
    missing = [k for k in pts if k not in jacket.points]
    assert not missing, f'pilot points not in the recipe: {missing}'
    for k, (x, y) in pts.items():
        assert jacket.points[k] == pytest.approx((x, y), abs=1e-6), k


def test_lengths_match_pilot(jacket):
    ref = REF['base']
    # the pilot sampled arcs at n=40, ccat to 1e-5 cm sag: agreement well under 0.01 cm
    assert jacket.length('armhole') == pytest.approx(ref['checks']['armhole length incl. underarm (cm) vs ДП 55.3'], abs=0.005)
    # the cap is not the pilot's: the pilot chained each arc from where the previous one
    # ended (drifting up to 0.76 cm off the touch points); the book's method (p. 126)
    # runs every arc exactly between two touch points, which shortens the cap by 0.88 cm
    assert jacket.length('cap') == pytest.approx(ref['cap_len'] - 0.878, abs=0.005)
    touch = [jacket.points[n] for n in ('st0', 'st1', 's14', 'st3', 'st4')]
    cap = jacket.path('cap')
    for t in touch:
        assert min(abs(q[0] - t[0]) + abs(q[1] - t[1]) for q in cap) < 1e-9
    assert jacket.length('under') == pytest.approx(ref['under_len'], abs=0.005)


def test_data_agrees_with_validated_table():
    rows = emko.load(ROOT / 'pilot' / 'emko' / 'jacket_176-100-88.yaml')['rows']
    table = emko.inputs_from_rows(rows)          # raises if any row fails its identities
    for k, v in table.items():
        if k in DATA:
            assert DATA[k] == v, k


def test_gate_fails_on_known_sleeve_cap(jacket):
    rep = run_checks(jacket)
    by_id = {r.id: r for r in rep.results}
    assert by_id['armhole-vs-DP'].passed and by_id['chest-width-row9'].passed and by_id['VOR-row72-formula'].passed
    cap = by_id['sleeve-cap-vs-DOR']
    # footnote 6: target is ДОР − 2|131–132| = 59.15 − 0.88; the suit cap is +1.10% over it
    # (2026-10-20, after the arc method was corrected); just outside the gate
    assert cap.expected == pytest.approx(59.15 - 2 * 0.44, abs=0.01)
    assert not cap.passed and cap.rel == pytest.approx(0.0110, abs=0.0005)
    assert not rep.passed


def test_pieces_close(jacket):
    assert set(jacket.pieces) >= {'back', 'front', 'sleeve'}


# ---------------- ИМК (model construction) ----------------
RECIPE_IMK = R.load(ROOT / 'recipes' / 'emko' / 'jacket_imk.yaml')
# The pilot approximated these by the nearest arc *sample* (lf[i357], argmin over
# samples), or crossed an arc sampled at only 40 chords (334); the recipe computes
# the exact intersections (see test_sampled_points_are_exact_constructions).
PILOT_SAMPLED = {'s357': 0.15, 's354': 0.15, "s354'": 0.15, '334': 0.01,
                 "s357'": 0.01}     # s357' is built from s354'


@pytest.fixture(scope='module')
def imk():
    return R.build(RECIPE_IMK, DATA)


def test_extends_keeps_base_and_rejects_redefinition(imk, tmp_path):
    assert {'back', 'front', 'sleeve', 'imk_back', 'imk_side', 'imk_front', 'top_sleeve', 'under_sleeve'} <= set(imk.pieces)
    (tmp_path / 'base.yaml').write_text('recipe: b\npoints: {A: {at: [0, 0]}}\n', encoding='utf-8')
    (tmp_path / 'child.yaml').write_text('extends: base.yaml\npoints: {A: {at: [1, 0]}}\n', encoding='utf-8')
    with pytest.raises(R.RecipeError, match='redefines'):
        R.load(tmp_path / 'child.yaml')


def test_imk_points_match_pilot(imk):
    ref = REF['--imk']
    pts = {**ref['Q'], **{'s' + k: v for k, v in ref['T'].items()}}
    for k, (x, y) in pts.items():
        tol = PILOT_SAMPLED.get(k, 0.001)
        assert imk.points[k] == pytest.approx((x, y), abs=tol), k


def test_sampled_points_are_exact_constructions(imk):
    from ccat import geom as G
    P = imk.points
    r21 = DATA['r21']
    # 357: on the lower front cap arc (centre 343, radius r21) and on line 452–356
    assert G.dist(P['s357'], P['s343']) == pytest.approx(r21, abs=2e-5)   # arc sampled to 1e-5 sag
    assert G.cross(G.sub(P['s356'], P['s452']), G.sub(P['s357'], P['s452'])) == pytest.approx(0, abs=1e-6)
    # 334: on the lower back armhole arc (centre 342, radius r19) straight above 333
    assert G.dist(P['334'], P['342']) == pytest.approx(DATA['r19'], abs=2e-5)
    assert P['334'][0] == pytest.approx(P['333'][0], abs=1e-9)
    # 354: on the same arc, at |353–343| from 353 (row 77)
    assert G.dist(P['s354'], P['s343']) == pytest.approx(r21, abs=1e-9)
    assert G.dist(P['s354'], P['s353']) == pytest.approx(G.dist(P['s353'], P['s343']), abs=1e-9)


def test_imk_gate_checks(imk):
    rep = run_checks(imk)
    by_id = {r.id: r for r in rep.results}
    ref = REF['--imk']['imk_checks']
    for cid in ('d_t-row9', 'half-waist-of-panels', 'seam-A-back-vs-side', 'seam-B-front-vs-side'):
        assert by_id[cid].passed, cid
    assert by_id['half-waist-of-panels'].measured == pytest.approx(ref['half-waist of panels (target |411–470| = 51.5)'], abs=0.005)
    assert by_id['seam-B-front-vs-side'].measured == pytest.approx(ref['seam B: front after transfer 354…453 + 453″…952″'], abs=0.005)
    # the БК one-piece cap check is dropped; the garment's two-piece cap is checked instead
    assert 'sleeve-cap-vs-DOR' not in by_id
    cap = by_id['two-piece-cap-vs-DOR']
    assert cap.passed and cap.rel == pytest.approx(0.0034, abs=0.0005)
    assert rep.passed


# ---------------- blind run (build step 3) ----------------
def test_blind_run_body_identical_to_pilot_on_other_garments():
    import importlib.util
    spec = importlib.util.spec_from_file_location('blind', ROOT / 'scripts' / 'emko_blind_run.py')
    blind = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(blind)
    for stage in ('B', 'C'):                                         # C = data filled by the OCR pipeline
        _, rows = blind.report(stage)
        by = {r['name']: r for r in rows}
        assert all('stopped' not in r for r in rows) and len(rows) == 13, stage
        assert all(r['max_dev'] < 1e-6 for r in rows), stage         # body: identical to the pilot's build
        assert by['waistcoat']['recipe'] == 'waistcoat.yaml'
        # footnote 6 target (ДОР − 2|131–132|) with the book's arc method: the к81 = 0 garments
        # and graded 176-92-74 pass; the suit jacket and demi coat sit at +1.06…+1.23%
        caps = {r['name']: c for r in rows for c in r['checks'] if c[0] == 'sleeve-cap-vs-DOR'}
        if stage == 'C':
            assert {n for n, c in caps.items() if c[3]} == {'coat_winter', 'jacket_insulated', 'summer_jacket',
                                                            'graded_176-92-74'}
    # with the OCR-filled data every row-9 check is verified; only the waistcoat lacks ДП (not printed)
    unverified = {r['name']: [c[0] for c in r['checks'] if c[4]] for r in rows}
    assert {k: v for k, v in unverified.items() if v} == {'waistcoat': ['armhole-vs-DP']}


def test_torso_and_sleeve_are_not_garments():
    for name in ('torso.yaml', 'sleeve.yaml'):
        with pytest.raises(R.RecipeError, match="'97'"):
            R.build(R.load(ROOT / 'recipes' / 'emko' / name), DATA)


def test_missing_k81_stops():
    data = dict(DATA)
    del data['k81']
    with pytest.raises(R.RecipeError, match='k81'):
        R.build(RECIPE, data)


def test_cap_target_is_dor_where_row81_is_absent():
    """Tables 3.2/4.2/5.2 print no row 81 and build rows 82 and 85 from 131, so 132 ≡ 131."""
    from ccat.sources import emko as E
    data = E.inputs_from_garment(E.load(ROOT / 'data' / 'emko' / 'coat_winter_176-100-88.yaml'))
    assert data['k81'] == 0
    rep = run_checks(R.build(R.load(ROOT / 'recipes' / 'emko' / 'jacket.yaml'), data))
    cap = {r.id: r for r in rep.results}['sleeve-cap-vs-DOR']
    assert cap.expected == pytest.approx(data['r63_3'], abs=1e-9)
