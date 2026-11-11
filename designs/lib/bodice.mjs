// Dresses on FreeSewing's Bella bodice block (blocks/bella.mjs): reshape its neckline, record its
// waist seam, and the skirt joined to it at the waist (BUILD_QUEUE K4, 2026-11-11).
import { polygonPart } from './flat.mjs'

/**
 * Reshape a Bella back or front neckline. The neck is widened along the shoulder by `widen` (mm,
 * the same on back and front, so the shoulder seams still match). The front's neck runs to centre
 * front `depth` below the neck point: `round` (a curve), `square` (straight down, then across) or
 * `v` (a straight line); the back's is lowered `depth` at centre back, curved. Rebuilds `seam`,
 * `saBase` and `sa`, and stores `bodice.<which>` { shoulder, neck } for the checks
 */
export function draftBodiceNeck(sh, { which, widen = 0, style = 'round', depth }) {
  const { points, paths, store, sa, Path, Point } = sh
  const shoulderLength = points.hps.dist(points.shoulder)
  if (!(widen >= 0 && widen < shoulderLength - 25)) throw new Error(`neck widened ${widen.toFixed(0)} mm leaves no shoulder`)
  const nP = points.hps.shiftTowards(points.shoulder, widen)
  points.neckPoint = nP
  let neck
  if (which === 'front') {
    const cf = new Point(points.cfNeck.x, Math.max(points.hps.y + depth, nP.y + 10))
    if (!(cf.y < points.cfHem.y - 60)) throw new Error(`front neck ${depth.toFixed(0)} mm deep reaches the waist`)
    points.neckCf = cf
    if (style === 'square') {
      points.neckCorner = new Point(nP.x, cf.y)
      neck = new Path().move(nP).line(points.neckCorner).line(cf)
    } else if (style === 'v') neck = new Path().move(nP).line(cf)
    else neck = new Path().move(nP).curve(nP.shift(-90, (cf.y - nP.y) * 0.6), cf.shift(0, nP.x * 0.6), cf)
    // The front's outline ran cfHem ... shoulder, hps, cfNeck, cfHem
    const toShoulder = (p) => p.split(points.shoulder)[0]
    paths.seam = toShoulder(paths.seam).line(nP).join(neck).line(points.cfHem).close().attr('class', 'fabric')
    paths.saBase = toShoulder(paths.saBase).line(nP).join(neck).hide()
    if (sa) paths.sa = paths.saBase.offset(sa).line(cf).move(points.cfHem).line(paths.saBase.offset(sa).start()).attr('class', 'fabric sa')
    else delete paths.sa
  } else {
    // The back's outline ran cbNeck, down centre back to waistCenter ... shoulder, hps, cbNeck
    const cbLine = new Path().move(points.cbNeck).curve_(points.cbNeckCp2, points.waistCenter)
    const y = points.cbNeck.y + depth
    if (!(y < points.waistCenter.y - 80)) throw new Error(`back neck ${depth.toFixed(0)} mm deep reaches the waist`)
    const cb = depth > 0.5 ? cbLine.intersectsY(y)[0] ?? points.cbNeck : points.cbNeck
    points.neckCb = cb
    const cbLower = depth > 0.5 ? cbLine.split(cb)[1] : cbLine
    neck = new Path().move(nP).curve(nP.shift(-90, (cb.y - nP.y) * 0.5), cb.shift(0, nP.x * 0.5), cb)
    // (split at waistCenter, the path after it starts with a zero-length curve to it: drop that)
    const middle = (p) => {
      const after = p.split(points.waistCenter)[1].split(points.shoulder)[0]
      while (after.ops[1]?.to?.sitsRoughlyOn(points.waistCenter)) after.ops.splice(1, 1)
      return after
    }
    paths.seam = new Path().move(cb).join(cbLower).join(middle(paths.seam)).line(nP).join(neck).close().attr('class', 'fabric')
    paths.saBase = new Path().move(cb).join(cbLower).join(middle(paths.saBase)).line(nP).join(neck).close().hide()
    if (sa) paths.sa = paths.saBase.offset(sa).attr('class', 'fabric sa')
    else delete paths.sa
  }
  store.set(`bodice.${which}`, { shoulder: nP.dist(points.shoulder), neck: neck.length() })
}

