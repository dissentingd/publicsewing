"""Page OCR for scanned source tables (tesseract via the tools image).

Pure plumbing: render a PDF page, pick the reading rotation, return text lines.
Parsing a table's rows is source-specific (ccat.sources.<source>_ocr).
Needs `pdftoppm` (poppler) and `tesseract` with the languages the source uses:
run it in the custom-clothing/tools image.
"""
import os
import re
import subprocess
import tempfile

ROTATIONS = (0, 90, 270, 180)


def render(pdf, page, out_png, dpi=72):
    """Render one page. The ЕМКО PDF stores its scans at 72 ppi page units, so
    dpi=72 gives the scan's native pixels."""
    base = out_png[:-4] if out_png.endswith('.png') else out_png
    subprocess.run(['pdftoppm', '-r', str(dpi), '-f', str(page), '-l', str(page), '-png', '-singlefile',
                    pdf, base], check=True)
    return base + '.png'


def tesseract(png, lang='rus+eng', psm=6, rotate=0):
    """OCR an image, optionally rotated by `rotate` degrees counter-clockwise first."""
    src = png
    if rotate:
        from PIL import Image
        fd, src = tempfile.mkstemp(suffix='.png')
        os.close(fd)
        Image.open(png).rotate(rotate, expand=True).save(src)
    try:
        r = subprocess.run(['tesseract', src, '-', '-l', lang, '--psm', str(psm)],
                           check=True, capture_output=True, text=True)
    finally:
        if src != png:
            os.remove(src)
    return r.stdout.splitlines()


def words(png, lang='rus+eng', psm=6):
    """Word boxes: [{'text', 'x0', 'y0', 'x1', 'y1', 'line'}], `line` = (block, paragraph, line)."""
    r = subprocess.run(['tesseract', png, '-', '-l', lang, '--psm', str(psm), 'tsv'],
                       check=True, capture_output=True, text=True)
    out = []
    for row in r.stdout.splitlines()[1:]:
        f = row.split('\t')
        if len(f) < 12 or not f[11].strip():
            continue
        x, y, w, h = (int(v) for v in f[6:10])
        out.append({'text': f[11].strip(), 'x0': x, 'y0': y, 'x1': x + w, 'y1': y + h,
                    'line': (int(f[2]), int(f[3]), int(f[4]))})
    return out


def read_cell(png, box, scale=3, psm=7, whitelist=None, binarize=False):
    """OCR one crop (box = x0, y0, x1, y1 in page pixels), upscaled `scale`× first. → text."""
    from PIL import Image, ImageOps
    im = Image.open(png).convert('L').crop(box)
    im = im.resize((im.width * scale, im.height * scale), Image.LANCZOS)
    if binarize:
        hist = im.histogram()                        # Otsu threshold
        total, sum_all = sum(hist), sum(i * h for i, h in enumerate(hist))
        best, wb, sb, thr = 0, 0, 0, 128
        for t in range(256):
            wb += hist[t]
            if not wb or wb == total:
                continue
            sb += t * hist[t]
            mb, mf = sb / wb, (sum_all - sb) / (total - wb)
            between = wb * (total - wb) * (mb - mf) ** 2
            if between > best:
                best, thr = between, t
        im = im.point(lambda p: 255 if p > thr else 0)
    im = ImageOps.expand(im, border=10 * scale, fill=255)
    fd, src = tempfile.mkstemp(suffix='.png')
    os.close(fd)
    im.save(src)
    cmd = ['tesseract', src, '-', '-l', 'eng', '--psm', str(psm)]
    if whitelist:
        cmd += ['-c', f'tessedit_char_whitelist={whitelist}']
    try:
        r = subprocess.run(cmd, check=True, capture_output=True, text=True)
    finally:
        os.remove(src)
    return r.stdout.strip()


def best_rotation(png, score, lang='rus+eng', rotations=ROTATIONS):
    """OCR at each rotation and keep the one whose lines score highest.

    score(lines) -> number: a source-specific measure such as "lines that parse as
    table rows". Returns (rotation, lines). Pages printed sideways (ЕМКО pp.8–10)
    come out right without manual cropping or rotating.
    """
    best = None
    for rot in rotations:
        lines = tesseract(png, lang, rotate=rot)
        s = score(lines)
        if best is None or s > best[0]:
            best = (s, rot, lines)
        if rot == 0 and s >= 10:          # clearly upright: skip the other rotations
            break
    return best[1], best[2]


NUM = re.compile(r'^[+-]?\d+(?:[.,]\d+)?$')


def to_number(tok):
    """'15,25' -> 15.25; dash-like empty cells -> 0.0; anything else -> None."""
    t = tok.strip().rstrip('.')
    if t in ('—', '-', '–', '=', '==', '—=', '=—', '_', '--'):
        return 0.0
    if NUM.match(t):
        return float(t.replace(',', '.'))
    if t[:1] in '—–' and NUM.match(t[1:]):              # negative value printed with a dash: —0,5
        return -float(t[1:].replace(',', '.'))
    return None
