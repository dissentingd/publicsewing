import assert from 'node:assert/strict'
import { Cardigan } from '../cardigan/src/index.mjs'
import { testKnit } from './knit-checks.mjs'

// The front is open: allowance down centre front and round the V. The front band runs from the
// foot of the hem band up each front (flat) and round the neck (stretched), and its buttons fit
const band = (pattern) => {
  const store = pattern.setStores[0]
  const f = store.get('knit.front')
  const b = store.get('knit.frontBand')
  const front = pattern.parts[0]['cardigan.front']
  const sa = pattern.settings[0].sa
  const box = front.paths.sa.bbox()
  assert.ok(box.topLeft.x <= -sa + 0.5, `allowance down centre front (${box.topLeft.x.toFixed(1)})`)
  assert.ok(box.topLeft.y <= front.points.neck.y - sa + 0.5, 'allowance round the neck')
  const { options = {} } = pattern.settings[0]
  const ribbed = options.useWaistRibbing ?? true
  assert.ok(Math.abs(b.front - f.edge - (ribbed ? store.get('ribbingHeight') : 0)) < 0.01, 'band from the foot of the hem band')
  const stretch = options.collarStretch ?? 0.08
  assert.ok(Math.abs(b.neck - (f.neck + store.get('neckSizeBack')) * (1 - stretch)) < 0.01, 'band round half the neck')
  assert.ok(Math.abs(b.length - 2 * (b.front + b.neck)) < 0.01, 'band length')
  // all the buttons asked for, or as many as fit
  assert.ok(b.buttons.length >= 1 && b.buttons.length <= (options.buttons ?? 5), `${b.buttons.length} buttons`)
  const height = pattern.settings[0].measurements.neck * (options.frontBandWidth ?? 0.07)
  for (let i = 1; i < b.buttons.length; i++) assert.ok(b.buttons[i] - b.buttons[i - 1] >= height - 0.01, `buttons ${(b.buttons[i] - b.buttons[i - 1]).toFixed(0)} mm apart`)
  // vNeckDepth is at most 85% of the neck point to the front waist
  assert.ok(f.vY < front.points.cfWaist.y, 'the V ends above the waist')
}

testKnit(
  'cardigan',
  Cardigan,
  'cardigan',
  {
    default: {},
    plain: { useCuffRibbing: false, useWaistRibbing: false },
    apart: { vNeckDepth: 0.85, frontBandWidth: 0.1, collarStretch: 0.2, buttons: 8, chestEase: 0.25, length: 'hips', sleeves: false },
    close: { vNeckDepth: 0.3, frontBandWidth: 0.04, buttons: 3, chestEase: 0 },
  },
  band
)
