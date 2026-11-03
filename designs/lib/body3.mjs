// A three-piece coat body (Simons, Diagram XIV, the military blouse): back, side body and
// forepart. Two seams replace the side seam: one from the back armhole, one from the front
// armhole, each taking in the waist and letting out over the seat. Each seam's two edges
// mirror each other about a vertical line, so they are the same length by construction.
// Built on Bent (Brian with a two-piece sleeve). Reads the options waistEase, seatEase,
// backShare (the back seam's share of the waist suppression) and lengthBelowWaist.
// Store: `blouse.back`, `blouse.front`, `blouse.sideBody`, `blouse.welts`, `blouse.insideWelts`.
import { hidePresets } from '@freesewing/core'
import { cleanup, armhole, title, placeButtons, draftNotchLapel, frontLiningPart, backLiningPart, BRAND } from './coat.mjs'

/** Hem and the body's half widths (mm) at chest, waist and seat */
function bodyTargets({ points, measurements, options }) {
  const S = points.armhole.x // quarter chest with ease: back and front both reach here
  const waistHalf = (measurements.waist * (1 + options.waistEase)) / 2
  const seatHalf = (measurements.seat * (1 + options.seatEase)) / 2
  const Dw = Math.max(0, 2 * S - waistHalf) // taken in at the waist, per half body
  const Ds = 2 * S - seatHalf // negative: let out over the seat
  return { S, Dw, Ds }
}

/**
 * One seam's two edges, as Paths from its start on the armhole down to the hem. `x0` is the
 * seam's line, dw/ds what it takes in at the waist and seat (split evenly either side).
 */
function seamEdges({ Path, Point }, start, x0, dw, ds, waistY, seatY, hemY) {
  const edge = (sign) => {
    const w = new Point(x0 + (sign * dw) / 2, waistY)
    const s = new Point(x0 + (sign * ds) / 2, seatY)
    const h = new Point(x0 + (sign * ds) / 2, hemY)
    const a = (waistY - start.y) / 3
    const b = (seatY - waistY) / 3
    // A body cut off above the seat line, for a skirt (`body3SkirtPart`): straight on from the waist
    if (hemY <= seatY) return new Path().move(start).curve(start.shift(-90, a), w.shift(90, a), w).line(new Point(w.x, hemY))
    return new Path()
      .move(start)
      .curve(start.shift(-90, a), w.shift(90, a), w)
      .curve(w.shift(-90, b), s.shift(90, b), s)
      .line(h)
  }
  return { left: edge(-1), right: edge(1) }
}

/** A copy of `path` (from another part) with every point mapped through f */
function mapPath(path, Path, f = (p) => p.clone()) {
  let out = new Path()
  for (const op of path.ops) {
    if (op.type === 'move') out = out.move(f(op.to))
    else if (op.type === 'line') out = out.line(f(op.to))
    else if (op.type === 'curve') out = out.curve(f(op.cp1), f(op.cp2), f(op.to))
    else if (op.type === 'close') out = out.close()
  }
  return out
}

/** Mirror a path about the vertical line x */
const flipPathX = (path, x, Path) => mapPath(path, Path, (p) => p.flipX(p.shift(0, x - p.x)))

/** Lines shared by back and front: waist, seat and hem heights */
function levels({ points, Point, measurements, options }, c) {
  const waistY = points[`${c}Waist`].y
  points[`${c}Seat`] = new Point(0, waistY + measurements.waistToSeat)
  points[`${c}Hem`] = new Point(0, waistY + measurements.waistToSeat * options.lengthBelowWaist)
  return { waistY, seatY: points[`${c}Seat`].y, hemY: points[`${c}Hem`].y }
}

/**
 * The back panel, on the fold. Its seam leaves the armhole `seamAt` of the way up. `vent`:
 * { length, width }, a back vent from the hem `length` up, lapping `width` past CB, its top cut
 * at 45 degrees; the back is then cut in pairs with a CB seam.
 */
