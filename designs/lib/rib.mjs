// Rib bands and cuffs (BUILD_QUEUE B3, 2026-11-10): a knit strip that finishes an edge (a hem, a
// cuff, a neck, a jacket's waistband), cut shorter than the edge so it pulls in when sewn on
// stretched. Sized from the edge it finishes: length = edge × (1 − stretch). Cut double height and
// folded lengthwise; a `round` band (a cuff, a waistband all round) is joined into a ring, so its
// ends take seam allowance. Drawn by the polygon piece type (lib/flat.mjs).
import { polygonPart } from './flat.mjs'

/** A rib band's size: `edge` (mm, the edge it finishes), `stretch` (the fraction it's shortened by), `height` (finished) */
export function ribSize({ edge, stretch = 0.15, height }) {
  if (!(edge > 0) || !(height > 0)) throw new Error(`rib: edge ${edge} and height ${height} must be positive`)
  if (!(stretch >= 0 && stretch < 0.5)) throw new Error(`rib: stretch ${stretch} should be from 0 to 0.5`)
  return { edge, stretch, height, length: edge * (1 - stretch) }
}

/** The rib piece type: `shape(sh)` returns { edge, stretch, height, round } */
export const ribPart = ({ name, after, nr, label, cut = 1, material = 'ribbing', enabled, shape }) => {
  const key = name.split('.').pop()
  return polygonPart({
    name,
    after,
    nr,
    label,
    cut,
    material,
    enabled,
    shape: (sh) => {
      const { round = false, ...size } = shape(sh)
      const r = ribSize(size)
      sh.store.set(`rib.${key}`, r)
      const [L, H] = [r.length, 2 * r.height]
      return {
        points: [[0, 0], [L, 0], [L, H], [0, H]],
        // Allowance on the long edges (sewn to the garment, both layers together); on the short
        // ends only where they're joined into a ring
        allowance: [1, round ? 1 : 0, 1, round ? 1 : 0],
        // Quarter notches, to spread the stretch evenly; the fold line along the middle
        notches: [1, 2, 3].map((q) => [(q * L) / 4, 0]),
        lines: [[[0, H / 2], [L, H / 2]]],
      }
    },
  })
}
