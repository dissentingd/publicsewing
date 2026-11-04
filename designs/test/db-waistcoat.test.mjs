import assert from 'node:assert/strict'
import { DbWaistcoat } from '../db-waistcoat/src/index.mjs'
import { testCoat } from './coat-checks.mjs'

const checks = (pattern) => {
  const store = pattern.setStores[0]
  const parts = pattern.parts[0]
  for (const k of ['back', 'front']) assert.ok(!parts[`waistcoat.${k}`].hidden, `${k} is drawn`)
  const front = parts['waistcoat.front']
  // Two buttons at each height, a row each side of CF (a stout figure's front shifts, so not by sign)
  const marks = Object.values(front.snippets).filter((s) => s.def === 'button')
  const heights = {}
  for (const s of marks) (heights[s.anchor.y.toFixed(1)] ??= []).push(s.anchor.x)
  assert.ok(Object.keys(heights).length >= 2, 'rows of buttons')
  for (const [y, xs] of Object.entries(heights)) assert.equal(xs.length, 2, `two buttons at ${y}`)
  // Each is on the front at its own height, and the top ones below the neck
  for (const s of marks) {
    const xs = front.paths.seam.intersectsY(s.anchor.y).map((h) => h.x)
    assert.ok(s.anchor.x > Math.min(...xs) + 8 && s.anchor.x < Math.max(...xs) - 8, `button at ${s.anchor.x.toFixed(0)} clear of the edge`)
  }
  assert.ok(Math.min(...marks.map((s) => s.anchor.y)) > front.points.cfNeck.y, 'buttons below the neck')
  assert.ok(store.get('coat.frontEdge').drop > 0, 'pointed fronts')
}

testCoat('double-breasted waistcoat', DbWaistcoat, 'waistcoat.front', {
  default: {},
  plain: { breastPocket: false, lowerPockets: false, backDart: 0, frontDart: 0, liningBack: false, cutaway: 0, buttons: 2 },
  narrow: { buttonExtension: 0.05, buttonRow: 0.6, buttons: 3 },
}, checks)