export function draftBody3Back(sh, { seamAt = 0.3, vent, nr = 2 } = {}) {
  const { points, paths, Path, Point, options, store, sa, macro, snippets, Snippet, part } = sh
  cleanup(sh, ['backArmhole', 'backCollar'])
  const { waistY, seatY, hemY } = levels(sh, 'cb')
  const { S, Dw, Ds } = bodyTargets(sh)
  paths.armholeFull = armhole(points, Path, paths.backArmhole).hide()
  points.seamStart = paths.armholeFull.shiftAlong(paths.armholeFull.length() * seamAt)
  const [lowerArm, upperArm] = paths.armholeFull.split(points.seamStart)
  const k = options.backShare
  const { left, right } = seamEdges(sh, points.seamStart, points.seamStart.x, Dw * k, Ds * k, waistY, seatY, hemY)
  store.set('blouse.back', { right, lowerArm, S, hemY, seam: left.length(), ...(hemY <= seatY ? { bottom: left.end().x } : {}) })
  points.seamHem = left.end()
  // CB: the fold, or a seam with a vent at the hem
  let cb = null
  let hemStart = points.cbHem
  if (vent) {
    points.ventTop = new Point(0, points.cbHem.y - vent.length)
    points.ventCorner = new Point(-vent.width, points.ventTop.y + vent.width)
    points.ventHem = new Point(-vent.width, points.cbHem.y)
    hemStart = points.ventHem
    cb = new Path().move(points.cbNeck).line(points.ventTop).line(points.ventCorner).line(points.ventHem)
    store.set('coat.vent', { length: vent.length, width: vent.width, top: points.ventTop.y })
  }
  const hem = new Path().move(hemStart).line(points.seamHem)
  const rest = new Path().move(points.seamHem).join(left.reverse()).join(upperArm).line(points.s3CollarSplit).join(paths.backCollar)
  const outline = cb ? hem.join(rest).join(cb) : hem.join(rest)
  paths.seam = outline.clone().close().addClass('fabric')
  if (sa) {
    const h = hem.offset(sa * (hemY <= seatY ? 1 : 3)) // a seam, above the seat line
    const r = rest.offset(sa)
    if (cb) {
      const c = cb.offset(sa)
      paths.sa = h.line(r.start()).join(r).line(c.start()).join(c).close().addClass('fabric sa')
    } else {
      paths.sa = new Path().move(points.cbHem).line(h.start()).join(h).line(r.start()).join(r).line(points.cbNeck).addClass('fabric sa')
    }
  }
  store.set('coat.back', {
    shoulder: points.s3CollarSplit.dist(points.s3ArmholeSplit),
    neck: paths.backCollar.length(),
  })
  if (vent) {
    const gx = points.seamStart.x * 0.3
    macro('grainline', { from: new Point(gx, points.cbHem.y - 40), to: new Point(gx, points.cbNeck.y + 60) })
    store.cutlist.setCut({ cut: 2, from: 'fabric' })
  } else {
    macro('cutonfold', { from: points.cbNeck, to: points.cbHem, grainline: true })
    store.cutlist.setCut({ cut: 1, from: 'fabric', onFold: true })
  }
  title(macro, { at: new Point(points.seamStart.x * 0.45, points.armhole.y), nr, title: 'back' })
  snippets.seamStart = new Snippet('bnotch', points.seamStart)
  snippets.waist = new Snippet('notch', left.intersectsY(waistY)[0] || points.seamStart)
  // The sleeves' titles (FreeSewing's sleeve parts read them from here)
  store.set('library.topsleeve.title', { nr: 4, brand: BRAND })
  store.set('library.undersleeve.title', { nr: 5, brand: BRAND })
  return part
}

/**
 * The forepart: its seam leaves the armhole `seamAt` of the way up; a straight button stand
 * `ext` past CF; a hem dropping `drop` toward the front edge; `facing` wide facings.
 * `buttons`: { count, top, bottom } on CF. `welts`: slanted welt pocket openings,
 * { <id>: { x, y, len, rise, bag, mark } }, each kept `clear` of the seam (shortened if
 * need be); the welt is `welt` x len wide, the bag `bag` x len deep; drawn when `mark`.
 * `r`: the front corner rounded to this radius (0: square). `lapel`: a notched lapel
 * ({ breakY, rollOut, gorgeAt, width }, as `draftNotchLapel` takes) instead of the round neck.
 * `toShoulder`: the facing runs round the neck to the shoulder (for a lining), not to the neckline.
 * `buttons.rows` (default on CF): double-breasted, each row's x.
 */
