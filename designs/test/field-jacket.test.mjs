import assert from 'node:assert/strict'
import { FieldJacket } from '../field-jacket/src/index.mjs'
import { testJacket } from './jacket-checks.mjs'

// Patch pockets lie on the front, clear of its edges, with room for a flap above
const patches = (pattern) => {
  const p = pattern.setStores[0].get('coat.pockets', null)
  if (!p) return
  const bb = pattern.parts[0]['boxcoat.front'].paths.seam.bbox()
  const f = pattern.setStores[0].get('jacket.front')
  for (const [id, q] of Object.entries(p)) {
    assert.ok(q.w > 30 && q.h > 30, `${id} pocket ${q.w.toFixed(0)} x ${q.h.toFixed(0)}`)
    assert.ok(q.x > f.cfx && q.x + q.w < bb.bottomRight.x && q.y + q.h < f.hemY, `${id} pocket on the front`)
  }
}

testJacket('field jacket', FieldJacket, {
  default: {},
  plain: { breastPockets: false, pocketFlaps: false, pocketShape: 'rounded', buttons: 4 },
  long: { lengthBelowWaist: 0.45, flare: 0.05, pockets: true, lowerPockets: false },
}, patches)
