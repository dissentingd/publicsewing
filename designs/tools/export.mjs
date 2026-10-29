// Export a design for other pattern software, at named measurement sets.
// Usage: node tools/export.mjs <design> [set ...] [--dxf] [--sm2d] [--smis] [--sa mm]
//   --dxf  AAMA DXF (CLO3D, Marvelous, Browzwear, Style3D, Optitex, Gerber, Lectra; LibreCAD)
//   --sm2d Seamly2D pattern (fixed geometry)
//   --smis SeamlyMe measurements for the set
//   --svg  full-size SVG, an Inkscape layer per piece
//   --pdf  projector PDF, one 1:1 page (and <design>-<set>-dark.pdf, light lines on black)
//   No format flag: all of them. Writes designs/out/<design>-<set>.<ext>.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { parse } from 'yaml'
import { loadDesign, measurementSet } from './render.mjs'
import { exportFiles, credits as creditLines } from '../lib/export/index.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, '..', 'out')

/** Credit lines for a design, from its spec's `about.source` */
export function credits(name) {
  return creditLines(parse(readFileSync(join(here, '..', name, 'spec.yaml'), 'utf8')).about?.source)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const i = args.indexOf('--sa')
  const sa = i >= 0 ? Number(args.splice(i, 2)[1]) : 10
  const all = ['dxf', 'sm2d', 'smis', 'svg', 'pdf']
  let formats = all.filter((f) => args.includes(`--${f}`))
  if (!formats.length) formats = all
  const [name, ...sets] = args.filter((a) => !a.startsWith('--'))
  const Design = await loadDesign(name)
  mkdirSync(out, { recursive: true })
  for (const set of sets.length ? sets : ['cisMaleAdult38']) {
    const spec = parse(readFileSync(join(here, '..', name, 'spec.yaml'), 'utf8'))
    const files = exportFiles(Design, { measurements: measurementSet(set), sa }, { name, size: set, source: spec.about?.source })
    const write = (file, text, enc = 'utf8') => {
      writeFileSync(join(out, file), text, enc)
      console.log(join(out, file))
    }
    for (const f of formats) write(`${name}-${set}.${f}`, files[f], f === 'pdf' ? 'latin1' : 'utf8')
    if (formats.includes('pdf')) write(`${name}-${set}-dark.pdf`, files.darkPdf, 'latin1')
  }
}
