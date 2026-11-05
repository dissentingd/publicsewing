import assert from 'node:assert/strict'
import { Reefer } from '../reefer/src/index.mjs'
import { testCoat } from './coat-checks.mjs'

testCoat('reefer', Reefer, 'mackinaw.front', {
  default: {},
  plain: { handPockets: false, lowerWelt: false, vent: false, lining: false },
  variant: { collarStyle: 'military', buttons: 4, buttonTop: -4, handPockets: false },
}, (pattern) => {
  const store = pattern.setStores[0]
  const welt = store.get('coat.welts')?.hand
  if (welt) {
    const front = pattern.parts[0]['mackinaw.front'].points
    assert.ok(welt.y0 < front.cfWaist.y, 'chest welt above the waist')
    assert.ok(welt.y1 < front.cfHem.y, 'welt above the hem')
    assert.ok(welt.x1 < front.hem.x, 'welt clear of the side seam')
    assert.ok((welt.x1 - welt.x0) > 4 * (welt.y1 - welt.y0), 'shallow horizontal welt')
  }
  const lower = store.get('coat.lowerWelts')?.lower
  if (lower) {
    const front = pattern.parts[0]['mackinaw.front'].points
    assert.ok(lower.y0 > front.cfWaist.y, 'lower welt below waist')
    assert.ok(lower.x1 < front.hem.x, 'lower welt clear of side seam')
    assert.ok(lower.y0 + lower.bag < front.cfHem.y, 'lower pocket bag above hem')
    assert.ok(lower.x1 > lower.x0 && lower.y1 < lower.y0, 'lower welt rises toward side')
    assert.ok(pattern.parts[0]['mackinaw.lowerWeltPiece'].paths.seam, 'separate lower welt')
    assert.ok(pattern.parts[0]['mackinaw.lowerWeltBag'].paths.seam, 'separate lower bag')
  }
})
