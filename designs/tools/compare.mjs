// A comparison sheet: the source's diagram pages above the drafted pieces at a few sizes, on one
// PNG, for Step 8 of CONTRIBUTING.md. It stays in out/ (gitignored) because a source may still be
// in copyright: don't commit a sheet.
// Usage: NODE_PATH=$(npm root -g) node tools/compare.mjs <design> [--pages 53,55] [--source <pdf or image>]
//          [--sets cisFemaleAdult36,usdaBoyC5,stoutMale48] [--options '{"lapelStyle":"notch"}'] [--dpi 110]
//   --pages: PDF pages (not book pages), rendered with Poppler's pdftoppm. The PDF is --source,
//   else the folder id at the end of the spec's about.source, in ../corpus/<id>/.
//   Without --pages or an image, the sheet has only the sizes.
// Writes out/<design>-compare.png and prints any draft errors or warnings.
import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import { readSpec } from '../lib/load-spec.mjs'
import { loadDesign, render } from './render.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, '..', 'out')

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    pages: { type: 'string' },
    source: { type: 'string' },
    sets: { type: 'string' },
    options: { type: 'string', default: '{}' },
    dpi: { type: 'string', default: '110' },
  },
})
const [design] = positionals
if (!design) throw new Error('usage: node tools/compare.mjs <design> [--pages 53,55] [--source <pdf or image>] [--sets a,b] [--options json] [--dpi 110]')

const { about } = readSpec(join(here, '..', design, 'spec.yaml'))
const sets = args.sets ? args.sets.split(',') : [about.preview ?? 'cisMaleAdult38', 'usdaBoyC5', 'stoutMale48']
mkdirSync(out, { recursive: true })

/** The PDF to read pages from: --source, or the corpus folder named at the end of about.source */
function sourcePdf() {
  if (args.source) return resolve(args.source)
  const id = about.source?.match(/\(([\w-]+)\)\s*$/)?.[1]
  const dir = id && join(here, '..', '..', 'corpus', id)
  const pdf = dir && existsSync(dir) && readdirSync(dir).find((f) => f.endsWith('.pdf'))
  if (!pdf) throw new Error(`no PDF for ${design}: ${id ? `${id} isn't in corpus/ (an untracked source?)` : 'about.source names no folder id'}; pass --source`)
  return join(dir, pdf)
}

// The source's pages, as PNGs in out/
const source = []
if (args.pages) {
  const pdf = sourcePdf()
  for (const n of args.pages.split(',')) {
    const prefix = join(out, `${design}-compare-source-${n}`)
    const r = spawnSync('pdftoppm', ['-f', n, '-l', n, '-r', args.dpi, '-png', '-singlefile', pdf, prefix])
    if (r.error) throw new Error(`pdftoppm didn't run (${r.error.code}): install Poppler, or restart a session that started before it was installed`)
    if (r.status !== 0) throw new Error(`pdftoppm, page ${n}: ${r.stderr}`)
    source.push({ file: `${prefix}.png`, label: `${basename(pdf)}, PDF page ${n}` })
  }
} else if (args.source) {
  if (extname(args.source).toLowerCase() === '.pdf') throw new Error('a PDF source needs --pages')
  const to = join(out, `${design}-compare-source${extname(args.source)}`)
  copyFileSync(args.source, to)
  source.push({ file: to, label: basename(args.source) })
}

// The drafted pieces, at each size
const Design = await loadDesign(design)
const options = JSON.parse(args.options)
let problems = 0
const drafts = sets.map((set) => {
  const { svg, store } = render(Design, set, { options })
  const file = join(out, `${design}-compare-${set}.svg`)
  writeFileSync(file, svg)
  const logs = [...store.logs.error, ...store.logs.warn]
  problems += logs.length
  for (const l of logs) console.log(`${set}: ${[l].flat().map(String).join(' ').slice(0, 300)}`)
  return { file, label: `${set}${logs.length ? ` (${logs.length} errors or warnings)` : ''}` }
})

const cell = ({ file, label }, height) =>
  `<figure><figcaption>${label}</figcaption><img src="${pathToFileURL(file).href}" style="max-height:${height}px"></figure>`
const title = `${design}${args.options === '{}' ? '' : ` ${args.options}`}`
const html = join(out, `${design}-compare.html`)
writeFileSync(
  html,
  `<!doctype html><meta charset="utf-8"><style>
  body{margin:16px;background:#fff;font:15px sans-serif}
  section{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start;margin-bottom:16px}
  figure{margin:0;flex:1 1 0;min-width:300px}
  figcaption{font-weight:bold;margin-bottom:4px}
  img{max-width:100%;display:block;border:1px solid #ccc}
  </style><h2>${title}</h2>
  ${source.length ? `<section>${source.map((s) => cell(s, 1000)).join('')}</section>` : ''}
  <section>${drafts.map((d) => cell(d, 900)).join('')}</section>`,
)

const { chromium } = createRequire(join(process.env.NODE_PATH || here, 'x.js'))('playwright')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1800, height: 1000 } })
await page.goto(pathToFileURL(html).href)
await page.waitForLoadState('networkidle')
const png = join(out, `${design}-compare.png`)
await page.screenshot({ path: png, fullPage: true })
await browser.close()
console.log(`${png}${problems ? `  (${problems} errors or warnings)` : ''}`)
