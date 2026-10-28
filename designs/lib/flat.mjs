// Flat-cut garments: pieces that are rectangles, triangles and squares sized from the wearer's
// measurements, with no block underneath. The one-piece suit (Thayaht's TuTa, 1920): a single
// body piece wrapped round the figure, slashed for the armholes and slit up the back for the
// legs, with rectangular sleeves, square underarm gussets and a diamond crotch gusset.
// Store: `suit.*`.
import { title } from './coat.mjs'

/** Slash width at the top of an armhole slit, each side of the cut (mm): the source's 10 mm gap */
const SLASH = 5

/**
 * Outline offset outward: `pts` a closed polygon, `dist[i]` the allowance on the edge from
 * pts[i] to pts[i + 1]. Corners are mitred, so concave ones (the crotch slit) come out right.
 */
export function offsetPolygon(pts, dist) {
  const n = pts.length
  let area = 0
  for (let i = 0; i < n; i++) area += pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1]
  const s = area > 0 ? 1 : -1
  const lines = pts.map((p, i) => {
    const q = pts[(i + 1) % n]
    const len = Math.hypot(q[0] - p[0], q[1] - p[1])
    const u = [(q[0] - p[0]) / len, (q[1] - p[1]) / len]
    const nrm = [s * u[1], -s * u[0]]
    return { p: [p[0] + nrm[0] * dist[i], p[1] + nrm[1] * dist[i]], u, nrm }
  })
  return pts.map((p, i) => {
    const a = lines[(i + n - 1) % n]
    const b = lines[i]
    const cross = a.u[0] * b.u[1] - a.u[1] * b.u[0]
    if (Math.abs(cross) < 1e-9) return [p[0] + b.nrm[0] * dist[i], p[1] + b.nrm[1] * dist[i]]
    const t = ((b.p[0] - a.p[0]) * b.u[1] - (b.p[1] - a.p[1]) * b.u[0]) / cross
    return [a.p[0] + a.u[0] * t, a.p[1] + a.u[1] * t]
  })
}

const polyPath = (Path, Point, pts) => {
  const path = new Path().move(new Point(...pts[0]))
  for (const p of pts.slice(1)) path.line(new Point(...p))
  return path.close()
}

/** A straight-edged piece: seam and allowance (`dist` per edge, else `sa` all round) */
function drawPolygon(sh, pts, dist) {
  const { paths, Path, Point, sa } = sh
  paths.seam = polyPath(Path, Point, pts).addClass('fabric')
  if (sa) paths.sa = polyPath(Path, Point, offsetPolygon(pts, dist ?? pts.map(() => sa))).addClass('fabric sa')
}

/**
 * The suit's body: one piece round the figure, from the wearer's left centre front, across the
 * left front, the back and the right front, to the right centre front. All lengths in mm:
 * - `width`: round the body, CF to CF; the fronts a quarter each, the back half;
 * - `length`: shoulder line to the finished hem; `crotch`: shoulder line to the top of the leg
 *   slit; `taper`: the slit's half width at the hem;
 * - `slit`: armhole slash depth; `neckWidth`: neck width each side of CF and CB along the shoulder
 *   line; `neckDrop`: the front neck's depth at CF;
 * - `ext`: button stand past CF, down the `opening`; `buttons`: their count;
 * - `hem`: the hem allowance (legs and sleeves);
 * - `sleeve: { width, length, gusset }`, `crotchGusset: { side, width }`, `facing`, `band`: for
 *   the other pieces;
 * - `breastPocket: { x, y, w, h }`, `lowerPocket: { x, y, w, h, slant }`: placed from CF and the
 *   shoulder line, on both fronts (left out when not given).
 */
