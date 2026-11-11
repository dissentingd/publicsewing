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
