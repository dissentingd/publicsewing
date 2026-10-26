"""ЕМКО OCR reader on the stored OCR text (data/emko/ocr/, made in the tools image).

Ground truth = the pilot's validated transcriptions. The non-negotiable property
is precision: no row the reader marks verified may be wrong.
"""
import sys
from pathlib import Path

import pytest

from ccat.sources import emko, emko_ocr

ROOT = Path(__file__).resolve().parents[1]

# The page OCR (data/emko/ocr/p-*.txt) is verbatim text of an in-copyright book and isn't in the
# repo; regenerate it with scripts/emko_ocr_pages.py in the tools image to run these.
needs_ocr = pytest.mark.skipif(not any((ROOT / 'data' / 'emko' / 'ocr').glob('p-*.txt')),
                               reason='ЕМКО page OCR not in the repo (copyright)')
sys.path.insert(0, str(ROOT / 'scripts'))
import emko_ocr_bench as bench          # noqa: E402
import emko_fill_gaps as fill           # noqa: E402


@needs_ocr
def test_no_verified_row_is_wrong_and_coverage_holds():
    verified_right = 0
    for t in bench.TABLES:
        b = bench.bench(t)
        assert not [w for w in b['wrong'] if w[3] in ('ok', 'repaired', 'aligned', 'formula')], t
        verified_right += b['right']
    assert verified_right >= 110           # 2026-10-19 baseline (formula + Т## checks); raise it as the reader improves


@needs_ocr
@pytest.mark.parametrize('table, expected', [('1.2', 60.15), ('2.2', 63.5), ('3.2', 64.6), ('4.2', 61.65),
                                             ('5.2', 64.55), ('6.2', 56.2)])
def test_row9_verified_in_every_table(table, expected):
    rows, by_n = fill.table_rows(table)
    assert by_n[9]['status'] in ('ok', 'repaired', 'aligned')
    assert by_n[9]['cells']['draft'] == pytest.approx(expected)


@needs_ocr
@pytest.mark.parametrize('table, expected', [('1.2', 0.4), ('2.2', 0.25), ('3.2', 0.0), ('4.2', 0.0), ('5.2', 0.0)])
def test_k81_as_the_table_states_it(table, expected):
    rows, _ = fill.table_rows(table)
    assert emko_ocr.k81(rows)[0] == expected


def test_k81_unresolved_without_evidence():
    rows = emko_ocr.parse_lines(['80 13—131 0,25/333—13/', '83 R 344—345 344—342'])
    assert emko_ocr.k81(rows)[0] is None


def test_repair_only_when_unique():
    w = 8
    good = ['74,6', '1,2', '0,4', '1,6', '76,2', '1,14', '2,74', '77,35']
    row = {'tail': [(t, emko_ocr.to_number(t)) for t in good]}
    assert emko_ocr.resolve(row, w)[1] == 'ok'
    bad = list(good)
    bad[7] = '7735'                                   # dropped decimal comma in the draft column
    cells, status, how = emko_ocr.resolve({'tail': [(t, emko_ocr.to_number(t)) for t in bad]}, w)
    assert status == 'repaired' and cells['draft'] == pytest.approx(77.35)
    bad[0] = '99'                                      # two broken cells: no single-cell repair
    assert emko_ocr.resolve({'tail': [(t, emko_ocr.to_number(t)) for t in bad]}, w)[1] == 'invalid'


@needs_ocr
def test_row91_formula_parsed_from_table_1_2():
    _, by_n = fill.table_rows('1.2')
    assert fill.scale_formula(by_n, 91) == (0.5, 90)


def test_graded_inputs_use_base_table_rules():
    rules = emko.load(ROOT / 'data' / 'emko' / 'jacket_graded.yaml')
    d = emko.inputs_from_graded(rules, '176-92-74', ROOT)
    assert d['r91'] == pytest.approx(d['r90'] / 2) and d['k81'] == 0.4 and d['r9'] == 56.15


# ---------------- formula verification (constructive rows) ----------------
from ccat.sources import emko_formula       # noqa: E402


