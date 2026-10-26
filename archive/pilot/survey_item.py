"""Survey an archive.org *_jp2.zip: leaf count, resolution spread, and a contact sheet.
usage: python survey_item.py <jp2.zip> <out.jpg> [max_leaves]"""
import sys, zipfile, io
from PIL import Image, ImageDraw

zpath, out = sys.argv[1], sys.argv[2]
maxl = int(sys.argv[3]) if len(sys.argv) > 3 else 48
z = zipfile.ZipFile(zpath)
names = sorted(n for n in z.namelist() if n.endswith('.jp2'))
step = max(1, len(names) // maxl)
picked = list(range(0, len(names), step))[:maxl]
sizes, thumbs = [], []
bad = 0
for i in range(len(names)):
    try:
        im = Image.open(io.BytesIO(z.read(names[i])))
        if i in picked:
            im.load()
    except Exception:
        bad += 1
        continue
    sizes.append(im.size)
    if i in picked:
        im = im.convert('L'); im.thumbnail((260, 360)); thumbs.append((i, im))
w = sorted(s[0] for s in sizes)
low = sum(1 for s in sizes if s[0] < 1000)
print(f'unreadable={bad} leaves={len(names)} width min/median/max={w[0]}/{w[len(w)//2]}/{w[-1]} lowres(<1000px)={low}')
cols = 8; rows = (len(thumbs) + cols - 1) // cols
sheet = Image.new('L', (cols * 270, rows * 380), 255); d = ImageDraw.Draw(sheet)
for k, (i, im) in enumerate(thumbs):
    x, y = (k % cols) * 270, (k // cols) * 380
    sheet.paste(im, (x + 5, y + 15)); d.text((x + 5, y), f'leaf {i}', fill=0)
sheet.save(out, quality=75)
