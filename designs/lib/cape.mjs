// A cape (Mitchell 1921, pp. 58-59): a quarter circle on the shoulders. The back's neck and shoulder
// are laid with CB on one line and the front's with CF on the line square to it, the shoulder tips
// almost touching; the hem is an arc about a point on the line between the neck's two centres. Cut
// in two pieces, with a seam over the shoulder that flares out below it, or in one with a shoulder
// dart. No body underneath: only the neck and shoulder are the block's. Store: `cape.*`.
import { title } from './coat.mjs'
import { through } from './skirt.mjs'

/** Read a Brian back or front's neck and shoulder into the store as `cape.raw.<which>` */
export function draftCapeBase(sh, { which }) {
  const { points, paths, store, part } = sh
  const back = which === 'back'
  store.set(`cape.raw.${which}`, {
    hps: points.s3CollarSplit.clone(),
    tip: points.s3ArmholeSplit.clone(),
    centre: (back ? points.cbNeck : points.cfNeck).clone(),
    neck: back ? paths.backCollar : paths.frontCollar, // neck point -> centre
  })
  return part.hide()
}

/**
 * Lay both out and draw the hem, on a base after both `draftCapeBase`s. Lengths in mm:
 * { length: CB neck to the hem; drop: how much shorter the arc falls at CB (the hem rises to meet
 *   it); gap: between the shoulder tips; pivotLess: the arc's centre, this much less than half way
 *   from the CF neck toward the CB neck; seamDrop: the seam's straight run below the shoulder tip;
 *   flare (degrees): how far each piece's edge leans out past the seam's line below that;
 *   lap, facing: the front edge past CF, then folded back }
 * Coordinates: x along CB's line, y along CF's, from where they cross.
 */
