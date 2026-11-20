// Every design with a pattern map (its own or inherited) resolves it at every option variant the
// tests use, at an adult, a child and a stout size. A map that fails to resolve would break that
// design's SVG and PDF downloads on the site, so this guards every inheritor too.
import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { loadDesign, measurementSet } from '../tools/render.mjs'
import { mapFor, resolve } from '../lib/pattern-map.mjs'

const root = new URL('../', import.meta.url)
const variants = JSON.parse(readFileSync(new URL('tools/variants.json', root), 'utf8'))
const designs = readdirSync(root).filter((d) => existsSync(new URL(`${d}/src/index.mjs`, root)))

for (const d of designs) {
  const Design = await loadDesign(d)
  const map = mapFor(Design)
  if (!map) continue
  test(`${d}: its pattern map resolves at every variant`, () => {
    for (const [v, options] of Object.entries(variants[d] ?? { default: {} })) {
      for (const set of ['cisMaleAdult38', 'cisFemaleAdult34', 'usdaBoyC5', 'usdaGirlC10', 'stoutMale48']) {
        const pattern = new Design({ measurements: measurementSet(set), options, complete: true, sa: 10 }).draft()
        const marks = resolve(pattern, map)
        assert.ok(marks.length, `${v} at ${set}: no labels`)
      }
    }
  })
}
