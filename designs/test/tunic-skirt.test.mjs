import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TunicSkirt } from '../tunic-skirt/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

test('tunic-skirt: Schorr 26/42 inch example', () => {
  const measurements = { ...sets.cisFemaleAdult36, waist: 26 * 25.4, seat: 42 * 25.4 }
  const pattern = new TunicSkirt({ measurements, sa: 10 }).draft()
  const store = checkClean(pattern)
  const layout = store.get('skirt.tunic')
  near(layout.radius, 13 * 25.4, 0.01, 'A–B')
  near(layout.hipRadius - layout.radius, 6 * 25.4, 1, 'B–C')
  near(layout.hipRadius * layout.angle, 21.5 * 25.4, 1, 'C–G')
  assert.ok(layout.dartAngle > 0.1, 'source example has a substantial dart')
})

for (const [variant, options] of Object.entries({ default: {}, plain: { tunicHipEase: 0 }, longer: { tunicLength: 0.6, tunicDartTip: 0.2 } })) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`tunic-skirt (${variant}): ${name}`, () => {
      const pattern = new TunicSkirt({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const { front, back, waist, hip, hem } = store.get('skirt.tunic.seams')
      near(front, back, 0.01, 'front and back seams')
      near(waist * 2, measurements.waist, 0.01, 'waist after dart')
      assert.ok(hip * 2 >= measurements.seat, 'hip fits the body')
      assert.ok(hem > hip, 'radial hem exceeds hip arc')
      if (store.get('skirt.tunic').dartAngle > 0.001) assert.ok(pattern.parts[0]['tunic-skirt.panel'].paths.dart, 'dart is marked')
      if (variant === 'default' && name === 'cisFemaleAdult36') assert.ok(store.get('skirt.tunic').dartAngle > 0.02, 'default adult keeps the central dart')
    })
  }
}
