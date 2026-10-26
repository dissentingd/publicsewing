import assert from 'node:assert/strict'
import { ShopCoat } from '../shop-coat/src/index.mjs'
import { testCoat } from './coat-checks.mjs'

// The hem flares: wider at the hem than over the seat
const flared = (pattern) => {
  const f = pattern.parts[0]['shopcoat.front'].points
  if (pattern.settings[0].options.hemFlare > 0) assert.ok(f.hem.x > f.seat.x, 'hem flares')
}

testCoat('shop coat', ShopCoat, 'shopcoat.front', {
  default: {},
  plain: { pencilPocket: false, hemFlare: 0, pocketShape: 'rounded', buttons: 6 },
}, flared)
