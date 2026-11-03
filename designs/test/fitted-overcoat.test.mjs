import { test } from 'node:test'
import assert from 'node:assert/strict'
import { FittedOvercoat } from '../fitted-overcoat/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  plain: { hemFlare: 0, vent: false, lining: false, insidePockets: false, breastPockets: false, pocketFlaps: false, buttons: 2 },
  short: { lengthBelowWaist: 1.4, ventLength: 0.8, hemFlare: 0.08, buttons: 5, breakAt: 0 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`fitted-overcoat (${v}): ${name}`, () => {
      const pattern = new FittedOvercoat({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const get = (k) => store.get(k)
      near(get('blouse.sideBody').backSeam, get('blouse.back').seam, 0.5, 'back seam')
      near(get('blouse.sideBody').frontSeam, get('blouse.front').seam, 0.5, 'front seam')
      near(get('coat.front').shoulder, get('coat.back').shoulder, 0.5, 'shoulder seams')
      near(get('coat.collar').neck, get('coat.collar').target, 1, 'collar')
      near(get('library.topsleeve.sleevecapLength') ?? get('library.twoPartSleeve.sleevecapLength'), get('library.twoPartSleeve.sleevecapTarget'), 3, 'sleeve cap')
      const parts = pattern.parts[0]
      // The vent stops below the waist, on the back
      const back = parts['topcoat.back'].points
      const vent = store.get('coat.vent', null)
      if (options.vent !== false) assert.ok(vent && vent.top > back.cbWaist.y, 'vent below the waist')
      // It flares: each panel wider at the hem than at the seat
      if (options.hemFlare !== 0) assert.ok(back.seamHem.x > back.cbSeat.x + (back.seamStart.x - back.cbSeat.x) * 0.5, 'back has width at the hem')
      // The welts clear the front's seam, the buttons run down
      const front = parts['jacket.front'].points
      for (const [k, w] of Object.entries(get('blouse.welts'))) {
        assert.ok(w.len > 0, `${k} welt has a length`)
        assert.ok(w.x + w.len < Math.max(front.seamStart.x, front.seamHem.x), `${k} welt clears the front seam`)
      }
      const b = get('coat.buttons')
      assert.ok(b.top < b.bottom, 'buttons run down')
      assert.ok(get('coat.lapel').breakY <= b.top + 1, 'lapel turns at the top button')
    })
  }
}
