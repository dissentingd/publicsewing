// A yoked skirt with gores on FreeSewing's Sarah skirt block. The half skirt, CB (x = 0) to CF, is
// cut at a yoke line `depth` below the waist. Above it, the waist darts are carried down to the
// yoke line (each dart's point on it, as far from both dart legs) and closed, pivoting each section
// on the dart's point, so the front and back yokes are smooth. Below it, the back and the front are
// each cut into two gores at a line halfway across, and every gore edge flares out `flare` (mm) at
// the hem from `flareFrom` x the length down. The yokes and the back and front gores are cut on
// the fold; the side gores in pairs; the zip goes in the left side seam. Store: `skirt.yoke`
// (geometry), `skirt.yokeSeams` (lengths), `skirt.waist`.
import { cleanup, title } from './coat.mjs'

const P = (p) => ({ x: p.x, y: p.y })
const rot = (p, c, a) => {
  const dx = p.x - c.x
  const dy = p.y - c.y
  return { x: c.x + dx * Math.cos(a) - dy * Math.sin(a), y: c.y + dx * Math.sin(a) + dy * Math.cos(a) }
}
const ang = (c, p) => Math.atan2(p.y - c.y, p.x - c.x)
// A segment: { from, to } (a line) or { from, cp1, cp2, to } (a curve), plain points
const rotSeg = (s, c, a) => Object.fromEntries(Object.entries(s).map(([k, p]) => [k, rot(p, c, a)]))
const rev = (s) => (s.cp1 ? { from: s.to, cp1: s.cp2, cp2: s.cp1, to: s.from } : { from: s.to, to: s.from })
const line = (from, to) => ({ from: P(from), to: P(to) })

/** A FreeSewing path through a list of segments */
function toPath(Path, Point, segs) {
  const pt = (q) => new Point(q.x, q.y)
  const path = new Path().move(pt(segs[0].from))
  for (const s of segs) s.cp1 ? path.curve(pt(s.cp1), pt(s.cp2), pt(s.to)) : path.line(pt(s.to))
  return path
}

/** A path's segments, from its ops */
function segsOf(path) {
  const out = []
  let at = null
  for (const op of path.ops) {
    if (op.type === 'move') at = P(op.to)
    else if (op.type === 'line') out.push({ from: at, to: (at = P(op.to)) })
    else if (op.type === 'curve') out.push({ from: at, cp1: P(op.cp1), cp2: P(op.cp2), to: (at = P(op.to)) })
  }
  return out
}

/** A side seam (top down) split at the yoke line: [upper, lower] segments and the point */
function splitSide(Path, Point, path, y) {
  const at = path.intersectsY(y)[0]
  const [upper, lower] = path.split(at)
  return { upper: segsOf(upper), lower: segsOf(lower), at: P(at) }
}

/**
 * A side seam from the waist down to the seat line through Sarah's points. Where it's straight (a
 * waist as wide as the seat), a line: Sarah's control points then lie out of order and the curve
 * doubles back on itself.
 */
function sidePath(Path, top, cpT, mid, cpB, seat) {
  if ([cpT, mid, cpB, seat].every((q) => Math.abs(q.x - top.x) < 1)) return new Path().move(top).line(seat)
  return new Path().move(top).curve(cpT, cpT, mid).curve(cpB, cpB, seat)
}

/** A dart's point on the yoke line, as far from both legs at the waist */
function apexOn(L, R, y) {
  // No intake (a waist as wide as the seat): the dart is a line
  if (Math.abs(R.x - L.x) < 0.01) return { x: (L.x + R.x) / 2, y }
  const x = (R.x * R.x - L.x * L.x + (y - R.y) ** 2 - (y - L.y) ** 2) / (2 * (R.x - L.x))
  return { x, y }
}

/**
 * Lay out the yoke and gores on Sarah's base: `depth` (mm) the yoke line below the waist at CB and
 * CF, `flare` (mm) each gore edge's flare at the hem, from `flareFrom` x the length below the waist
 * (never above the seat line).
 */
