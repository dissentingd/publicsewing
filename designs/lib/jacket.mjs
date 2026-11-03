// Princess-seamed jackets on FreeSewing's Breanna block (Mitchell 1921's semi-fitted jacket).
// Each half body is cut into a centre panel and a side panel along its darts:
// - the front from the shoulder dart, through the bust between the two dart tips, to the
//   waist dart (Breanna's bust dart split between 12:00 and 06:00);
// - the back from a point on the shoulder (`backSeamAt`) through the waist dart's tip to it.
// The princess seams are smooth curves, the two sides of each the same length.
// Below the waist every panel edge runs straight on to the hem, out by an equal share of what
// the seat needs over the waist, so the seams cross (Mitchell's flare). The front gets a lap,
// a lapel turning on a crease, and a gorge for the collar.
//
// A box body (draftBoxLayout) uses the same bases, pieces and lapel, with no princess seams.
//
// Draft: jacketBase on a hidden Breanna back and front (in that order), jacketLayout (or
// boxLayout) on the front base, then jacketPanelPart for each piece. Store: `jacket.*`;
// the collar's neckline as `coat.jacketNeck` { back, front }; the sleeve's armhole for
// FreeSewing's two-part sleeve under `library.*`.
import { title } from './coat.mjs'
import { lapelLines } from './lapel.mjs'
import { pocketPath, flapSpec } from './pockets.mjs'

const near = (a, b) => Math.abs(a.x - b.x) < 1e-6 && Math.abs(a.y - b.y) < 1e-6

/** A path's drawing segments (no zero-length steps): [{ from, op }] */
function segments(path) {
  const out = []
  let at
  for (const op of path.ops) {
    if (op.type === 'move') at = op.to
    else if (op.type === 'line' || op.type === 'curve') {
      if (!near(at, op.to)) out.push({ from: at, op })
      at = op.to
    }
  }
  return out
}

/** The stretch of a closed outline from point a forward to point b, as a new Path */
function stretch(Path, segs, a, b) {
  const i = segs.findIndex((s) => near(s.from, a))
  if (i < 0) throw new Error('jacket: outline has no segment starting at the given point')
  let p = new Path().move(a.clone())
  for (let k = 0; k < segs.length; k++) {
    const { op } = segs[(i + k) % segs.length]
    p = op.type === 'line' ? p.line(op.to.clone()) : p.curve(op.cp1.clone(), op.cp2.clone(), op.to.clone())
    if (near(op.to, b)) return p
  }
  throw new Error('jacket: point not on the outline')
}

/** Breanna's darts on a side, sorted top to bottom, each { c (centre leg), tip, s (side leg) } */
function darts(points, side) {
  const names = side === 'front' ? ['primaryBustDart', 'secondaryBustDart'] : ['waistDart']
  return names
    .filter((n) => points[`${n}1`] && points[`${n}Tip`])
    .map((n) => {
      const [a, b] = [points[`${n}1`], points[`${n}2`]]
      return a.x < b.x ? { c: a, tip: points[`${n}Tip`], s: b } : { c: b, tip: points[`${n}Tip`], s: a }
    })
    .sort((d, e) => d.c.y - e.c.y)
}

/**
 * Read one side of Breanna (after its own draft) into the store as `jacket.raw.<side>`.
 * `style` 'princess' needs a waist dart on both sides and a shoulder dart on the front; 'box'
 * needs only the front's waist dart (pivoted into the neck later) and no back dart.
 */
export function draftJacketBase(sh, { side, backSeamAt = 0.5, style = 'princess' }) {
  const { points, paths, Path, store, part } = sh
  const segs = segments(paths.seam)
  const center = side === 'front' ? 'cf' : 'cb'
  const ds = darts(points, side)
  const lower = ds.at(-1)
  const upper = side === 'front' && style === 'princess' ? ds[0] : null
  if (style === 'box') {
    if (side === 'front' ? ds.length !== 1 : ds.length !== 0) {
      throw new Error(`jacket: a box body needs Breanna's front with one waist dart and its back with none`)
    }
  } else if (!lower || (side === 'front' && (!upper || upper === lower))) {
    throw new Error(`jacket: Breanna's ${side} needs a waist dart${side === 'front' ? ' and a shoulder dart' : ''}`)
  }
  if (upper) {
    // The shoulder dart must sit on the shoulder seam, between the shoulder tip and the neck
    const order = segs.map((g) => g.op.to)
    const i = order.findIndex((p) => near(p, points.shoulder))
    const j = order.findIndex((p) => near(p, points.hps))
    const on = order.slice(i, j + 1)
    if (i < 0 || j < i || !on.some((p) => near(p, upper.c)) || !on.some((p) => near(p, upper.s))) {
      throw new Error(`jacket: Breanna's front shoulder dart isn't on the shoulder (secondaryBustDart 12:00 puts it there)`)
    }
  }
  const raw = {
    hps: points.hps.clone(),
    shoulder: points.shoulder.clone(),
    centerNeck: points[`${center}Neck`].clone(),
    centerWaist: points[`${center}Waist`].clone(),
    waist: points.waist.clone(),
    armhole: points.armhole.clone(),
    neck: stretch(Path, segs, points.hps, points[`${center}Neck`]), // neck point -> CF/CB
    scye: stretch(Path, segs, points.armhole, points.shoulder), // armhole bottom -> shoulder
    sideAbove: stretch(Path, segs, points.waist, points.armhole), // side seam, waist -> armhole
    lower,
  }
  if (side === 'front') {
    raw.upper = upper
    raw.bustY = (points.cfBust ?? lower.tip).y
  } else if (style === 'princess') {
    // The back seam starts on the shoulder, `backSeamAt` of the way from the neck point
    raw.upper = { c: points.hps.shiftFractionTowards(points.shoulder, backSeamAt), tip: lower.tip }
    raw.upper.s = raw.upper.c
  }
  for (const p in paths) delete paths[p]
  store.set(`jacket.raw.${side}`, raw)
  return part
}

/**
 * Cut both sides into panels (on the front base, after both bases). Lengths in mm:
 * { seat: seat girth with ease, hipDepth: waist to seat line, length: waist to hem,
 *   lap, breakBelow (bust line to the break), rollOut, lapelWidth, gorgeAt (0-1 along the
 *   front neck from the neck point), peak (bool), facing, rows (double-breasted: the two rows
 *   of buttons this far either side of CF), closed (bool: no lapel, buttoned to the neck),
 *   kimono (Mitchell's kimona sleeve, cut in one with the side back and side front:
 *   { length: neck point to wrist, hem: round the sleeve's end, depth: the side seam's top below
 *   the armhole, angleBack, angleFront: degrees below level }) }
 * With `kimono` there's no armhole: from the top of each princess seam the overarm runs straight out
 * at its angle, the neck point to the wrist `length` on both sides (a shoulder dart's width not
 * counted). Square to it at the wrist, the hem; the hem is shared so the two underarm seams, to the
 * side seam `depth` below the armhole, are the same length. Store: `jacket.kimono`.
 *
 * `backArmhole` (with `underarm`; Mitchell's "Prince Albert"): the back seam leaves the armhole in
 * place of the shoulder, `rise` (0-1) of the way up from the under-arm seam's top to the shoulder
 * point, and passes the chest line `chest` x the back's waist width from the CB.
 * `waistSeam` (with `underarm`): every panel but the back stops at the waist, and their skirts are
 * laid edge to edge, front to back seam, as one `skirt` (and `skirtLining`). { lapWaist, lapHip: the
 * lap there, `lap` being its width at the break; pleatWaist, pleatHem: a pleat on the back and skirt
 * at the back seam; ventWaist, ventHem: a CB vent on the back; spread: more at the hem, per skirt
 * seam }. Store: `jacket.seams.waist` [bodice, skirt] and `.pleat` [back, skirt].
 *
 * `hemFlare` (Pivnick's fitted coat): each seam edge's width past its waist point at the hem, if more
 * than the seat needs. Every edge is then `length` long and the hem rises at the seams, so it hangs
 * level once they're sewn. `cb: { waist: 0, hip: 0, flare: true }`: a CB seam flaring the same way,
 * cut in pairs, the back lining too. `buttonBottom`: the last button this far below the waist.
 * `frontSeamMin`: the front seam at least this far from CF at the waist, moved toward the side with
 * the dart's width unchanged, its tip following; kept off the side seam by leaving half the side
 * front. Moved by `jacket.front.seamShift`.
 */
