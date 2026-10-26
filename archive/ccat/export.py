"""Export layer: a gated pattern → sewing-ready pieces and catalog files.

Needs the `export` extra (shapely, ezdxf, reportlab); the rest of ccat stays pure
Python. Runs in the tools image (docker/tools, tools:2026-10-20 or later).

Each piece is declared in the recipe's `export:` section (merged through
`extends:` like `points:`):

    export:
      back:
        cut: 2                             # how many to cut
        grain: vertical                    # grain line direction in the drafting frame
        notches:
          - {point: "411"}                 # a named point on the stitch line
          - {along: ["341", "941"], at_y_of: "41"}   # on segment A–B, at the level of a point
                                           # (not `on`: YAML 1.1 reads that key as true)
        darts: [["122'", "22", "122"]]     # leg …, apex, … leg: an odd run of consecutive outline
                                           # vertices; the middle one is the apex
        inner_darts: [["321", "421", "52", "421'"]]   # apex, leg, apex, leg: a closed (fish)
                                           # dart inside the piece, drawn as markings only
        slits: [["ND", "OE"]]              # a cut into the piece between two points inside it
                                           # (e.g. a front opening), drawn as a cut line
      sleeve: {omit: true}                 # a construction-stage piece the garment doesn't use

Fail-closed like the recipe: every piece needs a spec (`{omit: true}` to leave out an
inherited construction-stage piece, e.g. the БК pieces under ИМК), a spec for a piece the
pattern doesn't have is an error, and a notch that isn't on the stitch line stops.

The stitch line is the drafted outline with each declared dart closed off: the edge
runs straight across the dart mouth, and the dart legs, a notch at each leg and a
drill hole short of the apex are drawn as markings (dart caps are not trued). An inner
dart leaves the outline alone: its diamond and a drill hole short of each apex are drawn. The cut
line is that stitch line offset outward by the seam allowance (mitred corners). Exports are 1:1 in cm and
deterministic, so rebuilding unchanged inputs gives identical bytes. A seam allowance of 0
means the drafted outline is already the cut line (a source whose shapes include turnings).
"""
import hashlib
import json
import math
from dataclasses import dataclass, field

from . import geom as G
from .recipe import RecipeError

SPEC_KEYS = {'cut', 'grain', 'notches', 'darts', 'inner_darts', 'slits', 'note'}
NOTCH_DEPTH = 0.6        # cm, cut into the seam allowance from the cut edge
GRAIN_SHARE = 0.6        # grain line length as a share of the piece's height at its centre
DRILL_BACK = 1.0         # cm: drill hole this far short of a dart apex, toward the mouth
DRILL_R = 0.15           # cm
SLIVER_AREA = 1e-3       # cm²: largest self-touch repair accepted (tangent constructions)
MITRE_LIMIT = 3.0
ON_LINE = 1e-6           # cm: a notch point must lie on the stitch line
TEST_SQUARE = 5.0        # cm, on the first PDF page and in the SVG
GAP = 3.0                # cm between pieces in the layout
PAGES = {'letter': (21.59, 27.94), 'a4': (21.0, 29.7)}
PAGE_MARGIN = 1.0        # cm, unprinted border
OVERLAP = 1.0            # cm shared by neighbouring tiles
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'


@dataclass
class Piece:
    name: str
    stitch: list                         # closed polyline, cm
    cut: list                            # closed polyline, cm
    cut_count: int
    grain: tuple                         # (start, end)
    notches: list = field(default_factory=list)    # [(outer, inner)] on the cut edge
    darts: list = field(default_factory=list)      # [(leg, apex, leg)] markings
    drills: list = field(default_factory=list)     # [centre]
    slits: list = field(default_factory=list)      # [(start, end)] cut lines inside the piece
    repairs: list = field(default_factory=list)    # notes on outline repairs (see SLIVER_AREA)
    label: list = field(default_factory=list)      # text lines
    offset: tuple = (0.0, 0.0)           # placement in the layout

    def placed(self, pts):
        dx, dy = self.offset
        return [(x + dx, y + dy) for x, y in pts]


def _shapely():
    try:
        from shapely.geometry import LineString, Polygon
    except ImportError as e:                                   # pragma: no cover
        raise RecipeError('export needs the `export` extra (shapely, ezdxf, reportlab)') from e
    return Polygon, LineString


