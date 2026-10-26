// Shared drafting for the PublicSewing coats built on FreeSewing's Brian block (chore coat,
// mackinaw, hunting coat). Parts call these from their own draft functions; everything they
// need to agree on goes through the store under `coat.*`.
import { hidePresets } from '@freesewing/core'
import { sleeve as librarySleeve } from '@freesewing/library'

export const BRAND = 'PublicSewing'

/**
 * Body options every Brian-based coat carries (add them to the back part's options; a design
 * overrides a default by redefining the option).
 */
export const bodyOptions = {
  stoutDrop: { pct: 8.3, min: 4, max: 15, menu: 'advanced' }, // regular waist = chest less this
  waistShaping: { bool: false, menu: 'fit' }, // take the side seam in at the waist
  waistEase: { pct: 12, min: 0, max: 40, menu: 'fit' }, // with waistShaping
  hemFlare: { pct: 0, min: 0, max: 30, menu: 'style' }, // x seat, at each side seam
}
export const bodyMeasurements = ['seat', 'waist', 'waistToSeat']

/** Title macro with our brand instead of FreeSewing's */
export const title = (macro, config) => macro('title', { brand: BRAND, ...config })

/** Remove what an inherited part drew, except the paths named in `keep` */
export function cleanup({ paths, snippets, macro }, keep = []) {
  for (const p in paths) if (!keep.includes(p)) delete paths[p]
  for (const s in snippets) delete snippets[s]
  macro('rmcutonfold')
  macro('rmtitle')
  macro('rmgrainline')
}

/**
 * Simons' "fat" (Diagram VI, Stout Sack Coat): how far the waist exceeds a regular waist for
 * that breast (breast less 3" at 40, i.e. `stoutDrop` 8.3% of chest). Half of it goes into
 * the half-body draft: 2/3 at the front of the waist, 1/3 split between the side seams.
 */
export const stoutFat = ({ measurements, options }) =>
  Math.max(0, measurements.waist - measurements.chest * (1 - options.stoutDrop))

/**
 * Hem, seat and side seam for a Brian back ('cb') or front ('cf'). The side seam runs
 * armhole -> waist -> seat -> hem:
 * - boxy (straight) unless `waistShaping` (then taken in at the waist to `waistEase`);
 * - let out over the seat when the seat needs it (`seatEase`), and at the waist and below by
 *   the stout share of fat;
 * - flared at the hem by `hemFlare` (x seat) if the design has it.
 */
export function coatBody(sh, c) {
  const { points, Point, measurements, options } = sh
  const waistY = points[`${c}Waist`].y
  points[`${c}Seat`] = new Point(0, waistY + measurements.waistToSeat)
  points[`${c}Hem`] = new Point(0, waistY + measurements.waistToSeat * options.lengthBelowWaist)
  const fatSide = stoutFat(sh) / 12 // a quarter of the half-body's third, per piece
  const x = Math.max(points.armhole.x, (measurements.seat * (1 + options.seatEase)) / 4) + fatSide
  points.seat = new Point(x, points[`${c}Seat`].y)
  // Straight from the armhole to the seat, unless shaped at the waist
  const straight = points.armhole.x + ((x - points.armhole.x) * (waistY - points.armhole.y)) / (points.seat.y - points.armhole.y)
  let wx = straight + fatSide * ((waistY - points.armhole.y) / (points.seat.y - points.armhole.y))
  if (options.waistShaping) {
    wx = Math.min(wx, Math.max((measurements.waist * (1 + options.waistEase)) / 4 + fatSide, x * 0.8))
  }
  points.sideWaist = new Point(wx, waistY)
  points.hem = new Point(x + measurements.seat * options.hemFlare, points[`${c}Hem`].y)
  // A short garment (hem above the seat line): the side seam stops at the hem
  if (points.hem.y <= points.seat.y + 0.5) {
    const t = (points.hem.y - waistY) / (points.seat.y - waistY)
    points.hem = new Point(wx + (x - wx) * Math.max(0, t), points.hem.y)
    points.seat = points.hem.clone()
  }
}

