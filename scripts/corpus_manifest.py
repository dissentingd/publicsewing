"""Source-corpus manifest: what we hold, where it came from, checksums, who uses it.

  write:  python scripts/corpus_manifest.py write <corpus_dir>     (from a full listing; needs archive.org)
  verify: python scripts/corpus_manifest.py verify <corpus_dir> cloudbox|laptop   (offline)

Two copies: Cloudbox ~/custom-clothing/corpus holds everything; the laptop copy
(custom-clothing/corpus, gitignored) holds everything except the page-image
archives (*_jp2.zip, ~8 GB), which stay on Cloudbox only. Each file records
which copies hold it.

Writes corpus/MANIFEST.yaml in the repo (committed). One entry per source folder:
origin URL, title, date, creator, rights basis, every file's size + SHA-256, and
the repo files that cite it. `not_held` lists cited sources we could not fetch.
Verify recomputes SHA-256 for a copy and reports missing, extra and changed files.
"""
import datetime
import hashlib
import json
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'corpus' / 'MANIFEST.yaml'

# Sources not from archive.org: origin and rights, kept by hand.
PD_GB = 'published before 1931: public domain in the US; saved from Google Books in a browser, 2026-10-19'
LOCAL = {
    'emko': {'title': 'ЕМКО СЭВ т.3: Базовые конструкции мужской одежды (1988)',
             'origin': "a private copy", 'rights': 'methods uncopyrightable (project policy); personal copy, '
                                                         'processed offline; not for redistribution'},
    'gov': {'title': 'Government specifications (US MIL-S-87046A, Ukrainian MoD ТУ)',
            'origin': {'us_MIL-S-87046A.pdf': 'https://everyspec.com/MIL-SPECS/MIL-SPECS-MIL-S/MIL-S-87046A_44698/',
                       'ua_tu_k_sh.pdf': 'https://mod.gov.ua/assets/tu_k_sh_88419e9b3f.pdf'},
            'rights': 'US government work (public domain); Ukrainian official documents are excluded from copyright'},
    '_text': {'title': 'archive.org OCR text (djvu.txt) of items surveyed during sourcing',
              'origin': 'https://archive.org/download/<identifier>/<identifier>_djvu.txt',
              'rights': 'derived text of the listed archive.org items'},
    # placed by the research session (SOURCING.md round 7)
    'gb_rude1906_nycuttingschool': {'title': 'Rude, A. D., Rude Great Modern System (New York Cutting School), 1906',
        'origin': 'https://books.google.com/books?id=YkAyAQAAMAAJ', 'rights': PD_GB},
    'gb_devere1883_handbook_text': {'title': 'Devere, Handbook of Practical Cutting on the Centre Point System, 5th ed. 1883, text volume',
        'origin': 'https://books.google.com/books?id=Vak5c60mOnkC', 'rights': PD_GB},
    'gb_sartorialgazette1915_v22-23': {'title': 'Sartorial Gazette vols 22-23 (1915-16), Illinois copy',
        'origin': 'https://books.google.com/books?id=3_8lCHJXjssC', 'rights': PD_GB},
    'gb_clothingdesigner1918_v13': {'title': 'Clothing Designer and Manufacturer vol. XIII, 1918',
        'origin': 'Google Books (id not recorded)', 'rights': PD_GB},
    'gb_compaingdevere1855_tailorsguide': {'title': "Compaing & Devere, L'Art du tailleur / The Tailor's Guide, 1855",
        'origin': 'https://books.google.com/books?id=UulhAAAAcAAJ', 'rights': PD_GB},
    'gb_ladeveze1874_coursdecoupe': {'title': 'Ladevèze, Cours de coupe du tailleur de Paris, 1874',
        'origin': 'https://books.google.com/books?id=uslob6dZbJAC', 'rights': PD_GB},
    'gb_wi1928_patterndesigningdraping': {'title': "Woman's Institute, Pattern Designing and Draping, 1928",
        'origin': 'https://books.google.com/books?id=DTCWHJjH1aIC', 'rights': PD_GB},
    'gb_wi1916_tailoring': {'title': "Woman's Institute tailoring volume (Tailored Buttonholes ... Suits, Coats, and Capes), (c)1916-1923",
        'origin': 'Google Books (id not recorded)', 'rights': PD_GB},
    'gb_wi1925_underwearlingerie': {'title': "Woman's Institute, Underwear and Lingerie, (c)1925 (likely the same work as CAT31314740)",
        'origin': 'Google Books (id not recorded)', 'rights': PD_GB},
    'gb_baldt1916_clothingforwomen': {'title': 'Baldt, Clothing for Women, 1916 (1917 reprint; alternate scan of clothingforwomen00bald)',
        'origin': 'Google Books (id not recorded)', 'rights': PD_GB},
    'gb_longmans1901_needlework': {'title': "Longmans' Complete Course of Needlework, Knitting and Cutting Out, 1901",
        'origin': 'Google Books (id not recorded)', 'rights': PD_GB},
    'gb_plainneedlework1898': {'title': 'A Manual of Plain Needlework and Cutting-out, new rev. ed. 1898 (later edition of manualofplainnee1886jone)',
        'origin': 'Google Books (id not recorded)', 'rights': PD_GB},
    'gb_rosevear1893_needlework': {'title': 'Rosevear, Text-book of Needlework, Knitting and Cutting Out, 1893 (alternate scan of textbookofneedle1893rose)',
        'origin': 'Google Books (id not recorded)', 'rights': PD_GB},
    'gb_devere1883_handbook_plates': {'title': 'Devere, Handbook of Practical Cutting on the Centre Point System, 5th ed. 1883, plates volume',
        'origin': 'https://books.google.com/books?id=20Sd-kXwXzcC', 'rights': PD_GB},
    'gb_klemm1869_bekleidungskunst': {'title': 'Klemm, Vollständiges Handbuch der höhern Bekleidungskunst für Civil, Militär und Livree, 25th ed., Dresden 1869',
        'origin': 'https://books.google.com/books?id=8MAlySd_ok4C', 'rights': PD_GB},
    'gb_wi1924_draftingpatterndesigning': {'title': "Woman's Institute, Drafting and Pattern Designing, (c)1924",
        'origin': 'https://books.google.com/books?id=_X3OAAAAMAAJ', 'rights': PD_GB},
    'gb_clothingdesigner1916': {'title': 'Clothing Designer and Manufacturer, 1916',
        'origin': 'https://books.google.com/books?id=EjAwAAAAYAAJ', 'rights': PD_GB},
    'gb_clothingdesigner1917_v11': {'title': 'Clothing Designer and Manufacturer vol. XI, 1917',
        'origin': 'https://books.google.com/books?id=6C8wAAAAYAAJ', 'rights': PD_GB},
    'gb_gentlemansmagazine1873_v25': {'title': "The Gentleman's Magazine of Fashion vol. 25, 1873",
        'origin': 'https://books.google.com/books?id=_xcGAAAAQAAJ', 'rights': PD_GB},
    'gb_gentlemansmagazine1877_v29': {'title': "The Gentleman's Magazine of Fashion vol. 29, 1877 monthly issues (Google's "
                                               "metadata says 1878, likely the binding year)",
        'origin': 'https://books.google.com/books?id=SBgGAAAAQAAJ', 'rights': PD_GB},
    'gb_sartorialgazette1918_v25': {'title': 'Sartorial Gazette vol. XXV, 1918 (Illinois copy)',
        'origin': 'https://books.google.com/books?id=xd2D_O5qhjwC', 'rights': PD_GB},
    'gb_baldt1929_clothingforwomen': {'title': 'Baldt, Clothing for Women, (c)1929 (Lippincott)',
        'origin': 'https://books.google.com/books?id=csJAAAAAIAAJ', 'rights': PD_GB},
    'gb_vincent1902_cpg_part1': {'title': "Vincent, The Cutters' Practical Guide to Cutting Every Kind of Garment Made by Tailors, part 1, 1902 (Google scan; archive.org's PDF of this work returns HTTP 500)",
        'origin': 'Google Books (id not recorded)', 'rights': PD_GB},
    'gb_vincent_cpg_coatcutting': {'title': "Vincent, The Cutters' Practical Guide to Coat Cutting & Making (UCD Library copy; year not printed in the front matter)",
        'origin': 'Google Books (id not recorded)', 'rights': PD_GB},
    'gb_dobsonhumphreys1885_blockpatterns': {'title': 'Dobson & Humphreys, £20 Prize Essay on Cutting by Block Patterns (with additions by T. D. Humphreys), 1885',
        'origin': 'https://books.google.com/books?id=3fcGAAAAQAAJ', 'rights': PD_GB},
    'gb_holding1885_coats': {'title': 'Holding, Coats: How to Cut and Try Them On, 1885',
        'origin': 'https://books.google.com/books?id=yfcGAAAAQAAJ', 'rights': PD_GB},
    'gb_giles1875_westendsystem': {'title': 'Giles et al., The West-End System: a scientific and practical method of cutting all kinds of garments, pt I, 1875',
        'origin': 'https://books.google.com/books?id=viUBAAAAQAAJ', 'rights': PD_GB},
    'gb_gazetteoffashion1868_v22': {'title': 'Gazette of Fashion and Cutting-Room Companion (Minister & Son) vol. XXII, 1868',
        'origin': 'https://books.google.com/books?id=tCIGAAAAQAAJ', 'rights': PD_GB},
    'gb_gazetteoffashion1881_v35': {'title': 'Gazette of Fashion and Cutting-Room Companion (Minister & Son) vol. XXXV, 1881',
        'origin': 'https://books.google.com/books?id=tTMGAAAAQAAJ', 'rights': PD_GB},
    'gb_recordoffashion1882_v7': {'title': "The Weekly Record of Fashion, and Tailor and Cutter's Guide (ed. T. D. Humphreys) vol. VII, 1882",
        'origin': 'https://books.google.com/books?id=3CEGAAAAQAAJ', 'rights': PD_GB},
    'gb_holding1892_trousers': {'title': 'Holding, Trousers Cutting, together with Vests, Breeches, Gaiters, etc., 2nd ed., London 1892',
        'origin': 'Google Books (id not recorded)', 'rights': PD_GB.replace('2026-10-19', '2026-10-20')},
    'gb_stone1913_trousers': {'title': "Stone's Advanced Superlative Trouser System, 1913 (John Crerar Library copy)",
        'origin': 'Google Books (id not recorded)', 'rights': PD_GB.replace('2026-10-19', '2026-10-20')},
    'kidwell1979': {'title': 'Kidwell, Cutting a Fashionable Fit, Smithsonian Studies in History and Technology 42, 1979',
        'origin': 'https://repository.si.edu/handle/10088/2441',
        'rights': 'Smithsonian publication (1979): reference only, not a drafting source'},
}