def table(lines):
    return emko_ocr.read_table(lines)[0]


def status(rows, n):
    return next(r for r in rows if r['n'] == n)


def test_scaled_segment_with_note():
    rows = table(['7 33—35 757+ П 12,4 2,6 0,85 3,45 15,85 0,16 3,6 16,0',
                  '17 331—341 0,62/33—35/ + a17 9,9 a17 = 0',            # 0.62·16.0 + 0 = 9.92
                  '18 351—346 0,38/33—35/ — a18 51 a18 = 1,0'])          # 0.38·16 − 1 = 5.08; read "51"
    assert status(rows, 17)['status'] == 'formula' and status(rows, 17)['cells']['draft'] == 9.9
    r18 = status(rows, 18)
    assert r18['status'] == 'formula' and r18['cells']['draft'] == 5.1    # dropped comma repaired by the rule


def test_formula_needs_a_verified_source_row():
    rows = table(['17 331—341 0,62/33—35/ + a17 9,9 a17 = 0'])          # row 7 absent
    assert status(rows, 17)['status'] == 'draft-only'


def test_formula_rejects_a_mismatch():
    rows = table(['7 33—35 757+ П 12,4 2,6 0,85 3,45 15,85 0,16 3,6 16,0',
                  '17 331—341 0,62/33—35/ + a17 9,5 a17 = 0'])
    assert status(rows, 17)['status'] == 'draft-only'


def test_armhole_trio_confirms_DP_POR_DOR_and_rejects_three_decimals():
    rows = table(['63.1 ДП 0,95 Т38+ 55,3', '63.2 ПОР Н·ДП 3,85 H=0,07', '63.3 ДОР (1+Н) ДП 59,158'])
    got = {r['n']: (r['status'], r['cells'].get('draft')) for r in rows}
    assert got == {63.1: ('formula', 55.3), 63.2: ('formula', 3.85), 63.3: ('formula', 59.15)}


# ---------------- Т## measurements (pooled across tables for one figure) ----------------
from ccat.sources import emko_tsolve        # noqa: E402


def test_normalise_ocr_formulas():
    assert emko_tsolve.normalise('740+ (Т7—Т12)+П') == 'T40+(T7-T12)'
    assert emko_tsolve.normalise('0,3 740411') == '0.3*T40'
    assert emko_tsolve.normalise('0,62/33—35/ + a17') is None          # segment rule, not Т
    assert emko_tsolve.linear('0.65*(T7-T12)') == ({'T7': 0.65, 'T12': -0.65}, 0.0)


@needs_ocr
def test_pooled_figure_matches_the_size_label():
    tables = bench.read_all()
    fit = emko_tsolve.solve_pooled([(r, w) for rows, w in tables.values() for r in rows])
    waist = emko_tsolve.predict(fit, ({'T18': 1.0}, 0.0))
    assert waist == pytest.approx(88.0, abs=0.06)                       # РАЗМЕР 176-100-88: waist 88
    # the pilot's own least-squares fit (pilot/emko/FINDINGS.md) gave the same values
    assert emko_tsolve.predict(fit, ({'T47': 1.0}, 0.0)) == pytest.approx(40.7, abs=0.06)
    assert emko_tsolve.predict(fit, ({'T57': 1.0}, 0.0)) == pytest.approx(12.4, abs=0.06)
    # T7 and T12 only ever appear together and in too few verified rows: no prediction
    assert emko_tsolve.predict(fit, ({'T7': 1.0, 'T12': -1.0}, 0.0)) is None


@needs_ocr
def test_t_prediction_settles_a_misread_row_and_rejects_a_misparsed_formula():
    rows = {r['n']: r for r in bench.read_all()['4.2'][0]}
    r6 = rows[6]                                                        # ПП read 9,55 for 2,55
    assert r6['status'] == 'formula' and r6['cells']['draft'] == 22.9 and r6['cells']['p'] == pytest.approx(2.55)
    r54 = {r['n']: r for r in bench.read_all()['5.2'][0]}[54]            # Т13 read as Т18: no match
    assert r54['status'] != 'formula'
