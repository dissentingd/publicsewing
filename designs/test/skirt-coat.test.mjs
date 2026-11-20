import { SkirtCoat } from '../skirt-coat/src/index.mjs'
import { testJacket } from './jacket-checks.mjs'
import { sets, near } from './coat-checks.mjs'
import assert from 'node:assert/strict'
import { test } from 'node:test'

testJacket('skirt coat', SkirtCoat, {
  default: {},
  plain: { hipDartIntake: 0, cbFlare: 0, buttonInset: 1 },
  short: { lengthBelowWaist: 0.4, skirtDrop: 0.04, frontSkirtDrop: 0.02 },
}, (pattern) => {
  const store = pattern.setStores[0]
  const s = store.get('jacket.seams')
  near(s.backSkirtJoin[0], s.backSkirtJoin[1], 0.01, 'back skirt join')
  near(s.frontSkirtJoin[0], s.frontSkirtJoin[1], 0.01, 'front skirt join')
  if (s.frontSkirtDart) {
    near(s.frontSkirtDart[0], s.frontSkirtDart[1], 0.01, 'front hip dart legs')
    assert.ok(s.frontSkirtDartIntake > 0, 'front hip dart takes in fabric')
  }
  near(s.sideBack, s.sideFront, 0.5, 'bodice side seams')
  const panels = store.get('jacket.panels')
  const f = store.get('jacket.front')
  assert.ok(f.buttonBottom < panels.frontSkirt.marks.topEdge.y, 'buttons stop above the skirt join')
  for (const pocket of Object.values(panels.frontSkirt.pockets ?? {})) {
    assert.ok(pocket.y > panels.frontSkirt.marks.topEdge.y, 'pocket mouth is on the skirt')
  }
})

test('the default skirt coat opens a sewable hip dart', () => {
  const pattern = new SkirtCoat({ measurements: sets.usdaGirlC8, sa: 10 }).draft()
  const store = pattern.setStores[0]
  const s = store.get('jacket.seams')
  assert.ok(s.frontSkirtDartIntake > 0, 'dart has intake')
  near(s.frontSkirtDart[0], s.frontSkirtDart[1], 0.01, 'dart legs meet')
  near(s.frontSkirtJoin[0], s.frontSkirtJoin[1], 0.01, 'closed join matches bodice')
})
