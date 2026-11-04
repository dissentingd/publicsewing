import { test } from 'node:test'
import assert from 'node:assert/strict'
import { RidingSkirt } from '../riding-skirt/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

for (const [variant, options] of Object.entries({ default: {}, plain: { goreFlare: 0.45 }, 'deep-seat': { crotchDepthShare: 1.32, backExtension: 0.30 } })) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`riding-skirt (${variant}): ${name}`, () => {
      const pattern = new RidingSkirt({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      assert.equal(store.get('skirt.count'), 3)
      for (const piece of ['frontPanel', 'gore1', 'gore2']) assert.ok(!parts[`riding-skirt.${piece}`].hidden, piece)
      const front = store.get('skirt.culotte.front')
      const back = store.get('skirt.culotte.back')
      near(front.side, back.side, 0.5, 'side gores')
      near(front.inseam, back.inseam, 0.5, 'inseams')
      assert.ok(back.crotch > front.crotch, 'the back forks further for the seat')
      near(store.get('skirt.waist'), measurements.waist, measurements.waist * 0.02, 'waist')
    })
  }
}
