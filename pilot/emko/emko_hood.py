"""ЕМКО СЭВ т.3 §4: hood for the summer jacket, Table 4.2 "Капюшон БК" rows (pp.66, 68), Fig. 19.
Local frame: cm, x → toward the face (front), y ↑. Point 16 = neck/shoulder point at origin.
usage: python emko_hood.py <out_prefix> <jacket_neck.json>
"""
import json
import math
import sys
import numpy as np

H = {'16_161': 9.5, '161_17': 8.9, 'beta4': 10.0, '16_06': 35.1, '07_01': 25.6, '01_061': 12.8,
     '16_111': 10.4, '01_111': 35.1, 'dart': 3.0}
neck = json.load(open(sys.argv[2]))


def pt(x, y): return np.array([float(x), float(y)])
def unit(v): return v / np.linalg.norm(v)
def rot(p, c, deg):
    t = math.radians(deg); d = p - c
    return c + np.array([d[0] * math.cos(t) - d[1] * math.sin(t), d[0] * math.sin(t) + d[1] * math.cos(t)])
def circ_x(c1, r1, c2, r2, pick):
    d = np.linalg.norm(c2 - c1); a = (r1**2 - r2**2 + d**2) / (2 * d); h = math.sqrt(max(r1**2 - a**2, 0))
    m = c1 + a * (c2 - c1) / d; n = np.array([-(c2 - c1)[1], (c2 - c1)[0]]) / d
    return pick([m + h * n, m - h * n])
def line_x(p1, d1, p2, d2):
    t = np.linalg.solve(np.array([d1, -d2]).T, p2 - p1); return p1 + t[0] * d1
def arc(c, a, b, n=40):
    a0 = math.atan2(*(a - c)[::-1]); b0 = math.atan2(*(b - c)[::-1]); r = np.linalg.norm(a - c)
    d = (b0 - a0 + math.pi) % (2 * math.pi) - math.pi
    return np.array([c + r * np.array([math.cos(a0 + d * t), math.sin(a0 + d * t)]) for t in np.linspace(0, 1, n)])
def plen(a): return float(np.sum(np.linalg.norm(np.diff(a, axis=0), axis=1)))


P = {'16': pt(0, 0)}
P['161'] = P['16'] + pt(0, -H['16_161'])                                    # row 1
P['17'] = P['161'] + pt(H['161_17'], 0)                                     # row 2
r_n = np.linalg.norm(P['17'] - P['16'])
P['172'] = circ_x(P['16'], r_n, P['17'], r_n, lambda c: max(c, key=lambda q: q[0] + q[1]))   # rows 3–3.1
up = rot(pt(0, 1), pt(0, 0), -H['beta4'])                                   # row 4: 10° toward the face
P['06'] = P['16'] + H['16_06'] * up                                         # row 5
P['07'] = line_x(P['17'], up, P['06'], np.array([up[1], -up[0]]))           # row 6
P['01'] = P['07'] + H['07_01'] * unit(P['06'] - P['07'])                    # row 7
P['061'] = P['01'] + H['01_061'] * unit(P['07'] - P['01'])                  # row 8
P['011'] = P['01'] - H['01_061'] * up                                       # row 9
r0 = H['01_061']
P['O'] = P['01'] + r0 * unit(P['07'] - P['01']) - r0 * up                  # rows 10–10.1 (square corner ⇒ centre)
P['111'] = circ_x(P['01'], H['01_111'], P['16'], H['16_111'],              # rows 11–11.1
                  lambda c: min(c, key=lambda q: q[1]))
# row 12: tangent from 111 to circle (O, r0) on the back side
d = np.linalg.norm(P['111'] - P['O']); ang = math.acos(r0 / d)
base = math.atan2(*(P['111'] - P['O'])[::-1])
P['012'] = min((P['O'] + r0 * pt(math.cos(base + s * ang), math.sin(base + s * ang)) for s in (1, -1)),
               key=lambda q: q[0])