def _ring(polygon):
    pts = [(float(x), float(y)) for x, y in polygon.exterior.coords]
    return pts


def _nearest_segment(pts, p):
    best = None
    for i in range(len(pts) - 1):
        a, b = pts[i], pts[i + 1]
        d = b[0] - a[0], b[1] - a[1]
        L2 = d[0] * d[0] + d[1] * d[1]
        if L2 == 0:
            continue
        t = max(0.0, min(1.0, ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1]) / L2))
        q = (a[0] + t * d[0], a[1] + t * d[1])
        dist = G.dist(p, q)
        if best is None or dist < best[0]:
            best = (dist, d)
    return best


def _notch_point(pattern, spec, where):
    if not isinstance(spec, dict):
        raise RecipeError(f'{where}: a notch is {{point: name}} or {{along: [A, B], at_y_of: C}}')
    if set(spec) == {'point'}:
        name = str(spec['point'])
        if name not in pattern.points:
            raise RecipeError(f'{where}: unknown point {name!r}')
        return pattern.points[name]
    if set(spec) == {'along', 'at_y_of'}:
        ab, c = spec['along'], str(spec['at_y_of'])
        if not (isinstance(ab, list) and len(ab) == 2) or any(str(n) not in pattern.points for n in ab + [c]):
            raise RecipeError(f'{where}: along takes two known points and at_y_of a known point')
        a, b = pattern.points[str(ab[0])], pattern.points[str(ab[1])]
        y = pattern.points[c][1]
        if abs(b[1] - a[1]) < 1e-12 or not min(a[1], b[1]) <= y <= max(a[1], b[1]):
            raise RecipeError(f'{where}: the level of {c} is not within segment {ab[0]}–{ab[1]}')
        t = (y - a[1]) / (b[1] - a[1])
        return (a[0] + t * (b[0] - a[0]), y)
    raise RecipeError(f'{where}: a notch is {{point: name}} or {{along: [A, B], at_y_of: C}}')


def _grain(stitch_poly, LineString, direction, where):
    if direction != 'vertical':
        raise RecipeError(f'{where}: grain {direction!r} is not supported (vertical only)')
    c = stitch_poly.representative_point()
    minx, miny, maxx, maxy = stitch_poly.bounds
    chord = stitch_poly.intersection(LineString([(c.x, miny - 1), (c.x, maxy + 1)]))
    segs = getattr(chord, 'geoms', [chord])
    seg = max(segs, key=lambda g: g.length)
    (x0, y0), (x1, y1) = seg.coords[0], seg.coords[-1]
    mid, half = (y0 + y1) / 2, abs(y1 - y0) * GRAIN_SHARE / 2
    return (c.x, mid - half), (c.x, mid + half)


def _close_darts(pattern, stitch, darts, where):
    """Replace each dart run of the outline by its mouth. A run is an odd number of
    consecutive outline vertices [leg …, apex, … leg]: the middle one is the apex, so
    legs may bend (e.g. a dart moved into a pocket cut). A dart whose mouth has closed to nothing
    (the source's suppression is 0 at this size) isn't a dart: its run becomes one vertex and it
    isn't marked. Returns (outline, darts, notes)."""
    out, found, notes = list(stitch), [], []
    for i, d in enumerate(darts or []):
        if not (isinstance(d, list) and len(d) >= 3 and len(d) % 2 == 1 and all(str(n) in pattern.points for n in d)):
            raise RecipeError(f'{where} dart {i}: expected an odd-length run [leg …, apex, … leg] of known points')
        pts = [pattern.points[str(n)] for n in d]
        n = len(pts)
        hit = [k for k in range(len(out) - n + 1)
               if all(G.dist(out[k + j], pts[j]) < ON_LINE for j in range(n))]
        if len(hit) != 1:
            raise RecipeError(f'{where} dart {i}: {d} is not a run of consecutive outline vertices')
        if G.dist(pts[0], pts[-1]) < ON_LINE:
            del out[hit[0] + 1:hit[0] + n]
            notes.append(f'dart {i} {d} has no width at this size: not drawn')
            continue
        del out[hit[0] + 1:hit[0] + n - 1]
        found.append(tuple(pts))
    return out, found, notes


