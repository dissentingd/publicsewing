"""Sweep Google Books for full-view drafting sources (SOURCING round 7).

Runs every query in sourcing/queries.yaml against the Books API with
filter=full, keeps volumes published before 1931 or flagged public domain,
dedupes across queries and writes sourcing/gbooks_hits.tsv (one row per
volume, with the groups/queries that found it). Raw API pages are cached in
sourcing/cache/ so a rerun costs no quota.
The key comes from $GOOGLE_BOOKS_API_KEY or the gitignored SECRETS.md.
usage: python scripts/gbooks_sweep.py [--pages N] [--group NAME]
"""
import argparse
import csv
import hashlib
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'sourcing'
CACHE = SRC / 'cache'
API = 'https://www.googleapis.com/books/v1/volumes'
CUTOFF = 1931    # US: published before 1931 is PD
RELEVANT = re.compile(r'cut|draft|tailor|dressmak|garment|pattern|sewing|needlework|cloth|costume|shirt|trouser'
                      r'|pants|coat|grading|sartorial|fashion|uniform|zuschneid|schnitt|bekleid|coupe|couture'
                      r'|taglio|sart|corte|confecci|millinery|apparel|household arts|domestic art|home econ', re.I)
NOISE = re.compile(r'directory|congress|report of the|catalogue of|annual report|proceedings|statutes|law|court'
                   r'|reports|hearings|journal of the house|senate|register|census|price list', re.I)


def api_key():
    key = os.environ.get('GOOGLE_BOOKS_API_KEY')
    f = ROOT / 'SECRETS.md'
    if not key and f.exists():
        m = re.search(r'`GOOGLE_BOOKS_API_KEY`\s*\|\s*`([^`]+)`', f.read_text(encoding='utf-8'))
        key = m and m.group(1)
    if not key:
        sys.exit('no key: set GOOGLE_BOOKS_API_KEY or add it to SECRETS.md')
    return key


def fetch(q, start, key):
    params = {'q': q, 'filter': 'full', 'printType': 'books',
              'maxResults': 40, 'startIndex': start}
    name = hashlib.sha1(json.dumps(params, sort_keys=True).encode()).hexdigest()[:16]
    hit = CACHE / f'{name}.json'
    if hit.exists():
        return json.loads(hit.read_text(encoding='utf-8'))
    url = API + '?' + urllib.parse.urlencode({**params, 'key': key})
    code = None
    for wait in (2, 10, 60):
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                data = json.load(r)
            break
        except urllib.error.HTTPError as e:
            if e.code not in (429, 500, 502, 503):
                raise
            code = e.code
            time.sleep(wait)
    else:
        sys.exit(f'HTTP {code} after retries on {q!r}; rerun later (cache keeps progress)')
    hit.write_text(json.dumps(data), encoding='utf-8')
    time.sleep(0.5)
    return data


def year(v):
    try:
        return int(v.get('publishedDate', '')[:4])
    except ValueError:
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--pages', type=int, default=3, help='40-result pages per query')
    ap.add_argument('--group')
    a = ap.parse_args()
    CACHE.mkdir(parents=True, exist_ok=True)
    key = api_key()
    groups = yaml.safe_load((SRC / 'queries.yaml').read_text(encoding='utf-8'))
    vols = {}
    for group, queries in groups.items():
        if a.group and group != a.group:
            continue
        for q in queries:
            n = 0
            for page in range(a.pages):
                data = fetch(q, page * 40, key)
                items = data.get('items', [])
                for it in items:
                    v, acc = it['volumeInfo'], it['accessInfo']
                    y = year(v)
                    if not (acc.get('publicDomain') or (y and y < CUTOFF)):
                        continue
                    row = vols.setdefault(it['id'], {
                        'id': it['id'], 'year': y or '',
                        'title': v.get('title', '') + (': ' + v['subtitle'] if v.get('subtitle') else ''),
                        'authors': '; '.join(v.get('authors', [])),
                        'publisher': v.get('publisher', ''),
                        'pages': v.get('pageCount', ''),
                        'pd': acc.get('publicDomain', ''),
                        'pdf': acc.get('pdf', {}).get('isAvailable', ''),
                        'groups': set(), 'queries': set(),
                        'link': f'https://books.google.com/books?id={it["id"]}'})
                    row['groups'].add(group)
                    row['queries'].add(q)
                    n += 1
                if len(items) < 40:
                    break
            print(f'{group:10} {n:4}  {q}')
    out = SRC / 'gbooks_hits.tsv'
    cols = ['year', 'title', 'authors', 'publisher', 'pages', 'pd', 'pdf', 'groups', 'nq', 'queries', 'id', 'link']
    with out.open('w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, cols, delimiter='\t', extrasaction='ignore')
        w.writeheader()
        for r in sorted(vols.values(), key=lambda r: (-len(r['queries']), str(r['year']))):
            w.writerow({**r, 'groups': ','.join(sorted(r['groups'])), 'nq': len(r['queries']),
                        'queries': ' | '.join(sorted(r['queries']))})
    print(f'{len(vols)} volumes -> {out.relative_to(ROOT)}')
    # title-keyword shortlist for human review (drops directories, laws, reports, ...)
    keep = [r for r in vols.values() if RELEVANT.search(r['title']) and not NOISE.search(r['title'])]
    short = SRC / 'gbooks_relevant.tsv'
    with short.open('w', newline='', encoding='utf-8') as f:
        w = csv.writer(f, delimiter='\t')
        w.writerow(['groups', 'year', 'title', 'authors', 'pages', 'id'])
        for r in sorted(keep, key=lambda r: (','.join(sorted(r['groups'])), str(r['year']))):
            w.writerow([','.join(sorted(r['groups'])), r['year'], r['title'], r['authors'], r['pages'], r['id']])
    print(f'{len(keep)} shortlisted -> {short.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
