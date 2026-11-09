// The garment family tree (garments/) stays true to the repo: every element it calls covered names
// real library operations or piece types and real designs; every design sits in the tree; the
// coverage page is up to date.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { load, render } from '../tools/garments.mjs'
import { operations } from '../lib/spec.mjs'

const root = new URL('../', import.meta.url)
const { tree, elements: E } = load()
const elements = E.elements
const designs = readdirSync(root).filter((d) => existsSync(new URL(`${d}/spec.yaml`, root)))
// Piece types: the keys of `factories` in lib/spec.mjs (not exported, so read from the source)
const src = readFileSync(new URL('lib/spec.mjs', root), 'utf8')
const factories = new Set([...src.slice(src.indexOf('const factories = {')).matchAll(/^ {2}([a-zA-Z]+):/gm)].map((m) => m[1]))
const libNames = new Set([...Object.keys(operations), ...factories])

test('every element is well formed and names real code and designs', () => {
  for (const [k, e] of Object.entries(elements)) {
    assert.ok(e.name && E.groups[e.group], `${k}: name and a known group`)
    assert.ok(['covered', 'partial', 'gap'].includes(e.status), `${k}: status`)
    if (e.status === 'covered') assert.ok(e.lib?.length, `${k}: a covered element names what builds it`)
    for (const l of e.lib ?? []) assert.ok(libNames.has(l.split('.')[0]), `${k}: ${l} is not an operation or piece type`)
    for (const d of e.seen ?? []) assert.ok(designs.includes(d), `${k}: no design ${d}`)
  }
})

test('every tree node is well formed', () => {
  for (const [id, n] of Object.entries(tree)) {
    assert.ok(n.name, `${id}: name`)
    if (n.parent) assert.ok(tree[n.parent], `${id}: parent ${n.parent} exists`)
    for (const t of n.traits ?? []) assert.ok(elements[t], `${id}: no element ${t}`)
    for (const d of n.designs ?? []) assert.ok(designs.includes(d), `${id}: no design ${d}`)
    for (const v of n.variants ?? []) {
      const [d, key] = v.split('.')
      const spec = readFileSync(new URL(`${d}/spec.yaml`, root), 'utf8')
      assert.ok(new RegExp(`^  ${key}:`, 'm').test(spec), `${id}: no variant ${v}`)
    }
  }
})

test('every design sits in the tree', () => {
  const placed = new Set(Object.values(tree).flatMap((n) => n.designs ?? []))
  assert.deepEqual(designs.filter((d) => !placed.has(d)), [])
})

test('garments/COVERAGE.md is up to date (node tools/garments.mjs)', () => {
  const md = readFileSync(new URL('garments/COVERAGE.md', root), 'utf8').replace(/\r\n/g, '\n')
  assert.equal(md, render({ tree, elements: E }))
})
