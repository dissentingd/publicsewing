"""Export layer (ccat.export). Needs the export extra, so these run in the tools image
(tools:2026-10-20); without shapely/ezdxf/reportlab they are skipped."""
import json
import math
from pathlib import Path

import pytest

shapely = pytest.importorskip('shapely')
ezdxf = pytest.importorskip('ezdxf')
pytest.importorskip('reportlab')
from shapely.geometry import Polygon  # noqa: E402

from ccat import export as X  # noqa: E402
from ccat import recipe as R  # noqa: E402
from ccat.checks import run_checks  # noqa: E402
from ccat.sources import emko  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
SA = 1.5


@pytest.fixture(scope='module')
def coat():
    data = emko.inputs_from_garment(emko.load(ROOT / 'data' / 'emko' / 'coat_winter_176-100-88.yaml'))
    return R.build(R.load(ROOT / 'recipes' / 'emko' / 'jacket.yaml'), data)


@pytest.fixture(scope='module')
def pieces(coat):
    return {pc.name: pc for pc in X.build_pieces(coat, SA)}


def test_cut_line_is_the_stitch_line_offset_by_the_allowance(pieces):
    for pc in pieces.values():
        stitch, cut = Polygon(pc.stitch), Polygon(pc.cut)
        assert cut.contains(stitch)
        # every stitch vertex sits at least SA inside the cut edge, and the edges are SA apart
        assert min(cut.exterior.distance(type(stitch.centroid)(p)) for p in pc.stitch) == pytest.approx(SA, abs=1e-6)
        assert cut.length > stitch.length


def test_darts_are_closed_across_the_mouth_and_marked(coat, pieces):
    back = pieces['back']
    leg1, apex, leg2 = (coat.points[n] for n in ("122'", "22", "122"))
    assert back.darts == [(leg1, apex, leg2)]
    assert apex not in back.stitch                       # the V is gone from the stitch line
    i = back.stitch.index(leg1)
    assert back.stitch[i + 1] == leg2                    # edge runs straight across the mouth
    (d,) = back.drills
    assert math.dist(d, apex) == pytest.approx(X.DRILL_BACK)
    assert len(back.notches) == 2 + 2                    # waist notches + one per dart leg


def test_notches_sit_on_the_cut_edge_pointing_in(pieces):
    for pc in pieces.values():
        cut = Polygon(pc.cut)
        for outer, inner in pc.notches:
            assert cut.exterior.distance(type(cut.centroid)(outer)) < 1e-6
            assert math.dist(outer, inner) == pytest.approx(X.NOTCH_DEPTH)
            assert cut.contains(type(cut.centroid)(inner))


def test_side_seam_waist_notch_is_at_the_waist_level(coat, pieces):
    y = coat.points['41'][1]
    xs = coat.points["341'"][0]                         # the side line (torso.yaml)
    outer, _ = next(n for n in pieces['back'].notches if abs(n[1][1] - y) < 1e-9 and n[0][0] > xs)
    assert outer[0] == pytest.approx(xs + SA)


def test_grain_is_vertical_and_inside(pieces):
    for pc in pieces.values():
        (x0, y0), (x1, y1) = pc.grain
        assert x0 == pytest.approx(x1) and y1 > y0
        assert Polygon(pc.stitch).contains(type(Polygon(pc.stitch).centroid)((x0, (y0 + y1) / 2)))


def _with_export(pattern, export):
    """A shallow copy of the pattern with a different export section."""
    import copy
    p = copy.copy(pattern)
    p.recipe = {**pattern.recipe, 'export': export}
    return p


def test_every_piece_needs_a_spec_and_specs_need_pieces(coat):
    spec = dict(coat.recipe['export'])
    with pytest.raises(R.RecipeError, match="'sleeve'.*every piece needs"):
        X.build_pieces(_with_export(coat, {k: v for k, v in spec.items() if k != 'sleeve'}), SA)
    with pytest.raises(R.RecipeError, match='pieces the pattern does not have'):
        X.build_pieces(_with_export(coat, {**spec, 'hood': {'cut': 1, 'grain': 'vertical'}}), SA)


