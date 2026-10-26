"""ЕМКО СЭВ т.3 §7: men's trousers, semi-fitted, size 176-100-88.
Base construction (БК) of front and back, Fig. 34 / Table 7.2 (pp.112, 114).

Coordinates: cm, x → (back crotch on the left, front on the right),
y ↑ from the floor point 940; x = 0 on the side line through 54/54'/940.
INTERP marks readings of "К" rows from Fig. 34.
usage: python emko_trousers.py <out_prefix>
"""
import math
import sys
import numpy as np

import yaml
# usage: python emko_trousers.py <out_prefix> [table74.yaml] [height-chest-waist]
FIG = sys.argv[3] if len(sys.argv) > 3 else '176-100-88'
if len(sys.argv) > 2:
    _t = yaml.safe_load(open(sys.argv[2], encoding='utf-8'))
    _col = [ '-'.join(map(str, f)) for f in _t['figures']].index(FIG)
    V = {int(k): float(v[_col]) for k, v in _t['rows'].items()}
else:
    V = {1: 16.05, 2: 54.7, 3: 29.0, 4: 25.7, 5: 108.35, 6: 108.9, 7: 101.7, 8: 82.2, 9: 49.9,
         10: 4.05, 11: 13.9, 12: 7.15, 13: 21.45, 14: 16.45, 15: 13.35, 16: 13.35, 17: 10.85,
         18: 10.85, 19: 12.5, 20: 12.5, 21: 9.95, 22: 9.95, 23: 47.1, 24: 13.6, 31: 1.5}
SEAT_RISE_511 = 6.0   # INTERP: height of 511 above the hip line, read off Fig. 34

P = {}
def pt(x, y): return np.array([float(x), float(y)])
def unit(v): return v / np.linalg.norm(v)
def dist(a, b): return float(np.linalg.norm(P[a] - P[b]))
def circ_x(c1, r1, c2, r2, pick):
    d = np.linalg.norm(c2 - c1); a = (r1**2 - r2**2 + d**2) / (2 * d); h = math.sqrt(max(r1**2 - a**2, 0))
    m = c1 + a * (c2 - c1) / d; n = np.array([-(c2 - c1)[1], (c2 - c1)[0]]) / d
    return pick([m + h * n, m - h * n])
def line_x(p1, d1, p2, d2):
    t = np.linalg.solve(np.array([d1, -d2]).T, p2 - p1); return p1 + t[0] * d1
def at_y(a, b, y):            # point on line a→b at height y
    return a + (y - a[1]) / (b[1] - a[1]) * (b - a)

y_w = V[5]                    # waist level (44', row 5)
y_h = y_w - V[1]              # hip line (41–51 = 16.05, row 1)
y_c, y_k, y_9 = V[8], V[9], V[10]   # crotch (row 8), knee (row 9), hem (row 10)

# ---- hip line (rows 2–4, 11–14) ----
P['54'] = pt(0, y_h); P["54'"] = P['54']
P['51'] = pt(-V[3], y_h); P['57'] = pt(V[4], y_h)
P['58'] = P['51'] + pt(-V[11], 0); P["58'"] = P['57'] + pt(V[12], 0)
P['52'] = P['58'] + pt(V[13], 0); P['56'] = P["54'"] + pt(V[14], 0)
# ---- side verticals (rows 5–7) ----
P['940'] = pt(0, 0); P["44'"] = pt(0, V[5]); P["441'"] = pt(0, V[6]); P['440'] = pt(0, V[7])
# ---- knee and hem (rows 15–22) ----
P['72'] = pt(P['52'][0], y_k); P['76'] = pt(P['56'][0], y_k)
P['92'] = pt(P['52'][0], y_9); P['96'] = pt(P['56'][0], y_9)
P['78'] = P['72'] + pt(-V[15], 0); P['741'] = P['72'] + pt(V[16], 0)
P["741'"] = P['76'] + pt(-V[17], 0); P["78'"] = P['76'] + pt(V[18], 0)
P['98'] = P['92'] + pt(-V[19], 0); P['941'] = P['92'] + pt(V[20], 0)
P["941'"] = P['96'] + pt(-V[21], 0); P["98'"] = P['96'] + pt(V[22], 0)
# ---- side seam above the hip: continuation of 741→54 (rows 25–26) ----
sd = unit(P['54'] - P['741'])
P['44'] = P['54'] + dist('54', "44'") * sd                         # |54–44| = |54–44'|
P['441'] = P['54'] + dist("54'", "441'") * sd                      # R 54–441 = |54'–441'|
# ---- back seat seam (rows 27–30) ----
r = dist('54', '51')
dx511 = math.sqrt(r**2 - SEAT_RISE_511**2)
P['511'] = P['54'] + pt(-dx511, SEAT_RISE_511)                     # R 54–511 = |54–51|, INTERP rise
P['411'] = circ_x(P['44'], r, P['511'], V[1], lambda c: max(c, key=lambda q: q[1]))   # rows 28, 28.1
P['512'] = P['51'] + 0.5 * (P['511'] - P['51'])                    # row 30
P['42'] = P['411'] + dist('51', '52') * unit(P['441'] - P['411'])  # row 29
# ---- crotch level (rows 31–34.2) ----
P['68'] = at_y(P['78'], P['58'], y_c)                              # INTERP: inseam 78→58 meets crotch line
P['681'] = P['68'] + pt(V[31], 0)                                  # row 31 (a31 = 1.5, Table 7.4)
P['581'] = line_x(P['68'], unit(P['58'] - P['68']), P['54'], unit(P['512'] - P['54']))   # INTERP
R_b = dist('68', '581')
P['582'] = circ_x(P['681'], R_b, P['512'], R_b, lambda c: min(c, key=lambda q: q[0]))   # rows 32–32.1
P["68'"] = at_y(P["78'"], P["58'"], y_c)                           # INTERP (row 33 К)
P["581'"] = P["58'"]                                               # Fig. 34: 58' ≡ 581'
R_f = dist("68'", "581'")
P["582'"] = circ_x(P["68'"], R_f, P['57'], R_f, lambda c: max(c, key=lambda q: q[0]))   # rows 34–34.1
P['47'] = pt(P['57'][0], y_w)                                      # front centre at waist (Fig. 34)

