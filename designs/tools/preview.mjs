// The pattern-pieces preview each design's page shows: <design>/preview-<set>.png, drafted at the
// design's defaults at its preview size (`about.preview` in its spec, else cisMaleAdult38).
// Usage: NODE_PATH=$(npm root -g) node tools/preview.mjs [design ...]   (no designs: all of them)
import { existsSync, mkdirSync, readdirSync, renameSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { loadDesign, render, png } from './render.mjs'

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
  const { svg, store } = render(Design, set)
  const f = join(out, `${name}-preview-${set}.svg`)
  writeFileSync(f, svg)
  const e = store.logs.error.length + store.logs.warn.length
  done.push({ name, set, f })
  console.log(`${name}: ${set}${e ? `  (${e} errors/warnings)` : ''}`)
}
await png(done.map((d) => d.f))
for (const { name, set, f } of done) renameSync(f.replace(/\.svg$/, '.png'), join(root, name, `preview-${set}.png`))
