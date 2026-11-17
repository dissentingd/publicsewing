"""Render a draped garment on its body in Blender (Cycles), for nicer drape pictures.

Run with Blender's own Python, headless:
  blender -b -P tools/drape_render.py -- <garment>_sim.obj <body>.obj <out prefix>
      [--garment-scale 0.01] [--color 0.05,0.08,0.15] [--samples 96] [--size 900x1350]

GarmentCode writes the draped garment in cm and its bodies in m, hence --garment-scale.
Both are y up with the body facing +z; Blender's OBJ import turns that into z up, facing -y.
Writes <out prefix>_front.png, _back.png and _three-quarter.png.
  --decals <decals.json> --rest <run>_boxmesh.obj: also buttons ({buttons: [{at, r}]}) and
  stitching ({lines: [[p, ...] or {pts, kind: edge|stitch}]}), points on the flat starting mesh.
"""
import math
import sys

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
garment_path, body_path, out = argv[:3]
opts = dict(zip(argv[3::2], argv[4::2]))
g_scale = float(opts.get('--garment-scale', 0.01))
color = [float(c) for c in opts.get('--color', '0.05,0.08,0.15').split(',')] + [1.0]
samples = int(opts.get('--samples', 96))
width, height = (int(n) for n in opts.get('--size', '900x1350').split('x'))

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def load(path, scale):
    bpy.ops.wm.obj_import(filepath=path, up_axis='Y', forward_axis='NEGATIVE_Z')
    obj = bpy.context.selected_objects[0]
    obj.scale = (scale,) * 3
    bpy.ops.object.transform_apply(scale=True)
    for poly in obj.data.polygons:
        poly.use_smooth = True
    obj.data.materials.clear()
    return obj


def material(name, rgba, roughness, sheen=0.0, bump=None):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    p = nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = rgba
    p.inputs['Roughness'].default_value = roughness
    p.inputs['Sheen Weight'].default_value = sheen
    p.inputs['Sheen Roughness'].default_value = 0.4
    if bump:  # a fine weave, so the cloth doesn't read as plastic
        tex = nodes.new('ShaderNodeTexWave')
        tex.inputs['Scale'].default_value = bump
        tex.inputs['Distortion'].default_value = 2.0
        b = nodes.new('ShaderNodeBump')
        b.inputs['Strength'].default_value = 0.08
        links.new(tex.outputs['Fac'], b.inputs['Height'])
        links.new(b.outputs['Normal'], p.inputs['Normal'])
    return mat


body = load(body_path, 1.0)
body.data.materials.append(material('body', (0.62, 0.60, 0.57, 1), 0.55))

garment = load(garment_path, g_scale)
trims = []
if '--decals' in opts and '--rest' in opts:
    # Buttons and stitching drawn on the draped cloth: decals.json gives points on the flat
    # starting mesh (GarmentCode cm, y up; --rest, the run's _boxmesh.obj, same vertices in the
    # same order as the draped mesh); each is carried to the drape through its triangle
    import json
    from mathutils.bvhtree import BVHTree
    from mathutils.geometry import barycentric_transform
    rest = load(opts['--rest'], g_scale)
    rv, sv = rest.data.vertices, garment.data.vertices
    tree = BVHTree.FromPolygons([v.co for v in rv], [tuple(p.vertices) for p in garment.data.polygons])
    decals = json.load(open(opts['--decals']))

    def on_cloth(p, lift):
        q = Vector((p[0], -p[2], p[1])) * g_scale
        loc, _, face, _ = tree.find_nearest(q)
        f = garment.data.polygons[face].vertices[:3]
        at = barycentric_transform(loc, *(rv[i].co for i in f), *(sv[i].co for i in f))
        n = (sv[f[1]].co - sv[f[0]].co).cross(sv[f[2]].co - sv[f[0]].co).normalized()
        axis = Vector((0, 0, at.z))  # outward = away from the body's vertical axis
        out_dir = at - axis
        out_dir.z = 0
        faces_out = n.dot(out_dir) > 0
        if not faces_out:
            n = -n
        # Solidify grows the cloth along its normals: past it when they face out
        return at + n * (lift + (0.0025 if faces_out else 0)), n

    thread = material('thread', [c * 1.8 for c in color[:3]] + [1], 0.6)
    shell = material('button', (0.85, 0.83, 0.78, 1), 0.25)
    edge = material('edge', [c * 0.35 for c in color[:3]] + [1], 0.9)
    for b in decals.get('buttons', []):
        at, n = on_cloth(b['at'], 0.0012)
        bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=b['r'] * g_scale, depth=0.0025, location=at)
        btn = bpy.context.active_object
        btn.rotation_euler = n.to_track_quat('Z', 'Y').to_euler()
        bevel = btn.modifiers.new('round', 'BEVEL')
        bevel.width = 0.0008
        bevel.segments = 3
        btn.data.materials.append(shell)
        trims.append(btn)
    for line in decals.get('lines', []):
        kind = line.get('kind', 'stitch') if isinstance(line, dict) else 'stitch'
        pts = [on_cloth(p, 0.0006)[0] for p in (line['pts'] if isinstance(line, dict) else line)]
        curve = bpy.data.curves.new('trim', 'CURVE')
        curve.dimensions = '3D'
        curve.bevel_depth = 0.0007 if kind == 'edge' else 0.0004
        # Stitching as dashes (every other step), an edge as one line
        runs = [pts] if kind == 'edge' else [pts[i:i + 2] for i in range(0, len(pts) - 1, 2)]
        for run in runs:
            s = curve.splines.new('POLY')
            s.points.add(len(run) - 1)
            for sp, p in zip(s.points, run):
                sp.co = (*p, 1)
        obj = bpy.data.objects.new('trim', curve)
        scene.collection.objects.link(obj)
        obj.data.materials.append(edge if kind == 'edge' else thread)
        trims.append(obj)
    bpy.data.objects.remove(rest)
