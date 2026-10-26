"""Grid-drafted source pages (Walker 1909 style: 1 square = 1 inch) → fields, traced pattern
lines and the printed figures' glyphs (ccat.figread reads them). Run it in the tools image
(numpy, scipy, scikit-image, poppler).

Pure plumbing, like ccat.ocr: nothing here knows a garment. What a page holds:
  * a printed grid of thin lines, the source's scale (1 square = `inch_per_square`);
  * fields: rectangles in heavy black lines, corners lettered A (top left), B, C, D;
  * pattern lines: wide strokes (red in Walker's colour plates);
  * figures: inches from a corner letter, printed beside the points they mark, in small engraved
    italic numerals (1½, 12, 36; "47 × 34" for a field's cloth).

Scanned PDFs of these pages are stored as a colour layer plus a sharp 1-bit ink mask
(pdfimages lists them as an image and its mask). The mask carries every printed line; the
colour layer only says which strokes are red. Coordinates out of here are inches from the
field's corner A, x right, y down.
"""
import os
import subprocess
import tempfile


def load_page(pdf, page):
    """→ (ink: bool array, red: bool array, rgb uint8 array) for one PDF page's main scan."""
    import numpy as np
    from PIL import Image
    tmp = tempfile.mkdtemp()
    subprocess.run(['pdfimages', '-png', '-f', str(page), '-l', str(page), pdf, os.path.join(tmp, 'i')], check=True)
    files = sorted(os.listdir(tmp))
    ims = [(f, Image.open(os.path.join(tmp, f))) for f in files]
    masks = [(f, im) for f, im in ims if im.mode == '1']
    colour = [(f, im) for f, im in ims if im.mode != '1']
    if not masks or not colour:
        raise ValueError(f'page {page}: expected a colour image and its 1-bit mask, found {[im.mode for _, im in ims]}')
    _, mask = max(masks, key=lambda t: t[1].size[0] * t[1].size[1])
    _, rgb = max(colour, key=lambda t: t[1].size[0] * t[1].size[1])
    if rgb.size != mask.size:
        rgb = rgb.resize(mask.size)
    m = np.asarray(mask.convert('L')) > 127
    ink = m if m.mean() < 0.5 else ~m                     # ink is the minority
    a = np.asarray(rgb.convert('RGB')).astype(int)
    red = (a[..., 0] - a[..., 1] > 35) & (a[..., 0] - a[..., 2] > 25)
    for f in files:
        os.remove(os.path.join(tmp, f))
    os.rmdir(tmp)
    return ink, red, a.astype('uint8')


def deskew_angle(ink, span=2.0, step=0.05):
    """Rotation (degrees) that makes the grid's horizontal lines sharpest."""
    import numpy as np
    from scipy import ndimage as ndi
    small = ink[::2, ::2].astype(np.uint8)
    def sharp(t):
        p = ndi.rotate(small, t, reshape=False, order=0).sum(axis=1).astype(float)
        return float(np.var(np.diff(p)))
    return max(np.arange(-span, span + step / 2, step), key=sharp)


def rotate(arr, deg):
    from scipy import ndimage as ndi
    return ndi.rotate(arr, deg, reshape=False, order=0) if abs(deg) > 1e-6 else arr


def prepare(pdf, page):
    """One page, deskewed, with its grid. → {'ink', 'red', 'skew', 'px', 'phx', 'py', 'phy',
    'lines': (n_x, n_y), 'sd': (sd_x, sd_y)}: px per square and phase along x and y."""
    from scipy import ndimage as ndi
    from skimage.morphology import binary_opening, disk
    ink, red, _ = load_page(pdf, page)
    deg = float(deskew_angle(ink))
    ink, red = rotate(ink, deg), rotate(red, deg)
    wide = binary_opening(ink, disk(4))
    thin = ink & ~ndi.binary_dilation(wide, iterations=2)
    px, phx, n_x, sd_x = grid_axis(thin, 0)
    py, phy, n_y, sd_y = grid_axis(thin, 1, int(px * 0.8), int(px * 1.25) + 2)
    return {'ink': ink, 'red': red, 'skew': deg, 'px': px, 'phx': phx, 'py': py, 'phy': phy,
            'lines': (n_x, n_y), 'sd': (sd_x, sd_y)}


