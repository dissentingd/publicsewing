// Trousers on FreeSewing's Titan block. Full legs gathered into bands below the knee, with an
// elastic waist (Walker 1909, knickerbockers and drawers; store `knickers.*`), and tailored
// legs with a waist dart, a tapered hem, a fly and pockets (ЕМКО trousers; store `trousers.*`).
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

/**
 * A tailored leg on Titan's back or front ('back' | 'front'), fitted at the knee (`fitKnee`).
 * - `dart`: a waist dart this wide at `dartAt` (a fraction of the waist from CB/CF), `dartLength`
 *   long, square to the waist. The sewn waist stays Titan's: the dart opens the waist at CB/CF
 *   (`dartFrom: 'centre'`, up to Titan's own shaping there, straightening the crotch seam) and
 *   the rest at the outseam, which then curves out from the seat line to meet it.
 * - `matchOutseam`: the other piece's outseam length; the waist corner moves up or down to match.
 * - `hemWidth`: the hem's width as a fraction of the knee's; `hemSag`: the hem curves this far
 *   down (back) or up (front) at the crease; `hemSa`: the hem allowance, in seam allowances.
 * - `fly`, `flyLength` (front): the fly's stitching line, `fly` in from CF, `flyLength` down.
 * - `pocketTop`, `pocketLength`, `pocketWidth`, `pocketDepth`: an on-seam side pocket in the
 *   outseam (`trousers.pockets.side`, for a `weltBag` part).
 * - `backPocket`, `backPocketBelow`, `backPocketWelt` (back): a jetted pocket this long, its
 *   mouth this far below the waist, centred on the dart (`trousers.pockets.back`).
 */