export function draftYokeLayout(sh, { depth, flare, flareFrom }) {
  const { points: p, Path, Point, store, part } = sh
  cleanup(sh)
  const hS = p.cbSeat.y - p.cbTop.y
  const Y = Math.min(Math.max(depth, 20), hS * 0.95)
  const L = store.get('sarah.length')
  const yB = Math.max(L * flareFrom, hS)
  const F = Math.max(0, flare)

  // Back: CB (x = 0) to the side; darts inside (nearer CB) and outside
  const sideB = splitSide(Path, Point, sidePath(Path, p.sbTop, p.sshTCp, p.sshCpC, p.sshBCp, p.sideSeat), Y)
  const aI = apexOn(p.backInsideDartLeft, p.backInsideDartRight, Y)
  const aO = apexOn(p.backOutsideDartLeft, p.backOutsideDartRight, Y)
  // Each section's waist, CB-ward end first, then the angle that closes the dart on its CB side
  const wC = rev({ from: P(p.backInsideDartLeft), cp1: P(p.bidLCp), cp2: P(p.cbTopCp), to: P(p.cbTop) }) // cbTop -> bidL
  const wB = rev({ from: P(p.backOutsideDartLeft), cp1: P(p.bodLCp), cp2: P(p.bidRCp), to: P(p.backInsideDartRight) }) // bidR -> bodL
  const wA = rev({ from: P(p.sbTop), cp1: P(p.sbtCp), cp2: P(p.bodRCp), to: P(p.backOutsideDartRight) }) // bodR -> sbTop
  const tI = ang(aI, p.backInsideDartLeft) - ang(aI, p.backInsideDartRight)
  const tO = ang(aO, p.backOutsideDartLeft) - ang(aO, p.backOutsideDartRight)
  // The middle section turns on the inside dart's point; the side section on the outside dart's,
  // then with the middle
  const s1 = (q) => rotSeg(q, aI, tI)
  const s2 = (q) => rotSeg(rotSeg(q, aO, tO), aI, tI)
  const aO2 = rot(aO, aI, tI)
  const back = {
    // Counter-clockwise on the page: the waist from the side to CB, down CB, the yoke line, up the side
    waist: [rev(s2(wA)), rev(s1(wB)), rev(wC)],
    cb: line({ x: 0, y: p.cbTop.y }, { x: 0, y: Y }),
    bottom: [line({ x: 0, y: Y }, aI), line(aI, aO2), line(aO2, rot(rot(sideB.at, aO, tO), aI, tI))],
    side: sideB.upper.map((q) => s2(q)).reverse().map(rev),
  }

  // Front: the side to CF; one dart, its side section turned on the dart's point
  const sideF = splitSide(Path, Point, sidePath(Path, p.sfTop, p.sfhTCp, p.sfhCpC, p.sfhBCp, p.sideSeat), Y)
  const aF = apexOn(p.frontDartLeft, p.frontDartRight, Y)
  const tF = ang(aF, p.frontDartRight) - ang(aF, p.frontDartLeft)
  const f0 = (q) => rotSeg(q, aF, tF)
  const wFc = { from: P(p.cfTop), cp1: P(p.cftCp), cp2: P(p.fdrCp), to: P(p.frontDartRight) } // cfTop -> fdR
  const wFs = { from: P(p.frontDartLeft), cp1: P(p.fdlCp), cp2: P(p.sftCp), to: P(p.sfTop) } // fdL -> sfTop
  const X = p.cfTop.x
  const front = {
    // Counter-clockwise: the waist from CF to the side, down the side, the yoke line, up CF
    waist: [wFc, f0(wFs)],
    side: sideF.upper.map((q) => f0(q)),
    bottom: [line(rot(sideF.at, aF, tF), aF), line(aF, { x: X, y: Y })],
    cf: line({ x: X, y: Y }, { x: X, y: p.cfTop.y }),
  }

  // Gores: the back and the front each cut halfway across the yoke line
  const xb = sideB.at.x
  const xf = sideF.at.x
  const gb = xb / 2
  const gf = (xf + X) / 2
  const sx = p.sideSeat.x
  const flared = (x, dir) => [line({ x, y: Y }, { x, y: yB }), line({ x, y: yB }, { x: x + dir * F, y: L })]
  // Each gore counter-clockwise: the top right to left, down the left edge, the hem, up the right
  const gore = (top, left, right, folds = {}) => ({ top, left, hem: line(left.at(-1).to, right[0].from), right, ...folds })
  const sideBackDown = [...sideB.lower, line(p.sideSeat, { x: sx, y: yB }), line({ x: sx, y: yB }, { x: sx + F, y: L })] // the side seam, down
  const sideFrontDown = [...sideF.lower, line(p.sideSeat, { x: sx, y: yB }), line({ x: sx, y: yB }, { x: sx - F, y: L })]
  const gores = {
    back: gore(line({ x: gb, y: Y }, { x: 0, y: Y }), [line({ x: 0, y: Y }, { x: 0, y: L })], flared(gb, 1).reverse().map(rev), { leftFold: true }),
    sideBack: gore(line(sideB.at, { x: gb, y: Y }), flared(gb, -1), sideBackDown.slice().reverse().map(rev)),
    sideFront: gore(line({ x: gf, y: Y }, sideF.at), sideFrontDown, flared(gf, 1).reverse().map(rev)),
    front: gore(line({ x: X, y: Y }, { x: gf, y: Y }), flared(gf, -1), [line({ x: X, y: L }, { x: X, y: Y })], { rightFold: true }),
  }
  store.set('skirt.yoke', { back, front, gores, Y, yB, L, F, sideY: { back: sideB.at, front: sideF.at } })
  // The whole waist: the yokes' tops, closed, both halves
  const len = (segs) => toPath(Path, Point, segs).length()
  store.set('skirt.waist', 2 * (len(back.waist) + len(front.waist)))
  return part.hide()
}

