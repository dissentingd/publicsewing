"""Capture the pilot jacket builder's outputs at full precision (regression reference).
Runs where numpy is available (tools image):
  python tests/fixtures/make_pilot_ref.py > tests/fixtures/pilot_jacket_ref.json
The pilot is the porting reference only; the gate checks against the book's values."""
import io, json, os, runpy, sys, tempfile, contextlib

here = os.path.dirname(os.path.abspath(__file__))
script = os.path.join(here, '..', '..', 'pilot', 'emko', 'emko_jacket.py')
out = {}
for flag in ('', '--imk'):
    tmp = tempfile.mkdtemp()
    sys.argv = [script, os.path.join(tmp, 'j')] + ([flag] if flag else [])
    with contextlib.redirect_stdout(io.StringIO()):
        g = runpy.run_path(script, run_name='__main__')
    pts = lambda d: {k: [float(v[0]), float(v[1])] for k, v in d.items() if v is not None}
    rec = {'P': pts(g['P']), 'S': pts(g['S']), 'checks': {k: float(v) for k, v in g['checks'].items()},
           'armhole': float(g['armhole']), 'cap_len': float(g['cap_len']), 'under_len': float(g['under_len'])}
    if g.get('IMK'):
        rec['Q'] = pts(g['IMK']['Q']); rec['imk_checks'] = {k: float(v) for k, v in g['IMK']['checks'].items()}
    if g.get('TWO'):
        rec['T'] = pts(g['TWO']['T']); rec['two_checks'] = {k: float(v) for k, v in g['TWO']['checks'].items()}
    out[flag or 'base'] = rec
json.dump(out, sys.stdout, ensure_ascii=False, indent=0)
