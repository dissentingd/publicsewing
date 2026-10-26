"""Trace a Walker-style grid page (run in the tools image, --network none).

Finds the page's grid scale, its fields (A–D rectangles) and, per field, the pattern lines
(traced polylines) and the printed figures (ccat.figread on the book's own glyphs: value and
position; what it can't read is listed as unread), in inches from the field's corner A. Saves
data/walker/trace/p-NNN.yaml (NNN = the book's page), so the adapter, recipes and tests run
anywhere; an overlay PNG goes to work/ for checking by eye (figures green, unread red).

usage: python scripts/walker_trace.py <pdf> <pdf page> <book page> [--overlay work/walker/p235.png]
"""
import argparse
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from ccat import figread, grid           # noqa: E402

OUT = ROOT / 'data' / 'walker' / 'trace'
PROTOS = ROOT / 'data' / 'walker' / 'glyphs' / 'protos.npz'
SIMPLIFY_IN = 0.03                       # polyline simplification tolerance (~0.8 mm)
FIELD_MARGIN = 1.5                       # squares: a figure this far outside a field is still its


def main(argv=None):
    ap = argparse.ArgumentParser(prog='walker_trace')
    ap.add_argument('pdf')
    ap.add_argument('pdf_page', type=int)
    ap.add_argument('book_page', type=int)
    ap.add_argument('--overlay')
    a = ap.parse_args(argv)

    import numpy as np
    from skimage.measure import approximate_polygon
    from skimage.morphology import binary_opening

    pg = grid.prepare(a.pdf, a.pdf_page)
    ink, deg = pg['ink'], pg['skew']
    px, py = pg['px'], pg['py']
    (n_x, n_y), (sd_x, sd_y) = pg['lines'], pg['sd']
    heavy = binary_opening(ink, np.ones((3, 3), bool))     # field lines (pattern lines may lie on them)
    edges = [grid.field_edges(heavy, b, px, py) for b in grid.fields(heavy, px, py)]
    boxes = [e[0] for e in edges]
    thick = min((e[1] for e in edges), default=7)
    pattern = grid.pattern_mask(ink, boxes, thick, px)
    lines = grid.trace(pattern)
    text, damage = grid.text_ink(ink, px, pg['phx'], py, pg['phy'])
    figs, unread = figread.read(grid.glyphs(text, px, damage), px, figread.Model.load(PROTOS))

    def field_of(box):                                     # the field a figure belongs to, or None
        cx, cy = (box[0] + box[2]) / 2, (box[1] + box[3]) / 2
        best = None
        for k, (x0, y0, x1, y1) in enumerate(boxes):
            d = max(x0 - cx, cx - x1, 0) / px + max(y0 - cy, cy - y1, 0) / py
            if d <= FIELD_MARGIN and (best is None or d < best[0]):
                best = (d, k)
        return None if best is None else best[1]

    doc = {'source': {'pdf': Path(a.pdf).name, 'pdf_page': a.pdf_page, 'book_page': a.book_page},
           'grid': {'skew_deg': round(deg, 2), 'px_per_square': [round(px, 3), round(py, 3)],
                    'lines': [n_x, n_y], 'residual_px': [round(sd_x, 2), round(sd_y, 2)]},
           'fields': []}
    for k, (x0, y0, x1, y1) in enumerate(boxes):
        def to_in(xp, yp):
            return round(float((xp - x0) / px), 3), round(float((yp - y0) / py), 3)
        m = 0.5 * px                                       # a line belongs to the field it lies in
        traces = []
        for pl in lines:
            ys, xs = pl[:, 0], pl[:, 1]
            if xs.min() >= x0 - m and xs.max() <= x1 + m and ys.min() >= y0 - m and ys.max() <= y1 + m:
                q = np.stack([(xs - x0) / px, (ys - y0) / py], 1)
                q = approximate_polygon(q, tolerance=SIMPLIFY_IN)
                traces.append([[round(float(u), 3), round(float(v), 3)] for u, v in q])
        def at(b):
            return list(to_in((b[0] + b[2]) / 2, (b[1] + b[3]) / 2))
        doc['fields'].append({
            'size_in': [round(float((x1 - x0) / px), 3), round(float((y1 - y0) / py), 3)],
            'corner_a_px': [round(float(x0), 1), round(float(y0), 1)], 'line_px': int(thick),
            'traces': traces,
            'figures': [{'text': f['text'], 'value': f['value'], 'at': at(f['box'])}
                        for f in figs if field_of(f['box']) == k],
            'unread': [{'text': u['text'], 'at': at(u['box']), 'why': u['why']}
                       for u in unread if field_of(u['box']) == k]})
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f'p-{a.book_page:03d}.yaml'
    head = (f'# Walker page {a.book_page} (PDF page {a.pdf_page}), traced by scripts/walker_trace.py.\n'
            '# Inches from each field\'s corner A, x right, y down. No reading by hand.\n')
    path.write_text(head + yaml.safe_dump(doc, allow_unicode=True, sort_keys=False, default_flow_style=None,
                                          width=120), encoding='utf-8', newline='\n')
    print(f'{path.name}: skew {deg:+.2f}°, {px:.2f} × {py:.2f} px/square ({n_x}/{n_y} lines, sd {sd_x:.2f}/{sd_y:.2f}), '
          f'{len(boxes)} field(s): ' + ', '.join(f'{f["size_in"][0]:.2f} × {f["size_in"][1]:.2f} in, '
                                                f'{len(f["traces"])} traces, {len(f["figures"])} figures, '
                                                f'{len(f["unread"])} unread'
                                                for f in doc['fields']))
    if a.overlay:
        from PIL import Image, ImageDraw
        base = np.where(ink, 90, 235).astype('uint8')
        im = Image.fromarray(base).convert('RGB')
        d = ImageDraw.Draw(im)
        for x0, y0, x1, y1 in boxes:
            d.rectangle((x0, y0, x1, y1), outline=(0, 90, 255), width=4)
        for pl in lines:
            d.line([(x, y) for y, x in pl[::2]], fill=(230, 0, 0), width=4)
        for f, colour in [(f, (0, 170, 0)) for f in figs] + [(u, (220, 0, 0)) for u in unread]:
            d.rectangle(f['box'], outline=colour, width=3)
        im.save(a.overlay)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
