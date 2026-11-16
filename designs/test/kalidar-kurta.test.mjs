import { test } from 'node:test'
import assert from 'node:assert/strict'
import { KalidarKurta } from '../kalidar-kurta/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  short: { skirtLength: 0.2, kaliHem: 0.14 },
  longSleeves: { sleeveLength: 1.0 },
  apart: { skirtLength: 0.85, panelWidth: 0.16, armholeDepth: 0.3, shoulderDrop: 0, sleeveTaper: 0.1, sleeveLength: 0.25, kaliTop: 0.2, kaliHem: 0.4, kaliCurve: 0.03, neckWidth: 0.14, neckDepth: 0.25, backNeckDepth: 0, placketDepth: 0.3, placketWidth: 0.12 },
  narrow: { skirtLength: 0.15, panelWidth: 0.26, armholeDepth: 0.17, shoulderDrop: 0.05, sleeveTaper: 0, sleeveLength: 1.05, kaliTop: 0.04, kaliHem: 0.08, kaliCurve: 0, neckWidth: 0.06, neckDepth: 0.05, backNeckDepth: 0.15, placketDepth: 0.08, placketWidth: 0.05 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, m] of Object.entries(sets)) {
    test(`kalidar kurta (${v}): ${name}`, () => {
      const pattern = new KalidarKurta({ measurements: m, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const o = pattern.settings[0].options
      const get = (p) => store.get(`polygon.${p}`)
      const [front, back, sleeve, kali, gusset] = ['frontPanel', 'backPanel', 'sleeve', 'kali', 'gusset'].map(get)
      // Panels: 0-5 the neck, 6 the shoulder, 7 the side, 8 the hem, 9 the fold
      near(front.edges[6], back.edges[6], 0.5, 'shoulders')
      near(front.edges[7], back.edges[7], 0.5, 'panel sides')
      // Sleeve: 0 the fold, 1 the hem, 2 the underarm, 3 the armhole, sewn to the panel's side
      const a = sleeve.edges[3]
      // Kali: 0 the top, 1 the sloping side, 2 the hem, 3 the straight side, sewn to the panel below the sleeve
      near(kali.edges[3], front.edges[7] - a, 0.5, 'kali vs panel below the sleeve')
      // The gusset's sides: the kalis' tops (front and back) and the sleeve's underarm either side
      near(gusset.edges[0], kali.edges[0], 0.5, 'gusset vs kali top')
      assert.ok(sleeve.edges[2] > gusset.edges[0] + 20, 'underarm seam longer than the gusset')
      // Room: the chest at the underarm, the seat at the hip line
      const w = front.width
      const t = kali.edges[0]
      assert.ok(4 * w + 4 * t >= m.chest * 1.08, `chest round ${(4 * w + 4 * t).toFixed(0)} on ${m.chest}`)
      const L = front.height
      const top = L - kali.height // the kali's top, below the shoulder line
      const hipY = m.hpsToWaistBack + m.waistToSeat
      if (hipY < L) {
        const f = Math.max(0, (hipY - top) / kali.height)
        const kw = t + (kali.width - t) * f
        assert.ok(4 * w + 4 * kw >= m.seat * 1.04, `hip round ${(4 * w + 4 * kw).toFixed(0)} on seat ${m.seat}`)
      }
      // The hand passes through the sleeve's hem; the slit stops above the armhole's foot
      assert.ok(2 * sleeve.edges[1] >= m.wrist * 1.5, `sleeve hem ${(2 * sleeve.edges[1]).toFixed(0)} on wrist ${m.wrist}`)
      assert.ok(m.chest * o.neckDepth + L * o.placketDepth < L - 50, 'slit inside the panel')
    })
  }
}
