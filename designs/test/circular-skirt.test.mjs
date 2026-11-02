import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CircularSkirt } from '../circular-skirt/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  wide: { spreadFront: 0.1, spreadSide: 0.15, spreadBack: 0.2 },
  plain: { spreadFront: 0, spreadSide: 0, spreadBack: 0, length: 0.45 },
  floor: { length: 0.95, panelShare: 0.5 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`circular-skirt (${v}): ${name}`, () => {
      const pattern = new CircularSkirt({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      for (let i = 2; i <= 7; i++) assert.equal(parts[`gored-skirt.gore${i}`].hidden, true, `gore${i}`)
      const { front, back } = store.get('skirt.seams')
      // The two side edges sew together: the same line below the hinge, the dart's legs above
      near(front.side, back.side, 3, 'side seams')
      // The waist comes out at the waist; the waistband fits it
      near(store.get('skirt.waist'), measurements.waist, measurements.waist * 0.02, 'waist')
      const band = store.get('trousers.strips.waistband')
      near(band.length - band.width, store.get('skirt.waist'), 0.5, 'waistband')
      near(2 * (front.waist + back.waist), store.get('skirt.waist'), 0.5, 'waist of the pieces')
      // Spread, the back takes the most and the hem is far wider than the hip
      if (v !== 'plain') {
        assert.ok(back.hem > front.hem, 'back hem wider than the front')
        assert.ok(2 * (front.hem + back.hem) > measurements.seat * 1.5, 'a wide hem')
      }
    })
  }
}