export function draftJacketLayout(sh, a) {
  const { Path, Point, store } = sh
  const bk = store.get('jacket.raw.back')
  const fr = store.get('jacket.raw.front')

  // Waist widths of the four panels, and each seam edge's flare at the seat line
  const waistW =
    bk.lower.c.x - bk.centerWaist.x + (bk.waist.x - bk.lower.s.x) + (fr.lower.c.x - fr.centerWaist.x) + (fr.waist.x - fr.lower.s.x)
  // An under-arm panel (`underarm`) puts two seams in place of the side seam, each with its own
  // waist suppression; a shaped CB (`cb`) comes in `waist` at the waist and out to `hip` at
  // the seat line. Both take width out at the waist, which the flare gives back at the seat.
  const ua = a.underarm
  const cbIn = a.cb?.waist ?? 0
  const cbHip = a.cb?.hip ?? 0
  // A second front seam (`second`, with an under-arm panel only) adds its suppression and two
  // more flaring edges
  const sec = ua && a.second ? a.second : null
  const supp = (ua ? ua.backSuppression + ua.frontSuppression : 0) + (sec ? sec.suppression : 0)
  const e = Math.max(0, (a.seat / 2 - waistW + supp + cbHip) / ((ua ? 8 : 6) + (sec ? 2 : 0)))
  const slope = e / a.hipDepth
  /** Where an edge from waist point w, flaring by `dir` (+1 out to +x), meets the hem */
  const hemAt = (w, dir) => {
    if (!a.hemFlare) return new Point(w.x + dir * slope * a.length, w.y + a.length)
    const dx = Math.min(Math.max(slope * a.length, a.hemFlare), 0.6 * a.length)
    return new Point(w.x + dir * dx, w.y + Math.sqrt(a.length ** 2 - dx ** 2))
  }

  const panels = {}
  const seams = {}
  const lineTo = (p, ...pts) => pts.reduce((q, t) => q.line(t.clone()), p)
  const ws = ua ? a.waistSeam : null
  const ba = ua ? a.backArmhole : null

  /**
   * A princess seam pair: from each panel's top end to its waist end, two smooth curves
   * through the shared point M with the shared direction `tan` there (so the panels meet
   * without a corner at the dart tips). Each curve leaves its ends along its dart leg (toward
   * tipTop / tipBottom). Unless the two already match within 0.05 mm, the side curve's handles
   * are scaled until it is as long as the centre curve (all four; failing that, the two at M).
   * Returns { centre, side } paths, top to waist.
   */
  const princess = (c, sd, M, tan, tipTop, tipBottom) => {
    const unit = (a, b) => {
      const d = a.dist(b)
      return d > 1e-9 ? { x: (b.x - a.x) / d, y: (b.y - a.y) / d } : tan
    }
    const go = (p, d, k) => new Point(p.x + d.x * k, p.y + d.y * k)
    // h scales all four handles; g only the two at M (along `tan`), for a nearly straight seam
    const curve = ({ top, bottom }, h, g = 1) => {
      const k1 = (top.dist(M) / 3) * h
      const k2 = (M.dist(bottom) / 3) * h
      return new Path()
        .move(top.clone())
        .curve(go(top, unit(top, tipTop), k1), go(M, tan, -k1 * g), M.clone())
        .curve(go(M, tan, k2 * g), go(bottom, unit(bottom, tipBottom), k2), bottom.clone())
    }
    const centre = curve(c, 1)
    const target = centre.length()
    const solve = (f, from, span) => {
      if (Math.abs(f(from)) < 0.05) return from
      // Bracket the root nearest `from`, then bisect
      let lo
      let hi
      for (let d = 0.05; d <= span && lo === undefined; d += 0.05) {
        for (const [a, b] of [[from, from + d], [from - d, from]]) {
          if (a >= 0 && Math.sign(f(a)) !== Math.sign(f(b)) && lo === undefined) [lo, hi] = [a, b]
        }
      }
      if (lo === undefined) return undefined
      for (let i = 0; i < 60; i++) {
        const mid = (lo + hi) / 2
        if (Math.sign(f(mid)) === Math.sign(f(lo))) lo = mid
        else hi = mid
      }
      return (lo + hi) / 2
    }
    const h = solve((x) => curve(sd, x).length() - target, 1, 1.5)
    if (h !== undefined) return { centre, side: curve(sd, h) }
    const g = solve((x) => curve(sd, 1, x).length() - target, 1, 3)
    if (g !== undefined) return { centre, side: curve(sd, 1, g) }
    throw new Error(`jacket: princess seam lengths can't be matched (centre ${target.toFixed(1)}, side ${curve(sd, 1).length().toFixed(1)})`)
  }
  const dir = (a, b) => {
    const d = a.dist(b)
    return { x: (b.x - a.x) / d, y: (b.y - a.y) / d }
  }

  /**
   * Where an under-arm seam cuts a side panel (back or front base `r`): from the armhole, `d`
   * (0-1) of the way in from the side seam to the armhole's innermost point, straight down to
   * the waist, opened `sup` there (half each side),
   * then flaring to the hem. Returns the scye's two parts, the seam's top S, its waist points
   * (`Wc` on the panel toward the centre, `Wu` on the under-arm panel) and the centre side's hem.
   */
  const underarmCut = (r, d, sup) => {
    const lo = r.lower.s.x + 0.3 * (r.waist.x - r.lower.s.x)
    const x = Math.max(r.armhole.x - d * (r.armhole.x - r.scye.bbox().topLeft.x), lo)
    const S = r.scye.intersectsX(x).sort((p, q) => q.y - p.y)[0]
    if (!S) throw new Error(`jacket: the under-arm seam (${(r.armhole.x - x).toFixed(0)} mm in) misses the armhole`)
    const [toS, fromS] = r.scye.split(S)
    const t = (x - r.lower.s.x) / (r.waist.x - r.lower.s.x)
    const y = r.lower.s.y + t * (r.waist.y - r.lower.s.y)
    const Wc = new Point(x - sup / 2, y)
    const Wu = new Point(x + sup / 2, y)
    return { S, toS, fromS, Wc, Wu, hemC: hemAt(Wc, 1) }
  }
  const under = {}
  const outer = {} // each side panel's seam and hem, and what its top is built from, for `kimono`

  // ---- back ----
  let backCentre // the back panel's princess seam and hem, for the lining
  {
    const r = bk
    // A shaped CB: straight down to the armhole level, in to the waist, then out along the same
    // line by `cbIn - cbHip` at the seat line, on to the hem
    const cbx = r.centerWaist.x
    const cbWaist = new Point(cbx + cbIn, r.centerWaist.y)
    const hemC = a.cb?.flare ? hemAt(cbWaist, -1) : new Point(cbx + cbIn - ((cbIn - cbHip) / a.hipDepth) * a.length, r.centerWaist.y + a.length)
    const cbLine = cbIn ? [new Point(cbx, r.armhole.y), cbWaist] : a.waistSeam || a.cb?.flare ? [cbWaist] : []
    const hemCs = hemAt(r.lower.c, 1)
    const hemSc = hemAt(r.lower.s, -1)
    const hemS = hemAt(r.waist, 1)
    // The seam passes through the waist dart's tip, heading for the middle of the dart
    let M = r.lower.tip
    let tan = dir(r.upper.c, r.lower.c.shiftFractionTowards(r.lower.s, 0.5))
    let seam
    // Into the armhole: from Z on the armhole, through M on the chest line, to the waist dart
    let Z
    let toZ
    let fromZ
    if (ba) {
      const u = underarmCut(r, ua.back, ua.backSuppression)
      Z = u.fromS.intersectsY(u.S.y - ba.rise * (u.S.y - r.shoulder.y))[0]
      if (!Z) throw new Error(`jacket: the back seam misses the armhole`)
      ;[toZ, fromZ] = u.fromS.split(Z)
      M = new Point(Math.min(cbx + ba.chest * (r.lower.c.x - cbWaist.x), 0.5 * (cbx + Z.x)), r.armhole.y)
      tan = dir(M, r.lower.c.shiftFractionTowards(r.lower.s, 0.5))
      seam = princess({ top: Z, bottom: r.lower.c }, { top: Z, bottom: r.lower.s }, M, tan, new Point(M.x, Z.y), M)
    } else seam = princess({ top: r.upper.c, bottom: r.lower.c }, { top: r.upper.s, bottom: r.lower.s }, M, tan, M, M)
    // With a waist seam the back alone runs on to the hem, with a pleat on the back seam and a
    // vent on the CB
    const n = ws ? (() => { const d = dir(r.lower.c, hemCs); return { x: -d.y, y: d.x } })() : null
    const out = n && n.x < 0 ? { x: -n.x, y: -n.y } : n // toward the side (+x)
    const pleat = ws
      ? { w: new Point(r.lower.c.x + out.x * ws.pleatWaist, r.lower.c.y + out.y * ws.pleatWaist), h: new Point(hemCs.x + out.x * ws.pleatHem, hemCs.y + out.y * ws.pleatHem) }
      : null
    const below = ws
      ? [new Point(cbWaist.x - ws.ventWaist, cbWaist.y), new Point(hemC.x - ws.ventHem, hemC.y), hemCs, pleat.h, pleat.w]
      : [hemC, hemCs]
    let centre = lineTo(new Path().move(r.hps.clone()).join(r.neck.clone()), ...cbLine, ...below, r.lower.c).join(seam.centre.reverse())
    centre = (ba ? centre.join(fromZ.clone()) : centre).line(r.hps.clone())
    const side = seam.side.clone().line(hemSc).line(hemS).line(r.waist.clone()).join(r.sideAbove.clone())
    panels.back = {
      outline: centre,
      fold: !cbIn && !ws && !a.cb?.flare, // (a vent's or a flared CB can't be on a fold)
      marks: { hps: r.hps, cbNeck: r.centerNeck, cbHem: hemC, hemSeam: hemCs, seamWaist: r.lower.c, seamBust: M, seamTop: ba ? Z : r.upper.c },
    }
    panels.sideBack = {
      outline: closeOver(side, r.scye, r.shoulder, r.upper.s, Path),
      fold: false,
      marks: { seamTop: r.upper.s, seamBust: M, seamWaist: r.lower.s, hemSeam: hemSc, hemSide: hemS, waist: r.waist, armhole: r.armhole, shoulder: r.shoulder },
    }
    if (ua) {
      const u = underarmCut(r, ua.back, ua.backSuppression)
      panels.sideBack.outline = ws || ba
        ? lineTo(seam.side.clone(), ...(ws ? [] : [hemSc, u.hemC]), u.Wc, u.S).join(ba ? toZ.clone() : u.fromS.clone().line(r.upper.s.clone()))
        : seam.side.clone().line(hemSc).line(u.hemC).line(u.Wc).line(u.S).join(u.fromS).line(r.upper.s.clone())
      panels.sideBack.marks = ws
        ? { seamTop: ba ? Z : r.upper.s, seamBust: M, seamWaist: r.lower.s, waist: u.Wc, armhole: u.S }
        : { seamTop: r.upper.s, seamBust: M, seamWaist: r.lower.s, hemSeam: hemSc, hemSide: u.hemC, waist: u.Wc, armhole: u.S, shoulder: r.shoulder }
      under.back = u
      under.back.hemSc = hemSc
      under.back.pleat = pleat
      under.back.out = out
    }
    backCentre = { seam: seam.centre, hemC, hemCs, fromZ }
    outer.back = { r, body: () => seam.side.clone().line(hemSc).line(hemS).line(r.waist.clone()), hemS, seamLen: r.waist.dist(hemS) }
    seams.backPrincess = ws ? [seam.centre.length(), seam.side.length()] : [seam.centre.length() + r.lower.c.dist(hemCs), seam.side.length() + r.lower.s.dist(hemSc)]
    if (!ua) seams.sideBack = r.sideAbove.length() + r.waist.dist(hemS)
    seams.shoulderBack = r.hps.dist(r.shoulder)
  }

  // ---- front ----
  const lap = { lap: a.lap, ...(a.rows ? { rows: a.rows } : {}) }
  {
    let r = fr
    const cfx = r.centerWaist.x
    if (a.frontSeamMin) {
      const room = 0.5 * (r.waist.x - r.lower.s.x)
      const by = Math.min(Math.max(0, a.frontSeamMin - (r.lower.c.x - cfx)), room)
      const rise = (r.waist.y - r.lower.s.y) / (r.waist.x - r.lower.s.x) // along the waist
      const move = (q, k = 1) => new Point(q.x + by * k, q.y + by * k * rise)
      r = { ...r, lower: { c: move(r.lower.c), s: move(r.lower.s), tip: move(r.lower.tip) } }
      lap.seamShift = by
    }
    const edgeX = cfx - a.lap
    const hemC = new Point(edgeX, r.centerWaist.y + a.length)
    const hemCs = hemAt(r.lower.c, 1)
    const hemSc = hemAt(r.lower.s, -1)
    const hemS = hemAt(r.waist, 1)

    // Lapel, from the gorge point on the front neck (`gorgeAt` along it from the neck point)
    const G = r.neck.shiftAlong(r.neck.length() * a.gorgeAt)
    const [neckToG] = r.neck.split(G)
    const lapel = jacketLapel(Path, Point, { hps: r.hps, bustY: r.bustY, edgeX, G }, a)
    let { B, R, N, P, lapelEdge } = lapel
    // The front's top edge, neck point to break: the neck, notch and lapel; or a shawl collar
    // cut in one with the front, its neck edge running on up the crease line from the neck
    // point for the back neck's length, `shawl.width` wide at CB, `shawl.lapel` at the lapel
    let topEdge = () => new Path().move(r.hps.clone()).join(neckToG.clone()).line(N.clone()).line(P.clone()).join(lapelEdge.clone())
    if (a.shawl) {
      const u = dir(B, R)
      const v = u.y < 0 ? { x: u.y, y: -u.x } : { x: -u.y, y: u.x } // toward x < 0, off the body
      const go = (p, d, k) => new Point(p.x + d.x * k, p.y + d.y * k)
      const Cn = go(r.hps, u, bk.neck.length())
      const Co = go(Cn, v, a.shawl.width)
      const Lp = go(go(B, u, 0.45 * B.dist(R)), v, a.shawl.lapel)
      const k1 = B.dist(Lp) * 0.35
      const k2 = Lp.dist(Co) * 0.35
      ;[N, P] = [Cn, Lp]
      topEdge = () =>
        new Path().move(r.hps.clone()).line(Cn.clone()).line(Co.clone()).curve(go(Co, u, -k2), go(Lp, u, k2), Lp.clone()).curve(go(Lp, u, -k1), B.shift(90, k1), B.clone())
      store.set('coat.collar', { neck: r.hps.dist(Cn), target: bk.neck.length(), shawl: true })
      lap.shawl = { Cn, Co }
    }
    // Closed to the neck (`closed`, Merz's storm collar): no lapel; the top edge runs from the
    // neck at CF straight out to the front edge, the collar sewn round to the edge
    if (a.closed) {
      const C = r.neck.end()
      B = new Point(edgeX, C.y)
      ;[R, N, P] = [B, B, B]
      lapelEdge = new Path().move(B.clone()).line(B.clone())
      lap.neckExt = C.dist(B)
      topEdge = () => new Path().move(r.hps.clone()).join(r.neck.clone()).line(B.clone())
      lap.buttonTop = B.y + a.lap * 0.4
      lap.closed = true
    }
    const top = topEdge()
    // The seam runs through the bust, half way between the two dart tips, along the line
    // from one tip to the other
    const M = r.upper.tip.shiftFractionTowards(r.lower.tip, 0.5)
    const tan = dir(r.upper.tip, r.lower.tip)
    const seam = princess({ top: r.upper.c, bottom: r.lower.c }, { top: r.upper.s, bottom: r.lower.s }, M, tan, r.upper.tip, r.lower.tip)
    // With a waist seam the lap narrows to the waist and widens again to the hip
    const edgeW = ws ? new Point(cfx - ws.lapWaist, r.centerWaist.y) : null
    const edgeH = ws ? new Point(cfx - ws.lapHip, r.centerWaist.y + a.hipDepth) : null
    const hemF = ws ? new Point(edgeH.x, hemC.y) : hemC
    const edgeBelow = ws ? [edgeW, edgeH, hemF] : [hemC]
    const centre = lineTo(top, ...(ws ? [edgeW] : [hemC, hemCs]), r.lower.c).join(seam.centre.reverse()).line(r.hps.clone())
    const side = seam.side.clone().line(hemSc).line(hemS).line(r.waist.clone()).join(r.sideAbove.clone())
    panels.front = {
      outline: centre,
      fold: false,
      marks: {
        hps: r.hps,
        gorge: G,
        notch: N,
        lapelPoint: P,
        break: B,
        ...(ws ? { waistEdge: edgeW } : { hemEdge: hemC, hemSeam: hemCs }),
        seamWaist: r.lower.c,
        seamBust: M,
        seamTop: r.upper.c,
        cfLine: r.centerWaist, // on CF, at the waist (not an outline corner)
      },
    }
    panels.sideFront = {
      outline: closeOver(side, r.scye, r.shoulder, r.upper.s, Path),
      fold: false,
      marks: { seamTop: r.upper.s, seamBust: M, seamWaist: r.lower.s, hemSeam: hemSc, hemSide: hemS, waist: r.waist, armhole: r.armhole, shoulder: r.shoulder },
    }
    seams.frontPrincess = ws ? [seam.centre.length(), seam.side.length()] : [seam.centre.length() + r.lower.c.dist(hemCs), seam.side.length() + r.lower.s.dist(hemSc)]
    if (!ua) seams.sideFront = r.sideAbove.length() + r.waist.dist(hemS)
    let sideEdge = [r.waist, hemS] // the side front's back edge below the waist, for the pockets
    outer.front = { r, body: () => seam.side.clone().line(hemSc).line(hemS).line(r.waist.clone()), hemS, seamLen: r.waist.dist(hemS) }
    if (ua) {
      const u = underarmCut(r, ua.front, ua.frontSuppression)
      panels.sideFront.outline = lineTo(seam.side.clone(), ...(ws ? [] : [hemSc, u.hemC]), u.Wc, u.S).join(u.fromS).line(r.upper.s.clone())
      panels.sideFront.marks = ws
        ? { seamTop: r.upper.s, seamBust: M, seamWaist: r.lower.s, waist: u.Wc, armhole: u.S, shoulder: r.shoulder }
        : { seamTop: r.upper.s, seamBust: M, seamWaist: r.lower.s, hemSeam: hemSc, hemSide: u.hemC, waist: u.Wc, armhole: u.S, shoulder: r.shoulder }
      sideEdge = [u.Wc, u.hemC]
      under.front = u
      // A second front seam (Mitchell's double dart): from `sec.at` (0-1) along the side front's
      // shoulder, princess seam to shoulder point, down to the waist half way between the
      // princess and under-arm seams, opened `sec.suppression` there square to the seam, then
      // both edges flaring to the hem. Splits the side front into a middle front and a side front.
      if (sec) {
        const Q = r.upper.s.shiftFractionTowards(r.shoulder, sec.at)
        const Wm = r.lower.s.shiftFractionTowards(u.Wc, 0.5)
        const d = dir(Q, Wm)
        const n = { x: -d.y, y: d.x }
        const nn = n.x > 0 ? n : { x: -n.x, y: -n.y } // toward the side (+x)
        const go = (p, v, k) => new Point(p.x + v.x * k, p.y + v.y * k)
        const Wa = go(Wm, nn, -sec.suppression / 2)
        const Wb = go(Wm, nn, sec.suppression / 2)
        const Lh = a.length / d.y
        const hemA = go(go(Wa, d, Lh), nn, slope * Lh)
        const hemB = go(go(Wb, d, Lh), nn, -slope * Lh)
        panels.middleFront = {
          outline: seam.side.clone().line(hemSc).line(hemA).line(Wa).line(Q).line(r.upper.s.clone()),
          fold: false,
          marks: { seamTop: r.upper.s, seamBust: M, seamWaist: r.lower.s, hemSeam: hemSc, hemSecond: hemA, secondWaist: Wa, secondTop: Q },
        }
        panels.sideFront.outline = new Path().move(Q.clone()).line(Wb).line(hemB).line(u.hemC).line(u.Wc).line(u.S).join(u.fromS).line(Q.clone())
        panels.sideFront.marks = { secondTop: Q, secondWaist: Wb, hemSecond: hemB, hemSide: u.hemC, waist: u.Wc, armhole: u.S, shoulder: r.shoulder }
        seams.frontSecond = [Q.dist(Wa) + Wa.dist(hemA), Q.dist(Wb) + Wb.dist(hemB)]
      }
      // The under-arm panel, in the back's frame: the front side mirrored and turned so its side
      // seam (armhole to waist) lies on the back's, the side seam then dropped. Below the waist
      // both edges run down the panel's own middle direction, each flaring by the same `e`.
      const ub = under.back
      const mir = (p) => ({ x: -p.x, y: p.y })
      const ang = (p, q) => Math.atan2(q.y - p.y, q.x - p.x)
      const [fA, fW] = [mir(r.armhole), mir(r.waist)]
      const th = ang(bk.armhole, bk.waist) - ang(fA, fW)
      const T = (p) => {
        const m = mir(p)
        const [dx, dy] = [m.x - fA.x, m.y - fA.y]
        return new Point(bk.armhole.x + dx * Math.cos(th) - dy * Math.sin(th), bk.armhole.y + dx * Math.sin(th) + dy * Math.cos(th))
      }
      const down = { x: -Math.sin(th) / 2, y: (1 + Math.cos(th)) / 2 }
      const dl = Math.hypot(down.x, down.y)
      const d = { x: down.x / dl, y: down.y / dl }
      const n = { x: -d.y, y: d.x } // toward the back's side (x < 0 when d is straight down)
      const L = a.length
      const Wf = T(u.Wu)
      const H1 = new Point(ub.Wu.x + d.x * L + n.x * slope * L, ub.Wu.y + d.y * L + n.y * slope * L)
      const H2 = new Point(Wf.x + d.x * L - n.x * slope * L, Wf.y + d.y * L - n.y * slope * L)
      const frontScye = mapPath(u.toS.reverse(), Path, T) // the front's S -> armhole
      panels.underArm = {
        outline: lineTo(new Path().move(ub.S.clone()), ub.Wu, ...(ws ? [] : [H1, H2]), Wf, T(u.S)).join(frontScye).join(ub.toS.clone()),
        fold: false,
        marks: ws
          ? { backTop: ub.S, backWaist: ub.Wu, frontWaist: Wf, frontTop: T(u.S), armhole: bk.armhole }
          : { backTop: ub.S, backWaist: ub.Wu, backHem: H1, frontHem: H2, frontWaist: Wf, frontTop: T(u.S), armhole: bk.armhole },
      }
      const edge = (S, W, H) => S.dist(W) + (ws ? 0 : W.dist(H))
      seams.underarmBack = [edge(ub.S, ub.Wc, ub.hemC), edge(ub.S, ub.Wu, H1)]
      seams.underarmFront = [edge(u.S, u.Wc, u.hemC), edge(T(u.S), Wf, H2)]
      // The skirt: each panel's part below the waist laid edge to edge on the one before, front to
      // back seam. As a fan, so it comes out even whatever the angle of each panel's own waist: a
      // panel keeps its waist's width, and its two edges flare by the same `e` as everywhere (so
      // the seat's width is kept), `spread` more at the hem at each seam
      if (ws) {
        const L = r.lower.c.dist(hemCs)
        const flare = Math.atan(slope)
        const spread = (ws.spread ?? 0) / L
        const turn = (d, t) => ({ x: d.x * Math.cos(t) + d.y * Math.sin(t), y: -d.x * Math.sin(t) + d.y * Math.cos(t) })
        const lay = (prev, width) => {
          const left = turn(prev.d, spread)
          const mid = turn(left, flare)
          const w = new Point(prev.w.x + mid.y * width, prev.w.y - mid.x * width)
          const d = turn(left, 2 * flare)
          return { w, d, h: new Point(w.x + d.x * L, w.y + d.y * L) }
        }
        const s1 = lay({ w: r.lower.c, d: dir(r.lower.c, hemCs) }, r.lower.s.dist(u.Wc))
        const s2 = lay(s1, Wf.dist(ub.Wu))
        const s3 = lay(s2, ub.Wc.dist(bk.lower.s))
        // Smooth through the seams' ends
        const smooth = (pts) => {
          const go = (p, d, k) => new Point(p.x + d.x * k, p.y + d.y * k)
          const tangent = (i) => dir(pts[Math.max(0, i - 1)], pts[Math.min(pts.length - 1, i + 1)])
          let path = new Path().move(pts[0].clone())
          for (let i = 0; i + 1 < pts.length; i++) {
            const k = pts[i].dist(pts[i + 1]) / 3
            path = path.curve(go(pts[i], tangent(i), k), go(pts[i + 1], tangent(i + 1), -k), pts[i + 1].clone())
          }
          return path
        }
        const d3 = dir(s3.w, s3.h)
        const o3 = d3.y > 0 ? { x: d3.y, y: -d3.x } : { x: -d3.y, y: d3.x } // away from the skirt
        const go3 = (p, k) => new Point(p.x + o3.x * k, p.y + o3.y * k)
        const skirt = (wTop, hTop, ...edge) => {
          const waist = smooth([wTop, r.lower.c, s1.w, s2.w, s3.w])
          const hem = smooth([hTop, hemCs, s1.h, s2.h, s3.h])
          return { waist, hem, edge }
        }
        const main = skirt(edgeW, hemF)
        panels.skirt = {
          outline: lineTo(new Path().move(edgeW.clone()), edgeH, hemF).join(main.hem.clone()).line(go3(s3.h, ws.pleatHem)).line(go3(s3.w, ws.pleatWaist)).line(s3.w.clone()).join(main.waist.clone().reverse()),
          fold: false,
          marks: { waistEdge: edgeW, seam1Waist: r.lower.c, seam2Waist: s1.w, seam3Waist: s2.w, backSeamWaist: s3.w, seam1Hem: hemCs, seam2Hem: s1.h, seam3Hem: s2.h, backSeamHem: s3.h },
          lines: { cf: [new Point(cfx, edgeW.y + (r.lower.c.y - edgeW.y) * (ws.lapWaist / (r.lower.c.x - edgeW.x))), new Point(cfx, hemF.y)] },
        }
        const bodice = edgeW.dist(r.lower.c) + r.lower.s.dist(u.Wc) + Wf.dist(ub.Wu) + ub.Wc.dist(bk.lower.s)
        seams.waist = [bodice, main.waist.length()]
        seams.pleat = [ub.pleat.w.dist(ub.pleat.h), go3(s3.w, ws.pleatWaist).dist(go3(s3.h, ws.pleatHem))]
        lap.buttonBottom = r.centerWaist.y - a.lap * 0.4
        lap.cfEnd = edgeW.y
        lap.skirtLining = { smooth, skirt, s3, edgeW, edgeH, hemF, r }
      }
    }
    seams.shoulderFront = r.hps.dist(r.upper.c) + r.upper.s.dist(r.shoulder)
    Object.assign(lap, { cfx, edgeX, B, R, G, N, P, hemC, top, lapelEdge, neckToG, hemY: hemC.y, waistY: r.centerWaist.y })
    if (a.buttonBottom !== undefined) lap.buttonBottom = r.centerWaist.y + a.buttonBottom

    // Facing: the front edge strip, lapel included, from the hem up to the shoulder
    const fx = cfx + Math.min(a.facing - a.lap, 0.8 * (r.lower.c.x - cfx))
    const fShoulder = r.hps.shiftFractionTowards(r.upper.c, 0.6)
    const facing = lineTo(topEdge(), ...edgeBelow)
      .line(new Point(fx, hemC.y))
      .line(new Point(fx, r.bustY))
      .curve(new Point(fx, r.bustY - (r.bustY - fShoulder.y) * 0.5), fShoulder.shift(-90, (r.bustY - fShoulder.y) * 0.3), fShoulder)
      .line(r.hps.clone())
    panels.facing = { outline: facing, fold: false }
    lap.facingX = fx

    // Set-in flap pockets on the side front, from its princess edge below the waist
    const along = (p, q) => (y) => p.x + ((q.x - p.x) * (y - p.y)) / (q.y - p.y)
    const pockets = layoutPockets(a.pockets, {
      baseY: r.centerWaist.y,
      startAt: along(r.lower.s, hemSc),
      sideAt: along(...sideEdge),
      hemY: hemC.y,
    })
    panels.sideFront.pockets = pockets
    store.set('jacket.pockets', pockets)

    // Welt pockets: each mouth from `from` behind CF, `below` the bust line, `len` long, rising
    // `rise` degrees toward the side. One that reaches the princess seam is cut across it: the
    // rest of its length goes on from the seam's other side on the side front. Shortened to
    // stay `clear` of the side seam's top (the underarm).
    const welts = {}
    for (const [id, w] of Object.entries(a.welts ?? {})) {
      const t = (w.rise * Math.PI) / 180
      const u = { x: Math.cos(t), y: -Math.sin(t) }
      const P0 = new Point(cfx + w.from, r.bustY + w.below)
      const at = (p, d) => new Point(p.x + u.x * d, p.y + u.y * d)
      const ray = new Path().move(at(P0, -1)).line(at(P0, w.len * 3))
      const hit = (curve) => curve.intersects(ray).filter((q) => (q.x - P0.x) * u.x + (q.y - P0.y) * u.y > 0)[0]
      const [I0, I1] = [hit(seam.centre), hit(seam.side)]
      const maxX = Math.min(r.armhole.x, r.waist.x) - (w.clear ?? 0)
      let len = w.len
      if (I0 && I1 && P0.dist(I0) < len) {
        const rest = Math.min(len - P0.dist(I0), (maxX - I1.x) / u.x)
        len = P0.dist(I0) + Math.max(0, rest)
        panels.front.lines = { ...panels.front.lines, [`${id}Welt`]: [P0, I0] }
        if (rest > 0) panels.sideFront.lines = { ...panels.sideFront.lines, [`${id}Welt`]: [I1, at(I1, rest)] }
        welts[id] = { len, front: P0.dist(I0), side: Math.max(0, rest) }
      } else {
        len = Math.min(len, (Math.min(maxX, I0 ? I0.x : Infinity) - P0.x) / u.x)
        panels.front.lines = { ...panels.front.lines, [`${id}Welt`]: [P0, at(P0, len)] }
        welts[id] = { len, front: len, side: 0 }
      }
      Object.assign(welts[id], { welt: w.welt, bag: w.bag })
    }
    store.set('jacket.welts', welts)

    // Back-neck facing: the back neck to `backFacing` down the CB, as wide on the shoulder as
    // the front facing; the lining joins both facings
    if (a.backFacing) {
      const faceW = r.hps.dist(fShoulder)
      const bS = bk.hps.shiftTowards(bk.upper.c, Math.min(faceW, 0.9 * bk.hps.dist(bk.upper.c)))
      const C = new Point(bk.centerNeck.x, bk.centerNeck.y + a.backFacing)
      const edge = new Path().move(bS).curve(bS.shift(-90, a.backFacing * 0.3), C.shift(0, Math.abs(bS.x - C.x) * 0.5), C) // shoulder -> CB
      panels.backNeckFacing = {
        outline: new Path().move(bk.hps.clone()).join(bk.neck.clone()).line(C).join(edge.clone().reverse()).line(bk.hps.clone()),
        fold: true,
      }
      seams.facingShoulder = [bS.dist(bk.hps), fShoulder.dist(r.hps)]
      if (a.lining) {
        // Back lining: below the facing to the hem, with a pleat `liningPleat` wide at the CB fold
        const pleatX = bk.centerNeck.x - a.liningPleat
        const b = backCentre
        const flared = a.cb?.flare
        const cbLining = flared
          ? [new Point(pleatX, bk.centerWaist.y), new Point(b.hemC.x - a.liningPleat, b.hemC.y)]
          : [new Point(pleatX, b.hemC.y)]
        const seamUp = lineTo(new Path().move(bS.clone()).join(edge.clone()).line(new Point(pleatX, C.y)), ...cbLining)
          .line(b.hemCs.clone())
          .line(bk.lower.c.clone())
          .join(b.seam.clone().reverse())
        panels.backLining = {
          outline: (b.fromZ ? seamUp.join(b.fromZ.clone()) : seamUp).line(bS.clone()),
          fold: !flared,
          foldX: pleatX,
        }
        // Front lining: from the facing's inner edge back to the princess seam
        const lowY = r.bustY
        const top = fShoulder
        const fxWaist = ws ? new Point(fx, edgeW.y + (r.lower.c.y - edgeW.y) * ((fx - edgeW.x) / (r.lower.c.x - edgeW.x))) : null
        panels.frontLining = {
          outline: lineTo(
            new Path()
              .move(top.clone())
              .curve(top.shift(-90, (lowY - top.y) * 0.3), new Point(fx, lowY - (lowY - top.y) * 0.5), new Point(fx, lowY)),
            ...(ws ? [fxWaist] : [new Point(fx, hemC.y), hemCs]),
          )
            .line(r.lower.c.clone())
            .join(seam.centre.clone().reverse())
            .line(top.clone()),
          fold: false,
        }
        // The skirt's lining: the skirt from the facing back, without the pleat
        if (ws) {
          const k = lap.skirtLining
          const main = k.skirt(fxWaist, new Point(fx, hemC.y))
          panels.skirtLining = { outline: new Path().move(fxWaist.clone()).line(new Point(fx, hemC.y)).join(main.hem.clone()).line(k.s3.w.clone()).join(main.waist.clone().reverse()), fold: false }
        }
      }
    }
    delete lap.skirtLining
  }

  if (a.kimono) {
    const k = a.kimono
    const side = (key, angle) => {
      const { r, seamLen } = outer[key]
      const t = (angle * Math.PI) / 180
      const d = { x: Math.cos(t), y: Math.sin(t) }
      const top = r.upper.s
      const end = new Point(top.x + d.x * (k.length - r.hps.dist(r.upper.c)), top.y + d.y * (k.length - r.hps.dist(r.upper.c)))
      const len = r.sideAbove.length()
      const U = r.sideAbove.shiftAlong(Math.max(len - k.depth, len * 0.4))
      const [up] = r.sideAbove.split(U)
      // Square to the overarm, toward the body
      const under = (w) => new Point(end.x - d.y * w, end.y + d.x * w)
      return { key, top, end, U, up, under, d, side: up.length() + seamLen }
    }
    const b = side('back', k.angleBack)
    const f = side('front', k.angleFront)
    const diff = (s) => b.under(k.hem * s).dist(b.U) - f.under(k.hem * (1 - s)).dist(f.U)
    let lo = 0.05
    let hi = 0.95
    if (Math.sign(diff(lo)) !== Math.sign(diff(hi))) {
      for (let i = 0; i < 40; i++) {
        const m = (lo + hi) / 2
        if (Math.sign(diff(m)) === Math.sign(diff(lo))) lo = m
        else hi = m
      }
    } else lo = hi = Math.abs(diff(lo)) < Math.abs(diff(hi)) ? lo : hi
    const share = (lo + hi) / 2
    const build = (o, w) => {
      const wrist = o.under(w)
      const outline = outer[o.key].body().join(o.up).line(wrist).line(o.end).line(o.top.clone())
      panels[o.key === 'back' ? 'sideBack' : 'sideFront'].outline = outline
      Object.assign(panels[o.key === 'back' ? 'sideBack' : 'sideFront'].marks, { underarm: o.U, wristUnder: wrist, wristOver: o.end, armhole: undefined, shoulder: undefined })
      delete panels[o.key === 'back' ? 'sideBack' : 'sideFront'].marks.armhole
      delete panels[o.key === 'back' ? 'sideBack' : 'sideFront'].marks.shoulder
      return { over: o.top.dist(o.end), under: o.U.dist(wrist), hem: w }
    }
    const kb = build(b, k.hem * share)
    const kf = build(f, k.hem * (1 - share))
    seams.sideBack = b.side
    seams.sideFront = f.side
    store.set('jacket.kimono', { back: kb, front: kf, share, toWrist: [outer.back.r.hps.dist(outer.back.r.upper.c) + kb.over, outer.front.r.hps.dist(outer.front.r.upper.c) + kf.over] })
  }

  store.set('jacket.panels', panels)
  store.set('jacket.seams', seams)
  store.set('jacket.front', lap)
  store.set('jacket.flare', e)
  store.set('coat.jacketNeck', { back: bk.neck.length(), front: a.closed ? fr.neck.length() + lap.neckExt : lap.neckToG.length() })
  // FreeSewing's two-part sleeve reads the armhole it must fit from these
  const armhole = { back: bk.scye.length(), front: fr.scye.length() }
  store.set('jacket.armhole', armhole)
  for (const prefix of a.sleeveStore ?? []) {
    store.set(`${prefix}.backArmholeLength`, armhole.back)
    store.set(`${prefix}.frontArmholeLength`, armhole.front)
  }
  return sh.part
}