/** Point on the side seam at height y (between the armhole and the hem) */
export function sideAt(points, Point, y) {
  const run = [points.armhole, points.sideWaist, points.seat, points.hem].filter((p, i, all) => i === 0 || p.y > all[i - 1].y + 0.01)
  for (let i = 0; i < run.length - 1; i++) {
    const [a, b] = [run[i], run[i + 1]]
    if (y <= b.y || i === run.length - 2) return new Point(a.x + ((b.x - a.x) * (y - a.y)) / (b.y - a.y), y)
  }
}

/** Side seam from the hem up to the armhole */
export const sidePath = (points, Path) => {
  const p = new Path().move(points.hem)
  if (points.seat.y < points.hem.y - 0.01) p.line(points.seat)
  return p.line(points.sideWaist).line(points.armhole)
}

/** Sewing length of the side seam, armhole to hem */
export const sideSeamLength = (points) =>
  points.armhole.dist(points.sideWaist) + points.sideWaist.dist(points.seat) + points.seat.dist(points.hem)

/** Armhole from the side seam up to the shoulder (Brian's curve) */
export const armhole = (points, Path, half) =>
  new Path()
    .move(points.armhole)
    .curve(points.armholeCp2, points.armholeHollowCp1, points.armholeHollow)
    .curve(points.armholeHollowCp2, points.armholePitchCp1, points.armholePitch)
    .join(half)

/** Seam allowance: hemBase gets 3 x sa, saBase gets sa, closing to `from`..`to` */
function allowance(paths, Path, sa, ends) {
  const hem = paths.hemBase.offset(sa * 3)
  const rest = paths.saBase.offset(sa)
  let p = ends ? new Path().move(ends[0]).line(hem.start()) : new Path().move(hem.start())
  p = p.join(hem).line(rest.start()).join(rest)
  return ends ? p.line(ends[1]) : p
}

/** The back: Brian's back, boxy, on the fold, hem `lengthBelowWaist` below the waist */
export function draftCoatBack(sh, { nr = 2 } = {}) {
  const { points, paths, Path, Point, store, sa, macro, snippets, Snippet, part } = sh
  cleanup(sh, ['backArmhole', 'backCollar'])
  coatBody(sh, 'cb')

  paths.hemBase = new Path().move(points.cbHem).line(points.hem).hide()
  paths.saBase = sidePath(points, Path)
    .join(armhole(points, Path, paths.backArmhole))
    .line(points.s3CollarSplit)
    .join(paths.backCollar)
    .hide()
  paths.seam = new Path()
    .move(points.cbNeck)
    .line(points.cbHem)
    .join(paths.hemBase)
    .join(paths.saBase)
    .close()
    .addClass('fabric')
  if (sa) paths.sa = allowance(paths, Path, sa, [points.cbHem, points.cbNeck]).addClass('fabric sa')

  store.set('coat.back', {
    side: sideSeamLength(points),
    shoulder: points.s3CollarSplit.dist(points.s3ArmholeSplit),
    neck: paths.backCollar.length(),
    waist: sideAt(points, Point, points.cbWaist.y).x,
  })

  macro('cutonfold', { from: points.cbNeck, to: points.cbHem, grainline: true })
  store.cutlist.setCut({ cut: 1, from: 'fabric', onFold: true })
  points.title = new Point(points.armhole.x / 2, points.armhole.y)
  title(macro, { at: points.title, nr, title: 'back' })
  snippets.armholePitch = new Snippet('bnotch', points.armholePitch)
  snippets.waist = new Snippet('notch', sideAt(points, Point, points.cbWaist.y))
  // The sleeve's title (FreeSewing's sleeve part reads it from here)
  store.set('library.sleeve.title', { nr: 3, brand: BRAND })
  return part
}

/**
 * The front: Brian's front with a button stand `ext` past CF, a front corner rounded to
 * radius `r`, and a hem that drops `drop` toward the front edge (0 for a level hem).
 * - Stout figures: the front share of the fat (Simons, Diagram VI) moves the front edge, CF
 *   and buttons forward from the chest line to the waist and below, and lengthens the front
 *   (his under-arm "vee" opened).
 * - `straightHem`: a dropped front hem runs straight to the side seam (a waistcoat point).
 * - `neckY`: a V neck. The neckline runs straight-ish from the shoulder to the front edge at
 *   that height (no collar, or a shawl collar built on it), instead of Brian's round neck.
 */
