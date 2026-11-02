// Gored skirts on FreeSewing's Sarah skirt block (Mitchell 1921's 5- to 15-gored skirts). The
// half skirt, CB (x = 0) to CF, is cut at the seat line into a front panel (on the fold) and
// gores (cut in pairs). Every seam takes a share of the waist shaping, as a dart centred on it
// running out at the seat line, and the same flare below it, so the two edges of a seam are
// mirror images and sew together. Store: `skirt.gores` (each gore's edges), `skirt.seams`,
// `skirt.waist`, `skirt.hem`.
import { cleanup, title } from './coat.mjs'

/** Smooth 0 → 1 with level ends: the waist drops toward CF square to both CB and CF */
const ease = (t) => 3 * t * t - 2 * t * t * t

/**
 * Lay out the gores on Sarah's base. `gores` (odd, 5 or more) is the whole skirt's count: the
 * front panel and (gores - 1) / 2 gores a side. The panel is `panelNarrowing` (mm) narrower at
 * the seat than an equal share; the rest is shared equally. The waist shaping (seat less waist,
 * Sarah's ease on both) goes `cbShaping` to the CB seam, `panelShaping` to the panel seam and
 * the rest equally to the other seams. Those three are for five gores, less with more. The hem is `flare` x the half seat wider than the seat
 * line at floor length, less for a shorter skirt, shared equally by every seam edge (the CF fold
 * stays straight). The waist drops `frontDrop` (mm) toward CF. With three gores (Mitchell's
 * two-piece skirt: a front on the fold and a back with a CB seam) `panelShare` sets the front's
 * share of the half seat, and the shaping isn't scaled.
 */
export function draftSkirtLayout(sh, { gores, panelNarrowing, cbShaping, panelShaping, flare, frontDrop, panelShare }) {
  gores = Number(gores)
  const { points, measurements, store, part } = sh
  cleanup(sh)
  const S = points.cfSeat.x - points.cbSeat.x // half the skirt at the seat line
  const Wh = store.get('sarah.waistlineEased') / 2
  const hS = points.cbSeat.y - points.cbTop.y
  const L = store.get('sarah.length')
  const m = (gores - 1) / 2
  // The panel's narrowing and the CB and panel darts are the five-gored skirt's; with more
  // gores Mitchell takes ⅛ in or so less of each per two gores, to about a quarter at fifteen
  const fewer = Math.min(1, Math.max(0.1, 1 - (gores - 5) / 13))
  panelNarrowing *= fewer
  cbShaping *= fewer
  panelShaping *= fewer

  const P = panelShare ? S * panelShare : Math.max(S / gores - panelNarrowing, S / gores / 2) // half the front panel
  const G = (S - P) / m
  const xs = Array.from({ length: m + 1 }, (_, j) => j * G) // xs[0] CB, xs[m] the panel seam

  const D = S - Wh // negative on a figure whose waist is wider than the seat
  const dCb = D * cbShaping
  const dPanel = D * panelShaping
  const dart = (j) => (j === m ? dPanel : (D - dCb - dPanel) / (m - 1))
  const below = Math.max(measurements.waistToFloor - hS, 1)
  const F = Math.max(0, S * flare * Math.min(1, (L - hS) / below))
  const f = F / (2 * m + 1)

  const waistY = (x) => frontDrop * ease(Math.min(1, Math.max(0, x / S)))
  // One edge: waist W, seat S, hem H; `w` is its waist shift and `h` its hem shift (+x toward CF)
  const edge = (x, w, h) => {
    const W = { x: x + w, y: waistY(x) }
    const Sp = { x, y: hS }
    const H = { x: x + h, y: L }
    const lower = Math.hypot(H.x - Sp.x, H.y - Sp.y)
    const k = (hS - W.y) / 3
    // The hip curve leaves the seat point along the lower seam's line, and meets the waist square
    const cpS = { x: Sp.x - ((H.x - Sp.x) / lower) * k, y: Sp.y - ((H.y - Sp.y) / lower) * k }
    const cpW = { x: W.x, y: W.y + k }
    return { W, cpW, cpS, S: Sp, H }
  }
  const cf = { W: { x: S, y: waistY(S) }, S: { x: S, y: hS }, H: { x: S, y: L }, fold: true }
  // Gore 0 is the front panel, gore m the back gore at CB
  const list = []
  for (let i = 0; i <= m; i++) {
    const r = m - i + 1 // the seam on the gore's CF side (m + 1: the CF fold)
    const l = m - i // its CB side (0: the CB seam)
    const right = r > m ? cf : edge(xs[r], -dart(r) / 2, f)
    const left = l === 0 ? edge(0, dCb, -f) : edge(xs[l], dart(l) / 2, -f)
    list.push({ left, right })
  }
  store.set('skirt.gores', list)
  // The whole waist: twice the half's gore tops
  store.set('skirt.waist', 2 * list.reduce((t, g) => t + Math.hypot(g.right.W.x - g.left.W.x, g.right.W.y - g.left.W.y), 0))
  store.set('skirt.count', m + 1)
  store.set('skirt.flare', f)
  store.set('skirt.length', L)
  return part.hide()
}

