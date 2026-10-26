"""OCR ЕМКО т.3 table pages to text (run in the tools image, --network none).

Saves data/emko/ocr/p-NNN.txt with the chosen rotation in a header line, so
parsing, benchmarks and tests run anywhere without tesseract.
usage: python scripts/emko_ocr_pages.py <pdf> <first>-<last> [<first>-<last> ...]
"""
import os
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from ccat import ocr                         # noqa: E402
from ccat.sources import emko_ocr            # noqa: E402

OUT = ROOT / 'data' / 'emko' / 'ocr'


def score(lines):
    return sum(1 for r in emko_ocr.parse_lines(lines) if r['tail'])


def main(pdf, ranges):
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = tempfile.mkdtemp()
    for rg in ranges:
        a, b = (int(x) for x in rg.split('-'))
        for page in range(a, b + 1):
            png = ocr.render(pdf, page, os.path.join(tmp, f'p{page}.png'))
            rot, lines = ocr.best_rotation(png, score)
            (OUT / f'p-{page:03d}.txt').write_text(f'# page {page}, rotation {rot}\n' + '\n'.join(lines) + '\n',
                                                   encoding='utf-8')
            print(page, rot, score(lines), flush=True)
            os.remove(png)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2:])
