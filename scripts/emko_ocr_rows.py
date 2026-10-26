"""Re-OCR single rows of ЕМКО graded tables (Table x.4), cell by cell (run in the tools image,
--network none). For rows the page OCR misread or dropped.

Column positions come from the page itself: the x-centres of the last 8 words on every line that
ends in 8 numbers, medianed per column. A row is found by its printed number at the start of a
line; a row whose line never read is taken from the band between its neighbours' lines. Each of
its 8 cells is then cropped, upscaled and read digits-only under several settings, and every
reading is kept with its count. Nothing is chosen here: scripts/emko_grade_ocr.py accepts a row from these
readings only if exactly one combination passes the same checks as a page-OCR row.

usage: python scripts/emko_ocr_rows.py <pdf> <table> <row> [<row> ...]
writes data/emko/ocr/rows/<table>.yaml (other rows' entries kept; the rows given are replaced)
"""
import os
import statistics
import sys
import tempfile
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / 'scripts'))
from ccat import ocr                         # noqa: E402
from emko_grade_ocr import TABLES            # noqa: E402

OUT = ROOT / 'data' / 'emko' / 'ocr' / 'rows'
WHITELIST = '0123456789,.-'
SETTINGS = ([(s, p, b, WHITELIST) for s in (3, 4) for p in (7, 8, 13) for b in (False, True)]
            + [(s, 7, b, None) for s in (3, 4) for b in (False, True)])   # unwhitelisted: 0 as O/(), °
PAD = 10                                     # px above/below a text row: digits rise above its ink run
INSET = 6                                    # px in from each ruled column line (read as '1' otherwise)


def number(t):
    v = ocr.to_number(t.strip('°|[](){}\'’‘"!:;'))
    return v


def page_lines(png):
    lines = {}
    for w in ocr.words(png):
        lines.setdefault(w['line'], []).append(w)
    out = []
    for ws in lines.values():
        ws.sort(key=lambda w: w['x0'])
        out.append({'words': ws, 'y0': min(w['y0'] for w in ws), 'y1': max(w['y1'] for w in ws)})
    return sorted(out, key=lambda l: l['y0'])


def skew(lines):
    """Median slope (dy/dx) of the numeric words along each line: these scans sit up to ~2.5° off."""
    slopes = []
    for l in lines:
        pts = [((w['x0'] + w['x1']) / 2, (w['y0'] + w['y1']) / 2) for w in l['words'][-8:] if number(w['text']) is not None]
        if len(pts) >= 6:
            mx, my = statistics.mean(p[0] for p in pts), statistics.mean(p[1] for p in pts)
            sxx = sum((x - mx) ** 2 for x, _ in pts)
            if sxx:
                slopes.append(sum((x - mx) * (y - my) for x, y in pts) / sxx)
    return statistics.median(slopes) if len(slopes) >= 3 else 0.0


def level(png, lines):
    """Rotate the page level, in place. → (degrees, map) where map(x, y) is a point's new y."""
    import math
    from PIL import Image
    deg = math.degrees(math.atan(skew(lines)))
    im = Image.open(png).convert('L')
    cx, cy, t = im.width / 2, im.height / 2, math.radians(deg)
    if abs(deg) > 0.1:
        im.rotate(deg, resample=Image.BICUBIC, expand=False, fillcolor=255).save(png)
    return deg, lambda x, y: cy - (x - cx) * math.sin(t) + (y - cy) * math.cos(t)


def text_rows(png, cols, dark=128, min_cols=4, min_h=10):
    """Text rows of the levelled page: y-runs where at least `min_cols` value columns have ink in
    their interior (the middle 70%, clear of the ruled column lines). → [(y0, y1)]."""
    from PIL import Image
    im = Image.open(png).convert('L')
    px = im.load()
    inner = [(round(x0 + 0.15 * (x1 - x0)), round(x1 - 0.15 * (x1 - x0))) for x0, x1 in cols]
    runs, start = [], None
    for y in range(im.height):
        n = sum(1 for x0, x1 in inner if any(px[x, y] < dark for x in range(x0, x1, 2)))
        if n >= min_cols and start is None:
            start = y
        elif n < min_cols and start is not None:
            if y - start >= min_h:
                runs.append((start, y))
            start = None
    return runs


