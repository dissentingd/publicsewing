import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EtonJacket } from '../eton-jacket/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  longer: { lengthBelowWaist: 0.9 },
  plain: { lining: false, buttons: 0, hemCurve: 0.5 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`Eton jacket (${v}): ${name}`, () => {
      const pattern = new EtonJacket({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const get = (k) => store.get(k)
      // The body's seams, the shoulders, the collar and the sleeve
      near(get('blouse.sideBody').backSeam, get('blouse.back').seam, 0.5, 'back seam')
      near(get('blouse.sideBody').frontSeam, get('blouse.front').seam, 0.5, 'front seam')
      near(get('coat.front').shoulder, get('coat.back').shoulder, 0.5, 'shoulder seams')
      near(get('coat.collar').neck, get('coat.collar').target, 1, 'collar vs neckline')
      near(get('library.topsleeve.sleevecapLength') ?? get('library.twoPartSleeve.sleevecapLength'), get('library.twoPartSleeve.sleevecapTarget'), 3, 'sleeve cap vs armhole + ease')
      const front = pattern.parts[0]['jacket.front'].points
      const back = pattern.parts[0]['topcoat.back'].points
      // Short: the hem is above the seat line (by default), the lapel turning at the waist
      if (!options.lengthBelowWaist) assert.ok(back.cbHem.y < back.cbWaist.y + measurements.waistToSeat, 'hem above the seat line')
      near(get('coat.lapel').breakY, front.cfWaist.y, 1, 'lapel turns at the waist')
      assert.ok(get('coat.lapel').breakY < front.cfHem.y, 'the break is above the hem')
      // No pockets
      for (const w of Object.values(get('blouse.welts') ?? {})) assert.ok(w.len > 0, 'welt length')
    })
  }
}
