// A coat back cut into panels across the body (Simons, Diagram XII, the hunting coat): a yoke,
// a middle panel (optionally with an inverted action pleat), and a lower back below a waist
// seam, all on the fold at CB.
//
// Draft the whole back once on a hidden base piece (coatBack, then backYokeCut), then make
// each panel with backPanelPart({ from: base, panel: 'yoke' | 'middle' | 'lower' }).
// The pleat panel stores its spread under `coat.backPleat`, the armhole's two halves (yoke and
// middle) under `coat.backArmhole`.
import { cleanup, armhole, sideAt, title } from './coat.mjs'

/** Mark the yoke line `depth` (share of CB neck to chest line) down; split the armhole there */
export function backYokeCut(sh, { depth }) {
  const { points, paths, Path, Point, store } = sh
  points.cbYoke = new Point(0, points.cbNeck.y + (points.armhole.y - points.cbNeck.y) * depth)
  paths.armhole = armhole(points, Path, paths.backArmhole).hide()
  points.armYoke = paths.armhole.intersectsY(points.cbYoke.y)[0]
  points.sideWaist = sideAt(points, Point, points.cbWaist.y)
  const [below, above] = paths.armhole.split(points.armYoke)
  store.set('coat.backArmhole', { below: below.length(), above: above.length() })
}

// Each outline runs from the bottom of CB round to the top of CB (CB itself is the fold),
// counter-clockwise on the page so offsets go outward.
const outlines = {
  yoke: ({ points, paths, Path, Point }) => {
    const [, above] = paths.armhole.split(points.armYoke)
    points.titleAt = new Point(points.armYoke.x * 0.4, (points.cbNeck.y + points.cbYoke.y) / 2)
    return new Path()
      .move(points.cbYoke)
      .line(points.armYoke)
      .join(above)
      .line(points.s3CollarSplit)
      .join(paths.backCollar)
  },
  // Yoke line to waist seam. An inverted pleat `pleat` wide (each fold; the panel gets 2 x
  // pleat wider) at `pleatAt` (share of the yoke line's width from CB): fold lines at x,
  // x + pleat and x + 2 x pleat, brought together at x + pleat.
  middle: ({ points, paths, Path, Point, store }, { pleat: d = 0, pleatAt = 0.5 }) => {
    const [below] = paths.armhole.split(points.armYoke)
    const px = points.armYoke.x * pleatAt
    const shift = (p) => p.translate(2 * d, 0)
    points.pleatTop = new Point(px, points.cbYoke.y)
    points.pleatBottom = new Point(px, points.cbWaist.y)
    points.titleAt = new Point(px * 0.45, (points.cbYoke.y + points.cbWaist.y) / 2)
    for (const [i, x] of [px, px + d, px + 2 * d].entries()) {
      paths[`pleat${i}`] = new Path()
        .move(new Point(x, points.cbYoke.y))
        .line(new Point(x, points.cbWaist.y))
        .addClass(i === 1 ? 'help dotted' : 'mark dashed')
    }
    store.set('coat.backPleat', { pleat: 2 * d })
    return new Path()
      .move(points.cbWaist)
      .line(shift(points.sideWaist))
      .line(shift(points.armhole))
      .join(below.translate(2 * d, 0))
      .line(points.pleatTop)
      .line(points.cbYoke)
  },
  lower: ({ points, Path, Point }) => {
    points.titleAt = new Point(points.hem.x * 0.4, (points.cbWaist.y + points.cbHem.y) / 2)
    return new Path()
      .move(points.cbHem)
      .line(points.hem)
      .line(points.seat)
      .line(points.sideWaist)
      .line(points.cbWaist)
  },
}

/** One panel of the back drafted on `from` (a hidden base piece). `args(sh)` gives the pleat. */
export function backPanelPart({ name, from, panel, nr, label, args = () => ({}) }) {
  return {
    name,
    from,
    hide: { inherited: true },
    draft: (sh) => {
      cleanup(sh, ['backArmhole', 'backCollar', 'armhole'])
      for (const p of ['backArmhole', 'backCollar', 'armhole']) sh.paths[p].hide()
      const { paths, Path, points, sa, macro, store } = sh
      const outline = outlines[panel](sh, args(sh))
      paths.seam = outline.clone().close().unhide().addClass('fabric')
      if (sa) {
        const off = outline.offset(sa)
        paths.sa = new Path().move(outline.start()).line(off.start()).join(off).line(outline.end()).addClass('fabric sa')
      }
      macro('cutonfold', { from: outline.start(), to: outline.end(), grainline: true })
      store.cutlist.setCut({ cut: 1, from: 'fabric', onFold: true })
      title(macro, { at: points.titleAt, nr, title: label, scale: 0.6 })
      return sh.part
    },
  }
}
