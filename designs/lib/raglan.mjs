// Raglan sleeves for the Brian-based coats (Simons, Diagram XXIII, "Shawl Collar Mackinaw
// Raglan Sleeve"). The classic pivot method: on the back and the front, a raglan line runs
// from the neckline down to the armhole notch; the shoulder section above it comes off the
// body and goes onto the sleeve, matched at the notch, with the sleeve split down its centre
// into a front and a back piece (an over-arm seam from the neck down the shoulder and arm).
import { hidePresets } from '@freesewing/core'
import { sleeve as librarySleeve } from '@freesewing/library'
import { title, sidePath } from './coat.mjs'

/** Lower armhole, from the side seam up to the notch */
const lowerArmhole = (points, Path) =>
  new Path()
    .move(points.armhole)
    .curve(points.armholeCp2, points.armholeHollowCp1, points.armholeHollow)
    .curve(points.armholeHollowCp2, points.armholePitchCp1, points.armholePitch)

/**
 * Cut a body piece (after draftCoatBack / draftCoatFront) along its raglan line. `which` is
 * 'back' or 'front'. Rebuilds the piece's seam and stores the shoulder section for the sleeve.
 * `neckShare`: how far along the neckline (from the neck point) the raglan line starts.
 */
export function applyRaglan(sh, which, { neckShare = 0.3 } = {}) {
  const { points, paths, Path, store, sa } = sh
  const half = paths[`${which}Armhole`] // armhole notch -> shoulder
  const neck = paths[`${which}Collar`].clone() // neck point -> CB / CF
  points.raglanNeck = neck.shiftAlong(neck.length() * neckShare)
  const [toN, rest] = neck.split(points.raglanNeck)
  const A = points.armholePitch
  const N = points.raglanNeck
  paths.raglan = new Path()
    .move(A)
    .curve(A.shiftFractionTowards(N, 0.35), N.shiftFractionTowards(A, 0.3), N)
    .hide()
  // Shoulder section, counter-clockwise: notch, up the armhole, shoulder, neck, raglan back
  const section = new Path()
    .move(A)
    .join(half)
    .line(points.s3CollarSplit)
    .join(toN)
    .join(paths.raglan.reverse())
  store.set(`raglan.${which}`, {
    section,
    A,
    shoulder: points.s3ArmholeSplit,
    raglan: paths.raglan.length(),
    neck: toN.length(),
    shoulderSeam: points.s3CollarSplit.dist(points.s3ArmholeSplit),
  })

  const side = sidePath(points, Path)
  const lower = lowerArmhole(points, Path)
  if (which === 'back') {
    paths.saBase = side.join(lower).join(paths.raglan).join(rest).hide()
    paths.seam = new Path().move(points.cbNeck).line(points.cbHem).join(paths.hemBase).join(paths.saBase).close().addClass('fabric')
    if (sa) {
      const hem = paths.hemBase.offset(sa * 3)
      const off = paths.saBase.offset(sa)
      paths.sa = new Path().move(points.cbHem).line(hem.start()).join(hem).line(off.start()).join(off).line(points.cbNeck).addClass('fabric sa')
    }
  } else {
    paths.neckline = new Path().move(points.edgeNeck).line(points.cfNeck).join(rest.reverse()).hide()
    paths.saBase = side.join(lower).join(paths.raglan).join(paths.neckline.reverse()).hide()
    paths.seam = paths.edge.join(paths.hemBase).join(paths.saBase).close().addClass('fabric')
    if (sa) {
      const edge = paths.edge.offset(sa)
      const hem = paths.hemBase.offset(sa * 3)
      const off = paths.saBase.offset(sa)
      paths.sa = edge.line(hem.start()).join(hem).line(off.start()).join(off).line(edge.start()).addClass('fabric sa')
    }
  }
  delete sh.snippets.armholePitch
}

/** Rigid placement (with or without a mirror) taking `from` to `to`, then rotating by theta */
const placement = (Point, from, to, theta, mirror) => (p) => {
  const dx = (p.x - from.x) * (mirror ? -1 : 1)
  const dy = p.y - from.y
  return new Point(to.x + dx * Math.cos(theta) - dy * Math.sin(theta), to.y + dx * Math.sin(theta) + dy * Math.cos(theta))
}

