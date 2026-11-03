import assert from 'node:assert/strict'
import { DressingGown } from '../dressing-gown/src/index.mjs'
import { testCoat } from './coat-checks.mjs'

// The girdle goes round the waist, with ends to tie; no sewn belt
const girdle = (pattern) => {
  const store = pattern.setStores[0]
  const { waist } = pattern.settings[0].measurements
  const g = store.get('trousers.strips.girdle')
  assert.ok(g.length > waist * 1.25, `girdle ${g.length.toFixed(0)} round a ${waist} waist`)
  assert.equal(store.get('coat.belt', null), null, 'no sewn belt')
  const p = pattern.parts[0]['mackinaw.front'].points
  const { lower } = store.get('coat.pockets')
  assert.ok(lower.y > p.cfWaist.y, 'pockets on the hips')
}

testCoat('dressing gown', DressingGown, 'mackinaw.front', {
  default: {},
  bathRobe: { collarStyle: 'military', buttonExtension: 0.04, buttons: 7, buttonTop: -4, buttonBottom: 0.6, lengthBelowWaist: 2.55 },
  plain: { lowerPockets: false, hemFlare: 0, buttons: 2, frontDrop: 0 },
}, girdle)
