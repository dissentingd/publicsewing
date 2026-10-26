"""Interpret a drafting-rule file (see browne1907_bodice.yaml) for a set of
measurements; write SVG + point JSON, and optionally overlay the draft on a
scanned diagram and report deviations from hand-picked landmarks.

usage: python draft.py <rules.yaml> <measures.yaml> <out_prefix> [overlay.yaml]
"""
import ast
import json
import math
import sys

import numpy as np
import yaml


class Draft:
    def __init__(self, rules, measures):
        self.rules = rules
        self.env = {}          # scalars
        self.pts = {}          # name -> np.array([x, y])
        self.lines = {}        # name -> [names]
        self.curves = {}       # name -> np.ndarray (N, 2)
        missing = [m for m in rules['measures'] if m not in measures]
        if missing:
            raise SystemExit(f'missing measures: {missing}')
        self.env.update({k: float(v) for k, v in measures.items()})
        for k, p in (rules.get('params') or {}).items():
            self.env[k] = float(measures.get(k, p['default']))

    # ---- expression evaluation (arithmetic + a few geometry helpers only) ----
    def ev(self, expr):
        if isinstance(expr, (int, float)):
            return float(expr)
        funcs = {
            'x': lambda p: self.pts[p][0], 'y': lambda p: self.pts[p][1],
            'dist': lambda a, b: float(np.linalg.norm(self.pts[a] - self.pts[b])),
            'true_back_y': lambda x: self.line_y('true_back', x),
            'sqrt': math.sqrt,
        }
        tree = ast.parse(str(expr), mode='eval')
        for node in ast.walk(tree):
            if not isinstance(node, (ast.Expression, ast.BinOp, ast.UnaryOp, ast.Constant, ast.Name,
                                     ast.Load, ast.Call, ast.Add, ast.Sub, ast.Mult, ast.Div, ast.USub)):
                raise ValueError(f'disallowed expression: {expr}')
        names = dict(self.env)
        names.update(funcs)
        names.update({p: p for p in self.pts})   # point names pass through as strings
        return eval(compile(tree, '<rule>', 'eval'), {'__builtins__': {}}, names)

    def line_y(self, name, x):
        """y on a piecewise-linear line at abscissa x (line may be defined later in sorted order)."""
        pts = sorted((self.pts[p] for p in self.pending_lines[name]), key=lambda p: p[0])
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        return float(np.interp(x, xs, ys))

    # ---- step handlers ----
    def run(self):
        # lines may be referenced (true_back_y) before their own step; record definitions up front
        self.pending_lines = {s['line']: s['through'] for s in self.rules['steps'] if 'line' in s}
        for s in self.rules['steps']:
            if 'let' in s:
                self.env[s['let']] = self.ev(s['expr'])
            elif 'point' in s:
                self.pts[s['point']] = self.point(s)
            elif 'line' in s:
                self.lines[s['line']] = s['through']
            elif 'curve' in s:
                self.curves[s['curve']] = self.curve(s)
        return self

    def point(self, s):
        if 'at' in s:
            return np.array([self.ev(s['at'][0]), self.ev(s['at'][1])])
        if 'on_line' in s:
            a, b = (self.pts[n] for n in s['on_line'])
            x = self.ev(s['x'])
            t = (x - a[0]) / (b[0] - a[0])
            return a + t * (b - a)
        if 'along' in s:
            g = s['along']
            a = self.pts[g['from']]
            if 'toward' in g:
                d = self.pts[g['toward']] - a
            else:
                d = a - self.pts[g['away_from']]
            return a + d / np.linalg.norm(d) * self.ev(g['dist'])
        if 'meet_x' in s:
            g = s['meet_x']
            a = self.pts[g['from']]
            x, length = self.ev(g['x']), self.ev(g['length'])
            dx = x - a[0]
            if abs(dx) > length:
                raise ValueError(f"{s['point']}: length {length:.2f} can't reach x={x:.2f}")
            dy = math.sqrt(length ** 2 - dx ** 2)
            return np.array([x, a[1] - dy if g.get('side', 'back') == 'back' else a[1] + dy])
        raise ValueError(f'unknown point op: {s}')

    def curve(self, s, samples=24):
        P = [self.pts[n] for n in s['through']]
        names = s['through']
        hints = s.get('tangents') or {}
        n = len(P)
        T = []
        for i in range(n):
            chord = np.linalg.norm(P[min(i + 1, n - 1)] - P[max(i - 1, 0)]) / (2 if 0 < i < n - 1 else 1)
            if names[i] in hints:
                h = [float(v) for v in hints[names[i]]]   # [dx, dy] or [dx, dy, scale]
                d = np.array(h[:2])
                T.append(d / np.linalg.norm(d) * chord * (h[2] if len(h) > 2 else 1.0))
            else:
                T.append((P[min(i + 1, n - 1)] - P[max(i - 1, 0)]) / (2 if 0 < i < n - 1 else 1))
        out = []
        for i in range(n - 1):
            for t in np.linspace(0, 1, samples, endpoint=(i == n - 2)):
                h = [2 * t**3 - 3 * t**2 + 1, t**3 - 2 * t**2 + t, -2 * t**3 + 3 * t**2, t**3 - t**2]
                out.append(h[0] * P[i] + h[1] * T[i] + h[2] * P[i + 1] + h[3] * T[i + 1])
        return np.array(out)

    def outline(self):
        poly = []
        for item in self.rules['outline']:
            if item.startswith('~'):
                name = item[1:]
                rev = name.endswith('_rev')
                c = self.curves[name[:-4] if rev else name]
                poly.extend(c[::-1] if rev else c)
            else:
                poly.append(self.pts[item])
        return np.array(poly)