def build_pieces(pattern, seam_allowance, label_head=()):
    """Gated pattern → [Piece], laid out left to right. Raises RecipeError on any spec problem."""
    Polygon, LineString = _shapely()
    specs = {str(k): v for k, v in (pattern.recipe.get('export') or {}).items()}
    extra = set(specs) - set(pattern.pieces)
    if extra:
        raise RecipeError(f'export: specs for pieces the pattern does not have: {sorted(extra)}')
    if not isinstance(seam_allowance, (int, float)) or seam_allowance < 0:
        raise RecipeError(f'seam allowance {seam_allowance!r} must be a number of cm, 0 or more')
    out = []
    for name, stitch in pattern.pieces.items():
        where = f'export {name!r}'
        spec = specs.get(name)
        if spec == {'omit': True}:          # a construction-stage piece this garment doesn't use
            continue
        if not isinstance(spec, dict) or set(spec) - SPEC_KEYS or 'cut' not in spec or 'grain' not in spec:
            raise RecipeError(f'{where}: every piece needs {{cut, grain, notches?}}')
        if not isinstance(spec['cut'], int) or spec['cut'] < 1:
            raise RecipeError(f'{where}: cut must be a positive integer')
        stitch, darts, repairs = _close_darts(pattern, stitch, spec.get('darts'), where)
        poly = Polygon(stitch)
        if not poly.is_valid:
            # A tangent construction can cross a side line by micrometres (e.g. the lower cap's
            # arc at 352). Repair only such slivers; anything that changes the area more stops.
            fixed = poly.buffer(0)
            delta = abs(fixed.area - poly.area)
            if fixed.geom_type != 'Polygon' or delta > SLIVER_AREA:
                raise RecipeError(f'{where}: the stitch outline is not a simple polygon')
            poly, stitch = fixed, _ring(fixed)
            repairs.append(f'self-touching outline repaired (area change {delta:.1e} cm²)')
        cut_poly = poly.buffer(seam_allowance, join_style='mitre', mitre_limit=MITRE_LIMIT)
        if cut_poly.geom_type != 'Polygon' or list(cut_poly.interiors):
            raise RecipeError(f'{where}: the seam allowance does not give a single outline')
        Point = type(poly.centroid)

        def notch(p, edge):
            """Notch for stitch point p on an edge with direction `edge`: outward along the edge
            normal, snapped onto the cut edge (exact at mitred corners), cut NOTCH_DEPTH in."""
            nrm = G.unit(G.perp(edge))
            if poly.contains(Point(p[0] + nrm[0] * 1e-3, p[1] + nrm[1] * 1e-3)):
                nrm = (-nrm[0], -nrm[1])                     # point outward
            ring = cut_poly.exterior
            q = ring.interpolate(ring.project(Point(p[0] + nrm[0] * seam_allowance, p[1] + nrm[1] * seam_allowance)))
            outer = (q.x, q.y)
            inward = G.sub(p, outer) if seam_allowance else (-nrm[0], -nrm[1])   # a cut-line source:
            return outer, G.offset(outer, inward, NOTCH_DEPTH)                   # the point is on the edge

        notches = []
        for i, n in enumerate(spec.get('notches') or []):
            p = _notch_point(pattern, n, f'{where} notch {i}')
            near = _nearest_segment(stitch, p)
            if near is None or near[0] > ON_LINE:
                raise RecipeError(f'{where} notch {i}: point is {near[0] if near else "?"} cm off the stitch line')
            notches.append(notch(p, near[1]))
        drills = []
        for d in darts:
            m = len(d) // 2
            apex, (a, b) = d[m], (d[m - 1], d[m + 1])            # legs' last segments meet at the apex
            drills.append(G.offset(apex, G.sub(((a[0] + b[0]) / 2, (a[1] + b[1]) / 2), apex), DRILL_BACK))
            notches.extend(notch(leg, G.sub(d[-1], d[0])) for leg in (d[0], d[-1]))
        darts = list(darts)
        for i, d in enumerate(spec.get('inner_darts') or []):
            w = f'{where} inner dart {i}'
            if not isinstance(d, list) or len(d) != 4:
                raise RecipeError(f'{w}: expected [apex, leg, apex, leg] of known points')
            q = [pattern.points[n] if n in pattern.points else None for n in map(str, d)]
            if None in q:
                raise RecipeError(f'{w}: unknown point in {d}')
            if not all(poly.buffer(ON_LINE).covers(Point(*c)) for c in q):    # an apex may touch the edge
                raise RecipeError(f'{w}: {d} is not inside the stitch outline')
            mid = ((q[1][0] + q[3][0]) / 2, (q[1][1] + q[3][1]) / 2)
            drills.extend(G.offset(q[k], G.sub(mid, q[k]), DRILL_BACK) for k in (0, 2))
            darts.append(tuple(q + [q[0]]))
        slits = []
        for i, sl in enumerate(spec.get('slits') or []):
            w = f'{where} slit {i}'
            if not isinstance(sl, list) or len(sl) != 2 or not all(str(n) in pattern.points for n in sl):
                raise RecipeError(f'{w}: expected [start, end] of known points')
            q = [pattern.points[str(n)] for n in sl]
            if not all(poly.buffer(ON_LINE).covers(Point(*c)) for c in q):
                raise RecipeError(f'{w}: {sl} is not inside the stitch outline')
            slits.append(tuple(q))
        grain = _grain(poly, LineString, spec['grain'], where)
        allowance = (f'seam allowance {seam_allowance:g} cm included' if seam_allowance
                     else 'cut on the drawn line (the source includes turnings)')
        label = list(label_head) + [name, f'cut {spec["cut"]}', allowance]
        out.append(Piece(name=name, stitch=list(stitch), cut=_ring(cut_poly), cut_count=spec['cut'], grain=grain,
                         notches=notches, darts=darts, drills=drills, slits=slits, label=label, repairs=repairs))
    x = 0.0
    for pc in out:                                            # layout: left to right, tops aligned
        minx = min(p[0] for p in pc.cut)
        miny = min(p[1] for p in pc.cut)
        pc.offset = (x - minx, -miny)
        x += max(p[0] for p in pc.cut) - minx + GAP
    return out


