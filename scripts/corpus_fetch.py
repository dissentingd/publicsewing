"""Fetch archive.org items into the source corpus, verified against archive.org's MD5s.

For each identifier: the item's main PDF and its original page images (*_jp2.zip),
into <corpus>/<identifier>/. Files already present with the right MD5 are kept;
anything else is (re)downloaded, with retries. Access-restricted (lending) items
are refused. Run on Cloudbox (heavy downloads live there).

usage: python scripts/corpus_fetch.py <corpus_dir> <identifier> [<identifier> ...]
"""
import hashlib
import json
import os
import sys
import time
import urllib.request

UA = {'User-Agent': 'custom-clothing corpus fetch (personal research)'}


def get(url, timeout=120):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout)


def md5(path):
    h = hashlib.md5()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def wanted(meta):
    files = meta.get('files', [])
    pdfs = [f for f in files if f['name'].endswith('.pdf') and not f['name'].endswith(('_text.pdf', '_bw.pdf',
                                                                                        '_encrypted.pdf'))]
    pdfs = [f for f in pdfs if f.get('source') == 'original'] or pdfs
    jp2 = [f for f in files if f['name'].endswith('_jp2.zip')]
    if pdfs or jp2:
        return pdfs + jp2
    # image-only items (loose page scans, no PDF / jp2 archive): the original images
    return [f for f in files if f.get('source') == 'original'
            and f.get('format') in ('JPEG', 'PNG', 'TIFF', 'JPEG 2000')]


def fetch(corpus, ident, tries=4):
    meta = json.load(get(f'https://archive.org/metadata/{ident}', 60))
    m = meta.get('metadata') or {}
    if not m:
        return f'{ident}: NOT FOUND'
    if str(m.get('access-restricted-item', '')).lower() == 'true':
        return f'{ident}: REFUSED (lending-only item)'
    if not wanted(meta):
        return f'{ident}: NOTHING TO FETCH (no PDF, page archive or original images)'
    os.makedirs(os.path.join(corpus, ident), exist_ok=True)
    report = []
    for f in wanted(meta):
        name, want = f['name'], f.get('md5')
        dest = os.path.join(corpus, ident, name)
        if os.path.exists(dest) and want and md5(dest) == want:
            report.append(f'{name} ok (kept)')
            continue
        for attempt in range(1, tries + 1):
            try:
                tmp = dest + '.part'
                with get(f'https://archive.org/download/{ident}/{urllib.request.quote(name)}', 600) as r, \
                        open(tmp, 'wb') as out:
                    for chunk in iter(lambda: r.read(1 << 20), b''):
                        out.write(chunk)
                if want and md5(tmp) != want:
                    raise IOError('md5 mismatch')
                os.replace(tmp, dest)
                report.append(f'{name} downloaded')
                break
            except Exception as e:                       # noqa: BLE001 - report and retry
                if attempt == tries:
                    report.append(f'{name} FAILED ({e})')
                time.sleep(5 * attempt)
    stray = [n for n in os.listdir(os.path.join(corpus, ident))
             if n.endswith('.pdf') and n not in {f['name'] for f in wanted(meta)} and os.path.getsize(
                 os.path.join(corpus, ident, n)) < 10_000]
    for n in stray:                                       # old failed downloads (error pages saved as .pdf)
        os.remove(os.path.join(corpus, ident, n))
        report.append(f'{n} removed (failed download, {n} was an error page)')
    return f'{ident}: ' + '; '.join(report)


if __name__ == '__main__':
    for ident in sys.argv[2:]:
        print(fetch(sys.argv[1], ident), flush=True)
