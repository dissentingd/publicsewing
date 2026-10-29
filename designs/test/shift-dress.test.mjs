import assert from 'node:assert/strict'
import { ShiftDress } from '../shift-dress/src/index.mjs'
import { testYoke } from './yoke-checks.mjs'

testYoke(
  'shift-dress',
  ShiftDress,
  {
    default: {},
    variant: { sleeves: 'none', neckFinish: 'collar', opening: 'front', hemFlare: 0.1, sideSlit: 0.2 },
  },
  (pattern) => {
    // No yokes: back and front are each one piece, neck to hem
    const store = pattern.setStores[0]
    for (const side of ['back', 'front']) assert.ok(store.get(`yoke.${side}`).whole && !store.get(`yoke.${side}`).yoke, `${side} in one piece`)
  },
)
