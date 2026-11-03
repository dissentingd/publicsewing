// A coat back cut into panels across the body (Simons, Diagram XII, the hunting coat): a yoke,
// a middle panel (optionally with an inverted action pleat), and a lower back below a waist
// seam, all on the fold at CB.
//
// Draft the whole back once on a hidden base piece (coatBack, then backYokeCut), then make
// each panel with backPanelPart({ from: base, panel: 'yoke' | 'middle' | 'lower' }).
// The pleat panel stores its spread under `coat.backPleat`, the armhole's two halves (yoke and
// middle) under `coat.backArmhole`.
import { cleanup, armhole, sideAt, sidePath, title } from './coat.mjs'

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

/** Pleats' spacing, closer if need be, so the last of `n` stays short of `end` */
const fitSpacing = (spacing, start, end, n) => (n > 1 ? Math.min(spacing, (end * 0.95 - start) / (n - 1)) : spacing)

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
  // x + pleat and x + 2 x pleat, brought together at x + pleat. `pleats` of them, `spacing` apart
  // when sewn.
  middle: ({ points, paths, Path, Point, store }, { pleat: d = 0, pleatAt = 0.5, pleats = 1, spacing = 0 }) => {
    const [below] = paths.armhole.split(points.armYoke)
    const px = points.armYoke.x * pleatAt
    spacing = fitSpacing(spacing, px, points.armYoke.x, pleats)
    const shift = (p) => p.translate(2 * d * pleats, 0)
    points.pleatTop = new Point(px, points.cbYoke.y)
    points.pleatBottom = new Point(px, points.cbWaist.y)
    points.titleAt = new Point(px * 0.45, (points.cbYoke.y + points.cbWaist.y) / 2)
    for (let k = 0; k < pleats; k++) {
      const x0 = px + k * (spacing + 2 * d)
      for (const [i, x] of [x0, x0 + d, x0 + 2 * d].entries()) {
        paths[`pleat${3 * k + i}`] = new Path()
          .move(new Point(x, points.cbYoke.y))
          .line(new Point(x, points.cbWaist.y))
          .addClass(i === 1 ? 'help dotted' : 'mark dashed')
      }
    }
    store.set('coat.backPleat', { pleat: 2 * d * pleats, ...(pleats > 1 ? { last: px + (pleats - 1) * spacing, width: points.armYoke.x } : {}) })
    return new Path()
      .move(points.cbWaist)
      .line(shift(points.sideWaist))
      .line(shift(points.armhole))
      .join(below.translate(2 * d * pleats, 0))
      .line(points.pleatTop)
      .line(points.cbYoke)
  },
  // `vent` (mm): a CB seam open from the waist to the hem, lapping that far past CB; cut in pairs
  lower: ({ points, Path, Point }, { vent = 0 }) => {
    points.titleAt = new Point(points.hem.x * 0.4, (points.cbWaist.y + points.cbHem.y) / 2)
    if (vent > 0) {
      points.ventHem = new Point(-vent, points.cbHem.y)
      points.ventTop = new Point(-vent, points.cbWaist.y)
      return new Path().move(points.ventHem).line(points.hem).line(points.seat).line(points.sideWaist).line(points.ventTop)
    }
    return new Path()
      .move(points.cbHem)
      .line(points.hem)
      .line(points.seat)
      .line(points.sideWaist)
      .line(points.cbWaist)
  },
  // Everything below the yoke in one piece, yoke line to hem (no waist seam)
  body: ({ points, paths, Path, Point }) => {
    const [below] = paths.armhole.split(points.armYoke)
    points.titleAt = new Point(points.hem.x * 0.4, points.cbWaist.y)
    return new Path().move(points.cbHem).line(points.hem).join(sidePath(points, Path)).join(below).line(points.cbYoke)
  },
}

/**
 * One panel of the back drafted on `from` (a hidden base piece). `args(sh)` gives the pleat;
 * `lining(options)` true cuts it again in lining.
 */
