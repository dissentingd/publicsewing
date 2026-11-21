import { test } from 'node:test'
import { mappedDesigns, validateConstruction } from '../tools/validate-construction.mjs'

for (const design of mappedDesigns()) {
  test(`${design}: construction references resolve`, () => {
    validateConstruction(design)
  })
}
