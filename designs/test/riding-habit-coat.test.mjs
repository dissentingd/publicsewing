import { RidingHabitCoat } from '../riding-habit-coat/src/index.mjs'
import { testJacket } from './jacket-checks.mjs'
import { measurementSet } from '../tools/render.mjs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

testJacket('riding habit coat', RidingHabitCoat, {
  default: {},
  plain: { lining: false, ridingHemFlare: 0.06, ridingBackFlare: 0.015 },
  fuller: { seatEase: 0.2, ridingHemFlare: 0.15 },
})

test('narrow back follows Weiler’s 1¼ in waist and 1¾ in hip proportions', () => {
  const measurements = measurementSet('cisFemaleAdult36')
  const pattern = new RidingHabitCoat({ measurements }).draft()
  const { seamWaist, hemSeam } = pattern.parts[0]['fitted-jacket.back'].points
  const hip = seamWaist.x + (hemSeam.x - seamWaist.x) * measurements.waistToSeat / (hemSeam.y - seamWaist.y)
  assert.ok(Math.abs(seamWaist.x / 25.4 - 1.25) < 0.1)
  assert.ok(Math.abs(hip / 25.4 - 1.75) < 0.1)
})
