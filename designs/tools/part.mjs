// Only some parts of a design, drawn large: out/part.svg and out/part.png.
// Usage: NODE_PATH=$(npm root -g) node tools/part.mjs <design> <set> <part,part> [options json]     (run in designs/)
import { loadDesign, measurementSet, png } from './render.mjs'
import { themePlugin } from '@freesewing/plugin-theme'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
const [design, set, names, opts = '{}'] = process.argv.slice(2)
const Design = await loadDesign(design)
const keep = names.split(',')
const p = new Design({ measurements: measurementSet(set), sa: 10, complete: true, options: JSON.parse(opts) })
p.use(themePlugin)
p.draft()
for (const [n, part] of Object.entries(p.parts[0])) if (!keep.some((k) => n.endsWith(k))) part.hide()
writeFileSync('out/part.svg', p.render())
await png([resolve('out/part.svg')])
console.log(resolve('out/part.png'))
