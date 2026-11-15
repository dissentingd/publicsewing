import assert from 'node:assert/strict'
import { Kameez } from '../kameez/src/index.mjs'
import { testYoke } from './yoke-checks.mjs'

testYoke(
  'kameez',
  Kameez,
  {
    default: {},
    straight: { hemFlare: 0.04 },
    longSleeves: { sleeves: 'long' },
    banded: { sleeveFinish: 'band', sideSlit: 0, opening: 'back' },
    extremes: { sideSlit: 0.8, hemFlare: 0.15, shortSleeve: 0.7, skirtLength: 0.85 },
  },
  (pattern) => {
    const store = pattern.setStores[0]
    const o = pattern.settings[0].options
    const parts = pattern.parts[0]
    for (const side of ['back', 'front']) assert.ok(store.get(`yoke.${side}`).whole, `${side} in one piece`)
    // A plain hemmed sleeve has no band
    const plain = o.sleeveFinish !== 'band'
    assert.equal(parts['kameez.sleeveBand'].hidden, plain, 'sleeve band only when banded')
    if (plain) assert.ok(store.get('yoke.sleeve').plainHem, 'plain hem')
  },
)