def grid_axis(thin, axis, lo=20, hi=80):
    """Grid period and phase along one axis (px), each grid line located then a least-squares
    fit position = phase + k·period. → (period, phase, lines used, residual sd px)."""
    import numpy as np
    from scipy import ndimage as ndi
    p = thin.sum(axis=axis).astype(float)
    p -= ndi.uniform_filter1d(p, 61)
    ac = np.correlate(p, p, 'full')[len(p) - 1:]
    lag = int(np.argmax(ac[lo:hi]) + lo)
    half = lag // 2                                      # every other line stronger: the peak at
    if half - 2 >= lo:                                   # twice the period wins, so look at half
        h = int(np.argmax(ac[half - 2:half + 3]) + half - 2)
        if ac[h] >= 0.5 * ac[lag]:
            lag = h
    y0, y1, y2 = ac[lag - 1], ac[lag], ac[lag + 1]
    per = lag + 0.5 * (y0 - y2) / (y0 - 2 * y1 + y2)
    idx = np.arange(len(p))
    bins = 64
    folded = np.bincount(((idx % per) / per * bins).astype(int), weights=np.clip(p, 0, None), minlength=bins)
    phase = (np.argmax(folded) + 0.5) / bins * per
    ks, pos = [], []
    for k in range(int(len(p) / per) + 1):
        c = phase + k * per
        w0, w1 = int(c - per * 0.2), int(c + per * 0.2) + 1
        if w0 < 0 or w1 >= len(p) or p[w0:w1].max() <= 0:
            continue
        ks.append(k)
        pos.append(w0 + int(np.argmax(p[w0:w1])))
    A = np.vstack([np.ones(len(ks)), ks]).T
    (phase, per), *_ = np.linalg.lstsq(A, np.array(pos, float), rcond=None)
    resid = np.array(pos) - (phase + per * np.array(ks))
    return float(per), float(phase), len(ks), float(resid.std())


def fields(heavy, px_x, px_y, min_side=2.0):
    """Rectangles bounded by heavy lines. heavy: bool mask of the field-line ink. Lines are found
    as long straight runs (≥ `min_side` squares); a field is a rectangle whose four sides are each
    covered ≥ 90% by such runs and which no other run crosses from side to side (the smallest
    cells). → [(x0, y0, x1, y1)] px, top-left first."""
    import numpy as np
    from scipy import ndimage as ndi
    hl = ndi.binary_opening(heavy, structure=np.ones((1, int(min_side * px_x))))
    vl = ndi.binary_opening(heavy, structure=np.ones((int(min_side * px_y), 1)))

    def lines(mask, axis):                               # → [(position, start, end)]
        lab, n = ndi.label(mask)
        out = []
        for sl in ndi.find_objects(lab):
            if axis == 0:                                # horizontal: y position, x extent
                out.append(((sl[0].start + sl[0].stop - 1) / 2, sl[1].start, sl[1].stop - 1))
            else:
                out.append(((sl[1].start + sl[1].stop - 1) / 2, sl[0].start, sl[0].stop - 1))
        return out

    def merge(ls, tol):
        ls = sorted(ls)
        out = []
        for pos, a, b in ls:
            for i, (p2, a2, b2) in enumerate(out):
                if abs(p2 - pos) <= tol and a <= b2 + tol and b >= a2 - tol:
                    out[i] = ((p2 + pos) / 2, min(a, a2), max(b, b2))
                    break
            else:
                out.append((pos, a, b))
        return out

    H = merge(lines(hl, 0), px_y * 0.1)                  # small: a field line and a pattern line
    V = merge(lines(vl, 1), px_x * 0.1)                  # beside it stay two lines

    def covered(segs, pos, a, b, tol):
        span = [(max(a, s0), min(b, s1)) for p, s0, s1 in segs if abs(p - pos) <= tol and s1 > a and s0 < b]
        if not span:
            return 0.0
        span.sort()
        tot, cur0, cur1 = 0.0, *span[0]
        for s0, s1 in span[1:]:
            if s0 > cur1:
                tot += cur1 - cur0
                cur0, cur1 = s0, s1
            else:
                cur1 = max(cur1, s1)
        return (tot + cur1 - cur0) / (b - a)

    tol = 0.3 * min(px_x, px_y)
    hs = sorted({round(h[0], 1) for h in H})
    vs = sorted({round(v[0], 1) for v in V})
    rects = []
    for i, y0 in enumerate(hs):
        for y1 in hs[i + 1:]:
            if y1 - y0 < min_side * px_y:
                continue
            for j, x0 in enumerate(vs):
                for x1 in vs[j + 1:]:
                    if x1 - x0 < min_side * px_x:
                        continue
                    if min(covered(H, y0, x0, x1, tol), covered(H, y1, x0, x1, tol),
                           covered(V, x0, y0, y1, tol), covered(V, x1, y0, y1, tol)) >= 0.9:
                        rects.append((x0, y0, x1, y1))
    def split(r):                                        # another run crossing r from side to side
        x0, y0, x1, y1 = r
        return (any(y0 + tol < y < y1 - tol and covered(H, y, x0, x1, tol) >= 0.9 for y in hs)
                or any(x0 + tol < x < x1 - tol and covered(V, x, y0, y1, tol) >= 0.9 for x in vs))
    cells = [r for r in rects if not split(r)]
    near = 0.6 * min(px_x, px_y)                         # the same field found on a line beside its own:
    keep = []                                            # keep the outermost
    for r in sorted(cells, key=lambda r: -(r[2] - r[0]) * (r[3] - r[1])):
        if not any(all(abs(a - b) <= near for a, b in zip(r, k)) for k in keep):
            keep.append(r)
    return sorted(keep, key=lambda r: (round(r[1] / px_y), r[0]))


