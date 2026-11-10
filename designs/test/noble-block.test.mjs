// The Noble block (blocks/noble.mjs) drafted through our spec builder with no operations: the
// princess seams and side seams match at every size set, with the dart to the shoulder or the
// armhole. Princess bodices on Noble use checkPrincess (test/bodice-checks.mjs) too.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { designFromSpec } from '../lib/spec.mjs'
import { sets } from './coat-checks.mjs'
import { testPrincess } from './bodice-checks.mjs'

const spec = {
  block: 'noble',
  about: { id: 'nobleblock', name: 'Noble block' },
  pieces: {
    backInside: { from: 'noble.backInside' },
    backOutside: { from: 'noble.backOutside' },
    frontInside: { from: 'noble.frontInside' },
    frontOutside: { from: 'noble.frontOutside' },
  },
}
const { Design } = designFromSpec(spec)

testPrincess('noble block', Design, 'nobleblock', { shoulder: {}, armhole: { dartPosition: 'armhole' } })

test('noble block: landmarks resolve on the pieces that have them', () => {
  const landmarkSpec = {
    ...spec,
    pieces: {
      backOutside: { from: 'noble.backOutside', let: { a: 'underarm.x + shoulderTip.x + sideWaist.y' } },
      frontInside: { from: 'noble.frontInside', let: { a: 'neckPoint.x + cfWaist.y + cfNeck.y' } },
      frontOutside: { from: 'noble.frontOutside', let: { a: 'underarm.x + shoulderTip.x + sideWaist.y' } },
    },
  }
  const pattern = new (designFromSpec(landmarkSpec).Design)({ measurements: sets.cisFemaleAdult36 }).draft()
  assert.deepEqual(pattern.setStores[0].logs.error, [])
})
