// The Bella block (blocks/bella.mjs) drafted through our spec builder with no operations: its
// pieces come out as FreeSewing draws them, its landmarks resolve on each piece, and its seams
// pass the bodice checks at every size set. Garments on Bella use test/bodice-checks.mjs too.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { designFromSpec } from '../lib/spec.mjs'
import { sets } from './coat-checks.mjs'
import { testBodice } from './bodice-checks.mjs'

const spec = {
  block: 'bella',
  about: { id: 'bellablock', name: 'Bella block' },
  pieces: {
    back: { from: 'bella.back' },
    front: { from: 'bella.front' },
    sleeve: { from: 'bella.sleeve' },
  },
}
const { Design } = designFromSpec(spec)
// Our pieces (named from the spec's id), not FreeSewing's hidden parts they're drawn from
const names = { back: 'bellablock.back', front: 'bellablock.front', sleeve: 'bellablock.sleeve' }

testBodice('bella block', Design, names)

// Each landmark resolves to a point on both the back and the front (sideWaist to each's own
// name): an unknown name would throw inside the draft, which logs an error
const landmarkSpec = {
  ...spec,
  pieces: {
    back: { from: 'bella.back', let: { a: 'underarm.x + neckPoint.x + shoulderTip.x + sideWaist.y' } },
    front: { from: 'bella.front', let: { a: 'underarm.x + neckPoint.x + shoulderTip.x + sideWaist.y + cfWaist.y' } },
  },
}
test('bella block: landmarks resolve on the back and the front', () => {
  const pattern = new (designFromSpec(landmarkSpec).Design)({ measurements: sets.cisFemaleAdult36 }).draft()
  assert.deepEqual(pattern.setStores[0].logs.error, [])
})
