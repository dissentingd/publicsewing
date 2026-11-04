import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ScoutCoat } from '../scout-coat/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  plain: { breastPockets: false, lowerPockets: false, frontDrop: 0, buttons: 3 },
  big: { topPocketWidth: 0.2, bottomPocketWidth: 0.24, bottomPocketDepth: 0.32, pocketBelowWaist: 0.8 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`scout coat (${v}): ${name}`, () => {
      const pattern = new ScoutCoat({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const get = (k) => store.get(k)
      // The body's seams, the shoulders, the collar and the sleeve
      near(get('blouse.sideBody').backSeam, get('blouse.back').seam, 0.5, 'back seam')
      near(get('blouse.sideBody').frontSeam, get('blouse.front').seam, 0.5, 'front seam')
      near(get('coat.front').shoulder, get('coat.back').shoulder, 0.5, 'shoulder seams')
      near(get('coat.collar').neck, get('coat.collar').target, 1, 'collar vs neckline')
      near(get('library.topsleeve.sleevecapLength') ?? get('library.twoPartSleeve.sleevecapLength'), get('library.twoPartSleeve.sleevecapTarget'), 3, 'sleeve cap vs armhole + ease')
      // Patch pockets, not the tunic's welts
      const parts = pattern.parts[0]
      for (const k of ['breastWelt', 'breastBag', 'lowerWelt', 'lowerBag']) assert.ok(parts[`militaryblouse.${k}`].hidden, `no ${k}`)
      // Each pocket's on the forepart: clear of the lap, its side clear of the front seam, above the hem
      const front = parts['militaryblouse.front']
      const ext = get('coat.frontEdge').ext
      const pockets = get('coat.pockets')
      for (const [k, q] of Object.entries(pockets)) {
        assert.ok(q.w > 0 && q.h > 0, `${k} has a size`)
        assert.ok(q.x > ext - 1, `${k} clear of the lap`)
        assert.ok(q.y + q.h < front.points.cfHem.y, `${k} above the hem`)
        // The seam's nearest x over the pocket's height
        for (const y of [q.y, q.y + q.h / 2, q.y + q.h]) {
          const seam = Math.max(...front.paths.seam.intersectsY(y).map((h) => h.x))
          assert.ok(q.x + q.w < seam + 1, `${k}'s side ${(q.x + q.w).toFixed(0)} clear of the seam ${seam.toFixed(0)} at ${y.toFixed(0)}`)
        }
      }
      assert.ok(pockets.breast.y < pockets.lower.y, 'top pocket above the bottom one')
    })
  }
}
