// Infant safety (BUILD_QUEUE S2): everything offered at baby sizes has a current review against
// safety/infant-checklist.yaml in safety/infant-reviews.yaml. "Offered at baby sizes" means a
// FreeSewing listing with `sizes: babies` or `all`, or a spec or listing in the `babies` category,
// or a spec with `about.sizes: babies` or `all`. A review goes stale when the checklist version,
// the FreeSewing version or the design's options change.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { parse } from 'yaml'
import { loadSpec } from '../lib/load-spec.mjs'

const root = new URL('../', import.meta.url)
const read = (p) => parse(readFileSync(new URL(p, root), 'utf8'))
const checklist = read('safety/infant-checklist.yaml')
const reviews = read('safety/infant-reviews.yaml')
const registry = read('freesewing.yaml').designs
const fsVersion = JSON.parse(readFileSync(new URL('package.json', root), 'utf8')).dependencies['@freesewing/core']
const baby = (sizes, category) => ['babies', 'all'].includes(sizes) || category === 'babies'

// Every design offered at baby sizes, with a way to get its options
const targets = {}
for (const [id, d] of Object.entries(registry)) {
  if (baby(d.sizes, d.category)) targets[id] = { listing: true, load: async () => (await import(d.package))[d.export] }
}
for (const dir of readdirSync(root, { withFileTypes: true })) {
  const spec = new URL(`${dir.name}/spec.yaml`, root)
  if (!dir.isDirectory() || !existsSync(spec)) continue
  const about = parse(readFileSync(spec, 'utf8')).about ?? {}
  if (baby(about.sizes, about.category)) targets[about.id ?? dir.name] = { listing: false, load: async () => loadSpec(spec).Design }
}

test('the checklist is well formed', () => {
  assert.ok(Number.isInteger(checklist.version) && checklist.version > 0, 'version')
  for (const [k, r] of Object.entries(checklist.rules)) {
    assert.ok(['design', 'instruct'].includes(r.kind), `${k}: kind`)
    assert.ok(r.ask && r.sources?.length, `${k}: ask and sources`)
  }
})

test('every review is of something offered at baby sizes', () => {
  for (const id of Object.keys(reviews)) assert.ok(id in targets, `${id}: reviewed but not offered at baby sizes; remove its review`)
})

for (const [id, t] of Object.entries(targets)) {
  test(`${id}: has a current infant safety review`, async () => {
    const r = reviews[id]
    assert.ok(r, `${id} is offered at baby sizes but has no review in safety/infant-reviews.yaml (BUILD_QUEUE S1)`)
    assert.equal(r.checklist, checklist.version, `reviewed against checklist ${r.checklist}; it's now ${checklist.version}: review again`)
    if (t.listing) assert.equal(String(r.freesewing), fsVersion, `reviewed at FreeSewing ${r.freesewing}; it's now ${fsVersion}: review again`)
    assert.ok(r.date && r.by && r.method, 'date, by and method')
    assert.ok(['pass', 'conditions'].includes(r.result), `result: ${r.result}`)

    const rules = Object.keys(checklist.rules)
    for (const k of Object.keys(r.findings ?? {})) assert.ok(rules.includes(k), `findings: no rule ${k}`)
    for (const k of Object.keys(r.instructions ?? {})) assert.ok(rules.includes(k), `instructions: no rule ${k}`)
    assert.ok(r.findings?.cords, 'findings.cords: every review says what it found about cords and ties')
    if (r.result === 'conditions') assert.ok(r.restrict || r.instructions, 'conditions need a restriction or instructions')

    // The options reviewed are the design's options now
    const Design = await t.load()
    const config = new Design().getConfig().options
    const now = Object.keys(config).sort()
    const was = [...(r.options ?? [])].sort()
    const added = now.filter((o) => !was.includes(o))
    const removed = was.filter((o) => !now.includes(o))
    assert.deepEqual({ added, removed }, { added: [], removed: [] }, 'its options changed since the review: look at them, then update `options`')

    // Restrictions name real options and values
    for (const [o, x] of Object.entries(r.restrict ?? {})) {
      assert.ok(now.includes(o), `restrict: no option ${o}`)
      assert.ok(x.why && x.allow?.length, `restrict.${o}: allow and why`)
      if (config[o]?.list) for (const v of x.allow) assert.ok(config[o].list.includes(v), `restrict.${o}: ${v} isn't a value`)
    }

    // An option that suggests a cord or tie must be restricted at baby sizes
    const cord = new RegExp(checklist.cordOptions, 'i')
    for (const o of now.filter((o) => cord.test(o))) {
      assert.ok(r.restrict?.[o], `option ${o} may add a cord or tie: restrict it at baby sizes`)
    }
  })
}
