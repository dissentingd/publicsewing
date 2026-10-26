import pytest

from ccat.checks import GATE_REL, run_checks
from ccat.recipe import RecipeError, build


def pattern(checks, length=100.0):
    r = {'recipe': 'bar', 'inputs': ['L', 'printed'],
         'points': {'A': {'at': [0, 0]}, 'B': {'offset': {'from': 'A', 'dir': 'right', 'd': 'L'}},
                    'C': {'offset': {'from': 'A', 'dir': 'down', 'd': 'L'}}},
         'paths': {'ab': [{'line': ['A', 'B']}], 'ac': [{'line': ['A', 'C']}]},
         'checks': checks}
    return build(r, {'L': length, 'printed': 100.0})


def test_gate_is_one_percent():
    assert GATE_REL == 0.01
    ok = run_checks(pattern([{'id': 'len', 'measure': {'length': 'ab'}, 'expect': 'printed'}], length=100.99))
    assert ok.passed
    bad = run_checks(pattern([{'id': 'len', 'measure': {'length': 'ab'}, 'expect': 'printed'}], length=101.1))
    assert not bad.passed and bad.failures[0].id == 'len'
    assert bad.failures[0].rel == pytest.approx(0.011)


def test_measure_kinds_and_equal():
    rep = run_checks(pattern([
        {'id': 'd', 'measure': {'dist': ['A', 'B']}, 'expect': 100},
        {'id': 'v', 'measure': {'value': 'dist("A", "C") + 0'}, 'expect': 'printed'},
        {'id': 'seam', 'equal': ['ab', 'ac']},
    ]))
    assert rep.passed and len(rep.results) == 3


def test_zero_expected_uses_absolute_floor():
    rep = run_checks(pattern([{'id': 'z', 'measure': {'value': 'L - printed'}, 'expect': 0}], length=100.04))
    assert rep.passed and rep.results[0].absolute
    rep = run_checks(pattern([{'id': 'z', 'measure': {'value': 'L - printed'}, 'expect': 0}], length=100.06))
    assert not rep.passed


def test_tol_can_tighten_but_not_loosen():
    tight = run_checks(pattern([{'id': 't', 'measure': {'length': 'ab'}, 'expect': 'printed', 'tol': 0.002}],
                               length=100.5))
    assert not tight.passed
    with pytest.raises(RecipeError, match='cannot be loosened'):
        run_checks(pattern([{'id': 't', 'measure': {'length': 'ab'}, 'expect': 'printed', 'tol': 0.02}]))


def test_no_checks_never_passes_and_bad_checks_stop():
    assert not run_checks(pattern([])).passed
    with pytest.raises(RecipeError, match='duplicate'):
        run_checks(pattern([{'id': 'a', 'equal': ['ab', 'ac']}, {'id': 'a', 'equal': ['ab', 'ac']}]))
    with pytest.raises(RecipeError, match='measure \\+ expect'):
        run_checks(pattern([{'id': 'a', 'measure': {'length': 'ab'}}]))
    with pytest.raises(RecipeError, match='unknown path'):
        run_checks(pattern([{'id': 'a', 'equal': ['ab', 'nope']}]))


def test_missing_check_input_is_unverified_not_stopped():
    r = {'recipe': 'bar', 'inputs': ['L'], 'check_inputs': ['printed'],
         'points': {'A': {'at': [0, 0]}, 'B': {'offset': {'from': 'A', 'dir': 'right', 'd': 'L'}}},
         'paths': {'ab': [{'line': ['A', 'B']}]},
         'checks': [{'id': 'len', 'measure': {'length': 'ab'}, 'expect': 'printed'}]}
    rep = run_checks(build(r, {'L': 100.0}))                 # builds without 'printed'
    assert not rep.passed and rep.results[0].missing == ('printed',)
    assert 'unverified' in rep.text()
    assert run_checks(build(r, {'L': 100.0, 'printed': 100.0})).passed


