// Every design's `variants` (shown on its page): each option is one the pattern tool shows, with a
// value it can take, and the variant drafts cleanly at every size.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { readSpec, loadSpec } from '../lib/load-spec.mjs'
import { sets, checkClean } from './coat-checks.mjs'

const root = new URL('../', import.meta.url)
const designs = readdirSync(root).filter((d) => existsSync(new URL(`${d}/spec.yaml`, root)))

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
    for (const [name, measurements] of Object.entries(sets)) {
      test(`variant ${d}.${key}: ${name}`, () => {
        checkClean(new Design({ measurements, sa: 10, options: v.options }).draft())
      })
    }
  }
}
