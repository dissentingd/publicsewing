// Jeans on the tailored trouser leg (lib/trousers.mjs, with `keepOutline`): a contour waistband cut
// off the top of the legs, a back yoke with the dart closed in it, a scooped front pocket with its
// facing, coin pocket and bag, and patch back pockets marked on the leg. Inspired by Joseph-Armstrong
// (2010) and Aldrich (2015): methods and proportions only. Store `jeans.*`.
import { title } from './coat.mjs'

// A path as plain data, and back, so another part can draw it (`jeans.pieces.<key>`)
const ser = (path) =>
  path.ops.map((o) =>
    o.type === 'curve' ? ['curve', [o.cp1.x, o.cp1.y], [o.cp2.x, o.cp2.y], [o.to.x, o.to.y]] : o.type === 'close' ? ['close'] : [o.type, [o.to.x, o.to.y]],
  )
function deser(Path, Point, ops) {
  let p = new Path()
  for (const [type, ...pts] of ops) {
    const P = pts.map(([x, y]) => new Point(x, y))
    if (type === 'move') p = p.move(P[0])
    else if (type === 'line') p = p.line(P[0])
    else if (type === 'curve') p = p.curve(P[0], P[1], P[2])
    else if (type === 'close') p = p.close()
  }
  return p
}
const xy = (p) => [p.x, p.y]
// Of the two directions square to `u`, the one going down the page (FreeSewing's y grows downward)
const downOf = (Point, u) => (new Point(0, 0).shift(u + 90, 1).y > 0 ? u + 90 : u - 90)

// Where line a-b meets line c-d (both taken as infinite)
function meet(Point, a, b, c, d) {
  const den = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x)
  if (Math.abs(den) < 1e-9) return null
  const t = ((a.x - c.x) * (c.y - d.y) - (a.y - c.y) * (c.x - d.x)) / den
  return new Point(a.x + t * (b.x - a.x), a.y + t * (b.y - a.y))
}

// A path's part between two points on it (from `a` to `b`, in its own direction)
const between = (path, a, b) => path.split(a)[1].split(b)[0]

// Offset each segment by its allowance and join the ends with straight lines (as trouserLeg)
function allowance(segs, sa) {
  let o
  for (const [p, k] of segs) {
    const off = p.offset(sa * k)
    o = o ? o.line(off.start()).join(off) : off
  }
  return o.close()
}

/**
 * Cut a tailored leg (trouserLeg with `keepOutline`) into jeans pieces ('back' | 'front'):
 * - `band`: the contour waistband's depth, cut off the top (measured down the CB/CF and outseam).
 * - Back: `yokeIn`, `yokeOut`: the yoke seam this far down the seat seam and the outseam from the
 *   waist; the dart, its point moved onto the yoke seam, closed in the yoke (`jeans.pieces.yoke`).
 *   A patch pocket `pocketW` wide at the top, `pocketBottom` across its lower corners, `pocketD`
 *   deep to its point, `pocketPoint` below the corners, `pocketBelow` under the yoke seam, centred
 *   on the dart, marked with rivets at its top corners.
 * - Front (each depth measured down the outseam from the leg's top, the band line):
 *   the pocket mouth scooped from `entryW` along the top in from the side to `entryD` down the outseam; the bag `bagW` wide and `bagD` deep (`jeans.pieces.bag`, and `bagEntry` cut to the
 *   mouth), the facing `facingD` deep (`jeans.pieces.facing`) with a coin pocket `coinW` by `coinH`
 *   marked `coinInset` in from the side and `coinTop` down (`coin` false for none).
 * Lengths go to `jeans.<which>`: the band's `top` and `bottom` (less the dart), `outseam` below the band.
 */
