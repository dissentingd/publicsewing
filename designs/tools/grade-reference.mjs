// Read Open+Pattern's graded DXFs (corpus/openpattern, not in git) into the small fixture the
// grade checks use in CI: per size, each piece's net width, height and perimeter (mm).
// Usage: node tools/grade-reference.mjs   (rewrites test/grade/openpattern.json)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseDxf, summarise } from './dxf-aama.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const corpus = join(here, '..', '..', 'corpus', 'openpattern')

// Graded sources: corpus folder, DXF, size names in grade order (the file's own spelling)
const sources = {
  'standard-tshirt': { file: 'standard-tshirt/DXF_2023_12_22_02_openpattern_standard_tshirt.dxf', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  'us-tactical-smock': { file: 'us-tactical-smock/2023_12_23_01_openpattern_US_tactical_smock.dxf', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XLL'] },
}

const out = { credit: 'Open+Pattern (openpattern.io), CC BY 4.0: piece sizes read from their graded DXFs', sources: {} }
for (const [id, { file, sizes }] of Object.entries(sources)) {
  const pieces = {}
  for (const p of summarise(parseDxf(readFileSync(join(corpus, file), 'latin1')))) {
    const m = new RegExp(`^(.*)_(${sizes.join('|')})$`).exec(p.name)
    if (!m) continue
    pieces[m[1]] ??= Array(sizes.length)
    pieces[m[1]][sizes.indexOf(m[2])] = { w: +p.width.toFixed(1), h: +p.height.toFixed(1), p: +p.perimeter.toFixed(1) }
  }
  out.sources[id] = { file, sizes, pieces }
}
mkdirSync(join(here, '..', 'test', 'grade'), { recursive: true })
writeFileSync(join(here, '..', 'test', 'grade', 'openpattern.json'), JSON.stringify(out, null, 1) + '\n')
console.log(Object.entries(out.sources).map(([k, v]) => `${k}: ${Object.keys(v.pieces).length} pieces x ${v.sizes.length} sizes`).join('\n'))