export function draftBody3Front(sh, { seamAt = 0.12, ext, drop, facing, buttons, welts = {}, clear = 0, welt = 0.2, nr = 1, r = 0, lapel, toShoulder = false }) {
  const { points, paths, Path, Point, options, store, sa, macro, snippets, Snippet, part } = sh
  cleanup(sh, ['frontArmhole', 'frontCollar'])
  const { waistY, seatY, hemY } = levels(sh, 'cf')
  const { S, Dw, Ds } = bodyTargets(sh)
  paths.armholeFull = armhole(points, Path, paths.frontArmhole).hide()
  points.seamStart = paths.armholeFull.shiftAlong(paths.armholeFull.length() * seamAt)
  const [lowerArm, upperArm] = paths.armholeFull.split(points.seamStart)
  const k = 1 - options.backShare
  const { left, right } = seamEdges(sh, points.seamStart, points.seamStart.x, Dw * k, Ds * k, waistY, seatY, hemY)
  store.set('blouse.front', { right, lowerArm, seam: left.length() })
  points.seamHem = left.end()
  store.set('coat.frontEdge', { ext, facing, r, drop, ...(toShoulder ? { toShoulder } : {}) })
  points.edgeNeck = new Point(-ext, points.cfNeck.y)
  points.edgeHem = new Point(-ext, hemY + drop)
  points.cornerTop = points.edgeHem
  paths.edge = new Path().move(points.edgeNeck).line(points.edgeHem).hide()
  let hemStart = points.edgeHem
  if (r > 0) {
    points.cornerTop = points.edgeHem.shift(90, r)
    points.cornerEnd = points.edgeHem.shift(0, r)
    paths.edge = new Path()
      .move(points.edgeNeck)
      .line(points.cornerTop)
      .curve(points.cornerTop.shiftFractionTowards(points.edgeHem, 0.55), points.cornerEnd.shiftFractionTowards(points.edgeHem, 0.55), points.cornerEnd)
      .hide()
    hemStart = points.cornerEnd
  }
  const d = hemStart.dx(points.seamHem)
  paths.hemBase = new Path()
    .move(hemStart)
    .curve(hemStart.shift(0, d * 0.4), points.seamHem.shift(180, d * 0.4), points.seamHem)
    .hide()
  const outline = paths.edge
    .join(paths.hemBase)
    .join(left.reverse())
    .join(upperArm)
    .line(points.s3CollarSplit)
    .join(paths.frontCollar)
    .line(points.edgeNeck)
  paths.seam = outline.clone().close().unhide().addClass('fabric')
  if (sa) {
    const e = paths.edge.offset(sa)
    const hem = paths.hemBase.offset(sa * (hemY <= seatY ? 1 : 3))
    const rest = outline.split(points.seamHem)[1].offset(sa)
    paths.sa = e.line(hem.start()).join(hem).line(rest.start()).join(rest).line(e.start()).addClass('fabric sa')
  }
  paths.cf = new Path().move(points.cfNeck).line(points.cfHem).addClass('help dashed')
  // For the facing: the neckline from the front edge to the shoulder
  paths.neckline = new Path().move(points.edgeNeck).line(points.cfNeck).join(paths.frontCollar.reverse()).hide()
  placeButtons(sh, { rows: [0], ...buttons })

  // Welt pockets, clear of the seam
  const foreEdgeAt = (y) => (left.intersectsY(y)[0] || points.seamHem).x
  const geometry = {}
  for (const [id, w] of Object.entries(welts)) {
    const p = { x: w.x, y: w.y, len: w.len, rise: w.rise }
    const max = foreEdgeAt(p.y) - clear
    if (p.x + p.len > max) p.len = max - p.x
    p.welt = p.len * welt // finished welt width
    p.bag = p.len * w.bag // pocket bag depth
    geometry[id] = p
  }
  store.set('blouse.welts', geometry)
  for (const [id, w] of Object.entries(geometry)) {
    if (!welts[id].mark) continue
    points[`${id}WeltA`] = new Point(w.x, w.y)
    points[`${id}WeltB`] = new Point(w.x + w.len, w.y - w.rise)
    paths[`${id}Welt`] = new Path().move(points[`${id}WeltA`]).line(points[`${id}WeltB`]).addClass('mark')
  }

  store.set('coat.front', {
    shoulder: points.s3CollarSplit.dist(points.s3ArmholeSplit),
    neck: paths.frontCollar.length(),
    edge: points.edgeNeck.dist(points.edgeHem),
  })
  if (hemY <= seatY) store.set('blouse.frontBottom', paths.hemBase.length())
  macro('grainline', {
    from: points.cfHem.shift(90, 30).shift(0, S * 0.2),
    to: points.cfNeck.shift(-90, 30).shift(0, S * 0.2),
  })
  store.cutlist.setCut({ cut: 2, from: 'fabric' })
  title(macro, { at: new Point(points.seamStart.x * 0.4, waistY), nr, title: 'front' })
  snippets.seamStart = new Snippet('notch', points.seamStart)
  snippets.waist = new Snippet('notch', left.intersectsY(waistY)[0] || points.seamStart)

  // Flaps over welt openings that have `flap` (its depth x len): `coat.pockets.<id>` for flapPart
  const flaps = Object.entries(welts).filter(([, w]) => w.flap)
  if (flaps.length) {
    const pockets = store.get('coat.pockets', null) ?? {}
    for (const [id, w] of flaps) {
      const g = geometry[id]
      pockets[id] = { x: g.x, y: g.y, w: g.len, shape: 'rounded', flap: { h: g.len * w.flap, gap: 0, button: false } }
      if (w.mark) {
        const f = g.len * w.flap
        paths[`${id}Flap`] = new Path()
          .move(points[`${id}WeltA`])
          .line(points[`${id}WeltA`].shift(-90, f))
          .line(points[`${id}WeltB`].shift(-90, f))
          .line(points[`${id}WeltB`])
          .addClass('mark dotted')
      }
    }
    store.set('coat.pockets', pockets)
  }

  // A notched lapel: the edge, hem and body (hem end to shoulder) as draftNotchLapel takes them
  if (lapel) {
    paths.bodyBase = left.reverse().join(upperArm).line(points.s3CollarSplit).hide()
    draftNotchLapel(sh, lapel)
  }
  return part
}

