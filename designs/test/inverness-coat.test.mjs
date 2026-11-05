import { test } from 'node:test'
import assert from 'node:assert/strict'
import { InvernessCoat } from '../inverness-coat/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  plain: { buttons: 3, capeLength: 0.42, capeShoulderExtension: 0, armholeDrop: 0 },
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
      const bodyArmhole = store.get('jacket.panels').back.marks.armhole
      near(bodyArmhole.y - store.get('jacket.raw.back').armhole.y, measurements.chest * (options.armholeDrop ?? 0.028), 1, 'lowered armhole')
      const darts = store.get('cape.layout').whole.darts
      assert.equal(darts.length, 2, 'two shoulder darts')
      for (const [i, dart] of darts.entries()) {
        assert.ok(dart.a.dist(dart.b) > 0 && dart.a.dist(dart.b) <= measurements.chest * 0.021 + 1, 'dart mouth')
        assert.ok(dart.tip.dist(dart.a) > dart.a.dist(dart.b), 'dart reaches into the cape')
        assert.ok(parts['invernesscoat.cape'].paths[`shoulderDart${i + 1}`], 'dart marked on cape')
      }
      if (variant === 'default' && name === 'cisFemaleAdult36') {
        near(darts[0].a.dist(darts[0].b), measurements.chest * 0.021, 1, 'Merz dart width')
        near(darts[0].b.dist(darts[1].a), measurements.chest * 0.056, 1, 'Merz dart gap')
        near(darts[0].tip.dist(darts[0].a.shiftFractionTowards(darts[0].b, 0.5)), measurements.chest * 0.073, 1, 'Merz dart length')
      }
    })
  }
}