/**
 * A box body (Mitchell's box coat): Breanna's back and front above the armhole, a side seam
 * straight from each armhole that flares out to the hem, no waist shaping. The front's bust
 * dart is pivoted about the bust point from the waist into the front neck, `dartWidth` wide
 * there, at `dartAt` along the neck from the neck point, its tip `dartLength` of the way to the
 * bust point. The gorge is at the dart's CF leg. Lengths in mm:
 * { seat: seat girth with ease, hipDepth, length: waist to hem, flare: the side seam's lean at
 *   the seat line (at least), cbOut: the CB's lean at the seat line (0: cut on the fold), lap,
 *   breakBelow, rollOut, lapelWidth, peak, facing, dartWidth, dartAt, dartLength,
 *   buttonInset (0-1 of the lap in from the front edge; 1, on CF, if not given), rows (as the
 *   princess layout's),
 *   pockets: { <id>: { below (mouth below the waist), from (behind CF), w, flap, bag, clear } },
 *   patch: { <id>: { x (behind CF), y (below the waist; negative above), w, h, shape, topHem,
 *   flap: { h, gap } } }, sleeveStore }. Set-in flap pockets go to the store as
 *   `jacket.pockets`; patch pockets as `coat.pockets` (for pocketPart and flapPart), each
 *   narrowed to keep clear of the armhole and side seam, and shortened to keep above the hem.
 */