# Cited in the docs but not held, with the reason (re-check before re-sourcing).
NOT_HELD = {
    'archive.org handbookofpracti0000deve': 'Devere 1986 reprint: lending-only (encrypted), not downloadable',
}


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def archive_meta(ident):
    try:
        req = urllib.request.Request(f'https://archive.org/metadata/{ident}', headers={'User-Agent': 'cc-manifest'})
        m = json.load(urllib.request.urlopen(req, timeout=60)).get('metadata') or {}
    except Exception:                                    # noqa: BLE001 - offline or not an archive item
        return {}
    one = lambda v: v[0] if isinstance(v, list) else v
    return {k: one(m[k]) for k in ('title', 'date', 'creator', 'publisher', 'possible-copyright-status', 'rights',
                                   'access-restricted-item') if k in m}


# Non-US books: status outside the US runs from the author's death (life + 70 in the UK and
# Germany). Death years as found by hand (2026-10-26); None: looked for, not found.
AUTHOR_DEATHS = {
    'krl00366374': ('Agnes Walker', 1908),
    'vincentmakingshirts18xx': ('W. D. F. Vincent', 1926),
    'cutterspracticalguide-part-1-youngmens': ('W. D. F. Vincent', 1926),
    'uptodatedresscuttingpartone': ('M. Prince Browne', 1921),
    'anfertigungvonw00behr': ('Gertrud Behrendsen', None),
}


