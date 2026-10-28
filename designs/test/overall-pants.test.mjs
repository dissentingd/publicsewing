import { test } from 'node:test'
import assert from 'node:assert/strict'
import { OverallPants } from '../overall-pants/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = { default: {}, plain: { beltLoops: 0, hemWidth: 1, seatEase: 0.1 } }

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`overall-pants (${v}): ${name}`, () => {
      const pattern = new OverallPants({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      // Only the one-piece leg is cut; the back and front it's made from are hidden
      for (const k of ['back', 'front']) assert.ok(pattern.parts[0][`trousers.${k}`].hidden, `${k} hidden`)
      assert.ok(!pattern.parts[0]['overall-pants.leg'].hidden, 'leg drawn')
      const b = store.get('trousers.back')
      const f = store.get('trousers.front')
      // The outseam line is shared, the inseams sew together
      near(f.outseam, b.outseam, 0.5, 'outseam')
      near(f.inseam, b.inseam, 3, 'inseam')
      // The leg's waist takes the waistband, past CF by the fly
      const leg = store.get('trousers.leg')
      near(leg.waist, b.waist + f.waist, 0.5, 'waist')
      near(store.get('trousers.strips.waistband').length - f.flyWidth * 1.2, leg.waist, 0.5, 'waistband')
      // The waist clears the body's, and the fly ends above the fork
      assert.ok(2 * leg.waist > measurements.waist, 'waist')
      assert.ok(f.fly < f.crotch, 'fly')
    })
  }
}
