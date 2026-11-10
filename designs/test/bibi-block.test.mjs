// The Bibi block (blocks/bibi.mjs) drafted through our spec builder with no operations, plus a
// rib band (lib/rib.mjs) on its hem: the knit checks pass at every size set, with negative ease
// and as a sleeveless dress. Garments on Bibi use test/knit-checks.mjs too.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { designFromSpec } from '../lib/spec.mjs'
import { sets } from './coat-checks.mjs'
import { testKnit } from './knit-checks.mjs'

const spec = {
  block: 'bibi',
  about: { id: 'bibiblock', name: 'Bibi block' },
  pieces: {
    back: { from: 'bibi.back' },
    front: { from: 'bibi.front' },
    // Bibi hides its sleeve when `sleeves` is off; our piece follows it
    sleeve: { from: 'bibi.sleeve', if: 'sleeves' },
    neckBinding: { from: 'bibi.neckBinding' },
    // A hem band all round, from the hips measurement (a piece type reads measurements, options
    // and the store, not another piece's points: a garment's own operation would store its hem)
    hemBand: { part: 'rib', edge: 'hips * 1.05', height: 60, round: true },
  },
}
const { Design } = designFromSpec(spec)

testKnit('bibi block', Design, 'bibiblock', {
  default: {},
  negativeEase: { chestEase: -0.05, waistEase: -0.05, hipsEase: -0.05 },
  dress: { length: 'knee', flare: 0.2, sleeves: false },
})

test('bibi block: landmarks resolve on the back and the front', () => {
  const landmarkSpec = {
    ...spec,
    pieces: {
      back: { from: 'bibi.back', let: { a: 'underarm.x + neckPoint.x + shoulderTip.x + sideWaist.y + sideHips.y + sideHem.y' } },
      front: { from: 'bibi.front', let: { a: 'underarm.x + neckPoint.x + shoulderTip.x + sideWaist.y + sideHips.y + sideHem.y + cfNeck.y' } },
    },
  }
  const pattern = new (designFromSpec(landmarkSpec).Design)({ measurements: sets.cisFemaleAdult36 }).draft()
  assert.deepEqual(pattern.setStores[0].logs.error, [])
})
