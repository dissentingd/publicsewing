import assert from 'node:assert/strict'
import { KimonoJacket } from '../kimono-jacket/src/index.mjs'
import { testJacket } from './jacket-checks.mjs'

testJacket('kimono jacket', KimonoJacket, {
  default: {},
  notchLapels: { lapelStyle: 'notch' },
  short: { kimonoLength: 0.5, kimonoHem: 1.4, pockets: false },
  steep: { kimonoAngle: 36, kimonoAngleBack: 26, kimonoDepth: 0.1 },
}, (pattern) => {
  const store = pattern.setStores[0]
  const k = store.get('jacket.kimono')
  // No armhole, and no separate sleeve
  const parts = pattern.parts[0]
  for (const n of ['topsleeve', 'undersleeve']) assert.ok(Object.values(parts).filter((p) => p.name.endsWith(`.${n}`) && p.name.startsWith('kimono')).every((p) => p.hidden), `${n} hidden`)
  // The sleeve has length and width either side
  for (const s of [k.back, k.front]) assert.ok(s.over > 0 && s.under > 0 && s.hem > 0, 'sleeve')
})
