import assert from 'node:assert/strict'
import { PrincessDress } from '../princess-dress/src/index.mjs'
import { testPrincess } from './bodice-checks.mjs'
import { near } from './coat-checks.mjs'

testPrincess('princess dress', PrincessDress, 'princess-dress', {
  shoulder: {},
  armhole: { dartPosition: 'armhole' },
  apart: { dartPosition: 'armhole', dressLength: 0.8, princessFlare: 0.15, sideFlare: 0.2, zipLength: 1 },
}, (pattern) => {
  const store = pattern.setStores[0]
  for (const side of ['back', 'front']) {
    near(store.get(`princessDress.${side}Inside`).lowerPrincess, store.get(`princessDress.${side}Outside`).lowerPrincess, 0.5, `${side} lower princess seam`)
  }
  near(store.get('princessDress.backOutside').lowerSide, store.get('princessDress.frontOutside').lowerSide, 0.5, 'lower side seam')
  for (const name of ['backInside', 'backOutside', 'frontInside', 'frontOutside']) {
    const part = pattern.parts[0][`princess-dress.${name}`]
    const path = part.paths[name === 'backInside' ? 'insideSeam' : name === 'backOutside' ? 'outsideSeam' : 'seam']
    const ends = path.divide().map((segment) => segment.end())
    assert.ok(['princessHip', 'outerHip'].every((point) => ends.some((end) => end.sitsRoughlyOn(part.points[point]))), `${name} continues to the hem`)
  }
  const back = pattern.parts[0]['princess-dress.backInside']
  assert.ok(back.snippets.zipEnd, 'zip end notch marked at centre back')
  const cut = store.cutlist['princess-dress.backInside']
  assert.equal(cut.materials.fabric[0].cut, 2, 'centre back is seamed')
  assert.equal(cut.materials.fabric[0].onFold, false, 'centre back is not folded')
})
