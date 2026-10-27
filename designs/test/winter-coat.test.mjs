import assert from 'node:assert/strict'
import { WinterCoat } from '../winter-coat/src/index.mjs'
import { testCoat, near } from './coat-checks.mjs'

// The armhole's pieces add up to the armhole the sleeve was fitted to; the yoke seams stay
// above the underarm; the pocket stays below the yoke
function yokes(pattern) {
  const store = pattern.setStores[0]
  const back = store.get('coat.backArmhole')
  near(back.below + back.above, store.get('library.sleeve.backArmholeLength'), 0.5, 'back armhole')
  const front = store.get('coat.frontYoke')
  near(front.below + front.above, store.get('library.sleeve.frontArmholeLength'), 0.5, 'front armhole')
  const fp = pattern.parts[0]['wintercoat.front'].points
  assert.ok(fp.armYoke.y < fp.armhole.y && fp.edgeYoke.y < fp.armhole.y, 'front yoke above the underarm')
  const welts = store.get('coat.welts', null)
  if (welts) assert.ok(Math.min(welts.hand.y0, welts.hand.y1) > fp.edgeYoke.y, 'pocket below the yoke')
}

testCoat('winter coat', WinterCoat, 'wintercoat.frontBase', {
  default: {},
  hooded: { hood: true, lining: false, handPockets: false, buttons: 6, lengthBelowWaist: 1.6 },
}, yokes)
