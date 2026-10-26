import assert from 'node:assert/strict'
import { BarVest } from '../bar-vest/src/index.mjs'
import { testCoat } from './coat-checks.mjs'

// The side seam is taken in at the waist (unless the waist is the widest part)
const waisted = (pattern) => {
  const f = pattern.parts[0]['barvest.front'].points
  assert.ok(f.sideWaist.x <= f.armhole.x + 0.01 || pattern.settings[0].measurements.waist >= pattern.settings[0].measurements.chest * 0.95, 'waist taken in')
  assert.ok(pattern.setStores[0].get('coat.frontEdge').drop > 0, 'pointed fronts')
}

// Sleeveless by default; the sleeved variant checks the sleeve as the other coats do
testCoat('bar vest (sleeves)', BarVest, 'barvest.front', {
  sleeved: { sleeves: true },
  plain: { sleeves: true, pockets: false, collarHeight: 0, buttons: 4 },
}, waisted)
testCoat('bar vest', BarVest, 'barvest.front', { default: {} }, waisted)