def extent(pieces):
    pts = [p for pc in pieces for p in pc.placed(pc.cut)]
    return max(p[0] for p in pts), max(p[1] for p in pts)


# ---------------- SVG ----------------
def _pl(pts):
    return ' '.join(f'{x:.4f},{y:.4f}' for x, y in pts)


def svg(pieces, title):
    from xml.sax.saxutils import escape
    w, h = extent(pieces)
    w, h = w + 1, h + TEST_SQUARE + 4
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{w:.2f}cm" height="{h:.2f}cm" viewBox="-0.5 -0.5 {w:.3f} {h:.3f}">',
           f'<title>{escape(title)}</title>',
           f'<rect x="-0.5" y="-0.5" width="{w:.3f}" height="{h:.3f}" fill="white"/>']
    for pc in pieces:
        out.append(f'<g id="{escape(pc.name)}">')
        out.append(f'<polygon points="{_pl(pc.placed(pc.cut))}" fill="none" stroke="black" stroke-width="0.05"/>')
        out.append(f'<polygon points="{_pl(pc.placed(pc.stitch))}" fill="none" stroke="black" stroke-width="0.03" '
                   f'stroke-dasharray="0.4 0.25"/>')
        for a, b in pc.notches:
            out.append(f'<polyline points="{_pl(pc.placed([a, b]))}" stroke="black" stroke-width="0.05"/>')
        for d in pc.darts:
            out.append(f'<polyline points="{_pl(pc.placed(list(d)))}" fill="none" stroke="black" stroke-width="0.03"/>')
        for sl in pc.slits:
            out.append(f'<polyline points="{_pl(pc.placed(list(sl)))}" fill="none" stroke="black" stroke-width="0.05"/>')
        for x, y in pc.placed(pc.drills):
            out.append(f'<circle cx="{x:.4f}" cy="{y:.4f}" r="{DRILL_R}" fill="none" stroke="black" stroke-width="0.03"/>')
        (gx0, gy0), (gx1, gy1) = pc.placed(list(pc.grain))
        out.append(f'<polyline points="{_pl([(gx0, gy0), (gx1, gy1)])}" stroke="black" stroke-width="0.04"/>')
        for tip, back in (((gx0, gy0), 1), ((gx1, gy1), -1)):
            out.append(f'<polyline points="{_pl([(tip[0] - 0.4, tip[1] + back * 0.8), tip, (tip[0] + 0.4, tip[1] + back * 0.8)])}" '
                       f'fill="none" stroke="black" stroke-width="0.04"/>')
        for i, line in enumerate(pc.label):
            out.append(f'<text x="{gx0 + 0.8:.3f}" y="{(gy0 + gy1) / 2 - 2 + i * 1.4:.3f}" font-size="1.0" '
                       f'font-family="sans-serif">{escape(line)}</text>')
        out.append('</g>')
    y = h - TEST_SQUARE - 3
    out.append(f'<rect x="0" y="{y:.3f}" width="{TEST_SQUARE}" height="{TEST_SQUARE}" fill="none" stroke="black" stroke-width="0.05"/>')
    out.append(f'<text x="{TEST_SQUARE + 0.6:.3f}" y="{y + 2:.3f}" font-size="1.0" font-family="sans-serif">'
               f'test square {TEST_SQUARE:g} × {TEST_SQUARE:g} cm</text>')
    out.append('</svg>')
    return '\n'.join(out) + '\n'


