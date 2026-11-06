import { test } from 'node:test'
import assert from 'node:assert/strict'
import { FourGoreSkirt } from '../four-gore-skirt/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

test('four-gore-skirt: Schorr waist shares', () => {
  const measurements = { ...sets.cisFemaleAdult36, waist: 26 * 25.4, seat: 40 * 25.4 }
  const pattern = new FourGoreSkirt({ measurements, sa: 10 }).draft()
  const store = checkClean(pattern)
  const g = store.get('skirt.gores')
  assert.equal(g.length, 4, 'four pattern panels across the half skirt')
  const front = g[0].left.W.x - g[1].right.W.x
  const side = g[1].left.W.x - g[2].right.W.x
  const back = g[2].left.W.x - g[3].right.W.x
  near(front / (front + side + back), 0.1, 0.005, 'front takes 1/10')
  near(side / (front + side + back), 0.5, 0.005, 'side takes 1/2')
  near(back / (front + side + back), 0.4, 0.005, 'back-middle takes 2/5')
  near(store.get('skirt.waist'), measurements.waist, measurements.waist * 0.02, 'finished waist')
})

for (const [variant, options] of Object.entries({ default: {}, straighter: { goreFlare: 0.4 }, plain: { goreFlare: 0.2, frontWaistDrop: 0, panelShare: 0.2 } })) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`four-gore-skirt (${variant}): ${name}`, () => {
      const pattern = new FourGoreSkirt({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      assert.equal(store.get('skirt.count'), 4)
      const seams = store.get('skirt.seams')
      for (let i = 1; i < 4; i++) near(seams[i].right, seams[i - 1].left, 0.5, `seam ${i}`)
      const hem = 2 * Object.values(seams).reduce((total, seam) => total + seam.hem, 0)
      assert.ok(hem >= measurements.seat, 'hem passes the seat')
    })
  }
}
