"""Validate a transcribed ЕМКО СЭВ table and build the framework grid.

1. Row arithmetic: ПК=ПС+ПП, fin=base+ПК, П=ПК+ПТ, draft=base+П.
2. Cross-row: solve the body measurements T## from every formula
   (least squares) and report each row's residual. A wrong digit shows up
   as an outlier.
3. Framework: place points by the ЕМКО numbering (first digit = level,
   second = vertical line) and write an SVG at 1:1 (cm).

usage: python emko_check.py <table.yaml> <out_prefix>
"""
import re
import sys
import numpy as np
import yaml

tab = yaml.safe_load(open(sys.argv[1], encoding='utf-8'))
rows = tab['rows']
by_seg = {r['seg']: r for r in rows}
TOL = 0.06   # table values are rounded to 0.05

print('== 1. row arithmetic')
bad = 0
for r in rows:
    checks = {'ПК=ПС+ПП': r['pk'] - (r['ps'] + r['pp']), 'fin=base+ПК': r['fin'] - (r['base'] + r['pk']),
              'П=ПК+ПТ': r['p'] - (r['pk'] + r['pt']), 'draft=base+П': r['draft'] - (r['base'] + r['p'])}
    errs = {k: round(v, 3) for k, v in checks.items() if abs(v) > TOL}
    if errs:
        bad += 1
        print(f"  row {r['n']:>2} {r['seg']}: {errs}")
print(f'  {len(rows) - bad}/{len(rows)} rows consistent')

print('== 2. body measurements implied by the formulas')
tnames = sorted({t for r in rows if '|' not in r['f'] for t in re.findall(r'T\d+', r['f'])}, key=lambda s: int(s[1:]))
A, b, used = [], [], []
for r in rows:
    f = r['f'].replace('+П', '').replace('П', '0')
    if '|' in f:
        continue
    # linearize: coefficient of each T = f(T=e_i) - f(0)
    env0 = {t: 0.0 for t in tnames}
    c0 = eval(f, {}, env0)
    coef = []
    for t in tnames:
        env = dict(env0); env[t] = 1.0
        coef.append(eval(f, {}, env) - c0)
    A.append(coef); b.append(r['base'] - c0); used.append(r)
A, b = np.array(A), np.array(b)
sol, *_ = np.linalg.lstsq(A, b, rcond=None)
rank = np.linalg.matrix_rank(A)
res = A @ sol - b
for t, v in zip(tnames, sol):
    print(f'  {t:>4} = {v:7.2f}')
print(f'  (rank {rank} of {len(tnames)} unknowns; T7 and T12 only appear as T7-T12, so only their difference is determined)')
for r, e in zip(used, res):
    flag = '  <-- check' if abs(e) > TOL else ''
    print(f"  row {r['n']:>2} {r['seg']:6} residual {e:+.3f}{flag}")
for r in rows:   # sum rows like |31-33|+|33-35|+|35-37| (only when every term is a row here)
    if '|' in r['f'] and all(s_ in by_seg for s_ in re.findall(r'\|(\d+-\d+)\|', r['f']))             and re.fullmatch(r'[\s|+\d-]+', r['f']):
        segs = re.findall(r'\|(\d+-\d+)\|', r['f'])
        s_base = sum(by_seg[s]['base'] for s in segs); s_draft = sum(by_seg[s]['draft'] for s in segs)
        print(f"  row {r['n']:>2} {r['seg']} sum check: base {s_base:.2f} vs {r['base']}, draft {s_draft:.2f} vs {r['draft']}")

print('== 3. framework grid (draft values, cm)')
D = {r['seg']: r['draft'] for r in rows}
P = {'11': (0.0, 0.0)}
for s in ('11-21', '11-31', '11-41', '11-91'):
    P[s.split('-')[1]] = (0.0, D[s])
P['51'] = (0.0, P['41'][1] + D['41-51'])
y31 = P['31'][1]
P['33'] = (D['31-33'], y31)
P['35'] = (P['33'][0] + D['33-35'], y31)
P['37'] = (P['35'][0] + D['35-37'], y31)
x37 = P['37'][0]
P['47'] = (x37, y31 + D['37-47'])
P['57'] = (x37, P['47'][1] + D['47-57'])
P['97'] = (x37, P['47'][1] + D['47-97'])
for k, (x, y) in sorted(P.items()):
    print(f'  {k}: ({x:6.2f}, {y:6.2f})')
print(f"  check: 31-37 width {x37:.2f} vs table {D['31-37']}")

W, H = x37 + 10, max(y for _, y in P.values()) + 10
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}cm" height="{H}cm" viewBox="-5 -5 {W} {H}">',
       '<rect x="-5" y="-5" width="100%" height="100%" fill="white"/>',
       '<g stroke="black" stroke-width="0.1" fill="none">']
for lvl in ('11', '21', '31', '41', '51', '91'):
    svg.append(f'<line x1="0" y1="{P[lvl][1]}" x2="{x37}" y2="{P[lvl][1]}" stroke-dasharray="0.5 0.5"/>')
for a, c in (('11', '91'), ('33', '33'), ('35', '35'), ('37', '97')):
    xa = P[a][0]
    svg.append(f'<line x1="{xa}" y1="0" x2="{xa}" y2="{P["97"][1]}"/>')
svg.append('</g><g font-size="1.2" fill="#c00">')
for k, (x, y) in P.items():
    svg.append(f'<circle cx="{x}" cy="{y}" r="0.3" fill="#c00"/><text x="{x + 0.5}" y="{y - 0.4}">{k}</text>')
svg.append('</g></svg>')
open(sys.argv[2] + '_framework.svg', 'w').write('\n'.join(svg))