@pytest.mark.parametrize('notch, match', [
    ({'point': 'nope'}, 'unknown point'),
    ({'point': '22'}, 'off the stitch line'),             # the dart apex, inside the closed outline
    ({'along': ['341', '941'], 'at_y_of': '11'}, 'not within segment'),
    ({'on': ['341', '941'], 'at_y_of': '41'}, 'a notch is'),
])
def test_bad_notches_stop(coat, notch, match):
    spec = dict(coat.recipe['export'])
    spec['back'] = {**spec['back'], 'notches': [notch]}
    with pytest.raises(R.RecipeError, match=match):
        X.build_pieces(_with_export(coat, spec), SA)


def test_a_dart_that_is_not_in_the_outline_stops(coat):
    spec = dict(coat.recipe['export'])
    spec['back'] = {**spec['back'], 'darts': [['122', '22', "122'"]]}      # wrong order
    with pytest.raises(R.RecipeError, match='not a run of consecutive outline vertices'):
        X.build_pieces(_with_export(coat, spec), SA)


def test_tiles_cover_the_layout_with_overlap():
    grid, (pw, ph), (rows, cols) = X.tiles(100.0, 60.0, X.PAGES['letter'])
    assert len(grid) == rows * cols
    right = max(x0 for _, _, x0, _ in grid) + pw
    bottom = max(y0 for _, _, _, y0 in grid) + ph
    assert right >= 100.0 and bottom >= 60.0
    xs = sorted({x0 for _, _, x0, _ in grid})
    assert all(b - a == pytest.approx(pw - X.OVERLAP) for a, b in zip(xs, xs[1:]))


def test_dxf_is_cm_and_round_trips(pieces, tmp_path):
    pcs = list(pieces.values())
    X.dxf(pcs, tmp_path / 'p.dxf', 'test')
    doc = ezdxf.readfile(tmp_path / 'p.dxf')
    assert doc.header['$INSUNITS'] == 5
    cuts = [e for e in doc.modelspace() if e.dxftype() == 'LWPOLYLINE' and e.dxf.layer == 'CUT']
    assert len(cuts) == len(pcs) == 4                      # back, front, sleeve, sleeve_under
    assert sorted(round(Polygon([(x, y) for x, y, *_ in e.get_points()]).length, 3) for e in cuts) == \
        sorted(round(Polygon(pc.cut).length, 3) for pc in pcs)
    assert {lay.dxf.name for lay in doc.layers} >= {'CUT', 'STITCH', 'NOTCH', 'DART', 'DRILL', 'GRAIN', 'TEXT'}


def test_exports_are_byte_identical_on_rebuild(pieces, tmp_path):
    pcs = list(pieces.values())
    for k in ('a', 'b'):
        (tmp_path / f'{k}.svg').write_text(X.svg(pcs, 't'), encoding='utf-8')
        X.dxf(pcs, tmp_path / f'{k}.dxf', 't')
        X.pdf(pcs, tmp_path / f'{k}.pdf', 't', 'a4', ['line'])
    for ext in ('svg', 'dxf', 'pdf'):
        assert (tmp_path / f'a.{ext}').read_bytes() == (tmp_path / f'b.{ext}').read_bytes(), ext


