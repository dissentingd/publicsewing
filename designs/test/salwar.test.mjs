import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Salwar } from '../salwar/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  patiala: { kaliWidth: 0.625 },
  extremes: { kaliWidth: 1.3, bottomWidth: 2.5, salwarLength: 0.7, crotchShare: 0.45, kaliPoint: 0.05, beltWidth: 0.4 },
  narrow: { kaliWidth: 0.3, bottomWidth: 1.15, crotchShare: 0.25, kaliPoint: 0.01, beltDepth: 0.1 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`salwar (${v}): ${name}`, () => {
      const pattern = new Salwar({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      for (const p of ['centrePanel', 'kali', 'belt']) assert.ok(!parts[`salwar.${p}`].hidden, p)
      const c = store.get('polygon.centrePanel').edges // top, side, hem, fold
      const k = store.get('polygon.kali').edges // crotch, point, inseam, point, side, top
      const b = store.get('polygon.belt').edges // top, side, bottom, fold
      // The kali's straight side sews to the centre panel's side
      near(k[4], c[1], 0.5, 'kali side vs centre panel')
      // The inseam (front kali to back kali) and crotch seams pair up: four identical kalis
      assert.ok(k[2] > k[0] && k[0] > 10, 'crotch seam above a longer inseam')
      // The legs' tops gather into the belts: each leg a panel (on the fold) and two kalis
      const legsTop = 2 * (2 * c[0] + 2 * k[5])
      const beltRound = 2 * 2 * b[2]
      assert.ok(legsTop > beltRound, `legs ${legsTop.toFixed(0)} gather into belt ${beltRound.toFixed(0)}`)
      // The belt goes on over the hips; the hem over the foot
      assert.ok(beltRound >= measurements.seat * 1.04, 'belt passes the hips')
      assert.ok(2 * c[2] >= measurements.ankle * 1.15, 'hem passes the foot')
    })
  }
}
