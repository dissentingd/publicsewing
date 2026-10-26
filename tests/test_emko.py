"""ЕМКО framework end to end. Oracle = the book's printed values (Table 1.2)."""
import copy
import json
from pathlib import Path

import pytest

from ccat import recipe as R
from ccat.__main__ import main
from ccat.checks import run_checks
from ccat.sources import emko

ROOT = Path(__file__).resolve().parents[1]
TABLE = ROOT / 'pilot' / 'emko' / 'jacket_176-100-88.yaml'
RECIPE = ROOT / 'recipes' / 'emko' / 'jacket_framework.yaml'


@pytest.fixture
def rows():
    return emko.load(TABLE)['rows']


def test_table_rows_satisfy_identities(rows):
    issues, checked, skipped = emko.validate_rows(rows)
    assert issues == []
    assert checked >= 4 * 28          # all 28 transcribed rows carry the full column set


def test_ocr_style_error_is_caught(rows):
    bad = copy.deepcopy(rows)
    bad[1]['draft'] = 155.0           # row 2: dropped decimal comma, 15,5 -> 155
    issues, _, _ = emko.validate_rows(bad)
    assert [(i.row, i.identity) for i in issues] == [(2, 'draft == base + p')]
    with pytest.raises(ValueError, match='row 2'):
        emko.inputs_from_rows(bad)


def test_framework_passes_gate(rows):
    p = R.build(R.load(RECIPE), emko.inputs_from_rows(rows))
    # Matches pilot/emko/FINDINGS.md: half-width 60.15, back length 77.35, levels 15.5/23.35/47.8/67.0
    assert p.points['37'][0] == pytest.approx(60.15)
    assert p.points['91'][1] == pytest.approx(77.35)
    assert [p.points[k][1] for k in ('21', '31', '41', '51')] == pytest.approx([15.5, 23.35, 47.8, 67.0])
    rep = run_checks(p)
    assert rep.passed, rep.text()


def test_misread_row_fails_gate(rows):
    data = emko.inputs_from_rows(rows)
    data['r8'] = 22.7                 # 1 cm off on row 8: 1.7% on the chest width
    rep = run_checks(R.build(R.load(RECIPE), data))
    assert not rep.passed and [f.id for f in rep.failures] == ['chest-width-row9']


def test_cli(tmp_path, capsys):
    out = tmp_path / 'report.json'
    code = main(['run', str(RECIPE), str(TABLE), '--source', 'emko-table',
                 '--svg', str(tmp_path / 'f.svg'), '--json', str(out)])
    assert code == 0
    assert json.loads(out.read_text(encoding='utf-8'))['passed'] is True
    assert (tmp_path / 'f.svg').read_text(encoding='utf-8').startswith('<svg')
    assert main(['run', str(RECIPE), str(TABLE)]) == 3       # plain data: inputs missing -> stopped
    assert 'STOPPED' in capsys.readouterr().err
