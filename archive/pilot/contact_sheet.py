"""Render page leaves from an archive.org *_jp2.zip into a numbered contact sheet.
usage: python contact_sheet.py <jp2.zip> <first_leaf> <last_leaf> <out.jpg>"""
import sys, zipfile, io
from PIL import Image, ImageDraw

zpath, first, last, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
z = zipfile.ZipFile(zpath)
names = sorted(n for n in z.namelist() if n.endswith('.jp2'))
thumbs = []
for i in range(first, min(last, len(names) - 1) + 1):
    im = Image.open(io.BytesIO(z.read(names[i]))).convert('L')
    im.thumbnail((300, 420))
    thumbs.append((i, im))
cols = 6
rows = (len(thumbs) + cols - 1) // cols
sheet = Image.new('L', (cols * 310, rows * 440), 255)
d = ImageDraw.Draw(sheet)
for k, (i, im) in enumerate(thumbs):
    x, y = (k % cols) * 310, (k // cols) * 440
    sheet.paste(im, (x + 5, y + 15))
    d.text((x + 5, y), f'leaf {i}', fill=0)
sheet.save(out, quality=80)
print(len(names), 'leaves total')
