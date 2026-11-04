// A design at one size, in a few lines: each part, its visible paths, and any draft errors with their
// stacks. The quickest way to see why a part won't draft.
// Usage: node tools/probe.mjs <design> [set] [options json]     (run in designs/)
import { loadDesign, measurementSet } from './render.mjs'

const [design, set = 'cisMaleAdult38', opts = '{}'] = process.argv.slice(2)
const Design = await loadDesign(design)
const p = new Design({ measurements: measurementSet(set), options: JSON.parse(opts) }).draft()
for (const [name, part] of Object.entries(p.parts[0])) {
  const paths = Object.keys(part.paths).filter((k) => !part.paths[k].hidden && !k.startsWith('__macro'))
  console.log(name, part.hidden ? '(hidden)' : '', paths.join(','))
}
const show = (x) => (x instanceof Error ? x.stack.split('\n').slice(0, 5).join('\n') : typeof x === 'string' ? x : JSON.stringify(x))
for (const store of [p.store, ...(p.setStores ?? [])]) {
  for (const level of ['error', 'warn']) {
    for (const entry of store.logs?.[level] ?? []) console.log(level.toUpperCase(), [entry].flat().map(show).join(' ').slice(0, 900))
  }
}
