// Every listed design (one with a brief) belongs to one section of the site's Designs page.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'
import { readSpec } from '../lib/load-spec.mjs'
import { categories } from '../lib/categories.mjs'

const root = new URL('../', import.meta.url)
const designs = readdirSync(root).filter((d) => existsSync(new URL(`${d}/spec.yaml`, root)) && existsSync(new URL(`${d}/BRIEF.md`, root)))
const known = categories.map((c) => c.id)

for (const d of designs) {
  test(`${d}: a category the Designs page knows`, () => {
    assert.ok(known.includes(readSpec(new URL(`${d}/spec.yaml`, root)).about.category), `about.category of ${d}`)
  })
}

test('every section has a design', () => {
  const used = new Set(designs.map((d) => readSpec(new URL(`${d}/spec.yaml`, root)).about.category))
  for (const id of known) assert.ok(used.has(id), id)
})
