"""Index GarmentCodeData's 5000 body shapes, and install one for a drape (on the GPU host).

usage: python3 tools/drape_bodies.py index <bodies dir> <out.json>
       python3 tools/drape_bodies.py install <bodies dir> <id> <data dir>

<bodies dir> is the extracted 5000_body_shapes_and_measures.tar.gz (measurements/, meshes/,
meta/) from GarmentCodeData v2 (ETH Zurich, CC BY-SA 4.0). Its data stays on the host: the
repo keeps only which body each size set drapes on (drape/bodies.yaml, from
tools/drape-bodies.mjs). `install` copies body <id>'s mesh (arms apart, the A-pose our
configs place sleeves for) and measurements to <data dir>/bodies/gcd_<id>.obj and .yaml;
docker/ccat_sim.py links them into GarmentCode's bodies folder when a drape asks for one.
"""
import json
import shutil
import sys
from pathlib import Path

import yaml


def index(src, out):
    rows = {}
    for f in sorted(Path(src, 'measurements').glob('*.yaml')):
        rows[f.stem] = yaml.safe_load(f.read_text())['body']
    Path(out).write_text(json.dumps(rows))
    print(f'{out}: {len(rows)} bodies')


def install(src, id_, data):
    dst = Path(data, 'bodies')
    dst.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(Path(src, 'meshes', f'{id_}_apart.obj'), dst / f'gcd_{id_}.obj')
    shutil.copyfile(Path(src, 'measurements', f'{id_}.yaml'), dst / f'gcd_{id_}.yaml')
    print(dst / f'gcd_{id_}.obj')


if __name__ == '__main__':
    cmd, *args = sys.argv[1:]
    {'index': index, 'install': install}[cmd](*args)
