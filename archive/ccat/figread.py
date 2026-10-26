"""Read printed figures (inches: 3, 12, 1½, 36; "47 x 34") from a page's glyphs (ccat.grid.glyphs).
Runs in the tools image (numpy, scipy, scikit-image, opencv).

Walker's figures are engraved italic numerals, one hand throughout the book, too small and
irregular for tesseract. They are classified against the book's own glyphs: prototypes cut from
labelled pages of the same book (data/walker/glyphs/, scripts/walker_glyphs.py), every glyph on
those pages that isn't a figure being a junk prototype (letters, arrow bits, grid remnants).

A glyph reads as a figure glyph (0–9, ½ ¼ ¾, x) only when all of these hold, else it is unsure:
  * the nearest prototype (HOG of the height-normalised glyph, plus its aspect and size) and an
    RBF SVM over the same prototypes give the same class;
  * the nearest prototype is within MAX_DIST, and the nearest of any other figure class is at
    least MARGIN further;
  * it didn't touch an arrowhead taken off the page (which may have cost it a stroke: a 7 without
    its bar is a 1);
  * read again without the pieces stacked wholly above or below it (a grid remnant over a 6
    makes an 8), it reads the same or nothing; if only that reading is a figure glyph, it is
    the one taken.
Glyphs on a line chain into words (gap ≤ WORD_GAP × height). In a word with a figure glyph, a
glyph nearest 0 or 1 among the figure classes (within MAX_DIST, by MARGIN) and of the same height
is read as that: alone, an O or an I, or a stray stroke, is as near. A word of figure glyphs is a
figure; a word mixing figure glyphs with unsure ones, or with fewer junk glyphs than figure
glyphs, or with a mark too big for a glyph right beside it (a 6 run through by a grid line), is
reported unread; a word mostly of junk is text and left alone. "a x b" (cloth, length
× breadth) is one figure. A lone 1 or 0 is reported, not read: alone it can't be told from a
stroke or a letter O. Nothing is guessed: what isn't read is either reported or not a figure.
"""
import numpy as np

H, W = 24, 32                    # normalised glyph canvas, px
MAX_DIST = 0.9
MARGIN = 0.08
WORD_GAP = 0.45
DIM_GAP = 1.2                    # × height: the gap either side of the x in "47 x 34"
CLASSES = '0123456789½¼¾x'
FRAC = {'½': 0.5, '¼': 0.25, '¾': 0.75}
SVM_C, SVM_GAMMA = 10, 1.0
BOX = 48                         # stored prototype masks, px (a plausible glyph fits)


def plausible(g, px):
    """Figure-sized: 0.28–1 square tall, ≤ 1.2 squares wide, ≥ 3 px both ways."""
    x0, y0, x1, y1 = g['box']
    return 0.28 <= (y1 - y0) / px <= 1.0 and (x1 - x0) / px <= 1.2 and min(x1 - x0, y1 - y0) >= 3


def norm(m):
    """Scale a glyph mask to height H (width in proportion, at most W), centred in an H×W canvas."""
    from scipy import ndimage as ndi
    m = m.astype(float)
    h, w = m.shape
    s = (H - 2) / h
    if w * s > W - 2:
        s = (W - 2) / w
    z = np.clip(ndi.zoom(m, s, order=1), 0, 1)
    out = np.zeros((H, W))
    y0, x0 = (H - z.shape[0]) // 2, (W - z.shape[1]) // 2
    out[y0:y0 + z.shape[0], x0:x0 + z.shape[1]] = z[:H, :W]
    return out


def features(m, px):
    from scipy import ndimage as ndi
    from skimage.feature import hog
    f = hog(ndi.gaussian_filter(norm(m), 1.0), 9, (4, 4), (2, 2))
    f = f / (np.linalg.norm(f) + 1e-9)
    h, w = m.shape
    return np.concatenate([f, [0.5 * np.log(w / h), np.log(h / px)]])


