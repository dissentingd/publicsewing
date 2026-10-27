import assert from 'node:assert/strict'
import { Windbreaker } from '../windbreaker/src/index.mjs'
import { testCoat, near } from './coat-checks.mjs'

// The yokes: the yoke seams match by construction; the armhole's pieces add up to the armhole
// the sleeve was fitted to, and the yoke seams stay above the underarm
function yokes(pattern) {
  const store = pattern.setStores[0]
  const back = store.get('coat.backArmhole')
  near(back.below + back.above, store.get('library.sleeve.backArmholeLength'), 0.5, 'back armhole')
  const front = store.get('coat.frontYoke')
  near(front.below + front.above, store.get('library.sleeve.frontArmholeLength'), 0.5, 'front armhole')
  const fp = pattern.parts[0]['windbreaker.front'].points
  assert.ok(fp.armYoke.y < fp.armhole.y && fp.edgeYoke.y < fp.armhole.y, 'front yoke above the underarm')
}

testCoat('windbreaker', Windbreaker, 'windbreaker.frontBase', {
  default: {},
  collar: { hood: false, handPockets: false },
  sloped: { frontYokeDepth: 0.72, frontYokeArm: 0.36, hoodDrawstring: false, lengthBelowWaist: 1.6 },
}, yokes)
