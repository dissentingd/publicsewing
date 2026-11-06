import assert from 'node:assert/strict'
import { RidingFrockCoat } from '../riding-frock-coat/src/index.mjs'
import { near } from './coat-checks.mjs'
import { testJacket } from './jacket-checks.mjs'

testJacket('Riding frock coat', RidingFrockCoat, {
  default: {},
  fuller: { skirtSpread: 0.11 },
  plain: { lining: false, skirtSpread: 0, seatEase: 0.1, cbSuppression: 0, underarmSuppression: 0 },
}, (pattern) => {
  const store = pattern.setStores[0]
  const seams = store.get('jacket.seams')
  near(seams.waist[0], seams.waist[1], 4, 'waist seam')
  assert.ok(store.get('jacket.panels').skirt, 'separate skirt piece')
})
