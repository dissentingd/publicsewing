// The Lining setting does what it says: a lined coat with set-in sleeves has its lining pieces with
// every collar. Raglan sleeves (kept by the two plain collars) have no lining pattern.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { loadSpec } from '../lib/load-spec.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const collars = ['convertible', 'military', 'shawl', 'ulster']

for (const d of ['peacoat', 'overcoat', 'box-overcoat', 'ulster']) {
  const { Design } = loadSpec(fileURLToPath(new URL(`../${d}/spec.yaml`, import.meta.url)))
  const draft = (options) => new Design({ measurements: sets.cisMaleAdult38, sa: 10, options }).draft()
  const drawn = (pattern, piece) => Object.entries(pattern.parts[0]).some(([k, part]) => k.endsWith(`.${piece}`) && !part.hidden)

  for (const collarStyle of collars) {
    test(`${d}: lined with the ${collarStyle} collar`, () => {
      const pattern = draft({ collarStyle, lining: true })
      const store = checkClean(pattern)
      for (const piece of ['frontLining', 'backLining', 'backNeckFacing']) assert.ok(drawn(pattern, piece), piece)
      near(store.get('coat.frontLining').shoulder, store.get('coat.backLining').shoulder, 0.5, 'lining shoulders')
    })
    test(`${d}: unlined with the ${collarStyle} collar`, () => {
      const pattern = draft({ collarStyle, lining: false })
      checkClean(pattern)
      for (const piece of ['frontLining', 'backLining', 'backNeckFacing']) assert.ok(!drawn(pattern, piece), piece)
    })
  }
  test(`${d}: raglan sleeves stay unlined`, () => {
    const pattern = draft({ sleeveStyle: 'raglan', collarStyle: 'military', lining: true })
    checkClean(pattern)
    assert.ok(drawn(pattern, 'frontSleeve'), 'raglan sleeve')
    assert.ok(!drawn(pattern, 'frontLining'), 'front lining')
  })
}
