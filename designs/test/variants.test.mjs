// Every design's `variants` (shown on its page): each option is one the pattern tool shows, with a
// value it can take, each setting changes what's drafted, and the variant drafts cleanly at every
// size.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { readSpec, loadSpec } from '../lib/load-spec.mjs'
import { sets, checkClean } from './coat-checks.mjs'
import { checkKnitClean } from './knit-checks.mjs'
import { checkNobleClean } from './bodice-checks.mjs'

const root = new URL('../', import.meta.url)
const designs = readdirSync(root).filter((d) => existsSync(new URL(`${d}/spec.yaml`, root)))

/** What a draft shows: the visible pieces' lines and snippets */
function drawn(Design, measurements, options) {
  const out = {}
  for (const [k, part] of Object.entries(new Design({ measurements, sa: 10, complete: true, options }).draft().parts[0])) {
    if (part.hidden) continue
    const paths = Object.entries(part.paths).filter(([, p]) => !p.hidden).map(([n, p]) => [n, p.asPathstring()])
    const snippets = Object.entries(part.snippets).map(([n, s]) => [n, s.def, s.anchor.x, s.anchor.y])
    out[k] = { paths, snippets }
  }
  return JSON.stringify(out)
}

for (const d of designs) {
  const file = new URL(`${d}/spec.yaml`, root)
  const spec = readSpec(file)
  for (const [key, v] of Object.entries(spec.variants ?? {})) {
    test(`variant ${d}.${key}: settings the pattern tool shows`, () => {
      assert.ok(v.name && v.description, 'name and description')
      for (const [name, value] of Object.entries(v.options)) {
        const o = spec.options[name]
        assert.ok(o?.menu, `${name} is shown in the pattern tool`)
        if (o.list) assert.ok(o.list.includes(value), `${name} can be ${value}`)
        if (o.min !== undefined && o.pct !== undefined) {
          assert.ok(value * 100 >= o.min && value * 100 <= o.max, `${name} ${value} within ${o.min}-${o.max}%`)
        }
        if (o.count !== undefined) assert.ok(value >= o.min && value <= o.max, `${name} ${value} within ${o.min}-${o.max}`)
      }
    })
    const { Design } = loadSpec(fileURLToPath(file))
    // A setting can do nothing while another holds it off (`if:` in a spec): raglan sleeves under
    // the mackinaw's ulster collar. So each has to matter with the variant's other settings in place.
    test(`variant ${d}.${key}: each setting changes the draft`, () => {
      const measurements = sets[Design.designConfig.data?.preview ?? 'cisMaleAdult38']
      const full = drawn(Design, measurements, v.options)
      assert.notEqual(full, drawn(Design, measurements, {}), 'drafts the same as the design')
      for (const name of Object.keys(v.options)) {
        const { [name]: _, ...rest } = v.options
        assert.notEqual(full, drawn(Design, measurements, rest), `${name} changes nothing`)
      }
    })
    for (const [name, measurements] of Object.entries(sets)) {
      test(`variant ${d}.${key}: ${name}`, () => {
        // (a knit design on Bibi allows Bibi's own warning: test/knit-checks.mjs)
        ;(spec.block === 'bibi' ? checkKnitClean : spec.block === 'noble' ? checkNobleClean : checkClean)(new Design({ measurements, sa: 10, options: v.options }).draft())
      })
    }
  }
}
