import { test } from 'node:test'
import assert from 'node:assert/strict'
import { InvernessCoat } from '../inverness-coat/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  plain: { buttons: 3, capeLength: 0.42, capeShoulderExtension: 0 },
  wide: { capeLength: 0.72, capeShoulderExtension: 0.08, chestEase: 0.25 },
}

for (const [variant, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`Inverness coat (${variant}): ${name}`, () => {
      const pattern = new InvernessCoat({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      assert.ok(!parts['invernesscoat.cape'].hidden, 'separate cape')
      assert.ok(!parts['boxcoat.front'].hidden && !parts['boxcoat.back'].hidden, 'coat body')
      assert.ok(!parts['boxcoat.collar'].hidden, 'turn collar')
      assert.ok(!parts['invernesscoat.topsleeve'].paths.seam, 'cape replaces sleeve')
      const s = store.get('jacket.seams')
      near(s.sideBack, s.sideFront, 0.5, 'body side seams')
      near(s.shoulderBack, s.shoulderFront, 0.5, 'body shoulders')
      near(store.get('coat.collar').neck, store.get('coat.collar').target, 1, 'collar neckline')
      assert.ok(store.get('cape.seams').hemCb < measurements.waistToFloor, 'cape shorter than body')
      assert.ok(store.get('jacket.front').closed, 'closed front')
      const raw = store.get('jacket.raw.front')
      const cape = store.get('cape.raw.front')
      near(cape.tip.dist(raw.shoulder), measurements.chest * (options.capeShoulderExtension ?? 0.056), 1, 'cape shoulder extension')
    })
  }
}
