"""ЕМКО СЭВ т.3 §1: men's jacket, semi-fitted, size 176-100-88.
Base construction (БК) of back and front, Fig. 2 / Table 1.2.

Draft values ("на чертеже") come from jacket_176-100-88.yaml (rows 1–12) and
the rows transcribed below (13–62). Each point says which row defines it.
"К" rows (constructive) are interpreted from Fig. 2 and marked INTERP.

Coordinates: cm, x → from back centre toward front edge, y ↓ from point 11.
usage: python emko_jacket.py <out_prefix>
"""
import math
import sys
FLAGS = {a for a in sys.argv[1:] if a.startswith('--')}
sys.argv = [a for a in sys.argv if not a.startswith('--')]
import numpy as np

V = {   # draft values by row
    1: 77.35, 2: 15.5, 3: 23.35, 4: 47.8, 5: 19.2, 6: 22.45, 7: 16.0, 8: 21.7, 10: 24.6,
    11: 19.3, 12: 30.7, 13: 19.8, 14: 18.05, 15: 4.0, 16: 4.0, 17: 9.9, 18: 5.1, 19: 11.4,
    21: 5.1, 23: 0.5, 24: 1.5, 25: 1.5, 26: 1.5, 27: 7.9, 28: 2.0, 29: 2.65, 30: 0.5,
    32: 8.5, 34: 9.5, 44: 1.5, 45: 12.4, 47: 21.1, 49: 7.55, 50.1: 0.75, 51: 8.25,
    52: 28.7, 54: 8.85, 61: 51.5, 62: 56.75,
}
DP_TABLE = 55.3      # row 63.1, armhole length ДП
SLEEVE, GARMENT = True, 'jacket 176-100-88'
SL = {'shor': 21.1, 'vor': 18.35, 'len': 66.0, 'elbow': 37.85, 'cuff': 15.45, 'cuff_mid': 7.7}  # rows 71,72,88,89,90,91
if len(sys.argv) > 2:                     # other garments sharing the torso system (e.g. waistcoat)
    import yaml
    _g = yaml.safe_load(open(sys.argv[2], encoding='utf-8'))
    V = {float(k) if '.' in str(k) else int(k): float(v) for k, v in _g['draft'].items()}
    SLEEVE, GARMENT, DP_TABLE = bool(_g.get('sleeve', False)), _g['name'], _g.get('dp', float('nan'))
    SL.update(_g.get('sleeve_rows', {}))

P = {}
def pt(x, y): return np.array([float(x), float(y)])
def unit(v): return v / np.linalg.norm(v)
def dist(a, b): return float(np.linalg.norm(P[a] - P[b]))
def rot(p, c, deg):
    t = math.radians(deg); d = p - c
    return c + np.array([d[0] * math.cos(t) - d[1] * math.sin(t), d[0] * math.sin(t) + d[1] * math.cos(t)])
def circ_x(c1, r1, c2, r2, pick):
    """intersection of two circles; pick(candidates) chooses one"""
    d = np.linalg.norm(c2 - c1)
    a = (r1**2 - r2**2 + d**2) / (2 * d); h = math.sqrt(max(r1**2 - a**2, 0))
    m = c1 + a * (c2 - c1) / d; n = np.array([-(c2 - c1)[1], (c2 - c1)[0]]) / d
    return pick([m + h * n, m - h * n])
def line_x(p1, d1, p2, d2):
    A = np.array([d1, -d2]).T; t = np.linalg.solve(A, p2 - p1); return p1 + t[0] * d1

# ---- framework (rows 1–12) ----
P['11'] = pt(0, 0)
for k, row in (('21', 2), ('31', 3), ('41', 4), ('91', 1)):
    P[k] = pt(0, V[row])
