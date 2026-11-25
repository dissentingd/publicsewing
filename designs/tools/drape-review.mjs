// A page for reviewing drape tests by eye: each design's front and back from the simulator, with
// its verdict and how deep any cloth goes inside the body.
// Usage: node tools/drape-review.mjs [--local <out/drape folder>] [--remote <folder on the host>]
//          [--out <folder>]
//   By default fetches from the GPU host (drape/local.json or DRAPE_HOST, as tools/drape.mjs),
//   from the unattended pipeline's results: ~/drape-pipeline/repo/designs/out/drape. --local
//   reads a folder on this machine instead. Writes <out>/index.html (default out/drape-review)
//   with the images beside it. Only each design's average-body drape is shown: REVIEW first,
//   then designs not yet in drape/runs.yaml, then the rest, each by name.
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const DESIGNS = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const value = (f) => (args.includes(f) ? args[args.indexOf(f) + 1] : undefined)
const out = resolve(value('--out') ?? join(DESIGNS, 'out', 'drape-review'))
const local = value('--local')
const VIEWS = ['front', 'back']
const runs = parse(readFileSync(join(DESIGNS, 'drape', 'runs.yaml'), 'utf8'))
mkdirSync(out, { recursive: true })

const results = {} // run name -> its result.json
if (local) {
  for (const run of readdirSync(local)) {
    const dir = join(local, run)
    if (!existsSync(join(dir, 'result.json'))) continue
    results[run] = JSON.parse(readFileSync(join(dir, 'result.json'), 'utf8'))
    for (const v of VIEWS) {
      const f = `${run}_render_${v}.png`
      if (existsSync(join(dir, f))) copyFileSync(join(dir, f), join(out, f))
    }
  }
} else {
  const settings = existsSync(join(DESIGNS, 'drape', 'local.json')) ? JSON.parse(readFileSync(join(DESIGNS, 'drape', 'local.json'), 'utf8')) : {}
  const host = process.env.DRAPE_HOST ?? settings.host
  if (!host) throw new Error('set DRAPE_HOST (or "host" in drape/local.json), or use --local')
  const remote = value('--remote') ?? 'drape-pipeline/repo/designs/out/drape'
  const pack = "import glob,json; print(json.dumps({f.split('/')[0]: json.load(open(f)) for f in glob.glob('*/result.json')}))"
  Object.assign(results, JSON.parse(execFileSync('ssh', [host, `cd ${remote} && python3 -c "${pack}"`], { encoding: 'utf8', maxBuffer: 1 << 28 })))
  execFileSync('scp', ['-q', `${host}:${remote}/*-pipeline/*_render_*.png`, out], { stdio: 'inherit' })
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
const shown = Object.keys(results).filter((r) => !results[r].set && existsSync(join(out, `${r}_render_front.png`)))
const rank = (r) => (results[r].verdict === 'REVIEW' ? 0 : runs[results[r].design] ? 2 : 1)
const deepest = (r) => {
  const regions = Object.entries(results[r].inside?.regions ?? {}).filter(([k]) => k !== 'wrist/hand').sort((a, b) => b[1].deepest - a[1].deepest)
  return regions.length ? `${regions[0][1].deepest} cm inside at ${regions[0][0]}` : 'nothing inside the body'
}
const cards = shown.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b)).map((r) => {
  const { design, verdict } = results[r]
  const imgs = VIEWS.map((v) => `<a href="${esc(r)}_render_${v}.png"><img loading="lazy" src="${esc(r)}_render_${v}.png" alt="${esc(design)}, ${v}"></a>`).join('')
  return `<article class="${esc(verdict)}"><h2>${esc(design)}</h2><p><b>${esc(verdict)}</b>${runs[design] ? '' : ' · not in runs.yaml'}<br>${esc(deepest(r))}</p><div>${imgs}</div></article>`
})
writeFileSync(join(out, 'index.html'), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Drape review</title>
<style>body{font:14px system-ui,sans-serif;margin:16px;background:#f6f5f2;color:#222}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px}
article{background:#fff;border:1px solid #ddd;padding:8px}article.REVIEW{border:2px solid #b45309}h2{font-size:15px;margin:0}p{margin:4px 0}article div{display:grid;grid-template-columns:1fr 1fr}img{width:100%;display:block}</style>
<h1>Drape review</h1><p>${cards.length} designs on their average body. REVIEW first, then designs not yet in runs.yaml.</p><main>${cards.join('\n')}</main>`)
console.log(`${join(out, 'index.html')}: ${cards.length} designs`)