/**
 * The side body: the back's strip beyond its seam and the front's strip beyond its seam,
 * joined where the side seam would be (x = S), the front half mirrored about that line.
 * Drawn in the back's coordinates.
 */
export function sideBodyPart({ name, after, nr = 3, lining = false }) {
  return {
    name,
    after,
    draft: ({ points, paths, Path, Point, store, sa, macro, options, part }) => {
      const bk = store.get('blouse.back')
      const fr = store.get('blouse.front')
      const S = bk.S
      const backSeam = mapPath(bk.right, Path) // back seam start -> hem
      const backArm = mapPath(bk.lowerArm, Path) // armhole bottom (x = S) -> back seam start
      const frontSeam = flipPathX(fr.right, S, Path) // front seam start -> hem, mirrored
      const frontArm = flipPathX(fr.lowerArm, S, Path) // armhole bottom -> front seam start, mirrored
      points.backHem = backSeam.end()
      points.frontHem = frontSeam.end()
      // Corners for the 3D drape config: where each seam leaves the armhole, and its bottom
      points.backTop = backSeam.start()
      points.frontTop = frontSeam.start()
      points.armBottom = backArm.start()
      // Counter-clockwise on the page: along the hem, up the front seam, over the armhole,
      // down the back seam
      const rest = frontSeam.reverse().join(frontArm.reverse()).join(backArm).join(backSeam)
      paths.seam = new Path().move(points.backHem).line(points.frontHem).join(rest).close().addClass('fabric')
      if (sa) {
        const hem = new Path().move(points.backHem).line(points.frontHem).offset(sa * (bk.bottom === undefined ? 3 : 1))
        const off = rest.offset(sa)
        paths.sa = hem.line(off.start()).join(off).line(hem.start()).addClass('fabric sa')
      }
      store.set('blouse.sideBody', {
        backSeam: backSeam.length(),
        frontSeam: frontSeam.length(),
        armhole: backArm.length() + frontArm.length(),
      })
      points.mid = new Point(S, (points.backHem.y + backSeam.start().y) / 2)
      macro('grainline', { from: points.mid.shift(-90, 150), to: points.mid.shift(90, 150) })
      store.cutlist.setCut({ cut: 2, from: 'fabric' })
      // Cut again from lining (a lined jacket's side body)
      if (lining && lining(options)) store.cutlist.addCut({ cut: 2, from: 'lining' })
      title(macro, { at: points.mid.shift(0, 10), nr, title: 'sideBody', scale: 0.5 })
      return part
    },
  }
}

