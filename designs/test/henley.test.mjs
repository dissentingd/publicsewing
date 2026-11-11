import assert from 'node:assert/strict'
import { Henley } from '../henley/src/index.mjs'
import { testKnit } from './knit-checks.mjs'

// The placket fits the front and its buttons fit the placket; the band or collar runs round the
// whole neck; and the neck with the placket open passes over the head, the knit stretching at most
// 25% (Girls 1B, the tightest, needs 12% at the defaults)
const placket = (pattern) => {
  const store = pattern.setStores[0]
  const p = store.get('knit.placket')
  const front = pattern.parts[0]['henley.front'].points
  assert.ok(p.width / 2 < front.hps.x, 'the placket box inside the neckline')
  assert.ok(p.bottom < front.cfHem.y - p.width, 'the placket ends above the hem')
  const ys = store.get('knit.placketButtons')
  const { buttons } = pattern.settings[0].options ?? {}
  // all the buttons asked for, or as many as fit
  assert.ok(ys.length >= 1 && ys.length <= (buttons ?? 3), `${ys.length} buttons`)
  if (ys.length < (buttons ?? 3)) assert.ok(p.length - 2 * p.width < (ys.length) * p.width / 2, 'one more would fit')
  // at least half the placket's width apart, room for a button the placket can carry
  for (let i = 1; i < ys.length; i++) assert.ok(ys[i] - ys[i - 1] >= p.width / 2 - 0.01, `buttons ${(ys[i] - ys[i - 1]).toFixed(0)} mm apart`)
  const opening = 2 * (store.get('neckSizeBack') + store.get('neckSizeFront'))
  const band = store.get('rib.neckBand', null) ?? store.get('rib.collar')
  assert.ok(Math.abs(band.edge - opening) < 0.01, 'the band or collar cut from the neck opening')
  const { head } = pattern.settings[0].measurements
  assert.ok((opening + 2 * p.length) * 1.25 >= head, 'over the head with the placket open')
}

testKnit(
  'henley',
  Henley,
  'henley',
  {
    default: {},
    plain: { buttons: 2, sleeveLength: 0.2 },
    polo: { neckFinish: 'collar', sleeveLength: 0.2, buttons: 2, placketDepth: 0.25 },
    rugby: { neckFinish: 'collar', collarHeight: 0.22, placketDepth: 0.4, placketWidth: 0.1, useCuffRibbing: true },
    apart: { placketDepth: 0.55, placketWidth: 0.12, buttons: 6, bandHeight: 0.08, collarStretch: 0.2, length: 'hips', sleeves: false },
  },
  placket
)
