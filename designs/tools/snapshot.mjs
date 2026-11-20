// Snapshot a design's drafted output at every test measurement set, or compare it with a saved
// snapshot. Used to prove a conversion (e.g. code -> spec) leaves the pattern unchanged.
// Usage: node tools/snapshot.mjs <design> save|compare [--variants '<json>'] [--tol 0.1] [--draft-only]
//   variants: { name: options }, default the design's entry in tools/variants.json (the option
//   sets its tests use); snapshots go to out/snapshots/.
// compare passes when every point, path, snippet and stored value matches within `tol` mm, the
// pattern-map labels and key in the layered SVG match, and the preview and download files
// (DXF, Seamly, SVG, PDFs) are byte-identical (`--draft-only` reports but allows those);
// `--rename old.key=new.key` (repeatable) moves a store key in the saved snapshot first.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { themePlugin } from '@freesewing/plugin-theme'
import { loadDesign, render } from './render.mjs'
import { exportFiles } from '../lib/export/index.mjs'
import { sets } from '../test/coat-checks.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const dir = join(here, '..', 'out', 'snapshots')

/** Everything a part drafted, in a form that survives JSON */
function partData(part) {
  const points = {}
  for (const [k, p] of Object.entries(part.points)) points[k] = [p.x, p.y]
  const paths = {}
  for (const [k, p] of Object.entries(part.paths)) {
    paths[k] = { d: p.asPathstring(), class: p.attributes.get('class') || '', hidden: Boolean(p.hidden) }
  }
  const snippets = {}
  for (const [k, s] of Object.entries(part.snippets)) snippets[k] = [s.def, s.anchor.x, s.anchor.y]
  return { hidden: Boolean(part.hidden), points, paths, snippets }
}

/** Everything the parts stored (coat.*, the design's own keys, the cutlist), less the logs */
function storeData(store) {
  // eslint-disable-next-line no-unused-vars
  const { logs, ...data } = store
  return JSON.parse(JSON.stringify(data))
}

const hash = (s) => createHash('sha256').update(s).digest('hex')
const dated = (s) => s.replace(/[A-Z][a-z]+day, [A-Z][a-z]{2} \d{1,2}, \d{4}/g, 'DATE')

/**
 * What a visitor gets: the page preview (render() with any pattern map and key) and the
 * download files, as hashes, plus the pattern-map text drawn in the layered SVG, readable
 * so a changed or moved code shows in the diff. The preview and exports each lay pieces out
 * on their own, so their hashes are compared separately from the draft.
 */
function outputData(Design, measurements, options, set) {
  const files = exportFiles(Design, { measurements, options, sa: 10 }, { name: Design.designConfig.data.id, size: set })
  const outputs = { preview: hash(dated(render(Design, set, { measurements, options }).svg)) }
  for (const [k, v] of Object.entries(files)) outputs[k] = hash(v)
  const map = [...files.svg.matchAll(/<text x="([-\d.]+)" y="([-\d.]+)" class="map-(code|entry|heading)">([^<]*)<\/text>/g)]
    .map(([, x, y, kind, text]) => [kind, text, Number(x), Number(y)])
  return { outputs, map }
}

export function snapshot(Design, variants) {
  const out = {}
  for (const [v, options] of Object.entries(variants)) {
    for (const [name, measurements] of Object.entries(sets)) {
      const pattern = new Design({ measurements, sa: 10, complete: true, options })
      pattern.use(themePlugin)
      pattern.draft()
      const store = pattern.setStores[0]
      const parts = {}
      for (const [k, part] of Object.entries(pattern.parts[0])) parts[k] = partData(part)
      // The title block prints the drafting date; leave it out, or no day matches another
      const svg = pattern.render().replace(/[A-Z][a-z]+day, [A-Z][a-z]{2} \d{1,2}, \d{4}/g, 'DATE')
      out[`${v}/${name}`] = {
        parts,
        store: storeData(store),
        logs: { error: store.logs.error.length, warn: store.logs.warn.length },
        svg: createHash('sha256').update(svg).digest('hex'),
        ...outputData(Design, measurements, options, name),
      }
    }
  }
  return out
}

