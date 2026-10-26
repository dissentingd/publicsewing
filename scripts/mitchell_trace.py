"""Trace a Mitchell-style point diagram page (run in the tools image, --network none).

Finds the page's point markers (target-shaped: dot and rings) and its heavy outline strokes,
traced to polylines (ccat.diagram), in paper inches from the scan's top-left corner. Saves
data/mitchell/trace/p-NNN.yaml (NNN = the book's page), so the adapter, recipes and tests run
anywhere; an overlay PNG goes to work/ for checking by eye (markers red, those found by their
rings alone blue).

usage: python scripts/mitchell_trace.py <pdf> <pdf page> <book page> [--overlay work/mitchell/p17.png]
"""
import argparse
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from ccat import diagram, grid           # noqa: E402

OUT = ROOT / 'data' / 'mitchell' / 'trace'
DPI = 300                                # the scans' 1-bit ink layer (pdfimages: 300 ppi)


def main(argv=None):
    ap = argparse.ArgumentParser(prog='mitchell_trace')
    ap.add_argument('pdf')
    ap.add_argument('pdf_page', type=int)
    ap.add_argument('book_page', type=int)
    ap.add_argument('--overlay')
    a = ap.parse_args(argv)

    ink, _, _ = grid.load_page(a.pdf, a.pdf_page)
    marks = diagram.markers(ink)
    width = diagram.heavy_width(ink)
    traces = diagram.trace(diagram.outline_mask(ink, marks, width), DPI, marks)
    r4 = lambda v: round(float(v), 4)
    doc = {
        'source': {'pdf': Path(a.pdf).name, 'pdf_page': a.pdf_page, 'book_page': a.book_page},
        'units': 'paper inches from the scan corner, x right, y down',
        'dpi': DPI,
        'heavy_px': int(width),
        'markers': [[r4(m['x'] / DPI), r4(m['y'] / DPI)] for m in marks],
        'markers_by_rings': [i for i, m in enumerate(marks) if not m['dot']],
        'traces': [[[r4(x), r4(y)] for x, y in t] for t in traces],
    }
    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / f'p-{a.book_page:03d}.yaml'
    out.write_text(yaml.safe_dump(doc, sort_keys=False, default_flow_style=None, width=110), encoding='utf-8')
    print(f'{out.relative_to(ROOT)}: {len(marks)} markers ({len(doc["markers_by_rings"])} by rings alone), '
          f'{len(traces)} traces, heavy ≥ {width} px')

    if a.overlay:
        import cv2
        import numpy as np
        vis = cv2.cvtColor(np.where(ink, 170, 255).astype(np.uint8), cv2.COLOR_GRAY2BGR)
        for t in traces:
            cv2.polylines(vis, [(np.array(t) * DPI).astype(int)], False, (0, 140, 0), 4)
        for m in marks:
            cv2.circle(vis, (int(m['x']), int(m['y'])), int(max(m['rings'])),
                       (0, 0, 255) if m['dot'] else (255, 0, 0), 3)
        Path(a.overlay).parent.mkdir(parents=True, exist_ok=True)
        cv2.imwrite(a.overlay, cv2.resize(vis, None, fx=0.33, fy=0.33, interpolation=cv2.INTER_AREA))


if __name__ == '__main__':
    sys.exit(main())
