import assert from 'node:assert/strict'
import { MiddyBlouse } from '../middy-blouse/src/index.mjs'
import { testYoke } from './yoke-checks.mjs'
import { near } from './coat-checks.mjs'

testYoke(
  'middy-blouse',
  MiddyBlouse,
  {
    default: {},
    variant: { sleeves: 'short', shield: false, vNeck: 0.7, collarDepth: 0.18 },
  },
  (pattern) => {
    const store = pattern.setStores[0]
    // The sailor collar's neck edge is the whole neckline, back neck and V
    const c = store.get('yoke.sailorCollar')
    near(c.neck, c.target, 1, 'collar neck edge vs neckline')
    // The V goes below the front neck, and there's no placket
    const f = store.get('yoke.front')
    assert.ok(f.neckY > f.marks.body.hps.y + 20, 'V neck')
    assert.ok(pattern.parts[0]['middy-blouse.placket'].hidden, 'no placket')
    // The shield covers the V's width at the neck points
    const shield = store.get('polygon.shieldPiece', null)
    if (shield) assert.ok(shield.width > 2 * f.marks.body.hps.x, 'shield spans the V')
  },
)
