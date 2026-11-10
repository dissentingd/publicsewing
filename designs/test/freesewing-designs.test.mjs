// FreeSewing's designs we list (freesewing.yaml) draft at every size set we offer: no errors and
// no NaN points. Their seams and fit are FreeSewing's to check, so this isn't testCoat.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { parse } from 'yaml'
import { sets } from './coat-checks.mjs'
import { babies } from '../sizes/babies.mjs'
import { categories } from '../lib/categories.mjs'

const root = new URL('../', import.meta.url)
const registry = parse(readFileSync(new URL('freesewing.yaml', root), 'utf8'))
const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'))
const sitePkg = JSON.parse(readFileSync(new URL('../site/package.json', root), 'utf8'))
const version = pkg.dependencies['@freesewing/core']

for (const [id, d] of Object.entries(registry.designs)) {
  test(`${id}: listed correctly`, () => {
    assert.ok(d.name && d.about, 'name and about')
    assert.ok(categories.some((c) => c.id === d.category), `category ${d.category}`)
    assert.ok([undefined, 'babies', 'all'].includes(d.sizes), `sizes ${d.sizes}`)
    for (const s of d.skip ?? []) assert.ok(s in { ...sets, ...babies }, `skip: no size set ${s}`)
    for (const p of [d.package, ...(d.needs ?? [])]) {
      assert.equal(pkg.dependencies[p], version, `${p} pinned at ${version} in designs/package.json`)
      assert.equal(sitePkg.dependencies[p], version, `${p} pinned at ${version} in site/package.json`)
    }
    for (const o of d.ours ?? []) assert.ok(existsSync(new URL(`${o}/spec.yaml`, root)), `no design ${o}`)
    assert.ok(!existsSync(new URL(`${id}/spec.yaml`, root)), `${id} is also one of our design ids`)
  })

  const Design = (await import(d.package))[d.export]
  // `sizes` (freesewing.yaml): our 98 sets, the baby and toddler sets, or both
  const at = d.sizes === 'babies' ? babies : d.sizes === 'all' ? { ...sets, ...babies } : sets
  for (const [name, measurements] of Object.entries(at)) {
    if (d.skip?.includes(name)) continue // `skip` (freesewing.yaml): it can't draft there
    test(`${id}: ${name}`, () => {
      const pattern = new Design({ measurements, sa: 10 }).draft()
      for (const s of pattern.setStores) assert.deepEqual(s.logs.error, [], 'drafting errors')
      for (const [pn, part] of Object.entries(pattern.parts[0])) {
        for (const [k, p] of Object.entries(part.points)) assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), `${pn}.${k} is NaN`)
      }
    })
  }
}
