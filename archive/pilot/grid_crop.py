"""Crop a region of a page image and overlay a labeled pixel grid (full-res coords).
usage: python grid_crop.py <in.png> <x0> <y0> <x1> <y1> <step> <out.png>"""
import sys
from PIL import Image, ImageDraw

src, x0, y0, x1, y1, step, out = sys.argv[1], *map(int, sys.argv[2:7]), sys.argv[7]
im = Image.open(src).convert('RGB').crop((x0, y0, x1, y1))
d = ImageDraw.Draw(im)
for x in range((x0 // step + 1) * step, x1, step):
    d.line([(x - x0, 0), (x - x0, y1 - y0)], fill=(255, 0, 0) if x % (step * 5) == 0 else (255, 170, 170), width=1)
    d.text((x - x0 + 2, 2), str(x), fill=(200, 0, 0))
for y in range((y0 // step + 1) * step, y1, step):
    d.line([(0, y - y0), (x1 - x0, y - y0)], fill=(0, 0, 255) if y % (step * 5) == 0 else (170, 170, 255), width=1)
    d.text((2, y - y0 + 2), str(y), fill=(0, 0, 200))
im.save(out)
