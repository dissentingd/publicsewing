// What a visitor can reach in the pattern tool, beyond `npm test`'s sizes: every option in a menu at
// its extremes, the core settings, each part alone, and bodies far smaller and larger than any size
// set. After FreeSewing's design tests (tests/designs in its repo). A pass means no errors and no NaN
// points, not that the shape is sensible. Takes some minutes, so it's its own command:
//   npm run test:robust            every design
//   npm run test:robust -- <design> ...
import { readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { readSpec } from '../lib/load-spec.mjs'
import { designFromSpec } from '../lib/spec.mjs'
import { sets } from '../test/coat-checks.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const scaled = (m, k) => Object.fromEntries(Object.entries(m).map(([n, v]) => [n, n === 'shoulderSlope' ? v : v * k]))

/** The first problem with drafting and rendering at these settings, or null */
function problem(Design, settings) {
  try {
    const pattern = new Design({ layout: true, sa: 10, ...settings })
    pattern.draft()
    pattern.render()
    const error = pattern.setStores[0].logs.error[0]
    if (error) return String(error).replace(/\s+/g, ' ').slice(0, 140)
    for (const set of pattern.parts) {
      for (const [name, part] of Object.entries(set)) {
        for (const [id, p] of Object.entries(part.points)) if (Number.isNaN(p.x) || Number.isNaN(p.y)) return `NaN point ${name}.${id}`
      }
    }
    return null
  } catch (e) {
    return `throws: ${e.message}`.slice(0, 140)
  }
}

/** An option's values to try: only what its menu offers. A hidden option (`menu: false`) isn't */
function extremes(cfg) {
  if (!cfg.menu) return []
  if (cfg.pct !== undefined) return [cfg.min / 100, cfg.max / 100]
  if (cfg.deg !== undefined || cfg.count !== undefined || cfg.mm !== undefined) return [cfg.min, cfg.max]
  if (cfg.bool !== undefined) return [!cfg.bool]
  return cfg.list ?? []
}

const wanted = process.argv.slice(2)
const designs = readdirSync(root).filter(
  (d) => existsSync(join(root, d, 'spec.yaml')) && existsSync(join(root, d, 'BRIEF.md')) && (!wanted.length || wanted.includes(d))
)
const failures = []
let tried = 0
for (const d of designs) {
  const { Design } = designFromSpec(readSpec(join(root, d, 'spec.yaml')))
  // Whichever adult set has all it asks for: women's jackets need a bust
  const needs = Design.patternConfig.measurements
  const measurements = [sets.cisMaleAdult42, sets.cisFemaleAdult34].find((m) => needs.every((n) => m[n] !== undefined))
  const run = (what, settings) => {
    tried++
    const why = problem(Design, { measurements, ...settings })
    if (why) failures.push(`${d} | ${what} | ${why}`)
  }
  run('as drafted', {})
  run('paperless', { paperless: true })
  run('not detailed', { complete: false })
  run('not detailed, paperless', { complete: false, paperless: true })
  run('no seam allowance', { sa: 0 })
  run('not expanded', { expand: false })
  for (const k of [0.3, 0.5, 2, 2.5]) run(`body x${k}`, { measurements: scaled(measurements, k) })
  for (const part of Design.designConfig.parts) run(`only ${part.name}`, { only: [part.name] })
  for (const [o, cfg] of Object.entries(Design.patternConfig.options)) {
    for (const v of extremes(cfg)) run(`${o} = ${v}`, { options: { [o]: v } })
  }
}

console.log(`${designs.length} designs, ${tried} drafts, ${failures.length} failing`)
for (const f of failures) console.log(f)
process.exitCode = failures.length ? 1 : 0