P['51'] = pt(0, V[4] + V[5])
y3 = V[3]
P['33'] = pt(V[6], y3); P['35'] = pt(V[6] + V[7], y3); P['37'] = pt(V[6] + V[7] + V[8], y3)
P['47'] = pt(P['37'][0], y3 + V[10]); P['57'] = P['47'] + pt(0, V[11]); P['97'] = P['47'] + pt(0, V[12]) if 12 in V else P['57']   # waistcoat: front ends at 57
# ---- back seam (rows 23–26) ----
P['111'] = P['11'] + pt(V[23], 0)                       # row 23: O11, centre-back deviation at the neck (horizontal, as O41/O51/O91; Figs. 2, 7)
P['411'] = P['41'] + pt(V[24], 0); P['511'] = P['51'] + pt(V[25], 0); P['911'] = P['91'] + pt(V[26], 0)
# ---- back neck (rows 27–29, 38–40) ----
P['12'] = P['111'] + pt(V[27], 0)
P['112'] = P['111'] + pt(V[28], 0)
P['121'] = P['12'] + pt(0, -V[29])
# ---- shoulder heights (rows 13, 14, 30) ----
P['13'] = P['33'] + pt(0, -V[13]); P['14'] = P['13'] + pt(V[30], 0)
P['15'] = P['35'] + pt(0, -V[14])
# ---- back shoulder dart (rows 31–37): rotation about 22 ----
P['32'] = P['31'] + pt(V[32], 0)
P['122'] = P['121'] + 0.45 * (P['14'] - P['121'])                       # row 31
P['22'] = P['122'] + 0.45 * (P['32'] - P['122'])                        # row 33
ang = V[34]
sgn = 1 if rot(P['122'], P['22'], ang)[0] < P['122'][0] else -1        # toward the neck
P["122'"] = rot(P['122'], P['22'], sgn * ang)                           # row 34
# row 35: |122–14'| = |122'–14|, with 14' on the shoulder-height line through 13–14
# (Fig. 2 shows 14' level with 14, ~1.9 cm outward; a rotation about 22 put it 1.9 cm low
#  and left the armhole 3 cm short of ДП)
r35 = np.linalg.norm(P["122'"] - P['14'])
dy35 = P['14'][1] - P['122'][1]
P["14'"] = pt(P['122'][0] + math.sqrt(r35**2 - dy35**2), P['14'][1])
# ---- back armhole (rows 15–20.3, 41–43) ----
P['331'] = P['33'] + pt(0, V[15]); P['351'] = P['35'] + pt(0, V[16])
P['341'] = P['331'] + pt(V[17], 0); P['332'] = P['331'] + pt(0, -V[19])
P['342'] = circ_x(P['332'], V[19], P['341'], V[19], lambda c: max(c, key=lambda q: q[0] - q[1]))
# ---- front armhole (rows 21–22.3, 58–60) ----
P['346'] = P['351'] + pt(-V[18], 0); P['352'] = P['351'] + pt(0, -V[21])
P['343'] = circ_x(P['352'], V[21], P['346'], V[21], lambda c: min(c, key=lambda q: q[0] + q[1]))
# ---- front (rows 44–57) ----
P['471'] = P['47'] + pt(V[44], 0)
P['46'] = P['471'] + pt(-V[45], 0)
fe_dir = unit(P['471'] - P['37'])                                   # front edge 37→471
# row 46 (К, right-angle mark in Fig. 2): 471' = foot of the perpendicular from 46 to the front edge
P["471'"] = P['37'] + float((P['46'] - P['37']) @ fe_dir) * fe_dir
wdir = unit(P["471'"] - P['46'])                                    # front waist line 46→471'
up = np.array([wdir[1], -wdir[0]]); up = up if up[1] < 0 else -up
P['36'] = P['46'] + V[47] * up                                      # row 47: |46–36| = 21.1, ⊥ to 46–471' (Fig. 2 mark at 46)
P['371'] = line_x(P['36'], wdir, P['37'], fe_dir)                   # row 48 К: 36–371 ∥ waist line (Fig. 2)
P['372'] = P['36'] + V[49] * unit(P['371'] - P['36'])
dart = 2 * math.degrees(math.asin(V[50.1] / 2 / V[49]))              # chord 0.75 on radius 7.55
P["372'"] = rot(P['372'], P['36'], -dart)                            # opens upward
P["371'"] = rot(P['371'], P['36'], -dart)                            # row 50.2
P['361'] = P["371'"] + V[51] * unit(P['36'] - P["371'"])             # row 51
nrm = unit(rot(P['36'] - P["371'"], pt(0, 0), 90)); nrm = nrm if nrm[1] < 0 else -nrm   # up
d361 = dist('36', '361')
P['16'] = P['361'] + math.sqrt(V[52]**2 - d361**2) * nrm             # row 52 (R 36–16) on ⊥ at 361
P['161'] = P['16'] + V[54] * unit(P['361'] - P['16'])                # row 54
P['17'] = line_x(P['161'], unit(P["371'"] - P['36']), P["371'"], nrm)  # INTERP: ⊥ at 161 meets front edge
L_sh = dist('121', '14')                                            # row 53: front shoulder = |121–14|
P['14"'] = circ_x(P['352'], dist('352', '15'), P['16'], L_sh,       # rows 22.3 + 53
                  lambda c: min(c, key=lambda q: q[1]))
P['470'] = P['411'] + pt(V[61], 0)                                  # row 61 (waist width)
P['570'] = P['511'] + pt(V[62], 0)                                  # row 62 (hip width)

# ---- curves ----
def arc(c, a, b, n=40, short=True):
    a0 = math.atan2(*(a - c)[::-1]); b0 = math.atan2(*(b - c)[::-1]); r = np.linalg.norm(a - c)
    d = (b0 - a0 + math.pi) % (2 * math.pi) - math.pi
    if not short: d = d - math.copysign(2 * math.pi, d)
    return np.array([c + r * np.array([math.cos(a0 + d * t), math.sin(a0 + d * t)]) for t in np.linspace(0, 1, n)])
def tangent_arc(p0, center_dir_pt, p1, n=40):
    """arc from p0 to p1, tangent-continuous at p0 with an arc whose centre lies on p0→center_dir_pt"""
    u = unit(center_dir_pt - p0); w = p1 - p0
    r = float(w @ w) / (2 * float(w @ u)); c = p0 + r * u
    return arc(c, p0, p1, n), c
lower_back = arc(P['342'], P['341'], P['332'])                       # row 20.2
upper_back, P["342''"] = tangent_arc(P['332'], P['342'], P["14'"])   # rows 41–43 (INTERP: tangent continuity)
lower_front = arc(P['343'], P['346'], P['352'])                      # row 22.2
upper_front, P["343''"] = tangent_arc(P['352'], P['343'], P['14"'])  # rows 58–60 (INTERP)
# back neck 112⌒121: tangent horizontal at 112 (rows 38–40, INTERP)
r_n = (dist('112', '121'))**2 / (2 * (P['112'][1] - P['121'][1]))
back_neck = arc(P['112'] + pt(0, -r_n), P['112'], P['121'])
# front neck 16⌒17: radius |16–17| (equilateral construction, rows 55–57, INTERP)
r_f = dist('16', '17')
P['172'] = circ_x(P['16'], r_f, P['17'], r_f, lambda c: min(c, key=lambda q: q[1]))
front_neck = arc(P['172'], P['16'], P['17'])