def columns(lines):
    cols = [[] for _ in range(8)]
    for l in lines:
        tail = l['words'][-8:]
        if len(tail) == 8 and all(number(w['text']) is not None for w in tail):
            for i, w in enumerate(tail):
                cols[i].append((w['x0'] + w['x1']) / 2)
    if min(len(c) for c in cols) < 3:
        return None
    centres = [statistics.median(c) for c in cols]
    half = statistics.median(b - a for a, b in zip(centres, centres[1:])) / 2
    return [(round(c - half), round(c + half)) for c in centres]


def numbered(lines, x_max, ymap):
    """[(row number, levelled y)] of lines whose first word is a row number in the number column."""
    out = []
    for l in lines:
        w = l['words'][0] if l['words'] else None
        v = number(w['text']) if w else None
        if v is not None and 0 < v < 100 and w['x1'] < x_max and len(l['words']) > 1:
            out.append((int(v) if float(v).is_integer() else v, ymap((w['x0'] + w['x1']) / 2, (w['y0'] + w['y1']) / 2)))
    return out


def bands(nums, runs, row, snap=25):
    """[(y0, y1, how)]: the text row at each line numbered `row`; else every text row between its
    nearest lower- and higher-numbered neighbours."""
    hits = []
    for n, y in nums:
        if n == row:
            near = min(runs, key=lambda r: abs((r[0] + r[1]) / 2 - y), default=None)
            if near and abs((near[0] + near[1]) / 2 - y) <= snap:
                hits.append((near[0] - PAD, near[1] + PAD, 'line'))
    if hits:
        return hits
    lo = max((p for p in nums if p[0] < row), default=None)
    hi = min((p for p in nums if p[0] > row), default=None)
    if lo and hi and hi[1] > lo[1]:
        return [(r[0] - PAD, r[1] + PAD, 'gap') for r in runs if lo[1] + snap < (r[0] + r[1]) / 2 < hi[1] - snap]
    return []


def main(pdf, table, rows):
    pages, _ = TABLES[table]
    rows = [float(r) for r in rows]
    rows = [int(r) if r.is_integer() else r for r in rows]
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f'{table}.yaml'
    found = yaml.safe_load(path.read_text(encoding='utf-8')) if path.exists() else {}
    found = {k: v for k, v in (found or {}).items() if k not in rows}    # rows asked for are re-read fresh
    tmp = tempfile.mkdtemp()
    for page in range(pages[0], pages[1] + 1):
        png = ocr.render(pdf, page, os.path.join(tmp, f'p{page}.png'))
        raw = page_lines(png)
        deg, ymap = level(png, raw)
        cols = columns(page_lines(png)) if abs(deg) > 0.1 else columns(raw)
        if cols is None:
            print(f'page {page}: column positions not found', flush=True)
            continue
        nums, runs = numbered(raw, 0.3 * cols[0][0], ymap), text_rows(png, cols)
        for row in rows:
            for y0, y1, how in bands(nums, runs, row):
                cells = []
                for x0, x1 in cols:                    # {reading: how many settings gave it}
                    reads = [ocr.read_cell(png, (x0 + INSET, y0, x1 - INSET, y1), s, p, w, b) for s, p, b, w in SETTINGS]
                    cells.append({t: reads.count(t) for t in sorted(set(reads) - {''})})
                found.setdefault(row, [])
                found[row] = [c for c in found[row] if (c['page'], c['band']) != (page, [y0, y1])]
                found[row].append({'page': page, 'band': [y0, y1], 'how': how, 'cells': cells})
                print(f'page {page} ({deg:+.2f}°) row {row} ({how}, y {y0:.0f}–{y1:.0f}):', ' | '.join('/'.join(f'{t}×{n}' for t, n in c.items()) for c in cells), flush=True)
        os.remove(png)
    path.write_text(f'# Table {table}: per-cell re-OCR of single rows (scripts/emko_ocr_rows.py). Every distinct\n'
                    '# reading of each cell is kept, with how many settings gave it; scripts/emko_grade_ocr.py decides.\n'
                    + yaml.safe_dump(found, allow_unicode=True, sort_keys=True, default_flow_style=None, width=120),
                    encoding='utf-8', newline='\n')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main(sys.argv[1], sys.argv[2], sys.argv[3:])