export function draftJeanLeg(sh, args) {
  const { which, band: band0 = 38, rivets = true } = args
  const { points, paths, Path, Point, store, sa, snippets, Snippet } = sh
  const back = which === 'back'
  const o = store.get(`trousers.outline.${which}`)
  if (!o) throw new Error('jeanLeg needs trouserLeg with keepOutline first')
  const { crotch, outseam, inseam, hem, hemAllowance } = o
  const band = Math.min(Math.max(band0, 5), crotch.length() * 0.4, outseam.length() * 0.2)
  const bIn = crotch.shiftAlong(band)
  const bOut = outseam.shiftAlong(band)
  // Down, square to the band line, and along it from the side toward the centre
  const along = bOut.angle(bIn)
  const down = downOf(Point, along)
  const { wIn, wOut, dartIn, dartOut, dartTip } = points
  const dartW = dartIn.dist(dartOut)
  const info = { top: wOut.dist(dartOut) + dartIn.dist(wIn), outseam: outseam.length() - band }
  const rivet = (key, p) => {
    if (rivets) snippets[key] = new Snippet('button', p).attr('data-scale', 0.5)
  }
  for (const k of ['seam', 'sa', 'fly', 'backPocket', 'waistLine']) delete paths[k]
  for (const k of Object.keys(snippets)) if (/^(pocket|backPocket|dart)/.test(k)) delete snippets[k]
  const pieces = store.get('jeans.pieces', null) ?? {}

  if (back) {
    const yIn = Math.min(Math.max(args.yokeIn ?? band * 2, band + 10), crotch.length() * 0.6)
    const yOut = Math.min(Math.max(args.yokeOut ?? band * 1.7, band + 10), outseam.length() * 0.3)
    points.yokeIn = crotch.shiftAlong(yIn)
    points.yokeOut = outseam.shiftAlong(yOut)
    const YI = points.yokeIn
    const YO = points.yokeOut
    // The dart's point on the yoke seam, and its legs where they cross the band line
    let T, BDI, BDO
    if (dartW > 0.5) {
      const c = dartIn.shiftFractionTowards(dartOut, 0.5)
      T = meet(Point, c, dartTip, YI, YO) ?? YI.shiftFractionTowards(YO, 0.5)
      BDI = meet(Point, dartIn, T, bIn, bOut)
      BDO = meet(Point, dartOut, T, bIn, bOut)
    } else {
      T = meet(Point, dartIn, dartIn.shift(down, 10), YI, YO) ?? YI.shiftFractionTowards(YO, 0.5)
      BDI = BDO = meet(Point, dartIn, dartIn.shift(down, 10), bIn, bOut) ?? bIn.shiftFractionTowards(bOut, 0.5)
    }
    points.yokeDart = T
    info.bottom = bIn.dist(BDI) + BDO.dist(bOut)
    // The leg below the yoke: yoke seam > seat seam > inseam > hem > outseam
    const seat = crotch.split(YI)[1]
    const side = outseam.split(YO)[1]
    const yokeSeam = new Path().move(YO).line(YI)
    paths.seam = yokeSeam.clone().join(seat).join(inseam).join(hem).join(side.reverse()).close().addClass('fabric')
    if (sa) paths.sa = allowance([[yokeSeam, 1], [seat, 1], [inseam, 1], [hem, hemAllowance], [side.reverse(), 1]], sa).addClass('fabric sa')
    snippets.yokeDart = new Snippet('notch', T)
    // The yoke: the outer part turned about the dart's point to close it
    const a = T.angle(BDI) - T.angle(BDO)
    const r = (p) => p.rotate(a, T)
    const yokeSide = between(outseam, bOut, YO)
    let yoke = new Path().move(bIn).line(BDI).line(r(bOut))
    for (const op of yokeSide.ops.slice(1)) yoke = op.type === 'curve' ? yoke.curve(r(op.cp1), r(op.cp2), r(op.to)) : yoke.line(r(op.to))
    yoke = yoke.line(T).line(YI).join(between(crotch, bIn, YI).reverse()).close()
    pieces.yoke = { ops: ser(yoke), notches: [xy(T), xy(BDI)], grain: [xy(T.shift(-90, 5)), xy(T.shift(-90, Math.max(10, T.y - BDI.y - 5)))] }
    info.yokeTop = info.bottom
    info.yokeSide = yokeSide.length()
    info.yokeSeat = between(crotch, bIn, YI).length()
    info.yokeBottom = YI.dist(T) + T.dist(YO)
    info.legTop = YI.dist(YO)
    // The patch pocket, its top square to the yoke seam's direction, centred on the dart
    const { pocketW = 0, pocketBottom = 0, pocketD = 0, pocketPoint = 0, pocketBelow = 0 } = args
    if (pocketW > 0 && pocketD > 0) {
      const u = YI.angle(YO)
      const n = downOf(Point, u)
      const top = T.shift(n, pocketBelow)
      const pts = [
        top.shift(u + 180, pocketW / 2),
        top.shift(u, pocketW / 2),
        top.shift(u, pocketBottom / 2).shift(n, pocketD - pocketPoint),
        top.shift(n, pocketD),
        top.shift(u + 180, pocketBottom / 2).shift(n, pocketD - pocketPoint),
      ]
      let pk = new Path().move(pts[0])
      for (const p of pts.slice(1)) pk = pk.line(p)
      paths.backPocket = pk.close().addClass('mark dashed')
      rivet('rivetBack0', pts[0].shiftFractionTowards(pts[4], 0.04))
      rivet('rivetBack1', pts[1].shiftFractionTowards(pts[2], 0.04))
      info.pocket = { top: pts[0].dist(pts[1]), depth: pocketD }
    }
  } else {
    const { entryW = 0, entryD = 0, bagW = 0, bagD = 0, facingD = 0, coin = true, coinW = 0, coinH = 0, coinInset = 0, coinTop = 0 } = args
    info.bottom = bIn.dist(bOut)
    const width = bIn.dist(bOut)
    const eW = Math.min(Math.max(entryW, 10), width * 0.6)
    const bW = Math.min(Math.max(bagW, eW + 10), width * 0.85)
    const sideFrom = (d) => outseam.shiftAlong(Math.min(d, outseam.length() * 0.4))
    points.entryTop = bOut.shift(along, eW)
    points.entryBottom = sideFrom(band + Math.max(entryD, 10))
    const E1 = points.entryTop
    const E2 = points.entryBottom
    const drop = Math.abs(meet(Point, E2, E2.shift(along, 10), E1, E1.shift(down, 10))?.dist(E1) ?? E2.dist(E1))
    const scoop = new Path().move(E1).curve(E1.shift(down, drop * 0.7), E2.shift(along, eW * 0.45), E2)
    const sideLow = outseam.split(E2)[1]
    const centre = crotch.split(bIn)[1]
    const top = new Path().move(bIn).line(E1)
    paths.seam = sideLow.clone().join(hem.reverse()).join(inseam.reverse()).join(centre.reverse()).join(top).join(scoop).close().addClass('fabric')
    if (sa) paths.sa = allowance([[sideLow, 1], [hem.reverse(), hemAllowance], [inseam.reverse(), 1], [centre.reverse(), 1], [top, 1], [scoop, 1]], sa).addClass('fabric sa')
    // The fly's stitching line from the band line down
    if (points.flyTop && points.flyTurn) {
      const ft = meet(Point, points.flyTop, points.flyTurn, bIn, bOut) ?? points.flyTop
      const f = points.flyTop.dist(points.flyTurn)
      paths.fly = new Path().move(ft).line(points.flyTurn).curve_(points.flyTurn.shift(-90, Math.min(f, points.flyTop.dist(bIn)) * 0.6 + 1), points.flyBottom).addClass('mark dashed')
      info.fly = between(crotch, bIn, points.flyBottom).length()
    }
    // Bag and facing: from `F0` along the top, down square to it, a rounded corner, across to the side
    points.bagTop = bOut.shift(along, bW)
    const F0 = points.bagTop
    const piece = (depth, entry) => {
      const S = sideFrom(band + depth)
      const C = meet(Point, F0, F0.shift(down, 10), S, S.shift(along, 10)) ?? F0.shift(down, depth - band)
      const rad = Math.min(F0.dist(C), C.dist(S)) * 0.35
      const ca = C.shift(C.angle(F0), rad)
      const cb = C.shift(C.angle(S), rad)
      let p = new Path().move(F0).line(ca).curve(ca.shiftFractionTowards(C, 0.55), cb.shiftFractionTowards(C, 0.55), cb).line(S)
      p = entry ? p.join(between(outseam, E2, S).reverse()).join(scoop.reverse()).line(F0) : p.join(between(outseam, bOut, S).reverse()).line(F0)
      return { path: p.close(), S, C }
    }
    const grain = (from, to) => [xy(new Point(from.x + (to.x - from.x) * 0.5, from.y + 5)), xy(new Point(from.x + (to.x - from.x) * 0.5, Math.max(from.y + 15, to.y - 5)))]
    // The facing always shorter than the bag, both below the mouth
    const fD = Math.max(facingD, entryD + 15, 20)
    const bD = Math.max(bagD, fD + 15)
    const bag = piece(bD, false)
    const bagEntry = piece(bD, true)
    const facing = piece(fD, false)
    pieces.bag = { ops: ser(bag.path), notches: [xy(E1), xy(E2)], grain: grain(F0, bag.C) }
    pieces.bagEntry = { ops: ser(bagEntry.path), notches: [], grain: grain(F0, bagEntry.C) }
    const marks = []
    const studs = []
    if (coin && coinW > 0 && coinH > 0) {
      const c0 = bOut.shift(along, coinInset).shift(down, coinTop)
      const c1 = c0.shift(along, coinW)
      const c2 = c1.shift(down, coinH)
      const c3 = c0.shift(down, coinH)
      marks.push([['move', xy(c0)], ['line', xy(c1)], ['line', xy(c2)], ['line', xy(c3)], ['close']])
      studs.push(xy(c0.shiftFractionTowards(c2, 0.06)), xy(c1.shiftFractionTowards(c3, 0.06)))
      info.coin = { width: coinW, height: coinH }
    }
    pieces.facing = { ops: ser(facing.path), notches: [xy(E1), xy(E2)], marks, rivets: rivets ? studs : [], grain: grain(F0, facing.C) }
    info.entry = { top: eW, scoop: scoop.length() }
    info.bagSide = between(outseam, bOut, bag.S).length()
    info.facingSide = between(outseam, bOut, facing.S).length()
  }
  store.set('jeans.pieces', pieces)
  store.set(`jeans.${which}`, info)
  return sh.part
}