/** Differences between two snapshot values; numbers (also inside path strings) within tol */
function diff(a, b, tol, at, found) {
  if (found.length > 50) return
  if (typeof a === 'number' && typeof b === 'number') {
    if (!(Math.abs(a - b) <= tol)) found.push(`${at}: ${a} vs ${b}`)
  } else if (typeof a === 'string' && typeof b === 'string') {
    if (a === b) return
    const num = /-?\d+(\.\d+)?(e-?\d+)?/g
    const [na, nb] = [a.match(num) || [], b.match(num) || []]
    if (a.replace(num, '#') !== b.replace(num, '#') || na.length !== nb.length) return found.push(`${at}: "${a.slice(0, 80)}" vs "${b.slice(0, 80)}"`)
    na.forEach((x, i) => diff(Number(x), Number(nb[i]), tol, `${at}[${i}]`, found))
  } else if (a && b && typeof a === 'object' && typeof b === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!(k in a)) found.push(`${at}.${k}: added`)
      else if (!(k in b)) found.push(`${at}.${k}: missing`)
      else diff(a[k], b[k], tol, `${at}.${k}`, found)
    }
  } else if (a !== b) found.push(`${at}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const flag = (f, d) => (args.includes(f) ? args[args.indexOf(f) + 1] : d)
  const [design, mode] = args
  const known = JSON.parse(readFileSync(join(here, 'variants.json'), 'utf8'))
  const variants = JSON.parse(flag('--variants', 'null')) ?? known[design] ?? { default: {} }
  const tol = Number(flag('--tol', '0.1'))
  const file = join(dir, `${design}.json`)
  const now = snapshot(await loadDesign(design), variants)
  if (mode === 'save') {
    mkdirSync(dir, { recursive: true })
    writeFileSync(file, JSON.stringify({ variants, cases: now }))
    console.log(`saved ${Object.keys(now).length} cases to ${file}`)
  } else if (mode === 'compare') {
    const base = JSON.parse(readFileSync(file, 'utf8'))
    // --rename old.key=new.key: a store key the conversion renamed on purpose
    for (const r of args.filter((a, i) => args[i - 1] === '--rename')) {
      const [from, to] = r.split('=').map((k) => k.split('.'))
      for (const c of Object.values(base.cases)) {
        const parent = from.slice(0, -1).reduce((o, k) => o?.[k], c.store)
        if (!parent || !(from.at(-1) in parent)) continue
        let target = c.store
        for (const k of to.slice(0, -1)) target = target[k] ??= {}
        target[to.at(-1)] = parent[from.at(-1)]
        delete parent[from.at(-1)]
        if (!Object.keys(parent).length) delete c.store[from[0]]
      }
    }
    if (JSON.stringify(base.variants) !== JSON.stringify(variants)) throw new Error(`variants differ from the snapshot's: ${JSON.stringify(base.variants)}`)
    let failed = 0
    let sameSvg = 0
    const changedOutputs = new Set()
    for (const [k, c] of Object.entries(base.cases)) {
      const found = []
      const { svg: a, outputs: oa = {}, ...restA } = c
      const { svg: b, outputs: ob = {}, ...restB } = now[k] || {}
      if (a === b) sameSvg++
      diff(restA, restB, tol, k, found)
      // The preview and download files must be byte-identical, unless --draft-only
      for (const f of new Set([...Object.keys(oa), ...Object.keys(ob)])) {
        if (oa[f] === ob[f]) continue
        changedOutputs.add(f)
        if (!args.includes('--draft-only')) found.push(`${k}.outputs.${f}: changed`)
      }
      if (found.length) {
        failed++
        // SNAP_ALL=1: every difference in every case
        if (process.env.SNAP_ALL || failed <= 5) console.log(found.slice(0, process.env.SNAP_ALL ? Infinity : 10).join('\n'))
      }
    }
    const n = Object.keys(base.cases).length
    console.log(`${n - failed}/${n} cases match within ${tol} mm; ${sameSvg}/${n} render identical SVG`)
    console.log(changedOutputs.size ? `changed outputs: ${[...changedOutputs].join(', ')}` : 'preview and download files identical')
    process.exitCode = failed ? 1 : 0
  } else throw new Error('mode is save or compare')
}
