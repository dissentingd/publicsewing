import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BibOverall } from '../bib-overall/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = { default: {}, plain: { bibPocket: false, hipPockets: false, seatPockets: false, bibHeight: 0.2 } }

for (const [v, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`bib-overall (${v}): ${name}`, () => {
      const pattern = new BibOverall({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      for (const k of ['back', 'front']) assert.ok(!pattern.parts[0][`trousers.${k}`].hidden, `${k} is drawn`)
      for (const k of ['waistband', 'flyShield', 'flyFacing']) assert.ok(pattern.parts[0][`bib-overall.${k}`].hidden, `no ${k}`)
      const b = store.get('trousers.back')
      const f = store.get('trousers.front')
      // Front and back legs sew together, and open the same length at the side
      near(f.outseam, b.outseam, 1, 'outseam')
      near(f.inseam, b.inseam, 3, 'inseam')
      near(f.pocket, b.pocket, 0.5, 'side opening')
      // The bib's foot and the raised back's go round the whole waist
      const bib = store.get('polygon.bib')
      const rise = store.get('polygon.backRise')
      near(bib.edges[0] + rise.edges[0], f.waist + b.waist, 0.5, 'waist')
      assert.ok(bib.edges[2] < bib.edges[0] * 2, 'bib narrows')
      // Straps reach, and the side stand and facing cover the opening
      assert.ok(store.get('trousers.strips.strap').length > bib.height, 'strap')
      assert.ok(store.get('trousers.strips.sideStand').length >= f.pocket, 'stand')
      assert.ok(store.get('trousers.strips.sideFacing').length >= f.pocket, 'facing')
    })
  }
}
