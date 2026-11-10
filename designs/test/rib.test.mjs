// The rib piece type (lib/rib.mjs): a band sized from the edge it finishes.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { designFromSpec } from '../lib/spec.mjs'
import { ribSize } from '../lib/rib.mjs'
import { sets } from './coat-checks.mjs'

const band = (extra) =>
  designFromSpec({
    block: 'brian',
    about: { id: 'ribtest', name: 'Rib test' },
    pieces: { cuff: { part: 'rib', edge: 'wrist * 1.1', height: 50, ...extra } },
  }).Design

test('rib: length is the edge less its stretch, cut double height', () => {
  const m = sets.cisMaleAdult38
  const pattern = new (band({ stretch: 0.2, round: true }))({ measurements: m, sa: 10 }).draft()
  assert.deepEqual(pattern.setStores[0].logs.error, [])
  const r = pattern.setStores[0].get('rib.cuff')
  assert.ok(Math.abs(r.length - m.wrist * 1.1 * 0.8) < 1e-6)
  const p = pattern.setStores[0].get('polygon.cuff')
  assert.ok(Math.abs(p.width - r.length) < 1e-6 && Math.abs(p.height - 100) < 1e-6)
  assert.equal(Object.keys(pattern.parts[0]['ribtest.cuff'].snippets).filter((k) => k.startsWith('notch')).length, 3)
})

test('rib: stretch defaults to 15%', () => {
  const pattern = new (band())({ measurements: sets.cisFemaleAdult36, sa: 10 }).draft()
  const r = pattern.setStores[0].get('rib.cuff')
  assert.equal(r.stretch, 0.15)
})

test('rib: refuses a stretch that would leave no band', () => {
  assert.throws(() => ribSize({ edge: 200, stretch: 0.6, height: 40 }))
  assert.throws(() => ribSize({ edge: 0, height: 40 }))
})
