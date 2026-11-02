import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PleatedSkirt } from '../pleated-skirt/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = { default: {}, box: { pleatStyle: 'box', gores: 7 }, long: { gores: 15, length: 0.9, pleatHem: 0.05 } }

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`pleated-skirt (${v}): ${name}`, () => {
      const pattern = new PleatedSkirt({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      const count = store.get('skirt.count')
      assert.equal(count, ((options.gores ?? 11) + 1) / 2, 'gores a side')
      for (let i = 1; i <= 7; i++) assert.equal(parts[`pleated-skirt.gore${i}`].hidden, i >= count, `gore${i}`)
      // Each seam's two edges sew together: above the hip line the gores' edges, below it the
      // underlay's edge to the next gore's (side) or to its underlay (box). An underlay's edge
      // leans a little more than the gore's, so allow 2 mm
      const seams = store.get('skirt.seams')
      for (let i = 1; i < count; i++) near(seams[i].right, seams[i - 1].left, 2, `seam ${i}`)
      // Every gore has its underlays: one (side), or two except on the CF fold (box)
      const box = options.pleatStyle === 'box'
      for (let i = 0; i < count; i++) assert.equal(seams[i].pleats, box && i > 0 ? 2 : 1, `gore ${i} pleats`)
      // The waist comes out at the waist; the waistband fits it
      near(store.get('skirt.waist'), measurements.waist, measurements.waist * 0.02, 'waist')
      const band = store.get('trousers.strips.waistband')
      near(band.length - band.width, store.get('skirt.waist'), 0.5, 'waistband')
    })
  }
}
