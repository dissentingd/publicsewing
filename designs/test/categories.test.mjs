// Every listed design (one with a brief) belongs to one section of the site's Designs page.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { readSpec } from '../lib/load-spec.mjs'
import { parse } from 'yaml'
import { categories } from '../lib/categories.mjs'

const root = new URL('../', import.meta.url)
const designs = readdirSync(root).filter((d) => existsSync(new URL(`${d}/spec.yaml`, root)) && existsSync(new URL(`${d}/BRIEF.md`, root)))
const known = categories.map((c) => c.id)

for (const d of designs) {
  test(`${d}: a category the Designs page knows`, () => {
    assert.ok(known.includes(readSpec(new URL(`${d}/spec.yaml`, root)).about.category), `about.category of ${d}`)
  })
}

for (const c of categories) {
  test(`${c.id}: an illustration to link to it, or its prompt`, () => {
    const prompts = readFileSync(new URL('../site/illustrations/PROMPTS.md', root), 'utf8')
    assert.ok(existsSync(new URL(`../site/illustrations/${c.image}.jpg`, root)) || prompts.includes(`### ${c.image}:`), c.image)
  })
}

// Docusaurus makes a page named like its folder that folder's landing page: the sidebar group
// would link to the garment instead of opening
for (const c of categories) {
  test(`${c.id}: no design with the section's name`, () => assert.ok(!designs.includes(c.id)))
}

// ours or FreeSewing's (freesewing.yaml)
test('every section has a design', () => {
  const fs = Object.values(parse(readFileSync(new URL('freesewing.yaml', root), 'utf8')).designs).map((d) => d.category)
  const used = new Set([...designs.map((d) => readSpec(new URL(`${d}/spec.yaml`, root)).about.category), ...fs])
  for (const id of known) assert.ok(used.has(id), id)
})
