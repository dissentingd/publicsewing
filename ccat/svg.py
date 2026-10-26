"""Debug SVG at 1:1 (cm): pieces, paths and labelled points. Not the export layer."""
from xml.sax.saxutils import escape


def write(pattern, path, margin=5.0):
    pts = list(pattern.points.values()) + [p for s in pattern.pieces.values() for p in s] + \
        [p for s in pattern.paths.values() for p in s]
    if not pts:
        raise ValueError('nothing to draw')
    x0, y0 = min(p[0] for p in pts) - margin, min(p[1] for p in pts) - margin
    w, h = max(p[0] for p in pts) + margin - x0, max(p[1] for p in pts) + margin - y0
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{w:.2f}cm" height="{h:.2f}cm" '
           f'viewBox="{x0:.3f} {y0:.3f} {w:.3f} {h:.3f}">',
           f'<rect x="{x0:.3f}" y="{y0:.3f}" width="{w:.3f}" height="{h:.3f}" fill="white"/>']

    def poly(p, style):
        return f'<polyline points="{" ".join(f"{x:.4f},{y:.4f}" for x, y in p)}" {style}/>'

    for name, p in pattern.paths.items():
        out.append(poly(p, 'fill="none" stroke="#06c" stroke-width="0.08" stroke-dasharray="0.4 0.3"'))
    for name, p in pattern.pieces.items():
        out.append(poly(p, 'fill="none" stroke="black" stroke-width="0.12"'))
    for name, (x, y) in pattern.points.items():
        out.append(f'<circle cx="{x:.4f}" cy="{y:.4f}" r="0.25" fill="#c00"/>'
                   f'<text x="{x + 0.4:.4f}" y="{y - 0.3:.4f}" font-size="1.1" fill="#c00">{escape(name)}</text>')
    out.append('</svg>')
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out))
