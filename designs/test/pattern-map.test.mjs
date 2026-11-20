// Every design with a pattern map (its own or inherited) resolves it at every option variant the
// tests use, at an adult, a child and a stout size. A map that fails to resolve would break that
// design's SVG and PDF downloads on the site, so this guards every inheritor too. It also checks
// the map's piece numbers against the numbers the pieces print, and that none prints twice.
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
        // The map's numbers are the ones the pieces print, and no two drafted pieces share one
        const printed = {}
        for (const [name, part] of Object.entries(pattern.parts[0])) {
          if (part.hidden || !part.paths.seam || name.endsWith('testSquare')) continue
          const nr = Object.entries(part.points).find(([k]) => k.endsWith('title_nr'))?.[1].attributes.get('data-text')
          if (!nr) continue
          if (map.numbers[name] !== undefined) assert.equal(String(map.numbers[name]), String(nr), `${v} at ${set}: ${name} prints ${nr}`)
          assert.ok(!printed[nr], `${v} at ${set}: ${name} and ${printed[nr]} both print ${nr}`)
          printed[nr] = name
        }
      }
    }
  })
}