/**
 * A skirt in one piece, seamed to a body3 body cut off above the seat line (Simons' surtout, 1916):
 * its top fits the back's, side body's and front's bottom edges in turn, hollowed a little, and rises
 * by the front's drop toward the back. CF straight, with `facing` folded back past the front edge; CB a
 * seam `length` long, leaning `lean` degrees out and rounded `round` (mm) at its middle.
 * Store: `blouse.skirt` { top: its top edge, bottom: the body's edge it sews to, back: the CB seam }.
 */
export function body3SkirtPart({ name, after, nr, size, options }) {
  return {
    name,
    after,
    options,
    draft: (sh) => {
      const { paths, Path, Point, store, sa, macro, part } = sh
      const { length, lean, round, facing } = size(sh)
      const bk = store.get('blouse.back')
      const fr = store.get('blouse.front')
      const S = bk.S
      const flip = (x) => 2 * S - x
      const [bh, fh] = [bk.right.end(), fr.right.end()]
      const side = Math.hypot(flip(fh.x) - bh.x, fh.y - bh.y)
      const bottom = bk.bottom + side + store.get('blouse.frontBottom')
      const { drop } = store.get('coat.frontEdge')
      const hollow = length * 0.05
      const t = (lean * Math.PI) / 180
      const d = { x: Math.sin(t), y: Math.cos(t) }
      const n = { x: Math.cos(t), y: -Math.sin(t) } // out, past the seam
      const topOf = (W) => {
        const c = new Point(W, -drop)
        return new Path().move(c).curve(new Point(W * 0.66, -drop * 0.66 + hollow), new Point(W * 0.33, -drop * 0.33 + hollow), new Point(0, 0))
      }
      let W = bottom
      for (let i = 0; i < 4; i++) W += bottom - topOf(W).length()
      const top = topOf(W)
      const C = top.start()
      const E = new Point(C.x + d.x * length, C.y + d.y * length)
      const yCf = length - drop * 0.4
      const k = length / 3
      const seam = new Path().move(C.clone()).curve(new Point(C.x + d.x * k + n.x * round, C.y + d.y * k + n.y * round), new Point(E.x - d.x * k + n.x * round, E.y - d.y * k + n.y * round), E.clone())
      const edge = new Path().move(new Point(0, 0)).line(new Point(-facing, 0)).line(new Point(-facing, yCf))
      const w = E.x
      const hem = new Path()
        .move(new Point(-facing, yCf))
        .line(new Point(0, yCf))
        .curve(new Point(w / 3, yCf), new Point(E.x - (d.y * w) / 3, E.y + (d.x * w) / 3), E.clone())
      const up = seam.clone().reverse()
      paths.seam = edge.clone().join(hem).join(up).join(top).close().addClass('fabric')
      if (sa) {
        let o = null
        for (const [p, m] of [[edge, 1], [hem, 2], [up, 1], [top, 1]]) {
          const off = p.offset(sa * m)
          o = o ? o.line(off.start()).join(off) : off
        }
        paths.sa = o.close().addClass('fabric sa')
      }
      paths.foldLine = new Path().move(new Point(0, 0)).line(new Point(0, yCf)).addClass('mark dotted').addText('fold', 'center text-sm')
      store.set('blouse.skirt', { top: top.length(), bottom, back: seam.length() })
      macro('grainline', { from: new Point(w * 0.15, yCf - 40), to: new Point(w * 0.15, 40) })
      store.cutlist.setCut({ cut: 2, from: 'fabric' })
      title(macro, { at: new Point(w * 0.4, yCf * 0.45), nr, title: 'skirt', scale: 0.6 })
      return part
    },
  }
}

