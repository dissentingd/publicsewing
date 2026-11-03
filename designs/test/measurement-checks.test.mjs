// lib/checks.mjs: silent on every size set we hold, and it speaks up on real slips.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { measurementProblems } from '../lib/checks.mjs'
import { readSpec } from '../lib/load-spec.mjs'
import { designFromSpec } from '../lib/spec.mjs'
import { sets, stoutSets } from './coat-checks.mjs'
import { all as children } from '../sizes/children.mjs'

const men42 = sets.cisMaleAdult42
const flagged = (measurements) => {
  const { Design } = designFromSpec(readSpec(new URL('../chore-coat/spec.yaml', import.meta.url)))
  const pattern = new Design({ measurements, sa: 10 })
  pattern.draft()
  return pattern.setStores[0].plugins?.['plugin-annotations']?.flags?.warn?.measurementsLookWrong
}

for (const [name, m] of Object.entries({ ...sets, ...stoutSets, ...children })) {
  test(`no warning: ${name}`, () => assert.deepEqual(measurementProblems(m), []))
}

test('an entry in inches read as cm', () => {
  assert.match(measurementProblems({ ...men42, chest: men42.chest / 2.54 }).join(' '), /Neck looks large beside chest/)
})
test('everything in the wrong units', () => {
  const small = Object.fromEntries(Object.entries(men42).map(([k, v]) => [k, k === 'shoulderSlope' ? v : v / 10]))
  assert.match(measurementProblems(small).join(' '), /are the units right/)
})
test('lengths out of order', () => {
  assert.match(measurementProblems({ ...men42, waistToKnee: men42.waistToFloor + 10 }).join(' '), /Waist to knee should be shorter than waist to floor/)
})
test('a measurement left out is not a problem', () => assert.deepEqual(measurementProblems({ chest: 1000 }), []))
test('HPS reads as HPS', () => {
  assert.match(measurementProblems({ ...men42, hpsToWaistBack: 100 }).join(' '), /HPS to waist back looks small beside chest/)
})
test('reaches the pattern tool as a flag', () => {
  assert.equal(flagged(men42), undefined)
  const flag = flagged({ ...men42, neck: men42.neck * 3 })
  assert.equal(flag.title, 'Please check these measurements')
  assert.match(flag.desc, /Neck looks large beside chest/)
})
