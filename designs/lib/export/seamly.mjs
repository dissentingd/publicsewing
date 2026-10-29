// A drafted pattern -> a Seamly2D pattern file (.sm2d, schema 0.7.6, mm). Fixed geometry, not
// parametric: every point is a single point at its drafted position and every FreeSewing curve
// a Seamly spline (both are cubic Béziers), so the file opens, edits, lays out, prints and
// re-exports in Seamly, but doesn't regrade from a measurements file. Runs in Node and the
// browser.
//
// One draft block per piece. A piece's main path is its seam; Seamly draws the allowance from
// each edge's width, which is read off our cut line (so hems keep their deeper allowance and a
// fold edge gets none). Notches sit on main-path nodes in Seamly, so curves are split at them.

import { pieces as flatPieces } from './pieces.mjs'

export const SEAMLY_VERSION = '0.7.6'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const num = (n) => String(Math.round(n * 10000) / 10000)
const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => ` ${k}="${esc(v)}"`).join('')
// Seamly's angles run anticlockwise from 3 o'clock on a y-down canvas
const angle = (from, to) => ((((Math.atan2(from[1] - to[1], to[0] - from[0]) * 180) / Math.PI) % 360) + 360) % 360

/** A path's first subpath as vertices and the segments between them (lines, or curves with cp1, cp2) */
export function segments(path) {
  const verts = []
  const segs = []
  let closed = false
  for (const op of path.ops) {
    if (op.type === 'move') {
      if (verts.length) break
      verts.push([op.to.x, op.to.y])
    } else if (op.type === 'line' || op.type === 'curve') {
      const a = verts.at(-1)
      const b = [op.to.x, op.to.y]
      if (op.type === 'line' && Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-3) continue
      segs.push(op.type === 'curve' ? { cp1: [op.cp1.x, op.cp1.y], cp2: [op.cp2.x, op.cp2.y] } : {})
      verts.push(b)
    } else if (op.type === 'close') {
      closed = true
      break
    }
  }
  // A closed outline whose last point returns to its start: that point is the start
  if (verts.length > 1 && Math.hypot(verts[0][0] - verts.at(-1)[0], verts[0][1] - verts.at(-1)[1]) < 1e-3) {
    verts.pop()
    closed = true
  } else if (closed) segs.push({})
  return { verts, segs, closed }
}

/**
 * Seamly offsets a piece's allowance to one side of its path, outward only when the path runs
 * clockwise on screen (y down); FreeSewing's seams mostly run the other way. Reverse if needed.
 */
export function clockwise(g) {
  const v = g.verts
  const area = v.reduce((s, q, i) => s + q[0] * v[(i + 1) % v.length][1] - v[(i + 1) % v.length][0] * q[1], 0)
  if (area >= 0) return g
  // Segment i joins verts i and i+1; reversed, vertex order runs 0, n-1, ..., 1
  const n = v.length
  const verts = [v[0], ...v.slice(1).reverse()]
  const segs = []
  for (let i = 0; i < n; i++) {
    // New segment i joins verts[i] -> verts[i+1], which was old segment (n-1-i) backwards
    const s = g.segs[(n - 1 - i + n) % n]
    segs.push(s.cp1 ? { cp1: s.cp2, cp2: s.cp1 } : {})
  }
  return { verts, segs, closed: g.closed }
}

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const at = (a, s, b, t) => (s.cp1 ? lerp(lerp(lerp(a, s.cp1, t), lerp(s.cp1, s.cp2, t), t), lerp(lerp(s.cp1, s.cp2, t), lerp(s.cp2, b, t), t), t) : lerp(a, b, t))

/** Segment i's end points */
const ends = (g, i) => [g.verts[i], g.verts[(i + 1) % g.verts.length]]

