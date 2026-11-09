// Checks a design's page in the built site, as a visitor would use it (Step 10 of CONTRIBUTING.md):
// the page loads, the tool drafts at a size, each variant's button redraws it, and every download
// makes a real file. Run `npm run build` in site/ first: this tests site/build, not the source.
// Usage: NODE_PATH=$(npm root -g) node tools/page-check.mjs <design> [design ...] [--size "Women 36"]
// Exits 1 if any check fails.
import { existsSync, readFileSync, statSync, createReadStream } from 'node:fs'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { dirname, extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { readSpec } from '../lib/load-spec.mjs'
import { parse } from 'yaml'

const here = dirname(fileURLToPath(import.meta.url))
const build = join(here, '..', '..', 'site', 'build')
const { values: args, positionals: designs } = parseArgs({ allowPositionals: true, options: { size: { type: 'string' } } })
if (!designs.length) throw new Error('usage: node tools/page-check.mjs <design> [design ...] [--size "Women 36"]')
if (!existsSync(build)) throw new Error('no site/build: run `npm run build` in site/ first')

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json', '.woff2': 'font/woff2' }
const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^[\\/]+/, '')
  const file = [path, `${path}.html`, join(path, 'index.html')].map((p) => join(build, p)).find((f) => existsSync(f) && statSync(f).isFile())
  if (!file) {
    res.writeHead(404).end()
    return
  }
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
})
await new Promise((ok) => server.listen(0, '127.0.0.1', ok))
const origin = `http://127.0.0.1:${server.address().port}`

// What a download's first bytes should be
const downloads = {
  'AAMA DXF': (t) => t.includes('SECTION') && t.includes('ENTITIES'),
  'Seamly2D (.sm2d)': (t) => t.trimStart().startsWith('<'),
  'SeamlyMe measurements (.smis)': (t) => t.trimStart().startsWith('<'),
  'Layered SVG': (t) => t.includes('<svg'),
  'Projector PDF': (t) => t.startsWith('%PDF'),
  'Projector PDF, dark': (t) => t.startsWith('%PDF'),
}

const { chromium } = createRequire(join(process.env.NODE_PATH || here, 'x.js'))('playwright')
const browser = await chromium.launch()
let failed = 0