/** An edge's path from the waist to the hem */
function edgePath(Path, Point, e) {
  const pt = (q) => new Point(q.x, q.y)
  const path = new Path().move(pt(e.W))
  if (e.fold) path.line(pt(e.S))
  else path.curve(pt(e.cpW), pt(e.cpS), pt(e.S))
  return path.line(pt(e.H))
}

/** The hem from the left edge to the right, square to both */
function hemPath(Path, Point, left, right) {
  const w = right.H.x - left.H.x
  const dir = (e) => {
    const dx = e.H.x - e.S.x
    const dy = e.H.y - e.S.y
    const n = Math.hypot(dx, dy)
    return { x: dy / n, y: -dx / n }
  }
  const a = dir(left)
  const b = dir(right)
  return new Path()
    .move(new Point(left.H.x, left.H.y))
    .curve(
      new Point(left.H.x + (a.x * w) / 3, left.H.y + (a.y * w) / 3),
      new Point(right.H.x - (b.x * w) / 3, right.H.y - (b.y * w) / 3),
      new Point(right.H.x, right.H.y)
    )
}

/** An edge's path from the waist to the seat line only */
function upperPath(Path, Point, e) {
  const pt = (q) => new Point(q.x, q.y)
  const path = new Path().move(pt(e.W))
  return e.fold ? path.line(pt(e.S)) : path.curve(pt(e.cpW), pt(e.cpS), pt(e.S))
}

/** An edge moved `hip` (mm) out at the seat line and `hem` at the hem, `dir` -1 toward CB, +1 CF */
const shifted = (e, dir, hip, hem) => ({ ...e, S: { x: e.S.x + dir * hip, y: e.S.y }, H: { x: e.H.x + dir * hem, y: e.H.y } })

/**
 * Gore `index` of the layout (0: the front panel, on the fold; others cut in pairs; hidden past
 * the design's count). `zip` (mm) marks the zip's end on the back gore's CB seam.
 * `pleat(sh)`: { style, hip, hem } (mm) or null, Mitchell's pleated skirt: below the seat line
 * each gore takes a pleat underlay `hip` wide there and `hem` at the hem, squared out from the
 * seat point; on its CB edge only (`side`: side pleats, the next gore's edge sewn to the
 * underlay's), or on both edges (`box`: box pleats, the underlays sewn together); never on the
 * CF fold. The gore's own edge below the seat line is marked as the pleat's fold. A seam's
 * stored length is what is sewn: the edge above the seat line and the underlay's edge below.
 */