/** Split the outline at p (a notch): returns the vertex index there, inserting one if needed */
function splitAt(g, p) {
  let best = { d: Infinity }
  for (let i = 0; i < g.segs.length; i++) {
    const [a, b] = ends(g, i)
    for (let k = 0; k <= 200; k++) {
      const q = at(a, g.segs[i], b, k / 200)
      const d = Math.hypot(q[0] - p[0], q[1] - p[1])
      if (d < best.d) best = { d, i, t: k / 200 }
    }
  }
  // Refine t by bisection on the distance
  let { i, t } = best
  const [a, b] = ends(g, i)
  let step = 1 / 200
  for (let n = 0; n < 30; n++) {
    step /= 2
    const dist = (u) => {
      const q = at(a, g.segs[i], b, Math.min(1, Math.max(0, u)))
      return Math.hypot(q[0] - p[0], q[1] - p[1])
    }
    if (dist(t - step) < dist(t)) t -= step
    else if (dist(t + step) < dist(t)) t += step
  }
  t = Math.min(1, Math.max(0, t))
  const q = at(a, g.segs[i], b, t)
  if (Math.hypot(q[0] - a[0], q[1] - a[1]) < 0.5) return i
  if (Math.hypot(q[0] - b[0], q[1] - b[1]) < 0.5) return (i + 1) % g.verts.length
  const s = g.segs[i]
  let left = {}
  let right = {}
  if (s.cp1) {
    // de Casteljau
    const p01 = lerp(a, s.cp1, t)
    const p12 = lerp(s.cp1, s.cp2, t)
    const p23 = lerp(s.cp2, b, t)
    const p012 = lerp(p01, p12, t)
    const p123 = lerp(p12, p23, t)
    left = { cp1: p01, cp2: p012 }
    right = { cp1: p123, cp2: p23 }
  }
  g.segs.splice(i, 1, left, right)
  g.verts.splice(i + 1, 0, q)
  return i + 1
}

/** Shortest distance from p to a closed polyline */
function distTo(pts, p) {
  let d = Infinity
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)))
    d = Math.min(d, Math.hypot(a[0] + t * dx - p[0], a[1] + t * dy - p[1]))
  }
  return d
}

/**
 * @param pattern a drafted FreeSewing pattern
 * @param opts { name: design name, size: measurement-set label, notes: lines for the file's
 *               notes (credit lines), sa: the allowance the pattern was drafted with (mm) }
 */
