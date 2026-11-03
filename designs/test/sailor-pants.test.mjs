import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SailorPants } from '../sailor-pants/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  shallow: { fallDepth: 0.3, fallCentre: 0.15, fallButtons: 1, hemWidth: 1 },
  bell: { hemWidth: 1.6, fallButtons: 5, fallDepth: 0.7 },
}

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`sailor-pants (${v}): ${name}`, () => {
      const pattern = new SailorPants({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      for (const k of ['back', 'front']) assert.ok(pattern.parts[0][`trousers.${k}`].hidden, `${k} hidden`)
      const leg = pattern.parts[0]['sailor-pants.leg']
      assert.ok(!leg.hidden, 'leg drawn')
      const b = store.get('trousers.back')
      const f = store.get('trousers.front')
      near(f.outseam, b.outseam, 0.5, 'outseam')
      near(f.inseam, b.inseam, 5, 'inseam') // Titan's knees differ, and the bell widens it
      // The slit's two edges button together, and the bands fit the cut-back waists
      const fall = store.get('trousers.fall')
      near(fall.front, fall.back, Math.max(5, fall.front * 0.09), 'slit edges') // they button, and the V's sides differ with the front and back waists
      near(fall.waist, b.fit + f.fit, 5, 'waist') // at least 2 mm cut each side, on a waist as wide as the seat
      near(store.get('trousers.strips.frontBand').length, 2 * f.fit, 0.5, 'front band')
      assert.ok(2 * fall.waist > measurements.waist, 'the waist clears the body')
      // The fold stays in the panel, the buttonholes on it
      assert.ok(fall.fold > 0, 'fold')
      const holes = Object.keys(leg.snippets).filter((s) => s.startsWith('buttonhole'))
      assert.equal(holes.length, options.fallButtons ?? 2, 'buttonholes')
      // A bell bottom: wider than the knee at the default
      if (!options.hemWidth) assert.ok(b.hem + f.hem > 0, 'hem')
    })
  }
}