export function draftSuitBody(sh, args) {
  const { width: W, length: T, crotch, taper, slit: D, neckWidth: nh, neckDrop: nd, ext, opening, buttons, hem } = args
  const { points, paths, Path, Point, snippets, Snippet, store, sa, macro, part } = sh
  const xL = W / 4
  const xC = W / 2
  const xR = (3 * W) / 4
  const g = args.crotchGusset.side

  // The legs: each slit edge sews to its leg's CF edge (the inseam), the top `g` of both to the
  // crotch gusset, so the CF's crotch point sits the slit edge's length above the hem
  const h = T - crotch
  const slitEdge = Math.hypot(taper, h)
  const frontCrotch = T - slitEdge

  // Front neck: a quarter ellipse from the shoulder line to CF
  const neckCurve = (cf) => {
    const o = cf === 0 ? 1 : -1
    return new Path()
      .move(new Point(cf + o * nh, 0))
      .curve(new Point(cf + o * nh, nd * 0.55), new Point(cf + o * nh * 0.55, nd), new Point(cf, nd))
  }
  const left = neckCurve(0)
  const right = neckCurve(W).reverse()

  // Counter-clockwise on the page: down the left front edge, along the hem, up the right
  const P = (x, y) => new Point(x, y)
  const seam = new Path()
    .move(P(-ext, nd))
    .line(P(-ext, opening))
    .line(P(0, opening))
    .line(P(0, T))
    .line(P(xC - taper, T))
    .line(P(xC, crotch))
    .line(P(xC + taper, T))
    .line(P(W, T))
    .line(P(W, opening))
    .line(P(W + ext, opening))
    .line(P(W + ext, nd))
    .line(P(W, nd))
    .join(right)
    .line(P(xR + SLASH, 0))
    .line(P(xR, D))
    .line(P(xR - SLASH, 0))
    .line(P(xL + SLASH, 0))
    .line(P(xL, D))
    .line(P(xL - SLASH, 0))
    .join(left)
    .close()
  paths.seam = seam.addClass('fabric')

  if (sa) {
    // The allowance round the outline without the slits (hems take `hem`), then each armhole
    // slashed down its centre to the point
    const flat = (path, steps = 8) => Array.from({ length: steps }, (_, i) => path.shiftFractionAlong(i / steps)).map((p) => [p.x, p.y])
    const pts = [
      [-ext, nd], [-ext, opening], [0, opening], [0, T], [xC - taper, T], [xC, crotch], [xC + taper, T], [W, T],
      [W, opening], [W + ext, opening], [W + ext, nd],
      ...flat(right), [W - nh, 0], [xR, 0], [xL, 0], ...flat(left), [0, nd],
    ]
    const dist = pts.map(() => sa)
    dist[3] = dist[6] = hem // the legs' hems
    const off = offsetPolygon(pts, dist)
    const iR = pts.findIndex((p) => p[0] === xR && p[1] === 0)
    const iL = pts.findIndex((p) => p[0] === xL && p[1] === 0)
    const cut = []
    off.forEach((p, i) => {
      cut.push(p)
      if (i === iR || i === iL) cut.push([pts[i][0], D], p)
    })
    paths.sa = polyPath(Path, Point, cut).addClass('fabric sa')
  }

  // Marks: the back neck and shoulder points; the armhole's gusset corner; the inseam tops and
  // the crotch point
  for (const x of [xC - nh, xC, xC + nh, nh, W - nh]) snippets[`neck${Math.round(x)}`] = new Snippet('notch', P(x, 0))
  const gussetAt = D - args.sleeve.gusset
  for (const x of [xL, xR]) {
    snippets[`gusset${x > xC ? 'R' : 'L'}1`] = new Snippet('notch', P(x - SLASH * (1 - gussetAt / D), gussetAt))
    snippets[`gusset${x > xC ? 'R' : 'L'}2`] = new Snippet('notch', P(x + SLASH * (1 - gussetAt / D), gussetAt))
  }
  const inseam = slitEdge - g
  const along = (from, to, d) => from.shiftTowards(to, d)
  snippets.inseamL = new Snippet('notch', along(P(xC - taper, T), P(xC, crotch), inseam))
  snippets.inseamR = new Snippet('notch', along(P(xC + taper, T), P(xC, crotch), inseam))
  snippets.inseamCfL = new Snippet('notch', P(0, T - inseam))
  snippets.inseamCfR = new Snippet('notch', P(W, T - inseam))
  snippets.crotchL = new Snippet('notch', P(0, frontCrotch))
  snippets.crotchR = new Snippet('notch', P(W, frontCrotch))

  // Buttonholes on the wearer's left front (the left end), buttons on the right, on CF
  const step = (opening - nd) / buttons
  for (let i = 0; i < buttons; i++) {
    const y = nd + step * (i + 0.5)
    snippets[`buttonhole${i}`] = new Snippet('buttonhole', P(0, y)).attr('data-rotate', 90)
    snippets[`button${i}`] = new Snippet('button', P(W, y))
  }

  // Pockets, on both fronts (mirrored about each CF)
  const pockets = {}
  const mark = (id, shape) => {
    for (const [side, cf, o] of [['L', 0, 1], ['R', W, -1]])
      paths[`${id}${side}`] = new Path()
        .move(P(cf + o * shape[0][0], shape[0][1]))
        .line(P(cf + o * shape[1][0], shape[1][1]))
        .line(P(cf + o * shape[2][0], shape[2][1]))
        .line(P(cf + o * shape[3][0], shape[3][1]))
        .close()
        .addClass('mark dashed')
  }
  const bp = args.breastPocket
  if (bp) {
    mark('breastPocket', [[bp.x, bp.y], [bp.x, bp.y + bp.h], [bp.x + bp.w, bp.y + bp.h], [bp.x + bp.w, bp.y]])
    pockets.breast = bp
  }
  const lp = args.lowerPocket
  if (lp) {
    mark('lowerPocket', [[lp.x, lp.y], [lp.x, lp.y + lp.h], [lp.x + lp.w, lp.y + lp.h], [lp.x + lp.w, lp.y + lp.slant]])
    pockets.lower = lp
  }

  // The collar band: CF to CF round the neckline, plus both stands
  const neckline = 2 * left.length() + 2 * nh
  store.set('suit.body', {
    width: W,
    shoulder: { front: xL - SLASH - nh, back: xC - nh - (xL + SLASH) },
    armhole: 2 * Math.hypot(D, SLASH),
    slit: D,
    neckline,
    opening: opening - nd,
    frontRise: frontCrotch - opening,
    inseam: { slit: inseam, cf: inseam },
    crotchGusset: { slit: g, cf: T - inseam - frontCrotch },
    legTop: W / 2 - taper * (1 - inseam / slitEdge),
    legHem: W / 2 - taper,
    sides: { left: xL, right: W - xR },
    crotch,
    length: T,
  })
  store.set('suit.pieces', {
    sleeve: args.sleeve,
    crotchGusset: args.crotchGusset,
    pockets,
    facing: { length: opening - nd, width: args.facing },
    band: { length: neckline + 2 * ext, height: args.band, ext },
    hem,
  })

  macro('grainline', { from: P(xC + taper * 3, T - 40), to: P(xC + taper * 3, D + 40) })
  store.cutlist.setCut({ cut: 1, from: 'fabric' })
  title(macro, { at: P(xC - W * 0.12, T * 0.35), nr: 1, title: 'body' })
  return part
}

