"""Build a GarmentCode pattern specification from drafted outlines, for a 3D drape.

usage: python tools/drape_spec.py <outlines.json> <drape config.yaml> <out dir> <name> [--back <piece>]

<outlines.json> comes from tools/drape-export.mjs; the config (drape/*.yaml) says what sews to
what and where each piece sits on the body. Writes <out dir>/<name>/<name>_specification.json,
then drape it with docker/ccat_sim.py in the garmentcode container (designs/drape/README.md,
or tools/drape.mjs for the whole run). The seam stitching and placement are tools/gcspec, the
archived pipeline's tested builder: points are named "<piece>.<point>".
"""
import json
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import yaml                                    # noqa: E402

from gcspec import garmentcode as GC           # noqa: E402


class Outlines:
    """What gcspec.garmentcode.build_spec reads from a pattern."""

    def __init__(self, data, recipe):
        self.pieces = {k: [tuple(p) for p in v] for k, v in data['pieces'].items()}
        self.points = {k: tuple(v) for k, v in data['points'].items()}
        self.recipe = recipe


def rename(obj, old, new):
    """Replace piece name `old` (and its point prefix `old.`) in a config"""
    if isinstance(obj, dict):
        return {(new if k == old else k): rename(v, old, new) for k, v in obj.items()}
    if isinstance(obj, list):
        return [rename(v, old, new) for v in obj]
    if isinstance(obj, str):
        return new if obj == old else (new + obj[len(old):] if obj.startswith(old + '.') else obj)
    return obj


def origin_of(data, spec):
    o = spec['origin']
    if isinstance(o, list):
        return data['points'][o[0]][0], data['points'][o[1]][1]
    return tuple(data['points'][o])


def placer(data, pieces, piece):
    """Drafting (x, y) cm on `piece` -> its right-hand copy's 3D point, as gcspec places it
    (map from the origin, then a turn about z, then the translation)"""
    s = pieces[piece]
    ox, oy = origin_of(data, s)
    (a, b), (c, d) = s['map']
    th = math.radians((s.get('rotation') or [0, 0, 0])[2])
    tx, ty, tz = s['translation']

    def place(x, y, lift=0.0):
        lx, ly = a * (x - ox) + b * (y - oy), c * (x - ox) + d * (y - oy)
        return [tx + lx * math.cos(th) - ly * math.sin(th), ty + lx * math.sin(th) + ly * math.cos(th), tz + lift]
    return place


def follow(data, pieces):
    """A trim placed from the piece it sews to: `follow: {piece, at: [own point, its point],
    offset: [x, y] (cm, along that piece's placed axes), clear: cm out from the body}` sets
    the translation, so that its point lands on the other's (and the rotation, the other's)"""
    for name, s in pieces.items():
        f = s.pop('follow', None)
        if not f:
            continue
        parent = pieces[f['piece']]
        if 'follow' in parent:
            raise SystemExit(f'{name} follows {f["piece"]}, which follows another: place that first')
        own, theirs = f['at']
        ox, oy = data['points'][theirs]
        dx, dy = f.get('offset', [0, 0])
        th = math.radians((parent.get('rotation') or [0, 0, 0])[2])
        p = placer(data, pieces, f['piece'])(ox, oy)
        side = 1 if parent['translation'][2] >= 0 else -1
        s['translation'] = [p[0] + dx * math.cos(th) - dy * math.sin(th), p[1] + dx * math.sin(th) + dy * math.cos(th),
                            p[2] + side * f.get('clear', 0)]
        if parent.get('rotation'):
            s['rotation'] = list(parent['rotation'])
        # The piece's own origin must be the point that lands
        s['origin'] = own


