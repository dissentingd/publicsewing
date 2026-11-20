import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { ChoreCoat } from '../chore-coat/src/index.mjs'
import { BoysWorkCoat } from '../boys-work-coat/src/index.mjs'
import { mapFor, resolve } from '../lib/pattern-map.mjs'
import { measurementSet, render } from '../tools/render.mjs'
import { exportFiles } from '../lib/export/index.mjs'
import { drapeMap } from '../tools/drape-export.mjs'
import { validateConstruction } from '../tools/validate-construction.mjs'
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

for (const set of ['cisMaleAdult38', 'usdaBoyC5', 'stoutMale48']) {
  for (const [label, options] of [['default', {}], ['without pockets', { breastPocket: false, lowerPockets: false }]]) {
    test(`chore-coat map is in all rendered formats: ${set}, ${label}`, () => {
      const measurements = measurementSet(set)
      const pattern = new ChoreCoat({ measurements, options, sa: 10, complete: true }).draft()
      const marks = resolve(pattern, mapFor(ChoreCoat))
      assert.ok(marks.length >= 19)
      const preview = render(ChoreCoat, set, { options }).svg
      // The CLI passes the folder name; the browser editor passes the design id.
      const files = exportFiles(ChoreCoat, { measurements, options, sa: 10 }, { name: 'chorecoat', size: set })
      for (const output of [preview, files.svg, files.pdf, files.darkPdf]) {
        assert.ok(output.includes('Seam and stitch key'))
        assert.equal(output.includes('P6 breast-pocket placement'), label === 'default')
        assert.equal(output.includes('P7 lower-pocket placement'), label === 'default')
        assert.ok(output.replaceAll('\\(', '(').replaceAll('\\)', ')').includes('A shoulder (FF)'))
      }
      assert.ok(preview.includes('class="pattern-map-code"'))
      assert.ok(files.svg.includes('class="map-code"'))
      assert.ok(files.pdf.startsWith('%PDF-1.6'))
      for (const pdf of [files.pdf, files.darkPdf]) {
        assert.ok(pdf.includes('(A) Tj'), 'a seam code is drawn on the PDF, not only listed in its key')
        assert.equal(pdf.includes('(P6) Tj'), label === 'default')
      }
    })
  }
}

test('construction references and 3D map agree with drafted closure and pocket marks', () => {
  assert.equal(validateConstruction('chore-coat').steps.length, 8)
  const drapeSeams = parse(readFileSync(new URL('../drape/coat-shell.yaml', import.meta.url), 'utf8')).seams
  for (const [label, options] of [['default', {}], ['without pockets', { breastPocket: false, lowerPockets: false }]]) {
    const pattern = new ChoreCoat({ measurements: measurementSet('cisMaleAdult38'), options, sa: 0 }).draft()
    const map = drapeMap(pattern, mapFor(ChoreCoat), { pieces: { back: [], front: [], sleevePlus: [], sleeveMinus: [] } })
    assert.equal(map.closures.filter((mark) => mark.kind === 'button').length, 4)
    assert.equal(map.closures.filter((mark) => mark.kind === 'buttonhole').length, 4)
    assert.deepEqual(Object.keys(map.placements), label === 'default' ? ['P6', 'P7'] : [])
    assert.ok(map.seams.C.anchors.some((mark) => mark.sourcePart === 'chorecoat.sleeve'))
    for (const seam of Object.values(map.seams)) if (seam.drapeSeam) assert.ok(drapeSeams[seam.drapeSeam])
  }
})

test("the boys' work coat inherits the chore coat's map through extends", () => {
  const map = mapFor(BoysWorkCoat)
  assert.deepEqual(Object.keys(map.codes), Object.keys(mapFor(ChoreCoat).codes))
  const pattern = new BoysWorkCoat({ measurements: measurementSet('usdaBoyC9'), sa: 10, complete: true }).draft()
  const marks = resolve(pattern, map)
  // No breast pocket by default; the lower pockets and five buttons are drafted
  assert.ok(!marks.some((m) => m.code === 'P6'))
  assert.ok(marks.some((m) => m.code === 'P7'))
  assert.ok(marks.every((m) => pattern.parts[0][m.part]))
})