export function gorePart({ name, after, index, nr, label, zip = () => 0, pleat = () => null }) {
  return {
    name,
    after,
    draft: (sh) => {
      const { points, paths, Path, Point, Snippet, snippets, store, sa, macro, part } = sh
      const count = store.get('skirt.count')
      if (index >= count) return part.hide()
      const { left, right } = store.get('skirt.gores')[index]
      const hem = store.get('sarah.hem')
      const pl = pleat(sh)
      const ul = pl ? shifted(left, -1, pl.hip, pl.hem) : left
      const ur = pl && pl.style === 'box' && !right.fold ? shifted(right, 1, pl.hip, pl.hem) : right
      // An edge with an underlay: down to the seat point, squared out, down the underlay
      const edgeOf = (e, u) =>
        u === e ? edgePath(Path, Point, e) : upperPath(Path, Point, e).line(new Point(u.S.x, u.S.y)).line(new Point(u.H.x, u.H.y))
      const L = edgeOf(left, ul)
      const R = edgeOf(right, ur)
      const hemP = hemPath(Path, Point, ul, ur)
      const waist = new Path().move(R.start()).line(L.start())
      // Counter-clockwise on the page: the waist right to left, down the left edge, the hem,
      // up the right edge; so offsets go outward
      paths.seam = waist.join(L).join(hemP).join(R.reverse()).close().addClass('fabric')
      if (sa) {
        const parts = [waist.offset(sa), L.offset(sa), hemP.offset(hem), right.fold ? R.reverse() : R.reverse().offset(sa)]
        let out = null
        for (const p of parts) out = out ? out.line(p.start()).join(p) : p
        paths.sa = out.close().addClass('fabric sa')
      }
      for (const [k, e] of [['left', left], ['right', right]]) {
        if (e.fold) continue
        points[`${k}Seat`] = new Point(e.S.x, e.S.y)
        snippets[`${k}Seat`] = new Snippet('notch', points[`${k}Seat`])
      }
      const z = index === count - 1 ? zip(sh) : 0
      if (z > 0) {
        points.zip = L.shiftAlong(Math.min(z, L.length() * 0.6))
        snippets.zip = new Snippet('notch', points.zip)
      }
      const top = Math.max(left.W.y, right.W.y)
      const midX = (left.S.x + right.S.x) / 2
      if (right.fold) {
        macro('cutonfold', { from: new Point(right.W.x, right.W.y + 20), to: new Point(right.H.x, right.H.y - 20), grainline: true })
        store.cutlist.setCut({ cut: 1, from: 'fabric', onFold: true })
      } else {
        macro('grainline', { from: new Point(midX, top + 40), to: new Point(midX, left.H.y - 40) })
        store.cutlist.setCut({ cut: 2, from: 'fabric' })
      }
      // The pleats' folds: the gore's own edges below the seat line
      for (const [k, e, u] of [['left', left, ul], ['right', right, ur]]) {
        if (u === e) continue
        paths[`${k}Fold`] = new Path().move(new Point(e.S.x, e.S.y)).line(new Point(e.H.x, e.H.y)).addClass('help dashed')
      }
      const seamLen = (e, u) => (u === e ? edgePath(Path, Point, e).length() : upperPath(Path, Point, e).length() + Math.hypot(u.H.x - u.S.x, u.H.y - u.S.y))
      const lens = store.get('skirt.seams', null) ?? {}
      lens[index] = { left: seamLen(left, ul), right: right.fold ? null : seamLen(right, ur), waist: waist.length(), hem: hemP.length() }
      if (pl) lens[index].pleats = (ul !== left) + (ur !== right)
      store.set('skirt.seams', lens)
      title(macro, { at: new Point(midX, (left.S.y + left.H.y) / 2.4), nr, title: label, scale: 0.5 })
      return part
    },
  }
}

const unit = (a, b) => {
  const n = Math.hypot(b.x - a.x, b.y - a.y)
  return { x: (b.x - a.x) / n, y: (b.y - a.y) / n }
}

