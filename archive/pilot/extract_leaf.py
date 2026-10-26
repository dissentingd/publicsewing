"""Extract one leaf from an archive.org *_jp2.zip as PNG (optionally downscaled).
usage: python extract_leaf.py <jp2.zip> <leaf> <out.png> [max_px]"""
import sys, zipfile, io
from PIL import Image

zpath, leaf, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
max_px = int(sys.argv[4]) if len(sys.argv) > 4 else None
z = zipfile.ZipFile(zpath)
names = sorted(n for n in z.namelist() if n.endswith('.jp2'))
im = Image.open(io.BytesIO(z.read(names[leaf]))).convert('L')
print(names[leaf], im.size, im.info.get('dpi'))
if max_px:
    im.thumbnail((max_px, max_px))
im.save(out)