/**
 * The suit's other pieces, from `suit.pieces`: `sleeve` (a rectangle, its seam open at the top
 * by the gusset's side), `armGusset` (a square), `crotchGusset` (a diamond, long diagonal front
 * to back), `breastPocket`, `lowerPocket` (its top sloping down to the side), `facing` (the front
 * opening's), `band` (the collar band, cut double and folded).
 */
export const suitPiecePart = ({ name, after, piece, nr, label, enabled = () => true }) => ({
  name,
  after,
  draft: (sh) => {
    const { paths, Path, Point, snippets, Snippet, store, sa, macro, options, part } = sh
    if (!enabled(options)) return part.hide()
    const s = store.get('suit.pieces')
    const P = (x, y) => new Point(x, y)
    let at = P(0, 0)
    let cut = 2
    let grain = null
    const done = (record) => {
      store.set(`suit.${piece}`, record)
      if (grain) macro('grainline', { from: grain[0], to: grain[1] })
      store.cutlist.setCut({ cut, from: 'fabric' })
      title(macro, { at, nr, title: label ?? piece, scale: 0.4 })
      return part
    }

    if (piece === 'sleeve') {
      const { width: w, length: l, gusset: a } = s.sleeve
      // Hem at the bottom; the top sews to the armhole, the long edges are the underarm seam
      drawPolygon(sh, [[0, 0], [0, l], [w, l], [w, 0]], [sa, s.hem, sa, sa].map((d) => (sa ? d : 0)))
      snippets.shoulder = new Snippet('notch', P(w / 2, 0))
      snippets.gusset1 = new Snippet('notch', P(0, a))
      snippets.gusset2 = new Snippet('notch', P(w, a))
      at = P(w * 0.25, l * 0.3)
      grain = [P(w / 2, l - 30), P(w / 2, 30)]
      return done({ top: w, underarm: [l - a, l - a], gusset: a })
    }
    if (piece === 'armGusset') {
      const a = s.sleeve.gusset
      drawPolygon(sh, [[0, 0], [0, a], [a, a], [a, 0]])
      at = P(a * 0.2, a * 0.35)
      grain = [P(a / 2, a - 10), P(a / 2, 10)]
      return done({ side: a })
    }
    if (piece === 'crotchGusset') {
      const { side: g, width: wd } = s.crotchGusset
      const half = Math.sqrt(g * g - (wd / 2) ** 2)
      drawPolygon(sh, [[-half, 0], [0, wd / 2], [half, 0], [0, -wd / 2]])
      snippets.front = new Snippet('notch', P(-half, 0))
      snippets.back = new Snippet('bnotch', P(half, 0))
      at = P(-half * 0.4, -wd * 0.1)
      grain = [P(0, wd / 2 - 10), P(0, -wd / 2 + 10)]
      cut = 1
      return done({ side: g, length: 2 * half })
    }
    if (piece === 'breastPocket' || piece === 'lowerPocket') {
      const p = s.pockets[piece === 'breastPocket' ? 'breast' : 'lower']
      if (!p) return part.hide()
      const top = piece === 'lowerPocket' ? p.slant : 0
      // The mouth (top) folds down by half the hem allowance
      const pts = [[0, 0], [0, p.h], [p.w, p.h], [p.w, top]]
      drawPolygon(sh, pts, [sa, sa, sa, s.hem / 2].map((d) => (sa ? d : 0)))
      paths.mouth = new Path().move(P(p.w, top)).line(P(0, 0)).addClass('help dashed')
      at = P(p.w * 0.2, p.h * 0.4)
      grain = [P(p.w * 0.8, p.h - 15), P(p.w * 0.8, top + 15)]
      return done({ w: p.w, h: p.h })
    }
    if (piece === 'facing') {
      const { length: l, width: w } = s.facing
      drawPolygon(sh, [[0, 0], [0, l], [w, l], [w, 0]])
      at = P(w * 0.1, l * 0.2)
      grain = [P(w / 2, l - 20), P(w / 2, 20)]
      return done({ length: l, width: w })
    }
    if (piece === 'band') {
      const { length: l, height: hgt, ext } = s.band
      drawPolygon(sh, [[0, 0], [0, 2 * hgt], [l, 2 * hgt], [l, 0]])
      paths.fold = new Path().move(P(0, hgt)).line(P(l, hgt)).addClass('help dashed')
      snippets.cfL = new Snippet('notch', P(ext, 2 * hgt))
      snippets.cfR = new Snippet('notch', P(l - ext, 2 * hgt))
      snippets.cb = new Snippet('notch', P(l / 2, 2 * hgt))
      snippets.buttonhole = new Snippet('buttonhole', P(ext, hgt * 1.5))
      snippets.button = new Snippet('button', P(l - ext, hgt * 1.5))
      at = P(l * 0.3, hgt * 0.3)
      cut = 1
      return done({ length: l - 2 * ext, height: hgt })
    }
    throw new Error(`unknown suit piece "${piece}"`)
  },
})

