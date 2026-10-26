// Yoke garments for PublicSewing, on FreeSewing's Brian block (Walker 1909: child's overall
// (smock), night-dresses, frocks, pinafores). A yoke (or bodice) at the top; a body gathered
// into it, its fullness added at the fold; an opening at the back or front with a placket;
// sleeves long or short gathered into a band, or none.
//
// A design is a spec extending templates/yoke.yaml: Brian's back and front drafted by
// draftYokeSide (the `yokeSide` operation) with these options (yokeOptions), whose defaults the
// design sets. Everything the parts must agree on goes through the store under `yoke.*`.
import { hidePresets, pctBasedOn } from '@freesewing/core'
import { sleeve as librarySleeve } from '@freesewing/library'
import { cleanup, armhole, title, BRAND, draftCollar } from './coat.mjs'

/** Options every yoke garment carries; a design overrides defaults by redefining one */
export const yokeOptions = {
  chestEase: { pct: 16, min: 6, max: 40, ...pctBasedOn('chest'), menu: 'fit' },
  bicepsEase: { pct: 25, min: 10, max: 60, ...pctBasedOn('biceps'), menu: 'fit' },
  cuffEase: { pct: 80, min: 20, max: 200, ...pctBasedOn('wrist'), menu: 'fit' },
  yokeAt: { dflt: 'chest', list: ['chest', 'waist'], menu: 'style' }, // a yoke, or a bodice to the waist
  yokeDepth: { pct: 45, min: 20, max: 90, menu: 'style' }, // neck point to chest line
  gathers: { pct: 150, min: 100, max: 250, menu: 'style' }, // body top edge / yoke seam
  hemFlare: { pct: 6, min: 0, max: 25, menu: 'style' }, // x seat, at each side seam
  skirtLength: { pct: 45, min: 15, max: 98, menu: 'style' }, // waist to hem, x waistToFloor
  opening: { dflt: 'back', list: ['back', 'front'], menu: 'style' },
  openingExt: { pct: 2.5, min: 1.5, max: 5, ...pctBasedOn('chest'), menu: 'style' },
  placketDepth: { pct: 45, min: 10, max: 80, menu: 'style' }, // from the neck, x hpsToWaistBack
  buttons: { count: 3, min: 1, max: 8, menu: 'style' },
  neckFinish: { dflt: 'binding', list: ['binding', 'band'], menu: 'style' },
  bandHeight: { pct: 9, min: 5, max: 15, ...pctBasedOn('neck'), menu: 'style' },
  sleeves: { dflt: 'long', list: ['long', 'short', 'none'], menu: 'style' },
  shortSleeve: { pct: 28, min: 15, max: 60, menu: 'style' }, // x shoulderToWrist
  sleeveBand: { pct: 15, min: 8, max: 30, ...pctBasedOn('wrist'), menu: 'style' }, // finished band width, x wrist
  sleeveBandEase: { pct: 25, min: 5, max: 60, menu: 'style' },
  frontYoke: { bool: true, menu: 'style' }, // false: the front is one piece, neck to hem
  sideSlit: { pct: 0, min: 0, max: 60, menu: 'style' }, // up from the hem, x waist-to-hem
  hemCorner: { pct: 0, min: 0, max: 100, menu: 'style' }, // round the side hem corner, x slit
}
export const yokeMeasurements = ['seat', 'waist', 'waistToFloor', 'hpsToWaistBack', 'shoulderToWrist']

/** Where the yoke seam, waist and hem fall (y), and the body's fullness */
function levels({ points, measurements, options }, c) {
  const waistY = points[`${c}Waist`].y
  // From the neck point (y = 0) down: the same level on back and front
  const yokeY = options.yokeAt === 'waist' ? waistY : points.armhole.y * options.yokeDepth
  const hemY = waistY + measurements.waistToFloor * options.skirtLength
  return { waistY, yokeY, hemY }
}

/**
 * Draft the yoke and body for one side ('back' or 'front') into `yoke.<side>` in the store,
 * as paths in that side's coordinates (x from CB/CF, the fold).
 */