garment.data.materials.append(material('cloth', color, 0.85, sheen=0.6, bump=400))
solid = garment.modifiers.new('thickness', 'SOLIDIFY')
solid.thickness = 0.0025
solid.offset = 1.0
garment.modifiers.new('smooth', 'SUBSURF').levels = 1

# Stand the body on the floor, centred.
zs = [(body.matrix_world @ v.co).z for v in body.data.vertices]
xs = [(body.matrix_world @ v.co).x for v in body.data.vertices]
ys = [(body.matrix_world @ v.co).y for v in body.data.vertices]
shift = Vector((-(min(xs) + max(xs)) / 2, -(min(ys) + max(ys)) / 2, -min(zs)))
for obj in (body, garment, *trims):
    obj.location += shift
tall = max(zs) - min(zs)

# Floor and backdrop: a plane curving up behind the figure.
bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, 0))
floor = bpy.context.active_object
floor.data.materials.append(material('floor', (0.82, 0.81, 0.79, 1), 0.9))

world = bpy.data.worlds.new('world')
scene.world = world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.78, 0.78, 0.77, 1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.2


def light(name, kind, energy, loc, size=2.0, color=(1, 1, 1)):
    data = bpy.data.lights.new(name, kind)
    data.energy = energy
    data.color = color
    if kind == 'AREA':
        data.size = size
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    obj.location = loc
    direction = Vector((0, 0, tall * 0.55)) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
    return obj


rig = bpy.data.objects.new('rig', None)  # lights turn with the camera
scene.collection.objects.link(rig)
for lt in (light('key', 'AREA', 220, (-2.2, -2.8, 2.8), 2.5, (1, 0.97, 0.92)),
           light('fill', 'AREA', 60, (2.8, -2.2, 1.4), 3.0, (0.92, 0.95, 1)),
           light('rim', 'AREA', 180, (1.2, 3.0, 2.6), 1.5)):
    lt.parent = rig

cam_data = bpy.data.cameras.new('cam')
cam_data.lens = 85
cam = bpy.data.objects.new('cam', cam_data)
scene.collection.objects.link(cam)
scene.camera = cam

scene.render.engine = 'CYCLES'
prefs = bpy.context.preferences.addons['cycles'].preferences
for kind in ('OPTIX', 'CUDA'):
    try:
        prefs.compute_device_type = kind
        prefs.get_devices()
        if any(d.type == kind for d in prefs.devices):
            for d in prefs.devices:
                d.use = d.type == kind
            scene.cycles.device = 'GPU'
            break
    except TypeError:
        continue
scene.cycles.samples = samples
scene.cycles.use_denoising = True
scene.render.resolution_x, scene.render.resolution_y = width, height
scene.render.film_transparent = False
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'

# Frame the whole figure: distance from the vertical field of view.
cam_data.sensor_fit = 'VERTICAL'
cam_data.sensor_height = 24
fov = 2 * math.atan(cam_data.sensor_height / 2 / cam_data.lens)
dist = tall * 1.12 / 2 / math.tan(fov / 2)
target = Vector((0, 0, tall * 0.5))
for view, angle in (('front', 0), ('three-quarter', -35), ('back', 180)):
    a = math.radians(angle)
    cam.location = target + Vector((math.sin(a) * dist, -math.cos(a) * dist, tall * 0.05))
    cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()
    rig.rotation_euler = (0, 0, a)
    scene.render.filepath = f'{out}_{view}.png'
    bpy.ops.render.render(write_still=True)
    print('WROTE', scene.render.filepath)
