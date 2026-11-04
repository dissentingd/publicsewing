import assert from 'node:assert/strict'
import { PaintersJacket } from '../painters-jacket/src/index.mjs'
import { testCoat } from './coat-checks.mjs'

testCoat('painter\'s jacket', PaintersJacket, 'barberscoat.front', {
  default: {},
  plain: { breastPocket: false, lowerPockets: false },
  variant: { lengthBelowWaist: 1.8, buttons: 6, pocketShape: 'square', cuffDepth: 0.5 },
}, (pattern) => {
  const parts = pattern.parts[0]
  assert.ok(parts['painters-jacket.cuff']?.paths?.seam, 'separate cuff')
  assert.ok(parts['painters-jacket.sleevePlacket']?.paths?.seam, 'sleeve placket')
})
