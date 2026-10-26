"""Pilot results for the other ЕМКО garments and the graded jacket (blind-run baseline).
Runs where numpy is available (tools image):
  python tests/fixtures/make_pilot_garments_ref.py > tests/fixtures/pilot_garments_ref.json"""
import contextlib, glob, io, json, os, runpy, subprocess, sys, tempfile

here = os.path.dirname(os.path.abspath(__file__))
emko = os.path.join(here, '..', '..', 'pilot', 'emko')
script = os.path.join(emko, 'emko_jacket.py')
tmp = tempfile.mkdtemp()
with contextlib.redirect_stdout(io.StringIO()):
    sys.argv = ['g', os.path.join(emko, 'jacket_table14.yaml'), tmp]
    runpy.run_path(os.path.join(emko, 'emko_grade_jacket.py'))
garments = {os.path.basename(p)[:-len('_176-100-88.yaml')]: p for p in glob.glob(os.path.join(emko, '*_176-100-88.yaml'))
            if not os.path.basename(p).startswith('jacket_176')}
garments.update({'graded_' + os.path.basename(p)[len('jacket_'):-5]: p for p in sorted(glob.glob(os.path.join(tmp, 'jacket_*.yaml')))})
out = {}
for name, path in sorted(garments.items()):
    sys.argv = [script, os.path.join(tmp, name), path]
    g = {'__name__': '__main__', '__file__': script}
    with contextlib.redirect_stdout(io.StringIO()):
        try:                                     # exec, not runpy: the pilot sys.exit()s for sleeveless garments
            exec(compile(open(script, encoding='utf-8').read(), script, 'exec'), g)
        except SystemExit:
            pass
    out[name] = {'yaml': os.path.relpath(path, os.path.join(here, '..', '..')) if not path.startswith(tmp) else None,
                 'garment': g['GARMENT'], 'checks': {k: float(v) for k, v in g['checks'].items()},
                 'P': {k: [float(v[0]), float(v[1])] for k, v in g['P'].items()}}
    if path.startswith(tmp):
        import yaml
        out[name]['data'] = yaml.safe_load(open(path, encoding='utf-8'))
json.dump(out, sys.stdout, ensure_ascii=False, indent=0)
