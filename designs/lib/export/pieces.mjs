// A drafted pattern as plain pieces for the exporters (DXF, Seamly): outlines flattened to
// polylines in mm, FreeSewing's y-down coordinates. Runs in Node and the browser.
//
//   pieces(pattern) -> [{ name, quantity, material, onFold, seam, cut, internal, notches,
//                         drills, grain, fold, corners }]
//   seam, cut: closed polylines [[x, y], ...] (cut is null without seam allowance)
//   internal: open or closed polylines; notches: [{ x, y, angle }]; drills: [{ x, y, kind }]
//   grain, fold: two-point lines or null; corners: indexes into cut (or seam) of the
//   outline's turn points (the ends of its lines and curves), the rest are curve points.

const TOL = 0.25 // mm: the most a flattened curve strays from the true curve

const NOTCH = /^b?notch$/
const DRILL = /^(button|buttonhole|buttonhole-start|buttonhole-end|snap-stud|snap-socket|eyelet)$/

/** Path ops -> subpaths [{ pts, closed, corners }] */
export function flatten(path, tol = TOL) {
  const subs = []
  let cur = null
  const start = (p) => {
    cur = { pts: [[p.x, p.y]], closed: false, corners: [0] }
    subs.push(cur)
  }
  for (const op of path.ops) {
    if (op.type === 'move') start(op.to)
    else if (op.type === 'line') {
      cur.pts.push([op.to.x, op.to.y])
      cur.corners.push(cur.pts.length - 1)
    } else if (op.type === 'curve') {
      const [x0, y0] = cur.pts.at(-1)
      bezier([x0, y0], [op.cp1.x, op.cp1.y], [op.cp2.x, op.cp2.y], [op.to.x, op.to.y], tol, cur.pts, 0)
      cur.corners.push(cur.pts.length - 1)
    } else if (op.type === 'close') cur.closed = true
  }
  for (const s of subs) {
    // A closing segment that returns to the start leaves a duplicate last point
    const [a, b] = [s.pts[0], s.pts.at(-1)]
    if (s.pts.length > 1 && Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6) {
      s.pts.pop()
      s.corners = s.corners.filter((i) => i < s.pts.length)
      s.closed = true
    }
  }
  return subs.filter((s) => s.pts.length > 1)
}

/** Cubic Bézier by recursive subdivision until flat within tol; appends points after p0 */
function bezier(p0, p1, p2, p3, tol, out, depth) {
  const d = (p) => {
    const dx = p3[0] - p0[0]
    const dy = p3[1] - p0[1]
    const l = Math.hypot(dx, dy)
    return l < 1e-9 ? Math.hypot(p[0] - p0[0], p[1] - p0[1]) : Math.abs((p[0] - p0[0]) * dy - (p[1] - p0[1]) * dx) / l
  }
  if (depth > 16 || Math.max(d(p1), d(p2)) <= tol) {
    out.push(p3)
    return
  }
  const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const p01 = m(p0, p1)
  const p12 = m(p1, p2)
  const p23 = m(p2, p3)
  const a = m(p01, p12)
  const b = m(p12, p23)
  const c = m(a, b)
  bezier(p0, p01, a, c, tol, out, depth + 1)
  bezier(c, b, p23, p3, tol, out, depth + 1)
}

const longest = (subs) => subs.filter((s) => s.closed).sort((a, b) => b.pts.length - a.pts.length)[0] ?? subs[0]

/**
 * FreeSewing leaves a cut-on-fold piece's allowance open at the fold, where cut line and
 * seam are one. Close it by walking the seam from the allowance's end back to its start,
 * the shorter way round (the fold edge).
 */
function closeAlongSeam(sub, seam) {
  if (sub.closed) return sub
  const nearest = (p) => seam.reduce((best, q, i) => (Math.hypot(q[0] - p[0], q[1] - p[1]) < Math.hypot(seam[best][0] - p[0], seam[best][1] - p[1]) ? i : best), 0)
  const i = nearest(sub.pts.at(-1))
  const j = nearest(sub.pts[0])
  const n = seam.length
  const walk = (step) => {
    const idx = []
    for (let k = i; k !== j; k = (k + step + n) % n) idx.push(k)
    idx.push(j)
    return idx
  }
  const fwd = walk(1)
  const back = walk(-1)
  const len = (idx) => idx.slice(1).reduce((s, k, m) => s + Math.hypot(seam[k][0] - seam[idx[m]][0], seam[k][1] - seam[idx[m]][1]), 0)
  const idx = len(fwd) <= len(back) ? fwd : back
  const pts = [...sub.pts]
  const corners = [...sub.corners]
  for (const k of idx) {
    const [a, q] = [pts.at(-1), seam[k]]
    if (Math.hypot(a[0] - q[0], a[1] - q[1]) > 1e-6) pts.push(q)
  }
  corners.push(sub.pts.length - 1)
  if (Math.hypot(pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1]) < 1e-6) pts.pop()
  else corners.push(pts.length - 1)
  return { pts, closed: true, corners }
}

