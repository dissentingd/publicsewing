// Patch pockets, their flaps, and belts, for the PublicSewing coats.
// A pocket spec p: { x, y, w, h, shape: 'square'|'pointed'|'rounded'|'chamfered', topHem, pleat, flap }
// in mm on the front (x from CF, y from the neck line); `flap` is { h, gap } or absent.
import { title } from './coat.mjs'

/**
 * Pocket (or flap) outline, top-left corner at (x, y). `spread` opens a box pleat at the
 * centre (the piece gets 2 x spread wider there); `topExtra` raises the top edge (for the
 * fold-over hem).
 */
export function pocketPath(Path, Point, x, y, p, spread = 0, topExtra = 0) {
  const { w, h } = p
  const W = w + 2 * spread
  const top = y - topExtra
  // Counter-clockwise on the page (down the left side first), so offsets go outward
  const path = new Path().move(new Point(x + W, top)).line(new Point(x, top))
  if (p.shape === 'pointed') {
    const pt = w * 0.12
    path.line(new Point(x, y + h - pt)).line(new Point(x + w / 2, y + h))
    if (spread) path.line(new Point(x + w / 2 + 2 * spread, y + h))
    path.line(new Point(x + W, y + h - pt))
  } else if (p.shape === 'chamfered') {
    // Bottom corners cut off square (Diagram XIII's pockets)
    const c = Math.min(w, h) * 0.14
    path
      .line(new Point(x, y + h - c))
      .line(new Point(x + c, y + h))
      .line(new Point(x + W - c, y + h))
      .line(new Point(x + W, y + h - c))
  } else if (p.shape === 'rounded') {
    const r = Math.min(w, h) * 0.3
    const k = 0.55 * r
    path
      .line(new Point(x, y + h - r))
      .curve(new Point(x, y + h - r + k), new Point(x + r - k, y + h), new Point(x + r, y + h))
      .line(new Point(x + W - r, y + h))
      .curve(new Point(x + W - r + k, y + h), new Point(x + W, y + h - r + k), new Point(x + W, y + h - r))
  } else {
    path.line(new Point(x, y + h)).line(new Point(x + W, y + h))
  }
  return path.close()
}

/** Mark a pocket (and its flap, if any) on a front */
export function markPocket({ paths, Path, Point }, id, p) {
  paths[id] = pocketPath(Path, Point, p.x, p.y, p).addClass('mark dashed')
  if (p.flap) {
    const f = flapSpec(p)
    paths[`${id}Flap`] = pocketPath(Path, Point, p.x - (f.w - p.w) / 2, p.y - p.flap.gap, f).addClass('mark dotted')
  }
}

/** The flap covers the pocket mouth, a little wider than the pocket, same bottom shape */
export const flapSpec = (p) => ({ w: p.w + 6, h: p.flap.h, shape: p.shape })

/**
 * A patch pocket part. `key` names the pocket in store `coat.pockets`; `enabled(options)`
 * decides whether the design has it. Box pleat (p.pleat) and fold-over top hem included.
 */
export function pocketPart({ name, after, key, nr, label, cut, enabled = () => true }) {
  return {
    name,
    after,
    draft: ({ points, paths, Path, Point, store, sa, macro, options, part }) => {
      if (!enabled(options)) return part.hide()
      const p = store.get('coat.pockets')[key]
      const s = p.pleat || 0
      paths.seam = pocketPath(Path, Point, 0, 0, p, s, p.topHem).addClass('fabric')
      paths.fold = new Path().move(new Point(0, 0)).line(new Point(p.w + 2 * s, 0)).addClass('help dashed')
      if (s) {
        // Box pleat: fold on the outer lines, bring them to the centre line
        for (const [i, px] of [p.w / 2, p.w / 2 + s, p.w / 2 + 2 * s].entries()) {
          paths[`pleat${i}`] = new Path()
            .move(new Point(px, -p.topHem))
            .line(new Point(px, p.h))
            .addClass(i === 1 ? 'help dotted' : 'mark dashed')
        }
      }
      if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
      macro('grainline', { from: new Point(p.w * 0.2, p.h * 0.8), to: new Point(p.w * 0.2, p.h * 0.1) })
      store.cutlist.setCut({ cut, from: 'fabric' })
      title(macro, { at: new Point(p.w / 2 + s, p.h * 0.45), nr, title: label, scale: 0.4 })
      return part
    },
  }
}

