import { test } from 'node:test'
import assert from 'node:assert/strict'
import { GoredSkirt } from '../gored-skirt/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = { default: {}, seven: { gores: 7, goreFlare: 0.3 }, fifteen: { gores: 15, frontWaistDrop: 0, zipLength: 0.6 } }

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`gored-skirt (${v}): ${name}`, () => {
      const pattern = new GoredSkirt({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      const count = store.get('skirt.count')
      assert.equal(count, ((options.gores ?? 5) + 1) / 2, 'gores a side')
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