export function backPanelPart({ name, from, panel, nr, label, args = () => ({}), lining = () => false }) {
  return {
    name,
    from,
    hide: { inherited: true },
    draft: (sh) => {
      cleanup(sh, ['backArmhole', 'backCollar', 'armhole'])
      for (const p of ['backArmhole', 'backCollar', 'armhole']) sh.paths[p].hide()
      const { paths, Path, Point, points, sa, macro, store } = sh
      const a = args(sh)
      const outline = outlines[panel](sh, a)
      paths.seam = outline.clone().close().unhide().addClass('fabric')
      if (a.vent > 0 && panel === 'lower') {
        if (sa) paths.sa = outline.clone().close().offset(sa).addClass('fabric sa')
        const gx = points.hem.x * 0.4
        macro('grainline', { from: new Point(gx, points.cbHem.y - 30), to: new Point(gx, points.cbWaist.y + 30) })
        store.cutlist.setCut({ cut: 2, from: 'fabric' })
        store.set('coat.backVent', { width: a.vent, length: points.ventTop.dist(points.ventHem) })
      } else {
        if (sa) {
          const off = outline.offset(sa)
          paths.sa = new Path().move(outline.start()).line(off.start()).join(off).line(outline.end()).addClass('fabric sa')
        }
        macro('cutonfold', { from: outline.start(), to: outline.end(), grainline: true })
        store.cutlist.setCut({ cut: 1, from: 'fabric', onFold: true })
        if (lining(sh.options)) store.cutlist.addCut({ cut: 1, from: 'lining', onFold: true })
      }
      title(macro, { at: points.titleAt, nr, title: label, scale: 0.6 })
      return sh.part
    },
  }
}

/**
 * Mark a coat front's yoke seam (after coatFront): from the front edge `depth` down to the
 * armhole at `armDepth` (each a share of CF neck to the chest line; `armDepth` defaults to
 * `depth`, a level seam). Cut it into frontPanelParts.
 */
export function frontYokeCut(sh, { depth, armDepth = depth }) {
  const { points, paths, Path, store } = sh
  const span = points.armhole.y - points.cfNeck.y
  paths.armhole = armhole(points, Path, paths.frontArmhole).hide()
  points.edgeYoke = paths.edge.intersectsY(points.cfNeck.y + span * depth)[0]
  // Kept inside the armhole: below the shoulder tip, above the underarm
  const top = points.s3ArmholeSplit.y
  const y = Math.min(Math.max(points.cfNeck.y + span * armDepth, top + (points.armhole.y - top) * 0.1), points.armhole.y - span * 0.05)
  points.armYoke = paths.armhole.intersectsY(y)[0]
  // Next to one of the armhole's joints, on it: splitting a hair from a joint leaves a sliver
  for (const j of [points.armholeHollow, points.armholePitch]) {
    if (points.armYoke && points.armYoke.dist(j) < 3) points.armYoke = j.clone()
  }
  if (!points.edgeYoke || !points.armYoke) throw new Error('frontYokeCut: the yoke seam misses the front edge or the armhole')
  const [below, above] = paths.armhole.split(points.armYoke)
  store.set('coat.frontYoke', { seam: points.edgeYoke.dist(points.armYoke), below: below.length(), above: above.length() })
}

/** Seam allowance round an outline of [path, k] segments, each offset k x sa, joined by lines */
function outlineSa(Path, segments, sa) {
  let out
  for (const [p, k] of segments) {
    const o = p.offset(sa * k)
    out = out ? out.line(o.start()).join(o) : o
  }
  return out.close()
}