def around(data, pieces):
    """Skirt panels placed round the body: `around: {cf: point, cb: point, y: cm, rx: cm, rz: cm}`.
    The drafting lays them side by side from CB (x of `cb`) to CF (x of `cf`); each panel goes to
    the matching angle on an ellipse rx by rz at height y of its origin, turned to face out, so
    only the ellipse's clearance is a number. The right-hand copy runs from CF round to CB."""
    for name, s in pieces.items():
        a = s.pop('around', None)
        if not a:
            continue
        cf, cb = data['points'][a['cf']][0], data['points'][a['cb']][0]
        xs = [p[0] for p in data['pieces'][name]]
        ox, _ = origin_of(data, s)
        mid = (min(xs) + max(xs)) / 2
        phi = math.pi * (cf - mid) / (cf - cb)
        d = mid - ox                               # the panel's middle from its origin, along it
        cx, cz = -a['rx'] * math.sin(phi), a['rz'] * math.cos(phi)
        s['rotation'] = [0, -math.degrees(phi), 0]
        s['translation'] = [cx - d * math.cos(phi), a['y'], cz - d * math.sin(phi)]


def hang(data, pieces):
    """A trouser leg started with its inseam straight down between the body's legs: `hang: {from:
    point, to: point, x: cm}` turns the piece about z so the line from -> to is vertical, at x.
    Left as drafted the inseam slants across the body's leg, and its stitches pull the cloth
    through it. The piece's origin keeps its height."""
    for s in pieces.values():
        h = s.pop('hang', None)
        if not h:
            continue
        ox, oy = origin_of(data, s)
        (a, b), (c, d) = s['map']
        local = lambda n: (a * (data['points'][n][0] - ox) + b * (data['points'][n][1] - oy),
                           c * (data['points'][n][0] - ox) + d * (data['points'][n][1] - oy))
        fx, fy = local(h['from'])
        tx, ty = local(h['to'])
        th = -math.pi / 2 - math.atan2(ty - fy, tx - fx)
        s['rotation'] = [0, 0, math.degrees(th)]
        s['translation'] = [h['x'] - (fx * math.cos(th) - fy * math.sin(th)), s['translation'][1], s['translation'][2]]


def open_darts(data, seams):
    """Drop the seams marked `dart: true` whose dart is closed in this design (its two legs start
    at one point: a design that extends another and sets the dart to nothing)"""
    for name, s in list(seams.items()):
        if not s.pop('dart', False):
            continue
        a, b = (data['points'][s[k][0]['along'][0]] for k in 'ab')
        if math.hypot(a[0] - b[0], a[1] - b[1]) < 0.01:
            del seams[name]


def inside(poly, x, y, tol=0.05):
    """Point in polygon, or within tol of its outline"""
    n, hit = len(poly), False
    for i in range(n):
        (x1, y1), (x2, y2) = poly[i], poly[(i + 1) % n]
        if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1):
            hit = not hit
        ex, ey = x2 - x1, y2 - y1
        t = max(0, min(1, ((x - x1) * ex + (y - y1) * ey) / (ex * ex + ey * ey or 1)))
        if math.hypot(x - x1 - t * ex, y - y1 - t * ey) <= tol:
            return True
    return hit


