import assert from 'node:assert/strict'
import { BarbersCoat } from '../barbers-coat/src/index.mjs'
import { testCoat, near } from './coat-checks.mjs'

// Open neck: the back neck facing meets the front facings at the shoulder
function neckFacings(pattern) {
  const store = pattern.setStores[0]
  if (!store.get('coat.frontEdge').vNeck) return
  const back = store.get('coat.backNeckFacing')
  const front = store.get('coat.facing')
  assert.ok(back && front.shoulder, 'facings drafted')
  near(front.shoulder, back.shoulder, 0.5, 'facings meet at the shoulder')
}

testCoat('barber\'s coat', BarbersCoat, 'barberscoat.front', {
  default: {},
  open: { neckStyle: 'open', hemCurve: 0.5, pocketShape: 'chamfered' },
}, neckFacings)
