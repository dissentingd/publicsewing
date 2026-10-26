"""Blind-run an ЕМКО recipe, unchanged, on every other garment/size the pilot built.

Stage A uses only what the pilot transcribed (graded sizes straight from Table
1.4). Stage B adds the pilot's own assumptions. Stage C uses the data the
pipeline filled from the OCR'd tables (scripts/emko_fill_gaps.py, data/emko/).
Per garment it records whether the
pipeline stopped (and why), the gate results, and how far the recipe's points
land from the pilot's garment-adapted build.

Each garment runs the recipe for its kind (GARMENT_RECIPE), never one written
for it. usage: python scripts/emko_blind_run.py [A|B|C] > report.md
"""
import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from ccat import recipe as R               # noqa: E402
from ccat.checks import run_checks          # noqa: E402
from ccat.sources import emko               # noqa: E402

TABLE14 = emko.load(ROOT / 'pilot' / 'emko' / 'jacket_table14.yaml')
RECIPES = ROOT / 'recipes' / 'emko'
GARMENT_RECIPE = {'waistcoat': 'waistcoat.yaml'}      # everything else: sleeved torso garments
DEFAULT_RECIPE = 'jacket.yaml'
REF = json.loads((ROOT / 'tests' / 'fixtures' / 'pilot_garments_ref.json').read_text(encoding='utf-8'))


def source_data(name, r):
    if name.startswith('graded_'):
        return emko.inputs_from_graded_table(TABLE14, name[len('graded_'):])
    return emko.inputs_from_pilot_garment(emko.load(ROOT / r['yaml']))


def with_pilot_assumptions(data):
    data = dict(data)
    if 'r90' in data and 'r91' not in data:
        data['r91'] = data['r90'] / 2        # pilot: cuff_mid = cuff / 2 (Table 1.4 prints no row 91)
    data.setdefault('k81', 0.4)              # pilot default for к81 when the garment YAML gives none
    return data


def filled_data(name):
    if name.startswith('graded_'):
        rules = emko.load(ROOT / 'data' / 'emko' / 'jacket_graded.yaml')
        return emko.inputs_from_graded(rules, name[len('graded_'):], ROOT)
    return emko.inputs_from_garment(emko.load(ROOT / 'data' / 'emko' / f'{name}_176-100-88.yaml'))


def run(name, r, stage):
    recipe = R.load(RECIPES / GARMENT_RECIPE.get(name, DEFAULT_RECIPE))
    data = filled_data(name) if stage == 'C' else source_data(name, r)
    if stage == 'B':
        data = with_pilot_assumptions(data)
    row = {'name': name, 'garment': r['garment'], 'recipe': GARMENT_RECIPE.get(name, DEFAULT_RECIPE)}
    try:
        p = R.build(recipe, data)
        rep = run_checks(p, emko.PRINTED_STEP)
    except R.RecipeError as e:
        row['stopped'] = str(e)
        return row
    row['passed'] = rep.passed
    row['checks'] = [(c.id, c.measured, c.expected, c.passed, c.missing) for c in rep.results]
    common = [k for k in r['P'] if k in p.points]
    dev = sorted(((math.dist(p.points[k], r['P'][k]), k) for k in common), reverse=True)
    row['compared'] = len(common)
    row['worst'] = [(k, round(d, 3)) for d, k in dev[:5] if d > 1e-3]
    row['max_dev'] = dev[0][0] if dev else None
    return row


def report(stage):
    rows = [run(n, r, stage) for n, r in REF.items()]
    out = [f'# Blind run of the ЕМКО recipes, stage {stage} (recipes unchanged per garment)', '',
           'Stage A = pilot transcription only. B = plus the pilot\'s assumptions. '
           'C = data filled by the OCR pipeline (data/emko/).', '']
    for row in rows:
        out.append(f"## {row['name']} ({row['garment']}): `{row['recipe']}`")
        if 'stopped' in row:
            out += [f"- **STOPPED**: {row['stopped']}", '']
            continue
        out.append(f"- gate **{'PASS' if row['passed'] else 'FAIL'}**")
        for cid, m, e, ok, missing in row['checks']:
            if missing:
                out.append(f"  - N/A {cid}: unverified, data lacks {', '.join(missing)}")
            else:
                out.append(f"  - {'ok ' if ok else 'BAD'} {cid}: {m:.3f} vs {e:.3f} ({(m - e) / e * 100:+.2f}%)")
        out.append(f"- points vs the pilot's build: {row['compared']} compared, max deviation "
                   f"{row['max_dev']:.4f} cm" + (f"; worst {row['worst']}" if row['worst'] else ''))
        out.append('')
    return '\n'.join(out), rows


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')   # the report is Cyrillic; a cp1252 console redirect would crash
    print(report(sys.argv[1] if len(sys.argv) > 1 else 'A')[0])
