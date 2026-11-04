import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Drawers } from '../drawers/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  fuller: { seatEase: 0.15, hemWidth: 1.2 },
  shorter: { lengthBonus: -0.4, hemWidth: 0.9 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`drawers (${v}): ${name}`, () => {
      const pattern = new Drawers({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      // Each leg is one piece: the back and front it's made from are hidden
      for (const k of ['back', 'front']) assert.ok(parts[`trousers.${k}`].hidden, `${k} hidden`)
      assert.ok(!parts['overall-pants.leg'].hidden, 'leg drawn')
      const b = store.get('trousers.back')
      const f = store.get('trousers.front')
      near(f.outseam, b.outseam, 0.5, 'outseam')
      // (the wide hem's large sizes differ by up to about 4 mm, to ease in: see the brief)
      near(f.inseam, b.inseam, v === 'fuller' ? 5 : 3, 'inseam')
      const leg = store.get('trousers.leg')
      near(leg.waist, b.waist + f.waist, 0.5, 'waist')
      near(store.get('trousers.strips.waistband').length - f.flyWidth * 1.2, leg.waist, 0.5, 'waistband')
      assert.ok(2 * leg.waist > measurements.waist, 'waist')
      assert.ok(f.fly < f.crotch, 'fly')
      // The hem is below the knee, and goes round it
      const p = parts['trousers.front'].points
      if (v === 'default') assert.ok(p.hemOut.y > p.knee.y, 'hem below the knee')
      assert.ok(f.hem + b.hem > measurements.knee, `hem ${(f.hem + b.hem).toFixed(0)} round the knee`)
      // No belt loops
      assert.equal(store.get('trousers.strips.beltLoop', null), null, 'no belt loops')
    })
  }
}
