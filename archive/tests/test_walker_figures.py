"""The Walker figure reader (ccat.figread): its precision on the cached pages (p. 235 against the
night-shirt's hand transcription, p. 236 against an eye check), its word rules on stand-in glyphs,
and, in the tools image, a fresh read of p. 235 against the cache."""
import shutil
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[1]
TRACE = ROOT / 'data' / 'walker' / 'trace'
NEAR = 0.75                      # in: a reading's place to where the figure is printed


def cached(page):
    return yaml.safe_load((TRACE / f'p-{page}.yaml').read_text(encoding='utf-8'))


def figures(doc, field=0):
    return doc['fields'][field]['figures']


def check(readings, expect):
    """Every reading is an expected figure at its place, with its value (precision); → the expected
    places read."""
    found = set()
    for f in readings:
        hits = [k for k, (v, x, y) in enumerate(expect)
                if abs(f['at'][0] - x) <= NEAR and abs(f['at'][1] - y) <= NEAR]
        assert len(hits) == 1, f'reading {f} at no (or several) printed figure(s)'
        assert f['value'] == expect[hits[0]][0], f'{f} misread: printed {expect[hits[0]][0]}'
        found.add(hits[0])
    return found


def test_p235_reads_the_night_shirt_figures_and_nothing_else():
    """The night-shirt's figures as transcribed by hand (data/walker/nightshirt.yaml), each at the
    places it is printed (inches from A; above the field is y < 0). The reader must read each of
    them at least once, and nothing that isn't one of them."""
    f = yaml.safe_load((ROOT / 'data' / 'walker' / 'nightshirt.yaml').read_text(encoding='utf-8'))['figures']['body']
    printed = {                                          # figure → where it is printed
        'shoulder_x': [(3, -0.6), (31, -0.6)], 'neck_x': [(12, -0.5), (22, -0.5)],
        'shoulder_y': [(2.4, 1.6), (31.6, 1.5)], 'neck_depth': [(16, 2.3)],
        'armhole': [(-0.6, 9.6), (34.5, 9.6)], 'vent': [(-0.6, 35.6), (34.7, 35.6)],
        'hem_x': [(4.9, 49.4), (29, 49.5)], 'opening': [(15.9, 17.5)],
        'front': [(17.7, 22.6)], 'back': [(17.5, 24.5)],
    }
    value = {k: f[k] for k in printed if k in f}
    value['front'] = [f['front_length'], f['front_width']]
    value['back'] = [f['back_length'], f['back_width']]
    expect, owner = [], []
    for k, places in printed.items():
        for x, y in places:
            expect.append((value[k], x, y))
            owner.append(k)
    doc = cached(235)
    found = check(figures(doc), expect)
    assert {owner[k] for k in found} == set(printed)                 # every figure read somewhere
    assert len(found) == len(expect) - 1                             # all but the 5 by D
    assert doc['fields'][0]['unread'] == []
    # not read: the front opening's hems, printed in a sideways caption ("Hem for right side =
    # 1 inch"), which the reader doesn't attempt; nightshirt.yaml keeps them transcribed
    assert {'opening_hem_right', 'opening_hem_left'} <= set(f) - set(printed) - {
        'front_length', 'front_width', 'back_length', 'back_width'}


# p. 236 (sleeves, wrist-bands, yokes, collars), checked by eye against the page, 2026-10-22:
# field → [(value, x, y)] for every figure read (all are right); the unread ones are the ¾/¼
# figures and those run through by a line.
P236 = {
    0: [(21, 21.0, -0.5), (7, 7.0, -0.5), (9, 8.9, -0.5), (23, 23.1, -0.5), (2, 36.3, 1.7),
        (4.5, 21.8, 4.2), (23, 16.6, 11.4), (4.5, 15.9, 18.1), (2, -0.5, 20.7), (9, 27.1, 23.3),
        (7, 29.1, 23.4), (23, 13.4, 23.4)],
    2: [(2.5, 2.8, -0.5), (2.5, 8.5, -0.5), (3.5, 6.5, 7.2), (0.5, 6.6, 10.3), (0.5, 6.7, 11.7),
        (3.5, 6.6, 14.5), (2.5, 8.6, 22.4), (2.5, 2.6, 22.5)],
    4: [(3, 0.5, 5.6), (3, 0.5, 11.7), (3, 9.5, 11.7), (1.5, 2.3, 16.1)],
    5: [(3, 5.3, 5.7), (3, -0.3, 5.7), (1.5, 1.2, 18.4)],
}


