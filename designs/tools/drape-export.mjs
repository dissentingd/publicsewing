// Export a design's drafted pieces as outlines for a 3D drape (tools/drape_spec.py turns them
// into a GarmentCode pattern specification).
// Usage: node tools/drape-export.mjs <design> <set> <out.json> [--options '<json>'] [--pieces a,b]
//          [--clip piece=x,...] [--split piece=x,...] [--clipy piece=y,...] [--m name=mm,...]
//          [--prefix id] [--sources role=prefix.part,...]
//   prefix: the parts' name prefix, for a design that extends another (the peacoat's parts
//   are mackinaw.*); the design's own id by default; * takes each piece's current part, for a
//   design whose pieces come from several ancestors.
//   pieces: part names without the design prefix (default: every piece with a seam path);
//   sources: explicit source part for each exported role when inherited pieces have mixed prefixes;
//   every cut value is mm or a point name of the piece (its x, or its y for clipy).
//   clip: cut a piece at x >= value, e.g. front=0 to cut the button stand off at CF so the two
//   fronts can be sewn closed edge to edge; split: cut a piece in two at x into <piece>Plus
//   (x >= value) and <piece>Minus, e.g. a one-piece sleeve into front and back halves to drape
//   either side of the arm, or at several (a/b/...) into <piece>1, 2, ... from the left (a
//   cuff at the underarm and over the arm); clipy: keep a piece at y <= value, e.g. a folded
//   cuff to its fold (cuff=underarmFold). copy: a piece again under another name, for one cut
//   twice and sewn in two places. Besides its named points, each piece has c0, c1, ...: its seam
//   path's vertices in drawing order. onedge: named points (a/b) on a straight edge of the
//   piece, added to its outline. A cut value may be `mid`, halfway across the piece.
// Output (cm, drafting coordinates, y down): { pieces: { name: [[x, y], ...] },
//   points: { "<piece>.<point>": [x, y] } (every named point that is an outline vertex),
//   snippets: { part: { pieces, marks: [{ def: button|buttonhole, at }] } },
//   removed: { part: { at, outline } } (what a clip cut off, past x = at) }.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { loadDesign, measurementSet } from './render.mjs'
import { mapFor, resolve } from '../lib/pattern-map.mjs'

const CURVE_STEP = 5 // mm between samples along a curve

