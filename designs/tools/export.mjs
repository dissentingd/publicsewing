// Export a design for other pattern software, at named measurement sets.
// Usage: node tools/export.mjs <design> [set ...] [--dxf] [--sm2d] [--smis] [--sa mm]
//   --dxf  AAMA DXF (CLO3D, Marvelous, Browzwear, Style3D, Optitex, Gerber, Lectra; LibreCAD)
//   --sm2d Seamly2D pattern (fixed geometry)
//   --smis SeamlyMe measurements for the set
//   No format flag: all three. Writes designs/out/<design>-<set>.<ext>.
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
  let formats = ['dxf', 'sm2d', 'smis'].filter((f) => args.includes(`--${f}`))
  if (!formats.length) formats = ['dxf', 'sm2d', 'smis']
  const [name, ...sets] = args.filter((a) => !a.startsWith('--'))
  const Design = await loadDesign(name)
  mkdirSync(out, { recursive: true })
  for (const set of sets.length ? sets : ['cisMaleAdult38']) {
    const spec = parse(readFileSync(join(here, '..', name, 'spec.yaml'), 'utf8'))
    const files = exportFiles(Design, { measurements: measurementSet(set), sa }, { name, size: set, source: spec.about?.source })
    for (const f of formats) {
      const file = join(out, `${name}-${set}.${f}`)
      writeFileSync(file, files[f])
      console.log(file)
    }
  }
}
