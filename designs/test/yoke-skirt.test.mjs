import { test } from 'node:test'
import assert from 'node:assert/strict'
import { YokeSkirt } from '../yoke-skirt/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  plain: { goreEdgeFlare: 0, hipYokeDepth: 0.5 },
  apart: { hipYokeDepth: 0.9, goreEdgeFlare: 0.2, flareFrom: 0.25, zipLength: 1.2, length: 0.5 },
}
const gores = ['front', 'sideFront', 'sideBack', 'back']

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`yoke-skirt (${v}): ${name}`, () => {
      const pattern = new YokeSkirt({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const s = store.get('skirt.yokeSeams')
      // The yokes sew together at the side, and each to the two gores below it
      near(s.frontYoke.side, s.backYoke.side, 0.5, 'yoke side seam')
      near(s.frontYoke.bottom, s.front.top + s.sideFront.top, 0.5, 'front yoke to gores')
      near(s.backYoke.bottom, s.back.top + s.sideBack.top, 0.5, 'back yoke to gores')
      // The gores sew together: front to side front, the side seam, side back to back
      near(s.front.left, s.sideFront.right, 0.5, 'front gore seam')
      near(s.sideFront.left, s.sideBack.right, 0.5, 'side seam')
      near(s.sideBack.left, s.back.right, 0.5, 'back gore seam')
      // The darts are closed in the yokes: the waist is the body's, with Sarah's little ease
      const waist = store.get('skirt.waist')
      assert.ok(waist >= measurements.waist - 1 && waist <= measurements.waist * 1.1, `waist ${waist}`)
      const band = store.get('trousers.strips.waistband')
      near(band.length - band.width, waist, 0.5, 'waistband')
      // The yoke line goes round the hips at its depth, and the hem is wider than the seat
      assert.ok(2 * (s.frontYoke.bottom + s.backYoke.bottom) >= waist, 'yoke line')
      assert.ok(2 * gores.reduce((t, g) => t + s[g].hem, 0) >= measurements.seat, 'hem passes the seat')
    })
  }
}
