// Grade checks: our drafts should grow with the body at about the rate a real graded garment
// does. Open+Pattern's graded DXFs (test/grade/openpattern.json, from tools/grade-reference.mjs)
// give each dimension's growth per size; dividing by the garment's girth growth per size gives a
// rate per unit of chest. Ours is the same rate across FreeSewing's adult sets. Rates must agree
// within a factor of two, unless the dimension is listed as a known difference, with the reason.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import * as models from '@freesewing/models'
import { loadDesign } from '../tools/render.mjs'
import { pieces } from '../lib/export/pieces.mjs'

const ref = JSON.parse(readFileSync(new URL('./grade/openpattern.json', import.meta.url), 'utf8'))
const sets = ['cisMaleAdult34', 'cisMaleAdult36', 'cisMaleAdult38', 'cisMaleAdult40', 'cisMaleAdult42', 'cisMaleAdult44', 'cisMaleAdult46', 'cisMaleAdult48']

// Least-squares slope of ys over xs
const slope = (xs, ys) => {
  const mx = xs.reduce((a, b) => a + b) / xs.length
  const my = ys.reduce((a, b) => a + b) / ys.length
  return xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / xs.reduce((s, x) => s + (x - mx) ** 2, 0)
}
const box = (p) => {
  const xs = p.seam.map((q) => q[0])
  const ys = p.seam.map((q) => q[1])
  // A piece cut on a vertical fold is half its width
  return { w: (Math.max(...xs) - Math.min(...xs)) * (p.onFold ? 2 : 1), h: Math.max(...ys) - Math.min(...ys) }
}

/**
 * Per design: the source, how to get the garment's girth from each side, and the dimensions to
 * compare: [label, source piece, source field, our piece, our field]
 */
const checks = {
  't-shirt': {
    source: 'standard-tshirt',
    // Front and back are whole pieces there, cut on the fold here
    girth: { src: (s) => s['Front OSPP_3'].w + s['Back OSPP_1'].w, ours: (o) => o.front.w + o.back.w },
    dims: [
      ['body length', 'Front OSPP_3', 'h', 'front', 'h'],
      ['sleeve width', 'LHS Sleeve OSPP', 'w', 'sleeve', 'w'],
      ['sleeve length', 'LHS Sleeve OSPP', 'h', 'sleeve', 'h'],
      ['neckband length', 'Collar OSPP', 'w', 'collar', 'w'],
    ],
    known: {
      // The band follows the wearer's neck, and FreeSewing's adult sets grow the neck in step
      // with the chest (340 to 480 mm over 895 to 1263 mm, 0.38 per mm); Open+Pattern's band
      // grows 1 cm a size against 6 cm of girth. Ours is about 3.5 times faster.
      'neckband length': "follows the wearer's neck, which FreeSewing's sets grow with the chest",
    },
  },
  'hooded-smock': {
    source: 'us-tactical-smock',
    girth: { src: (s) => s.Front.w + s.Back.w, ours: (o) => o.frontBody.w + o.backBody.w },
    dims: [
      ['sleeve width', 'R_Sleeve', 'w', 'sleeve', 'w'],
      ['sleeve length', 'R_Sleeve', 'h', 'sleeve', 'h'],
      ['hood height', 'R_Hoode_Side_Panel_Top', 'h', 'hood', 'h'],
      ['kangaroo pocket width', 'Pocket_Front_Bottom', 'w', 'kangaroo', 'w'],
    ],
    known: {
      // The hood is drafted from the head (lib/hood.mjs), which FreeSewing's sets grow slowly
      // (568 to 644 mm over 895 to 1263 mm of chest); Open+Pattern grades it with the body,
      // 1.6 cm a size. Ours grows at about 0.4 times that rate.
      'hood height': 'drafted from the head, which grows little with the chest',
    },
  },
}

/** Per dimension: growth per mm of girth in the source and in ours */
export async function rates(design) {
  const c = checks[design]
  const src = ref.sources[c.source]
  const bySize = src.sizes.map((_, i) => Object.fromEntries(Object.entries(src.pieces).map(([k, v]) => [k, v[i]])))
  const idx = src.sizes.map((_, i) => i)
  const srcGirth = slope(idx, bySize.map(c.girth.src))
  const Design = await loadDesign(design)
  const ours = sets.map((s) => Object.fromEntries(pieces(new Design({ measurements: models[s], sa: 10 }).draft()).map((p) => [p.name, box(p)])))
  const girths = ours.map(c.girth.ours)
  return c.dims.map(([label, sp, sf, op, of]) => ({
    label,
    source: slope(idx, bySize.map((s) => s[sp][sf])) / srcGirth,
    ours: slope(girths, ours.map((o) => o[op][of])),
    known: c.known[label],
  }))
}

for (const design of Object.keys(checks)) {
  test(`grade ${design} against ${checks[design].source}`, async () => {
    for (const r of await rates(design)) {
      const ratio = r.ours / r.source
      const ok = ratio >= 0.5 && ratio <= 2
      if (r.known) assert.ok(!ok, `${r.label} is listed as a known difference but now agrees (x${ratio.toFixed(2)}): drop it from known`)
      else assert.ok(ok, `${r.label}: ${r.ours.toFixed(3)} per mm of girth here vs ${r.source.toFixed(3)} in the source (x${ratio.toFixed(2)})`)
    }
  })
}
