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

/**
 * Gore `index` of the layout (0: the front panel, on the fold; others cut in pairs; hidden past
 * the design's count). `zip` (mm) marks the zip's end on the back gore's CB seam.
 */
export function gorePart({ name, after, index, nr, label, zip = () => 0 }) {
  return {
    name,
    after,
    draft: (sh) => {
      const { points, paths, Path, Point, Snippet, snippets, store, sa, macro, part } = sh
      const count = store.get('skirt.count')
      if (index >= count) return part.hide()
      const { left, right } = store.get('skirt.gores')[index]
      const hem = store.get('sarah.hem')
      const L = edgePath(Path, Point, left)
      const R = edgePath(Path, Point, right)
      const hemP = hemPath(Path, Point, left, right)
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
      const seamLen = (e) => edgePath(Path, Point, e).length()
      const lens = store.get('skirt.seams', null) ?? {}
      lens[index] = { left: seamLen(left), right: right.fold ? null : seamLen(right), waist: waist.length(), hem: hemP.length() }
      store.set('skirt.seams', lens)
      title(macro, { at: new Point(midX, (left.S.y + left.H.y) / 2.4), nr, title: label, scale: 0.5 })
      return part
    },
  }
}
