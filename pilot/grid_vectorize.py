"""Vectorize a pattern printed on a squared grid (e.g. Walker 1909 cutting-out
diagrams: 1 square = 1 inch, pattern drawn as a wide mid-gray band).

Steps: deskew -> grid period/phase (thin lines) -> pattern mask by tone+width
-> skeleton -> traced polylines -> inches -> SVG (1:1) + overlay + report.

usage: python grid_vectorize.py <page.png> <out_prefix> [--crop x0,y0,x1,y1]
       [--tone lo,hi] [--min-width px] [--inch-per-square 1]
"""
import argparse
import json
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from skimage.morphology import skeletonize, disk, binary_opening, remove_small_objects
from skimage.measure import approximate_polygon

ap = argparse.ArgumentParser()
ap.add_argument('page'); ap.add_argument('prefix')
ap.add_argument('--crop', default=None)
ap.add_argument('--tone', default='40,215')
ap.add_argument('--min-width', type=float, default=8.0)
ap.add_argument('--inch-per-square', type=float, default=1.0)
a = ap.parse_args()

g = np.asarray(Image.open(a.page).convert('L'), dtype=np.float32)
if a.crop:
    x0, y0, x1, y1 = map(int, a.crop.split(','))
    g = g[y0:y1, x0:x1]

# ---- 1. deskew using thin dark structure (grid + box lines) ----
thin = g < 200
def sharp(img):
    p = img.sum(axis=1).astype(float)
    return float(np.var(np.diff(p)))
angles = np.arange(-2.0, 2.01, 0.05)
ang = max(angles, key=lambda t: sharp(ndi.rotate(thin.astype(np.uint8), t, reshape=False, order=0)))
g = ndi.rotate(g, ang, reshape=False, order=1, cval=255)

# ---- 2. grid period + phase per axis (lags limited to plausible square sizes) ----
gridmask = (g < 215) & (g > 120)
def period_phase(mask, axis, lo=20, hi=80):
    p = mask.sum(axis=axis).astype(float)
    p -= ndi.uniform_filter1d(p, 61)
    ac = np.correlate(p, p, 'full')[len(p) - 1:]
    lag = int(np.argmax(ac[lo:hi]) + lo)
    y0, y1, y2 = ac[lag - 1], ac[lag], ac[lag + 1]
    per = lag + 0.5 * (y0 - y2) / (y0 - 2 * y1 + y2)
    # phase: fold profile at the period, take the argmax bin
    idx = np.arange(len(p))
    bins = 64
    folded = np.bincount(((idx % per) / per * bins).astype(int), weights=np.clip(p, 0, None), minlength=bins)
    phase = (np.argmax(folded) + 0.5) / bins * per
    # refine: locate each grid line near its predicted position, then fit
    # position = phase + k * period over all lines (least squares)
    ks, pos = [], []
    for k in range(int(len(p) / per) + 1):
        c = phase + k * per
        w0, w1 = int(c - per * 0.2), int(c + per * 0.2) + 1
        if w0 < 0 or w1 >= len(p):
            continue
        seg = p[w0:w1]
        if seg.max() <= 0:
            continue
        ks.append(k); pos.append(w0 + np.argmax(seg))
    if len(ks) > 5:
        A = np.vstack([np.ones(len(ks)), ks]).T
        (phase, per), *_ = np.linalg.lstsq(A, np.array(pos, float), rcond=None)
        resid = np.array(pos) - (phase + per * np.array(ks))
        print(f'axis {axis}: {len(ks)} grid lines, period {per:.3f}px, residual sd {resid.std():.2f}px')
    return per, phase
px_per_sq_x, phase_x = period_phase(gridmask, 0)
# squares are square: search y near the x period (avoids locking onto 2x multiples)
px_per_sq_y, phase_y = period_phase(gridmask, 1, int(px_per_sq_x * 0.8), int(px_per_sq_x * 1.25) + 2)

# ---- 3. pattern mask: mid-gray tone AND wide stroke ----
lo, hi = map(float, a.tone.split(','))
m = (g >= lo) & (g <= hi)
r = max(1, int(round(a.min_width / 2)))
m = binary_opening(m, disk(r))                 # kills grid lines + text strokes
m = remove_small_objects(m, 400)
m = ndi.binary_closing(m, structure=disk(2))

# ---- 4. skeleton -> traced polylines ----
sk = skeletonize(m)
nbr = ndi.convolve(sk.astype(int), np.ones((3, 3), int), mode='constant') - 1
pts = set(zip(*np.nonzero(sk)))
deg = {p: nbr[p] for p in pts}
visited = set()
def neighbors(p):
    y, x = p
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            q = (y + dy, x + dx)
            if q != p and q in pts:
                yield q
paths = []
starts = [p for p in pts if deg[p] != 2] + list(pts)   # endpoints/junctions first, then loops
for s in starts:
    for n in neighbors(s):
        if (s, n) in visited or (n, s) in visited:
            continue
        path = [s, n]; visited.add((s, n))
        prev, cur = s, n
        while deg.get(cur, 0) == 2:
            nxt = [q for q in neighbors(cur) if q != prev]
            if not nxt or (cur, nxt[0]) in visited:
                break
            visited.add((cur, nxt[0])); prev, cur = cur, nxt[0]; path.append(cur)
        if len(path) > 25:
            paths.append(np.array(path, float))

# ---- 5. pixels -> inches (origin at a grid intersection) ----
def to_in(yx):
    x = (yx[:, 1] - phase_x) / px_per_sq_x * a.inch_per_square
    y = (yx[:, 0] - phase_y) / px_per_sq_y * a.inch_per_square
    return np.stack([x, y], 1)
polys = [approximate_polygon(to_in(p), tolerance=0.03) for p in paths]   # 0.03in ~ 0.8mm

allp = np.vstack(polys)
mn, mx = allp.min(0), allp.max(0)
report = {
    'skew_deg': round(float(ang), 2),
    'px_per_square_x': round(float(px_per_sq_x), 2), 'px_per_square_y': round(float(px_per_sq_y), 2),
    'squareness_ratio': round(float(px_per_sq_x / px_per_sq_y), 4),
    'polylines': len(polys), 'vertices': int(sum(len(p) for p in polys)),
    'extent_in': [round(float(v), 2) for v in (mx - mn)],
    'bbox_in': [round(float(v), 2) for v in (*mn, *mx)],
}

# ---- outputs: SVG at 1:1 inches, overlay, json ----
pad = 1
W, H = (mx - mn) + 2 * pad
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W:.3f}in" height="{H:.3f}in" viewBox="0 0 {W:.3f} {H:.3f}">',
       '<rect width="100%" height="100%" fill="white"/>']
for p in polys:
    q = p - mn + pad
    svg.append('<polyline fill="none" stroke="black" stroke-width="0.03" points="' +
               ' '.join(f'{x:.3f},{y:.3f}' for x, y in q) + '"/>')
svg.append('</svg>')
open(a.prefix + '.svg', 'w').write('\n'.join(svg))
json.dump({'report': report, 'polylines_in': [p.round(3).tolist() for p in polys]},
          open(a.prefix + '.json', 'w'))

ov = Image.fromarray(g.clip(0, 255).astype(np.uint8)).convert('RGB')
dr = ImageDraw.Draw(ov)
for p in paths:
    dr.line([(x, y) for y, x in p[::3]], fill=(220, 0, 0), width=3)
Image.fromarray((m * 255).astype(np.uint8)).save(a.prefix + '_mask.png')
ov.save(a.prefix + '_overlay.png')
print(json.dumps(report, indent=1))
