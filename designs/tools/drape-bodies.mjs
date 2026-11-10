// Pick, for each of our size sets, the nearest of GarmentCodeData's 5000 body shapes, so a design
// can drape at several sizes instead of only on the two average bodies.
// Usage: node tools/drape-bodies.mjs [index.json]   (default out/bodies-index.json)
//   The index comes from tools/drape_bodies.py on the GPU host (the dataset is CC BY-SA 4.0 and
//   stays there; copy the index into out/, gitignored). Writes drape/bodies.yaml: each set's
//   body id and how far it is, our own numbers only.
//
// Distance: the weighted mean of relative differences over the measurements both sides have
// (GarmentCode's in cm, ours in mm). Its waist height is height - head_l (nape to crown) -
// waist_line (nape to waist); its `hips` is the fullest hip, our `seat`. A set whose nearest
// body is more than MAX_ERROR off gets none: the children's sets, since the dataset's smallest
// body is 147 cm tall.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { stringify } from 'yaml'
import { sets } from '../test/coat-checks.mjs'

const DESIGNS = new URL('..', import.meta.url).pathname.replace(/^\/(\w:)/, '$1')
const MAX_ERROR = 0.05

/** our name (mm) -> [GarmentCode's (cm), weight] */
const PAIRS = {
  chest: [(b) => b.bust, 2],
  waist: [(b) => b.waist, 2],
  seat: [(b) => b.hips, 2],
  waistToFloor: [(b) => b.height - b.head_l - b.waist_line, 2],
  // Shown but not weighed: these differ by definition, not by body. Its waist_line runs from
  // the nape (ours from the high shoulder point) and reads 10-25% short on every set; its
  // arm_length, 5-9% short
  hpsToWaistBack: [(b) => b.waist_line, 0],
  underbust: [(b) => b.underbust, 0.5],
  shoulderToWrist: [(b) => b.arm_length, 0],
  upperLeg: [(b) => b.leg_circ, 1],
  wrist: [(b) => b.wrist, 0.5],
}

export function distance(set, body) {
  let sum = 0
  let w = 0
  const parts = {}
  for (const [k, [f, weight]] of Object.entries(PAIRS)) {
    if (set[k] == null) continue
    const d = (f(body) * 10 - set[k]) / set[k]
    parts[k] = Math.round(d * 1000) / 10 // %
    sum += weight * Math.abs(d)
    w += weight
  }
  return { error: sum / w, parts }
}

const index = JSON.parse(readFileSync(process.argv[2] ?? join(DESIGNS, 'out', 'bodies-index.json'), 'utf8'))
const out = {}
for (const [name, set] of Object.entries(sets)) {
  let best
  for (const [id, body] of Object.entries(index)) {
    const d = distance(set, body)
    if (!best || d.error < best.error) best = { id, ...d }
  }
  const pct = Math.round(best.error * 1000) / 10
  out[name] = best.error <= MAX_ERROR ? { body: best.id, error: pct, off: best.parts } : { body: null, nearest: best.id, error: pct }
  console.log(`${name.padEnd(18)} ${best.error <= MAX_ERROR ? best.id : '  -  '}  ${String(pct).padStart(5)}%  ${Object.entries(best.parts).map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`).join(', ')}`)
}
writeFileSync(
  join(DESIGNS, 'drape', 'bodies.yaml'),
  `# Each size set's nearest body in GarmentCodeData v2's 5000 body shapes (ETH Zurich, CC BY-SA 4.0;
# the data stays on the GPU host), from tools/drape-bodies.mjs. error: the weighted mean
# difference in %, off: each measurement's (+ means the body is bigger). body: null when none is
# within ${MAX_ERROR * 100}% (nearest says which was closest). Drape on one as gcd_<body>.
${stringify(out)}`,
)
