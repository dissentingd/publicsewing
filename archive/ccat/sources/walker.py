"""Walker, *Manual of Needlework and Cutting Out* (1909): grid-drafted cutting-out diagrams.

The book's key (p. 227): each garment part sits in a "field" (a rectangle lettered A top left,
B top right, C bottom left, D bottom right); the figures give inches from a corner letter
(arrows mark which); a dotted field edge is a fold; the "L × B" inside a field is the cloth
required. So the drawn outlines are cut lines, turnings included.

A garment's data file (data/walker/<garment>.yaml):

    source: {pages: [235, 236], ...}
    fields:                                # traced fields this garment uses, by name
      body: {trace: data/walker/trace/p-235.yaml, field: 0}
    figures:                               # inches, as printed
      body: {neck_x: 12, ...}
    transcribed: {...}                     # who read the figures by hand, when, why (the trace
                                           # cache now has them read: ccat.figread)

Inputs for the recipe (cm): each figure as `<field>_<name>`; for each field its corner A
(`<field>_x0`, `<field>_y0`) and its measured size (`<field>_w`, `<field>_h`, from the
field lines, scale from the grid). Fields are laid side by side, 20 cm apart, so their traces
never overlap; every field's polylines go into data['@traces'].
"""
from pathlib import Path

import yaml

IN = 2.54
PRINTED_STEP = 0.25 * IN     # the figures are printed to the half inch (1½); the gate takes at
                             # most ¼ in (CLAUDE.md), so Walker is held to that, not loosened
FIELD_GAP = 20.0             # cm between fields laid side by side


def load(path):
    return yaml.safe_load(Path(path).read_text(encoding='utf-8'))


def inputs_from_garment(doc, root='.'):
    out, traces, x = {}, [], 0.0
    for name, ref in (doc.get('fields') or {}).items():
        cache = load(Path(root) / ref['trace'])
        f = cache['fields'][int(ref['field'])]
        w, h = (float(v) * IN for v in f['size_in'])
        out[f'{name}_x0'], out[f'{name}_y0'] = x, 0.0
        out[f'{name}_w'], out[f'{name}_h'] = w, h
        for t in f['traces']:
            traces.append([[x + float(u) * IN, float(v) * IN] for u, v in t])
        for k, v in ((doc.get('figures') or {}).get(name) or {}).items():
            out[f'{name}_{k}'] = float(v) * IN
        x += w + FIELD_GAP
    out['@traces'] = traces
    return out
