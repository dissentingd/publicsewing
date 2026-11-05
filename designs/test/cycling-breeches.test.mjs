import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CyclingBreeches } from '../cycling-breeches/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

for (const [variant, options] of Object.entries({ default: {}, plain: { cycleThighWidth: 0.65, sidePockets: false, backPocket: false }, long: { knickerDrop: 0.3, cycleBandLength: 1.05 } })) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`cycling-breeches (${variant}): ${name}`, () => {
      const pattern = new CyclingBreeches({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const front = store.get('trousers.front')
      const back = store.get('trousers.back')
      near(front.outseam, back.outseam, 1, 'outseam')
      near(front.inseam, back.inseam, 3, 'inseam')
      near(store.get('trousers.strips.waistband').length - front.flyWidth * 1.2, front.waist + back.waist, 0.5, 'waistband')
      assert.ok(front.hem + back.hem > store.get('trousers.strips.strap').length - 30, 'hem gathers into band')
      assert.ok(pattern.parts[0]['trousers.front'].paths.gathers, 'front gathering line')
      assert.ok(pattern.parts[0]['trousers.back'].paths.gathers, 'back gathering line')
    })
  }
}

test('cycling-breeches: proportion 40 plate', () => {
  const measurements = sets.cisMaleAdult40
  const pattern = new CyclingBreeches({ measurements, sa: 10 }).draft()
  const store = checkClean(pattern)
  near((store.get('trousers.front.hem') + store.get('trousers.back.hem')) / 25.4, 21.5, 0.2, 'lower leg circumference')
  const back = pattern.parts[0]['trousers.back'].points
  near((back.wOut.y - back.wIn.y) / 25.4, 2, 0.2, 'back waist rise')
  near(store.get('trousers.strips.strap').width / 25.4, 3, 0.1, 'band cut width')
  near((store.get('trousers.strips.strap').length - 30) / 25.4, 16, 0.1, 'band without overlap')
  const thigh = ['trousers.front', 'trousers.back'].reduce((total, key) => {
    const part = pattern.parts[0][key]
    const xs = part.paths.seam.intersectsY(part.points.thighOut.y).map(p => p.x)
    return total + Math.max(...xs) - Math.min(...xs)
  }, 40) // Four 10 mm seam allowances, as the source includes seams in its thigh circumference.
  near(thigh / 25.4, 30.5, 0.3, 'thigh circumference including seams')
})