/** The flap for pocket `key`: outer and lining, cut 2 per pocket */
export function flapPart({ name, after, key, nr, label, cut, enabled = () => true }) {
  return {
    name,
    after,
    draft: ({ points, paths, Path, Point, store, sa, macro, options, part, Snippet, snippets }) => {
      const p = store.get('coat.pockets', null)?.[key]
      if (!enabled(options) || !p?.flap) return part.hide()
      const f = flapSpec(p)
      paths.seam = pocketPath(Path, Point, 0, 0, f).addClass('fabric')
      if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
      points.button = new Point(f.w / 2, f.h * 0.6)
      // A tailored jacket's flap has no buttonhole (`flap.button: false`)
      if (p.flap.button !== false) snippets.buttonhole = new Snippet('buttonhole', points.button)
      macro('grainline', { from: new Point(f.w * 0.15, f.h * 0.8), to: new Point(f.w * 0.15, f.h * 0.15) })
      store.cutlist.setCut([
        { cut, from: 'fabric' },
        { cut, from: 'lining' },
      ])
      title(macro, { at: new Point(f.w * 0.3, f.h * 0.3), nr, title: label, scale: 0.3 })
      return part
    },
  }
}

/**
 * Belt pieces sewn round the waist over the body: the back piece runs from CB to the side
 * seam, the front piece from the side seam to the front edge; `coat.belt` holds { w, y }.
 */
export function beltPart({ name, after, piece, nr, enabled = () => true }) {
  return {
    name,
    after,
    draft: ({ paths, Path, Point, store, sa, macro, options, part }) => {
      if (!enabled(options)) return part.hide()
      const b = store.get('coat.belt')
      const L =
        piece === 'back'
          ? store.get('coat.back').waist
          : store.get('coat.front').waist + store.get('coat.frontEdge').ext
      paths.seam = new Path()
        .move(new Point(L, 0))
        .line(new Point(0, 0))
        .line(new Point(0, b.w))
        .line(new Point(L, b.w))
        .close()
        .addClass('fabric')
      if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
      if (piece === 'back') {
        macro('cutonfold', { from: new Point(0, 0), to: new Point(0, b.w), grainline: false })
        store.cutlist.setCut({ cut: 2, from: 'fabric', onFold: true })
      } else store.cutlist.setCut({ cut: 4, from: 'fabric' })
      macro('grainline', { from: new Point(L * 0.1, b.w / 2), to: new Point(L * 0.9, b.w / 2) })
      title(macro, { at: new Point(L * 0.35, b.w * 0.3), nr, title: `${piece}Belt`, scale: 0.25 })
      return part
    },
  }
}

/**
 * The pieces of a set-in flap pocket `key` in store `jacket.pockets` ({ w: mouth, flap: depth,
 * bag: depth }): `piece` 'flap' (fabric and lining, as long as the mouth), 'jet' (a fabric
 * strip for the mouth's lower edge, folded lengthwise) or 'bag' (lining, two per pocket,
 * rounded at the bottom). Cut for both fronts.
 */
export function setInPocketPart({ name, after, key, piece, nr, label, enabled = () => true }) {
  return {
    name,
    after,
    draft: ({ paths, Path, Point, store, sa, macro, options, part }) => {
      const q = store.get('jacket.pockets')[key]
      if (!enabled(options) || !q) return part.hide()
      const rect = (W, H) =>
        new Path().move(new Point(W, 0)).line(new Point(0, 0)).line(new Point(0, H)).line(new Point(W, H)).close()
      let W
      let H
      if (piece === 'flap') {
        ;[W, H] = [q.w, q.flap]
        paths.seam = rect(W, H)
        store.cutlist.setCut([
          { cut: 2, from: 'fabric' },
          { cut: 2, from: 'lining' },
        ])
      } else if (piece === 'jet') {
        // Past the mouth 20 mm each end; folded, a jet a fifth of the flap deep plus room to sew
        ;[W, H] = [q.w + 40, q.flap * 0.4 + 30]
        paths.seam = rect(W, H)
        paths.fold = new Path().move(new Point(0, H / 2)).line(new Point(W, H / 2)).addClass('help dashed')
        store.cutlist.setCut({ cut: 2, from: 'fabric' })
      } else {
        ;[W, H] = [q.w + 30, q.bag]
        const r = W * 0.2
        paths.seam = new Path()
          .move(new Point(W, 0))
          .line(new Point(0, 0))
          .line(new Point(0, H - r))
          .curve(new Point(0, H - r * 0.45), new Point(r * 0.45, H), new Point(r, H))
          .line(new Point(W - r, H))
          .curve(new Point(W - r * 0.45, H), new Point(W, H - r * 0.45), new Point(W, H - r))
          .close()
        store.cutlist.setCut({ cut: 4, from: 'lining' })
      }
      paths.seam.addClass('fabric')
      if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')
      macro('grainline', { from: new Point(W * 0.85, H * 0.8), to: new Point(W * 0.85, H * 0.2) })
      title(macro, { at: new Point(W * 0.3, H * 0.4), nr, title: label, scale: 0.25 })
      return part
    },
  }
}
