"""Write a GarmentCode pattern specification for a catalog entry, for a 3D drape.

usage: python scripts/drape_export.py catalog/emko.yaml <entry id> <out dir>

Writes <out dir>/<id>/<id>_specification.json (GarmentCode needs that name) from the
entry's recipe, which must have `seams:` and `drape:` sections (ccat.garmentcode). The
gate result is printed alongside, since a drape of a garment out of gate tells you about
the drape, not the source. Then run docker/ccat_sim.py in the garmentcode container.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / 'scripts'))
import yaml                                    # noqa: E402

import catalog_build as CB                     # noqa: E402
from ccat import garmentcode as GC             # noqa: E402
from ccat import recipe as R                   # noqa: E402
from ccat.checks import run_checks             # noqa: E402
from ccat.sources import emko                  # noqa: E402


def main(config, entry_id, out_dir):
    cfg = yaml.safe_load((ROOT / config).read_text(encoding='utf-8'))
    (e,) = [x for x in cfg['entries'] if x['id'] == entry_id]
    data, *_ = CB.load_data(e['data'])
    pattern = R.build(R.load(ROOT / e['recipe']), data)
    gate = run_checks(pattern, emko.PRINTED_STEP)
    spec = GC.build_spec(pattern)
    d = Path(out_dir) / entry_id
    d.mkdir(parents=True, exist_ok=True)
    out = d / f'{entry_id}_specification.json'
    out.write_text(json.dumps(spec, indent=1), encoding='utf-8')
    p = spec['pattern']
    print(f'{out}: {len(p["panels"])} panels, {len(p["stitches"])} stitches; '
          f'body {pattern.recipe["drape"]["body"]}; gate {"PASS" if gate.passed else "FAIL"}')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main(*sys.argv[1:4])
