// Export a design's drafted pieces as outlines for a 3D drape (tools/drape_spec.py turns them
// into a GarmentCode pattern specification).
// Usage: node tools/drape-export.mjs <design> <set> <out.json> [--options '<json>'] [--pieces a,b]
//          [--clip piece=x,...] [--split piece=x,...] [--m name=mm,...]
//   pieces: part names without the design prefix (default: every piece with a seam path);
//   clip: cut a piece at x >= value (mm, or a point name: its x), e.g. front=0 to cut the
//   button stand off at CF so
//   the two fronts can be sewn closed edge to edge; split: cut a piece in two at x (mm) into
//   <piece>Plus (x >= value) and <piece>Minus, e.g. a one-piece sleeve into front and back
//   halves to drape either side of the arm.
// Output (cm, drafting coordinates, y down): { pieces: { name: [[x, y], ...] },
//   points: { "<piece>.<point>": [x, y] } } — every named point that is an outline vertex.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { loadDesign, measurementSet } from './render.mjs'

const CURVE_STEP = 5 // mm between samples along a curve

/** A Path as a polyline (mm): line ends kept, curves sampled */
function polyline(path) {
  const out = []
  let at
  for (const op of path.ops) {
    if (op.type === 'move') {
      at = op.to
      out.push(at)
    } else if (op.type === 'line') {
      at = op.to
      out.push(at)
    } else if (op.type === 'curve') {
      const n = Math.max(2, Math.ceil(curveLength(at, op.cp1, op.cp2, op.to) / CURVE_STEP))
      for (let k = 1; k <= n; k++) out.push(bezier(at, op.cp1, op.cp2, op.to, k / n, k === n))
      at = op.to
    }
  }
  return out
}

function bezier(a, b, c, d, t, end) {
  if (end) return d
  const u = 1 - t
  const f = (k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k]
  return { x: f('x'), y: f('y') }
}

function curveLength(a, b, c, d) {
  let L = 0
  let p = a
  for (let k = 1; k <= 20; k++) {
    const q = bezier(a, b, c, d, k / 20, false)
    L += Math.hypot(q.x - p.x, q.y - p.y)
    p = q
  }
  return L
}

/**
 * Keep the part of a closed polygon at x >= x0, or x <= x0 with `below` (Sutherland–Hodgman
 * against one line). Points on the cut are marked `cut`.
 */
function clipX(poly, x0, below = false) {
  const inside = (p) => (below ? p.x <= x0 + 1e-9 : p.x >= x0 - 1e-9)
  const out = []
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i]
    const q = poly[(i + 1) % poly.length]
    const pin = inside(p)
    const qin = inside(q)
    if (pin) out.push(p)
    if (pin !== qin) {
      const t = (x0 - p.x) / (q.x - p.x)
      out.push({ x: x0, y: p.y + t * (q.y - p.y), cut: true })
    }
  }
  return out
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const flag = (f, d) => (args.includes(f) ? args[args.indexOf(f) + 1] : d)
  const [design, set, file] = args
  const options = JSON.parse(flag('--options', '{}'))
  const byPiece = (f) =>
    Object.fromEntries(
      flag(f, '')
        .split(',')
        .filter(Boolean)
        .map((c) => c.split('=').map((v, i) => (i && /^-?[\d.]+$/.test(v) ? Number(v) : v))),
    )
  const clip = byPiece('--clip')
  const split = byPiece('--split')
  const measurements = { ...measurementSet(set) }
  // --m waist=800,seat=1000: change measurements, to match the drape body
  for (const [k, v] of Object.entries(byPiece('--m'))) measurements[k] = v
  for (const m of ['waist', 'seat']) if (flag(`--${m}`)) measurements[m] = Number(flag(`--${m}`))
  const Design = await loadDesign(design)
  const pattern = new Design({ measurements, options, sa: 0 }).draft()
  const store = pattern.setStores[0]
  if (store.logs.error.length) throw new Error(store.logs.error.join('\n'))
  const wanted = flag('--pieces', null)?.split(',')
  const out = { design, set, options, measurements, pieces: {}, points: {} }
  // Only the design's own parts (not the blocks' or FreeSewing's library parts of the same name)
  const own = `${Design.designConfig.data.id}.`
  for (const [full, part] of Object.entries(pattern.parts[0])) {
    if (!full.startsWith(own)) continue
    const name = full.slice(own.length)
    if (wanted ? !wanted.includes(name) : !part.paths.seam || part.hidden) continue
    if (!part.paths.seam) throw new Error(`${name} has no seam path`)
    let poly = polyline(part.paths.seam)
    const first = poly[0]
    const last = poly[poly.length - 1]
    if (Math.hypot(first.x - last.x, first.y - last.y) < 1e-6) poly.pop()
    // A clip or split at a named point of the piece cuts at that point's x
    const xOf = (v) => (typeof v === 'number' ? v : part.points[v].x)
    if (name in clip) poly = clipX(poly, xOf(clip[name]))
    const outlines = name in split ? { [`${name}Plus`]: clipX(poly, xOf(split[name])), [`${name}Minus`]: clipX(poly, xOf(split[name]), true) } : { [name]: poly }
    const cm = (p) => [p.x / 10, p.y / 10]
    for (const [piece, outline] of Object.entries(outlines)) {
      out.pieces[piece] = outline.map(cm)
      // Named points on the outline, and the cut line's ends as <piece>.clipTop / clipBottom
      for (const [id, p] of Object.entries(part.points)) {
        if (outline.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 1e-6)) out.points[`${piece}.${id}`] = cm(p)
      }
      const cuts = outline.filter((p) => p.cut).sort((a, b) => a.y - b.y)
      if (cuts.length >= 2) {
        out.points[`${piece}.clipTop`] = cm(cuts[0])
        out.points[`${piece}.clipBottom`] = cm(cuts.at(-1))
      }
    }
  }
  writeFileSync(file, JSON.stringify(out, null, 1))
  console.log(`${file}: ${Object.entries(out.pieces).map(([k, v]) => `${k} (${v.length})`).join(', ')}`)
}
