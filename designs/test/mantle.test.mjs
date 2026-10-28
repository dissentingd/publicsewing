import assert from 'node:assert/strict'
import { Mantle } from '../mantle/src/index.mjs'
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

// The top button stays below the neck, at every size
const topButton = (pattern) => {
  const f = pattern.parts[0]['mackinaw.front']
  const top = Math.min(...Object.entries(f.snippets).filter(([k]) => k.startsWith('button')).map(([, s]) => s.anchor.y))
  assert.ok(top > f.points.cfNeck.y, `top button ${top.toFixed(1)} below the neck ${f.points.cfNeck.y.toFixed(1)}`)
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
  'mantle',
  Mantle,
  'mackinaw.front',
  {
    default: {},
    setIn: { sleeveStyle: 'setIn', buttons: 5, armholeDepth: 0.1 },
    ulster: { collarStyle: 'ulster', buttonTop: 1.6, lining: true, hemFlare: 0 },
    plain: { lowerPockets: false, lengthBelowWaist: 1.8, collarStyle: 'military' },
  },
  (pattern) => {
    handPocket(pattern)
    topButton(pattern)
    liningVentLapel(pattern)
  },
)