/** A Path as a polyline (mm): line ends kept, curves sampled */
export function polyline(path) {
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

// Additional sewing information for a drape consumer. Coordinates remain in the drafted
// part's frame, converted to cm like `pieces`, and retain their source part when clipping or
// splitting has changed the simulation outline.
export function drapeMap(pattern, map, exported) {
  const cm = (p) => [p.x / 10, p.y / 10]
  const parts = pattern.parts[0]
  const marks = resolve(pattern, map)
  const byCode = (code) => marks.filter((m) => m.code === code)
    .map(({ part, x, y }) => ({ sourcePart: part, at: cm({ x, y }) }))
  const of = (kind) => Object.entries(map.codes).filter(([, c]) => c.kind === kind)
  const seams = Object.fromEntries(of('seam')
    .map(([code, c]) => [code, { name: c.name, stitch: c.stitch, drapeSeam: c.drape ?? null, anchors: byCode(code) }]))
  // A placement's outline is the drafted path its code sits on, when the options drew it
  const placements = Object.fromEntries(of('placement').flatMap(([code, c]) => {
    const a = c.at.find((x) => x.path && parts[x.part]?.paths[x.path])
    return a ? [[code, { sourcePart: a.part, stitch: c.stitch, outline: polyline(parts[a.part].paths[a.path]).map(cm), anchors: byCode(code) }]] : []
  }))
  // Buttons and buttonholes on the pieces that carry a closure code
  const closureCode = of('closure').find(() => true)
  const closures = [...new Set(of('closure').flatMap(([, c]) => c.at.map((a) => a.part)))].flatMap((name) =>
    Object.entries(parts[name]?.snippets ?? {})
      .filter(([, s]) => ['button', 'buttonhole'].includes(s.def))
      .map(([id, s]) => ({ id, kind: s.def, sourcePart: name, at: cm(s.anchor), stitch: s.def === 'buttonhole' ? closureCode[1].stitch : 'attach-button' })))
  const cutPieces = Object.fromEntries(Object.entries(map.numbers)
    .filter(([name]) => drafted(parts[name]))
    .map(([full, number]) => {
      const name = full.split('.').at(-1)
      return [name, { number, sourcePart: full, draped: Object.keys(exported.pieces).some((role) => role === name || role.startsWith(`${name}Plus`) || role.startsWith(`${name}Minus`)) }]
    }))
  const stitches = Object.fromEntries(Object.entries(map.stitches).map(([code, s]) => [code, s.name]))
  return { units: 'cm', cutPieces, seams, placements, closures, stitches }
}

const drafted = (part) => part && !part.hidden && part.paths.seam && !part.paths.seam.hidden

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

/**
 * Each piece name's current part, whatever design it comes from (a design that extends another
 * keeps the parts it doesn't change under the ancestor's prefix): the last drafted, a visible one
 * over a hidden one. Returns { name: full part name }
 */
/**
 * A knit block's body piece (Bibi) is drawn as edges: they run hem, side, armhole, shoulder, neck
 * (the `outline` operation joins them into a seam and hides them; they're still there). Returns
 * them, or null for any other piece.
 */
export function knitEdges(part) {
  const p = part.paths
  const neck = p.backNeck ?? p.frontNeck
  return p.hem && p.sideSeam && p.armhole && p.shoulder && neck ? [p.hem, p.sideSeam, p.armhole, p.shoulder, neck] : null
}

/** A piece's outline: its seam path, or for a Noble princess panel (whose `seam` is hidden, the
 * uncut block's) the panel's own */
export const seamOf = (part) => (part.paths.seam?.hidden && (part.paths.insideSeam ?? part.paths.outsideSeam)) || part.paths.seam

export function latestParts(pattern) {
  const latest = {}
  for (const [full, part] of Object.entries(pattern.parts[0])) {
    if (!part.paths.seam && !knitEdges(part)) continue
    const name = full.slice(full.indexOf('.') + 1)
    if (!latest[name] || !part.hidden || pattern.parts[0][latest[name]].hidden) latest[name] = full
  }
  return latest
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
  const clipY = byPiece('--clipy')
  const copies = byPiece('--copy')
  const onEdge = byPiece('--onedge')
  const measurements = { ...measurementSet(set) }
  // --m waist=800,seat=1000: change measurements, to match the drape body
  for (const [k, v] of Object.entries(byPiece('--m'))) measurements[k] = v
  for (const m of ['waist', 'seat']) if (flag(`--${m}`)) measurements[m] = Number(flag(`--${m}`))
  const Design = await loadDesign(design)
  const pattern = new Design({ measurements, options, sa: 0 }).draft()
  const store = pattern.setStores[0]
  if (store.logs.error.length) throw new Error(store.logs.error.join('\n'))
  const wanted = flag('--pieces', null)?.split(',')
  const sources = byPiece('--sources')
  const sourceNames = new Map(Object.entries(sources).map(([role, full]) => [full, role]))
  const out = { design, set, options, measurements, pieces: {}, points: {}, snippets: {}, removed: {} }
  const processed = new Set()
  // Only the design's own parts (not the blocks' or FreeSewing's library parts of the same name)
  const prefix = flag('--prefix', Design.designConfig.data.id)
  const own = `${prefix}.`
  const latest = latestParts(pattern)
  for (const [full, part] of Object.entries(pattern.parts[0])) {
    const star = prefix === '*'
    if (sourceNames.size ? !sourceNames.has(full) : star ? latest[full.slice(full.indexOf('.') + 1)] !== full : !full.startsWith(own)) continue
    const name = sourceNames.size ? sourceNames.get(full) : star ? full.slice(full.indexOf('.') + 1) : full.slice(own.length)
    if (wanted ? !wanted.includes(name) : !part.paths.seam || part.hidden) continue
    const knit = knitEdges(part)
    if (!part.paths.seam && !knit) throw new Error(`${name} has no seam path`)
    processed.add(name)
    let poly = knit
      ? knit.flatMap((p) => polyline(p)).filter((q, i, all) => !i || Math.hypot(q.x - all[i - 1].x, q.y - all[i - 1].y) > 1)
      : polyline(seamOf(part))
    const first = poly[0]
    const last = poly[poly.length - 1]
    if (Math.hypot(first.x - last.x, first.y - last.y) < 1e-6) poly.pop()
    // A clip or split at a named point of the piece cuts at that point's x (clipy: its y)
    // Named points lying on a straight edge become vertices, so seams can start there (--onedge)
    for (const id of String(onEdge[name] ?? '').split('/').filter(Boolean)) {
      const p = part.points[id]
      const i = poly.findIndex((a, k) => {
        const b = poly[(k + 1) % poly.length]
        const L = Math.hypot(b.x - a.x, b.y - a.y)
        return Math.abs(Math.hypot(p.x - a.x, p.y - a.y) + Math.hypot(b.x - p.x, b.y - p.y) - L) < 1e-6
      })
      if (i < 0) throw new Error(`${name}.${id} isn't on the outline`)
      poly.splice(i + 1, 0, { x: p.x, y: p.y })
    }
    // `mid`: halfway across the piece
    const xOf = (v) => (typeof v === 'number' ? v : v === 'mid' ? (Math.min(...poly.map((p) => p.x)) + Math.max(...poly.map((p) => p.x))) / 2 : part.points[v].x)
    const yOf = (v) => (typeof v === 'number' ? v : part.points[v].y)
    // A band cut to the depth it shows (a folded cuff drapes as one layer): keep y <= y0
    if (name in clipY) poly = clipX(poly.map((p) => ({ x: p.y, y: p.x })), yOf(clipY[name]), true).map((p) => ({ x: p.y, y: p.x }))
    let removed
    if (name in clip) {
      const x0 = xOf(clip[name])
      // What the clip cuts off (a front's overlap past CF), for drawing its edge on the drape
      removed = { at: x0 / 10, outline: poly.filter((p) => p.x < x0 - 1e-6).map((p) => [p.x / 10, p.y / 10]) }
      poly = clipX(poly, x0)
      // A piece already ending at the line (on the fold there): its ends there are the cut's
      if (poly.filter((p) => p.cut).length < 2) poly = poly.map((p) => (Math.abs(p.x - x0) < 1e-6 ? { x: p.x, y: p.y, cut: true } : p))
    }
    // One split: <piece>Plus (x >= value) and <piece>Minus. Several (a/b/...): <piece>1, 2, ...
    // from the left, each between two cuts
    let outlines = { [name]: poly }
    if (name in split) {
      const xs = String(split[name]).split('/').map((v) => xOf(/^-?[\d.]+$/.test(v) ? Number(v) : v)).sort((a, b) => a - b)
      if (xs.length === 1) outlines = { [`${name}Plus`]: clipX(poly, xs[0]), [`${name}Minus`]: clipX(poly, xs[0], true) }
      else {
        outlines = {}
        ;[-Infinity, ...xs].forEach((lo, i) => {
          const hi = xs[i] ?? Infinity
          let piece = poly
          if (lo > -Infinity) piece = clipX(piece, lo)
          if (hi < Infinity) piece = clipX(piece, hi, true)
          outlines[`${name}${i + 1}`] = piece
        })
      }
    }
    if (removed?.outline.length) out.removed[name] = removed
    // Buttons and buttonholes (drawn on the drape), in the drafting's cm
    const marks = Object.values(part.snippets).filter((s) => ['button', 'buttonhole'].includes(s.def))
    if (marks.length) out.snippets[name] = { pieces: Object.keys(outlines), marks: marks.map((s) => ({ def: s.def, at: [s.anchor.x / 10, s.anchor.y / 10] })) }
    const cm = (p) => [p.x / 10, p.y / 10]
    for (const [piece, outline] of Object.entries(outlines)) {
      out.pieces[piece] = outline.map(cm)
      // Named points on the outline, and the cut line's ends as <piece>.clipTop / clipBottom
      for (const [id, p] of Object.entries(part.points)) {
        if (outline.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 1e-6)) out.points[`${piece}.${id}`] = cm(p)
      }
      // The seam's own vertices in drawing order, for pieces whose corners have no names
      // A knit piece's corners, where its edges meet
      if (knit) {
        const ends = [...knit.map((p) => polyline(p)[0]), polyline(knit[4]).at(-1)]
          .map((e) => outline.reduce((best, q) => (Math.hypot(q.x - e.x, q.y - e.y) < Math.hypot(best.x - e.x, best.y - e.y) ? q : best)))
        ;['hemCentre', 'hemSide', 'sideTop', 'shoulderTip', 'neckSide', 'neckCentre'].forEach((id, i) => (out.points[`${piece}.${id}`] = cm(ends[i])))
      }
      seamOf(part)?.ops.filter((op) => op.to).forEach((op, i) => {
        if (outline.some((q) => Math.hypot(q.x - op.to.x, q.y - op.to.y) < 1e-6)) out.points[`${piece}.c${i}`] = cm(op.to)
      })
      const cuts = outline.filter((p) => p.cut).sort((a, b) => a.y - b.y)
      if (cuts.length >= 2) {
        out.points[`${piece}.clipTop`] = cm(cuts[0])
        out.points[`${piece}.clipBottom`] = cm(cuts.at(-1))
      }
    }
  }
  // A piece cut more than once and sewn in two places (a tier, front and back): --copy a=b
  for (const [from, to] of Object.entries(copies)) {
    out.pieces[to] = out.pieces[from]
    for (const [k, v] of Object.entries(out.points)) if (k.startsWith(`${from}.`)) out.points[`${to}.${k.slice(from.length + 1)}`] = v
  }
  if (wanted) for (const name of wanted) if (!processed.has(name)) throw new Error(`missing drape piece ${name} (source ${sources[name] ?? own + name})`)
  if (mapFor(Design)) out.patternMap = drapeMap(pattern, mapFor(Design), out)
  writeFileSync(file, JSON.stringify(out, null, 1))
  console.log(`${file}: ${Object.entries(out.pieces).map(([k, v]) => `${k} (${v.length})`).join(', ')}`)
}
