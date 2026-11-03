import assert from 'node:assert/strict'
import { WomensPeacoat } from '../womens-peacoat/src/index.mjs'
import { testJacket } from './jacket-checks.mjs'

// Double-breasted: both rows of buttons lie on the front, and the buttonholes (the outer row)
// on the facing
const rows = (pattern) => {
  const store = pattern.setStores[0]
  const f = store.get('jacket.front')
  // The storm collar: the buttons start below the neck
  if (f.closed) assert.ok(f.buttonTop > f.B.y, 'buttons below the neck')
  if (!f.rows) return
  const front = pattern.parts[0]['tailoredjacket.front']
  const bb = front.paths.seam.bbox()
  for (const [k, s] of Object.entries(front.snippets).filter(([k]) => k.startsWith('button'))) {
    assert.ok(s.anchor.x > f.edgeX && s.anchor.x < bb.bottomRight.x, `${k} on the front`)
  }
  assert.ok(f.cfx - f.rows > f.edgeX && f.cfx - f.rows < f.facingX, 'the buttonholes are on the facing')
  // The inner row stays clear of the front seam at every height, as on Merz's diagram
  const chest = pattern.settings[0].measurements.chest
  for (const [k, q] of Object.entries(front.snippets).filter(([, q]) => q.def === 'button')) {
    const seam = Math.max(...front.paths.seam.intersectsY(q.anchor.y).map((h) => h.x))
    assert.ok(seam - q.anchor.x > 0.015 * chest, `${k} ${(seam - q.anchor.x).toFixed(0)} mm from the seam`)
  }
}

testJacket('women\'s peacoat', WomensPeacoat, {
  default: {},
  notch: { lapelStyle: 'notch' },
  single: { doubleBreasted: false, buttonExtension: 0.04, buttons: 4, lapelStyle: 'peak' },
  long: { lengthBelowWaist: 0.5, buttons: 4, pockets: false, lining: false },
}, rows)
