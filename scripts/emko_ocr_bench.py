"""Benchmark the ЕМКО OCR reader against rows the pilot already validated.

For each Table x.2 it parses the stored OCR text (data/emko/ocr/), resolves each
row (identities + repair) and compares the draft value with the pilot's
validated transcription. Reports how many rows the pipeline reads correctly
on its own and lists every mismatch.
usage: python scripts/emko_ocr_bench.py
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from ccat.sources import emko, emko_ocr     # noqa: E402

OCR = ROOT / 'data' / 'emko' / 'ocr'
# table -> (pages, ground truth: validated draft values by row)
TABLES = {
    '1.2': ((6, 12), ROOT / 'data' / 'emko' / 'jacket_176-100-88.yaml'),
    '2.2': ((24, 30), ROOT / 'pilot' / 'emko' / 'coat_demi_176-100-88.yaml'),
    '3.2': ((42, 48), ROOT / 'pilot' / 'emko' / 'coat_winter_176-100-88.yaml'),
    '4.2': ((59, 65), ROOT / 'pilot' / 'emko' / 'summer_jacket_176-100-88.yaml'),
    '5.2': ((82, 88), ROOT / 'pilot' / 'emko' / 'jacket_insulated_176-100-88.yaml'),
    '6.2': ((99, 103), ROOT / 'pilot' / 'emko' / 'waistcoat_176-100-88.yaml'),
}


def lines(pages):
    out = []
    for p in range(pages[0], pages[1] + 1):
        f = OCR / f'p-{p:03d}.txt'
        if f.exists():
            out += [l for l in f.read_text(encoding='utf-8').splitlines() if not l.startswith('# page')]
    return out


def first_occurrence(rows):
    seen = {}
    for r in rows:
        seen.setdefault(r['n'], r)
    return seen


_POOLED = None


def read_all():
    """All Tables x.2 read together, so tables for the same figure pool their rows."""
    global _POOLED
    if _POOLED is None:
        _POOLED = emko_ocr.read_tables({t: lines(TABLES[t][0]) for t in TABLES})
    return _POOLED


def bench(table):
    pages, truth_path = TABLES[table]
    truth = {float(k): float(v) for k, v in (emko.load(truth_path).get('draft') or {}).items()}
    rows, w = read_all()[table]
    by_n = first_occurrence(rows)
    res = {'table': table, 'width': w, 'truth': len(truth), 'right': 0, 'by_status': {}, 'wrong': [], 'missing': [],
           'rows': by_n}
    for n, v in sorted(truth.items()):
        r = by_n.get(int(n) if n.is_integer() else n)
        if r is None or 'draft' not in r['cells']:
            res['missing'].append(n)
            continue
        got = r['cells']['draft']
        if abs(got - v) <= 0.001 and r['status'] in ('ok', 'repaired', 'aligned', 'formula'):
            res['right'] += 1
            res['by_status'][r['status']] = res['by_status'].get(r['status'], 0) + 1
        else:
            res['wrong'].append((n, v, got, r['status'], r['raw']))
    return res


if __name__ == '__main__':
    tot = right = 0
    verified_wrong = 0
    for t in TABLES:
        b = bench(t)
        tot += b['truth']; right += b['right']
        verified_wrong += sum(1 for x in b['wrong'] if x[3] in ('ok', 'repaired', 'aligned', 'formula'))
        print(f"Table {t} ({b['width']} cols): {b['right']}/{b['truth']} rows verified + right {b['by_status']}; "
              f"{len(b['wrong'])} wrong, {len(b['missing'])} missing")
        for n, v, got, st, raw in b['wrong']:
            print(f"   WRONG row {n:g}: truth {v} got {got} [{st}]  {raw[:90]}")
        if b['missing']:
            print(f"   missing rows: {' '.join(f'{n:g}' for n in b['missing'])}")
    print(f'VERIFIED AND RIGHT {right}/{tot} = {right / tot:.0%}; verified but WRONG: {verified_wrong}')