const frontOutlines = {
  // Front edge down to the yoke seam, across to the armhole, up it, shoulder, neckline
  yoke: ({ points, paths }) => {
    const [, above] = paths.armhole.split(points.armYoke)
    const [edge] = paths.edge.split(points.edgeYoke)
    points.titleAt = points.edgeYoke.shiftFractionTowards(points.s3CollarSplit, 0.5)
    const top = edge.line(points.armYoke).join(above).line(points.s3CollarSplit).join(paths.neckline.reverse())
    return [[top, 1]]
  },
  // The yoke seam down the front edge, the hem, the side seam, the armhole up to the yoke seam
  lower: ({ points, paths, Path, Point }) => {
    const [below] = paths.armhole.split(points.armYoke)
    const [, edge] = paths.edge.split(points.edgeYoke)
    points.titleAt = new Point(points.armhole.x / 2, points.cfWaist.y)
    return [
      [edge, 1],
      [paths.hemBase, 3],
      [sidePath(points, Path).join(below).line(points.edgeYoke), 1],
    ]
  },
  // Cut at the waist too (a Norfolk's): the yoke seam to the waist seam, with `pleats` pleats, the
  // first `pleatAt` of the front's width from CF, each as the back's (2 x `pleat` wider, `spacing`
  // apart when sewn). Across a pleat the yoke seam steps level, so it closes up when folded.
  middle: ({ points, paths, Path, Point, store }, { pleat: d = 0, pleats = 0, spacing = 0, pleatAt = 0.5 }) => {
    const { edgeYoke, armYoke, sideWaist } = points
    const [below] = paths.armhole.split(armYoke)
    const [, down] = paths.edge.split(edgeYoke)
    points.edgeAtWaist = down.intersectsY(points.cfWaist.y)[0]
    const [edge] = down.split(points.edgeAtWaist)
    const n = d > 0 ? pleats : 0
    const total = 2 * d * n
    const seamY = (x) => edgeYoke.y + ((armYoke.y - edgeYoke.y) * (x - edgeYoke.x)) / (armYoke.x - edgeYoke.x)
    const x0 = points.armhole.x * pleatAt
    spacing = fitSpacing(spacing, x0, armYoke.x, n)
    const xs = Array.from({ length: n }, (_, k) => x0 + k * spacing)
    points.titleAt = new Point(points.armhole.x * 0.25, (edgeYoke.y + points.cfWaist.y) / 2)
    xs.forEach((x, k) => {
      const at = x + 2 * d * k
      for (const [i, px] of [at, at + d, at + 2 * d].entries()) {
        paths[`pleat${3 * k + i}`] = new Path()
          .move(new Point(px, seamY(x)))
          .line(new Point(px, points.cfWaist.y))
          .addClass(i === 1 ? 'help dotted' : 'mark dashed')
      }
    })
    const side = new Path().move(sideWaist).line(points.armhole).join(below).translate(total, 0)
    let top = edge.line(sideWaist.translate(total, 0)).join(side)
    for (let k = n - 1; k >= 0; k--) {
      top = top.line(new Point(xs[k] + 2 * d * (k + 1), seamY(xs[k]))).line(new Point(xs[k] + 2 * d * k, seamY(xs[k])))
    }
    store.set('coat.frontPleat', { pleat: total, last: n ? xs[n - 1] : 0, width: armYoke.x })
    return [[top.line(edgeYoke), 1]]
  },
  // The waist seam down the front edge, the hem, the side seam to the waist
  skirt: ({ points, paths, Path, Point }) => {
    const [, down] = paths.edge.split(points.edgeYoke)
    points.edgeAtWaist = down.intersectsY(points.cfWaist.y)[0]
    const [, edge] = down.split(points.edgeAtWaist)
    const [side] = sidePath(points, Path).split(points.sideWaist)
    points.titleAt = new Point(points.hem.x * 0.25, (points.cfWaist.y + points.cfHem.y) / 2)
    return [
      [edge, 1],
      [paths.hemBase, 3],
      [side.line(points.edgeAtWaist), 1],
    ]
  },
}

/**
 * One panel of a front cut by frontYokeCut, drafted on `from` (the hidden whole front);
 * `lining(options)` true cuts it again in lining.
 */
export function frontPanelPart({ name, from, panel, nr, label, keep = [], args = () => ({}), lining = () => false }) {
  return {
    name,
    from,
    hide: { inherited: true },
    draft: (sh) => {
      const buttons = Object.keys(sh.snippets).filter((s) => s.startsWith('button'))
      cleanup(sh, ['edge', 'hemBase', 'neckline', 'armhole', ...(panel === 'yoke' ? [] : keep)])
      const { paths, Path, Point, points, snippets, Snippet, sa, macro, store } = sh
      for (const p of ['edge', 'hemBase', 'neckline', 'armhole']) paths[p].hide()
      // Each button placed on the whole front goes on the panel it falls in, either side of the seam
      const { edgeYoke, armYoke } = points
      const seamY = (x) => edgeYoke.y + ((armYoke.y - edgeYoke.y) * (x - edgeYoke.x)) / (armYoke.x - edgeYoke.x)
      for (const b of buttons) {
        const y = points[b].y
        const yoke = y < seamY(points[b].x)
        const skirt = !yoke && y >= points.cfWaist.y
        if (panel === 'yoke' ? yoke : panel === 'lower' ? !yoke : panel === 'skirt' ? skirt : !yoke && !skirt) snippets[b] = new Snippet('button', points[b])
      }
      const segments = frontOutlines[panel](sh, args(sh))
      paths.seam = segments.map(([p]) => p).reduce((a, b) => a.join(b)).close().unhide().addClass('fabric')
      if (sa) paths.sa = outlineSa(Path, segments, sa).addClass('fabric sa')
      const gx = points.armhole.x * 0.35
      const [y0, y1] = {
        yoke: [points.edgeYoke.y - 20, points.s3CollarSplit.y + 30],
        lower: [points.cfHem.y - 40, points.edgeYoke.y + 30],
        middle: [points.cfWaist.y - 20, points.edgeYoke.y + 30],
        skirt: [points.cfHem.y - 40, points.cfWaist.y + 30],
      }[panel]
      macro('grainline', { from: new Point(gx, y0), to: new Point(gx, y1) })
      store.cutlist.setCut({ cut: 2, from: 'fabric' })
      if (lining(sh.options)) store.cutlist.addCut({ cut: 2, from: 'lining' })
      title(macro, { at: points.titleAt, nr, title: label, scale: 0.6 })
      return sh.part
    },
  }
}