def plen(a): return float(np.sum(np.linalg.norm(np.diff(a, axis=0), axis=1)))
armhole = plen(upper_back) + plen(lower_back) + plen(lower_front) + plen(upper_front)

# ---- ИМК: side-panel model construction (Table 1.3 rows 1–19, 28–29; Fig. 4) ----
IMK = None
TWO = None
if '--imk' in FLAGS:
    def cut_x(poly, x):
        """split a polyline at its first crossing of the vertical x; returns (before, point, after)"""
        for i in range(len(poly) - 1):
            a, b = poly[i], poly[i + 1]
            if (a[0] - x) * (b[0] - x) <= 0 and a[0] != b[0]:
                q = a + (x - a[0]) / (b[0] - a[0]) * (b - a)
                return poly[:i + 1], q, poly[i + 1:]
        raise ValueError(f'no crossing at x={x}')
    def at_y(a, b, y): return a + (y - a[1]) / (b[1] - a[1]) * (b - a)
    yw, yh = P['411'][1], P['511'][1]
    yhb, yhf = P['91'][1], P['97'][1]
    dT = (V[6] + V[7] + V[8] + V[44]) - (V[24] + V[61])                 # row 9: d_т
    d6 = (V[6] + V[7] + V[8] + (P['571'][0] - P['57'][0] if '571' in P else 0)) - (V[25] + V[62])   # row 15 (approx.)
    Q = {}
    Q['333'] = P['33'] + pt(0.05 * V[7], 0)                             # row 1
    back_arm = np.vstack([upper_back[::-1], lower_back[::-1]])          # 14' → 332 → 341
    _, Q['334'], _ = cut_x(back_arm[::-1], Q['333'][0])                 # vertical up from 333
    Q['353'] = P['351'] + pt(-3.5, 0)                                   # row 2
    front_arm = np.vstack([lower_front, upper_front])                   # 346 → 352 → 14"
    _, Q['354'], _ = cut_x(front_arm, Q['353'][0])
    Q['531'] = P['51'] + pt(V[6], 0); Q["531'"] = Q['531'] + pt(1.5, 0)  # rows 3–4
    Q['431'] = at_y(Q['333'], Q['531'], yw); Q["431'"] = at_y(Q['333'], Q["531'"], yw)
    Q['55'] = pt(P['35'][0], yh); Q["55'"] = pt(P['35'][0], P['57'][1])  # INTERP: 55 at back hip, 55' at front hip level
    Q['551'] = Q['55'] + pt(-1.0, 0)                                    # row 5 (printed 1.0)
    Q["551'"] = Q["55'"] + pt(1.5 - 1.0, 0)                             # row 7
    Q['951'] = pt(Q['551'][0], yhf); Q["951'"] = pt(Q["551'"][0], yhf)  # rows 6, 8 (INTERP: vertical to hem)
    Q['451'] = at_y(Q['353'], Q['551'], yw); Q["451'"] = at_y(Q['353'], Q["551'"], yw)
    s11 = 0.4 * dT - 1.0; s13 = 0.1 * dT + 0.4                          # rows 11–14
    Q['432'] = Q['431'] + pt(-s11, 0); Q["432'"] = Q["431'"] + pt(s11, 0)
    Q['452'] = Q['451'] + pt(s13, 0); Q["452'"] = Q["451'"] + pt(-s13, 0)
    Q['412'] = P['411'] + pt(0.4, 0); Q['512'] = P['511'] + pt(0.4, 0); Q['912'] = P['911'] + pt(0.4, 0)   # rows 10, 16
    s17 = 2.0                                                           # rows 17–18 (0.5·d_б − 0.2 = 2.0 printed)
    Q['532'] = Q['531'] + pt(-s17, 0); Q["532'"] = Q["531'"] + pt(s17, 0)
    Q['932'] = pt(Q['532'][0], yhb); Q["932'"] = pt(Q["532'"][0], yhb)  # row 19 (vertical option)
    # ---- belly-dart transfer (rows 20–36, Fig. 4) ----
    def rot_about(p, c, ang):
        cs, sn = math.cos(ang), math.sin(ang); d = p - c
        return c + np.array([cs * d[0] - sn * d[1], sn * d[0] + cs * d[1]])
    def ang_between(c, a, b):
        va, vb = a - c, b - c
        return math.atan2(va[0] * vb[1] - va[1] * vb[0], float(va @ vb))
    Q['462'] = P['46'] + pt(0, 0.335 * V[11])                          # row 20: 6.45 straight down
    d87 = pt(-math.sin(math.radians(87)), -math.cos(math.radians(87)))  # row 21: 87° to the vertical, toward the side
    Q['453'] = line_x(Q['462'], d87, Q['452'], Q['551'] - Q['452'])     # ∩ side line 452→551
    theta = ang_between(P['46'], P['471'], P["471'"])                  # belly angle ∠471–46–471'
    B = {'471': P['471'], 'hemF': pt(P['471'][0], yhf), '951': Q['951'], '551': Q['551'], '453': Q['453'], '462': Q['462']}
    B1 = {k: rot_about(v, P['46'], theta) for k, v in B.items()}       # lower piece about 46 → 462', 453' (rows 22–24)
    Q["462'"], Q["453'"] = B1['462'], B1['453']
    r36 = np.linalg.norm(Q["462'"] - P['36'])                           # rows 26–26.1: |462–462''| = 1.5, |36–462''| = |36–462'|
    Q["462''"] = circ_x(Q['462'], 1.5, P['36'], r36, lambda c: min(c, key=lambda q: np.linalg.norm(q - Q["462'"])))
    phi = ang_between(P['36'], Q["462'"], Q["462''"])                  # remainder moved to the lapel edge
    BC = {k: rot_about(v, P['36'], phi) for k, v in B1.items()}
    Q["371''"] = rot_about(P['371'], P['36'], phi)                      # row 29: сутюжка by the lapel edge
    Q["471''"] = rot_about(P["471'"], P['36'], phi)
    Q["46'"] = rot_about(P['46'], P['36'], phi)
    Q["453''"] = BC['453']; Q["551''"] = BC['551']; Q["952''"] = BC['951']; Q["971''"] = BC['hemF']
    # front waist (fish) dart after the transfers (rows 27–28): 0.4 each side at the waist, apex at 36
    Q['461'] = P['46'] + pt(-0.4, 0)
    Q["461'"] = Q["46'"] + 0.4 * unit(Q["471''"] - Q["46'"])
    # pieces
    ba_before, _, _ = cut_x(back_arm[::-1], Q['333'][0])                # 341 … up to 334 (reverse order)
    arm_b_to334 = back_arm[:len(back_arm) - len(ba_before)]             # 14' … 334
    arm_334_to341 = ba_before[::-1]                                     # 334 … 341
    fa_before, _, fa_after = cut_x(front_arm, Q['353'][0])              # 346 … 354 | 354 … 14"
    back_p = np.vstack([[P['111'], P['112']], back_neck, [P['121'], P["122'"], P['22'], P['122'], P["14'"]],
                        arm_b_to334, [Q['334'], Q['333'], Q['432'], Q['532'], Q['932'], Q['912'], Q['512'], Q['412'],
                                      P['31'], P['21'], P['111']]])
    side_p = np.vstack([[Q['334']], arm_334_to341, fa_before, [Q['354'], Q['353'], Q["452'"], Q["551'"], Q["951'"],
                        Q["932'"], Q["532'"], Q["432'"], Q['333'], Q['334']]])
    front_p = np.vstack([[Q['354']], fa_after, [P['14"']], [P['16']], front_neck,
                         [P['17'], P["371'"], Q["371''"], Q["471''"], BC['471'], Q["971''"], Q["952''"], Q["551''"],
                          Q["453''"], BC['462'], Q["461'"], P['36'], Q['461'], Q['462'], Q['453'], Q['452'], Q['353'], Q['354']]])
    fdart = np.array([P['36'], Q['461'], Q['462'], BC['462'], Q["461'"], P['36']])
    waist = {'back': Q['432'][0] - Q['412'][0], 'side': Q["452'"][0] - Q["432'"][0],
             'front': np.linalg.norm(Q["471''"] - Q["461'"]) + np.linalg.norm(Q['461'] - Q['452'])}
    front_side = plen(np.array([Q['354'], Q['353'], Q['452'], Q['453']])) + plen(np.array([Q["453''"], Q["551''"], Q["952''"]]))
    front_edge_old = plen(np.array([P["371'"], P['371'], P['471'], B['hemF']]))
    front_edge_new = plen(np.array([P["371'"], Q["371''"], Q["471''"], BC['471'], Q["971''"]]))
    def seam_len(pts): return plen(np.array(pts))
    IMK = dict(Q=Q, pieces={'back': back_p, 'side': side_p, 'front': front_p, 'dart': fdart}, checks={
        'd_т (row 9; table 8.65)': dT,
        'waist suppression sum 0.4+2·s11+2·s13+0.8 (= d_т)': 0.4 + 2 * s11 + 2 * s13 + 0.8,
        'half-waist of panels (target |411–470| = 51.5)': sum(waist.values()),
        'seam A: back 334→333→432→532→932': seam_len([Q['334'], Q['333'], Q['432'], Q['532'], Q['932']]),
        'seam A: side 334→333→432\'→532\'→932\'': seam_len([Q['334'], Q['333'], Q["432'"], Q["532'"], Q["932'"]]),
        'seam B: side 354→353→452\'→551\'→951\'': seam_len([Q['354'], Q['353'], Q["452'"], Q["551'"], Q["951'"]]),
        'seam B: front after transfer 354…453 + 453″…952″': front_side,
        'belly angle θ (deg)': math.degrees(theta), 'lapel-edge transfer φ (deg)': math.degrees(phi),
        'dart opening at 462 (row 26 = 1.5)': np.linalg.norm(BC['462'] - Q['462']),
        'pocket-line gap |453–453″|': np.linalg.norm(Q["453''"] - Q['453']),
        'front edge 371′→hem: base / after (сутюжка shortens)': front_edge_new - front_edge_old,
    })

