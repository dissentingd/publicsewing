import { test } from 'node:test'
import assert from 'node:assert/strict'
import { WomensTrousers } from '../womens-trousers/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  pleated: { pleats: 2, frontDart: 0.46, kneeEase: 0.47, hemWidth: 0.95 },
  fly: { opening: 'fly', sidePockets: true, backPocket: true, beltLoops: 5 },
  darted: { frontDart: 0.3, zipLength: 1.1, sideUnderlap: 0.12, seatEase: 0.16, turnUps: true },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`womens-trousers (${v}): ${name}`, () => {
      const pattern = new WomensTrousers({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      const b = store.get('trousers.back')
      const f = store.get('trousers.front')
      // Front and back legs sew together
      near(f.outseam, b.outseam, 1, 'outseam')
      near(f.inseam, b.inseam, 3, 'inseam')
      if ((options.pleats ?? 0) > 0) assert.ok(f.pleats >= 1 && f.dart > 0, 'pleats')
      const fly = options.opening === 'fly'
      assert.equal(parts['trousers.flyShield'].hidden, !fly, 'a fly shield only with a fly')
      const band = store.get(`trousers.strips.${fly ? 'waistband' : 'sideWaistband'}`)
      assert.equal(parts['trousers.waistband'].hidden, !fly, 'the two-piece band only with a fly')
      if (fly) {
        assert.ok(f.fly > 0, 'fly drawn')
        assert.equal(f.sideZip, undefined, 'no side zip with a fly')
        assert.ok(band.length > b.waist + f.waist, 'waistband laps the fly')
      } else {
        assert.equal(f.fly, undefined, 'no fly with a side opening')
        // The zip's end is marked at the same distance down both outseams, above the knee
        near(f.sideZip, b.sideZip, 1, 'side zip')
        assert.ok(f.sideZip > 0 && f.sideZip < f.outseam * 0.6, 'side zip length')
        // One waistband round the whole waist, running on past the side opening by the underlap
        const lap = band.length - 2 * (b.waist + f.waist)
        assert.ok(lap >= 0 && lap < measurements.waist * 0.13, `underlap ${lap.toFixed(0)}`)
      }
    })
  }
}