def test_catalog_refuses_a_garment_that_fails_the_gate(tmp_path):
    import importlib.util
    spec = importlib.util.spec_from_file_location('cb', ROOT / 'scripts' / 'catalog_build.py')
    cb = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(cb)
    cfg = {'seam_allowance': SA, 'source': {'book': 'b', 'corpus': 'emko', 'rights': 'r', 'size_label': 's'},
           'status': {'sewable': False, 'note': 'n'}}
    entry = {'id': 'demi', 'recipe': 'recipes/emko/jacket.yaml',
             'data': {'garment': 'data/emko/coat_demi_176-100-88.yaml'}}
    ok, gate = cb.build(cfg, entry, tmp_path, 'x')
    assert not ok and not gate.passed and not (tmp_path / 'demi').exists()
    entry = {'id': 'winter', 'recipe': 'recipes/emko/jacket.yaml',
             'data': {'garment': 'data/emko/coat_winter_176-100-88.yaml'}}
    ok, gate = cb.build(cfg, entry, tmp_path, 'x')
    e = json.loads((tmp_path / 'winter' / 'entry.json').read_text(encoding='utf-8'))
    assert ok and e['gate']['passed'] and set(e['files']) == {'pattern.svg', 'pattern.dxf', 'pattern_letter.pdf',
                                                              'pattern_a4.pdf'}
    for name, digest in e['files'].items():
        assert X.sha256(tmp_path / 'winter' / name) == digest
    assert not list(tmp_path.glob('.*.building'))          # built whole, then moved into place
    assert e['status'] == {'sewable': False, 'note': 'n'}
    with pytest.raises(R.RecipeError, match='status.sewable'):          # must be stated, never assumed
        cb.build({**cfg, 'status': {}}, entry, tmp_path, 'x')
    # sewable: true only with a recorded muslin test
    sew = {**cfg, 'status': {'sewable': True, 'note': 'n'}}
    with pytest.raises(R.RecipeError, match='muslin'):
        cb.build(sew, entry, tmp_path, 'x')
    with pytest.raises(R.RecipeError, match='muslin'):
        cb.build(sew, {**entry, 'muslin': {'date': '2026-11-01', 'sewn_by': 'A. Tester'}}, tmp_path, 'x')   # no result
    ok, _ = cb.build(sew, {**entry, 'muslin': {'date': '2026-11-01', 'sewn_by': 'A. Tester', 'result': 'fits'}}, tmp_path, 'x')
    assert ok


def test_tangent_sliver_is_repaired_and_recorded(pieces):
    under = pieces['sleeve_under']                         # the lower cap's arc grazes the side line at 352
    assert Polygon(under.stitch).is_valid and len(under.repairs) == 1
    assert 'area change' in under.repairs[0]
    assert not pieces['sleeve'].repairs


def test_a_real_self_crossing_still_stops(coat):
    import copy
    bad = copy.copy(coat)
    bad.pieces = {**coat.pieces, 'sleeve': [(0, 0), (10, 10), (10, 0), (0, 10), (0, 0)]}    # a bowtie
    with pytest.raises(R.RecipeError, match='not a simple polygon'):
        X.build_pieces(bad, SA)


@pytest.fixture(scope='module')
def imk_pieces():
    data = emko.inputs_from_garment(emko.load(ROOT / 'data' / 'emko' / 'jacket_176-100-88.yaml'))
    p = R.build(R.load(ROOT / 'recipes' / 'emko' / 'jacket_imk.yaml'), data)
    return p, {pc.name: pc for pc in X.build_pieces(p, SA)}


def test_imk_exports_its_own_pieces_and_omits_the_base_ones(imk_pieces):
    p, pcs = imk_pieces
    assert set(pcs) == {'imk_back', 'imk_side', 'imk_front', 'top_sleeve', 'under_sleeve'}
    assert {'back', 'front', 'sleeve', 'sleeve_under'} <= set(p.pieces)        # still built, just not exported


def test_a_bent_dart_run_closes_across_its_mouth(imk_pieces):
    p, pcs = imk_pieces
    front = pcs['imk_front']
    run = [p.points[n] for n in ("453''", 'bc462', "461'", '36', '461', '462', '453')]
    assert front.darts == [tuple(run)]
    i = front.stitch.index(run[0])
    assert front.stitch[i + 1] == run[-1]                  # the inner run is gone from the stitch line
    assert all(q not in front.stitch for q in run[1:-1])
    (d,) = front.drills
    assert math.dist(d, p.points['36']) == pytest.approx(X.DRILL_BACK)