def test_p236_readings_are_all_right():
    doc = cached(236)
    for k, field in enumerate(doc['fields']):
        expect = P236.get(k, [])
        assert len(check(field['figures'], expect)) == len(expect)
    # "23 x 36": its x is under a pattern line, and its 6 run through by a grid line; the 3 of 36
    # is reported, not read as a 3
    assert any(u['text'] == '3' and 'too big' in u['why'] for u in doc['fields'][0]['unread'])


# ---- word rules, on stand-in glyphs (numpy only)

def glyph(x, c, st='fig', h=20, w=12, y=100, fc=None, fd=0.5, fm=0.3):
    return {'box': (x, y, x + w, y + h), 'mask': None, 'core': None, 'damaged': False,
            'k': {'c': c, 'st': st, 'fc': fc or c, 'fd': fd, 'fm': fm}}


class Stub:
    def classify(self, g, px):
        return dict(g['k'])


def read(gl, px=38.0):
    pytest.importorskip('numpy')
    from ccat import figread
    return figread.read(gl, px, Stub())


def test_value_parses_whole_numbers_and_a_last_fraction():
    pytest.importorskip('numpy')
    from ccat.figread import value
    assert value('12') == 12 and value('1½') == 1.5 and value('½') == 0.5 and value('3¾') == 3.75
    assert value('½1') is None and value('1x2') is None and value('') is None


def test_cloth_sizes_join_across_the_x():
    figs, unread = read([glyph(0, '4'), glyph(13, '7'), glyph(40, 'x'), glyph(70, '3'), glyph(83, '4')])
    assert [f['value'] for f in figs] == [[47, 34]] and not unread
    figs, _ = read([glyph(0, '4'), glyph(13, '7'), glyph(27, 'x'), glyph(60, '3'), glyph(73, '4')])
    assert [f['text'] for f in figs] == ['47 x 34']                  # "47x 34"


def test_a_lone_one_is_reported_not_read():
    figs, unread = read([glyph(0, '1')])
    assert not figs and unread[0]['text'] == '1'


def test_unsure_or_junk_beside_figures_fails_closed():
    figs, unread = read([glyph(0, '1'), glyph(13, '7', st='unsure')])
    assert not figs and unread[0]['text'] == '17'
    figs, unread = read([glyph(0, '3'), glyph(13, '6'), glyph(26, '.', st='junk')])
    assert not figs and unread                                       # "36?": not 36
    figs, unread = read([glyph(0, '.', st='junk'), glyph(13, '.', st='junk'), glyph(26, '5')])
    assert not figs and not unread                                   # a word of text


def test_a_figure_beside_an_oversized_mark_is_reported():
    big = {'box': (13, 90, 25, 140), 'mask': None, 'core': None, 'damaged': False}
    figs, unread = read([glyph(0, '3'), big])
    assert not figs and 'too big' in unread[0]['why']


def test_zero_and_one_read_by_their_neighbours():
    """An O-like or I-like glyph beside a figure glyph reads as the figure class it is nearest."""
    figs, _ = read([glyph(0, '.', st='junk', fc='1', fd=0.42, fm=0.2), glyph(13, '0')])
    assert [f['value'] for f in figs] == [10]
    figs, unread = read([glyph(0, '.', st='junk', fc='1', fd=0.42, fm=0.02), glyph(13, '0')])
    assert not figs                                                  # too near another class


@pytest.mark.skipif(shutil.which('pdfimages') is None or not (ROOT / 'corpus' / 'krl00366374' / 'krl00366374.pdf').exists(),
                    reason='needs the tools image and the corpus PDF')
def test_p235_fresh_read_matches_the_cache():
    pytest.importorskip('cv2')
    from ccat import figread, grid
    pg = grid.prepare(str(ROOT / 'corpus' / 'krl00366374' / 'krl00366374.pdf'), 253)
    text, damage = grid.text_ink(pg['ink'], pg['px'], pg['phx'], pg['py'], pg['phy'])
    figs, unread = figread.read(grid.glyphs(text, pg['px'], damage), pg['px'],
                                figread.Model.load(ROOT / 'data' / 'walker' / 'glyphs' / 'protos.npz'))
    a = cached(235)['fields'][0]['corner_a_px']
    got = sorted((f['text'], round((f['box'][0] + f['box'][2]) / 2 - a[0])) for f in figs)
    want = sorted((f['text'], round(f['at'][0] * pg['px'])) for f in figures(cached(235)))
    assert [t for t, _ in got] == [t for t, _ in want]
    assert all(abs(g - w) <= 1 for (_, g), (_, w) in zip(got, want))
