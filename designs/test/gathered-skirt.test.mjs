import { test } from 'node:test'
import assert from 'node:assert/strict'
import { GatheredSkirt } from '../gathered-skirt/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = { default: {}, short: { gathers: 1.3, skirtLength: 0.35, placketLength: 0.6 } }

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`gathered-skirt (${v}): ${name}`, () => {
      const pattern = new GatheredSkirt({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const f = store.get('polygon.front')
      const b = store.get('polygon.back')
      // Front and back sew together at the sides, and the skirt passes over the hips
      near(f.edges[1], b.edges[1], 0.5, 'side seams')
      assert.ok(2 * (f.width + b.width) > measurements.seat, 'passes the seat')
      // The waistband takes the gathered waist, with an underlap its own height
      const band = store.get('trousers.strips.waistband')
      near(band.length - band.width, measurements.waist, 0.5, 'waistband')
      // The placket ends above the hem, and its strip runs down both edges
      const placket = measurements.waistToSeat * (options.placketLength ?? 0.9)
      assert.ok(placket < f.height, 'placket above the hem')
      assert.ok(store.get('trousers.strips.placketStrip').length >= 2 * placket, 'placket strip')
    })
  }
}
