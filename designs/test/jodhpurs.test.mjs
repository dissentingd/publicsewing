import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Jodhpurs } from '../jodhpurs/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  ladies: { opening: 'side', thighFlare: 0.039, backFlare: 2.3, kneeEase: 0.08, legBalance: 0.56, calfWidth: 1.04, calfAt: 0.31, turnUpDepth: 0.032 },
  plain: { turnUps: false, sidePockets: false, backPocket: false, beltLoops: 0, thighFlare: 0, breechesLength: 0.7 },
  full: { thighFlare: 0.1, backFlare: 3, cuffWidth: 2.2, breechesLength: 1 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`jodhpurs (${v}): ${name}`, () => {
      const pattern = new Jodhpurs({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      const b = store.get('trousers.back')
      const f = store.get('trousers.front')
      near(f.outseam, b.outseam, 1, 'outseam')
      near(f.inseam, b.inseam, 3, 'inseam')
      // No buttoned leg opening; the bottom wide enough to go on over the foot (the heel round about 1.3 x the ankle)
      assert.equal(f.opening, undefined, 'no leg opening')
      assert.ok(f.hem + b.hem > measurements.ankle * 1.15, `bottom ${(f.hem + b.hem).toFixed(0)} on ankle ${measurements.ankle}`)
      // Cuffs drawn when wanted
      assert.equal(Boolean(parts['trousers.front'].paths.cuffFold), options.turnUps !== false, 'turn-up')
      const side = options.opening === 'side'
      assert.equal(parts['trousers.flyShield'].hidden, side, 'fly shield only with a fly')
      assert.equal(parts['trousers.sideWaistband'].hidden, !side, 'one-piece band only with a side opening')
      if (side) near(f.sideZip, b.sideZip, 1, 'side zip')
      else assert.ok(f.fly > 0, 'fly')
    })
  }
}