# ---------------- DXF ----------------
def dxf(pieces, path, title):
    """DXF R2010 in cm ($INSUNITS 5), layers CUT, STITCH, NOTCH, DART, DRILL, GRAIN, TEXT. y is flipped
    (DXF is y-up). Header GUIDs and dates are fixed so the file is reproducible."""
    import ezdxf
    ezdxf.options.write_fixed_meta_data_for_testing = True        # no "written at" timestamps
    doc = ezdxf.new('R2010', setup=False)
    doc.header['$INSUNITS'] = 5
    doc.header['$MEASUREMENT'] = 1
    for k in ('$FINGERPRINTGUID', '$VERSIONGUID'):
        doc.header[k] = '{00000000-0000-0000-0000-000000000000}'
    for k in ('$TDCREATE', '$TDUCREATE', '$TDUPDATE', '$TDUUPDATE'):
        doc.header[k] = 2451545.0                                   # fixed date (J2000)
    for name, colour in (('CUT', 7), ('STITCH', 5), ('NOTCH', 1), ('DART', 6), ('DRILL', 6), ('GRAIN', 3), ('TEXT', 7)):
        doc.layers.add(name, color=colour)
    msp = doc.modelspace()
    flip = lambda pts: [(x, -y) for x, y in pts]                 # noqa: E731
    for pc in pieces:
        msp.add_lwpolyline(flip(pc.placed(pc.cut)), close=True, dxfattribs={'layer': 'CUT'})
        msp.add_lwpolyline(flip(pc.placed(pc.stitch)), close=True, dxfattribs={'layer': 'STITCH'})
        for a, b in pc.notches:
            a, b = flip(pc.placed([a, b]))
            msp.add_line(a, b, dxfattribs={'layer': 'NOTCH'})
        for d in pc.darts:
            msp.add_lwpolyline(flip(pc.placed(list(d))), dxfattribs={'layer': 'DART'})
        for sl in pc.slits:
            msp.add_lwpolyline(flip(pc.placed(list(sl))), dxfattribs={'layer': 'CUT'})
        for c in flip(pc.placed(pc.drills)):
            msp.add_circle(c, DRILL_R, dxfattribs={'layer': 'DRILL'})
        g0, g1 = flip(pc.placed(list(pc.grain)))
        msp.add_line(g0, g1, dxfattribs={'layer': 'GRAIN'})
        for i, line in enumerate(pc.label):
            msp.add_text(line, height=1.0, dxfattribs={'layer': 'TEXT'}).set_placement((g0[0] + 0.8, (g0[1] + g1[1]) / 2 + 2 - i * 1.4))
    doc.header['$PROJECTNAME'] = title[:255]
    doc.saveas(path)
    _fix_dxf_dates(path)


