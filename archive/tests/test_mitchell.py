"""To-scale diagrams: the recipe's drawing fit and marker_near, and the Mitchell box coat on its
stored traces (data/mitchell/trace/, made in the tools image by scripts/mitchell_trace.py)."""
import cmath
import shutil
from pathlib import Path

import pytest
import yaml

from ccat import geom as G
from ccat import recipe as R
from ccat.checks import run_checks
from ccat.sources import mitchell

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / 'corpus' / 'newstandardworko00mitc' / 'newstandardworko00mitc.pdf'

# a construction and its "drawing": scaled 0.4, turned 3°, shifted, one point drawn 0.1 off,
# plus a stray marker
PTS = {'A': (0, 0), 'B': (0, 40), 'C': (-30, 40), 'D': (-30, 10), 'E': (-12, 22)}
K = 0.4 * cmath.exp(1j * cmath.pi * 3 / 180)


def drawn(p, off=0j):
    z = K * complex(*p) + (5 + 7j) + off
    return [z.real, z.imag]


MARKERS = [drawn(PTS['A']), drawn(PTS['B']), drawn(PTS['C']), drawn(PTS['D']), drawn(PTS['E'], 0.04),
           drawn((-50, -20))]


def build(extra=None, fit=('A', 'B', 'C', 'D'), r=0.5, markers=MARKERS, traces=()):
    points = {k: {'at': list(v)} for k, v in PTS.items()}
    points.update(extra or {})
    rec = {'recipe': 't', 'points': points, 'drawing': {'d': {'fit': list(fit), 'r': r}}}
    return R.build(rec, {'@drawings': {'d': {'markers': markers, 'traces': list(traces)}}})


def test_fit_recovers_the_drawing_scale_and_turn():
    pat = build({'mE': {'marker_near': {'at': 'E', 'r': 1, 'drawing': 'd'}}})
    note = dict(pat.interps)["drawing 'd'"]
    assert '0.40000 drawing units per cm' in note and '+3.00°' in note
    assert G.dist(pat.points['mE'], PTS['E']) == pytest.approx(0.1, abs=1e-6)   # 0.04 drawn / 0.4


def test_traces_come_into_the_recipe_frame():
    tr = [[drawn((0, 0)), drawn((-10, 5))]]
    pat = build({'t': {'trace_near': {'at': [-10, 5], 'r': 0.1, 'drawing': 'd'}}}, traces=tr)
    assert pat.points['t'] == pytest.approx((-10, 5))


def test_fit_stops_on_a_point_without_its_marker():
    with pytest.raises(R.RecipeError, match='without a marker within'):
        build({'mE': {'marker_near': {'at': 'E', 'r': 1, 'drawing': 'd'}}},       # the fit runs on first use
              markers=[m for i, m in enumerate(MARKERS) if i != 2] + [drawn((-26, 44))], r=0.5)


def test_marker_near_stops_on_none_or_two():
    with pytest.raises(R.RecipeError, match='no marker within'):
        build({'m': {'marker_near': {'at': [-40, 30], 'r': 1, 'drawing': 'd'}}})
    two = MARKERS + [drawn((-12.5, 22))]
    with pytest.raises(R.RecipeError, match='two markers within'):
        build({'m': {'marker_near': {'at': 'E', 'r': 1, 'drawing': 'd'}}}, markers=two)


def test_an_unknown_drawing_stops():
    with pytest.raises(R.RecipeError, match="no drawing 'p9'"):
        build({'m': {'marker_near': {'at': 'E', 'r': 1, 'drawing': 'p9'}}})


# ---- the box coat (book pp. 16–19) ----

@pytest.fixture(scope='module')
def box_coat():
    data = mitchell.inputs_from_garment(mitchell.load(ROOT / 'data' / 'mitchell' / 'box_coat.yaml'), ROOT)
    pat = R.build(R.load(ROOT / 'recipes' / 'mitchell' / 'box_coat.yaml'), data)
    return pat, run_checks(pat, mitchell.PRINTED_STEP)


def test_the_drawing_fits_tightly(box_coat):
    pat, _ = box_coat
    notes = dict(pat.interps)
    for page in ('p17', 'p19'):
        rms = float(notes[f"drawing '{page}'"].split('residual rms ')[1].split(' cm')[0])
        assert rms < 0.15