export function draftCoatFront(sh, { ext, r, drop = 0, facing, nr = 1, neckY, straightHem = false }) {
  const { points, paths, Path, Point, store, sa, macro, snippets, Snippet, part } = sh
  cleanup(sh, ['frontArmhole', 'frontCollar'])
  coatBody(sh, 'cf')

  const fat = stoutFat(sh)
  const f = fat / 3 // half the fat, two thirds of it at the front
  drop += fat / 6
  const chestY = points.armhole.y
  const waistY = points.cfWaist.y
  store.set('coat.frontShift', { f, chestY, waistY })
  r = Math.min(r, facing * 0.9)
  store.set('coat.frontEdge', { ext, facing, r, drop, f, vNeck: neckY !== undefined })
  const top = neckY ?? points.cfNeck.y
  points.edgeNeck = new Point(-ext, top)
  points.edgeHem = new Point(-ext - f, points.cfHem.y + drop)
  points.cornerTop = points.edgeHem.shift(90, r)
  points.cornerEnd = points.edgeHem.shift(0, r)
  points.cornerTopCp = points.cornerTop.shiftFractionTowards(points.edgeHem, 0.55)
  points.cornerEndCp = points.cornerEnd.shiftFractionTowards(points.edgeHem, 0.55)

  paths.edge = new Path().move(points.edgeNeck)
  if (f > 0.5) {
    // Bow out over the stomach: straight to the chest line, then out to the waist
    points.edgeChest = new Point(-ext, Math.max(chestY, top + 1))
    points.edgeWaist = new Point(-ext - f, Math.max(waistY, points.edgeChest.y + 1))
    const k = (points.edgeWaist.y - points.edgeChest.y) / 2
    if (points.edgeChest.y > top + 1) paths.edge = paths.edge.line(points.edgeChest)
    paths.edge = paths.edge.curve(points.edgeChest.shift(-90, k), points.edgeWaist.shift(90, k), points.edgeWaist)
  }
  paths.edge = paths.edge.line(points.cornerTop)
  if (r > 0) paths.edge = paths.edge.curve(points.cornerTopCp, points.cornerEndCp, points.cornerEnd)
  paths.edge.hide()
  if (drop > 0 && straightHem) {
    // A waistcoat point: straight from the front edge up to the side seam
    paths.hemBase = new Path().move(points.cornerEnd).line(points.hem)
  } else if (drop > 0) {
    // Level at the side seam, sweeping down to the front
    const d = points.cornerEnd.dx(points.hem)
    points.hemCp1 = points.cornerEnd.shift(0, d * 0.4)
    points.hemCp2 = points.hem.shift(180, d * 0.4)
    paths.hemBase = new Path().move(points.cornerEnd).curve(points.hemCp1, points.hemCp2, points.hem)
  } else paths.hemBase = new Path().move(points.cornerEnd).line(points.hem)
  paths.hemBase.hide()

  // Neckline, from the front edge to the shoulder
  if (neckY !== undefined) {
    const d = points.s3CollarSplit.dist(points.edgeNeck)
    paths.neckline = new Path()
      .move(points.edgeNeck)
      .curve(points.edgeNeck.shiftFractionTowards(points.s3CollarSplit, 0.35), points.s3CollarSplit.shift(-90, d * 0.25), points.s3CollarSplit)
      .hide()
  } else {
    paths.neckline = new Path().move(points.edgeNeck).line(points.cfNeck).join(paths.frontCollar.reverse()).hide()
  }
  paths.bodyBase = sidePath(points, Path)
    .join(armhole(points, Path, paths.frontArmhole))
    .line(points.s3CollarSplit)
    .hide()
  paths.saBase = paths.bodyBase.clone().join(paths.neckline.reverse()).hide()
  paths.seam = paths.edge.join(paths.hemBase).join(paths.saBase).close().addClass('fabric')
  if (sa) {
    const edge = paths.edge.offset(sa)
    const rest = allowance(paths, Path, sa)
    paths.sa = edge.line(rest.start()).join(rest).line(edge.start()).addClass('fabric sa')
  }
  paths.cf = new Path().move(new Point(0, top)).line(new Point(0, chestY))
  if (f > 0.5) paths.cf = paths.cf.line(new Point(-f, waistY))
  paths.cf = paths.cf.line(new Point(-f, points.cfHem.y)).addClass('help dashed')

  store.set('coat.front', {
    side: sideSeamLength(points),
    shoulder: points.s3CollarSplit.dist(points.s3ArmholeSplit),
    neck: neckY === undefined ? paths.frontCollar.length() : paths.neckline.length(),
    neckline: paths.neckline.length(),
    edge: points.edgeNeck.dist(points.cornerTop),
    waist: sideAt(points, Point, points.cfWaist.y).x,
  })

  macro('grainline', {
    from: points.cfHem.shift(90, r + 20).shift(0, points.armhole.x * 0.2),
    to: new Point(0, Math.max(top, points.cfNeck.y)).shift(-90, 20).shift(0, points.armhole.x * 0.2),
  })
  store.cutlist.setCut({ cut: 2, from: 'fabric' })
  points.title = new Point(points.armhole.x / 2, points.cfWaist.y)
  title(macro, { at: points.title, nr, title: 'front' })
  snippets.armholePitch = new Snippet('notch', points.armholePitch)
  snippets.waist = new Snippet('notch', sideAt(points, Point, points.cfWaist.y))
  if (neckY === undefined) snippets.cfNeck = new Snippet('notch', points.cfNeck)
  snippets.cfHem = new Snippet('notch', new Point(-f, points.cfHem.y))
  return part
}

