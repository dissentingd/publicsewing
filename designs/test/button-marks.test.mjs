// Every button a coat places (`coat.buttons`) is marked on a piece that is drawn: a mark left on a
// hidden base piece never reaches the pattern.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { loadSpec } from '../lib/load-spec.mjs'
import { sets } from './coat-checks.mjs'

const root = new URL('../', import.meta.url)
const designs = readdirSync(root).filter((d) => existsSync(new URL(`${d}/spec.yaml`, root)))

for (const d of designs) {
  const { Design } = loadSpec(fileURLToPath(new URL(`${d}/spec.yaml`, root)))
  const preview = Design.designConfig.data?.preview ?? 'cisMaleAdult38'
  test(`${d}: button marks on the drawn pieces`, () => {
    const pattern = new Design({ measurements: sets[preview], sa: 10, complete: true }).draft()
    const placed = pattern.setStores[0].get('coat.buttons', null)
    if (!placed) return
    let marks = 0
    for (const part of Object.values(pattern.parts[0])) {
      // By name: placeButtons names its own `button<row>_<n>`; a sleeve vent's or a cuff's are others
      if (!part.hidden) marks += Object.keys(part.snippets).filter((s) => /^button\d+_\d+$/.test(s)).length
    }
    assert.equal(marks, placed.count * placed.rows.length)
  })
}