/** Draw a piece from its edges, each { segs, sa } (sa: 0 on the fold, else mm), counter-clockwise */
function drawPiece(sh, edges) {
  const { paths, Path, Point } = sh
  const parts = edges.map((e) => ({ ...e, path: toPath(Path, Point, e.segs) }))
  let seam = null
  for (const e of parts) seam = seam ? seam.join(e.path) : e.path
  paths.seam = seam.close().addClass('fabric')
  if (sh.sa) {
    let out = null
    for (const e of parts) {
      const o = e.sa ? e.path.offset(e.sa) : e.path
      out = out ? out.line(o.start()).join(o) : o
    }
    paths.sa = out.close().addClass('fabric sa')
  }
  return parts
}

const lengths = (sh, segs) => toPath(sh.Path, sh.Point, segs).length()

/** The front or back yoke (`which`), on the fold */
export function yokePart({ name, after, which, nr, label }) {
  return {
    name,
    after,
    draft: (sh) => {
      const { Point, store, sa, macro, part } = sh
      const y = store.get('skirt.yoke')[which]
      const edges =
        which === 'back'
          ? [{ segs: y.waist, sa }, { segs: [y.cb], sa: 0 }, { segs: y.bottom, sa }, { segs: y.side, sa }]
          : [{ segs: y.waist, sa }, { segs: y.side, sa }, { segs: y.bottom, sa }, { segs: [y.cf], sa: 0 }]
      drawPiece(sh, edges)
      const fold = which === 'back' ? y.cb : y.cf
      macro('cutonfold', { from: new Point(fold.from.x, Math.min(fold.from.y, fold.to.y) + 10), to: new Point(fold.to.x, Math.max(fold.from.y, fold.to.y) - 10), grainline: true })
      store.cutlist.setCut({ cut: 1, from: 'fabric', onFold: true })
      const seams = store.get('skirt.yokeSeams', null) ?? {}
      seams[`${which}Yoke`] = { waist: lengths(sh, y.waist), side: lengths(sh, y.side), bottom: lengths(sh, y.bottom) }
      store.set('skirt.yokeSeams', seams)
      const xs = y.bottom.flatMap((s) => [s.from.x, s.to.x])
      const mid = (Math.min(...xs) + Math.max(...xs)) / 2
      title(macro, { at: new Point(mid - 40, y.bottom[0].from.y * 0.45), nr, title: label, scale: 0.35 })
      return part
    },
  }
}

/** A gore below the yoke (`which`: back, sideBack, sideFront, front); `zip` (mm below the waist) notches the zip's end on the left side seam */
export function yokeGorePart({ name, after, which, nr, label, zip = () => 0 }) {
  return {
    name,
    after,
    draft: (sh) => {
      const { points, Point, Snippet, snippets, store, sa, macro, part } = sh
      const yk = store.get('skirt.yoke')
      const g = yk.gores[which]
      const hem = store.get('sarah.hem')
      drawPiece(sh, [
        { segs: [g.top], sa },
        { segs: g.left, sa: g.leftFold ? 0 : sa },
        { segs: [g.hem], sa: hem },
        { segs: g.right, sa: g.rightFold ? 0 : sa },
      ])
      // The balance points where the flare starts, on the gore line
      const at = (segs, y) => segs.flatMap((s) => [s.from, s.to]).find((q) => Math.abs(q.y - y) < 0.01)
      for (const [k, segs, fold] of [['left', g.left, g.leftFold], ['right', g.right, g.rightFold]]) {
        if (fold) continue
        const q = at(segs, yk.yB)
        if (q) snippets[`${k}Balance`] = new Snippet('notch', (points[`${k}Balance`] = new Point(q.x, q.y)))
      }
      // The zip's end on the side seam
      const z = zip(sh)
      const side = which === 'sideBack' ? g.right : which === 'sideFront' ? g.left : null
      if (side && z > yk.Y + 10) {
        const path = toPath(sh.Path, Point, side)
        const hit = path.intersectsY(Math.min(z, yk.yB - 10))[0]
        if (hit) snippets.zip = new Snippet('notch', (points.zip = hit))
      }
      const fold = g.leftFold ? g.left[0] : g.rightFold ? g.right[0] : null
      if (fold) {
        macro('cutonfold', { from: new Point(fold.from.x, yk.Y + 20), to: new Point(fold.to.x, yk.L - 20), grainline: true })
        store.cutlist.setCut({ cut: 1, from: 'fabric', onFold: true })
      } else {
        const x = (g.top.from.x + g.top.to.x) / 2
        macro('grainline', { from: new Point(x, yk.Y + 40), to: new Point(x, yk.L - 40) })
        store.cutlist.setCut({ cut: 2, from: 'fabric' })
      }
      const seams = store.get('skirt.yokeSeams', null) ?? {}
      seams[which] = { top: lengths(sh, [g.top]), left: lengths(sh, g.left), right: lengths(sh, g.right), hem: lengths(sh, [g.hem]) }
      store.set('skirt.yokeSeams', seams)
      const x = (g.top.from.x + g.top.to.x) / 2
      title(macro, { at: new Point(x - 30, (yk.Y + yk.yB) / 2), nr, title: label, scale: 0.4 })
      return part
    },
  }
}
