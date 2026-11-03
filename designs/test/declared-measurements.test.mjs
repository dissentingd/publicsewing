// Every design drafts with only the measurements it declares, as the site's size picker gives it. The
// other tests pass a whole measurement set, so a design that uses one without declaring it passes them
// and draws nothing for a visitor (the culottes did, with crotchDepth).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { readSpec } from '../lib/load-spec.mjs'
import { sets } from './coat-checks.mjs'
import { loadDesign } from '../tools/render.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const designs = readdirSync(root).filter((d) => existsSync(join(root, d, 'spec.yaml')) && existsSync(join(root, d, 'src')))

for (const id of designs) {
  test(`${id} drafts with only its declared measurements`, async () => {
    const Design = await loadDesign(id)
    const { measurements: required, optionalMeasurements: optional } = Design.patternConfig
    const variants = readSpec(join(root, id, 'spec.yaml')).variants ?? {}
    for (const set of ['cisFemaleAdult36', 'cisMaleAdult38', 'usdaBoyC6', 'usdaGirlC5']) {
      const all = sets[set]
      const measurements = Object.fromEntries([...required, ...optional].filter((k) => all[k] !== undefined).map((k) => [k, all[k]]))
      for (const k of required) assert.notEqual(all[k], undefined, `${set} has no ${k}`)
      for (const [v, options] of [['default', {}], ...Object.entries(variants).map(([k, x]) => [k, x.options])]) {
        const errors = new Design({ measurements, sa: 10, options }).draft().setStores[0].logs.error
        const text = errors.map((e) => [e].flat().map((x) => (x instanceof Error ? x.message : String(x))).join(' '))
        assert.deepEqual(text, [], `${v} at ${set}`)
      }
    }
  })
}