export function draftBoxLayout(sh, a) {
  const { Path, Point, store } = sh
  const bk = store.get('jacket.raw.back')
  const fr = store.get('jacket.raw.front')
  const panels = {}
  const seams = {}

  // ---- the front's dart, pivoted from the waist into the neck ----
  const { c: D1, tip: T, s: D2 } = fr.lower
  // Turn the side about the bust point just enough to open the neck dart `dartWidth` wide, in
  // the direction that closes the waist dart. (Breanna's waist dart also takes in the waist,
  // which a box body doesn't; the rest of it isn't sewn.)
  const Q = fr.neck.shiftAlong(fr.neck.length() * a.dartAt)
  const r = Q.dist(T)
  let turn = (2 * Math.asin(Math.min(1, a.dartWidth / (2 * r))) * 180) / Math.PI
  if (D2.rotate(turn, T).dist(D1) > D2.rotate(-turn, T).dist(D1)) turn = -turn
  const rot = (p) => p.rotate(turn, T)
  const rotPath = (path) => mapPath(path, Path, rot)
  const [neckToQ] = fr.neck.split(Q)
  const hps = rot(fr.hps)
  const shoulder = rot(fr.shoulder)
  const armF = rot(fr.armhole)
  const scyeF = rotPath(fr.scye)
  const neckF = rotPath(neckToQ) // neck point -> the dart's side leg
  const Qs = rot(Q)
  const mouth = Q.shiftFractionTowards(Qs, 0.5)
  const tip = mouth.shiftFractionTowards(T, a.dartLength)

  // ---- centre back: straight from the neck, out by cbOut at the seat line (a CB seam) ----
  const cbx = bk.centerWaist.x
  const seatY = bk.centerWaist.y + a.hipDepth
  const cbOut = a.cbOut ?? 0
  const cbAt = (y) => cbx - (cbOut * (y - bk.centerNeck.y)) / (seatY - bk.centerNeck.y)

  // ---- side seams: from each armhole, out by e at the seat line, on to the hem ----
  const cfx = fr.centerWaist.x
  const armB = bk.armhole
  const drop = seatY - armB.y // armhole to seat line (the back's)
  const widths = armB.x - cbx + cbOut + (armF.x - cfx)
  const e = Math.max(a.flare, (a.seat / 2 - widths) / 2)
  const down = bk.centerWaist.y + a.length - armB.y // armhole to hem (the back's)
  const toHem = (p) => new Point(p.x + (e * down) / drop, p.y + down)
  const hemB = toHem(armB)
  const hemF = toHem(armF)

  // ---- back ----
  const cbHem = new Point(cbAt(bk.centerWaist.y + a.length), bk.centerWaist.y + a.length)
  // The hem leaves a slanted CB square to it (so the two backs meet without a point there),
  // and curves on to the side seam's hem
  const hem = new Path().move(cbHem)
  if (cbOut < 1e-6) hem.line(hemB)
  else {
    const L = bk.centerNeck.dist(cbHem)
    const sq = { x: (cbHem.y - bk.centerNeck.y) / L, y: (bk.centerNeck.x - cbHem.x) / L } // toward the side
    const k = cbHem.dist(hemB) / 3
    hem.curve(new Point(cbHem.x + sq.x * k, cbHem.y + sq.y * k), hemB.shiftFractionTowards(cbHem, 1 / 3), hemB)
  }
  panels.back = {
    outline: new Path().move(bk.hps.clone()).join(bk.neck.clone()).line(cbHem).join(hem).line(armB.clone()).join(bk.scye.clone()).line(bk.hps.clone()),
    fold: cbOut < 1e-6,
    marks: { hps: bk.hps, cbNeck: bk.centerNeck, cbHem, hemSide: hemB, armhole: armB, shoulder: bk.shoulder },
  }

  // ---- front ----
  const edgeX = cfx - a.lap
  const hemC = new Point(edgeX, fr.centerWaist.y + a.length)
  const { B, R, N, P, lapelEdge } = jacketLapel(Path, Point, { hps, bustY: fr.bustY, edgeX, G: Q }, a)
  panels.front = {
    outline: new Path()
      .move(hps.clone())
      .join(neckF.clone())
      .line(tip)
      .line(Q.clone())
      .line(N)
      .line(P)
      .join(lapelEdge.clone())
      .line(hemC)
      .line(hemF)
      .line(armF.clone())
      .join(scyeF.clone())
      .line(hps.clone()),
    fold: false,
    marks: {
      hps,
      dartSide: Qs,
      dartTip: tip,
      gorge: Q,
      notch: N,
      lapelPoint: P,
      break: B,
      hemEdge: hemC,
      hemSide: hemF,
      armhole: armF,
      shoulder,
      cfLine: fr.centerWaist, // on CF, at the waist (not an outline corner)
    },
  }

  // Facing: the front edge strip, lapel included, up to the shoulder; the dart closed across
  const fx = cfx + a.facing - a.lap
  const fShoulder = hps.shiftFractionTowards(shoulder, 0.3)
  panels.facing = {
    outline: new Path()
      .move(hps.clone())
      .join(neckF.clone())
      .line(Q.clone())
      .line(N)
      .line(P)
      .join(lapelEdge.clone())
      .line(hemC)
      .line(new Point(fx, hemC.y))
      .line(new Point(fx, fr.bustY))
      .curve(new Point(fx, fr.bustY - (fr.bustY - fShoulder.y) * 0.5), fShoulder.shift(-90, (fr.bustY - fShoulder.y) * 0.3), fShoulder)
      .line(hps.clone()),
    fold: false,
  }

  // ---- set-in flap pockets, from CF ----
  const sideAt = (y) => armF.x + ((hemF.x - armF.x) * (y - armF.y)) / (hemF.y - armF.y)
  const pockets = layoutPockets(a.pockets, { baseY: fr.centerWaist.y, startAt: () => cfx, sideAt, hemY: hemC.y })
  panels.front.pockets = pockets

  // ---- patch pockets, from CF and the waist ----
  if (a.patch) {
    const patch = {}
    for (const [id, q] of Object.entries(a.patch)) {
      const x = cfx + q.x
      const y = fr.centerWaist.y + q.y
      const clear = q.clear ?? 10
      const h = Math.min(q.h, hemC.y - clear - y)
      // The side seam below the armhole, the armhole above it
      const edgeAt = (yy) => (yy >= armF.y ? sideAt(yy) : Math.min(...scyeF.intersectsY(yy).map((pt) => pt.x), armF.x))
      const side = Math.min(edgeAt(y), edgeAt(y + h))
      const w = Math.min(q.w, side - clear - x)
      patch[id] = { ...q, x, y, w, h }
    }
    panels.front.patch = patch
    store.set('coat.pockets', patch)
  }

  // Buttons: holes `buttonInset` of the lap in from the front edge; each button under its hole
  // when the fronts lap (as far behind CF as the hole is in front of it)
  const inset = a.buttonInset ?? 1
  const holeX = edgeX + a.lap * inset

  seams.sideBack = armB.dist(hemB)
  seams.sideFront = armF.dist(hemF)
  seams.shoulderBack = bk.hps.dist(bk.shoulder)
  seams.shoulderFront = hps.dist(shoulder)
  seams.dart = [Qs.dist(tip), Q.dist(tip)]
  store.set('jacket.panels', panels)
  store.set('jacket.seams', seams)
  store.set('jacket.pockets', pockets)
  store.set('jacket.front', {
    lap: a.lap,
    cfx,
    edgeX,
    B,
    R,
    G: Q,
    N,
    P,
    hemC,
    lapelEdge,
    hemY: hemC.y,
    waistY: fr.centerWaist.y,
    ...(inset < 1 ? { holeX, buttonX: 2 * cfx - holeX } : {}),
    ...(a.rows ? { rows: a.rows } : {}),
    facingX: fx,
  })
  store.set('jacket.flare', e)
  store.set('coat.jacketNeck', { back: bk.neck.length(), front: neckF.length() })
  const armhole = { back: bk.scye.length(), front: scyeF.length() }
  store.set('jacket.armhole', armhole)
  for (const prefix of a.sleeveStore ?? []) {
    store.set(`${prefix}.backArmholeLength`, armhole.back)
    store.set(`${prefix}.frontArmholeLength`, armhole.front)
  }
  return sh.part
}

