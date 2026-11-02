// A collar or neck band opens with the garment. Cut on the fold at CB over a back opening, it would
// close across the slit and the neck couldn't pass the head: there the fold goes to the front and the
// CB end is open, with an allowance.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { readSpec, loadSpec } from '../lib/load-spec.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const designs = ['shift-dress', 'shirtwaist-dress', 'kimono-dress', 'work-shirt', 'nightgown', 'nightshirt']

for (const d of designs) {
  const file = fileURLToPath(new URL(`../${d}/spec.yaml`, import.meta.url))
  const finishes = readSpec(file).options.neckFinish.list.filter((f) => f === 'band' || f === 'collar')
  const { Design } = loadSpec(file)
  for (const neckFinish of finishes) {
    for (const opening of ['back', 'front']) {
      for (const set of ['cisFemaleAdult36', 'cisMaleAdult48', 'usdaGirlC5']) {
        test(`${d}: ${neckFinish}, opening at the ${opening}, ${set}`, () => {
          const pattern = new Design({ measurements: sets[set], sa: 10, complete: true, options: { neckFinish, opening } }).draft()
          const store = checkClean(pattern)
          const collar = store.get('coat.collar')
          near(collar.neck, collar.target, 1, 'neck edge')
          const part = Object.entries(pattern.parts[0]).find(([k]) => k.endsWith('.neckBand') || k.endsWith('.collar'))[1]
          assert.ok(!part.hidden, 'drawn')
          const { topLeft, bottomRight } = part.paths.sa.bbox()
          const seam = part.paths.seam.bbox()
          if (opening === 'back') {
            assert.equal(collar.fold, 'front')
            assert.ok(topLeft.x < seam.topLeft.x - 5, 'an allowance on the open CB end')
            assert.ok(bottomRight.x <= seam.bottomRight.x + 1, 'none on the fold') // the offset curve rounds a little
          } else {
            assert.equal(collar.fold, undefined)
            assert.ok(topLeft.x >= seam.topLeft.x - 0.5, 'none on the fold')
            assert.ok(bottomRight.x > seam.bottomRight.x + 5, 'an allowance on the open front end')
          }
        })
      }
    }
  }
}
