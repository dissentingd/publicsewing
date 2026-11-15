import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Jeans } from '../jeans/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  tapered: { hemWidth: 0.6 },
  bootcut: { kneeEase: 0.1, hemWidth: 1.15 },
  extremes: { yokeDepth: 0.5, yokeSide: 0.18, pocketEntryWidth: 0.16, pocketEntryDepth: 0.45, pocketBagDepth: 0.55, coinPocket: false, rivets: false, waistbandHeight: 0.06, backPocketPoint: 0 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`jeans (${v}): ${name}`, () => {
      const pattern = new Jeans({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      const b = store.get('trousers.back')
      const f = store.get('trousers.front')
      const B = store.get('jeans.back')
      const F = store.get('jeans.front')
      // Legs sew together; the band comes off both outseams alike
      near(f.inseam, b.inseam, 3, 'inseam')
      near(F.outseam, B.outseam, 1, 'outseam below the band')
      // The yoke seam: the yoke's lower edge (dart closed) is the leg's top
      near(B.yokeBottom, B.legTop, 0.5, 'yoke seam')
      assert.ok(B.yokeSide > 5 && B.yokeSeat > 5, 'yoke has depth')
      // The contour band's edges are the legs' band top and bottom
      const band = store.get('jeans.band')
      near(band.top, B.top + F.top, 1, 'band top')
      near(band.bottom, B.bottom + F.bottom, 1, 'band bottom')
      // The pocket: the facing shorter than the bag, the mouth inside the bag
      assert.ok(F.facingSide < F.bagSide, 'facing shorter than the bag')
      assert.ok(F.entry.top > 0 && F.entry.scoop > F.entry.top * 0.8, 'scooped mouth')
      assert.equal(parts['trousers.coinPocket'].hidden, options.coinPocket === false, 'coin pocket')
      if (options.coinPocket !== false) assert.ok(F.coin.height < F.facingSide, 'coin pocket on the facing')
      assert.ok(B.pocket.top > 0 && B.pocket.depth > 0, 'back pocket marked')
      assert.ok(f.fly > 0 && F.fly > 0, 'fly')
    })
  }
}