def arc(c, a, b, n=40):
    a0 = math.atan2(*(a - c)[::-1]); b0 = math.atan2(*(b - c)[::-1]); rr = np.linalg.norm(a - c)
    d = (b0 - a0 + math.pi) % (2 * math.pi) - math.pi
    return np.array([c + rr * np.array([math.cos(a0 + d * t), math.sin(a0 + d * t)]) for t in np.linspace(0, 1, n)])
back_crotch = arc(P['582'], P['681'], P['512'])                    # row 32.2
front_crotch = arc(P["582'"], P['57'], P["68'"])                   # row 34.2

back = np.vstack([[P['411'], P['441'], P['54'], P['741'], P['941'], P['98'], P['78'], P['681']],
                  back_crotch, [P['511'], P['411']]])
front = np.vstack([[P['44'], P['47'], P['57']], front_crotch,
                   [P["78'"], P["98'"], P["941'"], P["741'"], P["54'"], P['44']]])

def plen(a): return float(np.sum(np.linalg.norm(np.diff(a, axis=0), axis=1)))
checks = {
    'hip width 51→57 (row 2: 54.7)': dist('51', '57'),
    'waist: |411–441| + |44–47| (row 23 garment waist 47.1 before darts)': dist('411', '441') + dist('44', '47'),
    'back crotch arc radius |68–581|': R_b,
    'front crotch arc radius |68\'–58\'|': R_f,
    'back side seam 441→54→741→941': dist('441', '54') + dist('54', '741') + dist('741', '941'),
    'front side seam 44→54\'→741\'→941\'': dist('44', "54'") + dist("54'", "741'") + dist("741'", "941'"),
    'back inseam 681→78→98': dist('681', '78') + dist('78', '98'),
    'front inseam 68\'→78\'→98\'': dist("68'", "78'") + dist("78'", "98'"),
    'outseam length waist→hem (front)': dist('44', "54'") + dist("54'", "741'") + dist("741'", "941'"),
}
print(f'== figure {FIG}')
for k, v in checks.items():
    print(f'{k:70} {v:7.2f}')
import json
json.dump({'figure': FIG, 'back': back.round(3).tolist(), 'front': front.round(3).tolist()}, open(sys.argv[1] + '_pieces.json', 'w'))

def to_svg(polys, labels, path):
    allp = np.vstack(polys); mn = allp.min(0) - 3; mx = allp.max(0) + 3; W, H = mx - mn
    tr = lambda p: (p[0] - mn[0], mx[1] - p[1])
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W:.1f}cm" height="{H:.1f}cm" viewBox="0 0 {W:.2f} {H:.2f}">',
           '<rect width="100%" height="100%" fill="white"/>']
    for poly, col in polys_cols:
        out.append(f'<polygon points="{" ".join("%.2f,%.2f" % tr(p) for p in poly)}" fill="none" stroke="{col}" stroke-width="0.15"/>')
    for y in (y_w, y_h, y_c, y_k):
        a, b = tr(pt(mn[0], y)), tr(pt(mx[0], y))
        out.append(f'<line x1="{a[0]:.2f}" y1="{a[1]:.2f}" x2="{b[0]:.2f}" y2="{b[1]:.2f}" stroke="#ccc" stroke-width="0.05" stroke-dasharray="0.5 0.5"/>')
    out.append('<g font-size="0.9" fill="#c00">')
    for k, p in labels.items():
        x, y = tr(p); out.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="0.2"/><text x="{x + 0.3:.2f}" y="{y - 0.3:.2f}">{k}</text>')
    out.append('</g></svg>'); open(path, 'w', encoding='utf-8').write('\n'.join(out))
polys_cols = [(back, '#000'), (front, '#04a')]
to_svg([back, front], P, sys.argv[1] + '_bk.svg')
