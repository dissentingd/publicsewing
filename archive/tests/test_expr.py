import pytest

from ccat.expr import ExprError, evaluate, names


def test_arithmetic_and_cyrillic_names():
    env = {'Т40': 45.5, 'П': 2.31}
    assert evaluate('Т40+П', env.__getitem__) == pytest.approx(47.81)
    assert evaluate('0.885*ДОР*sqrt(0.25-(ШОР/ДОР)**2)', {'ДОР': 59.15, 'ШОР': 21.1}.__getitem__) == \
        pytest.approx(18.35, abs=0.02)   # ЕМКО row 72, suit jacket ВОР


def test_unknown_name_and_bad_syntax():
    with pytest.raises(ExprError, match='unknown name'):
        evaluate('a + b', {'a': 1}.__getitem__)
    for bad in ('__import__("os")', 'a.b', 'lambda: 1', '[1]', 'a if a else 1', 'True + 1', '"x"'):
        with pytest.raises(ExprError):
            evaluate(bad, {'a': 1}.__getitem__)


def test_point_functions_take_quoted_names():
    pf = {'dist': lambda a, b: 3.0 if (a, b) == ('11', '91') else 0.0}
    assert evaluate('dist("11", "91") * 2', {}.__getitem__, pf) == 6.0
    with pytest.raises(ExprError):
        evaluate('dist(a, "91")', {'a': 1}.__getitem__, pf)


def test_names_excludes_functions():
    assert names('sqrt(x) + y*2') == {'x', 'y'}
    assert names(3.5) == set()
