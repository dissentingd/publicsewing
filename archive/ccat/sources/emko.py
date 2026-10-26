"""ЕМКО СЭВ source adapter: transcribed tables → validated recipe inputs.

Table YAML (pilot/emko/jacket_176-100-88.yaml): rows with n, seg, f, base,
ps, pp, pk, fin, pt, p, draft. Garment YAML (pilot/emko/*_176-100-88.yaml):
a `draft:` mapping of row number → value on the draft.

Recipe input names: row n → "r<n>", with a decimal row such as 50.1 → "r50_1".
"""
import yaml

from ..table import check_identities

IDENTITIES = ['pk == ps + pp', 'fin == base + pk', 'p == pk + pt', 'draft == base + p']
TOL = 0.06   # the book rounds to 0.05 cm
# Gate floor (ccat.checks): the step the book prints its values to, in cm. Most cells
# are multiples of 0.05; a few are printed to 0.01, which this floor doesn't loosen.
PRINTED_STEP = 0.05


def row_name(n):
    return 'r' + str(n).replace('.', '_')


def load(path):
    with open(path, encoding='utf-8') as f:
        return yaml.safe_load(f)


def validate_rows(rows):
    return check_identities(rows, IDENTITIES, TOL)


def inputs_from_rows(rows):
    """Draft values by row, after the row identities pass. Raises if any row fails."""
    issues, _, _ = validate_rows(rows)
    if issues:
        raise ValueError('table rows fail their identities: ' +
                         '; '.join(f'row {i.row}: {i.identity} off by {i.diff:+.3f}' for i in issues))
    return {row_name(r['n']): float(r['draft']) for r in rows if isinstance(r.get('draft'), (int, float))}


# garment YAML section -> input prefix: Table x.2 base construction (draft), Table x.3
# model construction ИМК (imk), its sleeve part (imk_sleeve), and the МК block (mk) where a
# table has one (Table 6.3)
SECTIONS = {'draft': 'r', 'imk': 'm', 'imk_sleeve': 'n', 'mk': 'k'}


def inputs_from_garment(doc):
    """Garment YAML sections → inputs: draft row N → rN, imk row N → mN, imk_sleeve row N → nN,
    mk row N → kN, coefficients by name. `traces: {name: [[u, v], ...]}` (curves the book leaves
    "по модели" and draws only, traced from its figure in a chord frame) → name_u1, name_v1, …."""
    out = {}
    for sec, prefix in SECTIONS.items():
        for k, v in (doc.get(sec) or {}).items():
            out[prefix + row_name(k)[1:]] = float(v)
    for k, v in (doc.get('coefficients') or {}).items():   # coefficients inside row formulas (e.g. к81)
        out[str(k)] = float(v)
    for name, pts in (doc.get('traces') or {}).items():
        for i, (u, v) in enumerate(pts, 1):
            out[f'{name}_u{i}'], out[f'{name}_v{i}'] = float(u), float(v)
    return out


# The pilot's garment YAMLs keep sleeve and check rows under names; map them back
# to their Table x.2 rows. k81 is a coefficient inside row 81's formula, not a row.
PILOT_NAMES = {'dp': '63.1', 'dor': '63.3', 'shor': '71', 'vor': '72', 'len': '88', 'elbow': '89',
               'cuff': '90', 'cuff_mid': '91'}


def inputs_from_pilot_garment(doc):
    """Pilot garment YAML (draft + dp + sleeve_rows) → inputs. NaN/absent values are left out."""
    out = inputs_from_garment(doc)
    named = dict(doc.get('sleeve_rows') or {})
    if 'dp' in doc:
        named['dp'] = doc['dp']
    for k, v in named.items():
        if k in PILOT_NAMES and isinstance(v, (int, float)) and v == v:
            out[row_name(PILOT_NAMES[k])] = float(v)
        elif k == 'k81':
            out['k81'] = float(v)
    return out


def inputs_from_graded_table(doc, figure):
    """Graded table (pilot/emko/jacket_table14.yaml: rows / sleeve / calc, one column per
    typical figure) → inputs for one figure. Only what the table prints: a cell held as unreadable
    (null) is left out, so a recipe that needs it stops for that figure only."""
    col = doc['figures'].index(figure)
    out = {row_name(k): float(v[col]) for k, v in doc['rows'].items() if v[col] is not None}
    for sec in ('sleeve', 'calc'):
        for k, v in (doc.get(sec) or {}).items():
            if k in PILOT_NAMES:
                out[row_name(PILOT_NAMES[k])] = float(v[col])
    return out


def inputs_from_graded(rules, figure, root='.'):
    """Graded data per a rules file (data/emko/jacket_graded.yaml): the graded table's
    printed values for one figure, plus rows derived by the base table's own formulas
    and the garment's coefficients."""
    from pathlib import Path
    from ..expr import evaluate
    out = inputs_from_graded_table(load(Path(root) / rules['table']), figure)
    for name, expr in (rules.get('derived') or {}).items():
        if name not in out:
            out[name] = evaluate(expr, out.__getitem__)
    for k, v in (rules.get('coefficients') or {}).items():
        out[str(k)] = float(v)
    return out
