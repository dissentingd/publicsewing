// Trousers on FreeSewing's Titan block: full legs gathered into bands below the knee, with an
// elastic waist (Walker 1909, knickerbockers and drawers). Store: `knickers.back`,
// `knickers.front`, `knickers.band`.
import { cleanup, title } from './coat.mjs'

/**
 * One leg piece on Titan's back or front ('back' | 'front'): full, with the waist edge wide
 * enough to pull on over the seat and a `casing` for elastic; the leg falls straight (plus
 * `flare` at the outseam) to `hemY`, where it gathers into a band at `bandY`.
 */
export function draftGatheredLeg(sh, { which, bandY, hemY, flare, casing }) {
  const { points, paths, Path, Point, measurements, store, sa, macro, part } = sh
  cleanup(sh)
  macro('rmscalebox')
  for (const p in paths) delete paths[p]
  const back = which === 'back'
  const out = back ? 1 : -1 // the outseam's side (+x on the back, -x on the front)

  const crotch = back
    ? new Path().move(points.styleWaistIn).line(points.crossSeamCurveStart).curve(points.crossSeamCurveCp1, points.crossSeamCurveCp2, points.fork)
    : new Path().move(points.fork).curve(points.crotchSeamCurveCp1, points.crotchSeamCurveCp2, points.crotchSeamCurveStart).line(points.styleWaistIn)
  // Pull-on: the waist edge at least as wide as the piece across the seat (plus 4%), so it
  // passes over the hips; the elastic gathers it in
  const wIn = points.styleWaistIn
  const seatIn = crotch.intersectsY(points.seatOut.y)[0] || wIn
  const need = Math.abs(points.seatOut.x - seatIn.x) * 1.04
  const outX = wIn.x + out * Math.max(Math.abs(points.styleWaistOut.x - wIn.x), Math.abs(points.seatOut.x - wIn.x), need)
  points.wOut = new Point(outX, points.styleWaistOut.y)
  points.cIn = wIn.shift(90, casing)
  points.cOut = points.wOut.shift(90, casing)
  points.hemOut = new Point(outX + out * flare, hemY)
  // Titan's back and front forks sit at slightly different heights; give both inseams the
  // same length (from the upper-leg line), so the hem slants a few mm into the band
  points.hemIn = new Point(points.fork.x, points.fork.y + hemY - measurements.waistToUpperLeg)

  // Counter-clockwise on the page
  paths.seam = back
    ? new Path().move(points.cOut).line(points.cIn).line(wIn).join(crotch).line(points.hemIn).line(points.hemOut).line(points.wOut).close()
    : new Path().move(points.cIn).line(points.cOut).line(points.wOut).line(points.hemOut).line(points.hemIn).join(crotch).line(points.cIn).close()
  paths.seam.addClass('fabric')
  if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
  paths.casingFold = new Path().move(wIn.shift(90, casing / 2)).line(points.wOut.shift(90, casing / 2)).addClass('help dashed')
  paths.gathers = new Path().move(points.hemIn.shift(90, 8)).line(points.hemOut.shift(90, 8)).addClass('mark dotted')
  points.vent = points.hemOut.shiftTowards(points.wOut, measurements.waistToKnee * 0.12)
  sh.snippets.vent = new sh.Snippet('notch', points.vent)

  store.set(`knickers.${which}`, {
    outseam: points.wOut.dist(points.hemOut) + casing,
    inseam: points.fork.dist(points.hemIn),
    crotch: crotch.length() + casing,
    hem: Math.abs(points.hemOut.x - points.hemIn.x),
    waist: Math.abs(points.wOut.x - wIn.x),
    seat: Math.abs(points.seatOut.x - seatIn.x),
  })
  macro('grainline', { from: new Point((outX + points.fork.x) / 2, hemY - 30), to: new Point((outX + points.fork.x) / 2, 40) })
  store.cutlist.setCut({ cut: 2, from: 'fabric' })
  title(macro, { at: new Point((outX + points.fork.x) / 2, measurements.waistToKnee * 0.4), nr: back ? 2 : 1, title: back ? 'back' : 'front' })
  return part
}

/**
 * Leg band: `length` round the leg (plus a 30 mm overlap to button), cut `width` wide and
 * folded in half. `size(sh)` gives { length, width }.
 */
export const legBandPart = ({ name, after, nr = 3, size }) => ({
  name,
  after,
  draft: (sh) => {
    const { paths, Path, Point, store, sa, macro, part } = sh
    const { length, width } = size(sh)
    const L = length + 30
    const W = width
    paths.seam = new Path().move(new Point(L, 0)).line(new Point(0, 0)).line(new Point(0, W)).line(new Point(L, W)).close().addClass('fabric')
    paths.fold = new Path().move(new Point(0, W / 2)).line(new Point(L, W / 2)).addClass('help dashed')
    if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
    store.set('knickers.band', { length: L - 30 })
    store.cutlist.setCut({ cut: 2, from: 'fabric' })
    title(macro, { at: new Point(L * 0.3, W * 0.25), nr, title: 'legBand', scale: 0.3 })
    return part
  },
})
