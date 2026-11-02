// The pattern-pieces preview each design's page shows: <design>/preview-<set>.png, drafted at the
// design's defaults at its preview size (`about.preview` in its spec, else cisMaleAdult38). Each
// of its `variants` gets one too, drafted with that variant's options:
// <design>/preview-<set>-<variant>.png.
// Usage: NODE_PATH=$(npm root -g) node tools/preview.mjs [design ...]   (no designs: all of them)
import { existsSync, mkdirSync, readdirSync, renameSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { loadDesign, render, png } from './render.mjs'
import { readSpec } from '../lib/load-spec.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'out')

export const previewSet = (Design) => Design.designConfig.data?.preview ?? 'cisMaleAdult38'

const args = process.argv.slice(2)
const names = args.length ? args : readdirSync(root).filter((d) => existsSync(join(root, d, 'spec.yaml')) && existsSync(join(root, d, 'BRIEF.md')))
mkdirSync(out, { recursive: true })
const done = []
for (const name of names) {
  const Design = await loadDesign(name)
  const set = previewSet(Design)
  const variants = readSpec(join(root, name, 'spec.yaml')).variants ?? {}
  for (const [key, options] of [[null, {}], ...Object.entries(variants).map(([k, v]) => [k, v.options])]) {
    const suffix = key ? `-${key}` : ''
    const { svg, store } = render(Design, set, { options })
    const f = join(out, `${name}-preview-${set}${suffix}.svg`)
    writeFileSync(f, svg)
    const e = store.logs.error.length + store.logs.warn.length
    done.push({ name, f, to: `preview-${set}${suffix}.png` })
    console.log(`${name}${suffix}: ${set}${e ? `  (${e} errors/warnings)` : ''}`)
  }
}
await png(done.map((d) => d.f))
for (const { name, f, to } of done) renameSync(f.replace(/\.svg$/, '.png'), join(root, name, to))
