"""Validate a multi-figure ЕМКО table (e.g. trousers Table 7.4) against
(1) the single-size base table for the matching column and (2) the row
relations given by the formulas, evaluated per column.
usage: python emko_grade_check.py <table74.yaml>
"""
import sys
import yaml

t = yaml.safe_load(open(sys.argv[1], encoding='utf-8'))
R = {int(k): v for k, v in t['rows'].items()}
figs = t['figures']
base_col = figs.index([176, 100, 88])
BASE_72 = {1: 16.05, 2: 54.7, 3: 29.0, 4: 25.7, 5: 108.35, 6: 108.9, 7: 101.7, 8: 82.2, 9: 49.9,
           10: 4.05, 11: 13.9, 12: 7.15, 13: 21.45, 14: 16.45, 15: 13.35, 16: 13.35, 17: 10.85,
           18: 10.85, 19: 12.5, 20: 12.5, 21: 9.95, 22: 9.95, 23: 47.1, 24: 13.6, 31: 1.5}
bad = 0
print('== column 176-100-88 vs Table 7.2')
for k, v in BASE_72.items():
    if abs(R[k][base_col] - v) > 0.06:
        bad += 1; print(f'  row {k}: {R[k][base_col]} vs {v}')
rel = {   # relation name -> function(col) returning (computed, printed)
    'r3 = 0.53*r2': lambda c: (0.53 * R[2][c], R[3][c]),
    'r4 = 0.47*r2': lambda c: (0.47 * R[2][c], R[4][c]),
    'r13 = 0.5*(r11+r3)': lambda c: (0.5 * (R[11][c] + R[3][c]), R[13][c]),
    'r14 = 0.5*(r12+r4)': lambda c: (0.5 * (R[12][c] + R[4][c]), R[14][c]),
    'r24 = 0.375*(r3+r11)-2.5': lambda c: (0.375 * (R[3][c] + R[11][c]) - 2.5, R[24][c]),
    'r15 = r16, r17 = r18, r19 = r20, r21 = r22': lambda c: (R[15][c] + R[17][c] + R[19][c] + R[21][c],
                                                            R[16][c] + R[18][c] + R[20][c] + R[22][c]),
}
print('== row relations per column (tolerance 0.1 cm, values rounded to 0.05)')
KNOWN = {('r13 = 0.5*(r11+r3)', 0): 'source: book prints 19.8 vs 19.68 implied (verified on scan)'}
for name, f in rel.items():
    errs = [(i, *f(i)) for i in range(len(figs)) if abs(f(i)[0] - f(i)[1]) > 0.1]
    if errs:
        for i, a, b in errs:
            known = KNOWN.get((name, i))
            bad += 0 if known else 1
            print(f'  {name} @ {figs[i]}: computed {a:.2f} vs printed {b}' + (f'  [{known}]' if known else ''))
print('== monotonic in waist within chest 100 (rows 2, 23)')
for k in (2, 23):
    seq = [R[k][i] for i, f in enumerate(figs) if f[1] == 100]
    if seq != sorted(seq):
        bad += 1; print(f'  row {k} not monotonic: {seq}')
print(f'{"OK" if bad == 0 else str(bad) + " issue(s)"}')