/**
 * What coat.mjs's lining parts read from a Brian back or front, rebuilt on a body3 back or
 * front (`which`): `points.hem` at the seam's hem and `paths.bodyBase`, from there up the seam
 * and armhole to the neck point; on the back `paths.saBase` carries on round the neck to CB.
 */
function liningBase(sh, which) {
  const { points, paths, Path, store } = sh
  const left = flipPathX(store.get(`blouse.${which}`).right, points.seamStart.x, Path)
  const upperArm = paths.armholeFull.split(points.seamStart)[1]
  points.hem = points.seamHem
  paths.bodyBase = left.reverse().join(upperArm).line(points.s3CollarSplit).hide()
  if (which === 'back') paths.saBase = paths.bodyBase.clone().join(paths.backCollar).hide()
}

/**
 * The front lining of a three-piece body (`from` the front): coat.mjs's, from the facing's
 * inner edge to the forepart's seam (the side body is cut again from lining). The facing must
 * run to the shoulder (a lapel, or `toShoulder`). `pocket(sh)`: an inside breast pocket's
 * opening length (0: none), level at the chest line from the facing's edge, kept `clear` of
 * the seam; its welt `welt` and bag `bag` x the length, in store `blouse.insideWelts.inside`.
 */
export function body3FrontLiningPart({ name, from, after, nr, pocket = () => 0, welt = 0.18, bag = 1.3, clear = 0, enabled = () => true }) {
  const lining = frontLiningPart({ name, from, after, nr, enabled })
  return {
    ...lining,
    draft: (sh) => {
      const { points, paths, Path, Point, store, options, part } = sh
      if (!enabled(options)) return lining.draft(sh)
      // The seam's forepart edge, kept before the lining part clears the inherited paths
      const left = flipPathX(store.get('blouse.front').right, points.seamStart.x, Path)
      liningBase(sh, 'front')
      lining.draft(sh)
      const len = pocket(sh)
      if (len > 0) {
        const { ext, facing } = store.get('coat.frontEdge')
        const x = -ext + facing
        const y = points.armhole.y
        const max = (left.intersectsY(y)[0] || points.seamHem).x - clear
        const p = { x, y, len: Math.min(len, max - x) }
        p.welt = p.len * welt
        p.bag = p.len * bag
        store.set('blouse.insideWelts', { inside: p })
        points.insideWeltA = new Point(p.x, p.y)
        points.insideWeltB = new Point(p.x + p.len, p.y)
        paths.insideWelt = new Path().move(points.insideWeltA).line(points.insideWeltB).addClass('mark')
      }
      return part
    },
  }
}

/** The back lining of a three-piece body (`from` the back): coat.mjs's, CB to the back seam */
export function body3BackLiningPart(args) {
  const lining = backLiningPart(args)
  const enabled = args.enabled ?? (() => true)
  return {
    ...lining,
    draft: (sh) => {
      if (enabled(sh.options)) liningBase(sh, 'back')
      return lining.draft(sh)
    },
  }
}

/**
 * A part from FreeSewing's library as is (e.g. the two-part sleeve), with its logo removed.
 * `vent(sh)`: on the two-part sleeve, { length, width, buttons } for a closed vent at the hem
 * of the back (elbow) seam, or null; see `sleeveVent`.
 */
export function libraryPart({ name, from, after, options, lining = false, vent = () => null }) {
  return {
    name,
    from,
    after,
    hide: hidePresets.HIDE_TREE,
    options,
    draft: (sh) => {
      const { snippets, store, options, part } = sh
      delete snippets.logo
      // Cut again from lining (a lined jacket's sleeves)
      if (lining && lining(options)) store.cutlist.addCut({ cut: 2, from: 'lining' })
      const v = vent(sh)
      if (v) sleeveVent(sh, from.name === 'library.topsleeve' ? 'ts' : 'us', v)
      return part
    },
  }
}

/**
 * A closed sleeve vent on the two-part sleeve's top (`ts`) or under (`us`) sleeve: the back
 * seam's last `length` above the wrist extended `width` out (square to the seam) to the hem
 * line, its top cut at 45 degrees; the top sleeve carries `buttons` buttons, the lowest a third
 * of the way up.
 * Both pieces get the same extension, so the back seam still matches.
 */
