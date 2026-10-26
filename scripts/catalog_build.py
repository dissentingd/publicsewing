"""Build catalog entries: recipe + data → gate → sewing-ready exports + entry.json.

usage: python scripts/catalog_build.py catalog/emko.yaml [--commit <git sha>] [--only <id>]

Writes catalog/<source>/<id>/{entry.json, pattern.svg, pattern.dxf, pattern_letter.pdf,
pattern_a4.pdf}. An entry whose pattern fails the gate is not written: the script
reports why and exits 2. Exit 3 = the pipeline stopped (recipe, data or export spec).
Needs the export extra, so run it in the tools image (tools:2026-10-20 or later).
"""
import argparse
import importlib
import os
import shutil
import sys
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import yaml                                   # noqa: E402

from ccat import __version__ as CCAT_VERSION  # noqa: E402
from ccat import export as X                  # noqa: E402
from ccat import recipe as R                  # noqa: E402
from ccat.checks import run_checks            # noqa: E402
from ccat.sources import emko                 # noqa: E402


MODEL_SECTIONS = ('imk', 'imk_sleeve', 'mk', 'traces')   # Table x.3 rows (+ traced curves): one per garment model


def adapter(cfg):
    """The catalog's source adapter (ccat.sources.<source.adapter>, default emko)."""
    return importlib.import_module(f"ccat.sources.{cfg['source'].get('adapter', 'emko')}")


def load_data(spec, recipe=None, src=emko):
    """Data for one build. {garment}: one size's data file. {graded, figure[, model]}: a typical
    figure's БК rows from the size table; `model` adds the garment's ИМК/МК rows (and traces) from
    its base-size file, minus the recipe's check inputs among them, which the table printed for
    the base size only (base_only checks then skip on this size). A traced source (walker) takes
    {garment} only."""
    if src is not emko:
        if set(spec) != {'garment'}:
            raise R.RecipeError(f'data must be {{garment}} for source {src.__name__}, not {sorted(spec)}')
        doc = src.load(ROOT / spec['garment'])
        pages = ', '.join(map(str, doc['source'].get('pages') or []))
        return src.inputs_from_garment(doc, ROOT), doc['name'], doc['source']['size'], f'pp. {pages}'
    if set(spec) == {'garment'}:
        doc = emko.load(ROOT / spec['garment'])
        return emko.inputs_from_garment(doc), doc['name'], doc['source']['size'], f"Table {doc['source']['table']}"
    if set(spec) in ({'graded', 'figure'}, {'graded', 'figure', 'model'}):
        rules = emko.load(ROOT / spec['graded'])
        fig = str(spec['figure'])
        data = emko.inputs_from_graded(rules, fig, ROOT)
        name, table = f'jacket {fig}', 'Table 1.4 (graded), rows from Table 1.2'
        if 'model' in spec:
            base = emko.load(ROOT / spec['model'])
            base_only = set((recipe or {}).get('check_inputs') or [])
            rows = emko.inputs_from_garment({s: base[s] for s in MODEL_SECTIONS if s in base})
            model = {k: v for k, v in rows.items() if k not in base_only}
            data = {**data, **model}
            name = f"{base['name'].rsplit(' ', 1)[0]} {fig}"
        return data, name, fig, table
    raise R.RecipeError(f'data must be {{garment}} or {{graded, figure[, model]}}, not {sorted(spec)}')


def expand(cfg, e):
    """An entry with data.figures (a list, or 'all' = every figure of its graded table) becomes one
    entry per figure, id suffixed with the figure."""
    figs = (e.get('data') or {}).get('figures')
    if figs is None:
        return [e]
    if figs == 'all':
        rules = emko.load(ROOT / e['data']['graded'])
        figs = emko.load(ROOT / rules['table'])['figures']
    data = {k: v for k, v in e['data'].items() if k != 'figures'}
    return [{**e, 'id': f"{e['id']}-{f}", 'data': {**data, 'figure': f}} for f in figs]


