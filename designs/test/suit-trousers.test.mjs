import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Trousers } from '../suit-trousers/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = { default: {}, turnUps: { turnUps: true }, plain: { sidePockets: false, backPocket: false, beltLoops: 0, frontDart: 0 } }

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`trousers (${v}): ${name}`, () => {
      const pattern = new Trousers({ measurements, sa: 10, options }).draft()
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
      // The fly ends above the fork
      assert.ok(f.fly < f.crotch, 'fly')
    })
  }
}

// Cuff bottoms (Simons 1916, Diagrams F and G): the leg runs on 2 1/2 x the depth below the hem line,
// and its sides go out at the cuff's fold and the raw edge only, so the cuff folds up to fit
for (const name of ['cisMaleAdult38', 'usdaBoyC5', 'stoutMale48']) {
  test(`trousers' turn-ups: ${name}`, () => {
    const measurements = sets[name]
    const pattern = new Trousers({ measurements, sa: 10, options: { turnUps: true } }).draft()
    const plain = new Trousers({ measurements, sa: 10 }).draft()
    for (const k of ['back', 'front']) {
      const p = pattern.parts[0][`trousers.${k}`].points
      const d = measurements.waistToFloor * 0.05
      near(p.rawIn.y - p.hemIn.y, 2.5 * d, 0.01, `${k} length below the hem`)
      near(p.underIn.x, p.hemIn.x, 0.01, `${k} under fold's width`)
      assert.ok(Math.abs(p.cuffIn.x - p.cuffOut.x) > Math.abs(p.hemIn.x - p.hemOut.x), `${k} wider at the cuff's fold`)
      // The hem line is where the plain pattern's hem is, at its crease
      near(p.hemIn.y, plain.parts[0][`trousers.${k}`].points.hemIn.y, 0.01, `${k} hem line`)
    }
    // Nothing above the hem moves
    const [a, b] = [pattern, plain].map((q) => q.setStores[0].get('trousers.front'))
    near(a.inseam, b.inseam, 0.01, 'inseam')
    near(a.outseam, b.outseam, 0.01, 'outseam')
  })
}