/**
 * Set-in flap pockets. Each p: { below (the mouth's front end below baseY), from (behind
 * startAt(y), the panel edge it's measured from), w (mouth; or share, of the panel's width
 * there), angle (degrees, dropping toward
 * the side; 0 if not given), flap, bag, clear }. The mouth is shortened to stay `clear` of
 * sideAt(y) (the side seam's x at y) below the flap, the bag to stay `clear` above the hem.
 * Returns { <id>: { x, y (front end), w, angle, ex, ey (back end), flap, bag, side } }.
 */
function layoutPockets(spec, { baseY, startAt, sideAt, hemY }) {
  const out = {}
  for (let [id, p] of Object.entries(spec ?? {})) {
    const clear = p.clear ?? 0
    const angle = p.angle ?? 0
    const [c, s] = [Math.cos((angle * Math.PI) / 180), Math.sin((angle * Math.PI) / 180)]
    const y = baseY + p.below
    const x = startAt(y) + p.from
    // `share` instead of `w`: the mouth as a share of the panel's width at the mouth
    // and `flapRatio` / `bagRatio` instead of `flap` / `bag`: depths as shares of the mouth
    let w = p.share === undefined ? p.w : p.share * (sideAt(y) - startAt(y))
    p = { ...p, w, flap: p.flapRatio === undefined ? p.flap : p.flapRatio * w, bag: p.bagRatio === undefined ? p.bag : p.bagRatio * w }
    // The back end, a flap below the mouth, must clear the side seam there (twice: the end moves)
    for (let i = 0; i < 2; i++) w = Math.min(p.w, (sideAt(y + w * s + p.flap) - clear - x) / c)
    const [ex, ey] = [x + w * c, y + w * s]
    const bag = Math.min(p.bag, hemY - clear - Math.max(y, ey))
    out[id] = { x, y, w, angle, ex, ey, flap: p.flap, bag, side: sideAt(ey + p.flap) }
  }
  return out
}

