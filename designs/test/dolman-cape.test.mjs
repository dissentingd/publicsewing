import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DolmanCape } from '../dolman-cape/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  long: { dolmanLength: 0.9 },
  short: { dolmanLength: 0.35, dolmanHip: 0, buttons: 0 },
  wide: { dolmanArm: 0.15, dolmanHip: 0.2, buttons: 6 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`dolman-cape (${v}): ${name}`, () => {
      const pattern = new DolmanCape({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const s = store.get('cape.seams')
      // Below the seat line the two are the same length by construction; above it, with the arm dart sewn
      assert.ok(s.below > 0, 'side seam below the seat line')
      near(s.upper[0], s.upper[1], 1, 'side seams above the notch')
      near(s.dart[0], s.dart[1], 0.5, 'dart legs')
      const c = store.get('coat.collar')
      near(c.neck, c.target, 1, 'collar')
      // It stands well out from the body: the hem round more than the seat
      assert.ok(2 * (s.hem[0] + s.hem[1]) > measurements.seat, `hem ${s.hem.map((x) => x.toFixed(0))}`)
    })
  }
}