/** `p` turned `a` radians about `c`, so that a point below `c` swings toward CB */
const turn = (p, c, a) => {
  const dx = p.x - c.x
  const dy = p.y - c.y
  return { x: c.x + dx * Math.cos(a) - dy * Math.sin(a), y: c.y + dx * Math.sin(a) + dy * Math.cos(a) }
}

/** A smooth path through `pts`, leaving along `t0` and arriving along `t1` (unit vectors) */
function through(Path, Point, pts, t0, t1) {
  const q = pts.filter((p, i) => i === 0 || Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y) > 1)
  const path = new Path().move(new Point(q[0].x, q[0].y))
  for (let i = 0; i < q.length - 1; i++) {
    const d = Math.hypot(q[i + 1].x - q[i].x, q[i + 1].y - q[i].y) / 3
    const ta = i === 0 ? t0 : unit(q[i - 1], q[i + 1])
    const tb = i === q.length - 2 ? t1 : unit(q[i], q[i + 2])
    path.curve(new Point(q[i].x + ta.x * d, q[i].y + ta.y * d), new Point(q[i + 1].x - tb.x * d, q[i + 1].y - tb.y * d), new Point(q[i + 1].x, q[i + 1].y))
  }
  return path
}

const waistOf = (Path, Point, c) => through(Path, Point, c.waist, leftward(c.right), leftward(c.left))
const hemOf = (Path, Point, c) => through(Path, Point, c.hem, rightward(c.left), rightward(c.right))
/** Square to an edge running down the piece: toward CB, toward CF */
const leftward = (e) => {
  const d = unit(e.S, e.H)
  return { x: -d.y, y: d.x }
}
const rightward = (e) => {
  const d = unit(e.S, e.H)
  return { x: d.y, y: -d.x }
}

/**
 * Mitchell's two-piece circular skirt on Sarah's base. The half skirt is a fan of straight lines
 * (`flare`, as `skirtLayout`'s), its CF upright and a side line `frontShare` of the half seat from
 * CF. The back is divided in three, and one more line goes on the front as far from
 * the side line as the first back line. Each of the four is slashed up to `hinge` (mm) above the
 * seat line and spread there: `spreadFront`, `spreadSide` and `spreadBack` (mm at the hem of a
 * floor-length skirt; a shorter skirt spreads in proportion). So the waist above each slash folds
 * away. The side seam runs down the middle of the side slash's spread, and what the waist still
 * has too much goes in a dart on that seam, leaving the front `waistShift` (mm) less than a quarter
 * waist and the back that much more. Store: `skirt.circular` ({ front, back }: each piece's
 * `waist`, `hem`, `left` and `right` edges), `skirt.waist`, `skirt.count` (two, so the design's
 * other gores are left out).
 */
