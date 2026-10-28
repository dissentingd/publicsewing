import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PyjamaTrousers } from '../pyjama-trousers/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = { default: {}, variant: { legLength: 0.85, legFlare: 0, hemDepth: 0.03 } }

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`pyjama trousers (${v}): ${name}`, () => {
      const pattern = new PyjamaTrousers({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const b = store.get('knickers.back')
      const f = store.get('knickers.front')
      // Front and back legs sew together (within 1%, eased)
      near(f.outseam, b.outseam, b.outseam * 0.01, 'outseam')
      near(f.inseam, b.inseam, b.inseam * 0.01, 'inseam')
      // Pull-on waist passes the hips; the hem is no narrower than the knee
      assert.ok(b.waist >= b.seat && f.waist >= f.seat, 'waist passes over the seat')
      assert.ok(b.hem + f.hem >= measurements.knee, `hem ${(b.hem + f.hem).toFixed(0)} round the knee ${measurements.knee}`)
      // No leg bands
      assert.ok(pattern.parts[0]['pyjama-trousers.band'].hidden, 'no band')
    })
  }
}