# ---- outlines ----
back = np.vstack([[P['111'], P['112']], back_neck, [P['121'], P["122'"], P['22'], P['122'], P["14'"]],
                  upper_back[::-1], lower_back[::-1], [P['341'], pt(P['341'][0], V[1]), P['911'], P['511'],
                  P['411'], P['31'], P['21'], P['111']]])
front = np.vstack([[P['14"']], upper_front[::-1], lower_front[::-1],
                   [P['346'], pt(P['346'][0], P['97'][1]), pt(P['471'][0], P['97'][1]), P['471'],
                    *([P['371'], P['36'], P["371'"]] if V.get(50.1, 0) > 0 else [P['371']]),   # chest dart (rows 48–50.2), if any
                    P['17']], front_neck[::-1], [P['16'], P['14"']]])

if SLEEVE:
    # =================== SLEEVE (Fig. 3, rows 64–93) ===================
    # sleeve-local frame: x →, y ↓, origin at 333 on the armhole-bottom line
    S = {}
    SH, SHOR, VOR = dist('33', '35'), SL['shor'], SL['vor']
    _dor = SL.get('dor', 59.15)
    VOR_CALC = 0.885 * _dor * math.sqrt(0.25 - (SHOR / _dor) ** 2)        # row 72 formula
    if abs(VOR_CALC - VOR) > 0.15:
        print(f'WARNING: ВОР {VOR} ≠ row-72 formula {VOR_CALC:.2f}')          # rows 64 (ШП), 71 (ШОР), 72 (ВОР)
    S['333'] = pt(0, 0); S['351'] = pt(SHOR, 0); S['331'] = pt(SHOR - SH, 0)
    S['341'] = S['331'] + pt(V[17], 0); S['346'] = S['351'] + pt(-V[18], 0)      # rows 65–66
    S['332'] = S['331'] + pt(0, -V[19]); S['352'] = S['351'] + pt(0, -V[21])     # rows 67, 69
    S['342'] = circ_x(S['332'], V[19], S['341'], V[19], lambda c: max(c, key=lambda q: q[0] - q[1]))
    S['343'] = circ_x(S['352'], V[21], S['346'], V[21], lambda c: min(c, key=lambda q: q[0] + q[1]))
    S['13'] = pt(0, -VOR); S['15'] = pt(SHOR, -VOR)
    S['14'] = S['13'] + pt(0.45 * SHOR, 0)                                        # row 73
    S['141'] = S['13'] + pt(0.73 * SHOR, 0)                                       # row 74
    S["141'"] = S['15'] + (S['15'] - S['141'])                                    # row 75
    S['143'] = S['14'] + 0.5 * (S['141'] - S['14'])                               # row 79
    S['131'] = S['13'] + pt(0, 0.25 * VOR)                                        # row 80
    S['132'] = S['131'] + pt(SL.get('k81', 0.4) * (SHOR - SH - 4.0), 0)                          # row 81 (к81=0.4)
    S["13'"] = pt(S['132'][0], -VOR)
    S['344'] = S['132'] + 0.5 * (S['342'] - S['132'])                             # row 82
    S['345'] = circ_x(S['342'], V[19], S['344'], np.linalg.norm(S['344'] - S['342']),   # row 83 + arc(342)
                      lambda c: max(c, key=lambda q: q[1] - q[0]))
    # row 84: |13'–133| = |13'–133'|, 133' = top line ∩ extension of 345→132 (Fig. 3)
    S["133'"] = line_x(S['132'], S['132'] - S['345'], S['13'], pt(1, 0))
    S['133'] = S["13'"] + (S["13'"] - S["133'"])
    S['144'] = S['133'] + 0.5 * (S['14'] - S['133'])                              # row 86
    S['134'] = S['133'] + 0.5 * (S['132'] - S['133'])                             # row 85
    S['353'] = S["141'"] + 0.5 * (S['343'] - S["141'"])                           # row 76
    r141 = np.linalg.norm(S['15'] - S['141'])
    S['142'] = S['141'] + r141 * unit(S['352'] - S['141'])                        # row 78 (on 141→352, INTERP)

    # cap curve (Catmull-Rom through the construction points, horizontal at the crown 14)
    def catmull(pts, n=16):
        P_ = [pts[0]] + list(pts) + [pts[-1]]; out = []
        for i in range(1, len(P_) - 2):
            p0, p1, p2, p3 = P_[i - 1], P_[i], P_[i + 1], P_[i + 2]
            for t in np.linspace(0, 1, n, endpoint=False):
                out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t**2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t**3))
        out.append(pts[-1]); return np.array(out)
    # 133, 144, 143 are construction marks on the top line (tangent guides), not curve points:
    # the cap passes 132 → 134 → 14 (crown, horizontal tangent) → 142 → 352
    def hermite(pts, tans, n=20):
        out = []
        for i in range(len(pts) - 1):
            p0, p1, m0, m1 = pts[i], pts[i + 1], tans[i], tans[i + 1]
            for t in np.linspace(0, 1, n, endpoint=False):
                h = [2*t**3 - 3*t**2 + 1, t**3 - 2*t**2 + t, -2*t**3 + 3*t**2, t**3 - t**2]
                out.append(h[0]*p0 + h[1]*m0 + h[2]*p1 + h[3]*m1)
        out.append(pts[-1]); return np.array(out)
    # ЕМКО appendix (pp.126–127, Fig. 36): unified arc method for the upper cap.
    # Tangent polygon 132–134–144–143–142–355(≡352); touch points at the segment
    # midpoints (3 ≡ 14 on the top line); straight runs 132→5 and 1→352; arcs between
    # touch points, centre = intersection of the normals erected at the touch points.
    poly = [S['132'], S['134'], S['144'], S['143'], S['142'], S['352']]
    touch = [0.5 * (poly[0] + poly[1]), 0.5 * (poly[1] + poly[2]), S['14'],
             0.5 * (poly[3] + poly[4]), 0.5 * (poly[4] + poly[5])]
    segs = [(poly[0], poly[1]), (poly[1], poly[2]), (poly[2], poly[3]), (poly[3], poly[4]), (poly[4], poly[5])]
    nrm = [np.array([-(b - a)[1], (b - a)[0]]) for a, b in segs]
    cap_pts, ARC_GAPS = [S['132'], touch[0]], []
    start = touch[0]
    for k in range(4):
        c = line_x(start, nrm[k], touch[k + 1], nrm[k + 1])
        rr = np.linalg.norm(start - c)
        end = c + rr * unit(touch[k + 1] - c)            # where the arc meets the next normal
        ARC_GAPS.append(float(np.linalg.norm(end - touch[k + 1])))
        a = arc(c, start, end, 30)
        cap_pts.extend(a[1:])
        start = end                                       # chain from the arc end (no kink)
    cap_pts.append(S['352'])
    cap = np.array(cap_pts)
    under_back = arc(S['342'], S['345'], S['341'])
    under_front = arc(S['343'], S['346'], S['352'])
    under = np.vstack([catmull([S['132'], S['345']], 4), under_back, under_front])
    # seams tilted β87 = 2.5° (row 87); elbow and hem levels (rows 88–89)
    b87 = math.radians(2.5)
    y_hem, y_elb = SL['len'] - VOR, SL['elbow'] - VOR
    S['431'] = pt(y_elb * math.tan(b87), y_elb); S['451'] = pt(SHOR - y_elb * math.tan(b87), y_elb)
    S['951'] = pt(SHOR - y_hem * math.tan(b87), y_hem)
    S['931'] = pt(SHOR - SL['cuff'], y_hem)                                            # row 90: 95–931
    S['94'] = pt(SHOR - SL['cuff_mid'], y_hem)                                               # row 91
    sleeve = np.vstack([cap, [S['351'], S['451'], S['951'], S['94'], S['931'], S['431'], S['333'], S['131'], S['132']]])
    cap_len, under_len = plen(cap), plen(under)
    TWO = None
    if '--imk' in FLAGS:
        # ---- two-piece sleeve ИМК (Table 1.3 sleeve rows 1–18.2, Fig. 5) ----
        def foot(p, a, b):                         # foot of perpendicular from p to line a–b
            d = unit(b - a); return a + float((p - a) @ d) * d
        def x_line_y(a, b, y): return a + (y - a[1]) / (b[1] - a[1]) * (b - a)
        T = {}
        T['355'] = S['352']                                                    # Fig. 36: 355 ≡ 352
        T['933'] = S['931']                                                    # INTERP: hem point of the back fold
        T['934'] = T['933'] + 8.0 * unit(S['431'] - T['933'])                  # row 3: vent length 8.0
        T['135'] = S['132'] + 4.5 * unit(S['345'] - S['132'])                 # row 4
        T['136'] = foot(T['135'], S['132'], S['333'])                          # row 5
        T["135'"] = 2 * T['136'] - T['135']                                    # row 5: R 132–135' = 4.5 on the ⊥ (mirror)
        T['432'] = x_line_y(T['136'], T['934'], S['431'][1]); T['433'] = x_line_y(T['135'], T['934'], S['431'][1])
        T['334'] = x_line_y(T['136'], T['934'], 0.0); T['335'] = x_line_y(T['135'], T['934'], 0.0)
        roll_e, roll_u = abs(T['433'][0] - T['432'][0]), abs(T['335'][0] - T['334'][0])
        T['434'] = S['431'] + pt(roll_e, 0); T["434'"] = S['431'] + pt(-roll_e, 0)      # rows 6–7
        T['336'] = S['333'] + pt(roll_u, 0); T["336'"] = S['333'] + pt(-roll_u, 0)      # rows 8–9
        T['356'] = S['351'] + pt(-2.0, 0); T["356'"] = S['351'] + pt(2.0, 0)           # rows 10–11
        T['452'] = S['451'] + pt(-2.0, 0)                                               # row 12
        r356 = np.linalg.norm(T['452'] - T['356'])
        T["452'"] = circ_x(S['451'], 2.0, T["356'"], r356, lambda c: max(c, key=lambda q: q[0]))   # rows 13–13.1
        hem_dir = unit(S['931'] - S['951'])
        T['952'] = S['951'] + 2.0 * hem_dir; T["952'"] = S['951'] - 2.0 * hem_dir      # rows 14–15
        r952 = np.linalg.norm(T['952'] - T['452'])
        T["452''"] = circ_x(S['451'], 2.0, T["952'"], r952, lambda c: max(c, key=lambda q: q[0]))  # row 16
        # 357: line 452→356 extended meets the lower front cap arc (346⌒352, centre 343)
        lf = under_front
        dline = unit(T['356'] - T['452'])
        def side(q): return float(np.cross(dline, q - T['452']))
        i357 = next(i for i in range(len(lf) - 1) if side(lf[i]) * side(lf[i + 1]) <= 0)
        T['357'] = lf[i357]
        # 354 on the lower front arc at |353–343| from 353 (row 77); 354' mirrored below 355 along 141→355 (row 17)
        r353 = np.linalg.norm(S['353'] - S['343'])
        i354 = int(np.argmin([abs(np.linalg.norm(q - S['353']) - r353) for q in lf]))
        T['354'] = lf[i354]
        T["354'"] = T['355'] + np.linalg.norm(T['355'] - T['354']) * unit(T['355'] - S['141'])
        T["343'"] = pt(2 * S['351'][0] - S['343'][0], S['343'][1])            # rows 18–18.1: mirror of 343 about the front fold
        rr = np.linalg.norm(T["354'"] - T["343'"])
        dtop = unit(T["356'"] - T["452'"])
        # 357': on circle (343', rr), on the extension of 452'→356'
        a_ = float(dtop @ dtop); b_ = 2 * float(dtop @ (T["356'"] - T["343'"])); c_ = float((T["356'"] - T["343'"]) @ (T["356'"] - T["343'"])) - rr**2
        roots = [(-b_ + sg * math.sqrt(max(b_**2 - 4 * a_ * c_, 0))) / (2 * a_) for sg in (1, -1)]
        T["357'"] = max((T["356'"] + tq * dtop for tq in roots), key=lambda q: q[1])   # lower intersection (≈ level of 357)
        ext = arc(T["343'"], T["354'"], T["357'"], 20)
        # top sleeve: 135' → 132 → upper cap → 355 → 354' ⌒ 357' → 356' → 452' → 452'' → 952' → hem → 934 → 434' → 336' → 135'
        top = np.vstack([[T["135'"], S['132']], cap[1:], [T['355'], T["354'"]], ext[1:],
                         [T["356'"], T["452'"], T["452''"], T["952'"], T['933'], T['934'], T["434'"], T["336'"], T["135'"]]])
        # under sleeve: 135 → (132–345 line) → 345 ⌒ 341 → 346 ⌒ 357 → 356 → 452 → 952 → hem → 934 → 434 → 336 → 135
        undr = np.vstack([[T['135'], S['345']], under_back, lf[:i357 + 1],
                          [T['357'], T['356'], T['452'], T['952'], T['933'], T['934'], T['434'], T['336'], T['135']]])
        top_front = plen(np.array([T["357'"], T["356'"], T["452'"]])) + plen(np.array([T["452''"], T["952'"]]))
        und_front = plen(np.array([T['357'], T['356'], T['452'], T['952']]))
        top_back = plen(np.array([T["135'"], T["336'"], T["434'"], T['934']]))
        und_back = plen(np.array([T['135'], T['336'], T['434'], T['934']]))
        cap_top = plen(np.vstack([[T["135'"], S['132']], cap[1:], [T['355'], T["354'"]], ext[1:]]))
        cap_und = plen(np.vstack([[T['135'], S['345']], under_back, lf[:i357 + 1]]))
        TWO = dict(T=T, pieces={'top_sleeve': top, 'under_sleeve': undr}, checks={
            'elbow roll |432–433|': roll_e, 'underarm roll |334–335|': roll_u,
            'front seam: top (excl. elbow stretch)': top_front, 'front seam: under': und_front,
            'back seam: top': top_back, 'back seam: under': und_back,
            'cap: top + under (vs one-piece cap+under)': cap_top + cap_und,
            'one-piece cap + under (reference)': cap_len + under_len})
    # SLEEVE_PTS_DUMP
    _json_s = {k: [round(float(v[0]), 2), round(float(v[1]) + VOR, 2)] for k, v in S.items() if v is not None}
    open(sys.argv[1] + '_sleeve_pts.json', 'w').write(str(_json_s))

