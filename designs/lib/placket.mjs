// A knit top's box placket strips (lib/knit.mjs `placketBox` marks the box on the front): two
// strips, each folded lengthwise to the box's width, the length of the box. Buttonholes on the
// strip that laps over (right over left for women's, left over right for men's: sew it to the
// side the wearer prefers), spaced evenly from a box-width below the neck to a box-width above the
// foot, as many as fit half a box-width apart. Drawn by the polygon piece type (lib/flat.mjs).
import { polygonPart } from './flat.mjs'

export const knitPlacketPart = ({ name, after, nr, label, cut = 2, material = 'fabric', enabled, shape }) =>
  polygonPart({
    name,
    after,
    nr,
    label,
    cut,
    material,
    enabled,
    shape: (sh) => {
      const { buttons = 3 } = shape(sh)
      const { length: L, width: w } = sh.store.get('knit.placket')
      // As many of the buttons asked for as fit at least half the placket's width apart (a short
      // placket on a child's size takes fewer)
      const fit = Math.floor((L - 2 * w) / (w / 2)) + 1
      const n = Math.max(1, Math.min(Math.round(buttons), fit))
      const first = w
      const last = L - w
      const ys = n === 1 ? [first] : Array.from({ length: n }, (_, i) => first + ((last - first) * i) / (n - 1))
      sh.store.set(`knit.placketButtons`, ys)
      return {
        // Width 2w, folded along the middle; length L. Allowance all round: the foot is sewn across
        points: [[0, 0], [2 * w, 0], [2 * w, L], [0, L]],
        lines: [[[w, 0], [w, L]]],
        buttonholes: ys.map((y) => [w / 2, y]),
      }
    },
  })

/**
 * A cardigan's front band (after a front with `openFront`, and Bibi's back): one strip up the right
 * front, round the neck and down the left front, folded lengthwise to `height`. It lies flat along
 * the fronts (from the foot of the hem band, if there is one) and is shortened by `stretch` round
 * the neck, so it hugs it. Buttonholes on the first front's stretch, buttons on the other's, from
 * two band-widths above the hem to half a band-width below the V, as many as fit a band-width apart; notches at the V points, the
 * shoulders and centre back. Stores `knit.frontBand` { front, neck, length }
 */
export const frontBandPart = ({ name, after, nr, label, cut = 1, material = 'fabric', enabled, shape }) =>
  polygonPart({
    name,
    after,
    nr,
    label,
    cut,
    material,
    enabled,
    shape: (sh) => {
      const { buttons = 5, height, stretch = 0.1, below = 0 } = shape(sh)
      const { store } = sh
      const f = store.get('knit.front')
      const F = f.edge + below
      const half = (f.neck + store.get('neckSizeBack')) * (1 - stretch)
      const V = f.neck * (1 - stretch)
      const L = 2 * (F + half)
      const H = 2 * height
      const lo = 2 * height
      const hi = F - height / 2
      // As many of the buttons asked for as fit a band-width apart (a short front takes fewer)
      const n = Math.max(1, Math.min(Math.round(buttons), Math.floor((hi - lo) / height) + 1))
      const xs = n === 1 ? [hi] : Array.from({ length: n }, (_, i) => lo + ((hi - lo) * i) / (n - 1))
      store.set('knit.frontBand', { front: F, neck: half, length: L, buttons: xs })
      return {
        points: [[0, 0], [L, 0], [L, H], [0, H]],
        lines: [[[0, H / 2], [L, H / 2]]],
        notches: [F, F + V, L / 2, L - F - V, L - F].map((x) => [x, 0]),
        buttonholes: xs.map((x) => [x, height / 2]),
        buttons: xs.map((x) => [L - x, height / 2]),
      }
    },
  })