export function draftYokeSide(sh, side) {
  const { points, paths, Path, Point, options, measurements, store } = sh
  const c = side === 'back' ? 'cb' : 'cf'
  cleanup(sh, [`${side}Armhole`, `${side}Collar`])
  const { waistY, yokeY, hemY } = levels(sh, c)
  const S = points.armhole.x
  const arm = armhole(points, Path, paths[`${side}Armhole`]).hide() // armhole bottom -> shoulder
  const neck = paths[`${side}Collar`] // neck point -> CB/CF
  const open = options.opening === side
  const ext = open ? measurements.chest * options.openingExt : 0

  // Yoke seam meets the armhole (or, for a bodice to the waist, the side seam)
  let armYoke, upperArm, lowerArm
  if (yokeY < points.armhole.y - 1) {
    armYoke = arm.intersectsY(yokeY)[0]
    ;[lowerArm, upperArm] = arm.split(armYoke)
  } else {
    armYoke = new Point(S, yokeY)
    upperArm = arm
    lowerArm = null
  }
  const fold = new Point(0, yokeY)
  const neckAtFold = points[`${c}Neck`]

  // Yoke: from the bottom of the fold round to the top (counter-clockwise on the page)
  let yoke = new Path().move(open ? new Point(-ext, yokeY) : fold).line(armYoke)
  if (!lowerArm) yoke = yoke.line(points.armhole)
  yoke = yoke.join(upperArm).line(points.s3CollarSplit).join(neck)
  if (open) yoke = yoke.line(new Point(-ext, neckAtFold.y))

  // Body: fullness added at the fold, flared at the side, from the bottom of the fold round.
  // With no front yoke the front body runs up to the shoulder and neck, ungathered.
  const whole = side === 'front' && !options.frontYoke
  const top = armYoke.x
  const spread = whole ? 0 : top * (options.gathers - 1)
  const flare = measurements.seat * options.hemFlare
  const sh2 = (p) => p.translate(spread, 0)
  const hemOut = new Point(S + spread + flare, hemY)
  const armTop = whole ? points.armhole : lowerArm ? points.armhole : armYoke
  // Side slit and a rounded corner at the foot of the side seam
  const slitLen = (hemY - waistY) * options.sideSlit
  const r = Math.min(slitLen * options.hemCorner, (S + spread) * 0.5)
  let body = new Path().move(new Point(0, hemY))
  if (r > 1) {
    const up = hemOut.shiftTowards(sh2(armTop), r)
    const k = 0.55 * r
    body = body.line(hemOut.shift(180, r)).curve(hemOut.shift(180, r - k), hemOut.shiftTowards(sh2(armTop), r - k), up)
  } else body = body.line(hemOut)
  if (whole) body = body.line(points.armhole).join(arm).line(points.s3CollarSplit).join(neck)
  else if (lowerArm) body = body.line(sh2(points.armhole)).join(lowerArm.translate(spread, 0)).line(new Point(0, yokeY))
  else body = body.line(sh2(armYoke)).line(new Point(0, yokeY))
  if (whole) yoke = null

  // Named corners of each piece (for the 3D drape configs): the fold (or opening) ends, the
  // yoke seam's ends, the underarm, shoulder, neck point and hem corners
  const marks = {
    yoke: yoke && {
      seamFold: open ? new Point(-ext, yokeY) : fold,
      seamArm: armYoke,
      ...(lowerArm ? {} : { underarm: points.armhole }),
      shoulder: points.s3ArmholeSplit,
      hps: points.s3CollarSplit,
      neckFold: neckAtFold,
    },
    body: {
      hemFold: new Point(0, hemY),
      hemSide: r > 1 ? hemOut.shiftTowards(sh2(armTop), r) : hemOut,
      sideTop: whole ? points.armhole : sh2(armTop),
      ...(whole
        ? { shoulder: points.s3ArmholeSplit, hps: points.s3CollarSplit, neckFold: neckAtFold }
        : { yokeSide: lowerArm ? lowerArm.end().translate(spread, 0) : sh2(armYoke), topFold: new Point(0, yokeY) }),
    },
  }

  // Placket slit below the yoke (or from the neck, with no yoke) on the opening side
  const slitEnd = neckAtFold.y + measurements.hpsToWaistBack * options.placketDepth
  const slitTop = whole ? neckAtFold.y : yokeY
  const slit = open && slitEnd > slitTop + 5 ? slitEnd - slitTop : 0

  store.set(`yoke.${side}`, {
    yoke,
    body,
    marks,
    open,
    ext,
    slit,
    whole,
    slitTop,
    sideSlit: slitLen,
    yokeSeam: top,
    bodyTop: top + spread,
    side: hemOut.dist(sh2(armTop)) - (r > 1 ? r : 0),
    yokeSide: lowerArm ? 0 : points.armhole.dist(armYoke),
    shoulder: points.s3CollarSplit.dist(points.s3ArmholeSplit),
    neck: neck.length(),
    neckY: neckAtFold.y,
    yokeY,
    hemY,
    waistY,
  })
  // The sleeve's title (FreeSewing's sleeve part reads it from here)
  store.set('library.sleeve.title', { nr: 5, brand: BRAND })
}

