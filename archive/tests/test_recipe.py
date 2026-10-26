import math

import pytest
import yaml

from ccat.recipe import RecipeError, build, load

SQUARE = {
    'recipe': 'square',
    'inputs': ['s'],
    'values': {'half': 's / 2'},
    'points': {
        'A': {'at': [0, 0]},
        'B': {'offset': {'from': 'A', 'dir': 'right', 'd': 's'}},
        'C': {'offset': {'from': 'B', 'dir': 'down', 'd': 's'}},
        'D': {'offset': {'from': 'A', 'dir': 'down', 'd': 's'}},
        'M': {'ratio': {'from': 'A', 'to': 'C', 't': 0.5}, 'interp': 'centre by eye'},
    },
    'paths': {'top': [{'line': ['A', 'B']}]},
    'pieces': {'sq': {'outline': [{'path': 'top'}, {'polyline': ['B', 'C', 'D', 'A']}]}},
}


def with_points(**pts):
    r = {'recipe': 't', 'inputs': [], 'points': {'O': {'at': [0, 0]}, 'X': {'at': [10, 0]}, **pts}}
    return r


def test_square_builds():
    p = build(SQUARE, {'s': 4})
    assert p.points['C'] == (4, 4)
    assert p.values['half'] == 2
    assert p.length('piece:sq') == pytest.approx(16)
    assert p.interps == [('M', 'centre by eye')]


@pytest.mark.parametrize('change, match', [
    (lambda r: r.update(extra=1), 'unknown top-level'),
    (lambda r: r['points'].update(Z={'teleport': {}}), 'exactly one op'),
    (lambda r: r['points'].update(Z={'offset': {'from': 'A', 'dir': 'down'}}), 'needs'),
    (lambda r: r['points'].update(Z={'offset': {'from': 'A', 'dir': 'sideways', 'd': 1}}), 'unknown direction'),
    (lambda r: r['points'].update(Z={'offset': {'from': 'Q', 'dir': 'down', 'd': 1}}), 'unknown point'),
    (lambda r: r['points'].update(Z={'offset': {'from': 'A', 'dir': 'down', 'd': 'nope'}}), 'unknown name'),
    (lambda r: r['pieces'].update(open={'outline': [{'line': ['A', 'B']}]}), 'not closed'),
    (lambda r: r['pieces'].update(gap={'outline': [{'line': ['A', 'B']}, {'line': ['C', 'D']}]}), 'starts'),
])
def test_fails_closed(change, match):
    import copy
    r = copy.deepcopy(SQUARE)
    change(r)
    with pytest.raises(RecipeError, match=match):
        build(r, {'s': 4})


def test_missing_input():
    with pytest.raises(RecipeError, match='missing inputs'):
        build(SQUARE, {})


def test_cycle_detected():
    r = with_points(P={'offset': {'from': 'Q', 'dir': 'down', 'd': 1}},
                    Q={'offset': {'from': 'P', 'dir': 'down', 'd': 1}})
    with pytest.raises(RecipeError, match='circular'):
        build(r, {})


def test_two_intersections_need_a_pick():
    circ = {'circle_line': {'center': 'O', 'r': 12, 'line': {'from': 'X', 'dir': 'up'}}}
    with pytest.raises(RecipeError, match='no pick'):
        build(with_points(P=circ), {})
    circ_cc = {'c1': 'O', 'r1': 6, 'c2': 'X', 'r2': 6}
    for pick, y in (('upper', -1), ('lower', 1)):
        p = build(with_points(P={'circle_circle': {**circ_cc, 'pick': pick}}), {})
        assert p.points['P'][0] == pytest.approx(5) and math.copysign(1, p.points['P'][1]) == y
    with pytest.raises(RecipeError, match='cannot separate'):
        build(with_points(P={'circle_circle': {**circ_cc, 'pick': 'left'}}), {})
    with pytest.raises(RecipeError, match='no intersection'):
        build(with_points(P={'circle_circle': {'c1': 'O', 'r1': 1, 'c2': 'X', 'r2': 1, 'pick': 'upper'}}), {})


def test_circle_line_forward_and_near():
    line = {'from': 'X', 'dir': 'left'}      # runs from x=10 toward x=0
    p = build(with_points(F={'circle_line': {'center': 'O', 'r': 5, 'line': line, 'pick': 'forward'}},
                          N={'circle_line': {'center': 'O', 'r': 5, 'line': line, 'pick': {'near': 'X'}}}), {})
    assert p.points['F'] == pytest.approx((-5, 0))
    assert p.points['N'] == pytest.approx((5, 0))


