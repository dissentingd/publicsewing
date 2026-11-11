// Operations for knit garments on FreeSewing's Bibi block (blocks/bibi.mjs).
import { title } from './coat.mjs'

/**
 * A piece taken from a FreeSewing block as it is: drop the block's logo and print our title
 * (brand PublicSewing) where the block put its own, or mid-piece. `nr`, `title` as the title macro
 */
export function brandPart(sh, { nr, title: name }) {
  const { points, paths, snippets, macro, Point } = sh
  delete snippets.logo
  let at = points.title
  if (!at) {
    const box = Object.values(paths).find((p) => !p.hidden)?.bbox()
    at = box ? new Point((box.topLeft.x + box.bottomRight.x) / 2, (box.topLeft.y + box.bottomRight.y) / 2) : new Point(0, 0)
  }
  title(macro, { at, nr, title: name })
}

/**
 * A box placket down centre front (a henley's or a polo's), on a front cut on the fold at x = 0
 * with its neck at `cfNeck`: marks the box to cut out (half of it on the half front), notches its
 * foot, and stores `knit.placket` { length, width, top, bottom } for the placket piece type.
 * `length` from the neck down, `width` finished (the whole box)
 */
export function draftPlacketBox(sh, { length, width }) {
  const { points, paths, snippets, store, Point, Path } = sh
  const top = points.cfNeck.y
  const bottom = top + length
  if (!(length > width) || !(bottom < points.cfHem.y - width)) throw new Error(`placket ${length.toFixed(0)} mm doesn't fit the front`)
  points.placketTop = new Point(width / 2, top)
  points.placketFoot = new Point(width / 2, bottom)
  points.placketCf = new Point(0, bottom)
  // Cut along the box's side and across its foot (on the fold, the box is half its width)
  paths.placket = new Path().move(points.placketTop).line(points.placketFoot).line(points.placketCf).addClass('mark dashed')
  snippets.placketFoot = new sh.Snippet('notch', points.placketFoot)
  store.set('knit.placket', { length, width, top, bottom })
}