/**
 * The jacket's lapel (lib/lapel.mjs) on a front whose edge (the lap) runs down x = edgeX: the
 * break B `breakBelow` under the bust line on the edge, the crease through R, `rollOut` in
 * front of the neck point. Returns { B, R, N, P, lapelEdge (P -> B) }.
 */
function jacketLapel(Path, Point, { hps, bustY, edgeX, G }, a) {
  const B = new Point(edgeX, bustY + a.breakBelow)
  const R = hps.shift(180, a.rollOut)
  return { B, R, ...lapelLines(Path, Point, { B, R, G }, a) }
}

/** Close a side panel: after the side seam, up the armhole to the shoulder, along to `end` */
function closeOver(path, scye, shoulder, end) {
  return path.join(scye.clone()).line(end.clone())
}


/** Copy of a path (a stored one, or one moved rigidly), every point mapped through f */
function mapPath(path, Path, f = (p) => p.clone()) {
  let out = new Path()
  for (const op of path.ops) {
    if (op.type === 'move') out = out.move(f(op.to))
    else if (op.type === 'line') out = out.line(f(op.to))
    else if (op.type === 'curve') out = out.curve(f(op.cp1), f(op.cp2), f(op.to))
  }
  return out
}

/** The buttons' heights on a jacket front (store `jacket.front`): `n` from the break (or `buttonTop`) to below the waist */
function buttonHeights(f, n) {
  const bottom = f.buttonBottom ?? f.waistY + (f.hemY - f.waistY) * 0.3
  const top = f.buttonTop ?? f.B.y
  return Array.from({ length: n }, (_, i) => (n > 1 ? top + ((bottom - top) * i) / (n - 1) : top))
}