export function draftCapeLayout(sh, { length, drop, gap, pivotLess, seamDrop, flare, lap, facing }) {
  const { Path, Point, store } = sh
  const b = store.get('cape.raw.back')
  const f = store.get('cape.raw.front')
  const g = gap / Math.SQRT2
  const bx = f.tip.x + g - b.tip.y
  const fy = b.tip.x + g - f.tip.y
  const F = (p) => new Point(p.x, p.y + fy)
  const B = (p) => new Point(p.y + bx, p.x)
  const map = (path, T) => {
    const out = new Path()
    for (const op of path.ops) {
      if (op.type === 'move') out.move(T(op.to))
      else if (op.type === 'line') out.line(T(op.to))
      else if (op.type === 'curve') out.curve(T(op.cp1), T(op.cp2), T(op.to))
    }
    return out
  }
  const backNeck = map(b.neck, B) // neck point -> CB
  const frontNeck = map(f.neck, F) // neck point -> CF
  const cb = B(b.centre)
  const cf = F(f.centre)
  const [hb, hf, tb, tf] = [B(b.hps), F(f.hps), B(b.tip), F(f.tip)]
  const span = cb.dist(cf)
  const P = cf.shiftTowards(cb, Math.max(span / 2 - pivotLess, 0))
  const hemCb = new Point(cb.x + length, 0)
  const R = P.dist(new Point(hemCb.x - drop, 0))
  const yCf = P.y + Math.sqrt(R * R - P.x * P.x)
  const onCircle = (a) => new Point(P.x + R * Math.cos(a), P.y + R * Math.sin(a))
  const angleOf = (q) => Math.atan2(q.y - P.y, q.x - P.x)
  const aCf = angleOf(new Point(0, yCf))
  const aCb = -Math.asin(P.y / R)
  const edgeX = -(lap + facing)
  const hemCf = new Point(0, yCf)
  const unit = (p, q) => {
    const n = p.dist(q)
    return { x: (q.x - p.x) / n, y: (q.y - p.y) / n }
  }
  const go = (p, d, k) => new Point(p.x + d.x * k, p.y + d.y * k)

  // The one-piece cape: a dart on the shoulder, the arc all the way round
  const tm = tb.shiftFractionTowards(tf, 0.5)
  const arc = Array.from({ length: 5 }, (_, i) => onCircle(aCf + ((aCb - aCf) * i) / 4))
  const whole = {
    top: new Path().move(cb.clone()).join(backNeck.clone().reverse()).line(tm.clone()).line(hf.clone()).join(frontNeck.clone()).line(new Point(edgeX, cf.y)).line(new Point(edgeX, yCf)),
    hem: new Path().move(new Point(edgeX, yCf)).line(hemCf.clone()).join(through(Path, Point, [hemCf, ...arc.slice(1, -1), hemCb], { x: 1, y: 0 }, { x: 0, y: -1 })),
    dart: [hb.dist(tm), hf.dist(tm)],
  }

  // The two-piece cape: the seam's line from half way between the neck points through half way
  // between the tips, straight for `seamDrop`, each piece's edge then leaning out past it
  const n7 = hb.shiftFractionTowards(hf, 0.5)
  const u = unit(n7, tm)
  // Where the seam's line meets the arc
  const ox = tm.x - P.x
  const oy = tm.y - P.y
  const toArc = -(ox * u.x + oy * u.y) + Math.sqrt((ox * u.x + oy * u.y) ** 2 - (ox * ox + oy * oy - R * R))
  const s = Math.min(seamDrop, toArc * 0.45)
  const P9 = go(tm, u, s)
  const L = toArc - s
  const t = (flare * Math.PI) / 180
  const lean = (sign) => ({ x: u.x * Math.cos(t) + sign * u.y * Math.sin(t), y: u.y * Math.cos(t) - sign * u.x * Math.sin(t) })
  const dF = lean(1) // the front's edge, toward the back
  const dB = lean(-1) // the back's edge, toward the front
  const eF = go(P9, dF, L)
  const eB = go(P9, dB, L)
  const side = (top, tip, d, end) => {
    const k = tip.dist(P9) / 3
    return new Path().move(top.clone()).line(tip.clone()).curve(go(tip, unit(top, tip), k), go(P9, d, -k), P9.clone()).line(end.clone())
  }
  const square = (d, sign) => ({ x: sign * d.y, y: -sign * d.x })
  const midF = onCircle((aCf + angleOf(eF)) / 2)
  const midB = onCircle((aCb + angleOf(eB)) / 2)
  const front = {
    edge: new Path().move(cf.clone()).line(new Point(edgeX, cf.y)).line(new Point(edgeX, yCf)),
    hem: new Path().move(new Point(edgeX, yCf)).line(hemCf.clone()).join(through(Path, Point, [hemCf, midF, eF], { x: 1, y: 0 }, square(dF, 1))),
    side: side(hf, tf, dF, eF),
    neck: frontNeck.clone(),
  }
  const back = {
    neck: backNeck.clone(),
    side: side(hb, tb, dB, eB),
    hem: through(Path, Point, [eB, midB, hemCb], square(dB, 1), { x: 0, y: -1 }),
    start: cb.clone(),
    end: hemCb.clone(),
  }
  store.set('cape.layout', { front, back, whole, cf, cb, edgeX, lap, facing, yCf })
  store.set('cape.seams', {
    side: [front.side.length(), back.side.length()],
    shoulder: [hf.dist(tf), hb.dist(tb)],
    dart: whole.dart,
    hemCf: yCf - cf.y,
    hemCb: length,
    sweep: 2 * (whole.hem.length() - (hemCf.x - edgeX)),
  })
  store.set('coat.back', { neck: b.neck.length() })
  store.set('coat.front', { neck: f.neck.length() })
  return sh.part
}

/**
 * A dolman cape (Pivnick 1949, Chapter XIX) on a fitted body, read by `draftJacketBase` into
 * `jacket.raw.*`: smooth over the shoulders, a bust dart in the front's. On each side, a point `arm`
 * out from the armhole on its own level, a point `hip` out from a quarter seat on the seat line; the
 * side seam is a straight line through them, and a curve from the shoulder tip, leaving along the
 * shoulder, goes over the arm to the first. CB and CF straight, the front with `lap` and `facing`
 * as the cape's. Lengths in mm; `length` waist to hem; `dartLen` the arm dart's. The side seams are the
 * same length below the seat line (notched), and above it once a dart on the longer one's arm curve is sewn.
 * Store: as `draftCapeLayout`, the back mirrored so its CB fold is at x = 0.
 */
