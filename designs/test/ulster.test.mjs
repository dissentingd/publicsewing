import assert from 'node:assert/strict'
import { Ulster } from '../ulster/src/index.mjs'
import { testCoat, near } from './coat-checks.mjs'

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

// The lining's front and back meet on the shoulder, below facings of the same width; the vent
// stays below the waist; the lapel breaks below the neck
const liningVentLapel = (pattern) => {
  const store = pattern.setStores[0]
  const fl = store.get('coat.frontLining', null)
  const bl = store.get('coat.backLining', null)
  if (fl && bl) near(fl.shoulder, bl.shoulder, 0.5, 'lining shoulders')
  const vent = store.get('coat.vent', null)
  const back = pattern.parts[0]['mackinaw.back'].points
  if (vent) assert.ok(vent.top > back.cbWaist.y && vent.length > 2 * vent.width, 'vent below the waist')
  const lapel = store.get('coat.lapel', null)
  if (lapel) assert.ok(lapel.breakY > pattern.parts[0]['mackinaw.front'].points.cfNeck.y, 'lapel breaks below the neck')
}

testCoat(
  'ulster',
  Ulster,
  'mackinaw.front',
  {
    default: {},
    military: { collarStyle: 'military', buttons: 4 },
    raglan: { sleeveStyle: 'raglan', collarStyle: 'convertible' },
    plain: { handPockets: false, lengthBelowWaist: 2.4, vent: false, lining: false },
    shawl: { collarStyle: 'shawl', vent: false },
  },
  (pattern) => {
    handPocket(pattern)
    liningVentLapel(pattern)
  },
)