/** How far a stout front's CF has moved forward at height y */
export function frontShift(store, y) {
  const s = store.get('coat.frontShift', null)
  if (!s || s.f <= 0.5) return 0
  if (y <= s.chestY) return 0
  if (y >= s.waistY) return s.f
  return (s.f * (y - s.chestY)) / (s.waistY - s.chestY)
}

/**
 * A shawl collar cut in one with the front (Simons, Diagrams XVII, XVIII, XXIII), on a front
 * drafted with a V neck (`neckY` = the break, where the lapel starts to turn back):
 * - the roll line runs from the break through a point `stand` beyond the neck point;
 * - the collar's neck edge leaves the neck point parallel to the roll line, as long as the
 *   back neck it sews to; at its end the CB seam squares out `width` toward the front;
 * - the outer edge sweeps from there through the lapel's widest point (`lapel` from the roll
 *   line) down into the front edge at the break.
 * Call after draftCoatFront; it replaces the front's seam.
 */
export function draftShawl(sh, { stand, width, lapel }) {
  const { points, paths, Path, Point, store, sa, utils } = sh
  const hps = points.s3CollarSplit
  const B = points.edgeNeck
  points.rollPoint = hps.shiftTowards(points.s3ArmholeSplit, -stand)
  const len = B.dist(points.rollPoint)
  const u = { x: (points.rollPoint.x - B.x) / len, y: (points.rollPoint.y - B.y) / len }
  // Perpendicular to the roll line, toward the front edge
  const perp = -u.y < 0 ? { x: -u.y, y: u.x } : { x: u.y, y: -u.x }
  const along = (p, k) => new Point(p.x + u.x * k, p.y + u.y * k)
  const across = (p, k) => new Point(p.x + perp.x * k, p.y + perp.y * k)

  // Back neck length (Brian's back neck curve, recomputed here on the front)
  const cp = utils.beamIntersectsY(points.neck, points._tmp4, points.cbNeck.y)
  const backNeck = new Path().move(points.hps).curve_(cp, points.cbNeck).length()
  points.shawlCbNeck = along(hps, backNeck)
  points.shawlCbOuter = across(points.shawlCbNeck, width)
  points.lapelPoint = across(B.shiftFractionTowards(points.rollPoint, 0.45), lapel)
  const k1 = B.dist(points.lapelPoint) * 0.35
  const k2 = points.lapelPoint.dist(points.shawlCbOuter) * 0.35
  paths.shawl = new Path()
    .move(B)
    .curve(B.shift(90, k1), along(points.lapelPoint, -k1), points.lapelPoint)
    .curve(along(points.lapelPoint, k2), along(points.shawlCbOuter, -k2), points.shawlCbOuter)
    .line(points.shawlCbNeck)
    .line(hps)
    .hide()
  paths.roll = new Path().move(B).line(along(B, len + backNeck * 0.5)).addClass('help dotted')

  paths.saBase = paths.bodyBase.clone().join(paths.shawl.reverse()).hide()
  paths.seam = paths.edge.join(paths.hemBase).join(paths.saBase).close().unhide().addClass('fabric')
  if (sa) {
    const edge = paths.edge.offset(sa)
    const rest = allowance(paths, Path, sa)
    paths.sa = edge.line(rest.start()).join(rest).line(edge.start()).addClass('fabric sa')
  }
  // The collar's neck edge sews to the back neck
  store.set('coat.collar', { neck: points.shawlCbNeck.dist(hps), target: backNeck, shawl: true })
}

