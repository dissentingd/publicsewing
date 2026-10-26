"""To-scale point diagrams (Mitchell 1921 style) → point markers and traced outline strokes.

Pure plumbing, like ccat.grid: nothing here knows a garment. What such a page holds:
  * a construction drawn to an unstated reduction (the scale is never printed; a recipe fits it
    from the points the text places by printed measures alone, see ccat.recipe `drawing:`);
  * every construction point marked by a target: a solid dot inside one or two thin rings, with
    its number printed beside it (the numbers aren't read: a recipe matches its points to the
    markers by position after the fit);
  * thin construction lines and heavy outline strokes (the pattern's cut lines and the curves
    the text leaves "as per diagram").

Scans come as a colour layer plus a sharp 1-bit ink mask (ccat.grid.load_page). Coordinates out
of here are paper inches from the scan's top-left corner, x right, y down.
"""
import math

DOT_AREA = (40, 1600)        # px² at 300 dpi: a marker's solid centre dot
RING_FRAC = 0.75             # share of a circle's samples on ink for it to count as a ring
HEAVY_PX = 5                 # px: outline strokes are at least this wide, construction lines less
MIN_STROKE_IN = 0.3          # paper inches: ink spanning less (numbers, their loops, arrowheads) isn't an outline
SNAP_PX = 25                 # px past a marker's outer ring: a stroke ending this close ends on the point


def _circle_frac(ink, cx, cy, r, n=72):
    import numpy as np
    t = np.linspace(0, 2 * np.pi, n, endpoint=False)
    xs = np.round(cx + r * np.cos(t)).astype(int)
    ys = np.round(cy + r * np.sin(t)).astype(int)
    ok = (xs >= 0) & (ys >= 0) & (xs < ink.shape[1]) & (ys < ink.shape[0])
    return float(ink[ys[ok], xs[ok]].mean()) if ok.any() else 0.0


def _rings(ink, cx, cy, r0, r1):
    """Radii in [r0, r1] (px) where a circle about (cx, cy) lies on ink: one per ring, its middle."""
    out, run = [], []
    for r in range(int(r0), int(r1) + 1):
        if _circle_frac(ink, cx, cy, r) >= RING_FRAC:
            run.append(r)
        elif run:
            out.append(sum(run) / len(run))
            run = []
    if run:
        out.append(sum(run) / len(run))
    return out


def markers(ink):
    """Point markers on a page → list of {'x', 'y', 'dot', 'rings'} in px (centre, dot radius,
    ring radii). A marker is a solid round dot with at least one ring around it; a marker whose
    dot didn't print (some are grey and break up) is found by its rings, at the ring radii the
    page's other markers have."""
    import cv2
    import numpy as np
    n, _, st, cen = cv2.connectedComponentsWithStats(ink.astype(np.uint8), 8)
    found = []
    for i in range(1, n):
        x, y, w, h, a = st[i]
        if not (DOT_AREA[0] < a < DOT_AREA[1] and 0.75 < w / h < 1.33 and a / (w * h) > 0.65):
            continue
        cx, cy = cen[i]
        rd = math.sqrt(a / math.pi)
        rings = _rings(ink, cx, cy, 1.6 * rd, 4.6 * rd)
        if rings and rings[0] <= 3.2 * rd:
            found.append({'x': float(cx), 'y': float(cy), 'dot': rd, 'rings': rings})
    if not found:
        return []
    # markers without a dot: circles at the page's ring radius, ringed like the others
    rd = float(np.median([m['dot'] for m in found]))
    inner = float(np.median([m['rings'][0] for m in found]))
    outer = [m['rings'][1] for m in found if len(m['rings']) > 1]
    r_hough = float(np.median(outer)) if outer else inner
    img = cv2.GaussianBlur(np.where(ink, 0, 255).astype(np.uint8), (5, 5), 1.5)
    c = cv2.HoughCircles(img, cv2.HOUGH_GRADIENT, dp=1, minDist=2 * rd, param1=120, param2=30,
                         minRadius=int(r_hough - 3), maxRadius=int(r_hough + 3))
    for cx, cy, _ in (c[0] if c is not None else []):
        if min(math.hypot(cx - m['x'], cy - m['y']) for m in found) < 2.5 * rd:
            continue
        # refine the centre: the point where the inner ring is most complete
        best = max(((_circle_frac(ink, cx + dx, cy + dy, inner), dx, dy)
                    for dx in range(-3, 4) for dy in range(-3, 4)))
        frac, dx, dy = best
        rings = _rings(ink, cx + dx, cy + dy, 1.6 * rd, 4.6 * rd)
        if frac >= RING_FRAC and len(rings) >= (2 if outer else 1) and abs(rings[0] - inner) <= 3:
            found.append({'x': float(cx + dx), 'y': float(cy + dy), 'dot': 0.0, 'rings': rings})
    return sorted(found, key=lambda m: (round(m['y']), m['x']))