def build(cfg, e, out_root, commit):
    recipe = R.load(ROOT / e['recipe'])
    src = adapter(cfg)
    data, name, size, table = load_data(e['data'], recipe, src)
    name, table = e.get('garment', name), e.get('tables', table)       # optional overrides
    pattern = R.build(recipe, data)
    gate = run_checks(pattern, src.PRINTED_STEP)
    if not gate.passed:
        return False, gate
    sa = cfg['seam_allowance']
    status = {**(cfg.get('status') or {}), **(e.get('status') or {})}
    if not isinstance(status.get('sewable'), bool):
        raise R.RecipeError(f"{e['id']}: status.sewable (true/false) must be stated in the catalog config")
    if status['sewable']:                          # only a recorded muslin test makes a pattern sewable
        m = e.get('muslin')
        if not isinstance(m, dict) or not all(m.get(k) for k in ('date', 'sewn_by', 'result')):
            raise R.RecipeError(f"{e['id']}: sewable: true needs a muslin test recorded on the entry as "
                                "muslin: {date, sewn_by, result} (see the top of the catalog config)")
    title = f"{e['id']} ({name})" + ('' if status['sewable'] else ' (reference only, not a sewing pattern)')
    pieces = X.build_pieces(pattern, sa, label_head=(name, cfg['source']['book'].split(':')[0]))
    final = out_root / e['id']
    d = out_root / f".{e['id']}.building"            # written whole, then moved into place: a stopped
    shutil.rmtree(d, ignore_errors=True)               # build never leaves a half-written entry
    d.mkdir(parents=True)
    (d / 'pattern.svg').write_text(X.svg(pieces, title), encoding='utf-8', newline='\n')
    X.dxf(pieces, d / 'pattern.dxf', title)
    # the note reaches the cover either way: a warning on reference entries, a note on sewable ones
    # (what's still to add, test-sewing status)
    head = 'NOTE: ' if status['sewable'] else 'NOT A SEWING PATTERN. '
    warning = textwrap.wrap(head + status.get('note', ''), 110) + [''] if status.get('note') or not status['sewable'] else []
    cover = warning + [f'{name}; size {size} ({cfg["source"]["size_label"]})',
             f'Source: {cfg["source"]["book"]}, {table}',
             (f'Seam allowance {sa:g} cm included (export default). ' if sa else
              'Cut on the drawn line: the source includes turnings. ')
             + f'Gate: passed, {len(gate.results)} checks against {cfg.get("checked_against", "the printed table")}.',
             f'Built by ccat {CCAT_VERSION}, commit {commit}. Not for AI training.']
    pages = {p: X.pdf(pieces, d / f'pattern_{p}.pdf', title, p, cover) for p in X.PAGES}
    Polygon, _ = X._shapely()
    entry = {
        'id': e['id'],
        'garment': name,
        'size': {'label': size, 'order': cfg['source']['size_label']},
        'source': {'book': cfg['source']['book'], 'table': table, 'corpus': cfg['source']['corpus']},
        'rights': cfg['source']['rights'],
        'status': status,
        'notice': 'Not for AI training.',
        'construction': {'recipe': e['recipe'], 'data': e['data'], 'units': 'cm'},
        'export': {'seam_allowance_cm': sa, 'seam_allowance_basis': cfg.get(
                       'seam_allowance_basis', 'export default, uniform; not from the source'),
                   'notch_depth_cm': X.NOTCH_DEPTH, 'grain': 'vertical in the drafting frame',
                   'darts': f'cut edge runs straight across the dart mouth (caps not trued); drill hole '
                            f'{X.DRILL_BACK:g} cm short of the apex',
                   'tiled_pdf': {p: {'page_cm': X.PAGES[p], 'pages_incl_cover': n, 'margin_cm': X.PAGE_MARGIN,
                                     'overlap_cm': X.OVERLAP} for p, n in pages.items()}},
        'pieces': [{'name': pc.name, 'cut': pc.cut_count, 'notches': len(pc.notches), 'darts': len(pc.darts),
                    **({'repairs': pc.repairs} if pc.repairs else {}),
                    'stitch_perimeter_cm': round(Polygon(pc.stitch).length, 3),
                    'cut_perimeter_cm': round(Polygon(pc.cut).length, 3),
                    'area_cm2': round(Polygon(pc.stitch).area, 2)} for pc in pieces],
        'gate': gate.as_dict(),
        'files': {f.name: X.sha256(f) for f in sorted(d.iterdir()) if f.name != 'entry.json'},
        'provenance': {'ccat': CCAT_VERSION, 'commit': commit},
    }
    X.write_entry(d / 'entry.json', entry)
    shutil.rmtree(final, ignore_errors=True)
    d.rename(final)
    return True, gate


def main(argv=None):
    ap = argparse.ArgumentParser(prog='catalog_build')
    ap.add_argument('config')
    ap.add_argument('--commit', default='unknown')
    ap.add_argument('--only')
    a = ap.parse_args(argv)
    cfg_path = ROOT / a.config
    cfg = yaml.safe_load(cfg_path.read_text(encoding='utf-8'))
    out_root = cfg_path.parent / cfg_path.stem
    status = 0
    entries = [x for entry in cfg['entries'] for x in expand(cfg, entry)]
    ids = [e['id'] for e in entries]
    dup = sorted({i for i in ids if ids.count(i) > 1})
    if dup:                                          # two builds would write the same directory
        print(f'STOPPED: duplicate entry ids {dup}', file=sys.stderr)
        return 3
    for e in entries:
        if a.only and e['id'] != a.only:
            continue
        try:
            ok, gate = build(cfg, e, out_root, a.commit)
        except (R.RecipeError, ValueError) as err:
            print(f'STOPPED {e["id"]}: {err}', file=sys.stderr)
            status = 3
            continue
        if ok:
            print(f'built {e["id"]}')
        else:
            print(f'NOT BUILT {e["id"]}: gate fails\n{gate.text()}', file=sys.stderr)
            status = max(status, 2)
    return status


if __name__ == '__main__':
    if os.environ.get('PYTHONHASHSEED') != '0':      # fixed set order → byte-identical DXF
        os.execve(sys.executable, [sys.executable] + sys.argv, {**os.environ, 'PYTHONHASHSEED': '0'})
    sys.stdout.reconfigure(encoding='utf-8')
    sys.exit(main())