def test_base_only_check_skips_on_another_size_but_never_passes_alone():
    r = {'recipe': 'bar', 'inputs': ['L'], 'check_inputs': ['printed'],
         'points': {'A': {'at': [0, 0]}, 'B': {'offset': {'from': 'A', 'dir': 'right', 'd': 'L'}}},
         'paths': {'ab': [{'line': ['A', 'B']}]},
         'checks': [{'id': 'base', 'measure': {'length': 'ab'}, 'expect': 'printed', 'base_only': True},
                    {'id': 'self', 'measure': {'length': 'ab'}, 'expect': 'L'}]}
    rep = run_checks(build(r, {'L': 90.0}))                  # another size: no printed base value
    assert rep.passed and rep.results[0].skipped and 'skip' in rep.text()
    assert rep.as_dict()['checks'][0]['skipped'] and not rep.results[0].by_floor   # serialises
    assert not run_checks(build(r, {'L': 90.0, 'printed': 100.0})).passed    # on the base size it still checks
    only = {**r, 'checks': r['checks'][:1]}
    assert not run_checks(build(only, {'L': 90.0})).passed   # skipped checks alone verify nothing
    rr = {**r, 'reports': [{'id': 'half', 'measure': {'value': '0.5 * printed'}}]}
    assert run_checks(build(rr, {'L': 90.0})).reports == []                     # left out on another size
    assert run_checks(build(rr, {'L': 90.0, 'printed': 100.0})).reports[0][1] == 50.0


# Printed-step floor: each check passes within max(1% relative, half the source's printed step).
QUARTER_INCH = 0.635        # cm


def small(checks, length):
    """A 14.6 cm (5 3/4 in) piece: here 1% (0.146 cm) is finer than a 1/4-inch source prints."""
    r = {'recipe': 'small', 'inputs': ['L', 'printed'],
         'points': {'A': {'at': [0, 0]}, 'B': {'offset': {'from': 'A', 'dir': 'right', 'd': 'L'}}},
         'paths': {'ab': [{'line': ['A', 'B']}]}, 'checks': checks}
    return build(r, {'L': length, 'printed': 14.605})


LEN = [{'id': 'len', 'measure': {'length': 'ab'}, 'expect': 'printed'}]


def test_no_step_keeps_strict_one_percent():
    rep = run_checks(small(LEN, 14.605 - 0.2))                # -1.4%, inside 1/8 inch
    assert not rep.passed and rep.results[0].floor == 0


def test_floor_is_half_the_printed_step():
    inside = run_checks(small(LEN, 14.605 - 0.31), QUARTER_INCH)    # -2.1%, within 0.3175 cm
    assert inside.passed and inside.results[0].by_floor
    outside = run_checks(small(LEN, 14.605 - 0.33), QUARTER_INCH)
    assert not outside.passed


def test_relative_limit_still_applies_on_long_dimensions():
    # 1% of 100 cm = 1 cm is wider than any allowed floor, so the floor changes nothing there
    assert run_checks(pattern(LEN, length=100.99), QUARTER_INCH).passed
    rep = run_checks(pattern(LEN, length=101.1), QUARTER_INCH)
    assert not rep.passed and not rep.results[0].by_floor


def test_floor_ignores_recipe_tol_but_tol_still_tightens_the_relative_part():
    c = [dict(LEN[0], tol=0.001)]
    assert run_checks(small(c, 14.605 - 0.2), QUARTER_INCH).passed           # floor is the source's
    assert not run_checks(pattern(c, length=100.5), QUARTER_INCH).passed     # 0.5% > tightened 0.1%


def test_zero_expected_uses_the_larger_absolute_floor():
    z = [{'id': 'z', 'measure': {'value': 'L - printed'}, 'expect': 0}]
    assert run_checks(small(z, 14.605 + 0.3), QUARTER_INCH).passed
    assert not run_checks(small(z, 14.605 + 0.3)).passed                    # ZERO_ABS 0.05 cm alone


@pytest.mark.parametrize('step', [0, -0.1, 0.7, True, '0.3'])
def test_bad_printed_step_stops(step):
    with pytest.raises(RecipeError, match='printed step'):
        run_checks(small(LEN, 14.605), step)


def test_report_states_the_floor():
    rep = run_checks(small(LEN, 14.605 - 0.31), QUARTER_INCH)
    assert 'half the printed step' in rep.text() and 'ok~' in rep.text()
    d = rep.as_dict()
    assert d['printed_step'] == QUARTER_INCH and d['checks'][0]['by_floor']


def test_emko_adapter_declares_its_step():
    from ccat.__main__ import PRINTED_STEP
    from ccat.sources import emko
    assert emko.PRINTED_STEP == 0.05
    assert PRINTED_STEP['emko-table'] == PRINTED_STEP['emko-garment'] == emko.PRINTED_STEP
    assert PRINTED_STEP['plain'] is None
