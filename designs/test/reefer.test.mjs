import assert from 'node:assert/strict'
import { Reefer } from '../reefer/src/index.mjs'
import { testCoat } from './coat-checks.mjs'

testCoat('reefer', Reefer, 'mackinaw.front', {
  default: {},
  plain: { handPockets: false, vent: false, lining: false },
  variant: { collarStyle: 'military', buttons: 4, buttonTop: -4, handPockets: false },
}, (pattern) => {
  const store = pattern.setStores[0]
  const welt = store.get('coat.welts')?.hand
  if (welt) {
    const front = pattern.parts[0]['mackinaw.front'].points
    assert.ok(welt.y0 < front.cfWaist.y, 'chest welt above the waist')
    assert.ok(welt.y1 < front.cfHem.y, 'welt above the hem')
  }
})