export function draftCircularLayout(sh, { frontShare, hinge, spreadFront, spreadSide, spreadBack, flare, frontDrop, waistShift }) {
  const { points, measurements, store, part, Path, Point } = sh
  cleanup(sh)
  const S = points.cfSeat.x - points.cbSeat.x
  const Wh = store.get('sarah.waistlineEased') / 2
  const hS = points.cbSeat.y - points.cbTop.y
  const L = store.get('sarah.length')
  const below = Math.max(measurements.waistToFloor - hS, 1)
  const r = below / Math.max(flare, 0.001) // the radius of the seat line's arc about the fan's apex
  const drop = (x) => frontDrop * ease(Math.min(1, Math.max(0, x / S)))
  // A line of the fan, x along the seat line's arc from CB: waist, hinge, seat, hem, each a set
  // distance along it, so all three lines are arcs about the apex, as Mitchell's foundation (p. 87)
  const line = (x) => {
    const u = { x: -Math.sin((S - x) / r), y: Math.cos((S - x) / r) }
    const at = (t) => ({ x: S + u.x * (r + t), y: hS - r + u.y * (r + t) })
    return { W: at(drop(x) - hS), G: at(-hinge), S: at(0), H: at(L - hS) }
  }
  const xSide = S * (1 - frontShare)
  const cf = line(S)
  const lf = line(xSide + xSide / 3)
  const ls = line(xSide)
  const l1 = line((xSide * 2) / 3)
  const l2 = line(xSide / 3)
  const cb = line(0)
  const R = below + hinge
  const spread = (T, l, w) => (p) => turn(T(p), T(l.G), w / R)
  // One transform per panel, from CF toward CB; `T1half` is the middle of the side slash
  const T0 = (p) => p
  const T1 = spread(T0, lf, spreadFront)
  const T1half = spread(T1, ls, spreadSide / 2)
  const T2 = spread(T1, ls, spreadSide)
  const T3 = spread(T2, l1, spreadBack)
  const T4 = spread(T3, l2, spreadBack)
  const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
  const edgeBy = (T, l) => ({ W: T(l.W), S: T(l.S), H: T(l.H) })

  const side = edgeBy(T1half, ls)
  const G = T1half(ls.G)
  const d = unit(G, side.H)
  const frontWaist = [cf.W, mid(T0(lf.W), T1(lf.W))]
  const backWaist = [mid(T2(l1.W), T3(l1.W)), mid(T3(l2.W), T4(l2.W)), T4(cb.W)]
  const polyLength = (pts) => pts.slice(1).reduce((t, p, i) => t + Math.hypot(p.x - pts[i].x, p.y - pts[i].y), 0)
  const f = polyLength([...frontWaist, side.W])
  const b = polyLength([side.W, ...backWaist])
  const h = Math.hypot(G.x - side.W.x, G.y - side.W.y)
  // The pieces with the dart's legs at their waist ends. Sewn together, so the longer comes down
  // to the other's length. Each waist is one curve, its length near the path through the slashes
  const pieces = (legF, legB) => {
    const legLength = Math.min(Math.hypot(h, legF), Math.hypot(h, legB))
    const sideEdge = (dir, leg) => {
      const t = h - Math.sqrt(Math.max(legLength ** 2 - leg ** 2, 1))
      const W = { x: side.W.x + dir * d.y * leg + d.x * t, y: side.W.y - dir * d.x * leg + d.y * t }
      const k = Math.hypot(G.x - W.x, G.y - W.y) / 3
      return { W, cpW: { x: W.x + d.x * k, y: W.y + d.y * k }, cpG: { x: G.x - d.x * k, y: G.y - d.y * k }, G, S: side.S, H: side.H }
    }
    const left = sideEdge(1, legF)
    const right = sideEdge(-1, legB)
    return {
      front: { waist: [cf.W, left.W], left, hem: [side.H, mid(T0(lf.H), T1(lf.H)), cf.H], right: { ...edgeBy(T0, cf), fold: true } },
      back: { waist: [right.W, T4(cb.W)], left: edgeBy(T4, cb), hem: [T4(cb.H), mid(T3(l2.H), T4(l2.H)), mid(T2(l1.H), T3(l1.H)), side.H], right },
    }
  }
  // The legs leave the waists at their measures, unless that opens one and laps the other
  const dart = f + b - Wh
  let legF = dart < 0 ? dart / 2 : Math.min(dart, Math.max(0, f - (Wh / 2 - waistShift)))
  let legB = dart - legF
  const waistLength = (c) => waistOf(Path, Point, c).length()
  for (let i = 0; i < 3; i++) {
    const { front, back } = pieces(legF, legB)
    const over = waistLength(front) + waistLength(back) - Wh
    legF += over / 2
    legB += over / 2
  }
  const { front, back } = pieces(legF, legB)
  // The back stands upright on its grain, the middle of its middle panel
  const grain = line(xSide / 2)
  const g = unit(T3(grain.G), T3(grain.H))
  const up = (p) => turn(p, G, Math.atan2(g.x, g.y))
  const upright = (v) => (Array.isArray(v) ? v.map(upright) : 'x' in v ? up(v) : Object.fromEntries(Object.entries(v).map(([k, q]) => [k, k === 'fold' ? q : upright(q)])))
  const backUp = upright(back)
  store.set('skirt.circular', { front, back: backUp })
  store.set('skirt.waist', 2 * (waistLength(front) + waistLength(backUp)))
  store.set('skirt.count', 2)
  return part.hide()
}