/**
 * A fly (a fly front's hidden button strip), sewn behind the right front's facing: `width(sh)`
 * x the lap wide from the front edge, from half the lap above the top button to half the lap
 * below the last; cut 2 (the fly and its facing), the buttonholes on the CF line.
 */
export function flyPart({ name, after, nr, label = 'fly', width = () => 1.5, enabled = () => true }) {
  return {
    name,
    after,
    draft: (sh) => {
      const { paths, Path, Point, points, store, sa, macro, snippets, Snippet, options, part } = sh
      if (!enabled(options)) return part.hide()
      const f = store.get('jacket.front')
      const lap = Math.abs(f.cfx - f.B.x)
      const ys = buttonHeights(f, options.buttons)
      const top = ys[0] - lap / 2
      const h = ys[ys.length - 1] + lap / 2 - top
      const w = lap * width(sh)
      points.topEdge = new Point(0, 0)
      points.bottomEdge = new Point(0, h)
      paths.seam = new Path().move(new Point(w, 0)).line(points.topEdge).line(points.bottomEdge).line(new Point(w, h)).close().addClass('fabric')
      if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
      paths.cf = new Path().move(new Point(lap, 0)).line(new Point(lap, h)).addClass('help dashed')
      for (const [i, y] of ys.entries()) snippets[`buttonhole${i}`] = new Snippet('buttonhole', new Point(lap, y - top)).attr('data-rotate', 90)
      store.set('jacket.fly', { w, h, top })
      macro('grainline', { from: new Point(w * 0.45, h - 20), to: new Point(w * 0.45, 20) })
      store.cutlist.setCut([
        { cut: 2, from: 'fabric' },
        { cut: 1, from: 'interfacing' },
      ])
      title(macro, { at: new Point(w * 0.2, h * 0.3), nr, title: label, scale: 0.3, rotation: 90 })
      return part
    },
  }
}

