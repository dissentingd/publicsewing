"""Build a GarmentCode pattern specification from drafted outlines, for a 3D drape.

usage: python tools/drape_spec.py <outlines.json> <drape config.yaml> <out dir> <name> [--back <piece>]

<outlines.json> comes from tools/drape-export.mjs; the config (drape/*.yaml) says what sews to
what and where each piece sits on the body. Writes <out dir>/<name>/<name>_specification.json,
then drape it with docker/ccat_sim.py in the garmentcode container (designs/drape/README.md).
The seam stitching and placement are the archived pipeline's tested ccat.garmentcode, used
as is: points are named "<piece>.<point>".
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
import yaml                                    # noqa: E402

from ccat import garmentcode as GC             # noqa: E402


class Outlines:
    """What ccat.garmentcode.build_spec reads from a pattern."""

    def __init__(self, data, recipe):
        self.pieces = {k: [tuple(p) for p in v] for k, v in data['pieces'].items()}
        self.points = {k: tuple(v) for k, v in data['points'].items()}
        self.recipe = recipe


def rename(obj, old, new):
    """Replace piece name `old` (and its point prefix `old.`) in a config"""
    if isinstance(obj, dict):
        return {(new if k == old else k): rename(v, old, new) for k, v in obj.items()}
    if isinstance(obj, list):
        return [rename(v, old, new) for v in obj]
    if isinstance(obj, str):
        return new if obj == old else (new + obj[len(old):] if obj.startswith(old + '.') else obj)
    return obj


def main(outlines, config, out_dir, name, back='back'):
    data = json.loads(Path(outlines).read_text(encoding='utf-8'))
    cfg = yaml.safe_load(Path(config).read_text(encoding='utf-8'))
    if back != 'back':
        cfg = rename(cfg, 'back', back)
    recipe = {'seams': cfg['seams'], 'drape': {'body': cfg['body'], 'pieces': cfg['pieces']}}
    spec = GC.build_spec(Outlines(data, recipe))
    d = Path(out_dir) / name
    d.mkdir(parents=True, exist_ok=True)
    out = d / f'{name}_specification.json'
    out.write_text(json.dumps(spec, indent=1), encoding='utf-8')
    p = spec['pattern']
    print(f'{out}: {len(p["panels"])} panels, {len(p["stitches"])} stitches; body {cfg["body"]}')


if __name__ == '__main__':
    args = sys.argv[1:]
    back = 'back'
    if '--back' in args:
        i = args.index('--back')
        back = args[i + 1]
        del args[i:i + 2]
    main(*args[:4], back=back)