/** An edge of a circular skirt's piece, from the waist to the hem */
function circularEdge(Path, Point, e) {
  const pt = (q) => new Point(q.x, q.y)
  const path = new Path().move(pt(e.W))
  return e.G ? path.curve(pt(e.cpW), pt(e.cpG), pt(e.G)).line(pt(e.H)) : path.line(pt(e.H))
}

/**
 * A circular skirt's `which` piece: the front (on the fold) or the back (cut 2). `zip` (mm) notches
 * the back's CB. Store: `skirt.seams.<which>` (side, waist, hem).
 */
export function circularPart({ name, after, which, nr, zip = () => 0 }) {
  return {
    name,
    after,
    draft: (sh) => {
      const { points, paths, Path, Point, Snippet, snippets, store, sa, macro, part } = sh
      const c = store.get('skirt.circular')[which]
      const hemDepth = store.get('sarah.hem')
      const L = circularEdge(Path, Point, c.left)
      const R = circularEdge(Path, Point, c.right)
      const waist = waistOf(Path, Point, c)
      const hem = hemOf(Path, Point, c)
      paths.seam = waist.join(L).join(hem).join(R.reverse()).close().addClass('fabric')
      if (sa) {
        const parts = [waist.offset(sa), L.offset(sa), hem.offset(hemDepth), c.right.fold ? R.reverse() : R.reverse().offset(sa)]
        let out = null
        for (const p of parts) out = out ? out.line(p.start()).join(p) : p
        paths.sa = out.close().addClass('fabric sa')
      }
      const sideEdge = which === 'front' ? c.left : c.right
      points.seat = new Point(sideEdge.S.x, sideEdge.S.y)
      snippets.seat = new Snippet('notch', points.seat)
      const z = zip(sh)
      if (z > 0) {
        points.zip = L.shiftAlong(Math.min(z, L.length() * 0.6))
        snippets.zip = new Snippet('notch', points.zip)
      }
      const midX = (c.left.S.x + c.right.S.x) / 2
      const top = Math.max(c.left.W.y, c.right.W.y)
      if (which === 'front') {
        macro('cutonfold', { from: new Point(c.right.W.x, c.right.W.y + 20), to: new Point(c.right.H.x, c.right.H.y - 20), grainline: true })
        store.cutlist.setCut({ cut: 1, from: 'fabric', onFold: true })
      } else {
        macro('grainline', { from: new Point(midX, top + 40), to: new Point(midX, Math.min(c.left.H.y, c.right.H.y) - 40) })
        store.cutlist.setCut({ cut: 2, from: 'fabric' })
      }
      const seams = store.get('skirt.seams', null) ?? {}
      seams[which] = { side: circularEdge(Path, Point, sideEdge).length(), waist: waist.length(), hem: hem.length() }
      store.set('skirt.seams', seams)
      title(macro, { at: new Point(midX, (sideEdge.S.y + sideEdge.H.y) / 2), nr, title: which, scale: 0.5 })
      return part
    },
  }
}

/**
 * A divided skirt's half (Pivnick's culotte, 1949): a three-gore layout's front panel
 * (`which: 'front'`) or back gore (`'back'`), its CF (or CB) edge carried down to `crotch` (mm
 * below the top) and out by `ext` (mm) in a curve, the inseam then straight down to the hem.
 * The front isn't cut on the fold: both halves are cut in pairs. `zip` (mm) notches the back's
 * CB. Store: `skirt.culotte.<which>` (side, inseam, crotch, waist).
 */
