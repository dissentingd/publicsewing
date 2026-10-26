"""Where a drape's cloth goes inside the body, by region: each cloth vertex against the nearest
body vertex's normal (within 3 cm). A proxy for GarmentCode's body-cloth intersection count,
not the same measure: use it to see where the contacts are and how deep.

Run in the garmentcode container (numpy, scipy, trimesh):
  python /data/drape_inside.py /data/Logs/<run>/<name>_sim.obj /opt/garmentcode/assets/bodies/<body>.obj [--json]
(--json: one JSON object, { inside, distinct, regions: { <region>: { count, deepest, median } } },
for tools/drape.mjs)

The body mesh is in metres, the cloth in cm. Positions: cm, y up, the body facing +z, arms
out to the sides in the A-pose. (The run's _sim_segmentation.txt has fewer lines than the sim
mesh has vertices, so its panel labels can't be matched to vertices; regions go by position.)
"""
import sys
from collections import Counter

import numpy as np
import trimesh
from scipy.spatial import cKDTree

cloth = trimesh.load(sys.argv[1], process=False)
body = trimesh.load(sys.argv[2], process=False)
body.apply_scale(100)  # m -> cm, as the cloth

dist, idx = cKDTree(body.vertices).query(cloth.vertices)
side = np.einsum('ij,ij->i', cloth.vertices - body.vertices[idx], body.vertex_normals[idx])
inside = np.where((side < 0) & (dist < 3))[0]


def region(p):
    x, y, _ = p
    if abs(x) > 45:
        return 'wrist/hand'
    if abs(x) > 20:
        return 'forearm/elbow'
    if abs(x) > 14 and y > 115:
        return 'upper arm/shoulder'
    if y > 125:
        return 'chest/back/shoulders'
    if y > 95:
        return 'waist/hips'
    return 'thighs/legs'


distinct = len(np.unique(cloth.vertices[inside].round(3), axis=0))
by = {}
for i in inside:
    by.setdefault(region(cloth.vertices[i]), []).append(-side[i])
if '--json' in sys.argv:
    import json
    print(json.dumps({'inside': int(len(inside)), 'distinct': int(distinct), 'regions': {
        r: {'count': len(d), 'deepest': round(float(max(d)), 2), 'median': round(float(np.median(d)), 2)} for r, d in by.items()}}))
    sys.exit()
print(f'cloth vertices inside the body: {len(inside)} ({distinct} distinct positions)')
for r, depths in sorted(by.items(), key=lambda kv: -len(kv[1])):
    print(f'{len(depths):4d}  {r:22s} deepest {max(depths):.2f} cm, median {np.median(depths):.2f} cm')