def test_even_length_dart_run_stops(coat):
    spec = dict(coat.recipe['export'])
    spec['back'] = {**spec['back'], 'darts': [["122'", '22']]}
    with pytest.raises(R.RecipeError, match='odd-length run'):
        X.build_pieces(_with_export(coat, spec), SA)


def test_inner_dart_is_drawn_without_touching_the_outline():
    data = emko.inputs_from_garment(emko.load(ROOT / 'data' / 'emko' / 'waistcoat_176-100-88.yaml'))
    pat = R.build(R.load(ROOT / 'recipes' / 'emko' / 'waistcoat_imk.yaml'), data)
    back = {pc.name: pc for pc in X.build_pieces(pat, SA)}['imk_back']
    P = pat.points
    diamond = [P[n] for n in ('321', '421', '52', "421'", '321')]
    assert any(list(d) == diamond for d in back.darts)              # closed, marked as drawn
    assert P['421'] not in back.stitch and P['321'] not in back.stitch   # the outline isn't cut
    for apex in (P['321'], P['52']):                                # a drill short of each apex
        assert any(math.dist(apex, dr) == pytest.approx(X.DRILL_BACK) for dr in back.drills)


def test_inner_dart_outside_the_piece_stops():
    data = emko.inputs_from_garment(emko.load(ROOT / 'data' / 'emko' / 'waistcoat_176-100-88.yaml'))
    rec = R.load(ROOT / 'recipes' / 'emko' / 'waistcoat_imk.yaml')
    rec['export'] = {**rec['export'], 'imk_back': {**rec['export']['imk_back'], 'inner_darts': [['321', '421', '52', '461']]}}
    with pytest.raises(R.RecipeError, match='not inside'):
        X.build_pieces(R.build(rec, data), SA)


def test_a_dart_with_no_width_at_this_size_is_not_drawn():
    # insulated jacket ИМК at 176-92-74: Table 5.4 grades the belly dart to 0 for the smallest waist
    import sys
    sys.path.insert(0, str(ROOT / 'scripts'))
    import catalog_build as CB
    rec = R.load(ROOT / 'recipes' / 'emko' / 'jacket_insulated_imk.yaml')
    data, *_ = CB.load_data({'graded': 'data/emko/jacket_insulated_graded.yaml', 'figure': '176-92-74',
                             'model': 'data/emko/jacket_insulated_176-100-88.yaml'}, rec)
    pat = R.build(rec, data)
    front = {pc.name: pc for pc in X.build_pieces(pat, SA)}['imk_front']
    assert math.dist(pat.points["96'"], pat.points['96']) < X.ON_LINE
    assert not [d for d in front.darts if pat.points['46'] in d]
    assert pat.points['46'] not in front.stitch
    assert any('no width at this size' in r for r in front.repairs)


def test_a_cut_line_source_exports_with_no_allowance_and_its_slit():
    # Walker's outlines are cut lines (turnings included): allowance 0, the front opening a slit
    from ccat.sources import walker
    data = walker.inputs_from_garment(walker.load(ROOT / 'data' / 'walker' / 'nightshirt.yaml'), ROOT)
    pat = R.build(R.load(ROOT / 'recipes' / 'walker' / 'nightshirt.yaml'), data)
    pcs = {pc.name: pc for pc in X.build_pieces(pat, 0)}
    front = pcs['front']
    assert Polygon(front.cut).symmetric_difference(Polygon(front.stitch)).area < 1e-6
    assert len(front.slits) == 1 and not pcs['back'].slits
    assert any('cut on the drawn line' in t for t in front.label)
    assert '<polyline' in X.svg(list(pcs.values()), 't')
    with pytest.raises(R.RecipeError, match='0 or more'):
        X.build_pieces(pat, -1)