def test_other_ops():
    p = build(with_points(
        Y={'offset': {'from': 'O', 'dir': 'down', 'd': 10}},
        L={'line_x': {'a': ['O', 'X'], 'b': {'from': 'Y', 'dir': {'deg': -45}}}},
        F={'perp_foot': {'from': 'Y', 'line': ['O', 'X']}},
        R={'rotate': {'point': 'X', 'about': 'O', 'deg': 90}},
        M={'mirror': {'point': 'Y', 'line': ['O', 'X']}},
        P={'project': {'x_of': 'X', 'y_of': 'Y'}},
        T={'at_y': {'line': ['Y', 'L'], 'y': 5}},
        U={'at_x': {'line': ['Y', 'L'], 'x_of': 'A'}},
        A={'along': {'from': 'O', 'to': 'X', 'd': 'dist("O", "Y") / 2'}},
        Q={'offset': {'from': 'O', 'dir': {'perp': ['O', 'X']}, 'd': 2}},
    ), {})
    pts = p.points
    assert pts['L'] == pytest.approx((10, 0))
    assert pts['F'] == pytest.approx((0, 0))
    assert pts['R'] == pytest.approx((0, 10))
    assert pts['M'] == pytest.approx((0, -10))
    assert pts['P'] == pytest.approx((10, 10))
    assert pts['A'] == pytest.approx((5, 0))
    assert pts['Q'] == pytest.approx((0, 2))
    assert pts['T'] == pytest.approx((5, 5))
    assert pts['U'] == pytest.approx((5, 5))
    with pytest.raises(RecipeError, match='parallel'):
        build(with_points(T={'at_y': {'line': ['O', 'X'], 'y': 3}}), {})


def test_arc_segment_and_reverse_path():
    r = with_points(Y={'at': [0, 10]})
    r['paths'] = {'quarter': [{'arc': {'center': 'O', 'from': 'X', 'to': 'Y'}}],
                  'back': [{'path': {'name': 'quarter', 'reverse': True}}]}
    p = build(r, {})
    assert p.length('quarter') == pytest.approx(5 * math.pi, rel=1e-3)
    assert p.paths['back'][0] == (0, 10)
    r['points']['Y'] = {'at': [0, 11]}
    with pytest.raises(RecipeError, match='off the circle'):
        build(r, {})


def test_drop_checks_removes_a_base_check_and_fails_closed(tmp_path):
    base = {'recipe': 'b', 'inputs': ['L'], 'points': {'A': {'at': [0, 0]}},
            'checks': [{'id': 'keep', 'measure': {'value': 'L'}, 'expect': 1},
                       {'id': 'gone', 'measure': {'value': 'L'}, 'expect': 2}]}
    (tmp_path / 'base.yaml').write_text(yaml.safe_dump(base), encoding='utf-8')
    (tmp_path / 'g.yaml').write_text('extends: base.yaml\nrecipe: g\ndrop_checks: [gone]\n', encoding='utf-8')
    assert [c['id'] for c in load(tmp_path / 'g.yaml')['checks']] == ['keep']
    (tmp_path / 'bad.yaml').write_text('extends: base.yaml\nrecipe: x\ndrop_checks: [nope]\n', encoding='utf-8')
    with pytest.raises(RecipeError, match='drops checks its base does not have'):
        load(tmp_path / 'bad.yaml')
    (tmp_path / 'solo.yaml').write_text('recipe: s\ndrop_checks: [keep]\n', encoding='utf-8')
    with pytest.raises(RecipeError, match='drop_checks needs extends'):
        load(tmp_path / 'solo.yaml')


def test_export_specs_may_be_overridden_by_a_garment(tmp_path):
    (tmp_path / 'base.yaml').write_text(yaml.safe_dump(
        {'recipe': 'b', 'points': {'A': {'at': [0, 0]}}, 'export': {'p': {'cut': 2, 'grain': 'vertical'}}}),
        encoding='utf-8')
    (tmp_path / 'g.yaml').write_text(yaml.safe_dump(
        {'extends': 'base.yaml', 'recipe': 'g', 'export': {'p': {'omit': True}, 'q': {'cut': 1, 'grain': 'vertical'}}}),
        encoding='utf-8')
    assert load(tmp_path / 'g.yaml')['export'] == {'p': {'omit': True}, 'q': {'cut': 1, 'grain': 'vertical'}}
