import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Kilt } from '../kilt/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  short: { kiltLength: 0.57 },
  fewPleats: { pleatFace: 0.08, pleatDepth: 0.5, apronShare: 0.6 },
  deep: { pleatFace: 0.02, pleatDepth: 1.5, wrapLap: 0.95, apronShaping: 0.6 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`kilt (${v}): ${name}`, () => {
      const pattern = new Kilt({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const k = store.get('kilt')
      const { apron, pleats } = k
      const parts = pattern.parts[0]
      for (const p of ['apron', 'pleats', 'waistband', 'strap']) assert.ok(!parts[`kilt.${p}`].hidden, `${p} is drawn`)
      // Sewn up and pleated, the kilt goes round the seat and the waist
      near(2 * (apron.seatWidth + pleats.seatWidth), k.seatRound, 0.5, 'round the seat')
      near(2 * (apron.waistWidth + pleats.waistWidth), k.waistRound, 0.5, 'round the waist')
      near(2 * pleats.n * pleats.face, 2 * pleats.seatWidth, 0.5, 'pleat faces make the back')
      // The pleated length's top, its pleats closed at the top, is the back's waist
      near(pleats.n * (pleats.face - pleats.take), pleats.waistWidth, 0.5, 'pleats close to the waist')
      assert.ok(pleats.face - pleats.take > 0, `each pleat shows at the waist: ${(pleats.face - pleats.take).toFixed(1)}`)
      assert.ok(pleats.n >= 3, 'pleats')
      // The side seam: the apron's edge and the pleats' are the same length
      const side = Math.hypot(apron.S.x - apron.W.x, apron.S.y - apron.W.y) + (apron.H.y - apron.S.y)
      near(side, pleats.side, 0.5, 'side seam')
      // Waistband: round the waist and past each CF by the wrap
      const band = store.get('trousers.strips.waistband')
      assert.ok(band.length >= k.waistRound + 2 * apron.lap, 'waistband')
      // The hem is a hem, and the hip above it
      assert.ok(k.hem < k.length - k.hipDepth, 'hem below the hip')
    })
  }
}
