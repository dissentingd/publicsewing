import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Slacks } from '../slacks/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  separate: { continuousBand: false, pleats: 1, frontDart: 0.45 },
  plain: { sidePockets: false, backPocket: false, beltLoops: 0, turnUps: true, waistbandHeight: 0.06 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`slacks (${v}): ${name}`, () => {
      const pattern = new Slacks({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      for (const k of ['back', 'front']) assert.ok(!parts[`trousers.${k}`].hidden, `${k} is drawn`)
      const b = store.get('trousers.back')
      const f = store.get('trousers.front')
      // Front and back legs sew together
      near(f.outseam, b.outseam, 1, 'outseam')
      near(f.inseam, b.inseam, 3, 'inseam')
      assert.ok(f.pleats >= 1 && f.dart > 0, 'pleats')
      const cut = options.continuousBand !== false
      assert.equal(parts['trousers.waistband'].hidden, cut, 'a separate waistband only when not cut on')
      if (cut) {
        // The band rises the same on both pieces, its top edge about as long as the waist it sits on
        near(f.bandRise, b.bandRise, 0.01, 'band rise')
        const top = f.band + b.band
        const seam = f.waist + b.waist
        assert.ok(Math.abs(top - seam) < seam * 0.08, `band top ${top.toFixed(0)} vs waist ${seam.toFixed(0)}`)
        // The fly runs up through the band
        assert.ok(f.fly > f.bandRise && f.fly - f.bandRise < f.crotch, 'fly')
      } else {
        const band = store.get('trousers.strips.waistband')
        near(band.length - f.flyWidth * 1.2, b.waist + f.waist, 0.5, 'waistband')
        assert.equal(f.band, undefined, 'no band cut on')
      }
    })
  }
}