for (const design of designs) {
  const check = (ok, what) => {
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${design}: ${what}`)
    if (!ok) failed++
  }
  // Ours from its spec; FreeSewing's (freesewing.yaml) from its package, with no variants
  let specFile = join(here, '..', design, 'spec.yaml')
  let spec
  if (existsSync(specFile)) spec = readSpec(specFile)
  else {
    specFile = join(here, '..', 'freesewing.yaml')
    const entry = parse(readFileSync(specFile, 'utf8')).designs[design]
    if (!entry) throw new Error(`${design}: no spec.yaml, and not in freesewing.yaml`)
    const Design = (await import(entry.package))[entry.export]
    spec = { about: { name: Design.designConfig.data.name }, variants: {} }
  }
  const built = join(build, 'designs', `${design}.html`)
  if (!existsSync(built)) {
    check(false, 'no page in site/build (rebuild the site?)')
    continue
  }
  if (statSync(built).mtimeMs < statSync(specFile).mtimeMs) console.log(`note ${design}: its spec is newer than the build, so this tests the old one`)

  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 }, acceptDownloads: true })
  const page = await context.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('response', (r) => r.status() >= 400 && r.url().startsWith(origin) && errors.push(`${r.status()} ${r.url().slice(origin.length)}`))

  await page.goto(`${origin}/designs/${design}`, { waitUntil: 'networkidle' })
  check((await page.locator('h1').first().innerText()).trim() === spec.about.name, `the page's heading is "${spec.about.name}"`)
  const broken = await page.evaluate(() => [...document.querySelectorAll('article img')].filter((i) => i.complete && !i.naturalWidth).map((i) => i.src))
  check(!broken.length, `its images load${broken.length ? `: ${broken.join(', ')}` : ''}`)
  const wanted = Object.keys(spec.variants ?? {}).length
  const buttons = page.getByRole('button', { name: 'Use this variant' })
  check((await buttons.count()) === wanted, `${wanted} variant buttons`)

  // The tool, at a size. Pieces are the draft's SVG, the largest on the page
  const pathCount = () => page.evaluate(() => Math.max(0, ...[...document.querySelectorAll('.pattern-editor svg')].map((s) => s.querySelectorAll('path').length)))
  // The draft is the page's largest pattern; a failed one is empty (viewBox 0 0 0 0), and covers the page
  const hasDrawing = () => page.evaluate(() => [...document.querySelectorAll('.pattern-editor svg.freesewing')].some((s) => (s.getAttribute('viewBox') ?? '').split(' ').slice(2).every((n) => +n > 0)))
  const drafted = async (what) => {
    await page.waitForFunction(() => [...document.querySelectorAll('.pattern-editor svg.freesewing')].some((s) => (s.getAttribute('viewBox') ?? '').split(' ').slice(2).every((n) => +n > 0)), null, { timeout: 15000 }).catch(() => {})
    const n = await pathCount()
    const text = await page.locator('.pattern-editor').innerText()
    const ok = (await hasDrawing()) && !/Unable to draft/.test(text)
    check(ok, `${what} (${n} paths)`)
    return ok
  }
  const select = page.locator('.pattern-editor select').filter({ hasText: /\d/ }).first()
  const labels = await select.locator('option').allInnerTexts()
  const size = args.size ?? labels.find((l) => /^Women 36/.test(l)) ?? labels.find((l) => /^Men 38/.test(l)) ?? labels.at(-1)
  await select.selectOption({ label: size })
  // With no drawing nothing else on the page can be tested: say why, and go on to the next design
  if (!(await drafted(`the tool drafts at ${size}`))) {
    check(false, `not tested further:\n  ${[...new Set(errors)].slice(0, 3).join('\n  ').slice(0, 500)}`)
    await context.close()
    continue
  }

  // Each variant's button changes the drawing, and the way back restores it. A button in use is
  // disabled and relabelled, so go through them all by class
  const drawing = () => page.evaluate(() => {
    const svgs = [...document.querySelectorAll('.pattern-editor svg')]
    const svg = svgs.sort((a, b) => b.querySelectorAll('path').length - a.querySelectorAll('path').length)[0]
    return svg ? [...svg.querySelectorAll('path')].map((q) => q.getAttribute('d')).join('|') : ''
  })
  const changedFrom = async (before) => {
    for (let t = 0; t < 40; t++) {
      if ((await drawing()) !== before) return true
      await page.waitForTimeout(250)
    }
    return false
  }
  const base = await drawing()
  const all = page.locator('.variant-button')
  let last = base
  let tried = 0
  for (let i = 0; i < (await all.count()); i++) {
    const button = all.nth(i)
    if ((await button.innerText()).trim() !== 'Use this variant' || (await button.isDisabled())) continue
    await button.click()
    tried++
    check(await changedFrom(last), `variant ${tried} of ${wanted} changes the drawing`)
    await drafted(`variant ${tried} of ${wanted} drafts`)
    last = await drawing()
  }
  if (wanted) {
    const back = all.and(page.locator(':not([disabled])')).filter({ hasNotText: 'Use this variant' }).first()
    if (await back.count()) {
      await back.click()
      await changedFrom(last)
      check((await drawing()) === base, 'the way back restores the design')
    } else check(false, 'no button returns to the design')
  }

  // Every download
  await page.locator('details.other-software summary').click()
  for (const [name, valid] of Object.entries(downloads)) {
    const [file] = await Promise.all([
      page.waitForEvent('download', { timeout: 30000 }).catch(() => null),
      page.getByRole('button', { name, exact: true }).click(),
    ])
    const path = file && (await file.path())
    const text = path ? readFileSync(path, 'latin1') : ''
    check(text.length > 100 && valid(text), `${name} downloads (${text.length} bytes)`)
  }
  const note = await page.locator('details.other-software').innerText()
  check(!/Couldn't make the file/.test(note), 'no download reported a problem')

  // The tool's own Export view: the tiled PDF, built in a worker, offered as a blob link
  await page.evaluate(() => [...document.querySelectorAll('.pattern-editor a')].find((a) => /Export Pattern/.test(a.textContent))?.click())
  for (const name of ['a4 PDF', 'letter PDF']) {
    const button = page.getByRole('button', { name, exact: true })
    if (!(await button.count())) {
      check(false, `no ${name} button in the Export view`)
      continue
    }
    const [file] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }).catch(() => null), button.click()])
    let text = file ? readFileSync(await file.path(), 'latin1') : ''
    if (!file) {
      const href = await page.locator('.pattern-editor a[href^="blob:"]').last().getAttribute('href', { timeout: 1000 }).catch(() => null)
      if (href) text = await page.evaluate(async (h) => Array.from(new Uint8Array(await (await fetch(h)).arrayBuffer()), (c) => String.fromCharCode(c)).join(''), href)
    }
    check(text.startsWith('%PDF'), `the tiled ${name} is made (${text.length} bytes)`)
  }

  check(!errors.length, `no console or network errors${errors.length ? `:\n  ${[...new Set(errors)].slice(0, 5).join('\n  ').slice(0, 800)}` : ''}`)
  await context.close()
}

await browser.close()
server.close()
console.log(failed ? `${failed} checks failed` : 'all checks passed')
process.exit(failed ? 1 : 0)