# row 13: 162 at 0.33 of the neck arc 16⌒17 (centre 172)
neck_arc = arc(P['172'], P['16'], P['17'], 300)
cum = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(neck_arc, axis=0), axis=1))])
i162 = int(np.searchsorted(cum, 0.33 * cum[-1]))
P['162'] = neck_arc[i162]
P['n1'] = line_x(P['172'], P['162'] - P['172'], P['012'], P['111'] - P['012'])   # row 14
R1 = np.linalg.norm(P['162'] - P['n1'])
P['O1'] = circ_x(P['162'], R1, P['111'], R1, lambda c: min(c, key=lambda q: q[1]))   # rows 15–15.1
ins = arc(P['O1'], P['111'], P['162'], 400)                                 # row 15.2
r16 = np.linalg.norm(P['162'] - P['16'])
i16 = int(np.argmin([abs(np.linalg.norm(q - P['162']) - r16) for q in ins]))   # row 16
P["16'"] = ins[i16]
# row 17: 16'' is 3.0 toward the back along the insertion arc; rows 18–20.2: back part rotates about O
a16 = math.atan2(*(P["16'"] - P['O1'])[::-1]); a111 = math.atan2(*(P['111'] - P['O1'])[::-1])
sgn = 1 if (a111 - a16 + math.pi) % (2 * math.pi) - math.pi > 0 else -1
P["16''"] = P['O1'] + R1 * pt(math.cos(a16 + sgn * H['dart'] / R1), math.sin(a16 + sgn * H['dart'] / R1))
dart_ang = math.degrees(math.atan2(*(P["16''"] - P['O'])[::-1]) - math.atan2(*(P["16'"] - P['O'])[::-1]))
# row 18: R 16''–111' = |16'–111|, intersected with the circle about O through 111 (18.1)
P["111'"] = circ_x(P["16''"], np.linalg.norm(P["16'"] - P['111']), P['O'], np.linalg.norm(P['111'] - P['O']),
                   lambda c: min(c, key=lambda q: q[0]))
# row 19: tangent from 111' to the crown circle
d = np.linalg.norm(P["111'"] - P['O']); ang = math.acos(r0 / d)
base = math.atan2(*(P["111'"] - P['O'])[::-1])
P["012'"] = min((P['O'] + r0 * pt(math.cos(base + s * ang), math.sin(base + s * ang)) for s in (1, -1)),
                key=lambda q: q[0])
# rows 20–20.2: centre O1' at R1 from both 111' and 16''; arc 111'⌒16''
P["O1'"] = circ_x(P["111'"], R1, P["16''"], R1, lambda c: min(c, key=lambda q: q[1]))
back_ins = arc(P["O1'"], P["111'"], P["16''"], 200)                          # 111' … 16''
front_ins = ins[i16:]                                                         # 16' … 162
crown = arc(P['O'], P['061'], P['011'], 60)
crown_to_012 = arc(P['O'], P['011'], P["012'"], 20)
outline = np.vstack([[P['17'], P['07'], P['06']], crown, crown_to_012, [P["111'"]],
                     back_ins, [P['O']], front_ins, neck_arc[i162:]])

hood_neck = plen(back_ins) + plen(front_ins) + plen(neck_arc[i162:])
jacket_neck = neck['back_neck'] + neck['front_neck']
for k, v in {'hood neckline 111\'→16\'\' + 16\'→17 (cm)': hood_neck,
             'jacket neckline: back 111→121 + front 16→17': jacket_neck,
             'difference (cm)': hood_neck - jacket_neck,
             'front neck 16→17: hood vs jacket': plen(neck_arc) - neck['front_neck'],
             'dart angle at O (deg)': abs(dart_ang)}.items():
    print(f'{k:50} {v:7.2f}')

mn = outline.min(0) - 3; mx = outline.max(0) + 3; W, Hh = mx - mn
tr = lambda p: (p[0] - mn[0], mx[1] - p[1])
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W:.1f}cm" height="{Hh:.1f}cm" viewBox="0 0 {W:.2f} {Hh:.2f}">',
       '<rect width="100%" height="100%" fill="white"/>',
       f'<polygon points="{" ".join("%.2f,%.2f" % tr(p) for p in outline)}" fill="none" stroke="#000" stroke-width="0.15"/>',
       '<g font-size="0.9" fill="#c00">']
for k, p in P.items():
    x, y = tr(p)
    svg.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="0.2"/><text x="{x + .3:.2f}" y="{y - .3:.2f}">{k}</text>')
svg.append('</g></svg>')
open(sys.argv[1] + '_hood.svg', 'w', encoding='utf-8').write('\n'.join(svg))
