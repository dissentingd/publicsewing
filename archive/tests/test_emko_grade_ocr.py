"""ЕМКО graded-table reader (scripts/emko_grade_ocr.py) on the stored OCR text and row re-OCR cache.

Ground truth = the pilot's hand-checked Table 1.4 (pilot/emko/jacket_table14.yaml). As for the
Table x.2 reader, the property that matters is precision: no row it accepts may be wrong.
"""
import sys
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[1]

# The page OCR (data/emko/ocr/p-*.txt) is verbatim text of an in-copyright book and isn't in the
# repo; regenerate it with scripts/emko_ocr_pages.py in the tools image to run these.
needs_ocr = pytest.mark.skipif(not any((ROOT / 'data' / 'emko' / 'ocr').glob('p-*.txt')),
                               reason='ЕМКО page OCR not in the repo (copyright)')
sys.path.insert(0, str(ROOT / 'scripts'))
import emko_grade_ocr as G              # noqa: E402


@needs_ocr
def test_no_accepted_row_of_table_1_4_is_wrong(monkeypatch):
    monkeypatch.setitem(G.TABLES, '1.4', ((18, 22), 'jacket'))
    _, rows, _, _ = G.read_table('1.4')
    doc = yaml.safe_load((ROOT / 'pilot/emko/jacket_table14.yaml').read_text(encoding='utf-8'))
    ref = {float(k): v for k, v in (doc.get('rows') or doc).items() if isinstance(v, list)}
    checked = [n for n in rows if float(n) in ref]
    # a held cell (None) stops that figure's build, so it can't be wrong; every value given must be right
    assert not [n for n in checked if any(a is not None and abs(a - b) > 1e-6 for a, b in zip(rows[n], ref[float(n)]))]
    assert len(checked) >= 35               # 2026-10-22 baseline; raise it as the reader improves
    assert sum(v is None for n in checked for v in rows[n]) <= 3


@needs_ocr
def test_header_line_is_not_a_row():
    # Table 2.4's header ("25 Отрезок Формула 92 | 100 | …") was once read as row 25, shifting the sequence
    _, rows, _, _ = G.read_table('2.4')
    assert len(rows) >= 58
    assert G.CHEST not in rows.values() and G.WAIST not in rows.values()
    assert rows[25] == [1.5] * 8


@needs_ocr
def test_misnumbered_row_dropped_when_a_confirmed_row_follows():
    # Table 4.4 row 63.2 reads as "68.2"; Table 4.2 has neither, and confirmed 63.3 follows it
    _, rows, log, _ = G.read_table('4.4')
    assert 68.2 not in rows and 63.3 in rows
    assert any(l.startswith('held row 68.2: number out of sequence') for l in log)


def test_values_off_the_printed_grid_are_misreads():
    assert G.on_grid([16.6, 16.9, 16.95, 17.0])
    assert not G.on_grid([9.3, 9.38])
    base = [63.15, 62.75, 63.25, 63.75, 64.25, 62.65, 63.15, 63.65]
    assert G.fits(base, 63.25)
    assert not G.fits(base[:4] + [64.28] + base[5:], 63.25)      # fits within FIT_TOL, but off the grid


def test_angle_rows_grade_in_steps_by_chest():
    assert G.by_chest([7.25] * 5 + [8.75] * 3, 7.25)
    assert not G.by_chest([7.25] * 5 + [8.75] * 3, 9.0)            # base column must match Table x.2
    assert not G.by_chest([7.25, 7.25, 7.5, 7.25, 7.25, 8.75, 8.75, 8.75], None)   # unequal at equal chest
    assert not G.by_chest([9.0] * 5 + [8.75] * 3, None)            # decreasing in chest


def test_reocr_forms():
    assert {68.0, 6.8} <= G.reocr_forms('680')
    assert 68.0 in G.reocr_forms('1680')                           # ruled column line read as '1'
    assert 68.0 in G.reocr_forms('68. ,')
    assert G.reocr_forms('-') == {0.0}                             # dash-only cell = 0


@needs_ocr
def test_reocr_recovers_rows_page_ocr_held():
    for table, n in (('3.4', 90), ('4.4', 8), ('6.4', 29)):
        _, rows, log, _ = G.read_table(table)
        assert n in rows, table
        assert any(l.startswith(f'row {n}: re-OCR') for l in log), table
    _, rows, _, _ = G.read_table('4.4')
    assert rows[8] == [20.45, 21.75, 22.2, 22.65, 23.1, 24.15, 24.6, 25.05]    # page OCR: "120,45"


def test_zero_stands_where_the_formula_goes_negative():
    # Table 6.4 row 44 as printed: 0 where the linear fit of the other seven gives about −0.13
    row = [0.0, 0.5, 1.5, 2.5, 3.5, 2.45, 3.45, 4.45]
    assert G.fits(row, 1.5)
    assert not G.fits([0.5] + row[1:], 1.5)                        # a positive misread isn't excused


def test_one_cell_off_trend_is_held_not_guessed():
    # Table 5.4 row 72 as printed: the 176-112-112 column (20.4) is off the row's trend
    row = [18.25, 18.4, 18.3, 18.15, 18.0, 18.5, 18.35, 20.4]
    vals, how = G.unique_fit(row, [[]] * 8, 18.3, [str(v) for v in row])
    assert vals == row[:7] + [None] and how.startswith('cell held')


def test_held_cell_leaves_that_figure_without_the_row():
    from ccat.sources import emko
    doc = {'figures': ['a', 'b'], 'rows': {72: [18.25, None], 71: [22.3, 22.7]}}
    assert emko.inputs_from_graded_table(doc, 'a') == {'r72': 18.25, 'r71': 22.3}
    assert emko.inputs_from_graded_table(doc, 'b') == {'r71': 22.7}


@needs_ocr
def test_a_close_vote_between_two_fitting_values_is_held():
    # Table 6.4 row 44, last cell: printed 4,45; re-read as 4,40 ×6 (separator: weight 2) and 445 ×8
    top, _, rival = G.reocr_candidates({'4,40': 6, '445': 8}, 1.5)
    assert {top, rival} == {4.4, 4.45}
    row = [0.0, 0.5, 1.5, 2.5, 3.5, 2.45, 3.45, top]
    vals, how = G.settle_rivals(row, 'ok', row, [None] * 7 + [rival], 1.5, None)
    assert vals[7] is None and 'cannot tell' in how
    _, rows, _, _ = G.read_table('6.4')
    assert rows[44][7] is None
