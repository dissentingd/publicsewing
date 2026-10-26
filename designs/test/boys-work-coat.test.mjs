import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BoysWorkCoat } from '../boys-work-coat/src/index.mjs'
import { all as children } from '../sizes/children.mjs'
import { checkCoat } from './coat-checks.mjs'

// Every children's set; the boys' details are the defaults
for (const [name, measurements] of Object.entries(children)) {
  test(`boys' work coat: ${name}`, () => {
    const pattern = new BoysWorkCoat({ measurements, sa: 10 }).draft()
    const store = checkCoat(pattern, 'chorecoat.front')
    assert.equal(store.get('coat.buttons').count, 5, 'five buttons')
    assert.ok(pattern.parts[0]['chorecoat.breastPocket'].hidden, 'no breast pocket')
    assert.ok(store.get('coat.frontEdge').drop > 0, 'front hem drops')
  })
}

// Against Simons' own age-12 draft (breast 29, garment chest 34 1/2", 26 1/2" from the neck
// point to the hem): the nearest USDA boy by chest. A sanity report, not a fidelity gate.
test("boys' work coat is near Simons' age-12 proportions", () => {
  const [, m] = Object.entries(children)
    .filter(([k]) => k.startsWith('usdaBoy'))
    .sort((a, b) => Math.abs(a[1].chest - 737) - Math.abs(b[1].chest - 737))[0]
  const pattern = new BoysWorkCoat({ measurements: m }).draft()
  const f = pattern.parts[0]['chorecoat.front'].points
  const b = pattern.parts[0]['chorecoat.back'].points
  const chest = (4 * f.armhole.x) / 25.4
  const length = b.cbHem.y / 25.4
  assert.ok(Math.abs(chest - 34.5) / 34.5 < 0.05, `garment chest ${chest.toFixed(1)}"`)
  assert.ok(Math.abs(length - 26.5) / 26.5 < 0.08, `length ${length.toFixed(1)}"`)
})