function sleeveVent({ points, paths, Path, sa, snippets, Snippet }, s, { length, width, buttons = 0 }) {
  const W = points[`${s}WristRight`]
  const L = points[`${s}WristLeft`]
  const rad = (deg) => (deg * Math.PI) / 180
  const up = W.angle(points.elbowRight)
  const hem = L.angle(W) // along the hem, away from the sleeve
  // Square to the seam, on the hem's side: the lap is `width` out from the seam on both sleeves
  const out = Math.cos(rad(up - 90 - hem)) > 0 ? up - 90 : up + 90
  points.ventTop = W.shift(up, length)
  points.ventHem = W.shift(hem, width / Math.abs(Math.sin(rad(hem - up))))
  points.ventCorner = points.ventTop.shift(out, width).shift(up + 180, width)
  // The library's seam starts move(wrist right), line(elbowRight) and ends line(wrist left),
  // line(wrist right), close
  const rest = new Path()
  rest.ops = paths.seam.ops.slice(1, -1)
  const body = new Path().move(points.ventHem).line(points.ventCorner).line(points.ventTop)
  body.ops.push(...rest.ops)
  paths.seam = body.close().unhide().setClass('fabric')
  if (sa) {
    const open = new Path()
    open.ops = body.ops.slice(0, -2) // ventHem ... wrist left (less the hem and the close)
    const hem = new Path().move(L).line(points.ventHem) // W is on this line
    paths.sa = open.offset(sa).join(hem.offset(sa * 3)).close().setClass('fabric sa')
  }
  paths.ventFold = new Path().move(W).line(points.ventTop).addClass('help dashed')
  if (s === 'ts') {
    for (let i = 0; i < buttons; i++) {
      const at = length * (buttons > 1 ? 0.3 + (0.4 * i) / (buttons - 1) : 0.4)
      snippets[`ventButton${i}`] = new Snippet('button', W.shift(up, at).shift(out + 180, width / 2))
    }
  }
}

/** A welt for welt pocket `key` (in store `blouse.welts`, or `store`), cut on the fold */
export function weltPart({ name, after, key, nr, store: storeKey = 'blouse.welts', enabled = () => true }) {
  return {
    name,
    after,
    draft: ({ paths, Path, Point, store, sa, macro, options, part }) => {
      if (!enabled(options)) return part.hide()
      const w = store.get(storeKey)[key]
      const L = w.len + 20 // past the opening each end
      paths.seam = new Path()
        .move(new Point(L, 0))
        .line(new Point(0, 0))
        .line(new Point(0, 2 * w.welt))
        .line(new Point(L, 2 * w.welt))
        .close()
        .addClass('fabric')
      paths.fold = new Path().move(new Point(0, w.welt)).line(new Point(L, w.welt)).addClass('help dashed')
      if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
      store.cutlist.setCut([
        { cut: 2, from: 'fabric' },
        { cut: 2, from: 'interfacing' },
      ])
      title(macro, { at: new Point(L * 0.3, w.welt * 0.3), nr, title: `${key}Welt`, scale: 0.25 })
      return part
    },
  }
}

/** The pocket bag for welt pocket `key`: rounded bottom corners, cut 4 from lining */
export function weltBagPart({ name, after, key, nr, store: storeKey = 'blouse.welts', enabled = () => true }) {
  return {
    name,
    after,
    draft: ({ paths, Path, Point, store, sa, macro, options, part }) => {
      if (!enabled(options)) return part.hide()
      const w = store.get(storeKey)[key]
      const W = w.len + 30
      const r = W * 0.2
      paths.seam = new Path()
        .move(new Point(W, 0))
        .line(new Point(0, 0))
        .line(new Point(0, w.bag - r))
        .curve(new Point(0, w.bag - r * 0.45), new Point(r * 0.45, w.bag), new Point(r, w.bag))
        .line(new Point(W - r, w.bag))
        .curve(new Point(W - r * 0.45, w.bag), new Point(W, w.bag - r * 0.45), new Point(W, w.bag - r))
        .close()
        .addClass('fabric')
      if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
      store.cutlist.setCut({ cut: 4, from: 'lining' })
      title(macro, { at: new Point(W * 0.3, w.bag * 0.3), nr, title: `${key}PocketBag`, scale: 0.3 })
      return part
    },
  }
}
