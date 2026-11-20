// Check a design's pattern-map labels at one size and option set, before anyone looks at a PNG.
// Usage (run in designs/):
//   node tools/map-check.mjs <design> [set] [options json] [--names] [--size 16] [--png]
//   --names  list each drafted part's paths (with length) and named points: what anchors can use
//   --size   label height in drafting mm (the page preview draws codes 16 high, downloads 8)
//   --png    also write out/map-check.svg/.png: the page preview with its codes (needs NODE_PATH, as render.mjs)
// It reports, per label: a seam label more than 2 mm off its piece's seam line (an anchor
// between two points sits on their chord, not on a curve), and label boxes overlapping each
// other, the piece's printed text (title block), snippets (buttons, notches) or its grainline.
// Boxes are estimates from character counts. Exit code 1 when anything is reported.
import { writeFileSync } from 'node:fs'
import { resolve as resolvePath } from 'node:path'
import { loadDesign, measurementSet, render, png } from './render.mjs'
import { polyline } from './drape-export.mjs'
import { mapFor, resolve } from '../lib/pattern-map.mjs'

const args = process.argv.slice(2)
const flag = (f, d) => (args.includes(f) ? args[args.indexOf(f) + 1] : d)
const positional = args.filter((a, i) => !a.startsWith('--') && !['--size'].includes(args[i - 1]))
const [design, set = 'cisMaleAdult38', opts = '{}'] = positional
const size = Number(flag('--size', '16'))
const options = JSON.parse(opts)

const Design = await loadDesign(design)
const pattern = new Design({ measurements: measurementSet(set), options, sa: 10, complete: true }).draft()
const active = Object.entries(pattern.parts[0]).filter(([, p]) => !p.hidden && p.paths.seam && !p.paths.seam.hidden)

if (args.includes('--names')) {
  for (const [name, part] of active) {
    console.log(`${name}`)
    const paths = Object.entries(part.paths).filter(([k]) => !k.startsWith('__macro'))
    console.log(`  paths: ${paths.map(([k, p]) => `${k}${p.hidden ? '(hidden)' : ''} ${p.length().toFixed(0)}mm`).join(', ')}`)
    console.log(`  points: ${Object.keys(part.points).filter((k) => !k.startsWith('__macro')).join(' ')}`)
  }
}

const map = mapFor(Design)
if (!map) {
  console.log(`${design} has no pattern map`)
  process.exit(args.includes('--names') ? 0 : 1)
}

// Rough text boxes: FreeSewing's theme sizes (mm) by class, 0.6 of the height per character
const themeSize = { 'text-xs': 4, 'text-sm': 5, 'text-lg': 8, 'text-xl': 10, 'text-2xl': 12, 'text-3xl': 14, 'text-4xl': 18 }
const box = (x, y, text, h, anchor = 'middle') => {
  const w = String(text).length * h * 0.6
  const x0 = anchor === 'start' ? x : x - w / 2
  return { x0, x1: x0 + w, y0: y - h * 0.8, y1: y + h * 0.2 }
}
const overlap = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1
const hits = (b, pts) => pts.some((p) => p.x >= b.x0 && p.x <= b.x1 && p.y >= b.y0 && p.y <= b.y1)
const near = (pts, m) => Math.min(...pts.map((p, i) => {
  const q = pts[i + 1] ?? pts[0]
  const dx = q.x - p.x, dy = q.y - p.y
  const t = Math.max(0, Math.min(1, ((m.x - p.x) * dx + (m.y - p.y) * dy) / (dx * dx + dy * dy || 1)))
  return Math.hypot(m.x - p.x - t * dx, m.y - p.y - t * dy)
}))

const marks = resolve(pattern, map)
const problems = []
for (const [name, part] of active) {
  const own = marks.filter((m) => m.part === name)
  if (!own.length) continue
  const seam = polyline(part.paths.seam)
  const labels = own.map((m) => ({ ...m, box: box(m.x, m.y, m.code, size) }))
  const printed = Object.entries(part.points)
    .filter(([, p]) => p.attributes?.get('data-text'))
    .map(([k, p]) => {
      const cls = p.attributes.get('data-text-class') ?? ''
      const h = Object.entries(themeSize).find(([c]) => cls.includes(c))?.[1] ?? 6
      // Translation keys (plugin-annotations:cut) print as short words
      const text = String(p.attributes.get('data-text')).replace(/plugin-annotations:/g, '').replace(/,/g, ' ')
      return { id: k, box: box(p.x, p.y, text, h, cls.includes('center') ? 'middle' : 'start') }
    })
  const snippets = Object.entries(part.snippets).map(([k, s]) => ({ id: `${s.def} ${k}`, box: box(s.anchor.x, s.anchor.y, 'xx', s.def.includes('button') ? 12 : 5) }))
  const grain = Object.entries(part.paths).filter(([k]) => k.includes('grainline')).flatMap(([, p]) => polyline(p))
  labels.forEach((l, i) => {
    // Placement and closure codes sit inside the piece, on their own marks
    if (map.codes[l.code].kind === 'seam' && map.codes[l.code].at.every((a) => a.path || a.between)) {
      const d = near(seam, l)
      if (d > 2) problems.push(`${name} ${l.code}: ${d.toFixed(1)} mm off the seam line`)
    }
    for (const other of labels.slice(i + 1)) if (overlap(l.box, other.box)) problems.push(`${name} ${l.code}: overlaps label ${other.code}`)
    for (const t of printed) if (overlap(l.box, t.box)) problems.push(`${name} ${l.code}: overlaps printed text ${t.id}`)
    for (const s of snippets) if (overlap(l.box, s.box) && !(map.codes[l.code].kind === 'closure' && /button/.test(s.id))) problems.push(`${name} ${l.code}: overlaps ${s.id}`)
    if (grain.length && hits(l.box, grain)) problems.push(`${name} ${l.code}: on the grainline`)
  })
}

console.log(`${design} at ${set}${opts !== '{}' ? ` ${opts}` : ''}: ${marks.length} labels, height ${size} mm`)
for (const p of [...new Set(problems)]) console.log(`  ${p}`)
console.log(problems.length ? `${new Set(problems).size} problems` : 'no problems found')
if (args.includes('--png')) {
  const file = resolvePath('out/map-check.svg')
  writeFileSync(file, render(Design, set, { options }).svg)
  await png([file])
  console.log(file.replace(/\.svg$/, '.png'))
}
process.exitCode = problems.length ? 1 : 0
