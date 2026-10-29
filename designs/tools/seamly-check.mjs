// Check our Seamly files in Seamly2D itself: export designs as .sm2d (and the measurement set
// as .smis), load each in a headless Seamly2D on the Docker host, have Seamly export its layout
// as AAMA DXF, and compare each piece's seam line there with ours.
// Usage: node tools/seamly-check.mjs [design ...] [--set cisMaleAdult42]
//   No designs: all of them. The host is SEAMLY_HOST, or drape/local.json's "host"; it needs
//   the image from docker/seamly (docker build -t seamly-cli docker/seamly). Files go to
//   ~/seamly-check there and designs/out/seamly-check here.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadDesign, measurementSet } from './render.mjs'
import { credits } from './export.mjs'
import { pieces, perimeter } from '../lib/export/pieces.mjs'
import { toSeamly } from '../lib/export/seamly.mjs'
import { toSmis } from '../lib/export/smis.mjs'
import { parseDxf } from './dxf-aama.mjs'

const DESIGNS = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(DESIGNS, 'out', 'seamly-check')
const remote = 'seamly-check'

const args = process.argv.slice(2)
const i = args.indexOf('--set')
const set = i >= 0 ? args.splice(i, 2)[1] : 'cisMaleAdult42'
const names = args.length ? args : readdirSync(DESIGNS).filter((d) => existsSync(join(DESIGNS, d, 'spec.yaml')))
const local = existsSync(join(DESIGNS, 'drape', 'local.json')) ? JSON.parse(readFileSync(join(DESIGNS, 'drape', 'local.json'), 'utf8')) : {}
const host = process.env.SEAMLY_HOST ?? local.host
if (!host) throw new Error('set SEAMLY_HOST (or "host" in drape/local.json)')

// 1. Export
mkdirSync(out, { recursive: true })
const ours = {}
for (const name of names) {
  const Design = await loadDesign(name)
  const pattern = new Design({ measurements: measurementSet(set), sa: 10 }).draft()
  writeFileSync(join(out, `${name}.sm2d`), toSeamly(pattern, { name, size: set, notes: credits(name) }))
  ours[name] = Object.fromEntries(pieces(pattern).map((p) => [p.name.toUpperCase(), perimeter(p.seam)]))
}
writeFileSync(join(out, `${set}.smis`), toSmis(measurementSet(set)))

// 2. Run Seamly on the host
const ssh = (cmd) => execFileSync('ssh', [host, cmd], { encoding: 'utf8', maxBuffer: 1 << 26 })
ssh(`rm -rf ~/${remote} && mkdir -p ~/${remote}`)
execFileSync('scp', ['-q', ...[...names.map((n) => `${n}.sm2d`), `${set}.smis`].map((f) => join(out, f)), `${host}:${remote}/`])
const report = ssh(`docker run --rm -v ~/${remote}:/work seamly-cli`)
mkdirSync(join(out, 'dxf'), { recursive: true })
execFileSync('scp', ['-q', '-r', `${host}:${remote}/dxf/.`, join(out, 'dxf')])

// 3. Compare: Seamly writes the seam line on layer 8 (the longest closed polyline there) and
// the cut line on layer 1; a piece's seam should keep its length
let bad = 0
for (const line of report.trim().split('\n')) {
  const [file, , test, , dxf] = line.split(' ')
  const name = file.replace(/\.(sm2d|smis)$/, '')
  const problems = []
  if (test !== '0') problems.push(`load exit ${test}`)
  const note = dxf === 'toobig' ? ` (a piece is wider than Seamly's widest roll, 44 in: loads, but no layout to compare)` : ''
  if (dxf !== undefined && dxf !== '0' && dxf !== 'toobig') problems.push(`DXF export exit ${dxf}`)
  if (file.endsWith('.sm2d') && dxf === '0') {
    const seen = new Set()
    for (const f of readdirSync(join(out, 'dxf')).filter((f) => f.startsWith(`${name}_layout_`) && f.endsWith('.dxf'))) {
      for (const b of parseDxf(readFileSync(join(out, 'dxf', f), 'latin1')).blocks) {
        const want = ours[name][b.name]
        if (want === undefined) continue
        seen.add(b.name)
        const seam = b.ents.filter((e) => e.type === 'POLYLINE' && e.layer === 8).sort((a, c) => c.pts.length - a.pts.length)[0]
        const got = seam ? perimeter(seam.pts) : 0
        if (Math.abs(got - want) > Math.max(1, want * 0.002)) problems.push(`${b.name} seam ${got.toFixed(1)} vs ${want.toFixed(1)}`)
      }
    }
    for (const p of Object.keys(ours[name])) if (!seen.has(p)) problems.push(`${p} missing`)
  }
  if (problems.length) bad++
  console.log(`${problems.length ? 'FAIL' : 'ok  '} ${file}${problems.length ? `: ${problems.join('; ')}` : note}`)
}
console.log(`${bad} of ${report.trim().split('\n').length} files with problems`)
process.exit(bad ? 1 : 0)
