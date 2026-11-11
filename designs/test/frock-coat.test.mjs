import { test } from 'node:test'
import assert from 'node:assert/strict'
import { FrockCoat } from '../frock-coat/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  plain: { lining: false, insidePockets: false, lapelStyle: 'peak', buttons: 2 },
  wide: { tailAt: 0.3, tailWidth: 0.25, skirtLean: 25, skirtSeam: 2.6, breakAt: 0.7, buttons: 4 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`frock coat (${v}): ${name}`, () => {
      const pattern = new FrockCoat({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const get = (k) => store.get(k)
      near(get('blouse.sideBody').backSeam, get('blouse.back').seam, 0.5, 'back seam')
      near(get('blouse.sideBody').frontSeam, get('blouse.front').seam, 0.5, 'front seam')
      near(get('coat.front').shoulder, get('coat.back').shoulder, 0.5, 'shoulder seams')
      near(get('coat.collar').neck, get('coat.collar').target, 1, 'collar')
      near(get('library.topsleeve.sleevecapLength') ?? get('library.twoPartSleeve.sleevecapLength'), get('library.twoPartSleeve.sleevecapTarget'), 3, 'sleeve cap')
      // The skirt is drafted to fit the whole waist seam, then cut away in front to a tail
      const s = get('blouse.skirt')
      near(s.top, s.bottom, 1, 'waist seam')
      assert.ok(s.tail && s.tail.top > 0 && s.tail.top < s.top, 'the tail takes the back of the waist seam')
      assert.ok(s.tail.edge > 0 && s.back > 0, 'tail edges')
      assert.equal(store.get('blouse.skirtPocket', null), null, 'no skirt pocket')
      const parts = pattern.parts[0]
      assert.equal((parts['frockcoat.skirtLining'] ?? parts['tailcoat.skirtLining'] ?? parts['surtout.skirtLining']).hidden, options.lining === false, 'skirt lining')
      // Buttoned on CF, on the front, above its cut-off bottom edge
      const b = get('coat.buttons')
      assert.ok(b.rows.length === 1 && b.rows[0] === 0, 'one row, on CF')
      const front = parts['jacket.front']
      for (const [k, p] of Object.entries(front.points).filter(([k]) => /^button0_\d$/.test(k))) {
        const y = front.paths.hemBase.intersectsX(p.x)[0]?.y
        assert.ok(y !== undefined && p.y < y - 5, `${k} above the front's bottom edge`)
        assert.ok(p.x < front.points.seamHem.x, `${k} before the front seam`)
      }
      assert.ok(get('coat.lapel').breakY <= b.top + 1, 'lapel turns at the top button')
    })
  }
}
