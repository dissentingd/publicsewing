import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ShellTop } from '../shell-top/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'
import { along, onSeam } from './bodice-checks.mjs'

const variants = {
  default: {},
  square: { neckShape: 'square', neckWiden: 0.1, neckDepth: 0.32 },
  apart: { neckShape: 'v', neckWiden: 0.15, neckDepth: 0.6, backNeckDepth: 0.3, hipLength: 1.2, hipFlare: 0.15 },
}

for (const [variant, options] of Object.entries(variants)) for (const [set, measurements] of Object.entries(sets)) {
  test(`shell top ${variant}: ${set}`, () => {
    const pattern = new ShellTop({ measurements, options, sa: 10 }).draft()
    const store = checkClean(pattern)
    const b = pattern.parts[0]['shell-top.back']
    const f = pattern.parts[0]['shell-top.front']
    near(store.get('bodice.hip.front').side, store.get('bodice.hip.back').side, 0.5, 'hip side seams')
    near(along(b, 'waistSide', 'armhole'), along(f, 'sideHem', 'bustDartBottom') + along(f, 'bustSide', 'armhole'), 0.5, 'upper side seams')
    near(along(f, 'bustDartBottom', 'bustDartTip'), along(f, 'bustDartTip', 'bustSide'), 0.5, 'bust dart legs')
    for (const part of [b, f]) {
      assert.ok(onSeam(part, 'hipCenter') && onSeam(part, 'hipSide'), 'continuous outline reaches the hip')
      if (part.points.hipDartTip) assert.ok(part.paths.waistDart?.length() > 0, 'waist dart is inside the piece')
    }
  })
}
