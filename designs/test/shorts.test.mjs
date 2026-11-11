import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Shorts } from '../shorts/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  banded: { continuousBand: true, shortsInseam: 0.3, frontDart: 0.44, frontDartLength: 0.49, backDart: 0.3 },
  extremes: { shortsInseam: 0.15, shortsFlare: 0.08, sidePockets: false, backPocket: false, beltLoops: 0 },
  long: { shortsInseam: 0.7, shortsFlare: 0 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`shorts (${v}): ${name}`, () => {
      const pattern = new Shorts({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      const b = store.get('trousers.back')
      const f = store.get('trousers.front')
      // Front and back legs sew together
      near(f.outseam, b.outseam, 1, 'outseam')
      near(f.inseam, b.inseam, 3, 'inseam')
      // The leg is cut off below the fork, above the knee or near it, straight across
      for (const k of ['front', 'back']) {
        const P = parts[`trousers.${k}`].points
        assert.ok(P.hemIn.y > P.fork.y + 5, `${k}: hem below the fork`)
        near(P.hemIn.y, P.hemOut.y, 1, `${k}: hem straight across`)
        assert.ok(P.hemOut.y < P.floor.y, `${k}: well above the floor`)
      }
      const cut = options.continuousBand === true
      assert.equal(parts['trousers.waistband'].hidden, cut, 'a separate waistband unless cut on')
      if (cut) near(f.bandRise, b.bandRise, 0.01, 'band rise')
      else near(store.get('trousers.strips.waistband').length - f.flyWidth * 1.2, b.waist + f.waist, 0.5, 'waistband')
      assert.ok(f.fly < f.crotch + (f.bandRise ?? 0), 'fly')
    })
  }
}
