import assert from 'node:assert/strict'
import { ChildsDress } from '../childs-dress/src/index.mjs'
import { testYoke } from './yoke-checks.mjs'

testYoke(
  'childs-dress',
  ChildsDress,
  {
    default: {},
    yoked: { frontYoke: true, backYoke: true, opening: 'front' },
    plain: { frontPleats: 0, openFull: false, buttons: 3, sleevePuff: 0, sash: false, neckFinish: 'binding' },
    extremes: { frontPleats: 5, pleatDepth: 0.03, pleatSpacing: 0.04, sleevePuff: 0.8, buttons: 14, sleeves: 'long' },
  },
  (pattern) => {
    const store = pattern.setStores[0]
    const o = pattern.settings[0].options
    const f = store.get('yoke.front')
    const side = store.get(`yoke.${o.opening}`)
    // Pleats only on a front in one piece; their take-up added at the fold
    if (f.whole && o.frontPleats > 0) assert.ok(f.pleats && f.pleats.lines.length === o.frontPleats, 'pleats marked')
    else assert.equal(f.pleats, undefined, 'no pleats under a yoke')
    // The full opening: neck to hem, not on the fold, with its facing
    if (o.openFull) {
      assert.ok(side.openFull && !side.slit, 'opening runs to the hem, no placket slit')
      const fc = store.get('trousers.strips.openingFacing')
      assert.ok(Math.abs(fc.length - store.get('yoke.openFull').length) < 0.5, 'facing as long as the opening')
    }
    const sl = store.get('yoke.sleeve', null)
    if (sl && o.sleevePuff > 0) assert.ok(sl.puff > 0, 'puffed sleeve')
  },
)
