// Validate design-local construction references against the map and the prose that the page
// publishes. The prose stays in BRIEF.md; this file checks the structured sewing sequence.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { pieces, seams, stitches } from '../chore-coat/pattern-map.mjs'
import { readSpec } from '../lib/load-spec.mjs'

const base = new URL('../chore-coat/', import.meta.url)

export function validateChoreConstruction() {
  const data = parse(readFileSync(new URL('construction.yaml', base), 'utf8'))
  const brief = readFileSync(new URL('BRIEF.md', base), 'utf8')
  const spec = readSpec(new URL('spec.yaml', base))
  if (data.design !== 'chore-coat') throw new Error('construction design must be chore-coat')
  const section = brief.split(/^## Construction[^\n]*\n/m)[1]?.split(/^## /m)[0]
  if (!section) throw new Error('chore-coat brief has no Construction section')
  const prose = [...section.matchAll(/^\d+\. (.+)$/gm)].map((m) => m[1])
  const numbers = new Set(Object.values(pieces))
  if (numbers.size !== Object.keys(pieces).length) throw new Error('duplicate map piece numbers')
  const used = new Set()
  data.steps.forEach((step, i) => {
    if (step.order !== i + 1 || !prose[i]) throw new Error(`construction step ${i + 1} is missing or out of order`)
    for (const number of step.pieces ?? []) {
      if (!numbers.has(number)) throw new Error(`step ${step.order}: unknown piece ${number}`)
      if (!new RegExp(`\\b${number}\\b`).test(prose[i])) throw new Error(`step ${step.order}: piece ${number} missing from brief prose`)
    }
    for (const code of [...(step.seams ?? []), ...(step.placements ?? [])]) {
      if (!seams[code]) throw new Error(`step ${step.order}: unknown map code ${code}`)
      if (!new RegExp(`\\b${code}\\b`).test(prose[i])) throw new Error(`step ${step.order}: code ${code} missing from brief prose`)
      used.add(code)
      if (!(step.stitches ?? []).includes(seams[code][1])) throw new Error(`step ${step.order}: stitch for ${code} does not match map`)
    }
    for (const code of step.stitches ?? []) if (!stitches[code]) throw new Error(`step ${step.order}: unknown stitch ${code}`)
    for (const option of step.whenAny ?? []) if (!spec.options[option]) throw new Error(`step ${step.order}: unknown option ${option}`)
    if ((step.placements ?? []).some((code) => code === 'P6' || code === 'P7') && !(step.whenAny?.length)) throw new Error(`step ${step.order}: pocket step needs an option condition`)
  })
  if (prose.length !== data.steps.length) throw new Error(`construction step count: ${data.steps.length} records, ${prose.length} prose steps`)
  for (const code of Object.keys(seams)) if (!used.has(code)) throw new Error(`map code ${code} is not in construction steps`)
  return data
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const data = validateChoreConstruction()
  console.log(`${data.design}: ${data.steps.length} construction steps validated`)
}
