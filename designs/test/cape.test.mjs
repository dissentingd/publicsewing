import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Cape } from '../cape/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  onePiece: { capePieces: 'one' },
  long: { capeLength: 0.78 },
  short: { capeLength: 0.3, capeFlare: 0, buttons: 0 },
  flared: { capeFlare: 30, capeSeamDrop: 0.5, buttons: 6 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`cape (${v}): ${name}`, () => {
      const pattern = new Cape({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      const one = options.capePieces === 'one'
      assert.equal(parts['cape.whole'].hidden, !one, 'whole')
      assert.equal(parts['cape.front'].hidden, one, 'front')
      assert.equal(parts['cape.back'].hidden, one, 'back')
      const s = store.get('cape.seams')
      // The seam over the shoulder sews together, tips to hem; the shoulder or the dart's legs too
      near(s.side[0], s.side[1], 3, 'side seam')
      near(s.shoulder[0], s.shoulder[1], 2, 'shoulders')
      near(s.dart[0], s.dart[1], 2, 'dart legs')
      // Level all round: the front and back as long as each other, within a little
      near(s.hemCf, s.hemCb, s.hemCb * 0.2, 'front and back lengths')
      // The collar fits the neck
      const c = store.get('coat.collar')
      near(c.neck, c.target, 1, 'collar')
      // A quarter circle goes well round the figure
      assert.ok(s.sweep > measurements.chest * 1.5, `sweep ${s.sweep.toFixed(0)}`)
    })
  }
}