checks = {} if not SLEEVE else {
    'sleeve cap upper curve 132→352 (cm)': cap_len,
    'sleeve under curve 132→…→352 (cm)': under_len,
    f'sleeve cap total vs ДОР {SL.get("dor", 59.15)}': cap_len + under_len,
    'cap actual target ДОР − 2|131–132| (footnote 6)': SL.get('dor', 59.15) - 2 * np.linalg.norm(S['132'] - S['131']),}
checks.update({
    'back shoulder |121–122\'|+|122–14\'| (cm)': dist('121', "122'") + dist('122', "14'"),
    'front shoulder |16–14"| (= |121–14|)': dist('16', '14"'),
    f'armhole length incl. underarm (cm) vs ДП {DP_TABLE}': armhole + (P['346'][0] - P['341'][0]),
    'gap 341→346 at underarm (cm)': P['346'][0] - P['341'][0],
    'back neck width 111→121': dist('111', '121'),
    'front neck |16–17|': r_f,
    'chest dart angle (deg)': dart,
})
print(f'== {GARMENT}')
import json as _json
_json.dump({'back_neck': plen(np.vstack([[P['111']], back_neck])), 'front_neck': plen(front_neck),
            '16_161': dist('16', '161'), 'shoulder': dist('16', '14"')}, open(sys.argv[1] + '_neck.json', 'w'))
