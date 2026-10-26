"""Mitchell, *The New "Standard" Work on Designing and Pattern-Making of Ladies' Tailor-Made
Garments* (1921): numbered-point drafts ("16 from 12 is ½ bust on the 6ths"), each with a
full-page diagram drawn to scale (scale not printed) and every point marked.

The divisional square's scales: "N on the 6ths" is N/6 inches (the square's scale of sixths
read at N), so "½ bust on the 6ths" is bust/12.

A garment's data file (data/mitchell/<garment>.yaml):

    source: {pages: [16, 17], ...}
    measures: {bust: 39, ...}             # inches, as printed in the draft's "measures are as follows"
    style: {shoulder_width: 6, ...}       # inches the text gives "in this case" (choices, not measures)
    drawings: {p17: data/mitchell/trace/p-017.yaml, ...}   # diagram pages (scripts/mitchell_trace.py)

Inputs for the recipe (cm): every measure and style value under its own name; the diagrams go
to data['@drawings'] as the trace caches hold them (paper inches; the recipe's `drawing:`
section fits each one, ccat.recipe).
"""
from pathlib import Path

import yaml

IN = 2.54
PRINTED_STEP = 0.25 * IN     # the measures and rules are printed to the ¼ inch (7¼, 10½, 1¼; a
                             # few ⅛ and 1/16 steps), and ¼ in is the cap (CLAUDE.md)


def load(path):
    return yaml.safe_load(Path(path).read_text(encoding='utf-8'))


def inputs_from_garment(doc, root='.'):
    out = {}
    for sec in ('measures', 'style'):
        for k, v in (doc.get(sec) or {}).items():
            if k in out:
                raise ValueError(f'{k!r} is in both measures and style')
            out[str(k)] = float(v) * IN
    drawings = {}
    for name, ref in (doc.get('drawings') or {}).items():
        cache = load(Path(root) / ref)
        drawings[str(name)] = {'markers': cache['markers'], 'traces': cache.get('traces') or []}
    out['@drawings'] = drawings
    return out