def to_svg(d, path, scale=96):
    poly = d.outline()
    allp = np.vstack([poly] + list(d.pts.values()))
    # draw with the neck at the right like Browne: screen X = -x
    X, Y = -allp[:, 0], allp[:, 1]
    pad = 1
    minx, miny = X.min() - pad, Y.min() - pad
    w, h = X.max() - minx + pad, Y.max() - miny + pad
    tf = lambda p: f'{(-p[0] - minx) * scale:.2f},{(p[1] - miny) * scale:.2f}'
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}in" height="{h}in" '
             f'viewBox="0 0 {w * scale:.1f} {h * scale:.1f}">',
             '<rect width="100%" height="100%" fill="white"/>']
    for name, through in d.lines.items():
        parts.append(f'<polyline points="{" ".join(tf(d.pts[p]) for p in through)}" '
                     f'fill="none" stroke="#999" stroke-width="1" stroke-dasharray="6 4"/>')
    parts.append(f'<polygon points="{" ".join(tf(p) for p in poly)}" fill="none" stroke="black" stroke-width="2.5"/>')
    for name, p in d.pts.items():
        parts.append(f'<circle cx="{tf(p).split(",")[0]}" cy="{tf(p).split(",")[1]}" r="3" fill="#c00"/>'
                     f'<text x="{tf(p).split(",")[0]}" y="{tf(p).split(",")[1]}" dx="4" dy="-4" '
                     f'font-size="12" fill="#c00">{name}</text>')
    parts.append('</svg>')
    open(path, 'w').write('\n'.join(parts))


def overlay(d, ov, path):
    from PIL import Image, ImageDraw
    im = Image.open(ov['image']).convert('RGB')
    dr = ImageDraw.Draw(im)
    ox, oy, s = ov['origin_px'][0], ov['origin_px'][1], ov['px_per_in']
    px = lambda p: (ox - p[0] * s, oy + p[1] * s)
    dr.line([px(p) for p in d.outline()] + [px(d.outline()[0])], fill=(220, 0, 0), width=6)
    rows = []
    for name, (lx, ly) in ov['landmarks'].items():
        if name not in d.pts:
            continue
        dx_, dy_ = px(d.pts[name])
        dr.ellipse([dx_ - 12, dy_ - 12, dx_ + 12, dy_ + 12], outline=(220, 0, 0), width=4)
        dr.ellipse([lx - 12, ly - 12, lx + 12, ly + 12], outline=(0, 90, 220), width=4)
        dr.line([(lx, ly), (dx_, dy_)], fill=(0, 160, 0), width=3)
        # deviation in inches, split into the two drafting axes (x along back, y across)
        rows.append((name, (ox - lx) / s - d.pts[name][0], (ly - oy) / s - d.pts[name][1]))
    im.thumbnail((1600, 1600))
    im.save(path)
    return rows


if __name__ == '__main__':
    rules = yaml.safe_load(open(sys.argv[1]))
    meas = yaml.safe_load(open(sys.argv[2]))
    prefix = sys.argv[3]
    d = Draft(rules, meas).run()
    to_svg(d, prefix + '.svg')
    json.dump({k: [round(float(v[0]), 3), round(float(v[1]), 3)] for k, v in d.pts.items()},
              open(prefix + '_points.json', 'w'), indent=1)
    print(f"{'point':6} {'x':>7} {'y':>7}")
    for k, v in d.pts.items():
        print(f'{k:6} {v[0]:7.2f} {v[1]:7.2f}')
    if len(sys.argv) > 4:
        ov = yaml.safe_load(open(sys.argv[4]))
        rows = overlay(d, ov, prefix + '_overlay.png')
        print('\ndeviation, diagram minus draft (in): along-back dx, across dy')
        for name, ddx, ddy in rows:
            print(f'{name:6} {ddx:+6.2f} {ddy:+6.2f}')