/** Buttons in one or two rows (x offsets from CF), evenly spaced from `top` to `bottom` */
export function placeButtons({ points, Point, snippets, Snippet, store }, { count, top, bottom, rows }) {
  for (let i = 0; i < count; i++) {
    const y = count > 1 ? top + ((bottom - top) * i) / (count - 1) : top
    rows.forEach((x, k) => {
      const id = `button${k}_${i}`
      points[id] = new Point(x - frontShift(store, y), y)
      snippets[id] = new Snippet('button', points[id])
    })
  }
  store.set('coat.buttons', { top, bottom, count, rows })
}

/** A part drawing the front facing: the front's edge strip, neckline to hem */
export function facingPart({ name, from, nr = 5 }) {
  return {
    name,
    from,
    // Hide Brian's parts only; the front itself stays
    hide: { inherited: true },
    draft: (sh) => {
      const { points, paths, Path, Point, store, sa, macro, part } = sh
      cleanup(sh, ['neckline', 'edge', 'hemBase', 'shawl'])
      const { ext, facing } = store.get('coat.frontEdge')
      const x = -ext + facing

      const { f = 0 } = store.get('coat.frontEdge')
      if (paths.shawl) return shoulderFacing(sh, x, f, nr, paths.shawl)
      if (store.get('coat.frontEdge').vNeck) return shoulderFacing(sh, x, f, nr, paths.neckline)
      // Neckline from the front edge to where the facing ends
      const cut = paths.neckline.intersectsX(x)[0]
      points.facingNeck = cut || paths.neckline.end()
      const neck = cut ? paths.neckline.split(cut)[0] : paths.neckline.clone()
      // Hem: follow the front's hem out to the facing's width
      points.facingHem = paths.hemBase.intersectsX(x - f)[0] || new Point(x - f, points.cfHem.y)
      const hem = paths.hemBase.split(points.facingHem)[0]
      // Inner edge: parallel to the front edge (which bows out for a stout figure)
      let inner = new Path().move(points.facingHem)
      if (f > 0.5) {
        const waist = new Point(x - f, Math.max(points.cfWaist.y, points.facingNeck.y + 2))
        const chest = new Point(x, Math.max(points.armhole.y, points.facingNeck.y + 1))
        if (waist.y < points.facingHem.y) inner = inner.line(waist)
        if (chest.y < waist.y && chest.y > points.facingNeck.y) inner = inner.line(chest)
      }
      inner = inner.line(points.facingNeck)

      paths.seam = paths.edge
        .clone()
        .join(hem)
        .join(inner)
        .join(neck.reverse())
        .close()
        .unhide()
        .addClass('fabric')
      if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
      for (const p of ['neckline', 'edge', 'hemBase']) paths[p].hide()

      store.set('coat.facing', { neck: neck.length(), edge: paths.edge.length() })
      macro('grainline', {
        from: points.facingHem.shift(180, facing / 2).shift(90, 40),
        to: points.facingNeck.shift(180, facing / 2).shift(-90, 40),
      })
      store.cutlist.setCut({ cut: 2, from: 'fabric' })
      points.title = new Point(x - facing / 2, points.cfWaist.y)
      title(macro, { at: points.title, nr, title: 'facing', scale: 0.4, rotation: 90 })
      return part
    },
  }
}

