// Trousers on FreeSewing's Titan block. Full legs gathered into bands below the knee, with an
// elastic waist (Walker 1909, knickerbockers and drawers; store `knickers.*`), and tailored
// legs with a waist dart, a tapered hem, a fly and pockets (ЕМКО trousers; store `trousers.*`).
import { cleanup, title } from './coat.mjs'

/**
 * One leg piece on Titan's back or front ('back' | 'front'): full, with the waist edge wide
 * enough to pull on over the seat and a `casing` for elastic; the leg falls straight (plus
 * `flare` at the outseam) to `hemY`, where it gathers into a band at `bandY`. With `hem` (a
 * depth) the leg has no band: it ends in a plain hem turned up at `hemY - hem`.
 */
export function draftGatheredLeg(sh, { which, bandY, hemY, flare, casing, hem }) {
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
  if (hem) {
    paths.hemFold = new Path().move(points.hemIn.shift(90, hem)).line(points.hemOut.shift(90, hem)).addClass('help dashed')
  } else {
    paths.gathers = new Path().move(points.hemIn.shift(90, 8)).line(points.hemOut.shift(90, 8)).addClass('mark dotted')
    points.vent = points.hemOut.shiftTowards(points.wOut, measurements.waistToKnee * 0.12)
    sh.snippets.vent = new sh.Snippet('notch', points.vent)
  }

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
 * folded in half. `size(sh)` gives { length, width }; `enabled(options)` whether it's cut.
 */
export const legBandPart = ({ name, after, nr = 3, size, enabled = () => true }) => ({
  name,
  after,
  draft: (sh) => {
    const { paths, Path, Point, store, sa, macro, part, options } = sh
    if (!enabled(options)) return part.hide()
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
 * - Breeches (with `cuffBelow`): the leg flares out at the outseam by `thighFlare` at `thighAt`
 *   (a fraction of the way from the fork to the knee), fits Titan's knee, narrows to `calfW` round
 *   `calfBelow` under the knee and `cuffW` round at the hem, `cuffBelow` under it (each width
 *   split back/front by `share`, this piece's part). The outseam opens from the hem up to
 *   `openingBelow` under the knee, with `buttons` buttonholes `buttonInset` in on the front.
 * - `straightOutseam`: the outseam a straight line from the hem corner out past the seat to the
 *   waist (Simons' one-piece overall), so back and front can be cut in one (`legInOnePart`); the
 *   pieces' paths go to `trousers.paths.<which>`.
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
  // Breeches: fitted below the knee to a cuff, flared at the thigh
  const br = args.cuffBelow > 0
  if (br) {
    const { calfBelow, calfW, cuffBelow, cuffW, share = 0.5, thighFlare = 0, thighAt = 0.4 } = args
    const cx = points.knee.x
    const calfY = points.knee.y + calfBelow
    const cuffY = points.knee.y + cuffBelow
    points.calfOut = new Point(cx + (out * calfW * share) / 2, calfY)
    points.calfIn = new Point(cx - (out * calfW * share) / 2, calfY)
    points.hemOut = new Point(cx + (out * cuffW * share) / 2, cuffY)
    points.hemIn = new Point(cx - (out * cuffW * share) / 2, cuffY)
    points.hemCp1 = points.hemIn.shiftFractionTowards(points.hemOut, 1 / 3)
    points.hemCp2 = points.hemIn.shiftFractionTowards(points.hemOut, 2 / 3)
    const ty = points.fork.y + (points.knee.y - points.fork.y) * thighAt
    const onLeg = new Path().move(points.seatOut).curve(back ? points.seatOutCp1 : points.seatOutCp2, back ? points.kneeOutCp2 : points.kneeOutCp1, points.kneeOut).intersectsY(ty)[0] ?? points.kneeOut
    points.thighOut = new Point(onLeg.x + out * thighFlare, ty)
    points.thighOutCp1 = points.thighOut.shift(90, (ty - points.seatOut.y) / 2)
    points.thighOutCp2 = points.thighOut.shift(-90, (points.knee.y - ty) / 2)
    points.seatOutCpD = points.seatOut.shift(-90, (ty - points.seatOut.y) / 3)
    points.kneeOutCpU = points.kneeOut.shift(90, (points.knee.y - ty) / 3)
  }
  const hem = new Path().move(points.hemIn).curve(points.hemCp1, points.hemCp2, points.hemOut)

  // Seams: outseam from the waist down (always through the seat line), inseam from the fork
  // down, crotch from the waist
  const straight = Boolean(args.straightOutseam) && !br
  let su
  if (straight) {
    // Lean the line out enough to clear both the seat and the waist corner
    const lean = (q) => (out * (q.x - points.hemOut.x)) / (points.hemOut.y - q.y)
    const k = Math.max(lean(points.seatOut), lean(points.wOut))
    const dy = points.hemOut.y - points.wOut.y
    points.wOut = new Point(points.hemOut.x + out * k * dy, points.wOut.y)
    su = points.hemOut.angle(points.wOut)
  }
  const drawOutseam = () =>
    straight
      ? new Path().move(points.wOut).line(points.hemOut)
      : br
      ? new Path()
          .move(points.wOut)
          ._curve(back ? points.seatOutCp2 : points.seatOutCp1, points.seatOut)
          .curve(points.seatOutCpD, points.thighOutCp1, points.thighOut)
          .curve(points.thighOutCp2, points.kneeOutCpU, points.kneeOut)
          .line(points.calfOut)
          .line(points.hemOut)
      : back
      ? new Path().move(points.hemOut).line(points.kneeOut).curve(points.kneeOutCp2, points.seatOutCp1, points.seatOut).curve_(points.seatOutCp2, points.wOut).reverse()
      : new Path().move(points.wOut)._curve(points.seatOutCp1, points.seatOut).curve(points.seatOutCp2, points.kneeOutCp1, points.kneeOut).line(points.hemOut)
  let outseam = drawOutseam()
  // True this outseam to the other piece's at the waist corner (`matchOutseam`)
  for (let i = 0; args.matchOutseam && i < 3; i++) {
    points.wOut = straight ? points.hemOut.shift(su, args.matchOutseam) : points.wOut.shift(-90, outseam.length() - args.matchOutseam)
    outseam = drawOutseam()
  }
  let inseam, crotch
  if (back) {
    inseam = new Path().move(points.fork).curve(points.forkCp2, points.kneeInCp1, points.kneeIn)
    crotch = new Path().move(wIn).line(points.crossSeamCurveStart).curve(points.crossSeamCurveCp1, points.crossSeamCurveCp2, points.fork)
  } else {
    inseam = new Path().move(points.fork).curve(points.forkCp1, points.kneeInCp2, points.kneeIn)
    crotch = new Path().move(wIn).line(points.crotchSeamCurveStart).curve(points.crotchSeamCurveCp2, points.crotchSeamCurveCp1, points.fork)
  }
  if (br) inseam = inseam.line(points.calfIn)
  inseam = inseam.line(points.hemIn)
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
  if (!straight) snippets.knee = new Snippet('notch', points.kneeOut)
  snippets.kneeIn = new Snippet('notch', points.kneeIn)

  const info = {
    outseam: outseam.length(),
    inseam: inseam.length(),
    crotch: crotch.length(),
    waist: straight ? wIn.dist(points.wOut) - d : W,
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

  // Breeches opening: the outseam left open from the hem up to `openingBelow` under the knee;
  // buttonholes along the front's edge (the back's edge takes a button stand)
  const { openingBelow = 0, buttons = 0, buttonInset = 0 } = args
  if (br) {
    const top = outseam.intersectsY(points.knee.y + openingBelow)[0]
    if (top) {
      points.openingTop = top
      snippets.openingTop = new Snippet('notch', top)
      info.opening = outseam.length() - outseam.split(top)[0].length()
      const inward = back ? 180 : 0
      for (let i = 0; !back && i < buttons; i++) {
        const t = (i + 0.5) / buttons
        const y = top.y + (points.hemOut.y - top.y) * t
        const at = outseam.intersectsY(y)[0]
        if (!at) continue
        points[`buttonhole${i}`] = at.shift(inward, buttonInset)
        snippets[`buttonhole${i}`] = new Snippet('buttonhole', points[`buttonhole${i}`]).attr('data-rotate', 90)
      }
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

  if (straight) store.set(`trousers.paths.${which}`, { waist, crotch, inseam, hem, outseam, fly: paths.fly, hemSa })
  store.set(`trousers.${which}`, info)
  macro('grainline', { from: points.floor.shift(90, 30), to: new Point(points.floor.x, points.fork.y) })
  store.cutlist.setCut({ cut: 2, from: 'fabric' })
  title(macro, { at: new Point(points.knee.x, (points.fork.y + points.knee.y) / 2), nr: back ? 2 : 1, title: which })
  return part
}

/**
 * A leg cut in one: the back as drafted, and the front laid against it along their shared
 * straight outseam (from `trousers.paths.*`, drafted with `straightOutseam`), so there's no side
 * seam. The outseam's line is marked; the fly comes with the front.
 */
export const legInOnePart = ({ name, after, nr = 1 }) => ({
  name,
  after,
  draft: (sh) => {
    const { paths, Path, Point, store, sa, macro, part } = sh
    const B = store.get('trousers.paths.back')
    const F = store.get('trousers.paths.front')
    // Map the front so its outseam lies on the back's, its body on the other side of the line
    const [fh, fw] = [F.outseam.end(), F.outseam.start()]
    const [bh, bw] = [B.outseam.end(), B.outseam.start()]
    const unit = (a, b) => {
      const l = a.dist(b)
      return [(b.x - a.x) / l, (b.y - a.y) / l]
    }
    const uf = unit(fh, fw)
    const ub = unit(bh, bw)
    const side = (q, h, u) => Math.sign(u[0] * (q.y - h.y) - u[1] * (q.x - h.x)) || 1
    const sf = side(F.crotch.end(), fh, uf)
    const sb = side(B.crotch.end(), bh, ub)
    const nf = [-uf[1] * sf, uf[0] * sf] // into the front
    const nb = [-ub[1] * sb, ub[0] * sb] // into the back
    const T = (q) => {
      const t = (q.x - fh.x) * uf[0] + (q.y - fh.y) * uf[1]
      const d = (q.x - fh.x) * nf[0] + (q.y - fh.y) * nf[1]
      return new Point(bh.x + ub[0] * t - nb[0] * d, bh.y + ub[1] * t - nb[1] * d)
    }
    const map = (path) => {
      const out = new Path()
      for (const op of path.ops) {
        if (op.type === 'move') out.move(T(op.to))
        else if (op.type === 'line') out.line(T(op.to))
        else if (op.type === 'curve') out.curve(T(op.cp1), T(op.cp2), T(op.to))
      }
      return out
    }
    const [fw2, fc, fi, fhm] = [map(F.waist), map(F.crotch), map(F.inseam), map(F.hem)]
    // Back waist > crotch > inseam > hem, then the front's hem > inseam > crotch > waist back
    const segs = [
      [B.waist, 1],
      [B.crotch, 1],
      [B.inseam, 1],
      [B.hem, B.hemSa],
      [fhm.reverse(), F.hemSa],
      [fi.reverse(), 1],
      [fc.reverse(), 1],
      [fw2.reverse(), 1],
    ]
    let seam
    for (const [p] of segs) seam = seam ? seam.join(p) : p.clone()
    paths.seam = seam.close().addClass('fabric')
    if (sa) {
      // The darted waists' allowance runs straight across
      const flat = (p) => new Path().move(p.start()).line(p.end())
      let o
      for (const [p, k] of segs) {
        const off = (p === segs[0][0] || p === segs[7][0] ? flat(p) : p).offset(sa * k)
        o = o ? o.line(off.start()).join(off) : off
      }
      paths.sa = o.close().addClass('fabric sa')
    }
    paths.outseamLine = new Path().move(bw).line(bh).addClass('help dashed').addText('no side seam', 'center text-sm')
    if (F.fly) paths.fly = map(F.fly).addClass('mark dashed')
    store.set('trousers.leg', { waist: B.waist.length() + F.waist.length(), outseam: bw.dist(bh) })
    // On the back's grain, square to its hem
    const gx = (B.hem.start().x + B.hem.end().x) / 2
    macro('grainline', { from: new Point(gx, B.hem.start().y - 30), to: new Point(gx, B.crotch.end().y) })
    store.cutlist.setCut({ cut: 2, from: 'fabric' })
    title(macro, { at: bh.shiftFractionTowards(bw, 0.5), nr, title: 'leg' })
    return part
  },
})

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
