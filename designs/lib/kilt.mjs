// A wrap kilt, as kilts are made: two flat front aprons that wrap past CF, and straight lengths of
// cloth pleated round the sides and back, the pleats taking in more toward the waist so the top fits
// with no shaping cut in. Only the block's measurements are used. Draft: kiltLayout on a hidden Sarah
// base, then kiltApron and kiltPleats. Store: `kilt.*`.
import { cleanup, title } from './coat.mjs'

/**
 * Lay out the kilt (lengths in mm, round the whole body):
 * { waist, seat (the ease on each, at least the waist), hipDepth (waist to seat), length (waist to
 *   hem), apronShare (0-1: the aprons' share of the seat, CF to side), apronShaping (0-1: their share
 *   of seat less waist, the rest taken in the pleats), lap (how far each apron wraps past CF, 0-1 of
 *   its own width at the seat), face (a pleat's visible width at the seat), depth (each pleat's fold
 *   back, so a pleat takes 2 x depth of cloth), hem, edge (the aprons' turned-back front edge) }
 * Each half of the back has a whole number of pleats, the face adjusted to fit. Store: `kilt`, with
 * apron { width, lap, top, side, sideHip, W, S, H, E } and pleats { n, face, depth, take, pitch, width,
 * side }.
 */
export function draftKiltLayout(sh, a) {
  const { store, part } = sh
  cleanup(sh)
  const seat = Math.max(a.seat, a.waist)
  const diff = seat - a.waist
  // Half the body at the seat line: apron, CF to side, and the pleats, side to CB
  const Fs = (seat * a.apronShare) / 2
  const Fw = Fs - (diff * a.apronShaping) / 2
  const Bs = seat / 2 - Fs
  const Bw = a.waist / 2 - Fw
  const n = Math.max(3, Math.round(Bs / a.face))
  const face = Bs / n
  const depth = a.depth
  const take = (Bs - Bw) / n // each pleat's extra at the waist
  const pitch = face + 2 * depth
  const lap = Fs * a.lap
  // The apron's side seam above the seat line, straight and as long as the pleats' hipDepth, so the
  // side seam matches them: the side's waist point rises a little less than the depth
  const dx = Fs - Fw
  const rise = Math.sqrt(Math.max(a.hipDepth ** 2 - dx ** 2, 1))
  store.set('kilt', {
    hem: a.hem,
    edge: a.edge,
    hipDepth: a.hipDepth,
    length: a.length,
    waistRound: a.waist,
    seatRound: seat,
    apron: {
      lap,
      E: { x: 0, y: 0 },
      W: { x: lap + Fw, y: a.hipDepth - rise },
      S: { x: lap + Fs, y: a.hipDepth },
      H: { x: lap + Fs, y: a.length },
      F: { x: 0, y: a.length },
      waistWidth: Fw,
      seatWidth: Fs,
    },
    pleats: { n, face, depth, take, pitch, width: n * pitch, side: a.length, waistWidth: Bw, seatWidth: Bs },
  })
  return part.hide()
}

/** A closed outline's allowance: each corner moved out by its two edges' allowances, for a straight-edged piece */
function saOutline(Path, Point, corners, allowances) {
  const n = corners.length
  const lines = corners.map((p, i) => {
    const q = corners[(i + 1) % n]
    const d = Math.hypot(q.x - p.x, q.y - p.y)
    // Outward for a counter-clockwise outline on the page (y down)
    const nx = -(q.y - p.y) / d
    const ny = (q.x - p.x) / d
    const k = allowances[i]
    return { a: { x: p.x + nx * k, y: p.y + ny * k }, b: { x: q.x + nx * k, y: q.y + ny * k } }
  })
  const meet = (l, m) => {
    const [x1, y1, x2, y2] = [l.a.x, l.a.y, l.b.x, l.b.y]
    const [x3, y3, x4, y4] = [m.a.x, m.a.y, m.b.x, m.b.y]
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if (Math.abs(den) < 1e-9) return l.b
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
    return { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) }
  }
  const pts = lines.map((l, i) => meet(lines[(i - 1 + n) % n], l))
  let path = new Path().move(new Point(pts[0].x, pts[0].y))
  for (const q of pts.slice(1)) path = path.line(new Point(q.x, q.y))
  return path.close()
}

/**
 * A front apron, cut 2: its wrapping edge on the left, side seam on the right, the waist sloping to the
 * side's point. Marks: CF, and where the straps go on its front edge and the buckles at the side.
 */
