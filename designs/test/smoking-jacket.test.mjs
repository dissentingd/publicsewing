import assert from 'node:assert/strict'
import { SmokingJacket } from '../smoking-jacket/src/index.mjs'
import { testCoat } from './coat-checks.mjs'

const extra = (pattern) => {
  const store = pattern.setStores[0]
  const parts = pattern.parts[0]
  const options = pattern.settings[0].options ?? {}
  const front = parts['mackinaw.front']
  const p = front.points
  // The fastenings stop above the hem, and the rounded corner clears the last
  const buttons = Object.values(front.snippets).filter((s) => s.def === 'button').map((s) => s.anchor.y)
  if (buttons.length) assert.ok(Math.max(...buttons) < p.cfHem.y - 10, 'fastenings above the hem')
  // The set-in pocket's mouth is on the front, clear of the edge, the side seam and the hem
  const w = store.get('coat.welts')?.hand
  if (options.handPockets !== false) {
    assert.ok(w, 'a pocket')
    assert.ok(w.len > 3 * w.welt, `pocket mouth ${w.len.toFixed(1)}`)
    assert.ok(w.x0 > store.get('coat.frontEdge').ext && w.x1 < p.hem.x, 'pocket clear of the edge and side seam')
    assert.ok(w.y1 < p.cfHem.y, 'pocket above the hem')
  }
  // Gauntlets by default, no girdle
  assert.equal(parts['smoking-jacket.gauntlet'].hidden, options.gauntletCuff === false, 'gauntlet')
  assert.equal(parts['dressinggown.girdle'].hidden, !options.girdle, 'girdle')
}

testCoat('smoking jacket', SmokingJacket, 'mackinaw.front', {
  default: {},
  tied: { girdle: true },
  plain: { handPockets: false, gauntletCuff: false, lining: false, hemCurve: 0, buttons: 2, frontDrop: 0 },
}, extra)
