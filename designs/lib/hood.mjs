// A hood sewn to the whole neckline, front edge to front edge, in two halves joined by a seam
// over the crown and down the back of the head (ЕМКО СЭВ т.3, the summer jacket's hood, Table 4.2
// and Figs. 19–20; drafted here from the head and the neckline instead of the book's table).
import { title } from './coat.mjs'

/**
 * One half of a two-piece hood, cut 2 (and 2 again in lining with `lining`). `size(sh)` gives:
 * - `target`: the neck edge's length, half the neckline it sews to;
 * - `spring`: how far the neck edge rises toward the face, so the hood sits round the neck;
 * - `height`: the face edge, from the neck up to the crown;
 * - `lean`: the face edge's tilt toward the face, in degrees from upright (ЕМКО: 10);
 * - `depth`: the crown, face edge back to the back of the head;
 * - `corner`: the radius rounding the crown at the back;
 * - `casing`: a turned-back casing for a drawstring on the face edge (0 for none).
 * Store: `coat.hood` { neck, target }.
 */
export function hoodPart({ name, after, nr, options, measurements = ['head'], size, enabled = () => true, lining = () => false }) {
  return {
    name,
    after,
    options,
    measurements,
    draft: (sh) => {
      const { points, paths, Path, Point, store, sa, macro, snippets, Snippet, options: o, part } = sh
      if (!enabled(o)) return part.hide()
      const { target, spring, height, lean, depth, corner, casing = 0 } = size(sh)
      // Neck edge: CB at the origin, rising toward the face; fitted to `target` long
      points.cbNeck = new Point(0, 0)
      let span = target
      for (let run = 0; run < 20; run++) {
        points.faceNeck = new Point(span, -spring)
        points.cbNeckCp = points.cbNeck.shift(0, span * 0.5)
        points.faceNeckCp = points.faceNeck.shiftFractionTowards(points.cbNeck, 0.35)
        paths.neck = new Path().move(points.cbNeck).curve(points.cbNeckCp, points.faceNeckCp, points.faceNeck)
        const delta = paths.neck.length() - target
        if (Math.abs(delta) < 0.2) break
        span -= delta
      }
      // Face edge, leaning toward the face; the crown runs back from its top
      const a = (lean * Math.PI) / 180
      points.faceTop = new Point(points.faceNeck.x + height * Math.sin(a), points.faceNeck.y - height * Math.cos(a))
      const r = Math.min(corner, depth * 0.9)
      points.crownBack = new Point(points.faceTop.x - depth + r, points.faceTop.y)
      points.backTop = new Point(points.faceTop.x - depth, points.faceTop.y + r)
      const k = (points.cbNeck.y - points.backTop.y) * 0.4
      paths.face = new Path().move(points.faceNeck).line(points.faceTop).hide()
      paths.crown = new Path()
        .move(points.faceTop)
        .line(points.crownBack)
        .curve(points.crownBack.shift(180, r * 0.55), points.backTop.shift(90, r * 0.55), points.backTop)
        .curve(points.backTop.shift(-90, k), points.cbNeck.shift(90, k), points.cbNeck)
        .hide()
      // Counter-clockwise on the page (neck, face, crown), so the allowance offsets outward
      paths.seam = paths.neck.clone().join(paths.face).join(paths.crown).close().unhide().addClass('fabric')
      paths.neck.hide()
      if (sa) {
        const face = paths.face.offset(sa + casing)
        const crown = paths.crown.offset(sa)
        const neck = paths.neck.offset(sa)
        paths.sa = neck.line(face.start()).join(face).line(crown.start()).join(crown).line(neck.start()).close().addClass('fabric sa')
      }
      // The casing folds back along the face edge; it's stitched `casing` inside it
      if (casing > 0) paths.casing = paths.face.offset(-casing).unhide().addClass('mark dashed')
      snippets.shoulder = new Snippet('notch', paths.neck.shiftAlong(store.get('coat.back').neck))
      store.set('coat.hood', { neck: paths.neck.length(), target, face: paths.face.length() })
      macro('grainline', {
        from: points.faceNeck.shift(90, 40).shift(180, 40),
        to: points.faceTop.shift(-90, 40).shift(180, 40),
      })
      const cuts = [{ cut: 2, from: 'fabric' }]
      if (lining(o)) cuts.push({ cut: 2, from: 'lining' })
      store.cutlist.setCut(cuts)
      title(macro, { at: new Point(points.faceTop.x - depth * 0.55, points.faceTop.y + height * 0.45), nr, title: 'hood', scale: 0.6 })
      return part
    },
  }
}