def variants(m):
    """A prototype as printed, thickened, thinned and turned ±4°: the engraver's hand varies."""
    from scipy import ndimage as ndi
    yield m
    yield ndi.binary_dilation(m)
    e = ndi.binary_erosion(m)
    if e.sum() > 0.4 * m.sum():
        yield e
    for a in (-4, 4):
        r = ndi.rotate(m.astype(float), a, reshape=True, order=1) > 0.5
        ys, xs = np.nonzero(r)
        if len(ys):
            yield r[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def dists(F, P):
    a = (F ** 2).sum(1)[:, None] + (P ** 2).sum(1)[None, :] - 2 * F @ P.T
    return np.sqrt(np.clip(a, 0, None))


def save_prototypes(path, masks, labels, pxs, sources):
    """masks: bool arrays ≤ BOX × BOX; labels: a CLASSES character or '.' (junk); pxs: the page's
    px per square; sources: 'page:x:y' for each."""
    bits = np.zeros((len(masks), BOX, BOX), bool)
    shape = np.zeros((len(masks), 2), np.int16)
    for k, m in enumerate(masks):
        bits[k, :m.shape[0], :m.shape[1]] = m
        shape[k] = m.shape
    np.savez_compressed(path, bits=np.packbits(bits, axis=2), shape=shape, labels=np.array(labels),
                        px=np.array(pxs, np.float32), sources=np.array(sources))


def load_prototypes(path):
    z = np.load(path)
    bits = np.unpackbits(z['bits'], axis=2)[:, :, :BOX].astype(bool)
    masks = [bits[k, :h, :w] for k, (h, w) in enumerate(z['shape'])]
    return masks, [str(s) for s in z['labels']], [float(p) for p in z['px']]


class Model:
    """Nearest prototype + SVM over the augmented prototypes."""

    def __init__(self, masks, labels, pxs):
        import cv2
        F, Y = [], []
        for m, c, px in zip(masks, labels, pxs):
            for v in variants(m):
                F.append(features(v, px))
                Y.append(c)
        self.F, self.Y = np.array(F), np.array(Y)
        self.classes = sorted(set(Y))
        idx = {c: k for k, c in enumerate(self.classes)}
        self.svm = cv2.ml.SVM_create()
        self.svm.setType(cv2.ml.SVM_C_SVC)
        self.svm.setKernel(cv2.ml.SVM_RBF)
        self.svm.setC(SVM_C)
        self.svm.setGamma(SVM_GAMMA)
        self.svm.train(self.F.astype(np.float32), cv2.ml.ROW_SAMPLE, np.array([idx[c] for c in Y], np.int32))

    @classmethod
    def load(cls, path):
        return cls(*load_prototypes(path))

    def _one(self, m, px):
        """→ (class, status, nearest figure class, its distance, its margin to the next figure class)."""
        f = features(m, px)
        d = dists(f[None], self.F)[0]
        o = int(np.argmin(d))
        c, d1 = str(self.Y[o]), float(d[o])
        fig = self.Y != '.'
        k = np.nonzero(fig)[0][int(np.argmin(d[fig]))]
        fc, fd = str(self.Y[k]), float(d[k])
        other = fig & (self.Y != fc)
        fm = float(d[other].min()) - fd if other.any() else np.inf
        _, p = self.svm.predict(f[None].astype(np.float32))
        s = self.classes[int(p[0, 0])]
        if c == '.' and s == '.':
            st = 'junk'
        elif c == s and fm >= MARGIN and d1 <= MAX_DIST:
            st = 'fig'
        else:
            st = 'unsure'
        return (c if c != '.' else s), st, fc, fd, fm

    def classify(self, g, px):
        """→ {'c': class, 'st': 'fig' | 'unsure' | 'junk', 'fc', 'fd', 'fm': nearest figure class,
        its distance and margin}."""
        c, st, fc, fd, fm = self._one(g['mask'], px)
        if g['core'] is not None and min(g['core'].shape) >= 3:
            c2, st2, *f2 = self._one(g['core'], px)
            if st == 'fig' and st2 == 'fig' and c2 != c:
                st = 'unsure'
            elif st != 'fig' and st2 == 'fig':
                c, st, (fc, fd, fm) = c2, st2, f2
        if g['damaged'] and st != 'junk':
            st = 'unsure'
        return {'c': c, 'st': st, 'fc': fc, 'fd': fd, 'fm': fm}


def _chain(boxes, gap):
    """Boxes on one line, gap ≤ `gap` × the taller's height → groups of indices, left to right."""
    n = len(boxes)
    par = list(range(n))

    def find(i):
        while par[i] != i:
            i = par[i]
        return i

    for a in range(n):
        xa0, ya0, xa1, ya1 = boxes[a]
        for b in range(n):
            xb0, yb0, xb1, yb1 = boxes[b]
            if b == a or xb0 < xa0:
                continue
            ov = min(ya1, yb1) - max(ya0, yb0)
            if ov >= 0.5 * min(ya1 - ya0, yb1 - yb0) and xb0 - xa1 <= gap * max(ya1 - ya0, yb1 - yb0):
                par[find(b)] = find(a)
    g = {}
    for i in range(n):
        g.setdefault(find(i), []).append(i)
    return [sorted(v, key=lambda i: boxes[i][0]) for v in g.values()]


def value(s):
    """'12' → 12, '1½' → 1.5, '½' → 0.5; None if not a number (a fraction only last)."""
    if not s or any(c not in '0123456789½¼¾' for c in s) or any(c in FRAC for c in s[:-1]):
        return None
    v = float(s[:-1] or 0) + FRAC[s[-1]] if s[-1] in FRAC else float(s)
    return int(v) if v == int(v) else v


def _beside(a, b, gap):
    """Box b on a's line (overlapping ≥ half the shorter, or b spanning a) within gap × a's height."""
    ax0, ay0, ax1, ay1 = a
    bx0, by0, bx1, by1 = b
    if min(ay1, by1) - max(ay0, by0) < 0.5 * min(ay1 - ay0, by1 - by0):
        return False
    return max(bx0 - ax1, ax0 - bx1) <= gap * (ay1 - ay0)


def _union(bs):
    return (min(b[0] for b in bs), min(b[1] for b in bs), max(b[2] for b in bs), max(b[3] for b in bs))


def read(gl, px, model):
    """Glyphs of one page (ccat.grid.glyphs) → (figures [{'text', 'value', 'box'}], unread [{'text',
    'box', 'why'}]); box in page px. A figure's value is a number, or [length, breadth] for "a x b";
    an unread's text is what its glyphs looked most like, '?' for junk."""
    big = [g['box'] for g in gl if (g['box'][3] - g['box'][1]) / px > 1.0 or (g['box'][2] - g['box'][0]) / px > 1.2]
    gl = [g for g in gl if plausible(g, px)]
    cl = [model.classify(g, px) for g in gl]
    figs, unread = [], []
    for w in _chain([g['box'] for g in gl], WORD_GAP):
        if not any(cl[i]['st'] == 'fig' for i in w):
            continue
        hs = [gl[i]['box'][3] - gl[i]['box'][1] for i in w if cl[i]['st'] == 'fig']
        for i in w:                                      # 0 and 1 beside a figure glyph: a letter O or
            k = cl[i]                                    # I, a stroke, isn't part of a number
            h = gl[i]['box'][3] - gl[i]['box'][1]
            if (k['st'] != 'fig' and k['fc'] in '01' and k['fd'] <= MAX_DIST and k['fm'] >= MARGIN
                    and not gl[i]['damaged'] and any(abs(h - x) <= 0.2 * x for x in hs)):
                cl[i] = dict(k, c=k['fc'], st='fig')
        st = [cl[i]['st'] for i in w]
        nf, nj = st.count('fig'), st.count('junk')
        text = ''.join(cl[i]['c'] if cl[i]['st'] != 'junk' else '?' for i in w)
        box = _union([gl[i]['box'] for i in w])
        if nj >= nf:
            continue                                     # a word of text
        if nj or 'unsure' in st:
            unread.append({'text': text, 'box': box, 'why': 'figure glyphs beside unreadable ones'})
            continue
        if any(_beside(box, b, WORD_GAP) for b in big):
            unread.append({'text': text, 'box': box, 'why': 'beside a mark too big for a glyph (a figure on a line?)'})
            continue
        figs.append({'text': text, 'box': box})
    out, used = [], set()
    for k, f in enumerate(figs):                         # "47 x 34", "47x 34", "47 x34": an x between
        if f['text'].count('x') != 1:                    # two numbers, the missing ones beside it
            continue
        left, right = f['text'].split('x')
        x0, y0, x1, y1 = f['box']

        def beside(g, on_left):
            gx0, gy0, gx1, gy1 = g['box']
            if 'x' in g['text'] or min(y1, gy1) - max(y0, gy0) < 0.3 * min(y1 - y0, gy1 - gy0):
                return False
            return 0 <= (x0 - gx1 if on_left else gx0 - x1) <= DIM_GAP * (gy1 - gy0)

        a = [j for j, g in enumerate(figs) if beside(g, True)] if not left else []
        b = [j for j, g in enumerate(figs) if beside(g, False)] if not right else []
        if (not left and len(a) != 1) or (not right and len(b) != 1):
            continue
        parts = [figs[a[0]]['text'] if a else left, figs[b[0]]['text'] if b else right]
        used |= {k, *a, *b}
        box = _union([f['box']] + [figs[j]['box'] for j in a + b])
        if all(value(p) is not None for p in parts):
            out.append({'text': parts[0] + ' x ' + parts[1], 'box': box})
        else:
            unread.append({'text': ' x '.join(parts), 'box': box, 'why': 'not a number either side of x'})
    for k, f in enumerate(figs):
        if k in used:
            continue
        t = f['text']
        if t == 'x':
            continue                                     # a lone x: not a figure
        if 'x' in t:
            unread.append({'text': t, 'box': f['box'], 'why': 'an x without a number either side'})
        elif value(t) is None:
            unread.append({'text': t, 'box': f['box'], 'why': 'not a number'})
        elif t in ('1', '0'):
            unread.append({'text': t, 'box': f['box'], 'why': 'a lone 1 or 0: a stroke or a letter O alike'})
        else:
            out.append(f)

    def beside_unread(f):                                # "34" of an unreadable "47 x 34": not alone
        x0, y0, x1, y1 = f['box']
        for u in unread:
            ux0, uy0, ux1, uy1 = u['box']
            h = max(y1 - y0, uy1 - uy0)
            if min(y1, uy1) - max(y0, uy0) >= 0.3 * min(y1 - y0, uy1 - uy0) and \
                    max(ux0 - x1, x0 - ux1) <= DIM_GAP * h:
                return True
        return False

    near = [f for f in out if beside_unread(f)]
    unread += [{'text': f['text'], 'box': f['box'], 'why': 'beside an unreadable figure'} for f in near]
    out = [f for f in out if f not in near]
    for f in out:
        vs = [value(p) for p in f['text'].split(' x ')]
        f['value'] = vs[0] if len(vs) == 1 else vs
    out.sort(key=lambda f: (f['box'][1], f['box'][0]))
    return out, unread
