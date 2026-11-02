import assert from 'node:assert/strict'
import { Shirt } from '../dress-shirt/src/index.mjs'
import { testCoat, near } from './coat-checks.mjs'

testCoat(
  'dress shirt',
  Shirt,
  'barberscoat.front',
  {
    default: {},
    plain: { breastPocket: false, buttons: 6, hemCurve: 0.4, lengthBelowWaist: 1.1 },
  },
  (pattern) => {
    const store = pattern.setStores[0]
    // The stand fits the neckline to the front edge, and the fall the stand's top edge to CF
    const stand = store.get('coat.collarStand')
    near(stand.neck, stand.target, 1, 'stand vs neckline')
    const fall = store.get('coat.collar')
    near(fall.neck, stand.outer - store.get('coat.frontEdge').ext, 1, 'fall vs stand')
    // The sleeve's opening is bound and buttoned into the cuff; its hem pleats into the cuff
    const sleeve = store.get('coat.sleeve')
    assert.ok(sleeve.slit > 0, 'sleeve opening')
    assert.ok(sleeve.hem >= store.get('coat.cuff').length, 'sleeve hem pleats into the cuff')
  },
)
