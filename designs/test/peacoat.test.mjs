import assert from 'node:assert/strict'
import { Peacoat } from '../peacoat/src/index.mjs'
import { testCoat } from './coat-checks.mjs'

// The hand-warmer pocket stays on the front, clear of the side seam and the hem
const handPocket = (pattern) => {
  const store = pattern.setStores[0]
  const w = store.get('coat.welts')?.hand
  if (!w) return
  const p = pattern.parts[0]['mackinaw.front'].points
  assert.ok(w.len > 3 * w.welt, `hand pocket mouth ${w.len.toFixed(1)}`)
  assert.ok(w.x0 > store.get('coat.frontEdge').ext && w.x1 < p.hem.x, 'hand pocket clear of the edge and side seam')
  assert.ok(w.y1 < p.cfHem.y, 'hand pocket above the hem')
}

testCoat(
  'peacoat',
  Peacoat,
  'mackinaw.front',
  {
    default: {},
    military: { collarStyle: 'military', buttons: 4 },
    raglan: { sleeveStyle: 'raglan' },
    plain: { handPockets: false, lengthBelowWaist: 1.2 },
  },
  handPocket,
)
