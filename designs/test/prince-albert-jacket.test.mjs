import assert from 'node:assert/strict'
import { PrinceAlbertJacket } from '../prince-albert-jacket/src/index.mjs'
import { near } from './coat-checks.mjs'
import { testJacket } from './jacket-checks.mjs'

testJacket(
  'Prince Albert jacket',
  PrinceAlbertJacket,
  {
    default: {},
    notch: { lapelStyle: 'notch' },
    flared: { skirtSpread: 0.04 },
    plain: { lining: false, lengthBelowWaist: 0.3, cbSuppression: 0, underarmSuppression: 0 },
  },
  (pattern) => {
    const store = pattern.setStores[0]
    const s = store.get('jacket.seams')
    // The bodice's waist and the skirt's, laid together; the pleat's two sides
    near(s.waist[0], s.waist[1], 4, 'waist seam')
    near(s.pleat[0], s.pleat[1], 2, 'pleat')
    // The vent's CB is a seam at every size, even with no CB shaping
    assert.equal(store.get('jacket.panels').back.fold, false, 'back cut in pairs')
    // Each panel but the back stops at the waist
    const panels = store.get('jacket.panels')
    const { waistY, hemY } = store.get('jacket.front')
    for (const name of ['front', 'sideFront', 'sideBack']) {
      assert.ok(panels[name].outline.bbox().bottomRight.y < (waistY + hemY) / 2, `${name} stops at the waist`)
    }
  },
)
