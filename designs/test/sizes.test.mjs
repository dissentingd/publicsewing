import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cisMaleAdult38 } from '@freesewing/models'
import { load } from '../sizes/usda1939/parse.mjs'
import { check } from '../sizes/usda1939/check.mjs'
import { all, boys, girls } from '../sizes/children.mjs'

test('USDA 1939 transcription passes its structural checks', () => {
  const data = load()
  assert.equal(data.boys.length, 39)
  assert.equal(data.girls.length, 36)
  assert.deepEqual(check(data.boys), [])
  assert.deepEqual(check(data.girls), [])
})

test('every children\'s set has every FreeSewing measurement, as a positive number', () => {
  assert.equal(Object.keys(boys).length + Object.keys(girls).length, 75)
  for (const [name, set] of Object.entries(all)) {
    for (const k of Object.keys(cisMaleAdult38)) {
      assert.ok(Number.isFinite(set[k]) && set[k] > 0, `${name}.${k} = ${set[k]}`)
    }
  }
})