/**
 * A facing that runs up to the shoulder seam (open V necks, and shawl collars, where it is the
 * lapel and the collar's top side cut in one). `top` runs from the front edge to the neck point.
 */
function shoulderFacing(sh, x, f, nr, top) {
  const { points, paths, Path, Point, store, sa, macro, part } = sh
  points.facingHem = paths.hemBase.intersectsX(x - f)[0] || new Point(x - f, points.cfHem.y)
  const hem = paths.hemBase.split(points.facingHem)[0]
  // Inner edge up to the shoulder seam a little way out from the neck point
  // Out from the neck point by the back neck facing's width if the design has one
  const along = store.get('coat.neckFacing', null)?.width ?? points.s3CollarSplit.dist(points.s3ArmholeSplit) * 0.3
  points.facingShoulder = points.s3CollarSplit.shiftTowards(points.s3ArmholeSplit, along)
  let inner = new Path().move(points.facingHem)
  if (f > 0.5) inner = inner.line(new Point(x - f, points.cfWaist.y))
  inner = inner.line(new Point(x, points.armhole.y)).line(points.facingShoulder).line(points.s3CollarSplit)
  paths.seam = paths.edge.clone().join(hem).join(inner).join(top.reverse()).close().unhide().addClass('fabric')
  if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
  for (const p of ['neckline', 'edge', 'hemBase', 'shawl']) paths[p]?.hide()
  store.set('coat.facing', { neck: top.length(), edge: paths.edge.length(), shoulder: points.facingShoulder.dist(points.s3CollarSplit) })
  macro('grainline', { from: points.facingHem.shift(180, 30).shift(90, 40), to: new Point(points.facingHem.x - 30, points.armhole.y) })
  store.cutlist.setCut({ cut: 2, from: 'fabric' })
  title(macro, { at: new Point(x - 40, points.cfWaist.y), nr, title: 'facing', scale: 0.4, rotation: 90 })
  return part
}

/**
 * Back neck facing (Diagram XI: "a narrow neck piece about two inches wide"), on the fold; it
 * meets the front facings at the shoulder, `width` out from the neck point.
 */
export function backNeckFacingPart({ name, from, nr, width, enabled = () => true }) {
  return {
    name,
    from,
    hide: { inherited: true },
    draft: (sh) => {
      const { points, paths, Path, Point, store, sa, macro, options, measurements, part } = sh
      cleanup(sh, ['backCollar'])
      if (!enabled(options)) {
        paths.backCollar.hide()
        return part.hide()
      }
      const w = width(sh)
      points.nfShoulder = points.s3CollarSplit.shiftTowards(points.s3ArmholeSplit, w)
      points.nfCb = new Point(0, points.cbNeck.y + w)
      // Lower edge: parallel-ish to the neckline, from the shoulder to CB
      const k = Math.abs(points.nfShoulder.x) * 0.5
      paths.saBase = new Path()
        .move(points.nfCb)
        .curve(points.nfCb.shift(0, k), points.nfShoulder.shift(-90, w * 0.3), points.nfShoulder)
        .line(points.s3CollarSplit)
        .join(paths.backCollar)
        .hide()
      paths.seam = paths.saBase.clone().close().unhide().addClass('fabric')
      paths.backCollar.hide()
      if (sa) {
        const off = paths.saBase.offset(sa)
        paths.sa = new Path().move(points.nfCb).line(off.start()).join(off).line(points.cbNeck).addClass('fabric sa')
      }
      store.set('coat.backNeckFacing', { shoulder: points.nfShoulder.dist(points.s3CollarSplit) })
      macro('cutonfold', { from: points.cbNeck, to: points.nfCb, grainline: true })
      store.cutlist.setCut({ cut: 1, from: 'fabric', onFold: true })
      title(macro, { at: new Point(points.nfShoulder.x * 0.4, points.cbNeck.y + w * 0.4), nr, title: 'backNeckFacing', scale: 0.3 })
      return part
    },
  }
}

