import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PantryJacket } from '../pantry-jacket/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

for (const [variant, options] of Object.entries({ default: {}, plain: { lowerPockets: false } })) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`pantry jacket (${variant}): ${name}`, () => {
      const pattern = new PantryJacket({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const get = (key) => store.get(key)
      near(get('blouse.sideBody').backSeam, get('blouse.back').seam, 0.5, 'back seam')
      near(get('blouse.sideBody').frontSeam, get('blouse.front').seam, 0.5, 'front seam')
      near(get('coat.front').shoulder, get('coat.back').shoulder, 0.5, 'shoulder seams')
      near(get('coat.collar').neck, get('coat.collar').target, 1, 'collar to neckline')
      const front = pattern.parts[0]['jacket.front']
      assert.equal(Boolean(front.paths.lowerWelt), variant === 'default', 'two front welts')
      assert.ok(get('coat.lapel').breakY < front.points.cfHem.y, 'lapel breaks above the hem')
    })
  }
}