/**
 * A straight-edged piece from its corners: `shape(sh)` gives
 * - `points`: [[x, y], ...] the seam line, in order;
 * - `allowance`: per edge (from points[i] to points[i + 1]), in seam allowances (default 1);
 * - `fold`: the index of the edge cut on the fold (no allowance, a fold line);
 * - `notches`, `buttons`, `buttonholes`: [[x, y], ...]; `lines`: [[[x, y], [x, y]], ...] marks
 *   (a pocket's place, a fold).
 * Its edges' lengths go to `polygon.<piece>` (`edges`, `width`, `height`).
 */
export const polygonPart = ({ name, after, nr, label, cut = 1, material = 'fabric', enabled = () => true, shape }) => ({
  name,
  after,
  draft: (sh) => {
    const { paths, Path, Point, snippets, Snippet, store, sa, macro, options, part } = sh
    if (!enabled(options)) return part.hide()
    const { points: pts, allowance = [], fold = -1, notches = [], buttons = [], buttonholes = [], lines = [] } = shape(sh)
    const n = pts.length
    const dist = pts.map((_, i) => (i === fold ? 0 : (allowance[i] ?? 1) * sa))
    drawPolygon(sh, pts, sa ? dist : undefined)
    if (fold >= 0) {
      const [a, b] = [pts[fold], pts[(fold + 1) % n]]
      paths.fold = new Path().move(new Point(...a)).line(new Point(...b)).addClass('help dashed')
    }
    notches.forEach((p, i) => (snippets[`notch${i}`] = new Snippet('notch', new Point(...p))))
    buttons.forEach((p, i) => (snippets[`button${i}`] = new Snippet('button', new Point(...p))))
    buttonholes.forEach((p, i) => (snippets[`buttonhole${i}`] = new Snippet('buttonhole', new Point(...p))))
    lines.forEach(([a, b], i) => (paths[`mark${i}`] = new Path().move(new Point(...a)).line(new Point(...b)).addClass('mark dashed')))
    const xs = pts.map((p) => p[0])
    const ys = pts.map((p) => p[1])
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
    store.set(`polygon.${name.split('.').pop()}`, {
      edges: pts.map((p, i) => Math.hypot(pts[(i + 1) % n][0] - p[0], pts[(i + 1) % n][1] - p[1])),
      width: x1 - x0,
      height: y1 - y0,
    })
    macro('grainline', { from: new Point((x0 + x1) / 2, y1 - 15), to: new Point((x0 + x1) / 2, y0 + 15) })
    store.cutlist.setCut({ cut, from: material, onFold: fold >= 0 })
    title(macro, { at: new Point(x0 + (x1 - x0) * 0.15, y0 + (y1 - y0) * 0.3), nr, title: label ?? name.split('.').pop(), scale: Math.min(0.4, (x1 - x0) / 300) })
    return part
  },
})
