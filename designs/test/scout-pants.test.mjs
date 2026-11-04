import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ScoutPants } from '../scout-pants/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  plain: { sidePockets: false, backPocket: false, beltLoops: 0, backKneeV: 0, backHemPleat: 0 },
  narrow: { scoutCalfWidth: 0.93, scoutHemWidth: 0.90 },
}

for (const [variant, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`scout pants (${variant}): ${name}`, () => {
      const pattern = new ScoutPants({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      const f = store.get('trousers.front')
      const b = store.get('trousers.back')
      near(f.outseam, b.outseam, 1, 'outseam')
      near(f.inseam, b.inseam, 3, 'inseam')
      assert.ok(f.hem + b.hem > measurements.ankle * 1.2, 'hem clears ankle')
      assert.ok(f.hem + b.hem < measurements.knee * 1.5, 'hem is tapered')
      const band = store.get('trousers.strips.waistband')
      near(band.length - f.flyWidth * 1.2, f.waist + b.waist, 0.5, 'waistband')
      if (variant === 'default') {
        assert.ok(parts['trousers.back'].paths.kneeV, 'back knee V is marked')
        assert.ok(parts['trousers.back'].paths.hemPleat, 'back hem pleat is marked')
      }
    })
  }
}