export function culottePart({ name, after, which, nr, size, zip = () => 0 }) {
  return {
    name,
    after,
    draft: (sh) => {
      const { points, paths, Path, Point, Snippet, snippets, store, sa, macro, part } = sh
      const { crotch, ext } = size(sh)
      const g = store.get('skirt.gores')[which === 'front' ? 0 : 1]
      const hemDepth = store.get('sarah.hem')
      const L = store.get('skirt.length')
      const pt = (q) => new Point(q.x, q.y)
      const front = which === 'front'
      // The side seam edge, waist to hem (front: its left edge; back: its right)
      const side = edgePath(Path, Point, front ? g.left : g.right)
      // The centre edge, waist down to the crotch line
      const c = front ? g.right : g.left
      const centre = edgePath(Path, Point, c)
      const at = centre.intersectsY(crotch)[0] ?? pt(c.H)
      const [upper] = centre.split(at)
      const out = front ? 1 : -1
      points.fork = new Point(at.x + out * ext, crotch)
      points.forkCp = at.clone()
      const curveTop = upper.shiftAlong(Math.max(upper.length() - ext * 1.2, upper.length() * 0.5))
      const [upperTop] = upper.split(curveTop)
      const crotchPath = upperTop.clone().curve(at.shiftFractionTowards(curveTop, 0.4), points.forkCp.shiftFractionTowards(points.fork, 0.5), points.fork.clone())
      points.inseamHem = new Point(points.fork.x, L)
      const inseam = new Path().move(points.fork.clone()).line(points.inseamHem.clone())
      const hemEnd = side.end()
      const hem = new Path().move(points.inseamHem.clone()).line(hemEnd.clone())
      const waist = new Path().move(side.start()).line(crotchPath.start())
      // Clockwise on the page: front: waist (side -> CF), down the crotch and inseam,
      // across the hem, up the side; the back the other way round
      const outline = front
        ? waist.clone().join(crotchPath).join(inseam).join(hem).join(side.clone().reverse())
        : side.clone().join(hem.clone().reverse()).join(inseam.clone().reverse()).join(crotchPath.clone().reverse()).join(waist.clone().reverse())
      paths.seam = outline.clone().close().addClass('fabric')
      if (sa) {
        const segs = front
          ? [[waist, sa], [crotchPath, sa], [inseam, sa], [hem, hemDepth], [side.clone().reverse(), sa]]
          : [[side, sa], [hem.clone().reverse(), hemDepth], [inseam.clone().reverse(), sa], [crotchPath.clone().reverse(), sa], [waist.clone().reverse(), sa]]
        let o
        for (const [p, k] of segs) {
          const off = p.offset(-k)
          o = o ? o.line(off.start()).join(off) : off
        }
        paths.sa = o.close().addClass('fabric sa')
      }
      const sideEdge = front ? g.left : g.right
      points.seat = pt(sideEdge.S)
      snippets.seat = new Snippet('notch', points.seat)
      const z = zip(sh)
      if (!front && z > 0) {
        points.zip = crotchPath.shiftAlong(Math.min(z, crotchPath.length() * 0.6))
        snippets.zip = new Snippet('notch', points.zip)
      }
      store.set(`skirt.culotte.${which}`, { side: side.length(), inseam: inseam.length(), crotch: crotchPath.length(), waist: waist.length() })
      const midX = (pt(sideEdge.S).x + at.x) / 2
      macro('grainline', { from: new Point(midX, crotch * 0.4), to: new Point(midX, L - 40) })
      store.cutlist.setCut({ cut: 2, from: 'fabric' })
      title(macro, { at: new Point(midX, (crotch + L) / 2.2), nr, title: which, scale: 0.5 })
      return part
    },
  }
}