export function kiltApronPart({ name, after, nr, label = 'apron' }) {
  return {
    name,
    after,
    draft: ({ points, paths, Path, Point, Snippet, snippets, store, sa, macro, part }) => {
      const k = store.get('kilt')
      const { E, W, S, H, F, lap } = k.apron
      const pt = (q) => new Point(q.x, q.y)
      for (const [id, q] of Object.entries({ edgeTop: E, waistSide: W, seatSide: S, hemSide: H, hemEdge: F })) points[id] = pt(q)
      const corners = [E, F, H, S, W]
      paths.seam = new Path().move(pt(E)).line(pt(F)).line(pt(H)).line(pt(S)).line(pt(W)).close().addClass('fabric')
      if (sa) paths.sa = saOutline(Path, Point, corners, [k.edge, k.hem, sa, sa, sa]).addClass('fabric sa')
      snippets.seatSide = new Snippet('notch', points.seatSide)
      paths.cf = new Path().move(new Point(lap, E.y + (W.y - E.y) * (lap / W.x))).line(new Point(lap, F.y)).addClass('help dashed').addText('center front', 'center text-sm')
      // The straps' place on the front edge, the second at the hip
      const y2 = k.hipDepth * 0.75
      paths.strap1 = new Path().move(new Point(0, 25)).line(new Point(k.apron.seatWidth * 0.14, 25)).addClass('mark')
      paths.strap2 = new Path().move(new Point(0, y2)).line(new Point(k.apron.seatWidth * 0.14, y2)).addClass('mark')
      macro('grainline', { from: new Point(lap + S.x * 0.1, F.y - 30), to: new Point(lap + S.x * 0.1, 40) })
      store.cutlist.setCut({ cut: 2, from: 'fabric' })
      title(macro, { at: new Point((lap + S.x) / 2, k.length * 0.4), nr, title: label, scale: 0.6 })
      return part
    },
  }
}

/**
 * The pleated length, cut 2, side seam on the left and CB on the right, a seam hidden in the last fold:
 * each pleat's fold line and where it's brought to at the hem; the placement line runs up to the hip
 * and on to the top, where the pleat takes `take` more. The line it's stitched down to is marked.
 */
export function kiltPleatsPart({ name, after, nr, label = 'pleats' }) {
  return {
    name,
    after,
    draft: ({ points, paths, Path, Point, Snippet, snippets, store, sa, macro, part }) => {
      const k = store.get('kilt')
      const { n, face, depth, take, pitch, width } = k.pleats
      const L = k.length
      const A = { x: 0, y: 0 }
      const B = { x: 0, y: L }
      const C = { x: width, y: L }
      const D = { x: width, y: 0 }
      const pt = (q) => new Point(q.x, q.y)
      paths.seam = new Path().move(pt(A)).line(pt(B)).line(pt(C)).line(pt(D)).close().addClass('fabric')
      if (sa) paths.sa = saOutline(Path, Point, [A, B, C, D], [sa, k.hem, sa, sa]).addClass('fabric sa')
      points.sideTop = pt(A)
      points.sideHip = new Point(0, k.hipDepth)
      snippets.sideHip = new Snippet('notch', points.sideHip)
      // Each pleat: fold at face + (k x pitch), brought over to fold + 2 x depth; at the top, past that
      for (let i = 0; i < n; i++) {
        const fold = face + i * pitch
        const to = fold + 2 * depth
        const top = Math.min(to + take, width)
        paths[`fold${i}`] = new Path().move(new Point(fold, 0)).line(new Point(fold, L)).addClass('help dashed')
        paths[`place${i}`] = new Path().move(new Point(top, 0)).line(new Point(to, k.hipDepth)).line(new Point(to, L)).addClass('mark')
        macro('pleat', { id: `pleat${i}`, from: new Point(fold, L), to: new Point(to, L), margin: 30 })
      }
      // Stitched down from the waist to the hip, on every pleat
      paths.stitch = new Path().move(new Point(0, k.hipDepth)).line(new Point(width, k.hipDepth)).addClass('mark dotted').addText('stitch pleats down to here', 'center text-sm')
      macro('grainline', { from: new Point(face * 0.5, L - 30), to: new Point(face * 0.5, 30) })
      store.cutlist.setCut({ cut: 2, from: 'fabric' })
      title(macro, { at: new Point(width / 2, L * 0.55), nr, title: label, scale: 0.6 })
      return part
    },
  }
}
