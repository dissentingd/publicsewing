import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ApronRidingSkirt } from '../apron-riding-skirt/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

for (const [variant, options] of Object.entries({ default: {}, plain: { apronSweep: 0.82 }, short: { apronLength: 0.75, openingLength: 0.23 } })) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`apron-riding-skirt (${variant}): ${name}`, () => {
      const pattern = new ApronRidingSkirt({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      for (const piece of ['partI', 'partII', 'longStrap', 'shortTab']) assert.ok(!parts[`apron-riding-skirt.${piece}`].hidden, piece)
      const front = store.get('polygon.partI')
      const back = store.get('polygon.partII')
      assert.ok(front.width > back.width, 'broad asymmetric front apron')
      assert.ok(front.height > back.height, 'front cutaway rises above the back waist')
      assert.ok(parts['apron-riding-skirt.partI'].snippets.notch0, 'long strap attachment')
      assert.ok(parts['apron-riding-skirt.partI'].snippets.notch1, 'short tab attachment')
      assert.ok(parts['apron-riding-skirt.partII'].snippets.button0, 'button on back apron')
      const strap = store.get('trousers.strips.longStrap')
      near(strap.length, measurements.knee * (options.legStrapLength ?? 1.25), 0.5, 'leg strap length')
    })
  }
}