def heavy_width(ink):
    """The stroke width (px) that separates the page's heavy outline strokes from its thin
    construction lines. Diagrams are printed at different reductions, so it's per page: Otsu's
    split of the stroke widths along the ink's skeleton (widths 3–15 px; the 2 px hairlines are
    the rings and dashes)."""
    import cv2
    import numpy as np
    from skimage.morphology import skeletonize
    d = cv2.distanceTransform(ink.astype(np.uint8), cv2.DIST_L2, 5)
    w = np.round(2 * d[skeletonize(ink)]).astype(int)
    w = w[(w >= 3) & (w <= 15)]
    h = np.bincount(w, minlength=16).astype(float)
    best, thr = -1.0, HEAVY_PX
    for t in range(4, 15):
        a, b = h[:t], h[t:]
        if a.sum() == 0 or b.sum() == 0:
            continue
        ma, mb = (a * np.arange(t)).sum() / a.sum(), (b * np.arange(t, 16)).sum() / b.sum()
        var = a.sum() * b.sum() * (ma - mb) ** 2
        if var > best:
            best, thr = var, t
    return thr


def outline_mask(ink, marks, width=None):
    """Heavy strokes only: ink at least `width` px wide (default: heavy_width(ink)), minus the
    markers (each blanked out to just past its outer ring)."""
    import cv2
    import numpy as np
    from skimage.morphology import disk, opening
    width = heavy_width(ink) if width is None else width
    heavy = opening(ink, disk(max(1, (width - 1) // 2))).astype(bool)
    out = heavy.copy()
    for m in marks:
        r = int(math.ceil(max(m['rings']) + 4))
        cv2.circle(out.view(np.uint8), (int(round(m['x'])), int(round(m['y']))), r, 0, -1)
    return out


def trace(mask, dpi, marks=(), min_len_in=MIN_STROKE_IN, simplify_in=0.01):
    """Outline mask → polylines in paper inches. A polyline end within SNAP_PX of a marker's outer
    ring is extended to that marker's centre, so curves the text runs from point to point end on
    the point (the strokes stop short of the ring, the point is its centre). Polylines spanning
    less than min_len_in (a printed number, the loop of its 0 or 8) are dropped."""
    import numpy as np
    from skimage.measure import approximate_polygon
    from . import grid
    out = []
    for pl in grid.trace(mask, min_len_px=int(min_len_in * dpi)):
        xy = np.asarray(pl, float)[:, ::-1]                     # (y, x) → (x, y)
        xy = approximate_polygon(xy, tolerance=simplify_in * dpi)
        pts = [tuple(p) for p in xy]
        for k in (0, -1):
            x, y = pts[k]
            for m in marks:
                if math.hypot(x - m['x'], y - m['y']) <= max(m['rings']) + SNAP_PX:
                    if k == 0:
                        pts.insert(0, (m['x'], m['y']))
                    else:
                        pts.append((m['x'], m['y']))
                    break
        xs, ys = [q[0] for q in pts], [q[1] for q in pts]
        if max(max(xs) - min(xs), max(ys) - min(ys)) >= min_len_in * dpi:
            out.append([(x / dpi, y / dpi) for x, y in pts])
    return out
