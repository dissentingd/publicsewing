"""Run a recipe against one data set and apply the gate.

usage: python -m ccat run <recipe.yaml> <data.yaml> [--source plain|emko-table|emko-garment|mitchell-garment]
                          [--svg out.svg] [--json report.json]

The gate uses the source adapter's PRINTED_STEP (plain data: strict 1%).

Exit codes: 0 gate passed, 2 gate failed, 3 recipe/data error (the pipeline
stopped instead of guessing; the message says where).
"""
import argparse
import json
import sys

from . import recipe as R
from . import svg
from .checks import run_checks
from .sources import emko, mitchell


def load_data(path, kind):
    doc = R.load(path)
    if kind == 'emko-table':
        return emko.inputs_from_rows(doc['rows'])
    if kind == 'emko-garment':
        return emko.inputs_from_garment(doc)
    if kind == 'mitchell-garment':
        return mitchell.inputs_from_garment(doc)
    if not isinstance(doc, dict):
        raise ValueError('plain data must be a mapping of name: number')
    return doc


PRINTED_STEP = {'plain': None, 'emko-table': emko.PRINTED_STEP, 'emko-garment': emko.PRINTED_STEP,
                'mitchell-garment': mitchell.PRINTED_STEP}


def main(argv=None):
    ap = argparse.ArgumentParser(prog='python -m ccat')
    sub = ap.add_subparsers(dest='cmd', required=True)
    run = sub.add_parser('run')
    run.add_argument('recipe')
    run.add_argument('data')
    run.add_argument('--source', default='plain', choices=list(PRINTED_STEP))
    run.add_argument('--svg')
    run.add_argument('--json')
    a = ap.parse_args(argv)
    try:
        pattern = R.build(R.load(a.recipe), load_data(a.data, a.source))
        report = run_checks(pattern, PRINTED_STEP[a.source])
    except (R.RecipeError, ValueError) as e:
        print(f'STOPPED: {e}', file=sys.stderr)
        return 3
    print(report.text())
    if a.svg:
        svg.write(pattern, a.svg)
    if a.json:
        with open(a.json, 'w', encoding='utf-8') as f:
            json.dump(report.as_dict(), f, ensure_ascii=False, indent=1)
    return 0 if report.passed else 2


if __name__ == '__main__':
    sys.exit(main())