def field_edges(heavy, box, px_x, px_y):
    """Each edge of a field box as its own line: the outermost run of heavy ink across the edge
    (a pattern line may run just inside it, or merge with it). → (box at the line centres,
    line thickness px). Where an edge merges with a pattern line the thickness is taken from
    the other edges."""
    import numpy as np
    x0, y0, x1, y1 = (int(round(v)) for v in box)
    w = int(0.6 * max(px_x, px_y))
    runs = {}
    for side, (lo, hi, along) in {'l': (x0 - w, x0 + w, (y0, y1)), 'r': (x1 - w, x1 + w, (y0, y1)),
                                  't': (y0 - w, y0 + w, (x0, x1)), 'b': (y1 - w, y1 + w, (x0, x1))}.items():
        a, b = along
        if side in 'lr':
            prof = heavy[a:b, lo:hi].sum(axis=0)
        else:
            prof = heavy[lo:hi, a:b].sum(axis=1)
        on = prof > 0.6 * (b - a)
        idx = np.nonzero(on)[0]
        if not len(idx):
            raise ValueError(f'field edge {side} at {box}: no line')
        groups = np.split(idx, np.nonzero(np.diff(idx) > 1)[0] + 1)
        g = groups[0] if side in 'lt' else groups[-1]    # outermost
        runs[side] = (lo + g[0], lo + g[-1], side in 'lt')
    thick = sorted(r[1] - r[0] + 1 for r in runs.values())
    t = thick[len(thick) // 2 - 1] if len(thick) >= 2 else thick[0]  # the thinner middle: unmerged edges
    def centre(r):
        a, b, outer_first = r
        return (a + (t - 1) / 2) if outer_first else (b - (t - 1) / 2)
    return (centre(runs['l']), centre(runs['t']), centre(runs['r']), centre(runs['b'])), int(t)


def pattern_mask(ink, boxes, thickness, px, min_width_px=5, min_extent_sq=1.5):
    """Pattern strokes: ink at least `min_width_px` wide (an opening drops the grid), minus the
    field lines' own pixels (boxes: field line centres, `thickness` px), minus pieces shorter
    than `min_extent_sq` squares (text, dashes, arrows). A pattern line that lies on a field
    edge goes with the field line; the recipe draws that stretch along the edge."""
    import numpy as np
    from scipy import ndimage as ndi
    from skimage.morphology import binary_opening, disk
    m = binary_opening(ink, disk(max(1, min_width_px // 2)))
    h = thickness / 2 + 1.5
    yy, xx = np.ogrid[:ink.shape[0], :ink.shape[1]]
    for x0, y0, x1, y1 in boxes:
        inside_x, inside_y = (xx >= x0 - h) & (xx <= x1 + h), (yy >= y0 - h) & (yy <= y1 + h)
        for xe in (x0, x1):
            m &= ~((np.abs(xx - xe) <= h) & inside_y)
        for ye in (y0, y1):
            m &= ~((np.abs(yy - ye) <= h) & inside_x)
    lab, n = ndi.label(m, structure=np.ones((3, 3)))
    keep = np.zeros(n + 1, bool)
    for i, sl in enumerate(ndi.find_objects(lab), 1):
        if max(sl[0].stop - sl[0].start, sl[1].stop - sl[1].start) >= min_extent_sq * px:
            keep[i] = True
    return keep[lab]


def trace(mask, min_len_px=25):
    """Skeleton of a stroke mask → pixel polylines [(N, 2) arrays of (y, x)], broken at
    endpoints and junctions."""
    import numpy as np
    from scipy import ndimage as ndi
    from skimage.morphology import skeletonize
    sk = skeletonize(mask)
    nbr = ndi.convolve(sk.astype(int), np.ones((3, 3), int), mode='constant') - 1
    pts = set(zip(*np.nonzero(sk)))
    deg = {p: nbr[p] for p in pts}

    def neighbours(p):
        y, x = p
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                q = (y + dy, x + dx)
                if q != p and q in pts:
                    yield q

    seen, out = set(), []
    for s in [p for p in pts if deg[p] != 2] + list(pts):     # endpoints/junctions first, then loops
        for n in neighbours(s):
            if (s, n) in seen or (n, s) in seen:
                continue
            path, prev, cur = [s, n], s, n
            seen.add((s, n))
            while deg.get(cur, 0) == 2:
                nxt = [q for q in neighbours(cur) if q != prev]
                if not nxt or (cur, nxt[0]) in seen:
                    break
                seen.add((cur, nxt[0]))
                prev, cur = cur, nxt[0]
                path.append(cur)
            if len(path) >= min_len_px:
                out.append(np.array(path, float))
    return out


def grid_lines(t, per, phase, axis, search=7, frac=0.3, thick=3):
    """Mask of the grid's thin lines along one axis (axis 0: horizontal lines at y = phase + k·per;
    axis 1: vertical). Each line is located afresh in windows two squares long, so the scan's
    waviness doesn't matter, and only its own rows (≤ `thick` px) are masked."""
    import numpy as np
    a = t if axis == 0 else t.T                          # lines run along a's rows
    H, W = a.shape
    out = np.zeros_like(a)
    win = int(round(2 * per))
    for k in range(int((H - phase) / per) + 2):
        c = int(round(phase + k * per))
        r0, r1 = max(0, c - search), min(H, c + search + 1)
        if r1 - r0 < 3:
            continue
        for x0 in range(0, W, win // 2):
            x1 = min(W, x0 + win)
            prof = a[r0:r1, x0:x1].sum(axis=1) / (x1 - x0)
            m = int(np.argmax(prof))
            if prof[m] < frac:
                continue
            lo = hi = m
            while hi - lo + 1 < thick:                   # grow to the stronger neighbour
                up = prof[lo - 1] if lo > 0 else -1
                dn = prof[hi + 1] if hi < len(prof) - 1 else -1
                if max(up, dn) < 0.5 * prof[m]:
                    break
                if up >= dn:
                    lo -= 1
                else:
                    hi += 1
            out[r0 + lo:r0 + hi + 1, x0:x1] = True
    out &= a
    return out if axis == 0 else out.T


def crossed(line, rest, axis, thick=3):
    """The pixels of a line mask (axis as grid_lines) with `rest` ink just beside them, spread across
    the line's thickness: where a figure's stroke crosses or touches the line."""
    import numpy as np
    a, r = (line, rest) if axis == 0 else (line.T, rest.T)
    side = np.zeros_like(a)
    for d in (1, 2):
        side[d:] |= r[:-d]
        side[:-d] |= r[d:]
    keep = np.zeros_like(a)
    for _ in range(thick):
        nk = a & (side | np.roll(keep, 1, 0) | np.roll(keep, -1, 0))
        if (nk == keep).all():
            break
        keep = nk
    return keep if axis == 0 else keep.T


SOLID_MIN = 14        # px: a solid mark (arrowhead) at least this long; a figure's thick parts are less
SOLID_GROW = 4        # px taken round it, its point included


def text_ink(ink, px, phx, py, phy):
    """The page's printed text and figures alone: ink minus the long wide strokes (field and pattern
    lines), solid marks (arrowheads), the grid's thin lines and straight runs over 0.7 square, and
    specks. → (text mask, damage mask: where an arrowhead was taken, which a figure touching it
    may have lost a stroke to)."""
    import numpy as np
    from scipy import ndimage as ndi
    from skimage.morphology import binary_opening, disk
    big = binary_opening(ink, disk(2))
    lab, n = ndi.label(big, np.ones((3, 3)))
    keep = np.zeros(n + 1, bool)
    for i, sl in enumerate(ndi.find_objects(lab), 1):
        keep[i] = max(sl[0].stop - sl[0].start, sl[1].stop - sl[1].start) >= 1.5 * px
    t = ink & ~ndi.binary_dilation(keep[lab], iterations=1)
    solid = binary_opening(t, disk(3))                   # thicker than any figure's stroke
    lab, n = ndi.label(solid)
    big = np.zeros(n + 1, bool)
    for i, sl in enumerate(ndi.find_objects(lab), 1):
        big[i] = max(sl[0].stop - sl[0].start, sl[1].stop - sl[1].start) >= SOLID_MIN
    solid = big[lab]
    damage = ndi.binary_dilation(solid, disk(SOLID_GROW)) if solid.any() else solid
    t &= ~damage
    h, v = grid_lines(t, py, phy, 0), grid_lines(t, px, phx, 1)
    rest = t & ~h & ~v                                   # both first: at a crossing neither line
    t &= ~(h & ~crossed(h, rest, 0)) & ~(v & ~crossed(v, rest, 1))   # may keep the other
    L = int(0.7 * px)
    t &= ~(ndi.binary_opening(t, np.ones((1, L))) | ndi.binary_opening(t, np.ones((L, 1))))
    lab, n = ndi.label(t, np.ones((3, 3)))
    speck = np.zeros(n + 1, bool)

    def on_grid(c, per, phase):
        return abs((c - phase + per / 2) % per - per / 2) <= 5

    for i, sl in enumerate(ndi.find_objects(lab), 1):
        hh, ww = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        cy, cx = (sl[0].start + sl[0].stop) / 2, (sl[1].start + sl[1].stop) / 2
        speck[i] = hh * ww <= 6 or (hh <= 4 and ww <= 4 and on_grid(cx, px, phx) and on_grid(cy, py, phy))
    return t & ~speck[lab], damage                       # (the knot left where two grid lines cross)


def glyphs(t, px, damage=None, min_h=0.25, vgap=4, overlap=0.5, box_ov=0.3):
    """Components of the text ink → glyphs, top to bottom in bands, then left to right. Pieces
    stacked one over another (x ranges overlapping by ≥ `overlap` of the narrower, ≤ `vgap` px
    apart) or whose boxes overlap (≥ `box_ov` of the smaller) are one glyph: a fraction's 1, bar
    and 2; a figure broken in the print. Glyphs under `min_h` squares both ways are dropped.
    → [{'box': (x0, y0, x1, y1) px, 'mask', 'core': the mask without the pieces lying wholly above
    or below its largest (a grid remnant, or a figure's own detached bar) or None, 'damaged':
    touches `damage`}]."""
    import numpy as np
    from scipy import ndimage as ndi
    lab, n = ndi.label(t, np.ones((3, 3)))
    sls = ndi.find_objects(lab)
    box = [(sl[1].start, sl[0].start, sl[1].stop, sl[0].stop) for sl in sls]
    par = list(range(n))

    def find(i):
        while par[i] != i:
            par[i] = par[par[i]]
            i = par[i]
        return i

    order = sorted(range(n), key=lambda i: box[i][0])
    for a, i in enumerate(order):
        xi0, yi0, xi1, yi1 = box[i]
        for j in order[a + 1:]:
            xj0, yj0, xj1, yj1 = box[j]
            if xj0 >= xi1:
                break
            ov = min(xi1, xj1) - max(xi0, xj0)
            gap = max(yj0 - yi1, yi0 - yj1, 0)
            vo = min(yi1, yj1) - max(yi0, yj0)
            small = min((xi1 - xi0) * (yi1 - yi0), (xj1 - xj0) * (yj1 - yj0))
            if (ov >= overlap * min(xi1 - xi0, xj1 - xj0) and gap <= vgap) or (vo > 0 and ov * vo >= box_ov * small):
                par[find(i)] = find(j)
    groups = {}
    for i in range(n):
        groups.setdefault(find(i), []).append(i)
    near = ndi.binary_dilation(damage, iterations=1) if damage is not None and damage.any() else None
    out = []
    for g in groups.values():
        x0 = min(box[i][0] for i in g); y0 = min(box[i][1] for i in g)
        x1 = max(box[i][2] for i in g); y1 = max(box[i][3] for i in g)
        if y1 - y0 < min_h * px and x1 - x0 < min_h * px:
            continue
        sub = lab[y0:y1, x0:x1]
        m = np.isin(sub, [i + 1 for i in g])
        big = max(g, key=lambda i: (lab[sls[i]] == i + 1).sum())
        stacked = [i for i in g if box[i][1] >= box[big][3] or box[i][3] <= box[big][1]]
        core = None
        if stacked:
            core = np.isin(sub, [i + 1 for i in g if i not in stacked])
            ys, xs = np.nonzero(core)
            core = core[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        dmg = near is not None and bool((near[y0:y1, x0:x1] & m).any())
        out.append({'box': (int(x0), int(y0), int(x1), int(y1)), 'mask': m, 'core': core, 'damaged': dmg})
    out.sort(key=lambda r: (r['box'][1] // 20, r['box'][0]))
    return out