/**
 * A bodice's waist seam, for the skirt sewn to it: `bodice.waist.<which>` { seam (mm, half the
 * figure, the darts closed), dartX (the waist dart's middle, from centre front or back), dartLength }
 * and the side seam's foot. Front: cfHem to sideHem; back: waistCenter to waistSide
 */
export function draftBodiceWaist(sh, { which }) {
  const { points, store } = sh
  const front = which === 'front'
  const [start, l, r, end] = front
    ? [points.cfHem, points.waistDartLeft, points.waistDartRight, points.sideHem]
    : [points.waistCenter, points.dartBottomLeft, points.dartBottomRight, points.waistSide]
  // Bella leaves the front's waist dart out on figures whose waist is as big as the chest
  const dart = front ? l && r && l.dist(r) > 0.5 : true
  const seam = dart ? start.dist(l) + r.dist(end) : start.dist(end)
  const dartX = dart ? (l.x + r.x) / 2 - start.x : (end.x - start.x) / 2
  store.set(`bodice.waist.${which}`, { seam, dartX, dart: dart ? l.dist(r) : 0 })
}

/**
 * A dress skirt, front or back (`which`), sewn to the bodice's waist (`bodice.waist.<which>`):
 * `style` gathered (a rectangle `gathers` times the waist, never narrower than the seat), straight
 * or aline (the seat's quarter plus `seatEase` at the hip line, `flare` mm more at the hem; the waist taken in to the bodice's by a dart under the bodice's and a little at the side
 * seam). `length` from the waist. Front on the fold; back cut 2, centre back seamed for the zip,
 * notched `zip` below the waist. Stores `bodice.skirt.<which>` { waist, side, top, dartLegs }
 */
export function dressSkirtPart({ name, after, nr, label, which, enabled, shape }) {
  return polygonPart({
    name,
    after,
    nr,
    label,
    cut: which === 'front' ? 1 : 2,
    enabled,
    shape: (sh) => {
      const { style, gathers, seat, waistToSeat, seatEase, flare, length: L, zip = 0, dartDepth } = shape(sh)
      const w = sh.store.get(`bodice.waist.${which}`)
      const back = which === 'back'
      const Hq = (seat / 4) * (1 + seatEase)
      let pts
      let top
      let dartLegs = null
      if (style === 'gathered') {
        top = Math.max(w.seam * gathers, Hq * 1.1)
        pts = [[0, 0], [top, 0], [top, L], [0, L]]
      } else {
        top = Math.max(Hq, w.seam)
        const D = top - w.seam
        const s = Math.min(D / 3, 20)
        const d = D - s
        const hem = top + (style === 'aline' ? flare : 0)
        const x = Math.min(Math.max(w.dartX, d / 2 + 20), top - s - d / 2 - 20)
        const tipY = waistToSeat * dartDepth
        pts = [[0, 0]]
        if (d > 1) {
          pts.push([x - d / 2, 0], [x, tipY], [x + d / 2, 0])
          dartLegs = [Math.hypot(d / 2, tipY), Math.hypot(d / 2, tipY)]
        }
        // The side: in to the waist above the hip line, then straight or flared to the hem
        pts.push([top - s, 0], [top, waistToSeat], [hem, L], [0, L])
      }
      const n = pts.length
      // Allowance: the hem deep; centre front on the fold, centre back seamed
      const allowance = pts.map((_, i) => (i === n - 2 ? 3 : 1))
      // The waist edge sewn to the bodice (gathered: before gathering), and the side seam's length
      const waistEdge = style === 'gathered' ? top : w.seam
      const side =
        style === 'gathered'
          ? L
          : Math.hypot(pts[n - 3][0] - pts[n - 4][0], pts[n - 3][1] - pts[n - 4][1]) + Math.hypot(pts[n - 2][0] - pts[n - 3][0], pts[n - 2][1] - pts[n - 3][1])
      sh.store.set(`bodice.skirt.${which}`, { waist: waistEdge, side, top, dartLegs })
      return {
        points: pts,
        allowance,
        fold: back ? -1 : n - 1,
        notches: back && zip > 0 ? [[0, zip]] : [],
      }
    },
  })
}
