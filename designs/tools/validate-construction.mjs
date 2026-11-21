// Validate a design's construction.yaml (the sewing order) against its spec's pattern map and the
// numbered steps its BRIEF.md publishes. The prose stays in the brief; this checks the references.
// Usage: node tools/validate-construction.mjs [design ...]   (default: every design with both a
// pattern map and a construction.yaml)
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { readSpec } from '../lib/load-spec.mjs'

const root = new URL('../', import.meta.url)

/** Designs whose own folder has construction.yaml and whose spec (or a parent's) has a map */
export function mappedDesigns() {
  return readdirSync(root).filter((d) => existsSync(new URL(`${d}/construction.yaml`, root)) &&
    existsSync(new URL(`${d}/spec.yaml`, root)) && readSpec(new URL(`${d}/spec.yaml`, root)).patternMap)
}

export function validateConstruction(design) {
  const base = new URL(`${design}/`, root)
  const data = parse(readFileSync(new URL('construction.yaml', base), 'utf8'))
  const brief = readFileSync(new URL('BRIEF.md', base), 'utf8')
  const spec = readSpec(new URL('spec.yaml', base))
  const map = spec.patternMap
  if (!map) throw new Error(`${design}: spec has no patternMap`)
  if (data.design !== design) throw new Error(`construction design must be ${design}`)
  const section = brief.split(/^## Construction[^\n]*\n/m)[1]?.split(/^## /m)[0]
  if (!section) throw new Error(`${design} brief has no Construction section`)
  const prose = [...section.matchAll(/^\d+\. (.+)$/gm)].map((m) => m[1])
  // A merged map uses null to remove a parent's piece; it is not a printed number.
  const printedNumbers = Object.values(map.pieces).filter((number) => number != null)
  const numbers = new Set(printedNumbers)
  if (numbers.size !== printedNumbers.length) throw new Error('duplicate map piece numbers')
  const codes = map.codes
  const used = new Set()
  data.steps.forEach((step, i) => {
    if (step.order !== i + 1 || !prose[i]) throw new Error(`construction step ${i + 1} is missing or out of order`)
    for (const number of step.pieces ?? []) {
      if (!numbers.has(number)) throw new Error(`step ${step.order}: unknown piece ${number}`)
      if (!new RegExp(`\\b${number}\\b`).test(prose[i])) throw new Error(`step ${step.order}: piece ${number} missing from brief prose`)
    }
    for (const code of [...(step.seams ?? []), ...(step.placements ?? [])]) {
      if (!codes[code]) throw new Error(`step ${step.order}: unknown map code ${code}`)
      if (!new RegExp(`\\b${code}\\b`).test(prose[i])) throw new Error(`step ${step.order}: code ${code} missing from brief prose`)
      used.add(code)
      if (!(step.stitches ?? []).includes(codes[code].stitch)) throw new Error(`step ${step.order}: stitch for ${code} does not match map`)
    }
    for (const code of step.stitches ?? []) if (!map.stitches[code]) throw new Error(`step ${step.order}: unknown stitch ${code}`)
    for (const option of step.whenAny ?? []) if (!spec.options[option]) throw new Error(`step ${step.order}: unknown option ${option}`)
    // An optional anchor can also mean a mark or panel is absent at some sizes.
    // It does not by itself make the sewing operation conditional.
  })
  if (prose.length !== data.steps.length) throw new Error(`construction step count: ${data.steps.length} records, ${prose.length} prose steps`)
  for (const code of Object.keys(codes)) if (codes[code] && !used.has(code)) throw new Error(`map code ${code} is not in construction steps`)
  return data
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const designs = process.argv.slice(2)
  for (const design of designs.length ? designs : mappedDesigns()) {
    const data = validateConstruction(design)
    console.log(`${data.design}: ${data.steps.length} construction steps validated`)
  }
}