for k, v in checks.items():
    print(f'{k:45} {v:7.2f}')
print('points:')
for k in sorted(P, key=lambda s: (len(s.rstrip("'\"")), s)):
    print(f'  {k:6} ({P[k][0]:6.2f}, {P[k][1]:6.2f})')

if SLEEVE and TWO:
    print('== two-piece sleeve ИМК')
    for k, v in TWO['checks'].items():
        print(f'{k:50} {v:7.2f}')
    allp = np.vstack(list(TWO['pieces'].values())); m0 = allp.min(0) - 3; m1 = allp.max(0) + 3; WW, HH = m1 - m0
    sv = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{WW:.1f}cm" height="{HH:.1f}cm" viewBox="{m0[0]:.2f} {m0[1]:.2f} {WW:.2f} {HH:.2f}">',
          f'<rect x="{m0[0]}" y="{m0[1]}" width="{WW}" height="{HH}" fill="white"/>']
    for k, poly in TWO['pieces'].items():
        sv.append(f'<polygon points="{" ".join(f"{x:.2f},{y:.2f}" for x, y in poly)}" fill="none" stroke="{"#060" if k == "top_sleeve" else "#c60"}" stroke-width="0.15"/>')
    sv.append('<g font-size="0.8" fill="#c00">')
    for k, (x, y) in TWO['T'].items():
        sv.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="0.15"/><text x="{x + .3:.2f}" y="{y - .3:.2f}">{k}</text>')
    sv.append('</g></svg>')
    open(sys.argv[1] + '_imk_sleeve.svg', 'w', encoding='utf-8').write(chr(10).join(sv))