def rights_basis(date, status, ident=None):
    year = re.match(r'\d{4}', str(date or ''))
    if year and int(year.group()) < 1931:
        basis = f'published {year.group()}: public domain in the US (before 1931)'
    elif year:
        basis = f'published {year.group()}: check SOURCING.md (renewal search) before using'
    else:
        basis = 'date unknown: check SOURCING.md'
    if ident in AUTHOR_DEATHS:
        name, died = AUTHOR_DEATHS[ident]
        basis += (f'; {name} died {died}: public domain wherever the term is life + 70 or shorter' if died
                  else f"; {name}'s death year not found: elsewhere public domain only if she died before {datetime.date.today().year - 70}")
    return basis + (f'; archive.org: {status}' if status else '')


def cited_by(ident):
    """Repo files that mention the identifier (docs, data, code)."""
    try:
        out = subprocess.run(['git', '-C', str(ROOT), 'grep', '-l', '-F', ident, '--', ':!corpus/MANIFEST.yaml'],
                             capture_output=True, text=True).stdout.split()
    except FileNotFoundError:
        out = []
    return sorted(out)


def copies(name):
    """Page-image archives stay on Cloudbox; everything else (PDFs, text, loose page images
    of image-only items, which have no PDF) is on both copies."""
    return ['cloudbox'] if name.endswith('_jp2.zip') else ['cloudbox', 'laptop']


