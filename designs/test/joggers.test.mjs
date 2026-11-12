import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Joggers } from '../joggers/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

for (const [name, measurements] of Object.entries(sets)) for (const [variant, options] of Object.entries({
  default: {},
  plain: { pockets: false },
  apart: { ankleLength: 0.88, legTaper: 0.2, ankleEase: 0.35, ribStretch: 0.22, sidePocketTop: 0.15, sidePocketLength: 0.7 },
})) {
  test(`joggers ${variant}: ${name}`, () => {
    const pattern = new Joggers({ measurements, options, sa: 10 }).draft()
    const store = checkClean(pattern)
    const front = store.get('knickers.front')
    const back = store.get('knickers.back')
    near(front.outseam, back.outseam, 0.5, 'outseams')
    near(front.inseam, back.inseam, 0.5, 'inseams')
    near(store.get('rib.cuff').edge, front.hem + back.hem, 0.01, 'cuff edge')
    assert.ok(front.hem > 0 && back.hem > 0)
    assert.ok(front.waist + back.waist >= measurements.seat / 2, 'waist passes seat')
    if (options.pockets === false) assert.ok(pattern.parts[0]['joggers.pocketBag'].hidden, 'plain pocket bag is hidden')
    else {
      const fp = store.get('knickers.pocket.front')
      const bp = store.get('knickers.pocket.back')
      near(fp.opening, bp.opening, 5, 'pocket openings')
      assert.ok(fp.opening > 0)
      assert.equal(store.cutlist['joggers.pocketBag'].materials.fabric[0].cut, 4)
    }
  })
}
