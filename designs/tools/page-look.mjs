// What the pattern tool shows on a design's page at a size, with console errors and a screenshot
// (out/page-<design>.png), on the built site or a given origin. For one look; page-check.mjs is the full check.
// Usage: NODE_PATH=$(npm root -g) node tools/page-look.mjs <origin or ''> <design> [size]     (run in designs/)
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { dirname, extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const build = join(here, '..', '..', 'site', 'build')
let [origin, design, size = 'Women 36'] = process.argv.slice(2)
let server
if (!origin) {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' }
  server = createServer((req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^[\\/]+/, '')
    const file = [path, `${path}.html`, join(path, 'index.html')].map((p) => join(build, p)).find((f) => existsSync(f) && statSync(f).isFile())
    if (!file) return res.writeHead(404).end()
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
    createReadStream(file).pipe(res)
  })
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok))
  origin = `http://127.0.0.1:${server.address().port}`
}
const { chromium } = createRequire(join(process.env.NODE_PATH || here, 'x.js'))('playwright')
const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width: 1400, height: 1000 } })).newPage()
const errors = []
page.on('console', (m) => ['error', 'warning'].includes(m.type()) && errors.push(`${m.type()}: ${m.text()}`.slice(0, 300)))
page.on('pageerror', (e) => errors.push(`pageerror: ${String(e)}`.slice(0, 300)))
await page.goto(`${origin}/designs/${design}`, { waitUntil: 'networkidle' })
const select = page.locator('.pattern-editor select').filter({ hasText: /\d/ }).first()
await select.selectOption({ label: size })
await page.waitForTimeout(5000)
const info = await page.evaluate(() => {
  const svgs = [...document.querySelectorAll('.pattern-editor svg.freesewing, .pattern-editor svg')].map((s) => ({ viewBox: s.getAttribute('viewBox'), paths: s.querySelectorAll('path').length, parts: s.querySelectorAll('g[id*="stack"], g.stack').length }))
  const big = svgs.sort((a, b) => b.paths - a.paths).slice(0, 3)
  const text = document.querySelector('.pattern-editor').innerText
  return { big, flags: (text.match(/[^\n]*(error|Unable|fail|warning|missing)[^\n]*/gi) ?? []).slice(0, 8) }
})
console.log(origin, design, size, JSON.stringify(info, null, 0).slice(0, 900))
console.log('console:', [...new Set(errors)].slice(0, 6).join('\n         '))
await page.screenshot({ path: join(here, '..', 'out', `page-${design}.png`) })
await browser.close()
server?.close()