def files_of(folder, listing=None):
    """{name: {bytes, sha256, copies}}; listing = precomputed {name: (bytes, sha256)} from the primary."""
    out = {}
    if listing is not None:
        for name, (size, digest) in sorted(listing.items()):
            out[name] = {'bytes': size, 'sha256': digest, 'copies': copies(name)}
        return out
    for p in sorted(folder.rglob('*')):
        if p.is_file() and not p.name.endswith('.part'):
            out[p.relative_to(folder).as_posix()] = {'bytes': p.stat().st_size, 'sha256': sha256(p),
                                                     'copies': copies(p.name)}
    return out


def read_listing(path):
    """Primary-copy listing from `sha256sum` run on Cloudbox: lines '<sha256>  ./<ident>/<name>'."""
    out = {}
    for line in Path(path).read_text(encoding='utf-8').splitlines():
        digest, size, rel = line.split(' ', 2)
        ident, name = rel.removeprefix('./').split('/', 1)
        out.setdefault(ident, {})[name] = (int(size), digest)
    return out


def write(corpus, listing=None):
    """corpus: the primary dir, or (with listing) any dir name used only for labels."""
    corpus = Path(corpus)
    listed = read_listing(listing) if listing else None
    sources = {}
    idents = sorted(listed) if listed else sorted(p.name for p in corpus.iterdir() if p.is_dir())
    for ident in idents:
        folder = corpus / ident
        entry = {}
        if ident in LOCAL:
            entry.update(LOCAL[ident])
        else:
            m = archive_meta(ident)
            entry['origin'] = f'https://archive.org/details/{ident}'
            entry.update({k: m[k] for k in ('title', 'date', 'creator', 'publisher') if k in m})
            entry['rights'] = rights_basis(m.get('date'), m.get('possible-copyright-status'), ident)
        entry['cited_by'] = cited_by(ident)
        entry['files'] = files_of(folder, listed[ident] if listed else None)
        if not any('laptop' in f['copies'] for f in entry['files'].values()):
            for name, f in entry['files'].items():      # no PDF held (e.g. archive.org 500s): laptop takes the images
                f['copies'] = ['cloudbox', 'laptop']
        sources[ident] = entry
    doc = {'note': 'Generated by scripts/corpus_manifest.py. Copies: Cloudbox ~/custom-clothing/corpus (primary), '
                   'laptop custom-clothing/corpus (second copy, gitignored). Verify a copy with '
                   '`python scripts/corpus_manifest.py verify <dir>`.',
           'totals': {'sources': len(sources), 'files': sum(len(s['files']) for s in sources.values()),
                      'bytes': sum(f['bytes'] for s in sources.values() for f in s['files'].values())},
           'sources': sources, 'not_held': NOT_HELD}
    MANIFEST.parent.mkdir(exist_ok=True)
    MANIFEST.write_text(yaml.safe_dump(doc, allow_unicode=True, sort_keys=False, width=110), encoding='utf-8')
    t = doc['totals']
    print(f"wrote {MANIFEST.relative_to(ROOT)}: {t['sources']} sources, {t['files']} files, {t['bytes'] / 1e9:.2f} GB")


def verify(corpus, copy):
    corpus = Path(corpus)
    doc = yaml.safe_load(MANIFEST.read_text(encoding='utf-8'))
    bad = 0
    for ident, s in doc['sources'].items():
        for name, f in s['files'].items():
            if copy not in f['copies']:
                continue
            p = corpus / ident / name
            if not p.exists():
                print(f'MISSING  {ident}/{name}')
                bad += 1
            elif p.stat().st_size != f['bytes'] or sha256(p) != f['sha256']:
                print(f'CHANGED  {ident}/{name}')
                bad += 1
    held = {(i, n) for i, s in doc['sources'].items() for n, f in s['files'].items() if copy in f['copies']}
    for p in corpus.rglob('*'):
        if p.is_file() and p.name != 'MANIFEST.yaml':
            rel = p.relative_to(corpus).as_posix().split('/', 1)
            if len(rel) == 2 and (rel[0], rel[1]) not in held:
                print(f'EXTRA    {rel[0]}/{rel[1]} (not in the manifest)')
    n = len(held)
    print(f'{copy}: {n - bad}/{n} files verified' + ('' if bad else ': copy is complete and intact'))
    return bad


if __name__ == '__main__':
    cmd, corpus = sys.argv[1], sys.argv[2]
    if cmd == 'write':
        write(corpus, sys.argv[3] if len(sys.argv) > 3 else None)   # optional primary listing file
    else:
        sys.exit(1 if verify(corpus, sys.argv[3]) else 0)