/** Copy of a path with every point mapped (from another part's store into this part) */
const mapPath = (path, Path, f) => {
  let out = new Path()
  for (const op of path.ops) {
    if (op.type === 'move') out = out.move(f(op.to))
    else if (op.type === 'line') out = out.line(f(op.to))
    else if (op.type === 'curve') out = out.curve(f(op.cp1), f(op.cp2), f(op.to))
    else if (op.type === 'close') out = out.close()
  }
  return out
}

/**
 * A raglan sleeve piece ('front' or 'back' half of FreeSewing's fitted sleeve, plus that
 * side's shoulder section, matched at the notch with its shoulder point on the sleeve's
 * centre line). `enabled(options)` decides whether the design uses raglan sleeves.
 */
export function raglanSleevePart({ name, after, which, nr, options = {}, enabled = () => true }) {
  return {
    name,
    from: librarySleeve,
    after,
    hide: hidePresets.HIDE_TREE,
    options: { ...options, libraryFitSleeve: true },
    draft: (sh) => {
      const { points, paths, Path, Point, store, sa, macro, snippets, options: o, part } = sh
      for (const p in paths) if (p !== 'sleevecap') delete paths[p]
      for (const s in snippets) delete snippets[s]
      macro('rmtitle')
      macro('rmgrainline')
      if (!enabled(o)) return part.hide()
      const r = store.get(`raglan.${which}`)
      const front = which === 'front'
      const notch = front ? points.frontNotch : points.backNotch
      const cap = paths.sleevecap // bicepsRight (front) -> top -> bicepsLeft (back)
      const [capFront, capBack] = cap.split(notch)

      // Choose the placement that puts the section above the cap, outside the sleeve
      const v = { x: r.shoulder.x - r.A.x, y: r.shoulder.y - r.A.y }
      let best
      for (const mirror of [false, true]) {
        const vx = mirror ? -v.x : v.x
        const rr = Math.hypot(vx, v.y)
        const phi = Math.atan2(v.y, vx)
        const c = Math.max(-1, Math.min(1, -notch.x / rr))
        for (const theta of [Math.acos(c) - phi, -Math.acos(c) - phi]) {
          const f = placement(Point, r.A, notch, theta, mirror)
          const s = f(r.shoulder)
          if (s.y > notch.y) continue
          const section = mapPath(r.section, Path, f)
          const top = section.edge('top').y
          if (!best || top < best.top) best = { f, section, top, s }
        }
      }
      points.shoulder = best.s
      points.overarmBottom = points.centerWrist
      // The mapped section from the shoulder point on: shoulder seam, neck, raglan to the notch
      const shoulderSeamStart = best.s
      const afterArm = best.section.split(shoulderSeamStart)[1]
      if (front) {
        // Counter-clockwise: wrist (front side) up the underarm, cap to the notch, raglan up to
        // the neck, neck to the neck point, shoulder seam, over-arm seam down to the wrist
        paths.saBase = new Path()
          .move(points.wristRight)
          .line(points.bicepsRight)
          .join(capFront)
          .join(afterArm.reverse())
          .line(points.overarmBottom)
          .hide()
        paths.hemBase = new Path().move(points.overarmBottom).line(points.wristRight).hide()
      } else {
        paths.saBase = new Path()
          .move(points.overarmBottom)
          .line(shoulderSeamStart)
          .join(afterArm)
          .join(capBack)
          .line(points.wristLeft)
          .hide()
        paths.hemBase = new Path().move(points.wristLeft).line(points.overarmBottom).hide()
      }
      paths.seam = (front ? paths.hemBase.join(paths.saBase) : paths.saBase.join(paths.hemBase)).close().addClass('fabric')
      if (sa) {
        const hem = paths.hemBase.offset(sa * 3)
        const off = paths.saBase.offset(sa)
        paths.sa = (front ? hem.line(off.start()).join(off).line(hem.start()) : off.line(hem.start()).join(hem).line(off.start())).addClass('fabric sa')
      }
      store.set(`raglan.sleeve.${which}`, {
        cap: (front ? capFront : capBack).length(),
        overarm: shoulderSeamStart.dist(points.overarmBottom),
        underarm: front ? points.wristRight.dist(points.bicepsRight) : points.wristLeft.dist(points.bicepsLeft),
      })
      macro('grainline', { from: new Point(front ? 20 : -20, points.centerWrist.y - 40), to: new Point(front ? 20 : -20, points.centerBiceps.y) })
      store.cutlist.setCut({ cut: 2, from: 'fabric' })
      title(macro, { at: new Point(front ? 40 : -120, points.centerBiceps.y + 60), nr, title: `${which}Sleeve`, scale: 0.6 })
      return part
    },
  }
}