/**
 * A collar, half drawn and cut on the fold at CB. The neck edge, `target` long, rises toward
 * the front by `spring` (the CB is lower), so the outer edge is longer and the collar falls
 * over; the outer edge runs parallel to it, `width` away. `point` carries the outer corner
 * past the front end (0 for a stand collar).
 */
export function draftCollar(sh, { target, spring, width, point, nr = 4 }) {
  const { points, paths, Path, Point, store, sa, macro, part } = sh
  points.cbNeck = new Point(0, spring)
  let span = target
  for (let run = 0; run < 20; run++) {
    points.frontNeck = new Point(span, 0)
    points.cbNeckCp = points.cbNeck.shift(0, span * 0.5)
    points.frontNeckCp = points.frontNeck.shiftFractionTowards(points.cbNeck, 0.35)
    paths.neck = new Path().move(points.cbNeck).curve(points.cbNeckCp, points.frontNeckCp, points.frontNeck)
    const delta = paths.neck.length() - target
    if (Math.abs(delta) < 0.2) break
    span -= delta
  }
  points.cbOuter = new Point(0, spring + width)
  points.tip = new Point(span + point, width)
  points.cbOuterCp = points.cbOuter.shift(0, span * 0.5)
  points.tipCp = points.tip.shiftFractionTowards(points.cbOuter, 0.35)

  // Counter-clockwise on the page (outer edge first), so the allowance offsets outward
  paths.saBase = new Path()
    .move(points.cbOuter)
    .curve(points.cbOuterCp, points.tipCp, points.tip)
    .line(points.frontNeck)
    .join(paths.neck.reverse())
    .hide()
  paths.seam = paths.saBase.clone().close().unhide().addClass('fabric')
  paths.neck.hide()
  if (sa) {
    const off = paths.saBase.offset(sa)
    paths.sa = new Path().move(points.cbOuter).line(off.start()).join(off).line(points.cbNeck).addClass('fabric sa')
  }
  store.set('coat.collar', { neck: paths.neck.length(), target })
  macro('cutonfold', { from: points.cbOuter, to: points.cbNeck, grainline: true })
  store.cutlist.setCut([
    { cut: 2, from: 'fabric', onFold: true },
    { cut: 1, from: 'interfacing', onFold: true },
  ])
  title(macro, { at: new Point(span * 0.45, spring + width * 0.45), nr, title: 'collar', scale: 0.5 })
  return part
}

/** One-piece sleeve: FreeSewing's sleeve fitted to the armhole, straight to a hem */
export function sleevePart({ name, after, options, enabled = () => true }) {
  return {
    name,
    from: librarySleeve,
    after,
    hide: hidePresets.HIDE_TREE,
    options: { ...options, libraryFitSleeve: true },
    draft: ({ points, paths, Path, store, sa, snippets, macro, options: o, part }) => {
      for (const p in paths) if (p !== 'sleevecap') delete paths[p]
      for (const s in snippets) if (!s.toLowerCase().includes('notch')) delete snippets[s]
      if (!enabled(o)) {
        macro('rmtitle')
        return part.hide()
      }
      paths.hemBase = new Path().move(points.wristLeft).line(points.wristRight).hide()
      paths.saBase = new Path()
        .move(points.wristRight)
        .line(points.bicepsRight)
        .join(paths.sleevecap)
        .line(points.wristLeft)
        .hide()
      paths.seam = paths.hemBase.join(paths.saBase).close().addClass('fabric')
      if (sa) paths.sa = allowance(paths, Path, sa).line(paths.hemBase.offset(sa * 3).start()).addClass('fabric sa')
      store.set('coat.sleeve', {
        cap: paths.sleevecap.length(),
        armhole:
          store.get('library.sleeve.frontArmholeLength') + store.get('library.sleeve.backArmholeLength'),
        underarm: [points.wristLeft.dist(points.bicepsLeft), points.wristRight.dist(points.bicepsRight)],
      })
      return part
    },
  }
}