/** A part drawing one piece ('yoke' or 'body') of one side from the store */
export function yokePiecePart({ name, after, side, piece, nr, label, cut }) {
  return {
    name,
    after,
    draft: ({ paths, Path, Point, points, store, sa, macro, snippets, Snippet, options, part }) => {
      const y = store.get(`yoke.${side}`)
      if (!y[piece]) {
        macro('rmtitle')
        return part.hide()
      }
      const outline = mapPath(y[piece], Path)
      for (const [k, q] of Object.entries(y.marks?.[piece] ?? {})) points[k] = q.clone()
      const onFold = !(piece === 'yoke' && y.open)
      paths.seam = outline.clone().close().addClass('fabric')
      if (sa) {
        if (onFold) {
          const isBody = piece === 'body'
          // Hem (first segment of the body) gets a deeper allowance
          if (isBody) {
            const [hem, rest] = splitFirst(outline, Path)
            const ho = hem.offset(3 * sa)
            const ro = rest.offset(sa)
            paths.sa = new Path().move(outline.start()).line(ho.start()).join(ho).line(ro.start()).join(ro).line(outline.end()).addClass('fabric sa')
          } else {
            const off = outline.offset(sa)
            paths.sa = new Path().move(outline.start()).line(off.start()).join(off).line(outline.end()).addClass('fabric sa')
          }
        } else paths.sa = paths.seam.offset(sa).addClass('fabric sa')
      }
      const bb = paths.seam.bbox()
      if (onFold) macro('cutonfold', { from: outline.end(), to: outline.start(), grainline: true })
      else macro('grainline', { from: new Point(bb.topLeft.x + 30, bb.bottomRight.y - 20), to: new Point(bb.topLeft.x + 30, bb.topLeft.y + 20) })
      store.cutlist.setCut({ cut: onFold ? cut : 2 * cut, from: 'fabric', onFold })
      points.titleAt = new Point((bb.topLeft.x + bb.bottomRight.x) / 2, (bb.topLeft.y + bb.bottomRight.y) / 2)
      title(macro, { at: points.titleAt, nr, title: label, scale: piece === 'yoke' ? 0.4 : 0.8 })
      if (piece === 'body') {
        // Gathering marks along the top, and the placket slit
        if (!y.whole && y.bodyTop > y.yokeSeam + 1) {
          points.gatherA = new Point(10, y.yokeY)
          points.gatherB = new Point(y.bodyTop - 10, y.yokeY)
          paths.gathers = new Path().move(points.gatherA).line(points.gatherB).addClass('mark dotted').addText('gathers', 'center text-sm')
        }
        if (y.slit) {
          paths.slit = new Path().move(new Point(0, y.slitTop)).line(new Point(0, y.slitTop + y.slit)).addClass('mark')
          snippets.slitEnd = new Snippet('notch', new Point(0, y.slitTop + y.slit))
        }
        if (y.sideSlit > 1) {
          // Notch the top of the side slit on the side seam
          const hit = outline.intersectsY(y.hemY - y.sideSlit).filter((p) => p.x > 1)[0]
          if (hit) snippets.sideSlit = new Snippet('notch', hit)
        }
      }
      if (piece === 'body' && y.whole && y.open) {
        // Buttons down the placket
        const n = options.buttons
        for (let i = 0; i < n; i++) {
          const by = y.slitTop + 20 + ((y.slit - 40) * i) / Math.max(1, n - 1)
          snippets[`b${i}`] = new Snippet('button', new Point(0, by))
        }
      }
      if (piece === 'yoke' && y.open) {
        // Buttons down the opening, on the centre line
        const n = options.buttons
        const bottom = y.yokeY - 15
        const top = y.neckY + 15
        for (let i = 0; i < n; i++) {
          const by = n > 1 ? top + ((bottom - top) * i) / (n - 1) : (top + bottom) / 2
          snippets[`b${i}`] = new Snippet('button', new Point(0, by))
        }
      }
      return part
    },
  }
}