/**
 * A piece drawn from `jeans.pieces.<key>` (yoke, facing, bag, bagEntry): its outline, notches,
 * marks and rivets, with a seam allowance all round.
 */
export const jeanPiecePart = ({ name, after, nr, key, label, cut = 2, material = 'fabric', enabled = () => true }) => ({
  name,
  after,
  draft: (sh) => {
    const { paths, Path, Point, store, sa, macro, options, part, snippets, Snippet } = sh
    if (!enabled(options)) return part.hide()
    const pc = store.get(`jeans.pieces.${key}`, null)
    if (!pc) return part.hide()
    paths.seam = deser(Path, Point, pc.ops).addClass('fabric')
    // The allowance on whichever side is outside: the offset whose box holds the seam's
    if (sa) {
      const box = (p) => {
        const b = p.bbox()
        return (b.bottomRight.x - b.topLeft.x) * (b.bottomRight.y - b.topLeft.y)
      }
      const [o1, o2] = [paths.seam.offset(sa), paths.seam.offset(-sa)]
      paths.sa = (box(o1) >= box(o2) ? o1 : o2).addClass('fabric sa')
    }
    ;(pc.notches ?? []).forEach((p, i) => (snippets[`notch${i}`] = new Snippet('notch', new Point(...p))))
    ;(pc.marks ?? []).forEach((m, i) => (paths[`mark${i}`] = deser(Path, Point, m).addClass('mark dashed')))
    ;(pc.rivets ?? []).forEach((p, i) => (snippets[`rivet${i}`] = new Snippet('button', new Point(...p)).attr('data-scale', 0.5)))
    const [g0, g1] = pc.grain
    macro('grainline', { from: new Point(...g1), to: new Point(...g0) })
    const bb = paths.seam.bbox()
    store.cutlist.setCut({ cut, from: material })
    title(macro, { at: new Point(bb.topLeft.x + (bb.bottomRight.x - bb.topLeft.x) * 0.2, bb.topLeft.y + (bb.bottomRight.y - bb.topLeft.y) * 0.35), nr, title: label ?? key, scale: Math.min(0.35, (bb.bottomRight.x - bb.topLeft.x) / 400) })
    return part
  },
})

