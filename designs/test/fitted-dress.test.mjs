import assert from 'node:assert/strict'
import { FittedDress } from '../fitted-dress/src/index.mjs'
import { testDress } from './bodice-checks.mjs'

// The zip notch sits on centre back below the waist, above the skirt's hem
const zip = (pattern) => {
  const back = pattern.parts[0]['fitted-dress.skirtBack']
  const notch = Object.values(back.snippets).find((s) => s.def === 'notch')
  assert.ok(notch && notch.anchor.x === 0 && notch.anchor.y > 0, 'zip notch on centre back')
  assert.ok(notch.anchor.y < back.paths.seam.bbox().bottomRight.y - 50, 'zip ends above the hem')
}

testDress(
  'fitted dress',
  FittedDress,
  'fitted-dress',
  {
    default: {},
    sundress: { neckShape: 'square', neckWiden: 0.12, neckDepth: 0.32, backNeckDepth: 0.25, skirtStyle: 'gathered', skirtLength: 0.5 },
    sheath: { neckDepth: 0.17, skirtStyle: 'straight', skirtLength: 0.4 },
    sleeved: { sleeves: true, neckShape: 'v', neckDepth: 0.4 },
    apart: { neckShape: 'square', neckWiden: 0.15, neckDepth: 0.6, backNeckDepth: 0.4, hemFlare: 0.2, skirtLength: 0.85, seatEase: 0.15, zipLength: 1, gathers: 3 },
  },
  zip
)
