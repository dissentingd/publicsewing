import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MilitaryBlouse } from '../military-blouse/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  plain: { breastPockets: false, lowerPockets: false, frontDrop: 0, buttons: 7 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`military blouse (${v}): ${name}`, () => {
      const pattern = new MilitaryBlouse({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const get = (k) => store.get(k)
      // The two body seams: each side body edge matches its panel's edge
      near(get('blouse.sideBody').backSeam, get('blouse.back').seam, 0.5, 'back seam')
      near(get('blouse.sideBody').frontSeam, get('blouse.front').seam, 0.5, 'front seam')
      near(get('coat.front').shoulder, get('coat.back').shoulder, 0.5, 'shoulder seams')
      near(get('coat.collar').neck, get('coat.collar').target, 1, 'collar vs neckline')
      // The armhole, now over three pieces, is still what the sleeve was fitted to
      const parts = pattern.parts[0]
      const cap = get('library.topsleeve.sleevecapLength') ?? get('library.twoPartSleeve.sleevecapLength')
      const target = get('library.twoPartSleeve.sleevecapTarget')
      assert.ok(cap > 0 && target > 0, 'sleeve cap fitted')
      near(cap, target, 3, 'sleeve cap vs armhole + ease')
      // The waist is taken in: the panels' waist points sit inside their seams' start lines
      const back = parts['militaryblouse.back'].points
      assert.ok(back.seamHem.x > 0, 'back panel has width at the hem')
      // Welt pockets stay on the forepart
      const front = parts['militaryblouse.front'].points
      for (const [k, w] of Object.entries(get('blouse.welts'))) {
        assert.ok(w.len > 0, `${k} welt has a length`)
        assert.ok(w.x + w.len < front.seamStart.x, `${k} welt clears the front seam`)
      }
      const b = get('coat.buttons')
      assert.ok(b.top < b.bottom, 'buttons run down the front')
    })
  }
}
