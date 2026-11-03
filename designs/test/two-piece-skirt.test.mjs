import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TwoPieceSkirt } from '../two-piece-skirt/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = { default: {}, flared: { goreFlare: 0.5, panelShare: 0.5, frontWaistDrop: 0 } }

// Mitchell's figure (p. 84): the front narrower than the back at the hip, the waists his (p. 86)
test('two-piece-skirt: Mitchell\'s figure', () => {
  const IN = 25.4
  const measurements = { ...sets.cisFemaleAdult36, seat: 40 * IN, hips: 40 * IN, waist: 26.5 * IN, waistToSeat: 7 * IN, waistToHips: 4 * IN, waistToFloor: 41 * IN }
  const store = new TwoPieceSkirt({ measurements, sa: 10 }).draft().setStores[0]
  const seams = store.get('skirt.seams')
  const { left, right } = store.get('skirt.gores')[0]
  near((right.S.x - left.S.x) / IN, 9, 0.5, 'front at the hip')
  near(seams[0].waist / IN, 6.25, 0.2, 'front waist')
  near(seams[1].waist / IN, 7, 0.2, 'back waist')
})

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`two-piece-skirt (${v}): ${name}`, () => {
      const pattern = new TwoPieceSkirt({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      const count = store.get('skirt.count')
      assert.equal(count, 2, 'gores a side')
      // The front panel and this many gores are drawn, the rest left out
      assert.ok(!parts['gored-skirt.frontPanel'].hidden, 'front panel is drawn')
      for (let i = 1; i <= 7; i++) assert.equal(parts[`gored-skirt.gore${i}`].hidden, i >= count, `gore${i}`)
      // Each seam's two edges sew together
      const seams = store.get('skirt.seams')
      for (let i = 1; i < count; i++) near(seams[i].right, seams[i - 1].left, 0.5, `seam ${i}`)
      // The waist comes out at the waist (Sarah's ease is nil), the hem past the seat
      near(store.get('skirt.waist'), measurements.waist, measurements.waist * 0.02, 'waist')
      const hem = 2 * Object.values(seams).reduce((t, s) => t + s.hem, 0)
      assert.ok(hem >= measurements.seat, `hem ${hem.toFixed(0)} passes the seat`)
      // The waistband fits the waist, with an underlap its own height
      const band = store.get('trousers.strips.waistband')
      near(band.length - band.width, store.get('skirt.waist'), 0.5, 'waistband')
    })
  }
}
