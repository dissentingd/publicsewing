// The baby and toddler sets (sizes/babies.mjs): the same measurements as our children's sets,
// none the measurement check questions, and each size larger than the one before.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { babies, labels } from '../sizes/babies.mjs'
import { all as children } from '../sizes/children.mjs'
import { measurementProblems } from '../lib/checks.mjs'

const keys = Object.keys(Object.values(children)[0]).sort()
const ordered = Object.keys(babies).sort((a, b) => labels[a].height - labels[b].height)

for (const [name, m] of Object.entries(babies)) {
  test(`${name}: our children's measurements, all whole mm`, () => {
    assert.deepEqual(Object.keys(m).sort(), keys)
    for (const [k, v] of Object.entries(m)) assert.ok(Number.isInteger(v) && v > 0, k)
  })
  test(`${name}: no measurement warning`, () => assert.deepEqual(measurementProblems(m), []))
}

test('each size is larger than the one before', () => {
  for (let i = 1; i < ordered.length; i++) {
    for (const k of ['chest', 'waist', 'seat', 'neck', 'head', 'crossSeam', 'inseam', 'waistToFloor', 'hpsToWaistBack', 'shoulderToWrist']) {
      assert.ok(babies[ordered[i]][k] >= babies[ordered[i - 1]][k], `${k}: ${ordered[i - 1]} -> ${ordered[i]}`)
    }
  }
})

test('the largest stays below our smallest children\'s set', () => {
  const smallest = Math.min(...Object.values(children).map((m) => m.waistToFloor))
  assert.ok(babies[ordered.at(-1)].waistToFloor < smallest)
})
