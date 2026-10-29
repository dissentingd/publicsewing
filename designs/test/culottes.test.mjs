import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Culottes } from '../culottes/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = { default: {}, short: { length: 0.4, goreFlare: 0.1, crotchEase: 0.02, zipLength: 0.6 } }

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`culottes (${v}): ${name}`, () => {
      const pattern = new Culottes({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const f = store.get('skirt.culotte.front')
      const b = store.get('skirt.culotte.back')
      // Front and back sew together at the side seams and inseams
      near(f.side, b.side, 0.5, 'side seams')
      near(f.inseam, b.inseam, 0.5, 'inseams')
      assert.ok(f.inseam > 20, 'legs below the crotch')
      // The back's crotch seam is the longer, round the seat
      assert.ok(b.crotch > f.crotch, 'crotch')
      // The waist comes out at the waist, and the waistband fits it
      near(store.get('skirt.waist'), measurements.waist, measurements.waist * 0.02, 'waist')
      const band = store.get('trousers.strips.waistband')
      near(band.length - band.width, store.get('skirt.waist'), 0.5, 'waistband')
    })
  }
}
