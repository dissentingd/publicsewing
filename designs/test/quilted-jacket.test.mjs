import assert from 'node:assert/strict'
import { QuiltedJacket } from '../quilted-jacket/src/index.mjs'
import { testCoat, near } from './coat-checks.mjs'

// The armhole's pieces add up to the armhole the sleeve was fitted to; the sloped front yoke
// seam rises from the front edge to the armhole
function yokes(pattern) {
  const store = pattern.setStores[0]
  const back = store.get('coat.backArmhole')
  near(back.below + back.above, store.get('library.sleeve.backArmholeLength'), 0.5, 'back armhole')
  const front = store.get('coat.frontYoke')
  near(front.below + front.above, store.get('library.sleeve.frontArmholeLength'), 0.5, 'front armhole')
  const fp = pattern.parts[0]['quiltedjacket.front'].points
  assert.ok(fp.armYoke.y < fp.edgeYoke.y, 'front yoke seam slopes up to the armhole')
}

testCoat('quilted jacket', QuiltedJacket, 'quiltedjacket.frontBase', {
  default: {},
  plain: { hood: false, quilted: false, handPockets: false, buttons: 5 },
}, yokes)