def _fix_dxf_dates(path):
    """ezdxf refreshes $TDUPDATE etc. on save; rewrite them so rebuilds are byte-identical."""
    with open(path, encoding='utf-8') as f:
        lines = f.read().split('\n')
    for i, line in enumerate(lines[:-2]):
        if line.strip() in ('$TDCREATE', '$TDUCREATE', '$TDUPDATE', '$TDUUPDATE') and lines[i + 1].strip() == '40':
            lines[i + 2] = '2451545.0'
        if line.strip() in ('$FINGERPRINTGUID', '$VERSIONGUID') and lines[i + 1].strip() == '2':
            lines[i + 2] = '{00000000-0000-0000-0000-000000000000}'
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write('\n'.join(lines))


# ---------------- tiled PDF ----------------
def tiles(width, height, page):
    """Tile grid for a layout of width × height cm on a page (w, h) cm: [(row, col, x0, y0)].
    Each tile shows a (w − 2·margin) × (h − 2·margin) window; neighbours overlap by OVERLAP."""
    pw, ph = page[0] - 2 * PAGE_MARGIN, page[1] - 2 * PAGE_MARGIN
    sx, sy = pw - OVERLAP, ph - OVERLAP
    cols = max(1, math.ceil((width - OVERLAP) / sx))
    rows = max(1, math.ceil((height - OVERLAP) / sy))
    return [(r, c, c * sx, r * sy) for r in range(rows) for c in range(cols)], (pw, ph), (rows, cols)


def _font():
    """DejaVu Sans (Cyrillic) embedded in the PDF; the built-in Helvetica has no Cyrillic."""
    from pathlib import Path
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    if 'DejaVuSans' not in pdfmetrics.getRegisteredFontNames():
        if not Path(FONT).exists():
            raise RecipeError(f'PDF font missing: {FONT} (fonts-dejavu-core in the tools image)')
        pdfmetrics.registerFont(TTFont('DejaVuSans', FONT))
    return 'DejaVuSans'


def _cover(c, pieces, grid, rows, cols, page, title, lines, font, cm):
    """Page 1: title and facts, the test square, and a scaled map of the tiles."""
    y = page[1] - PAGE_MARGIN - 0.6
    c.setFont(font, 14)
    c.drawString(PAGE_MARGIN * cm, y * cm, title)
    c.setFont(font, 9)
    for line in list(lines) + [f'{len(grid)} tile pages ({rows} rows × {cols} columns) after this cover; '
                               f'overlap {OVERLAP:g} cm, trim on the dotted line.',
                               'Print at 100% ("actual size"), then check the test square before cutting.']:
        y -= 0.55
        c.drawString(PAGE_MARGIN * cm, y * cm, line)
    y -= 0.8 + TEST_SQUARE
    c.setLineWidth(0.6)
    c.rect(PAGE_MARGIN * cm, y * cm, TEST_SQUARE * cm, TEST_SQUARE * cm, stroke=1, fill=0)
    c.drawString((PAGE_MARGIN + TEST_SQUARE + 0.4) * cm, (y + TEST_SQUARE / 2) * cm,
                 f'test square: {TEST_SQUARE:g} × {TEST_SQUARE:g} cm')
    top = y - 0.8                                                  # map area: below the square
    w, h = extent(pieces)
    s = min((page[0] - 2 * PAGE_MARGIN) / w, (top - PAGE_MARGIN) / h)
    to_map = lambda p: ((PAGE_MARGIN + p[0] * s) * cm, (top - p[1] * s) * cm)    # noqa: E731
    c.setLineWidth(0.5)
    for pc in pieces:
        pts = pc.placed(pc.cut)
        pth = c.beginPath()
        pth.moveTo(*to_map(pts[0]))
        for p in pts[1:]:
            pth.lineTo(*to_map(p))
        pth.close()
        c.drawPath(pth, stroke=1, fill=0)
    pw, ph = page[0] - 2 * PAGE_MARGIN, page[1] - 2 * PAGE_MARGIN
    c.setLineWidth(0.3)
    c.setDash(1, 2)
    c.setFont(font, 7)
    for n, (r, col, x0, y0) in enumerate(grid):
        (ax, ay), (bx, by) = to_map((x0, y0)), to_map((x0 + pw, y0 + ph))
        c.rect(ax, by, bx - ax, ay - by, stroke=1, fill=0)
        c.drawString(ax + 2, ay - 9, str(n + 2))
    c.setDash()