/**
 * The contour waistband, shaped to the tops of the legs with the darts closed: one side, CB to CF, as a ring segment whose top and bottom edges are the legs' band top and
 * bottom (`jeans.back`, `jeans.front`), `ext` running on past CF for the left side's lap.
 */
export const jeanBandPart = ({ name, after, nr, label = 'waistband', cut = 4, enabled = () => true, size }) => ({
  name,
  after,
  draft: (sh) => {
    const { paths, Path, Point, store, sa, macro, options, part, snippets, Snippet } = sh
    if (!enabled(options)) return part.hide()
    const B = store.get('jeans.back')
    const F = store.get('jeans.front')
    const { width: w, ext = 0 } = size(sh)
    const Lt = B.top + F.top
    const Lb = B.bottom + F.bottom
    // Inner (top) radius from the two edges' lengths; nearly equal edges make a straight band
    // (negative, curving the other way, where the waist is wider than the hips)
    const R = Math.abs(Lb - Lt) > 0.5 ? (w * Lt) / (Lb - Lt) : 1e6
    const th = Lt / R
    const at = (rad, phi) => new Point(rad * Math.cos(phi), rad * Math.sin(phi) + R)
    const arc = (rad, a0, a1, k = 4) => {
      let p = new Path().move(at(rad, a0))
      const d = (a1 - a0) / k
      const h = (4 / 3) * Math.tan(d / 4) * rad
      for (let i = 0; i < k; i++) {
        const a = a0 + d * i
        const b = a + d
        const p0 = at(rad, a)
        const p1 = at(rad, b)
        p = p.curve(new Point(p0.x - h * Math.sin(a), p0.y + h * Math.cos(a)), new Point(p1.x + h * Math.sin(b), p1.y - h * Math.cos(b)), p1)
      }
      return p
    }
    const a0 = -Math.PI / 2 - th / 2 // CB
    const a1 = -Math.PI / 2 + th / 2 // CF
    const tang = a1 + Math.PI / 2
    {
      const topCF = at(R, a1)
      const botCF = at(R + w, a1)
      const topExt = new Point(topCF.x + ext * Math.cos(tang), topCF.y + ext * Math.sin(tang))
      const botExt = new Point(botCF.x + ext * Math.cos(tang), botCF.y + ext * Math.sin(tang))
      const top = arc(R, a0, a1)
      const bottom = arc(R + w, a0, a1)
      let seam = top.clone()
      if (ext > 0) seam = seam.line(topExt).line(botExt)
      seam = seam.line(botCF).join(bottom.reverse()).close()
      paths.seam = seam.addClass('fabric')
      if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
      if (ext > 0) paths.cf = new Path().move(topCF).line(botCF).addClass('mark dashed').addText('CF', 'center text-sm')
      // The side seam's place on each edge
      snippets.sideTop = new Snippet('notch', at(R, a0 + (th * B.top) / Lt))
      snippets.sideBottom = new Snippet('notch', at(R + w, a0 + (th * B.bottom) / Lb))
      store.set('jeans.band', { top: top.length(), bottom: bottom.length(), ext, width: w })
      const mid = at(R + w / 2, -Math.PI / 2)
      macro('grainline', { from: new Point(mid.x, mid.y + w * 0.35), to: new Point(mid.x, mid.y - w * 0.35) })
      title(macro, { at: at(R + w * 0.15, a0 + th * 0.25), nr, title: label, scale: Math.min(0.3, w / 120) })
    }
    store.cutlist.setCut({ cut, from: 'fabric' })
    return part
  },
})
