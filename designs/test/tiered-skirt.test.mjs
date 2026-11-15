import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TieredSkirt } from '../tiered-skirt/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  plain: { tierFullness: 1.5, tierGrowth: 1, backWaistDrop: 0, placketLength: 0.5 },
  apart: { skirtLength: 0.9, firstTier: 2.2, tierFullness: 1.3, tierGrowth: 1.4, placketLength: 1.2, waistbandHeight: 0.06 },
}
const d = { skirtLength: 0.7, firstTier: 1.5, tierFullness: 2, tierGrowth: 1.12, placketLength: 0.9 }

for (const [v, options] of Object.entries(variants)) {
  const o = { ...d, ...options }
  for (const [name, measurements] of Object.entries(sets)) {
    test(`tiered-skirt (${v}): ${name}`, () => {
      const pattern = new TieredSkirt({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const f = store.get('polygon.front')
      const b = store.get('polygon.back')
      const tiers = [f, store.get('polygon.tier2'), store.get('polygon.tier3'), store.get('polygon.tier4')]
      // Front and back of the first tier sew together at the side
      near(f.edges[1], b.edges[1], 0.5, 'side seams')
      // The tiers add up to the skirt's length, each deeper and wider than the one above by the options
      near(tiers.reduce((s, t) => s + t.height, 0), measurements.waistToFloor * o.skirtLength, 0.5, 'length')
      for (let i = 1; i < 4; i++) {
        near(tiers[i].height, tiers[i - 1].height * o.tierGrowth, 0.5, `tier ${i + 1} depth`)
        near(tiers[i].width, tiers[i - 1].width * o.tierFullness, 0.5, `tier ${i + 1} width`)
      }
      // The first tier passes over the hips, and the waist opens over them at the placket
      assert.ok(4 * f.width >= measurements.seat, 'first tier passes the seat')
      const placket = Math.min(measurements.waistToSeat * o.placketLength, f.height + tiers[1].height - 15)
      // At the default placket or longer (a shorter one is the sewer's choice)
      if (o.placketLength >= d.placketLength) assert.ok(measurements.waist + 2 * placket >= measurements.seat * 0.95, 'the opening passes the hips')
      // Its end is notched once: on the first tier, or on the second when it runs past the first
      const parts = pattern.parts[0]
      const onFirst = placket <= f.height - 15
      assert.equal(Boolean(parts['tiered-skirt.front'].snippets.notch0), onFirst, 'front notch')
      assert.equal(Boolean(parts['tiered-skirt.back'].snippets.notch0), onFirst, 'back notch')
      assert.equal(Boolean(parts['tiered-skirt.tier2'].snippets.notch0), !onFirst, 'second tier notch')
      // The waistband takes the waist, with an underlap its own height
      const band = store.get('trousers.strips.waistband')
      near(band.length - band.width, measurements.waist, 0.5, 'waistband')
      assert.ok(store.get('trousers.strips.placketStrip').length >= 2 * placket, 'placket strip')
    })
  }
}
