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

/**
 * An open front (a cardigan's), on Bibi's front cut on the fold at x = 0: a straight V neck from the
 * neck point down to centre front `depth` below it, centre front a cut edge, cut 2. Rebuilds the
 * seam allowance round the whole piece (Bibi leaves the neck and the fold without), and stores
 * `knit.front` { edge: centre front from the V to the hem, neck: the V's length, vY }. Sets
 * `neckSizeFront` to the V's length, as Bibi sets it to its neckline's
 */
export function draftOpenFront(sh, { depth }) {
  const { points, paths, macro, store, sa, options, Path, Point } = sh
  const vY = points.neck.y + depth
  if (!(vY > points.neck.y + 20 && vY < points.cfHem.y - 50)) throw new Error(`V neck ${depth.toFixed(0)} mm deep doesn't fit the front`)
  points.vBottom = new Point(0, vY)
  paths.frontNeck = new Path().move(points.neck).line(points.vBottom).addClass('fabric')
  paths.centerLine = new Path().move(points.vBottom).line(points.cfHem).addClass('fabric')
  delete paths.neckBinding
  macro('rmcutonfold')
  const gx = Math.min(points.neck.x, points.armhole.x / 3)
  macro('grainline', { from: new Point(gx, points.cfHem.y - 30), to: new Point(gx, vY + 30) })
  store.cutlist.setCut({ cut: 2, from: 'fabric' })
  if (sa) {
    // As Bibi's own allowance (deep at a plain hem), then on round the neck and down centre front
    const sides = paths.sideSeam1 ? [paths.sideSeam1, paths.sideSeam2] : [paths.sideSeam]
    let p = new Path().move(points.cfHem).join(paths.hem.offset(sa * (options.useWaistRibbing ? 1 : 3)))
    for (const s of sides) p = p.join(s.offset(sa))
    p = p
      .join(paths.armhole.offset(sa * (store.get('separateSleeves') ? 1 : 0)))
      .join(paths.shoulder.offset(sa))
      .join(paths.frontNeck.offset(sa))
      .join(paths.centerLine.offset(sa))
      .close()
    paths.sa = p.attr('class', 'fabric sa')
  }
  store.set('neckSizeFront', paths.frontNeck.length())
  store.set('knit.front', { edge: paths.centerLine.length(), neck: paths.frontNeck.length(), vY })
}