export function draftDolmanLayout(sh, { seat, hipDepth, length, arm, hip, lap, facing, dartLen }) {
  const { Path, Point, store } = sh
  const b = store.get('jacket.raw.back')
  const f = store.get('jacket.raw.front')
  const unit = (p, q) => {
    const n = p.dist(q)
    return { x: (q.x - p.x) / n, y: (q.y - p.y) / n }
  }
  const go = (p, d, k) => new Point(p.x + d.x * k, p.y + d.y * k)
  const lines = (r) => {
    const cx = r.centerNeck.x
    const hemY = r.centerWaist.y + length
    const P2 = new Point(r.armhole.x + arm, r.armhole.y)
    const P3 = new Point(Math.max(cx + seat / 4 + hip, P2.x), r.centerWaist.y + hipDepth)
    return { cx, hemY, P2, P3, d: unit(P2, P3), below: (hemY - P3.y) / unit(P2, P3).y }
  }
  const lf = lines(f)
  const lb = lines(b)
  const below = (lf.below + lb.below) / 2
  const shoulderOf = (r) => (r.upper.tip && r.upper.c.dist(r.upper.s) > 0.5 ? r.upper.c.dist(r.hps) + r.upper.s.dist(r.shoulder) : r.hps.dist(r.shoulder))
  const armCurve = (r, l) => {
    const k = r.shoulder.dist(l.P2) / 3
    return new Path().move(r.shoulder.clone()).curve(go(r.shoulder, unit(r.hps, r.shoulder), k), go(l.P2, l.d, -k), l.P2.clone())
  }
  const seamUp = (r, l) => shoulderOf(r) + armCurve(r, l).length() + l.P2.dist(l.P3)
  // The longer side's excess goes in a dart on its curve over the arm, part way down, pointing into the
  // cape (her Figure 6, "small darts ... along the shoulder curve"; one here). Its other side is `inward`
  const excess = seamUp(b, lb) - seamUp(f, lf)
  const upper = (r, l, dart) => {
    const top = new Path().move(r.hps.clone())
    if (r.upper.tip && r.upper.c.dist(r.upper.s) > 0.5) top.line(r.upper.c.clone()).line(r.upper.tip.clone()).line(r.upper.s.clone())
    let curve = armCurve(r, l)
    if (dart > 1) {
      const m = curve.length() * 0.4
      const [p, q] = [curve.shiftAlong(m - dart / 2), curve.shiftAlong(m + dart / 2)]
      const mid = p.shiftFractionTowards(q, 0.5)
      const inward = unit(mid, r.armhole)
      const tip = go(mid, inward, Math.min(dartLen, mid.dist(r.armhole) * 0.8))
      const [before] = curve.split(p)
      const [, after] = curve.split(q)
      curve = before.line(tip).line(q).join(after)
    }
    return top.line(r.shoulder.clone()).join(curve).line(l.P3.clone()).line(go(l.P3, l.d, below))
  }
  const hemOf = (corner, d, hemY, cx) => ({ corner, centre: new Point(cx, hemY), square: { x: d.y, y: -d.x } })
  // The front, as it is
  const fc = go(lf.P3, lf.d, below)
  const edgeX = lf.cx - lap - facing
  const fh = hemOf(fc, lf.d, lf.hemY, lf.cx)
  const yCf = lf.hemY
  const front = {
    edge: new Path().move(f.centerNeck.clone()).line(new Point(edgeX, f.centerNeck.y)).line(new Point(edgeX, yCf)),
    hem: new Path().move(new Point(edgeX, yCf)).line(fh.centre.clone()).join(through(Path, Point, [fh.centre, fc], { x: 1, y: 0 }, fh.square)),
    side: upper(f, lf, Math.max(-excess, 0)),
    neck: f.neck.clone(),
  }
  // The back, mirrored, so its outline runs the same way round with the fold at x = 0
  const M = (p) => new Point(lb.cx - p.x, p.y)
  const map = (path) => {
    const out = new Path()
    for (const op of path.ops) {
      if (op.type === 'move') out.move(M(op.to))
      else if (op.type === 'line') out.line(M(op.to))
      else if (op.type === 'curve') out.curve(M(op.cp1), M(op.cp2), M(op.to))
    }
    return out
  }
  const bc = M(go(lb.P3, lb.d, below))
  const bd = unit(M(lb.P3), bc)
  const back = {
    neck: map(b.neck),
    side: map(upper(b, lb, Math.max(excess, 0))),
    hem: through(Path, Point, [bc, new Point(0, lb.hemY)], { x: bd.y, y: -bd.x }, { x: 1, y: 0 }),
  }
  store.set('cape.layout', {
    front,
    back,
    cf: f.centerNeck.clone(),
    cb: M(b.centerNeck),
    edgeX,
    lap,
    facing,
    yCf,
    notches: { front: [lf.P3, f.shoulder], back: [M(lb.P3), M(b.shoulder)] },
  })
  store.set('cape.seams', {
    below,
    upper: [seamUp(f, lf) - Math.max(-excess, 0), seamUp(b, lb) - Math.max(excess, 0)],
    armDart: Math.abs(excess),
    dart: [f.upper.c.dist(f.upper.tip), f.upper.s.dist(f.upper.tip)],
    hem: [front.hem.length() - (lf.cx - edgeX), back.hem.length()],
  })
  store.set('coat.back', { neck: b.neck.length() })
  store.set('coat.front', { neck: f.neck.length() })
  return sh.part
}

