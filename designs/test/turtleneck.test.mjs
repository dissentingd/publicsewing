import assert from 'node:assert/strict'
import { Turtleneck } from '../turtleneck/src/index.mjs'
import { testKnit } from './knit-checks.mjs'

// The collar is cut from the whole neck opening, and both pass over the head: the rib collar
// stretching at most 100% (1x1 rib stretches about that far), the jersey neck edge it's sewn to at
// most 75%. Children's heads are big for their necks: Girls 1B needs 83% and 65% (BRIEF.md)
const collar = (pattern) => {
  const store = pattern.setStores[0]
  const r = store.get('rib.collar')
  const opening = 2 * (store.get('neckSizeBack') + store.get('neckSizeFront'))
  assert.ok(Math.abs(r.edge - opening) < 0.01, 'collar cut from the neck opening')
  const { head, neck } = pattern.settings[0].measurements
  assert.ok(r.length > neck, `collar ${r.length.toFixed(0)} closes round the neck ${neck.toFixed(0)}`)
  assert.ok(head / r.length - 1 <= 1, `collar stretches ${(100 * (head / r.length - 1)).toFixed(0)}% over the head`)
  assert.ok(head / r.edge - 1 <= 0.75, `neck edge stretches ${(100 * (head / r.edge - 1)).toFixed(0)}% over the head`)
}

testKnit(
  'turtleneck',
  Turtleneck,
  'turtleneck',
  {
    default: {},
    plain: { useCuffRibbing: true, useWaistRibbing: true },
    mockNeck: { collarHeight: 0.12, sleeveLength: 0.2 },
    apart: { collarHeight: 0.45, collarStretch: 0.25, necklineDepth: 0.5, necklineWidth: 0.3, length: 'hips', sleeves: false },
  },
  collar
)