/** Direction (degrees, y down) across the outline at the point nearest p: the notch cut's direction */
function across(pts, p) {
  let best = { d: Infinity, angle: 0 }
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const l2 = dx * dx + dy * dy || 1
    const t = Math.max(0, Math.min(1, ((p.x - a[0]) * dx + (p.y - a[1]) * dy) / l2))
    const d = Math.hypot(a[0] + t * dx - p.x, a[1] + t * dy - p.y)
    if (d < best.d) best = { d, angle: (Math.atan2(dy, dx) * 180) / Math.PI + 90 }
  }
  return ((best.angle % 360) + 360) % 360
}

function grainThrough(pts, deg) {
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const [cx, cy] = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2]
  const a = (deg * Math.PI) / 180
  const r = 0.3 * (Math.abs(Math.sin(a)) * (Math.max(...ys) - Math.min(...ys)) + Math.abs(Math.cos(a)) * (Math.max(...xs) - Math.min(...xs))) || 10
  return [[cx - r * Math.cos(a), cy - r * Math.sin(a)], [cx + r * Math.cos(a), cy + r * Math.sin(a)]]
}

const line = (path) => {
  const s = flatten(path)[0]
  return s ? [s.pts[0], s.pts.at(-1)] : null
}

/** Every visible part with a seam line, as a piece */
export function pieces(pattern) {
  const cutlist = pattern.setStores[0].get('cutlist') ?? {}
  const out = []
  for (const [id, part] of Object.entries(pattern.parts[0])) {
    if (part.hidden || !part.paths.seam || part.paths.seam.hidden) continue
    const seam = longest(flatten(part.paths.seam))
    const sa = part.paths.sa && !part.paths.sa.hidden ? flatten(part.paths.sa) : []
    const cut = sa.length ? closeAlongSeam(longest(sa), seam.pts) : null
    const internal = []
    let grain = null
    let fold = null
    for (const [name, path] of Object.entries(part.paths)) {
      if (name.includes('grainline')) grain = line(path)
      else if (name.includes('cutonfold')) fold = line(path)
      else if (path.hidden || name === 'seam' || name === 'sa' || name.startsWith('__macro')) continue
      else for (const s of flatten(path)) internal.push(s.pts)
    }
    const c = cutlist[id] ?? {}
    // The cut-on-fold macro draws its line inset from the fold; the cutlist has the fold itself
    if (c.cutOnFold) fold = c.cutOnFold.map((p) => [p.x, p.y])
    // CAD imports want a grain line on every piece: along the fold, else the cutlist's grain
    // angle (FreeSewing's default is lengthwise) through the piece's middle
    if (!grain) grain = fold ?? grainThrough(seam.pts, c.grain ?? 90)
    const [material, cuts] = Object.entries(c.materials ?? { fabric: [{ cut: 1 }] })[0]
    const notches = []
    const drills = []
    for (const s of Object.values(part.snippets)) {
      if (NOTCH.test(s.def)) notches.push({ x: s.anchor.x, y: s.anchor.y, angle: across(seam.pts, s.anchor) })
      else if (DRILL.test(s.def)) drills.push({ x: s.anchor.x, y: s.anchor.y, kind: s.def })
    }
    out.push({
      id,
      name: id.split('.').at(-1),
      quantity: cuts.reduce((n, x) => n + (x.cut ?? 1), 0),
      material,
      onFold: Boolean(c.cutOnFold),
      seam: seam.pts,
      cut: cut?.pts ?? null,
      corners: (cut ?? seam).corners,
      internal,
      notches,
      drills,
      grain,
      fold,
    })
  }
  return out
}

/** Perimeter of a closed polyline */
export const perimeter = (pts) => pts.reduce((s, p, i) => s + Math.hypot(pts[(i + 1) % pts.length][0] - p[0], pts[(i + 1) % pts.length][1] - p[1]), 0)
