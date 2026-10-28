import assert from 'node:assert/strict'
import { ServiceShirt } from '../service-shirt/src/index.mjs'
import { testCoat } from './coat-checks.mjs'

testCoat(
  'service shirt',
  ServiceShirt,
  'barberscoat.front',
  {
    default: {},
    plain: { pocketFlaps: false, shoulderStraps: false, pocketShape: 'square', buttons: 5 },
  },
  (pattern) => {
    const parts = pattern.parts[0]
    const store = pattern.setStores[0]
    // The back is cut at the yoke: yoke and body drawn, the whole back hidden
    assert.ok(parts['barberscoat.back'].hidden, 'whole back hidden')
    for (const k of ['backYoke', 'backBody']) assert.ok(!parts[`service-shirt.${k}`].hidden, `${k} drawn`)
    // A shoulder strap fits on the shoulder
    const strap = store.get('polygon.shoulderStrap', null)
    if (strap) assert.ok(strap.edges[0] <= store.get('coat.front.shoulder') * 1.05, 'strap on the shoulder')
  },
)