def test_the_gate_passes_with_the_printed_values(box_coat):
    # The text governs (2026-10-24): the shoulder (drawn 5¾ on pp. 17 and 37, printed 6) and
    # four slips on the sleeve diagram p. 61 (10 and 11 drawn ¾ in from 9, the elbow 7.7, 2 at 3.93
    # from 1; p. 67 draws those steps as printed) are reports, not checks. FINDINGS items 1 and 4.
    pat, rep = box_coat
    assert rep.passed and len(rep.results) == 25
    assert not {'back-shoulder', 'sleeve-10', 'sleeve-11', 'sleeve-2', 'sleeve-elbow'} & {c.id for c in rep.results}
    drawn = {r[0]: r[1] for r in rep.reports}
    assert drawn['back shoulder 9→26, drawn − printed'] / 2.54 == pytest.approx(-0.28, abs=0.03)
    assert drawn['sleeve: 9→10 (1 in) drawn − printed'] / 2.54 == pytest.approx(-0.26, abs=0.03)
    assert G.dist(pat.points['9'], pat.points['26']) == pytest.approx(6 * 2.54)


def test_the_sleeve_is_drafted_on_the_coats_armhole(box_coat):
    pat, _ = box_coat
    p, v = pat.points, pat.values
    arm = G.polylen(pat.paths['back_scye']) + G.polylen(pat.paths['front_scye'])
    assert v['W'] == pytest.approx(arm - 2.5 * 2.54)
    assert G.dist(p['sl1'], p['sl2']) == pytest.approx(v['W'] / 4)
    assert p['sl1'][1] == pytest.approx(p['18'][1])                 # the bust lines coincide
    ease = G.polylen(pat.paths['top_head']) + G.polylen(pat.paths['under_head']) - arm
    assert 1.5 < ease < 4.0                                          # cm of ease in the head
    assert G.dist(p['20b'], p['32']) == pytest.approx(G.polylen(pat.paths['back_neck']) + 0.25 * 2.54)


def test_pieces_are_closed_and_sit_where_the_text_puts_them(box_coat):
    pat, _ = box_coat
    p = pat.points
    assert set(pat.pieces) == {'back', 'front', 'top_sleeve', 'under_sleeve', 'collar'}
    assert p['28'] == pytest.approx(G.lerp(p['13'], p['10'], 0.5))
    assert G.dist(p['29'], p['30']) == pytest.approx(1.25 * 2.54)
    assert G.dist(p['2'], p['CBh']) == pytest.approx(42.5 * 2.54)
    assert G.dist(p['Dl'], p['22']) == pytest.approx(0.625 * 2.54)


def test_the_trace_caches_hold_the_markers():
    for page, n in ((17, 26), (19, 29), (61, 20), (37, 25), (39, 46), (85, 10), (91, 14), (43, 25), (45, 52), (93, 16)):
        doc = yaml.safe_load((ROOT / 'data' / 'mitchell' / 'trace' / f'p-{page:03d}.yaml').read_text(encoding='utf-8'))
        assert len(doc['markers']) == n and doc['traces']


@pytest.mark.skipif(shutil.which('pdfimages') is None or not PDF.exists(), reason='needs the tools image and the corpus PDF')
def test_p17_fresh_read_matches_the_cache():
    pytest.importorskip('cv2')
    pytest.importorskip('skimage')
    from ccat import diagram, grid
    ink, _, _ = grid.load_page(str(PDF), 21)
    marks = diagram.markers(ink)
    doc = yaml.safe_load((ROOT / 'data' / 'mitchell' / 'trace' / 'p-017.yaml').read_text(encoding='utf-8'))
    assert len(marks) == len(doc['markers'])
    for m, (x, y) in zip(marks, doc['markers']):
        assert abs(m['x'] / 300 - x) < 1e-3 and abs(m['y'] / 300 - y) < 1e-3
    assert diagram.heavy_width(ink) == doc['heavy_px']


# ---- the semi-fitted jacket (book pp. 36–39) ----

@pytest.fixture(scope='module')
def jacket():
    data = mitchell.inputs_from_garment(mitchell.load(ROOT / 'data' / 'mitchell' / 'semi_fitted_jacket.yaml'), ROOT)
    pat = R.build(R.load(ROOT / 'recipes' / 'mitchell' / 'semi_fitted_jacket.yaml'), data)
    return pat, run_checks(pat, mitchell.PRINTED_STEP)


def test_jacket_passes_and_its_17_inches_is_the_drafts(jacket):
    pat, rep = jacket
    assert rep.passed
    c = {r.id: r for r in rep.results}['back-below-waist']
    assert c.measured / 2.54 == pytest.approx(17, abs=0.05)            # 32 less the back's 2→7


def test_jacket_panels_sew_together(jacket):
    _, rep = jacket
    seams = {r[0]: r[1] for r in rep.reports if r[0].startswith('seam ')}
    assert len(seams) == 3 and all(abs(v) < 0.3 for v in seams.values())   # cm


def test_jacket_pieces_and_princess_seam(jacket):
    pat, _ = jacket
    p = pat.points
    assert set(pat.pieces) == {'back', 'side_back', 'side_front', 'front', 'top_sleeve', 'under_sleeve', 'collar'}
    assert pat.paths['front_seam'][-1] == pytest.approx(p['39'])        # both princess edges meet at 39
    assert G.dist(p['43'], p['44']) == pytest.approx(1.25 * 2.54)
    assert G.dist(p['20'], p['CC']) == pytest.approx(2.75 * 2.54)