/** One jacket panel from the store (`jacket.panels.<panel>`) */
export function jacketPanelPart({ name, after, panel, nr, label, cut = 2, buttons = false, material = 'fabric', lining = false, enabled = () => true }) {
  return {
    name,
    after,
    draft: ({ paths, Path, Point, points, store, sa, macro, snippets, Snippet, options, part }) => {
      const p = store.get('jacket.panels')[panel]
      if (!p || !enabled(options)) return part.hide()
      const outline = mapPath(p.outline, Path)
      // The panel's corners and seam ends, by name (for notches and the drape export)
      for (const [k, q] of Object.entries(p.marks ?? {})) points[k] = q.clone()
      paths.seam = outline.clone().close().addClass('fabric')
      if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
      const bb = paths.seam.bbox()
      // Cut from `material`; when `lining(options)`, again from lining
      const cuts = (c) => [{ ...c, from: material }, ...(lining && lining(options) ? [{ ...c, from: 'lining' }] : [])]
      if (p.fold) {
        const fx = p.foldX ?? 0
        const top = new Point(fx, bb.topLeft.y + 10)
        macro('cutonfold', { from: new Point(fx, bb.bottomRight.y - 10), to: top, grainline: true })
        store.cutlist.setCut(cuts({ cut: 1, onFold: true }))
      } else {
        const x = (bb.topLeft.x + bb.bottomRight.x) / 2
        macro('grainline', { from: new Point(x, bb.bottomRight.y - 40), to: new Point(x, bb.topLeft.y + 60) })
        store.cutlist.setCut(cuts({ cut }))
      }
      points.titleAt = new Point((bb.topLeft.x + bb.bottomRight.x) / 2, bb.topLeft.y + (bb.bottomRight.y - bb.topLeft.y) * 0.45)
      title(macro, { at: points.titleAt, nr, title: label, scale: 0.5 })
      if (buttons) {
        // Buttons from the break to below the waist: on CF, or (with holeX) a buttonhole near
        // the front edge and its button behind CF; double-breasted (rows), a button either side
        // of CF and a buttonhole on the outer one; the crease marked
        const f = store.get('jacket.front')
        const ys = buttonHeights(f, options.buttons)
        for (const [i, y] of ys.entries()) {
          if (f.rows) {
            snippets[`button${i}_0`] = new Snippet('button', new Point(f.cfx - f.rows, y))
            snippets[`button${i}_1`] = new Snippet('button', new Point(f.cfx + f.rows, y))
            snippets[`buttonhole${i}`] = new Snippet('buttonhole', new Point(f.cfx - f.rows, y)).attr('data-rotate', 90)
            continue
          }
          snippets[`button${i}`] = new Snippet('button', new Point(f.buttonX ?? f.cfx, y))
          if (f.holeX !== undefined) {
            snippets[`buttonhole${i}`] = new Snippet('buttonhole', new Point(f.holeX, y)).attr('data-rotate', 90)
          }
        }
        if (!f.closed) paths.crease = new Path().move(f.B.clone()).line(f.R.clone()).addClass('help dotted')
        paths.cf = new Path().move(new Point(f.cfx, f.B.y)).line(new Point(f.cfx, f.cfEnd ?? f.hemY)).addClass('help dashed')
      }
      // Set-in flap pockets: the mouth, and the flap hanging from it, square to the mouth
      for (const [id, q] of Object.entries(p.pockets ?? {})) {
        const [a, b] = [new Point(q.x, q.y), new Point(q.ex ?? q.x + q.w, q.ey ?? q.y)]
        const down = (pt) => pt.shift(-(q.angle ?? 0) - 90, q.flap) // FreeSewing angles run anticlockwise, y up
        paths[`${id}Mouth`] = new Path().move(a).line(b).addClass('mark')
        paths[`${id}Flap`] = new Path().move(a).line(down(a)).line(down(b)).line(b).addClass('mark dotted')
      }
      // Patch pockets (and their flaps), marked where they're sewn
      for (const [id, q] of Object.entries(p.patch ?? {})) {
        paths[`${id}Pocket`] = pocketPath(Path, Point, q.x, q.y, q).addClass('mark dashed')
        if (q.flap) {
          const f = flapSpec(q)
          paths[`${id}PocketFlap`] = pocketPath(Path, Point, q.x - (f.w - q.w) / 2, q.y - q.flap.gap, f).addClass('mark dotted')
        }
      }
      // Welt pocket mouths (a mouth crossing a seam is marked on each panel it crosses)
      for (const [id, [a, b]] of Object.entries(p.lines ?? {})) {
        paths[id] = new Path().move(a.clone()).line(b.clone()).addClass('mark')
      }
      return part
    },
  }
}
