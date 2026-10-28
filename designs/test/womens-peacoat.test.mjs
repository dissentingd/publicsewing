import assert from 'node:assert/strict'
import { WomensPeacoat } from '../womens-peacoat/src/index.mjs'
import { testJacket } from './jacket-checks.mjs'

// Double-breasted: both rows of buttons lie on the front, and the buttonholes (the outer row)
// on the facing
const rows = (pattern) => {
  const store = pattern.setStores[0]
  const f = store.get('jacket.front')
  if (!f.rows) return
  const front = pattern.parts[0]['tailoredjacket.front']
  const bb = front.paths.seam.bbox()
  for (const [k, s] of Object.entries(front.snippets).filter(([k]) => k.startsWith('button'))) {
    assert.ok(s.anchor.x > f.edgeX && s.anchor.x < bb.bottomRight.x, `${k} on the front`)
  }
  assert.ok(f.cfx - f.rows > f.edgeX && f.cfx - f.rows < f.facingX, 'the buttonholes are on the facing')
}

testJacket('women\'s peacoat', WomensPeacoat, {
  default: {},
  single: { doubleBreasted: false, buttonExtension: 0.04, buttons: 4, lapelStyle: 'peak' },
  long: { lengthBelowWaist: 0.5, buttons: 4, pockets: false, lining: false },
}, rows)
