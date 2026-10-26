"""Nest graded pieces (pieces.json per figure) into one SVG, aligned at the hip/side point (0, y_hip of base)."""
import glob, json, sys
files = sorted(glob.glob(sys.argv[1]))
FLIP = len(sys.argv) < 4 or sys.argv[3] != 'ydown'
cols = ['#1b9e77', '#d95f02', '#000000', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d']
polys = []
for i, f in enumerate(files):
    d = json.load(open(f))
    for k in [k for k in d if k != 'figure']:
        polys.append((d['figure'], k, d[k], cols[i % len(cols)]))
xs = [p[0] for _, _, poly, _ in polys for p in poly]; ys = [p[1] for _, _, poly, _ in polys for p in poly]
mnx, mxx, mny, mxy = min(xs) - 2, max(xs) + 2, min(ys) - 2, max(ys) + 2
W, H = mxx - mnx, mxy - mny
out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W:.1f}cm" height="{H:.1f}cm" viewBox="0 0 {W:.2f} {H:.2f}">',
       '<rect width="100%" height="100%" fill="white"/>']
for fig, k, poly, c in polys:
    yy = (lambda y: mxy - y) if FLIP else (lambda y: y - mny)
    out.append(f'<polygon points="{" ".join(f"{x - mnx:.2f},{yy(y):.2f}" for x, y in poly)}" fill="none" stroke="{c}" stroke-width="0.12"/>')
for i, f in enumerate(files):
    out.append(f'<text x="1" y="{3 + 2.2 * i:.1f}" font-size="1.8" fill="{cols[i % len(cols)]}">{json.load(open(f))["figure"]}</text>')
out.append('</svg>')
open(sys.argv[2], 'w').write('\n'.join(out))
