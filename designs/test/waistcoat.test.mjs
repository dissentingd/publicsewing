import assert from 'node:assert/strict'
import { Waistcoat } from '../waistcoat/src/index.mjs'
import { testCoat } from './coat-checks.mjs'

// Sleeveless; the darts never take more than the waist shaping there was
const darts = (pattern) => {
  const store = pattern.setStores[0]
  for (const k of ['back', 'front']) assert.ok(!pattern.parts[0][`waistcoat.${k}`].hidden, `${k} is drawn`)
  for (const k of ['back', 'front']) {
    const d = store.get(`coat.${k}.dart`)
    assert.ok(d.width >= 0 && d.letOut >= 0, `${k} dart`)
  }
  assert.ok(store.get('coat.frontEdge').drop > 0, 'pointed fronts')
}

testCoat('waistcoat', Waistcoat, 'waistcoat.front', {
  default: {},
  plain: { breastPocket: false, lowerPockets: false, backDart: 0, frontDart: 0, liningBack: false, cutaway: 0 },
}, darts)
