// Every design's BRIEF.md has the sections CONTRIBUTING.md, Step 9, asks for, so a reviewer can check
// its defaults. Briefs written before this test are listed, with what they lack, in
// brief-exemptions.json: remove an entry once the brief has that section. New designs get no exemption.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'

const root = new URL('../', import.meta.url)
const exempt = JSON.parse(readFileSync(new URL('brief-exemptions.json', import.meta.url), 'utf8'))

const checks = {
  source: (b) => /\*\*Source:?\*\*|^## Source/m.test(b),
  status: (b) => /status/i.test(b),
  threadloop: (b) => /threadloop/i.test(b),
  table: (b) => /^\|[ -]*-{3}/m.test(b), // the source-to-option mapping table
  changes: (b) => /^## .*(change|isn.t modelled|differences|adaptation)/im.test(b),
  pieces: (b) => /^## .*piece/im.test(b),
  construction: (b) => /^## .*(construction|sewing|order)/im.test(b),
}

const designs = readdirSync(root).filter((d) => existsSync(new URL(`${d}/spec.yaml`, root)))

for (const d of designs) {
  test(`${d}: BRIEF.md has every section`, () => {
    const file = new URL(`${d}/BRIEF.md`, root)
    assert.ok(existsSync(file), 'BRIEF.md exists')
    const brief = readFileSync(file, 'utf8')
    const skip = exempt[d] ?? []
    const missing = Object.keys(checks).filter((k) => !skip.includes(k) && !checks[k](brief))
    assert.deepEqual(missing, [], `missing: ${missing.join(', ')} (CONTRIBUTING.md, Step 9)`)
    const done = skip.filter((k) => checks[k] && checks[k](brief))
    assert.deepEqual(done, [], `now has ${done.join(', ')}: remove it from test/brief-exemptions.json`)
  })
}

// Armstrong's, Aldrich's and CBSE's books are in copyright: their designs' public text is our own (CONTRIBUTING.md, Step 9)
for (const d of designs) {
  const spec = readFileSync(new URL(`${d}/spec.yaml`, root), 'utf8')
  const source = spec.match(/^  source:.*$/m)?.[0] ?? ''
  if (!/Joseph-Armstrong|Winifred Aldrich|Central Board of Secondary Education/.test(source)) continue
  test(`${d}: public text from an in-copyright source is our own`, () => {
    const brief = readFileSync(new URL(`${d}/BRIEF.md`, root), 'utf8')
    assert.match(brief, /^## What we took/m)
    assert.doesNotMatch(brief, /^## What the source/m)
    assert.doesNotMatch(brief + source, /\bPDF pp?\b|\bpp?\. ?\d/, 'no page references')
  })
}

test('brief exemptions name real designs', () => {
  assert.deepEqual(Object.keys(exempt).filter((d) => !designs.includes(d)), [])
})