export function draftTrouserLeg(sh, args) {
  const { which, dart = 0, dartAt = 0.4, dartLength = 0, dartFrom = 'side', hemWidth = 1, hemSag = 0, hemSa = 4 } = args
  const { points, paths, Path, Point, store, sa, macro, part, snippets, Snippet } = sh
  cleanup(sh)
  macro('rmscalebox')
  const back = which === 'back'
  const out = back ? 1 : -1 // the outseam's side

  // Waist and dart
  const wIn0 = points.styleWaistIn
  const wOut0 = points.styleWaistOut
  const W = wIn0.dist(wOut0)
  const d = Math.max(0, dart)
  const a = wIn0.angle(wOut0)
  const down = a + (Math.cos((a * Math.PI) / 180) > 0 ? -90 : 90)
  const cs = back ? points.crossSeamCurveStart : points.crotchSeamCurveStart
  const atSeat = new Path().move(wIn0).line(cs).curve(...(back ? [points.crossSeamCurveCp1, points.crossSeamCurveCp2] : [points.crotchSeamCurveCp2, points.crotchSeamCurveCp1]), points.fork).intersectsY(points.seatOut.y)[0]
  const room = atSeat ? Math.max(0, out * (wIn0.x - atSeat.x)) : 0
  const dCentre = dartFrom === 'centre' ? Math.min(d, room) : 0
  points.wIn = wIn0.shift(a + 180, dCentre)
  points.wOut = wOut0.shift(a, d - dCentre)
  const wIn = points.wIn
  points.dartIn = wIn.shift(a, (W + d) * dartAt - d / 2)
  points.dartOut = points.dartIn.shift(a, d)
  points.dartTip = wIn.shift(a, (W + d) * dartAt).shift(down, d > 0 ? dartLength : 0)

  // Hem: narrowed from the knee, curved at the crease
  const halfKnee = Math.abs(points.kneeOut.x - points.knee.x)
  points.hemOut = points.floor.shift(back ? 0 : 180, halfKnee * hemWidth)
  points.hemIn = points.floor.shift(back ? 180 : 0, halfKnee * hemWidth)
  const sag = (back ? 1 : -1) * hemSag * (4 / 3)
  points.hemCp1 = points.hemIn.shiftFractionTowards(points.hemOut, 1 / 3).shift(-90, sag)
  points.hemCp2 = points.hemIn.shiftFractionTowards(points.hemOut, 2 / 3).shift(-90, sag)
  const hem = new Path().move(points.hemIn).curve(points.hemCp1, points.hemCp2, points.hemOut)

  // Seams: outseam from the waist down (always through the seat line), inseam from the fork
  // down, crotch from the waist
  const drawOutseam = () =>
    back
      ? new Path().move(points.hemOut).line(points.kneeOut).curve(points.kneeOutCp2, points.seatOutCp1, points.seatOut).curve_(points.seatOutCp2, points.wOut).reverse()
      : new Path().move(points.wOut)._curve(points.seatOutCp1, points.seatOut).curve(points.seatOutCp2, points.kneeOutCp1, points.kneeOut).line(points.hemOut)
  let outseam = drawOutseam()
  // True this outseam to the other piece's at the waist corner (`matchOutseam`)
  for (let i = 0; args.matchOutseam && i < 3; i++) {
    points.wOut = points.wOut.shift(-90, outseam.length() - args.matchOutseam)
    outseam = drawOutseam()
  }
  let inseam, crotch
  if (back) {
    inseam = new Path().move(points.fork).curve(points.forkCp2, points.kneeInCp1, points.kneeIn).line(points.hemIn)
    crotch = new Path().move(wIn).line(points.crossSeamCurveStart).curve(points.crossSeamCurveCp1, points.crossSeamCurveCp2, points.fork)
  } else {
    inseam = new Path().move(points.fork).curve(points.forkCp1, points.kneeInCp2, points.kneeIn).line(points.hemIn)
    crotch = new Path().move(wIn).line(points.crotchSeamCurveStart).curve(points.crotchSeamCurveCp2, points.crotchSeamCurveCp1, points.fork)
  }
  const waist = new Path().move(points.wOut).line(points.dartOut).line(points.dartTip).line(points.dartIn).line(wIn)

  // Back: waist > crotch > inseam > hem > outseam; front the other way round
  paths.seam = (back
    ? waist.clone().join(crotch).join(inseam).join(hem).join(outseam.reverse())
    : outseam.clone().join(hem.reverse()).join(inseam.reverse()).join(crotch.reverse()).join(waist.reverse())
  ).close().addClass('fabric')
  if (sa) {
    const straightWaist = new Path().move(points.wOut).line(wIn)
    const segs = back
      ? [[straightWaist, 1], [crotch, 1], [inseam, 1], [hem, hemSa], [outseam.reverse(), 1]]
      : [[outseam, 1], [hem.reverse(), hemSa], [inseam.reverse(), 1], [crotch.reverse(), 1], [straightWaist.reverse(), 1]]
    let o
    for (const [p, k] of segs) {
      const off = p.offset(sa * k)
      o = o ? o.line(off.start()).join(off) : off
    }
    paths.sa = o.close().addClass('fabric sa')
  }
  paths.crease = new Path().move(points.floor).line(new Point(points.floor.x, points.fork.y)).addClass('help dashed')
  snippets.knee = new Snippet('notch', points.kneeOut)
  snippets.kneeIn = new Snippet('notch', points.kneeIn)

  const info = {
    outseam: outseam.length(),
    inseam: inseam.length(),
    crotch: crotch.length(),
    waist: W,
    dart: d,
    dartAtSide: d - dCentre,
    hem: points.hemIn.dist(points.hemOut),
  }

  // Side pocket in the outseam: notches at the mouth's ends
  const { pocketTop = 0, pocketLength = 0, pocketWidth = 0, pocketDepth = 0 } = args
  if (pocketLength > 0) {
    points.pocketTop = outseam.shiftAlong(pocketTop)
    points.pocketBottom = outseam.shiftAlong(pocketTop + pocketLength)
    snippets.pocketTop = new Snippet('notch', points.pocketTop)
    snippets.pocketBottom = new Snippet('notch', points.pocketBottom)
    info.pocket = pocketTop + pocketLength
    if (!back) {
      const pockets = store.get('trousers.pockets', null) ?? {}
      store.set('trousers.pockets', { ...pockets, side: { len: pocketWidth, bag: pocketTop + pocketLength + pocketDepth } })
    }
  }

  // Fly: the stitching line, `fly` in from CF, curving into the crotch seam at `flyLength`
  const { fly = 0, flyLength = 0 } = args
  if (!back && fly > 0 && flyLength > 0) {
    const L = Math.min(flyLength, crotch.length() * 0.9)
    const inward = wIn.angle(points.wOut)
    points.flyBottom = crotch.shiftAlong(L)
    points.flyTop = wIn.shift(inward, fly)
    points.flyTurn = crotch.shiftAlong(Math.max(L - fly, 0)).shift(inward, fly)
    paths.fly = new Path().move(points.flyTop).line(points.flyTurn).curve_(points.flyTurn.shift(-90, fly * 0.6), points.flyBottom).addClass('mark dashed')
    snippets.flyBottom = new Snippet('notch', points.flyBottom)
    info.fly = L
    info.flyWidth = fly
  }

  // Jetted back pocket, centred on the dart
  const { backPocket = 0, backPocketBelow = 0, backPocketWelt = 0 } = args
  if (back && backPocket > 0) {
    const c = wIn.shift(a, (W + d) * dartAt).shift(down, backPocketBelow)
    const len = Math.min(backPocket, W * 0.8)
    points.backPocketIn = c.shift(a + 180, len / 2)
    points.backPocketOut = c.shift(a, len / 2)
    paths.backPocket = new Path().move(points.backPocketIn).line(points.backPocketOut).addClass('mark')
    const pockets = store.get('trousers.pockets', null) ?? {}
    store.set('trousers.pockets', { ...pockets, back: { len, welt: backPocketWelt, bag: len * 1.3 } })
  }

  store.set(`trousers.${which}`, info)
  macro('grainline', { from: points.floor.shift(90, 30), to: new Point(points.floor.x, points.fork.y) })
  store.cutlist.setCut({ cut: 2, from: 'fabric' })
  title(macro, { at: new Point(points.knee.x, (points.fork.y + points.knee.y) / 2), nr: back ? 2 : 1, title: which })
  return part
}

/** A rectangle `length` by `width` (`fold`: cut twice as wide, folded lengthwise). */
export const stripPart = ({ name, after, nr, label, cut = 1, fold = false, material = 'fabric', enabled = () => true, size }) => ({
  name,
  after,
  draft: (sh) => {
    const { paths, Path, Point, store, sa, macro, options, part } = sh
    if (!enabled(options)) return part.hide()
    const { length: L, width } = size(sh)
    const W = fold ? width * 2 : width
    paths.seam = new Path().move(new Point(L, 0)).line(new Point(0, 0)).line(new Point(0, W)).line(new Point(L, W)).close().addClass('fabric')
    if (fold) paths.fold = new Path().move(new Point(0, width)).line(new Point(L, width)).addClass('help dashed')
    if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
    store.set(`trousers.strips.${name.split(".").pop()}`, { length: L, width })
    store.cutlist.setCut({ cut, from: material })
    title(macro, { at: new Point(L * 0.3, W * 0.25), nr, title: label, scale: Math.min(0.4, W / 200) })
    return part
  },
})
