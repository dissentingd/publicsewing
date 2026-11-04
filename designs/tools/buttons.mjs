// At every size, does each button mark fall on its front piece, and how close is it to the seam?
// Use it on any double-breasted or button-to-the-waist front.
// Usage: node tools/buttons.mjs <design> [design ...]     (run in designs/)
import { sets } from '../test/coat-checks.mjs'
import { loadDesign } from './render.mjs'
for (const design of process.argv.slice(2)) {
  const Design = await loadDesign(design)
  let off = 0
  let close = 0
  let worst = { gap: Infinity }
  const bad = new Set()
  for (const [name, measurements] of Object.entries(sets)) {
    const p = new Design({ measurements, sa: 10 }).draft()
    const [part] = Object.entries(p.parts[0]).filter(([k, v]) => k.endsWith('.front') && !v.hidden && Object.keys(v.snippets).some((s) => s.startsWith('button'))).map(([, v]) => v)
    if (!part) continue
    for (const s of Object.values(part.snippets).filter((q) => q.def === 'button')) {
      const hits = part.paths.seam.intersectsY(s.anchor.y)
      if (!hits.length) continue
      const gap = Math.max(...hits.map((h) => h.x)) - s.anchor.x
      if (gap < worst.gap) worst = { gap, name }
      if (gap < 0) {
        off++
        bad.add(name)
      } else if (gap < 15) close++
    }
  }
  console.log(`${design}: buttons off the piece ${off} (on ${bad.size} sets${bad.size ? `: ${[...bad].slice(0, 4).join(', ')}` : ''}); within 15 mm of the edge ${close}; worst ${worst.gap.toFixed(0)} mm at ${worst.name}`)
}