def pdf(pieces, path, title, page_name, cover=()):
    """Tiled PDF at 1:1: a cover page (facts, test square, tile map), then the tiles. Each
    tile carries its page number, row/column, trim lines for the overlap and the title.
    Print at 100% ("actual size"). Returns the number of pages, cover included."""
    from reportlab.lib.units import cm
    from reportlab.pdfgen import canvas
    font = _font()
    page = PAGES[page_name]
    w, h = extent(pieces)
    grid, (pw, ph), (rows, cols) = tiles(w, h, page)
    c = canvas.Canvas(str(path), pagesize=(page[0] * cm, page[1] * cm), invariant=1)
    c.setTitle(title)
    c.setAuthor('ccat export')
    _cover(c, pieces, grid, rows, cols, page, title, cover, font, cm)
    c.showPage()
    for n, (r, col, x0, y0) in enumerate(grid):
        # page coordinates: origin bottom-left; layout y grows downward
        to_page = lambda p: ((PAGE_MARGIN + p[0] - x0) * cm, (page[1] - PAGE_MARGIN - (p[1] - y0)) * cm)  # noqa: E731
        c.saveState()
        clip = c.beginPath()
        clip.rect(PAGE_MARGIN * cm, PAGE_MARGIN * cm, pw * cm, ph * cm)
        c.clipPath(clip, stroke=0, fill=0)
        for pc in pieces:
            q = pc.placed(pc.cut)
            if (max(p[0] for p in q) < x0 or min(p[0] for p in q) > x0 + pw or
                    max(p[1] for p in q) < y0 or min(p[1] for p in q) > y0 + ph):
                continue                                       # piece not on this tile
            for pts, lw, dash in ((pc.placed(pc.cut), 0.6, None), (pc.placed(pc.stitch), 0.35, (3, 2))):
                c.setLineWidth(lw)
                c.setDash(*(dash or ()))
                pth = c.beginPath()
                pth.moveTo(*to_page(pts[0]))
                for p in pts[1:]:
                    pth.lineTo(*to_page(p))
                pth.close()
                c.drawPath(pth, stroke=1, fill=0)
            c.setDash()
            c.setLineWidth(0.6)
            for a, b in pc.notches:
                c.line(*to_page(pc.placed([a])[0]), *to_page(pc.placed([b])[0]))
            c.setLineWidth(0.35)
            for d in pc.darts:
                q = pc.placed(list(d))
                for u, v in zip(q, q[1:]):
                    c.line(*to_page(u), *to_page(v))
            for sl in pc.slits:
                q = pc.placed(list(sl))
                c.line(*to_page(q[0]), *to_page(q[1]))
            for p in pc.placed(pc.drills):
                c.circle(*to_page(p), DRILL_R * cm, stroke=1, fill=0)
            g0, g1 = pc.placed(list(pc.grain))
            c.setLineWidth(0.45)
            c.line(*to_page(g0), *to_page(g1))
            c.setFont(font, 0.9 * cm * 0.7)
            for i, line in enumerate(pc.label):
                c.drawString(*to_page((g0[0] + 0.8, (g0[1] + g1[1]) / 2 - 2 + i * 1.4)), line)
        c.restoreState()
        c.setLineWidth(0.3)
        c.setDash(1, 2)                                          # trim lines: overlap boundary
        if col > 0:
            c.line((PAGE_MARGIN + OVERLAP) * cm, PAGE_MARGIN * cm, (PAGE_MARGIN + OVERLAP) * cm, (page[1] - PAGE_MARGIN) * cm)
        if r > 0:
            yb = (page[1] - PAGE_MARGIN - OVERLAP) * cm
            c.line(PAGE_MARGIN * cm, yb, (page[0] - PAGE_MARGIN) * cm, yb)
        c.setDash()
        c.setFont(font, 7)
        c.drawString(PAGE_MARGIN * cm, 0.4 * cm,
                     f'{title}   page {n + 2}/{len(grid) + 1}   row {r + 1} col {col + 1} of {rows}×{cols}   '
                     f'print at 100% (actual size); overlap {OVERLAP:g} cm, trim on the dotted line')
        c.showPage()
    c.save()
    return len(grid) + 1


# ---------------- catalog entry ----------------
def sha256(path):
    with open(path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()


def write_entry(path, entry):
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(entry, f, ensure_ascii=False, indent=1)
        f.write('\n')
