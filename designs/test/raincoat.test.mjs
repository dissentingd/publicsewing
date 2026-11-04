import assert from 'node:assert/strict'
import { Raincoat } from '../raincoat/src/index.mjs'
import { testCoat, near } from './coat-checks.mjs'

const checks = (pattern) => {
  const store = pattern.setStores[0]
  const front = pattern.parts[0]['mackinaw.front']
  const p = front.points
  // The stand fits the neck, the leaf the stand
  const stand = store.get('coat.collarStand')
  near(stand.neck, stand.target, 1, 'stand vs neckline')
  const leaf = store.get('coat.collar')
  near(leaf.neck, leaf.target, 1, 'leaf vs stand')
  // Buttoned to the neck: the top button above the chest line, the last on the hips
  const ys = Object.values(front.snippets).filter((s) => s.def === 'button').map((s) => s.anchor.y)
  assert.ok(Math.min(...ys) < p.armhole.y, 'buttons to above the chest line')
  assert.ok(Math.max(...ys) < p.cfHem.y - 10, 'last button above the hem')
  // The slanted pocket's on the front, clear of the lap, the side seam and the hem
  const w = store.get('coat.welts')?.hand
  if (w) {
    assert.ok(w.x0 > store.get('coat.frontEdge').ext, `pocket clear of the lap: ${w.x0.toFixed(0)}`)
    assert.ok(w.x1 < p.hem.x, 'pocket clear of the side seam')
    assert.ok(w.y1 < p.cfHem.y, 'pocket above the hem')
  }
}

testCoat('raincoat', Raincoat, 'mackinaw.front', {
  default: {},
  plain: { handPockets: false, hemFlare: 0.02, buttons: 3, frontDrop: 0, lengthBelowWaist: 2 },
  closer: { chestEase: 0.2, hemFlare: 0.2 },
}, checks)
