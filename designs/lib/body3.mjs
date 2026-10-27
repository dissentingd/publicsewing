// A three-piece coat body (Simons, Diagram XIV, the military blouse): back, side body and
// forepart. Two seams replace the side seam: one from the back armhole, one from the front
// armhole, each taking in the waist and letting out over the seat. Each seam's two edges
// mirror each other about a vertical line, so they are the same length by construction.
// Built on Bent (Brian with a two-piece sleeve). Reads the options waistEase, seatEase,
// backShare (the back seam's share of the waist suppression) and lengthBelowWaist.
// Store: `blouse.back`, `blouse.front`, `blouse.sideBody`, `blouse.welts`.
import { hidePresets } from '@freesewing/core'
import { cleanup, armhole, title, placeButtons, BRAND } from './coat.mjs'

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
  store.set('blouse.back', { right, lowerArm, S, hemY, seam: left.length() })
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
    const h = hem.offset(sa * 3)
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
 */
export function draftBody3Front(sh, { seamAt = 0.12, ext, drop, facing, buttons, welts = {}, clear = 0, welt = 0.2, nr = 1 }) {
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
  store.set('coat.frontEdge', { ext, facing, r: 0, drop })
  points.edgeNeck = new Point(-ext, points.cfNeck.y)
  points.edgeHem = new Point(-ext, hemY + drop)
  points.cornerTop = points.edgeHem
  paths.edge = new Path().move(points.edgeNeck).line(points.edgeHem).hide()
  const d = points.edgeHem.dx(points.seamHem)
  paths.hemBase = new Path()
    .move(points.edgeHem)
    .curve(points.edgeHem.shift(0, d * 0.4), points.seamHem.shift(180, d * 0.4), points.seamHem)
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
    const hem = paths.hemBase.offset(sa * 3)
    const rest = outline.split(points.seamHem)[1].offset(sa)
    paths.sa = e.line(hem.start()).join(hem).line(rest.start()).join(rest).line(e.start()).addClass('fabric sa')
  }
  paths.cf = new Path().move(points.cfNeck).line(points.cfHem).addClass('help dashed')
  // For the facing: the neckline from the front edge to the shoulder
  paths.neckline = new Path().move(points.edgeNeck).line(points.cfNeck).join(paths.frontCollar.reverse()).hide()
  placeButtons(sh, { ...buttons, rows: [0] })

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
  macro('grainline', {
    from: points.cfHem.shift(90, 30).shift(0, S * 0.2),
    to: points.cfNeck.shift(-90, 30).shift(0, S * 0.2),
  })
  store.cutlist.setCut({ cut: 2, from: 'fabric' })
  title(macro, { at: new Point(points.seamStart.x * 0.4, waistY), nr, title: 'front' })
  snippets.seamStart = new Snippet('notch', points.seamStart)
  snippets.waist = new Snippet('notch', left.intersectsY(waistY)[0] || points.seamStart)
  return part
}

/**
 * The side body: the back's strip beyond its seam and the front's strip beyond its seam,
 * joined where the side seam would be (x = S), the front half mirrored about that line.
 * Drawn in the back's coordinates.
 */
export function sideBodyPart({ name, after, nr = 3 }) {
  return {
    name,
    after,
    draft: ({ points, paths, Path, Point, store, sa, macro, part }) => {
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
        const hem = new Path().move(points.backHem).line(points.frontHem).offset(sa * 3)
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
      title(macro, { at: points.mid.shift(0, 10), nr, title: 'sideBody', scale: 0.5 })
      return part
    },
  }
}

/** A part from FreeSewing's library as is (e.g. the two-part sleeve), with its logo removed */
export function libraryPart({ name, from, after, options, lining = false }) {
  return {
    name,
    from,
    after,
    hide: hidePresets.HIDE_TREE,
    options,
    draft: ({ snippets, store, options, part }) => {
      delete snippets.logo
      // Cut again from lining (a lined jacket's sleeves)
      if (lining && lining(options)) store.cutlist.addCut({ cut: 2, from: 'lining' })
      return part
    },
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
