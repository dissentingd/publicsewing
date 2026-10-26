"""Drape a GarmentCode pattern spec on a chosen body (runs inside the garmentcode container).

GarmentCode's test_garment_sim.py hard-codes the mean_all body; this is the same run with
the body as an argument. Copy it to the container's /data and run from /opt/garmentcode:

    docker exec garmentcode python /data/ccat_sim.py -p /data/ccat/<id>/<id>_specification.json \
        -b m_smpl_average_A40

Outputs land in system.json's output folder (/data/Logs/<id>_<timestamp>/).
"""
import argparse
from pathlib import Path

import pygarment.data_config as data_config
from pygarment.meshgen.boxmeshgen import BoxMesh
from pygarment.meshgen.sim_config import PathCofig
from pygarment.meshgen.simulation import run_sim

ap = argparse.ArgumentParser()
ap.add_argument('-p', '--pattern_spec', required=True)
ap.add_argument('-b', '--body', default='mean_all')
ap.add_argument('-s', '--sim_config', default='./assets/Sim_props/default_sim_props.yaml')
a = ap.parse_args()

props = data_config.Properties(a.sim_config)
props.set_section_stats('sim', fails={}, sim_time={}, spf={}, fin_frame={}, body_collisions={}, self_collisions={})
props.set_section_stats('render', render_time={})
spec = Path(a.pattern_spec)
name = spec.stem.rpartition('_')[0]
paths = PathCofig(in_element_path=spec.parent, out_path=data_config.Properties('./system.json')['output'],
                  in_name=name, body_name=a.body, smpl_body='smpl' in a.body, add_timestamp=True)
mesh = BoxMesh(paths.in_g_spec, props['sim']['config']['resolution_scale'])
mesh.load()
mesh.serialize(paths, store_panels=False, uv_config=props['render']['config']['uv_texture'])
props.serialize(paths.element_sim_props)
run_sim(mesh.name, props, paths, save_v_norms=False, store_usd=False, optimize_storage=False, verbose=False)
props.serialize(paths.element_sim_props)
print('OUT', paths.out_el)