/**
 * A cape's `which` piece: 'front' (cut 2) or 'back' (on the fold at CB), or 'whole', the one-piece
 * cape (on the fold at CB). `buttons(sh)`: { count, spacing } on CF. `enabled` hides it.
 */
export function capePart({ name, after, which, nr, buttons = () => ({ count: 0 }), enabled = () => true }) {
  return {
    name,
    after,
    draft: (sh) => {
      const { points, paths, Path, Point, Snippet, snippets, store, sa, macro, options, part } = sh
      if (!enabled(options)) return part.hide()
      const c = store.get('cape.layout')
      const copy = (path) => {
        const out = new Path()
        for (const op of path.ops) {
          if (op.type === 'move') out.move(new Point(op.to.x, op.to.y))
          else if (op.type === 'line') out.line(new Point(op.to.x, op.to.y))
          else if (op.type === 'curve') out.curve(new Point(op.cp1.x, op.cp1.y), new Point(op.cp2.x, op.cp2.y), new Point(op.to.x, op.to.y))
        }
        return out
      }
      const hem = 2 // the hem's allowance, in seam allowances: it's curved, so narrow
      let fold = null
      if (which === 'front') {
        const edge = copy(c.front.edge)
        const h = copy(c.front.hem)
        const up = copy(c.front.side).reverse()
        const neck = copy(c.front.neck)
        paths.seam = edge.join(h).join(up).join(neck).close().addClass('fabric')
        if (sa) {
          let o = null
          for (const [p, k] of [[copy(c.front.edge), 1], [copy(c.front.hem), hem], [copy(c.front.side).reverse(), 1], [copy(c.front.neck), 1]]) {
            const off = p.offset(sa * k)
            o = o ? o.line(off.start()).join(off) : off
          }
          paths.sa = o.close().addClass('fabric sa')
        }
        macro('grainline', { from: new Point(c.cf.x + 20, c.yCf - 40), to: new Point(c.cf.x + 20, c.cf.y + 60) })
        store.cutlist.setCut({ cut: 2, from: 'fabric' })
      } else {
        const outline =
          which === 'back'
            ? copy(c.back.neck).reverse().join(copy(c.back.side)).join(copy(c.back.hem))
            : copy(c.whole.top).join(copy(c.whole.hem))
        fold = [outline.start(), outline.end()]
        paths.seam = outline.clone().close().addClass('fabric')
        if (sa) {
          const parts =
            which === 'back'
              ? [[copy(c.back.neck).reverse().join(copy(c.back.side)), 1], [copy(c.back.hem), hem]]
              : [[copy(c.whole.top), 1], [copy(c.whole.hem), hem]]
          let o = null
          for (const [p, k] of parts) {
            const off = p.offset(sa * k)
            o = o ? o.line(off.start()).join(off) : off
          }
          paths.sa = new Path().move(fold[0]).line(o.start()).join(o).line(fold[1]).addClass('fabric sa')
        }
        macro('cutonfold', { from: fold[0], to: fold[1], grainline: true })
        store.cutlist.setCut({ cut: 1, from: 'fabric', onFold: true })
      }
      if (which !== 'back') {
        paths.lapFold = new Path().move(new Point(-c.lap, c.cf.y)).line(new Point(-c.lap, c.yCf)).addClass('mark dotted').addText('fold', 'center text-sm')
        paths.cf = new Path().move(new Point(0, c.cf.y)).line(new Point(0, c.yCf)).addClass('help dashed')
        const { count = 0, spacing = 0 } = buttons(sh)
        for (let i = 0; i < count; i++) {
          points[`button${i}`] = new Point(0, c.cf.y + spacing * (i + 0.5))
          snippets[`button${i}`] = new Snippet('button', points[`button${i}`])
        }
      }
      for (const [i, q] of (c.notches?.[which] ?? []).entries()) snippets[`notch${i}`] = new Snippet('notch', new Point(q.x, q.y))
      const bb = paths.seam.bbox()
      const at = new Point(bb.topLeft.x + (bb.bottomRight.x - bb.topLeft.x) * 0.45, bb.topLeft.y + (bb.bottomRight.y - bb.topLeft.y) * 0.6)
      title(macro, { at, nr, title: which, scale: 0.6 })
      return part
    },
  }
}
