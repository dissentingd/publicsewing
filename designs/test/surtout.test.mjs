import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Surtout } from '../surtout/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  long: { skirtSeam: 3 },
  plain: { breastPockets: false, buttons: 3, skirtLean: 5, skirtRound: 0, frontDrop: 0.1 },
  wide: { skirtLean: 40, buttonExtension: 0.09, buttonRow: 0.8 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`surtout (${v}): ${name}`, () => {
      const pattern = new Surtout({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const get = (k) => store.get(k)
      near(get('blouse.sideBody').backSeam, get('blouse.back').seam, 0.5, 'back seam')
      near(get('blouse.sideBody').frontSeam, get('blouse.front').seam, 0.5, 'front seam')
      near(get('coat.front').shoulder, get('coat.back').shoulder, 0.5, 'shoulder seams')
      near(get('coat.collar').neck, get('coat.collar').target, 1, 'collar')
      near(get('library.topsleeve.sleevecapLength') ?? get('library.twoPartSleeve.sleevecapLength'), get('library.twoPartSleeve.sleevecapTarget'), 3, 'sleeve cap')
      // The skirt's top fits the body's bottom edge, all three panels
      const s = get('blouse.skirt')
      near(s.top, s.bottom, 1, 'waist seam')
      assert.ok(s.back > 0, 'skirt')
      // Double-breasted: two rows, the lapel turning above the first button
      const b = get('coat.buttons')
      assert.ok(b.top < b.bottom, 'buttons run down')
      assert.ok(get('coat.lapel').breakY <= b.top + 1, 'lapel turns at the top button')
    })
  }
}