/** Placket for the slit below the yoke: a strip bound round both edges of the slit */
export function placketPart({ name, after, nr }) {
  return {
    name,
    after,
    draft: ({ paths, Path, Point, store, sa, macro, options, part }) => {
      const y = store.get(`yoke.${options.opening}`)
      if (!y.slit) {
        macro('rmtitle')
        return part.hide()
      }
      const L = 2 * y.slit + 20
      const W = 4 * y.ext
      paths.seam = new Path().move(new Point(L, 0)).line(new Point(0, 0)).line(new Point(0, W)).line(new Point(L, W)).close().addClass('fabric')
      paths.fold = new Path().move(new Point(0, W / 2)).line(new Point(L, W / 2)).addClass('help dashed')
      if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
      store.cutlist.setCut({ cut: 1, from: 'fabric' })
      store.set('yoke.placket', { length: L })
      title(macro, { at: new Point(L * 0.3, W * 0.25), nr, title: 'placket', scale: 0.25 })
      return part
    },
  }
}

/**
 * Neck band (a low stand) when neckFinish is 'band'; a turn-down collar, square-ended, when it
 * is 'collar' (the design then defines collarWidth, x neck, and collarSpring, x the neckline).
 */
export function neckBandPart({ name, after, nr }) {
  return {
    name,
    after,
    measurements: ['neck'],
    draft: (sh) => {
      const { store, options, measurements, part, macro } = sh
      if (options.neckFinish !== 'band' && options.neckFinish !== 'collar') {
        macro('rmtitle')
        return part.hide()
      }
      const b = store.get('yoke.back')
      const f = store.get('yoke.front')
      const target = b.neck + f.neck + (b.ext + f.ext) / 2
      if (options.neckFinish === 'collar') {
        return draftCollar(sh, { target, spring: target * options.collarSpring, width: measurements.neck * options.collarWidth, point: 0, nr })
      }
      return draftCollar(sh, { target, spring: target * 0.05, width: measurements.neck * options.bandHeight, point: 0, nr })
    },
  }
}

