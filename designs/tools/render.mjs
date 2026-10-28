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
  const svg = pattern.draft().render()
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
