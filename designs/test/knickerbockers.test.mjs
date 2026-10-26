import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Knickerbockers } from '../knickerbockers/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = { default: {}, variant: { bandBelowKnee: -0.1, blouse: 0.2, legFlare: 0 } }

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`knickerbockers (${v}): ${name}`, () => {
      const store = checkClean(new Knickerbockers({ measurements, sa: 10, options }).draft())
      const b = store.get('knickers.back')
      const f = store.get('knickers.front')
      // Front and back legs sew together (within 1%, eased)
      near(f.outseam, b.outseam, b.outseam * 0.01, 'outseam')
      near(f.inseam, b.inseam, b.inseam * 0.01, 'inseam')
      // Pull-on waist passes the hips; the leg gathers into its band
      assert.ok(b.waist >= b.seat && f.waist >= f.seat, 'waist passes over the seat')
      assert.ok(b.hem + f.hem >= store.get('knickers.band').length, 'leg gathers into the band')
    })
  }
}
