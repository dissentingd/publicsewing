import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Churidar } from '../churidar/src/index.mjs'
import { sets, checkClean } from './coat-checks.mjs'

const variants = {
  default: {},
  extremes: { churidarLength: 1.4, topWidth: 0.45, crotchShare: 0.45, thighCurve: 0.08, kneeWidth: 1.4, ankleWidth: 1.3, beltWidth: 0.7 },
  close: { churidarLength: 1, topWidth: 0.28, crotchShare: 0.25, thighCurve: 0, kneeWidth: 1, ankleWidth: 1, beltDepth: 0.1 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`churidar (${v}): ${name}`, () => {
      const pattern = new Churidar({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const leg = store.get('polygon.leg')
      const e = leg.edges // top, crotch, inseam (5 parts), hem, fold
      const belt = store.get('polygon.belt').edges
      // Legs gather into the belt; the belt goes on over the hips; the hem over the heel
      const legsTop = 2 * 2 * e[0]
      assert.ok(legsTop >= 2 * belt[2] - 0.5, `legs ${legsTop.toFixed(0)} gather into the belt ${(2 * belt[2]).toFixed(0)}`)
      assert.ok(2 * belt[2] >= measurements.seat * 1.04, 'belt passes the hips')
      assert.ok(2 * e[7] >= measurements.heel * 0.99, 'hem passes the heel')
      // Longer than the leg: it rucks up at the ankle
      assert.ok(leg.height + store.get('polygon.belt').height > measurements.waistToFloor * 0.95, 'long enough to ruck')
      assert.ok(e[1] > 10, 'crotch seam')
    })
  }
}
