"""Probe a gridded pattern page: skew angle, grid period/phase, stroke widths.
usage: python grid_probe.py <page.png> <out_prefix>"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage.filters import threshold_otsu

src, prefix = sys.argv[1], sys.argv[2]
g = np.asarray(Image.open(src).convert('L'), dtype=np.float32)
dark = g < threshold_otsu(g)
print('size', g.shape, 'otsu', threshold_otsu(g))

def sharpness(img, axis):
    p = img.sum(axis=axis)
    return float(np.var(np.diff(p)))

best = max(np.arange(-1.5, 1.51, 0.05),
           key=lambda a: sharpness(ndi.rotate(dark.astype(np.uint8), a, reshape=False, order=0), 1))
print(f'skew angle {best:.2f} deg')
d = ndi.rotate(dark.astype(np.uint8), best, reshape=False, order=0).astype(bool)
gr = ndi.rotate(g, best, reshape=False, order=1, cval=255)

for axis, name in ((0, 'cols(x)'), (1, 'rows(y)')):
    p = d.sum(axis=axis).astype(float)
    p -= ndi.uniform_filter1d(p, 101)                 # remove slow background
    ac = np.correlate(p, p, 'full')[len(p) - 1:]
    lag = np.argmax(ac[30:200]) + 30                  # period between 30 and 200 px
    # refine with sub-pixel parabola
    y0, y1, y2 = ac[lag - 1], ac[lag], ac[lag + 1]
    period = lag + 0.5 * (y0 - y2) / (y0 - 2 * y1 + y2)
    peaks = np.where((p > np.percentile(p, 97)))[0]
    phase = np.median(np.mod(peaks, period))
    print(f'{name}: period {period:.2f} px, phase {phase:.1f}')

# stroke width distribution: distance transform on dark pixels -> 2*max per component
dist = ndi.distance_transform_edt(d)
w = 2 * dist[d]
hist, edges = np.histogram(w, bins=np.arange(0, 30, 1))
print('stroke half-width histogram (px: count):', {int(e): int(c) for e, c in zip(edges, hist) if c > 500})
tones = gr[d]
print('dark tone percentiles 5/25/50/75/95:', np.percentile(tones, [5, 25, 50, 75, 95]).round(0))
Image.fromarray(gr.clip(0, 255).astype(np.uint8)).save(prefix + '_deskew.png')
