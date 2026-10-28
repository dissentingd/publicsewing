import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Knickers } from '../knickers/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = { default: {}, plain: { sidePockets: false, backPocket: false, beltLoops: 0, knickerDrop: 0.2, knickerFullness: 1.5 } }

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`knickers (${v}): ${name}`, () => {
      const pattern = new Knickers({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const b = store.get('trousers.back')
      const f = store.get('trousers.front')
      // Front and back legs sew together
      near(f.outseam, b.outseam, 1, 'outseam')
      near(f.inseam, b.inseam, 3, 'inseam')
      // The waistband fits the waist, past CF by the fly
      const band = store.get('trousers.strips.waistband')
      near(band.length - f.flyWidth * 1.2, b.waist + f.waist, 0.5, 'waistband')
      // The bottom passes the knee, and the fly ends above the fork
      assert.ok(f.hem + b.hem > measurements.knee, 'bottom')
      assert.ok(f.fly < f.crotch, 'fly')
    })
  }
}
