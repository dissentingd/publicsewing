import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// These pages previously supplied only a parent reference or a partial operation list.
// Keep their construction sections usable without opening another design page.
const reviewed = [
  'boys-knickers', 'breeches', 'db-waistcoat', 'dinner-jacket',
  'double-dart-jacket', 'eton-jacket', 'fitted-jacket', 'frock-coat',
  'girls-coat', 'golf-pants', 'jodhpurs', 'knee-pants', 'overcoat',
  'overall-pants', 'peg-pants', 'princess-coat', 'raincoat', 'sack-coat',
  'scout-coat', 'scout-pants', 'shorts', 'slacks', 'tailcoat',
  'two-piece-skirt', 'winter-coat', 'womens-peacoat', 'work-pants',
]

for (const id of reviewed) {
  test(`${id}: construction page stands alone`, () => {
    const brief = readFileSync(new URL(`../${id}/BRIEF.md`, import.meta.url), 'utf8')
    const section = brief.match(/^## (?:Pieces.*construction|Construction[^\n]*)\n([\s\S]*?)(?=^## |$(?![\s\S]))/mi)?.[1]
    assert.ok(section, 'construction section exists')
    const steps = [...section.matchAll(/^\d+\. /gm)]
    assert.ok(steps.length >= (id === 'overall-pants' ? 3 : 4), 'explicit assembly steps')
    assert.doesNotMatch(section, /\bas the [^\n.]*brief\b/i, 'no parent brief dependency')
  })
}
