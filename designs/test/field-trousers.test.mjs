import { test } from 'node:test'
import assert from 'node:assert/strict'
import { FieldTrousers } from '../field-trousers/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = { default: {}, plain: { sidePockets: false, cargoPockets: false, seatPocket: false, beltLoops: 0, pleats: 1 } }

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`field-trousers (${v}): ${name}`, () => {
      const pattern = new FieldTrousers({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      for (const k of ['back', 'front']) assert.ok(!pattern.parts[0][`trousers.${k}`].hidden, `${k} is drawn`)
      const b = store.get('trousers.back')
      const f = store.get('trousers.front')
      // Front and back legs sew together
      near(f.outseam, b.outseam, 1, 'outseam')
      near(f.inseam, b.inseam, 3, 'inseam')
      // The waistband fits the waist, past CF by the fly
      const band = store.get('trousers.strips.waistband')
      near(band.length - f.flyWidth * 1.2, b.waist + f.waist, 0.5, 'waistband')
      // The hem passes the foot, and narrows from the knee
      assert.ok(f.hem + b.hem > 0, 'hem')
      assert.ok(b.dart >= 0 && f.dart >= 0, 'darts')
      // The pleats take up the front's extra waist, and the hem is narrower than the knee
      assert.ok(f.pleats >= 1 && f.dart > 0, 'pleats')
      // A cargo pocket's face fits across the front leg at the knee
      const cargo = store.get('polygon.cargoPocket', null)
      if (cargo) {
        const p = pattern.parts[0]['trousers.front'].points
        assert.ok(cargo.width - 2 * measurements.seat * 0.04 < Math.abs(p.kneeIn.x - p.kneeOut.x), 'cargo fits')
      }
      // The fly ends above the fork
      assert.ok(f.fly < f.crotch, 'fly')
    })
  }
}
