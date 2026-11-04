// A tester has to be able to report on every design: each one is in the issue form's dropdown.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'

const root = new URL('../', import.meta.url)

test('the muslin report lists every design', () => {
  const form = readFileSync(new URL('../.github/ISSUE_TEMPLATE/muslin-report.yml', root), 'utf8')
  const designs = readdirSync(root).filter((d) => existsSync(new URL(`${d}/spec.yaml`, root)))
  assert.ok(designs.length > 0, 'found the designs')
  assert.deepEqual(designs.filter((d) => !form.includes(`(${d})`)), [])
})
