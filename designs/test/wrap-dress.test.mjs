import assert from 'node:assert/strict'
import { WrapDress } from '../wrap-dress/src/index.mjs'
import { testDress, onSeam } from './bodice-checks.mjs'

testDress('wrap dress', WrapDress, 'wrap-dress', {
  default: {},
  sleeveless: { sleeves: false },
  apart: { neckWiden: 0.12, backNeckDepth: 0.25, wrapOverlap: 0.4, skirtLength: 0.8, seatEase: 0.15, hemFlare: 0.2, tieLength: 2 },
}, (pattern) => {
  const store = pattern.setStores[0]
  const front = pattern.parts[0]['wrap-dress.front']
  assert.ok(onSeam(front, 'wrapTip'), 'surplice front reaches wrap tip')
  assert.ok(store.get('bodice.wrap').overlap > 0, 'front overlaps centre')
  assert.ok(pattern.parts[0]['wrap-dress.tie'].paths.seam.length() > 0, 'tie drafted')
  for (const name of ['front', 'skirtFront', 'tie']) {
    const cut = store.cutlist[`wrap-dress.${name}`]
    assert.equal(cut.materials.fabric[0].cut, 2, `${name} cut twice`)
    assert.equal(cut.materials.fabric[0].onFold, false, `${name} is not on a fold`)
  }
})