if IMK:
    print('== ИМК (side-panel model construction)')
    for k, v in IMK['checks'].items():
        print(f'{k:50} {v:7.2f}')
    allp = np.vstack(list(IMK['pieces'].values())); m0 = allp.min(0) - 3; m1 = allp.max(0) + 3; WW, HH = m1 - m0
    cols = {'back': '#000', 'side': '#c60', 'front': '#04a', 'dart': '#a0a'}
    sv = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{WW:.1f}cm" height="{HH:.1f}cm" viewBox="{m0[0]:.2f} {m0[1]:.2f} {WW:.2f} {HH:.2f}">',
          f'<rect x="{m0[0]}" y="{m0[1]}" width="{WW}" height="{HH}" fill="white"/>']
    for k, poly in IMK['pieces'].items():
        sv.append(f'<polygon points="{" ".join(f"{x:.2f},{y:.2f}" for x, y in poly)}" fill="none" stroke="{cols[k]}" stroke-width="0.15"/>')
    sv.append('<g font-size="0.9" fill="#c00">')
    for k, (x, y) in IMK['Q'].items():
        sv.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="0.2"/><text x="{x + .3:.2f}" y="{y - .3:.2f}">{k}</text>')
    sv.append('</g></svg>')
    open(sys.argv[1] + '_imk.svg', 'w', encoding='utf-8').write(chr(10).join(sv))