/** Sleeve: FreeSewing's fitted sleeve, long or short, its hem gathered into a band */
export function yokeSleevePart({ name, after, nr }) {
  return {
    name,
    from: librarySleeve,
    after,
    hide: hidePresets.HIDE_TREE,
    options: { libraryFitSleeve: true },
    draft: ({ points, paths, Path, Point, store, sa, snippets, macro, options, measurements, part }) => {
      for (const p in paths) if (p !== 'sleevecap') delete paths[p]
      for (const s in snippets) if (!s.toLowerCase().includes('notch')) delete snippets[s]
      if (options.sleeves === 'none') {
        macro('rmtitle')
        return part.hide()
      }
      if (options.sleeves === 'short') {
        // Cut across at the short length, keeping the underarm lines
        // ...but always below the cap (a big cap can be deeper than the short length)
        const y = Math.max(points.sleeveTip.y + measurements.shoulderToWrist * options.shortSleeve, points.bicepsLeft.y + measurements.shoulderToWrist * 0.06)
        const at = (a, b) => new Point(a.x + ((b.x - a.x) * (y - a.y)) / (b.y - a.y), y)
        points.wristLeft = at(points.bicepsLeft, points.wristLeft)
        points.wristRight = at(points.bicepsRight, points.wristRight)
      }
      paths.hemBase = new Path().move(points.wristLeft).line(points.wristRight).hide()
      paths.saBase = new Path().move(points.wristRight).line(points.bicepsRight).join(paths.sleevecap).line(points.wristLeft).hide()
      paths.seam = paths.hemBase.join(paths.saBase).close().addClass('fabric')
      if (sa) {
        const off = paths.saBase.offset(sa)
        const hem = paths.hemBase.offset(sa)
        paths.sa = hem.line(off.start()).join(off).line(hem.start()).addClass('fabric sa')
      }
      paths.gathers = new Path().move(points.wristLeft.shift(90, 8)).line(points.wristRight.shift(90, 8)).addClass('mark dotted')
      // Band round the wrist (long) or the arm (short)
      const round = options.sleeves === 'short' ? measurements.biceps * (1 + options.bicepsEase * 0.5) : measurements.wrist
      store.set('yoke.sleeve', {
        cap: paths.sleevecap.length(),
        armhole: store.get('library.sleeve.frontArmholeLength') + store.get('library.sleeve.backArmholeLength'),
        underarm: [points.wristLeft.dist(points.bicepsLeft), points.wristRight.dist(points.bicepsRight)],
        hem: points.wristLeft.dist(points.wristRight),
        band: Math.min(round * (1 + options.sleeveBandEase), points.wristLeft.dist(points.wristRight)),
        bandWidth: measurements.wrist * options.sleeveBand,
      })
      store.cutlist.setCut({ cut: 2, from: 'fabric' })
      return part
    },
  }
}

/** The sleeve band: a straight strip folded in half */
export function sleeveBandPart({ name, after, nr }) {
  return {
    name,
    after,
    draft: ({ paths, Path, Point, store, sa, macro, options, part }) => {
      if (options.sleeves === 'none') {
        macro('rmtitle')
        return part.hide()
      }
      const s = store.get('yoke.sleeve')
      const L = s.band
      const W = 2 * s.bandWidth
      paths.seam = new Path().move(new Point(L, 0)).line(new Point(0, 0)).line(new Point(0, W)).line(new Point(L, W)).close().addClass('fabric')
      paths.fold = new Path().move(new Point(0, W / 2)).line(new Point(L, W / 2)).addClass('help dashed')
      if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
      store.cutlist.setCut({ cut: 2, from: 'fabric' })
      title(macro, { at: new Point(L * 0.3, W * 0.3), nr, title: 'sleeveBand', scale: 0.25 })
      return part
    },
  }
}

/** Copy of a path from the store into this part */
function mapPath(path, Path) {
  let out = new Path()
  for (const op of path.ops) {
    if (op.type === 'move') out = out.move(op.to.clone())
    else if (op.type === 'line') out = out.line(op.to.clone())
    else if (op.type === 'curve') out = out.curve(op.cp1.clone(), op.cp2.clone(), op.to.clone())
    else if (op.type === 'close') out = out.close()
  }
  return out
}

/** Split a path after its first segment */
function splitFirst(path, Path) {
  const [m, first, ...rest] = path.ops
  const a = new Path().move(m.to)
  first.type === 'curve' ? a.curve(first.cp1, first.cp2, first.to) : a.line(first.to)
  let b = new Path().move(first.to)
  for (const op of rest) {
    if (op.type === 'line') b = b.line(op.to)
    else if (op.type === 'curve') b = b.curve(op.cp1, op.cp2, op.to)
  }
  return [a, b]
}
