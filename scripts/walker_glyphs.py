"""Build the figure reader's prototypes from labelled Walker pages (run in the tools image,
--network none).

data/walker/glyphs/labels.yaml lists, per PDF page, each figure glyph's centre and class; every
other figure-sized glyph on a labelled page becomes a junk prototype, except those under `skip`.
Each page is segmented as the reader segments it (ccat.grid.text_ink, glyphs); a label that no
glyph's centre is within 3 px of, nor one glyph's box holds, stops the build (the segmentation
changed: relabel). Writes data/walker/glyphs/protos.npz, which scripts/walker_trace.py loads.

To label another page, draw its glyphs numbered, with their centres listed, and add the figure
glyphs to labels.yaml by centre:

usage: python scripts/walker_glyphs.py [--sheet <pdf page> work/walker/glyphs-p<NNN>.png]
"""
import argparse
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from ccat import figread, grid           # noqa: E402

DIR = ROOT / 'data' / 'walker' / 'glyphs'
NEAR = 3.0                               # px: a label's centre to its glyph's


def page_glyphs(pdf, page):
    pg = grid.prepare(pdf, page)
    text, damage = grid.text_ink(pg['ink'], pg['px'], pg['phx'], pg['py'], pg['phy'])
    return pg, [g for g in grid.glyphs(text, pg['px'], damage) if figread.plausible(g, pg['px'])]


def centre(g):
    x0, y0, x1, y1 = g['box']
    return (x0 + x1) / 2, (y0 + y1) / 2


def match(gl, at):
    """The glyph a label names: its centre within NEAR px, else the one glyph whose box holds the
    point; None if neither (or several boxes and no centre)."""
    best = min(range(len(gl)), key=lambda i: (centre(gl[i])[0] - at[0]) ** 2 + (centre(gl[i])[1] - at[1]) ** 2)
    cx, cy = centre(gl[best])
    if abs(cx - at[0]) <= NEAR and abs(cy - at[1]) <= NEAR:
        return best
    inside = [i for i, g in enumerate(gl) if g['box'][0] <= at[0] < g['box'][2] and g['box'][1] <= at[1] < g['box'][3]]
    return inside[0] if len(inside) == 1 else None


def build(labels):
    pdf = str(ROOT / labels['pdf'])
    masks, cls, pxs, src, miss = [], [], [], [], []
    for page, lab in labels['pages'].items():
        pg, gl = page_glyphs(pdf, int(page))
        y, skip = {}, set()
        for x, yy, c in lab['figures']:
            i = match(gl, (x, yy))
            if i is None or c not in figread.CLASSES or y.get(i, c) != c:
                miss.append(f'page {page}: no glyph at ({x}, {yy}) for {c!r}, not a class, or two labels')
                continue
            y[i] = c
        for x, yy in lab.get('skip') or []:
            i = match(gl, (x, yy))
            if i is not None:
                skip.add(i)
        for i, g in enumerate(gl):
            if i in skip:
                continue
            masks.append(g['mask'])
            cls.append(y.get(i, '.'))
            pxs.append(pg['px'])
            src.append(f'{page}:{centre(g)[0]:.1f}:{centre(g)[1]:.1f}')
        n = sum(1 for i in range(len(gl)) if i in y)
        print(f'page {page}: {len(gl)} glyphs, {n} figure glyphs, {len(skip)} skipped')
    if miss:                                             # the segmentation changed: relabel those
        raise SystemExit('\n'.join(miss))
    figread.save_prototypes(DIR / 'protos.npz', masks, cls, pxs, src)
    print(f'protos.npz: {len(cls)} prototypes, ' +
          ', '.join(f'{c} {cls.count(c)}' for c in sorted(set(cls))))


def sheet(pdf, page, out):
    from PIL import Image, ImageDraw
    import numpy as np
    pg, gl = page_glyphs(pdf, page)
    im = Image.fromarray(np.where(pg['ink'], 150, 255).astype('uint8')).convert('RGB')
    d = ImageDraw.Draw(im)
    for i, g in enumerate(gl):
        d.rectangle(g['box'], outline=(0, 120, 255))
        d.text((g['box'][0], g['box'][1] - 11), str(i), fill=(230, 0, 0))
        print(i, *(round(v, 1) for v in centre(g)))
    im.save(out)


def main(argv=None):
    ap = argparse.ArgumentParser(prog='walker_glyphs')
    ap.add_argument('--sheet', nargs=2, metavar=('PDF_PAGE', 'PNG'))
    a = ap.parse_args(argv)
    labels = yaml.safe_load((DIR / 'labels.yaml').read_text(encoding='utf-8'))
    if a.sheet:
        sheet(str(ROOT / labels['pdf']), int(a.sheet[0]), a.sheet[1])
    else:
        build(labels)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