mn = np.vstack([back, front]).min(0) - 3; mx = np.vstack([back, front]).max(0) + 3
W, H = mx - mn
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W:.1f}cm" height="{H:.1f}cm" viewBox="{mn[0]:.2f} {mn[1]:.2f} {W:.2f} {H:.2f}">',
       f'<rect x="{mn[0]}" y="{mn[1]}" width="{W}" height="{H}" fill="white"/>']
for name, poly, col in (('back', back, '#000'), ('front', front, '#04a')):
    svg.append(f'<polygon points="{" ".join(f"{x:.2f},{y:.2f}" for x, y in poly)}" fill="none" stroke="{col}" stroke-width="0.15"/>')
for y in (P['31'][1], P['41'][1], P['51'][1]):
    svg.append(f'<line x1="0" y1="{y}" x2="{P["471"][0]}" y2="{y}" stroke="#bbb" stroke-width="0.05" stroke-dasharray="0.5 0.5"/>')
svg.append('<g font-size="0.9" fill="#c00">')
for k, (x, y) in P.items():
    svg.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="0.2"/><text x="{x + 0.3:.2f}" y="{y - 0.3:.2f}">{k}</text>')
svg.append('</g></svg>')
open(sys.argv[1] + '_bk.svg', 'w', encoding='utf-8').write('\n'.join(svg))

_pieces = {'figure': GARMENT.split()[-1], 'back': back.round(3).tolist(), 'front': front.round(3).tolist()}
if SLEEVE:
    _pieces['sleeve'] = (sleeve + pt(0, 0)).round(3).tolist()
_json.dump(_pieces, open(sys.argv[1] + '_pieces.json', 'w'))
if not SLEEVE:
    sys.exit(0)
off = pt(mx[0] + 5, 25)            # place sleeve to the right of the body
sl = sleeve + off; un = under + off
mn2, mx2 = np.vstack([sl, un]).min(0) - 3, np.vstack([sl, un]).max(0) + 3
W2, H2 = mx2 - mn2
s2 = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W2:.1f}cm" height="{H2:.1f}cm" viewBox="{mn2[0]:.2f} {mn2[1]:.2f} {W2:.2f} {H2:.2f}">',
      f'<rect x="{mn2[0]}" y="{mn2[1]}" width="{W2}" height="{H2}" fill="white"/>',
      f'<polygon points="{" ".join(f"{x:.2f},{y:.2f}" for x, y in sl)}" fill="none" stroke="#060" stroke-width="0.15"/>',
      f'<polyline points="{" ".join(f"{x:.2f},{y:.2f}" for x, y in un)}" fill="none" stroke="#999" stroke-width="0.1"/>',
      '<g font-size="0.9" fill="#c00">']
for k, p in S.items():
    x, y = p + off
    s2.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="0.2"/><text x="{x + 0.3:.2f}" y="{y - 0.3:.2f}">{k}</text>')
s2.append('</g></svg>')
open(sys.argv[1] + '_sleeve.svg', 'w', encoding='utf-8').write('\n'.join(s2))
