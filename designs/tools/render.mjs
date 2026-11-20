// Render a design to SVG (1:1, mm) at named measurement sets, optionally to PNG previews.
// Usage: node tools/render.mjs <design> [set ...] [--png]
//   design: a folder under designs/ (e.g. chore-coat); sets: FreeSewing model names
//   (cisMaleAdult38) or ours (usdaBoyC5). Writes designs/out/<design>-<set>.svg (.png)
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'
import * as models from '@freesewing/models'
import { themePlugin } from '@freesewing/plugin-theme'
import { all as children } from '../sizes/children.mjs'
import { resolve as choreMap, legend as choreLegend, stitchLegend } from '../chore-coat/pattern-map.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, '..', 'out')

export async function loadDesign(name) {
  const mod = await import(pathToFileURL(join(here, '..', name, 'src', 'index.mjs')))
  return Object.values(mod).find((v) => typeof v === 'function' && v.designConfig)
}

const stout = (m, over) => ({ ...m, waist: m.chest + over, hips: m.chest + over, seat: Math.max(m.seat, m.chest + over) })
const extra = { stoutMale42: stout(models.cisMaleAdult42, 0), stoutMale48: stout(models.cisMaleAdult48, 75) }

export function measurementSet(name) {
  const m = children[name] || models[name] || extra[name]
  if (!m) throw new Error(`unknown measurement set ${name}`)
  return m
}

export function render(Design, set, settings = {}) {
  const pattern = new Design({ measurements: measurementSet(set), sa: 10, complete: true, ...settings })
  pattern.use(themePlugin)
  pattern.draft()
  const mapped = Design.designConfig.data?.id === 'chorecoat'
  const marks = mapped ? choreMap(pattern) : []
  if (mapped) marks.forEach((mark, i) => {
    const part = pattern.parts[0][mark.part]
    // Native FreeSewing point text follows the part through its own layout.
    const Point = part.paths.seam.start().constructor
    part.points[`patternMap${i}`] = new Point(mark.x, mark.y).addText(mark.code, 'pattern-map-code')
  })
  let svg = pattern.render()
  if (mapped) {
    const box = svg.match(/width="([\d.]+)mm" height="([\d.]+)mm" viewBox="0 0 ([\d.]+) ([\d.]+)"/)
    if (!box) throw new Error('pattern map: preview SVG has no millimetre viewBox')
    const width = +box[3], height = +box[4], extra = 200
    svg = svg.replace(box[0], `width="${box[1]}mm" height="${height + extra}mm" viewBox="0 0 ${width} ${height + extra}"`)
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    const key = `<style>svg.freesewing text.pattern-map-code{font-family:sans-serif;font-size:16px;font-weight:700;fill:#111;stroke:#fff;stroke-width:4px;paint-order:stroke}svg.freesewing #pattern-map-key text{font-family:sans-serif;font-size:13px;font-weight:500;fill:#111}svg.freesewing #pattern-map-key .heading{font-size:16px;font-weight:700}</style><g id="pattern-map-key"><rect x="0" y="${height}" width="${width}" height="${extra}" fill="white"/><text class="heading" x="20" y="${height + 22}">Seam and stitch key</text>${choreLegend(marks).map((entry, i) => `<text x="${i < 6 ? 20 : width / 2}" y="${height + 43 + (i % 6) * 16}">${esc(entry)}</text>`).join('')}${stitchLegend.map((entry, i) => `<text x="${i % 2 ? width / 2 : 20}" y="${height + 150 + Math.floor(i / 2) * 18}">${esc(entry)}</text>`).join('')}</g>`
    svg = svg.replace('</svg>', `${key}</svg>`)
  }
  return { svg, store: pattern.setStores[0] }
}

export async function png(files) {
  // Playwright is pre-installed globally in the cloud container; it isn't a dependency.
  // Run with NODE_PATH=$(npm root -g).
  const { createRequire } = await import('node:module')
  const { chromium } = createRequire(join(process.env.NODE_PATH || here, 'x.js'))('playwright')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  for (const f of files) {
    // Scaled preview: the 1:1 SVG is too large to screenshot directly
    const html = f.replace(/\.svg$/, '.html')
    writeFileSync(html, `<body style="margin:0;background:#fff"><img src="${pathToFileURL(f).href}" style="width:1000px"></body>`)
    await page.setViewportSize({ width: 1000, height: 800 })
    await page.goto(pathToFileURL(html).href)
    await page.screenshot({ path: f.replace(/\.svg$/, '.png'), fullPage: true })
  }
  await browser.close()
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const wantPng = args.includes('--png')
  const [name, ...sets] = args.filter((a) => a !== '--png')
  const Design = await loadDesign(name)
  mkdirSync(out, { recursive: true })
  const files = []
  for (const set of sets.length ? sets : ['cisMaleAdult38']) {
    const { svg, store } = render(Design, set)
    const f = join(out, `${name}-${set}.svg`)
    writeFileSync(f, svg)
    files.push(f)
    const e = store.logs.error.length + store.logs.warn.length
    console.log(`${f}${e ? `  (${e} errors/warnings)` : ''}`)
  }
  if (wantPng) await png(files)
}
