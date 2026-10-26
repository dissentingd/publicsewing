"""catalog_build: graded ИМК entries (one per typical figure) and the id checks."""
import importlib.util
from pathlib import Path

import pytest

from ccat import recipe as R
from ccat.checks import run_checks
from ccat.sources import emko

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('cb', ROOT / 'scripts' / 'catalog_build.py')
cb = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cb)
ENTRY = {'id': 'jk', 'recipe': 'recipes/emko/jacket_imk.yaml',
         'data': {'graded': 'data/emko/jacket_graded.yaml', 'model': 'data/emko/jacket_176-100-88.yaml', 'figures': 'all'}}


def test_figures_expand_to_one_entry_each():
    es = cb.expand({}, ENTRY)
    assert [e['id'] for e in es][:2] == ['jk-176-92-74', 'jk-176-100-82'] and len(es) == 8
    assert all('figures' not in e['data'] and e['data']['figure'] for e in es)


def test_graded_imk_takes_model_rows_without_base_only_values():
    e = cb.expand({}, ENTRY)[0]
    rec = R.load(ROOT / e['recipe'])
    data, name, size, _ = cb.load_data(e['data'], rec)
    assert name == 'jacket 176-92-74' and size == '176-92-74'
    assert data['m21'] == 87 and 'm9' not in data and data['k81'] == 0.4     # ИМК row in, printed d_т out
    rep = run_checks(R.build(rec, data), emko.PRINTED_STEP)
    assert rep.passed and [r.id for r in rep.results if r.skipped] == ['d_t-row9']


def test_duplicate_ids_stop(tmp_path):
    cfg = tmp_path / 'c.yaml'
    cfg.write_text('entries:\n  - {id: a, recipe: x, data: {garment: y}}\n  - {id: a, recipe: x, data: {garment: y}}\n',
                   encoding='utf-8')
    assert cb.main([str(cfg.relative_to(ROOT)) if cfg.is_relative_to(ROOT) else str(cfg)]) == 3