export function toSeamly(pattern, { name = 'pattern', size = '', notes = [], sa = 10 } = {}) {
  let id = 0
  const next = () => ++id
  const blocks = []
  let offset = 0
  for (const [n, flat] of flatPieces(pattern).entries()) {
    const part = pattern.parts[0][flat.id]
    const calc = []
    const model = []
    const label = `P${n + 1}`
    let pointNo = 0
    // A vertex -> a single point and its modeling copy; returns the modeling id
    const point = (p, show = true) => {
      const c = next()
      calc.push(`<point${attrs({ type: 'single', id: c, name: `${label}_${++pointNo}`, x: num(p[0]), y: num(p[1]), mx: '1', my: '2' })}/>`)
      const m = next()
      model.push(`<point${attrs({ type: 'modeling', id: m, idObject: c, inUse: 'true', mx: '1', my: '2', showPointName: show ? undefined : 'false' })}/>`)
      return { c, m }
    }
    const spline = (a, s, b) => {
      const c = next()
      calc.push(`<spline${attrs({ type: 'simpleInteractive', id: c, point1: a.c, point4: b.c, angle1: num(angle(s.from, s.cp1)), length1: num(Math.hypot(s.cp1[0] - s.from[0], s.cp1[1] - s.from[1])), angle2: num(angle(s.to, s.cp2)), length2: num(Math.hypot(s.cp2[0] - s.to[0], s.cp2[1] - s.to[1])), color: 'black', penStyle: 'solidLine' })}/>`)
      const m = next()
      model.push(`<spline${attrs({ type: 'modelingSpline', id: m, idObject: c, inUse: 'true' })}/>`)
      return m
    }
    // An outline or internal line -> piece-path nodes
    const nodes = (g, extra = () => ({}), show = true) => {
      const ids = g.verts.map((v) => point(v, show))
      const out = []
      const count = g.closed ? g.segs.length : g.verts.length - 1
      for (let i = 0; i < g.verts.length; i++) {
        out.push(`<node${attrs({ type: 'NodePoint', idObject: ids[i].m, ...extra(i) })}/>`)
        if (i >= count || !g.segs[i].cp1) continue
        const [a, b] = ends(g, i)
        out.push(`<node${attrs({ type: 'NodeSpline', idObject: spline(ids[i], { ...g.segs[i], from: a, to: b }, ids[(i + 1) % ids.length]), reverse: 0 })}/>`)
      }
      return { out, ids }
    }

    const g = clockwise(segments(part.paths.seam))
    const notched = new Set(flat.notches.map((p) => splitAt(g, [p.x, p.y])))
    // Each edge's allowance, measured from its middle to our cut line; a dart's legs (far from
    // the cut line, which bridges the dart) keep the default
    const widths = g.segs.map((s, i) => {
      if (!flat.cut) return 0
      const [a, b] = ends(g, i)
      const w = distTo(flat.cut, at(a, s, b, 0.5))
      return w > 4 * sa + 5 ? sa : Math.round(w * 10) / 10
    })
    const k = g.verts.length
    const main = nodes(g, (i) => {
      const before = widths[(i - 1 + k) % k]
      const after = widths[i]
      return {
        before: Math.abs(before - sa) > 0.2 ? num(before) : undefined,
        after: Math.abs(after - sa) > 0.2 ? num(after) : undefined,
        notch: notched.has(i) ? 'true' : undefined,
        notchType: notched.has(i) ? 'slit' : undefined,
      }
    })

    // Internal lines (pocket placements, darts, centre lines) as internal paths
    const internals = []
    for (const [pname, path] of Object.entries(part.paths)) {
      if (path.hidden || pname === 'seam' || pname === 'sa' || pname.startsWith('__macro')) continue
      const s = segments(path)
      if (s.verts.length < 2) continue
      const pid = next()
      model.push(`<path${attrs({ id: pid, type: 2, name: pname, lineColor: 'black', lineType: /dashed|help/.test(path.attributes.get('class') ?? '') ? 'dashLine' : 'solidLine' })}><nodes>${nodes(s, () => ({}), false).out.join('')}</nodes></path>`)
      internals.push(pid)
    }

    // Grain line between two anchor points
    const anchors = []
    let grain = ''
    if (flat.grain) {
      const [top, bottom] = flat.grain.map((p) => point(p, false))
      anchors.push(top.m, bottom.m)
      grain = `<grainline${attrs({ visible: 'true', arrows: 0, topAnchor: top.m, bottomAnchor: bottom.m })}/>`
    }
    for (const d of flat.drills) anchors.push(point([d.x, d.y], false).m)

    const minX = Math.min(...g.verts.map((v) => v[0]))
    const maxX = Math.max(...g.verts.map((v) => v[0]))
    const pieceId = next()
    const piece =
      `<piece${attrs({ id: pieceId, version: 2, name: flat.name, mx: num(offset - minX), my: '0', inLayout: 'true', forbidFlipping: 'false', seamAllowance: flat.cut ? 'true' : 'false', width: num(sa), united: 'false', closed: 1 })}>` +
      `<data${attrs({ letter: label, annotation: flat.onFold ? 'cut on fold' : undefined, quantity: flat.quantity, onFold: flat.onFold ? 'true' : 'false', visible: 'true' })}/>` +
      `<patternInfo visible="false"/>` +
      grain +
      `<nodes>${main.out.join('')}</nodes>` +
      (internals.length ? `<iPaths>${internals.map((p) => `<record path="${p}"/>`).join('')}</iPaths>` : '') +
      (anchors.length ? `<anchors>${anchors.map((a) => `<record>${a}</record>`).join('')}</anchors>` : '') +
      `</piece>`
    offset += maxX - minX + 50
    blocks.push(`<draftBlock name="${esc(flat.name)}"><calculation>${calc.join('')}</calculation><modeling>${model.join('')}</modeling><pieces>${piece}</pieces><groups/></draftBlock>`)
  }
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n<pattern>\n` +
    `<!--Pattern exported by PublicSewing (publicsewing.org): fixed geometry at one size.-->\n` +
    `<version>${SEAMLY_VERSION}</version><unit>mm</unit>` +
    `<description>${esc(`${name}, drafted for ${size}`)}</description>` +
    `<notes>${esc(['Made to measure by PublicSewing (publicsewing.org). Geometry is fixed at the measurements it was drafted for; draft again there for other measurements.', ...notes].join('\n'))}</notes>` +
    `<patternName>${esc(name)}</patternName><company>PublicSewing</company>` +
    `<measurements/>` +
    blocks.join('') +
    `\n</pattern>\n`
  )
}
