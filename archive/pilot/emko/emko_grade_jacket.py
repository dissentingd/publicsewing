"""Validate jacket Table 1.4 and write one garment YAML per figure for emko_jacket.py.
usage: python emko_grade_jacket.py <jacket_table14.yaml> <out_dir>
"""
import sys
import yaml

t = yaml.safe_load(open(sys.argv[1], encoding='utf-8'))
F, R, S, C = t['figures'], t['rows'], t['sleeve'], t['calc']
R = {float(k) if '.' in str(k) else int(k): v for k, v in R.items()}
BASE = {1: 77.35, 2: 15.5, 3: 23.35, 4: 47.8, 5: 19.2, 6: 22.45, 7: 16.0, 8: 21.7, 10: 24.6,
        11: 19.3, 12: 30.7, 13: 19.8, 14: 18.05, 17: 9.9, 18: 5.1, 19: 11.4, 21: 5.1, 27: 7.9,
        28: 2.0, 29: 2.65, 30: 0.5, 32: 8.5, 34: 9.5, 44: 1.5, 45: 12.4, 47: 21.1, 49: 7.55,
        50.1: 0.75, 51: 8.25, 52: 28.7, 54: 8.85, 61: 51.5, 62: 56.75}
b = F.index('176-100-88'); bad = 0
for k, v in BASE.items():
    if abs(R[k][b] - v) > 0.06:
        bad += 1; print(f'base column row {k}: {R[k][b]} vs Table 1.2 {v}')
rel = {'r9 = r6+r7+r8': lambda c: (R[6][c] + R[7][c] + R[8][c], R[9][c]),
       'r17 = 0.62*r7': lambda c: (0.62 * R[7][c], R[17][c]),
       'r18 = 0.38*r7 - 1': lambda c: (0.38 * R[7][c] - 1.0, R[18][c]),
       'r19 = 0.62*r7 + 1.5': lambda c: (0.62 * R[7][c] + 1.5, R[19][c]),
       'r28 = 0.25*r27': lambda c: (0.25 * R[27][c], R[28][c]),
       'shor = r7 + 4 + П (≈ r7+5.1)': lambda c: (R[7][c] + 5.1, S['shor'][c]),
       'dor = 1.07*dp': lambda c: (1.07 * C['dp'][c], C['dor'][c])}
for name, f in rel.items():
    for c in range(len(F)):
        a, p = f(c)
        if abs(a - p) > 0.11:
            bad += 1; print(f'{name} @ {F[c]}: computed {a:.2f} vs printed {p}')
print('table OK' if bad == 0 else f'{bad} issue(s)')
for c, fig in enumerate(F):
    g = {'name': f'jacket {fig}', 'sleeve': True, 'dp': C['dp'][c],
         'sleeve_rows': {'shor': S['shor'][c], 'vor': S['vor'][c], 'len': S['len'][c], 'elbow': S['elbow'][c],
                         'cuff': S['cuff'][c], 'cuff_mid': S['cuff'][c] / 2, 'dor': C['dor'][c]},
         'draft': {k: R[k][c] for k in R if k != 9}}
    yaml.safe_dump(g, open(f'{sys.argv[2]}/jacket_{fig}.yaml', 'w', encoding='utf-8'), allow_unicode=True)