def test_extends_takes_several_bases(tmp_path):
    (tmp_path / 'a.yaml').write_text("recipe: a\npoints: {P: {at: [0, 0]}}\n", encoding='utf-8')
    (tmp_path / 'b.yaml').write_text("recipe: b\npoints: {Q: {at: [1, 0]}}\n", encoding='utf-8')
    (tmp_path / 'c.yaml').write_text("recipe: c\nextends: [a.yaml, b.yaml]\npoints: {S: {at: [2, 0]}}\n", encoding='utf-8')
    assert set(R.load(tmp_path / 'c.yaml')['points']) == {'P', 'Q', 'S'}
    (tmp_path / 'd.yaml').write_text("recipe: d\npoints: {P: {at: [5, 0]}}\n", encoding='utf-8')
    (tmp_path / 'e.yaml').write_text("recipe: e\nextends: [a.yaml, d.yaml]\n", encoding='utf-8')
    with pytest.raises(R.RecipeError, match='redefines points'):
        R.load(tmp_path / 'e.yaml')


def test_path_at_walks_along_a_path():
    pts = {'A': {'at': [0, 0]}, 'B': {'at': [10, 0]}, 'C': {'at': [10, 10]}, 'M': {'at': [5, 0]},
           'X': {'path_at': {'path': 'p', 'from': 'M', 'd': 8}}, 'Y': {'path_at': {'path': 'p', 'from': 'M', 'd': -3}}}
    pat = R.build({'recipe': 't', 'points': pts, 'paths': {'p': [{'polyline': ['A', 'B', 'C']}]}}, {})
    assert pat.points['X'] == pytest.approx((10, 3)) and pat.points['Y'] == pytest.approx((2, 0))
    pts['Z'] = {'path_at': {'path': 'p', 'from': 'M', 'd': 30}}
    with pytest.raises(R.RecipeError, match='short of the distance'):
        R.build({'recipe': 't', 'points': pts, 'paths': {'p': [{'polyline': ['A', 'B', 'C']}]}}, {})


# ---- the five-gored skirt (book pp. 84–85, 90–91) ----

@pytest.fixture(scope='module')
def skirt():
    data = mitchell.inputs_from_garment(mitchell.load(ROOT / 'data' / 'mitchell' / 'five_gored_skirt.yaml'), ROOT)
    pat = R.build(R.load(ROOT / 'recipes' / 'mitchell' / 'five_gored_skirt.yaml'), data)
    return pat, run_checks(pat, mitchell.PRINTED_STEP)


def test_skirt_passes_with_the_surplus_and_11_as_reports(skirt):
    # The printed surplus "in this case is 2½ inches" isn't reproduced (2.35 by the text's
    # construction, 2.8–3.0 by the drawings), and p. 91 alone draws 11 at 3.77 for 3½: reports,
    # the text governs (2026-10-24; recipes/mitchell/FINDINGS.md item 5).
    pat, rep = skirt
    assert rep.passed and not {'11', 'surplus'} & {c.id for c in rep.results}
    assert pat.values['surplus'] / 2.54 == pytest.approx(2.35, abs=0.02)


def test_skirt_waist_comes_to_half_the_waist(skirt):
    pat, _ = skirt
    p, v = pat.points, pat.values
    w = G.polylen(pat.paths['waist'])
    taken = 0.875 * 2.54 + 0.75 * 2.54 + G.dist(p['Sf'], p['Sb'])     # darts laid off along the waist
    assert w - taken == pytest.approx(v['waist'] / 2, abs=0.05)
    assert set(pat.pieces) == {'front_panel', 'side_gore', 'back_gore'}


# ---- the tight-fitted jacket, single dart (book pp. 42–45) ----

@pytest.fixture(scope='module')
def tight():
    data = mitchell.inputs_from_garment(mitchell.load(ROOT / 'data' / 'mitchell' / 'tight_fitted_jacket.yaml'), ROOT)
    pat = R.build(R.load(ROOT / 'recipes' / 'mitchell' / 'tight_fitted_jacket.yaml'), data)
    return pat, run_checks(pat, mitchell.PRINTED_STEP)


def test_tight_jacket_passes_and_its_waist_figure_holds(tight):
    pat, rep = tight
    assert rep.passed
    c = {r.id: r for r in rep.results}['26']                        # 26 from 7 with waist 26½
    assert c.passed and pat.values['d26'] / 2.54 == pytest.approx(26.5 / 12 - 0.25)


