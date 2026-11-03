import { test } from 'node:test'
import assert from 'node:assert/strict'
import { GolfPants } from '../golf-pants/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  plain: { sidePockets: false, backPocket: false, beltLoops: 0, thighFlare: 0, breechesButtons: 0 },
  front: { breechesOpening: 'front' },
  long: { breechesLength: 0.3, calfAt: 0.15, openingTop: -0.05 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`golf pants (${v}): ${name}`, () => {
      const pattern = new GolfPants({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      for (const k of ['back', 'front']) assert.ok(!parts[`trousers.${k}`].hidden, `${k} is drawn`)
      const b = store.get('trousers.back')
      const f = store.get('trousers.front')
      // Front and back legs sew together, and the vent is the same length on both
      near(f.outseam, b.outseam, 1, 'outseam')
      near(f.inseam, b.inseam, 3, 'inseam')
      near(f.opening, b.opening, 2, 'vent')
      // The waistband fits the waist, past CF by the fly
      const band = store.get('trousers.strips.waistband')
      near(band.length - f.flyWidth * 1.2, b.waist + f.waist, 0.5, 'waistband')
      // The hem goes round the leg with room: a fitted hem, not a gathered one
      assert.ok(f.hem + b.hem > measurements.knee * 0.95, 'hem round the leg')
      assert.ok(f.hem + b.hem < measurements.knee * 1.4, 'hem not gathered')
      // The stand and facing cover the vent, and the fly ends above the fork
      assert.ok(store.get('trousers.strips.buttonStand').length >= b.opening, 'stand')
      assert.ok(store.get('trousers.strips.openingFacing').length >= f.opening, 'facing')
      assert.ok(f.fly < f.crotch, 'fly')
      // The vent starts above the knee line by default, as on the diagram, and below the pocket
      assert.ok(f.opening < f.outseam - (f.pocket ?? 0), 'vent below the pocket')
      if (v === 'default') {
        const { openingTop, knee } = parts['trousers.front'].points
        assert.ok(openingTop.y < knee.y, 'vent starts above the knee line')
      }
    })
  }
}
