import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Breeches } from '../breeches/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = { default: {}, plain: { sidePockets: false, backPocket: false, beltLoops: 0, thighFlare: 0, breechesLength: 0.6 } }

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`breeches (${v}): ${name}`, () => {
      const pattern = new Breeches({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      for (const k of ['back', 'front']) assert.ok(!pattern.parts[0][`trousers.${k}`].hidden, `${k} is drawn`)
      const b = store.get('trousers.back')
      const f = store.get('trousers.front')
      // Front and back legs sew together, and the opening is the same length on both
      near(f.outseam, b.outseam, 1, 'outseam')
      near(f.inseam, b.inseam, 3, 'inseam')
      near(f.opening, b.opening, 2, 'opening')
      // The waistband fits the waist, past CF by the fly
      const band = store.get('trousers.strips.waistband')
      near(band.length - f.flyWidth * 1.2, b.waist + f.waist, 0.5, 'waistband')
      // The cuff is narrower than the knee, and its stand and facing cover the opening
      assert.ok(f.hem + b.hem < measurements.knee, 'cuff')
      assert.ok(store.get('trousers.strips.buttonStand').length >= b.opening, 'stand')
      assert.ok(store.get('trousers.strips.openingFacing').length >= f.opening, 'facing')
      // The fly ends above the fork, the opening below the knee
      assert.ok(f.fly < f.crotch, 'fly')
      assert.ok(f.opening < f.outseam - (f.pocket ?? 0), 'opening')
    })
  }
}
