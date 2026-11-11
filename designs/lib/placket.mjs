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
