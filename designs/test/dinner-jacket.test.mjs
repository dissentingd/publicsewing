import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DinnerJacket } from '../dinner-jacket/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  plain: { cutawayWidth: 0, lapelStyle: 'notch', hemCurve: 0, pocketFlaps: true },
  open: { cutawayTop: 0.4, cutawayWidth: 0.14, breakAt: 0.6, breastPockets: true, vent: true },
}

const front0 = (pattern) => pattern.parts[0]['jacket.front'].points

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`dinner jacket (${v}): ${name}`, () => {
      const pattern = new DinnerJacket({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const get = (k) => store.get(k)
      // The two body seams: each side body edge matches its panel's edge
      near(get('blouse.sideBody').backSeam, get('blouse.back').seam, 0.5, 'back seam')
      near(get('blouse.sideBody').frontSeam, get('blouse.front').seam, 0.5, 'front seam')
      near(get('coat.front').shoulder, get('coat.back').shoulder, 0.5, 'shoulder seams')
      near(get('coat.collar').neck, get('coat.collar').target, 1, 'collar vs neckline')
      assert.ok(get('coat.lapel').breakY > front0(pattern).cfNeck.y, 'lapel breaks below the neck')
      const cap = get('library.topsleeve.sleevecapLength') ?? get('library.twoPartSleeve.sleevecapLength')
      const target = get('library.twoPartSleeve.sleevecapTarget')
      assert.ok(cap > 0 && target > 0, 'sleeve cap fitted')
      near(cap, target, 3, 'sleeve cap vs armhole + ease')
      const parts = pattern.parts[0]
      const back = parts['topcoat.back'].points
      assert.ok(back.seamHem.x > 0, 'back panel has width at the hem')
      // The vent stops below the waist
      const vent = store.get('coat.vent', null)
      if (options.vent) assert.ok(vent && vent.top > back.cbWaist.y, 'vent below the waist')
      const front = parts['jacket.front'].points
      for (const [k, w] of Object.entries(get('blouse.welts'))) {
        assert.ok(w.len > 0, `${k} welt has a length`)
        assert.ok(w.x + w.len < front.seamStart.x, `${k} welt clears the front seam`)
      }
      // The cutaway: the front edge meets the hem inside the stand, below the button
      const { ext } = get('coat.frontEdge')
      if ((options.cutawayWidth ?? 0.083) > 0) assert.ok(front.edgeHem.x > -ext + 1, 'front cut away at the hem')
      const last = get('coat.buttons')
      if (front.cutawayTop) assert.ok(front.cutawayTop.y > (last.count > 1 ? last.bottom : last.top), 'cutaway starts below the last button')
      const b = get('coat.buttons')
      assert.ok(b.top < b.bottom, 'buttons run down the front')
    })
  }
}