def test_tight_jacket_pieces(tight):
    pat, rep = tight
    assert set(pat.pieces) == {'back', 'side_back', 'under_arm', 'side_front', 'front', 'top_sleeve', 'under_sleeve'}
    p = pat.points
    assert G.dist(p['4'], p['7']) == pytest.approx(2 * 2.54) and G.dist(p['5'], p['6']) == pytest.approx(1.5 * 2.54)
    seams = {r[0]: r[1] for r in rep.reports if r[0].startswith('seam ')}
    assert len(seams) == 4 and all(abs(v) < 1.1 for v in seams.values())   # cm; the hem is the drawing's


def test_seven_gored_skirt_on_the_shared_foundation():
    data = mitchell.inputs_from_garment(mitchell.load(ROOT / 'data' / 'mitchell' / 'seven_gored_skirt.yaml'), ROOT)
    pat = R.build(R.load(ROOT / 'recipes' / 'mitchell' / 'seven_gored_skirt.yaml'), data)
    rep = run_checks(pat, mitchell.PRINTED_STEP)
    assert rep.passed and set(pat.pieces) == {'front_panel', 'gore_1', 'gore_2', 'back_gore'}
    p, v = pat.points, pat.values
    w = G.polylen(pat.paths['waist'])
    taken = (0.25 + 0.375 + 0.75) * 2.54 + G.dist(p['S1f'], p['S1b']) + G.dist(p['S2f'], p['S2b'])
    assert w - taken == pytest.approx(v['waist'] / 2, abs=0.05)                 # darts along the waist


@pytest.mark.parametrize('name, gores, panel, cb, steps', [
    ('nine', 4, 2 * 0.25, 0.625, {'13': 0.5, '14': 0, '15': 0.25}),
    ('eleven', 5, 0.375, 0.5, {'13': 0.375, '14': 0, '15': 0, '16': 0.1875}),
    ('thirteen', 6, 2 * 0.125, 0.375, {'13': 0.5, '14': 0.25, '15': 0, '16': 0.125, '17': 0.375}),
    ('fifteen', 7, 2 * 0.0625, 0.25, {'13': 0.375, '14': 0.1875, '15': 0, '16': 0, '17': 0.09375, '18': 0.28125}),
])
def test_many_gored_skirts(name, gores, panel, cb, steps):
    data = mitchell.inputs_from_garment(mitchell.load(ROOT / 'data' / 'mitchell' / f'{name}_gored_skirt.yaml'), ROOT)
    pat = R.build(R.load(ROOT / 'recipes' / 'mitchell' / f'{name}_gored_skirt.yaml'), data)
    rep = run_checks(pat, mitchell.PRINTED_STEP)
    assert rep.passed and len(pat.pieces) == gores + 1
    p, v = pat.points, pat.values
    darts = {h: G.dist(p[f'S{i}f'], p[f'S{i}b']) for i, h in enumerate(sorted(steps, key=int), 1)}
    big = max(darts.values())
    for h, s in steps.items():                                                  # the printed order and steps
        assert big - darts[h] == pytest.approx(s * 2.54, abs=0.02)
    taken = (panel + cb) * 2.54 + sum(darts.values())
    assert G.polylen(pat.paths['waist']) - taken == pytest.approx(v['waist'] / 2, abs=0.05)


# ---- the tight-fitted jacket, double dart (book pp. 46–47) ----

def test_double_dart_jacket():
    data = mitchell.inputs_from_garment(mitchell.load(ROOT / 'data' / 'mitchell' / 'double_dart_jacket.yaml'), ROOT)
    pat = R.build(R.load(ROOT / 'recipes' / 'mitchell' / 'double_dart_jacket.yaml'), data)
    rep = run_checks(pat, mitchell.PRINTED_STEP)
    assert rep.passed and len(rep.results) == 49
    assert set(pat.pieces) == {'back', 'side_back', 'side_body', 'under_arm', 'side_front', 'middle_front',
                               'front', 'top_sleeve', 'under_sleeve'}
    p, IN = pat.points, 2.54
    for waist, hip in [(('48', '50'), ('49', '51')), (('50', '53'), ('51', '54')),
                       (('53', '55'), ('54', '56')), (('55', '60'), ('56', '61'))]:
        assert G.dist(*(p[k] for k in hip)) - G.dist(*(p[k] for k in waist)) == pytest.approx(0.25 * IN)
    front = G.dist(p['48'], p['50']) + G.dist(p['53'], p['55']) + G.dist(p['60'], p['43'])
    assert front == pytest.approx(pat.values['waist'] / 4)                       # "60 from 43 is ¼ waist less …"
    assert G.dist(p['9'], p['29']) == pytest.approx(5.5 / 4 * IN)                # "in this case 5½"
    rp = {r[0]: r[1] for r in rep.reports}
    assert all(abs(v) < 0.7 for k, v in rp.items() if k.startswith('seam '))     # cm