def decals(data, pieces):
    """What the render draws on the drape, from the drafting (tools/drape_render.py --decals):
    buttons at the pattern's button marks (one cut off with a lap shows at its buttonhole, where
    it sits once buttoned), on both copies unless on the line where the copies meet; and the
    edge of a front overlap the drape cut off at CF, drawn over the other copy (right over left).
    Points are on the flat starting pattern, in GarmentCode's cm, y up."""
    buttons, lines = [], []
    both = lambda p: [p, [-p[0], p[1], p[2]]]
    for part, s in data.get('snippets', {}).items():
        placed = [pc for pc in s['pieces'] if pc in pieces]
        marks = s['marks']
        holes = [m['at'] for m in marks if m['def'] == 'buttonhole']
        for k, m in enumerate(m for m in marks if m['def'] == 'button'):
            at = m['at']
            home = next((pc for pc in placed if inside(data['pieces'][pc], *at)), None)
            if home is None and k < len(holes):
                at = holes[k]
                home = next((pc for pc in placed if inside(data['pieces'][pc], *at)), None)
            if home is None:
                continue
            p = placer(data, pieces, home)(*at)
            cut = data.get('removed', {}).get(part)
            on_line = cut and abs(at[0] - cut['at']) < 0.05
            buttons += [{'at': q, 'r': 0.6} for q in ([p] if on_line else both(p))]
    for part, r in data.get('removed', {}).items():
        home = next((pc for pc in pieces if pc == part), None)
        if not home or not any(m['def'] == 'button' for m in data.get('snippets', {}).get(part, {}).get('marks', [])):
            continue
        place = placer(data, pieces, home)
        # Every half centimetre, so the line follows the cloth between the outline's corners
        dense = []
        for (x1, y1), (x2, y2) in zip(r['outline'], r['outline'][1:]):
            n = max(1, math.ceil(math.hypot(x2 - x1, y2 - y1) / 0.5))
            dense += [(x1 + (x2 - x1) * k / n, y1 + (y2 - y1) * k / n) for k in range(n)]
        dense.append(tuple(r['outline'][-1]))
        pts = [place(2 * r['at'] - x, y) for x, y in dense]
        lines.append({'kind': 'edge', 'pts': [[-p[0], p[1], p[2]] for p in pts]})
    pattern_map = data.get('patternMap')
    if pattern_map and 'front' in pieces:
        # The drawn pocket outline includes the open mouth as its first segment. Stitch only
        # the remaining sides and bottom; one breast pocket goes on the left, lower on both.
        place = placer(data, pieces, 'front')
        for code, placement in pattern_map['placements'].items():
            outline = placement['outline'][1:]
            if len(outline) < 2:
                continue
            pts = [place(x, y, 0.05) for x, y in outline]
            copies = [[[-p[0], p[1], p[2]] for p in pts]] if code == 'P6' else [pts, [[-p[0], p[1], p[2]] for p in pts]]
            lines.extend({'kind': 'stitch', 'code': code, 'stitch': placement['stitch'], 'pts': copy} for copy in copies)
    return {'buttons': buttons, 'lines': lines, **({'patternMap': pattern_map} if pattern_map else {})}


def main(outlines, config, out_dir, name, back='back'):
    data = json.loads(Path(outlines).read_text(encoding='utf-8'))
    cfg = yaml.safe_load(Path(config).read_text(encoding='utf-8'))
    for code, seam in data.get('patternMap', {}).get('seams', {}).items():
        drape_seam = seam.get('drapeSeam')
        if drape_seam and drape_seam not in cfg['seams']:
            raise ValueError(f'pattern map {code} references missing drape seam {drape_seam}')
    if back != 'back':
        cfg = rename(cfg, 'back', back)
    around(data, cfg['pieces'])
    hang(data, cfg['pieces'])
    follow(data, cfg['pieces'])
    open_darts(data, cfg['seams'])
    recipe = {'seams': cfg['seams'], 'drape': {'body': cfg['body'], 'pieces': cfg['pieces']}, 'labels': cfg.get('labels')}
    spec = GC.build_spec(Outlines(data, recipe))
    d = Path(out_dir) / name
    d.mkdir(parents=True, exist_ok=True)
    out = d / f'{name}_specification.json'
    out.write_text(json.dumps(spec, indent=1), encoding='utf-8')
    trims = decals(data, cfg['pieces'])
    (d / f'{name}_decals.json').write_text(json.dumps(trims), encoding='utf-8')
    p = spec['pattern']
    print(f'{out}: {len(p["panels"])} panels, {len(p["stitches"])} stitches; body {cfg["body"]}; '
          f'{len(trims["buttons"])} buttons, {len(trims["lines"])} edges drawn')


if __name__ == '__main__':
    args = sys.argv[1:]
    back = 'back'
    if '--back' in args:
        i = args.index('--back')
        back = args[i + 1]
        del args[i:i + 2]
    main(*args[:4], back=back)
