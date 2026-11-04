import assert from 'node:assert/strict'
import { ButtonMiddy } from '../button-middy/src/index.mjs'
import { testCoat, near } from './coat-checks.mjs'

testCoat(
  'button-on middy',
  ButtonMiddy,
  'barberscoat.front',
  {
    default: {},
    plain: { buttons: 4, collarPoint: 0, collarWidth: 0.2, beltWidth: 0.05 },
    longer: { lengthBelowWaist: 1, frontDrop: 0, seatEase: 0.3 },
  },
  (pattern) => {
    const parts = pattern.parts[0]
    const store = pattern.setStores[0]
    const { measurements } = pattern.settings[0]
    const front = parts['barberscoat.front'].points
    const back = parts['barberscoat.back'].points
    const ext = store.get('coat.frontEdge').ext
    // The hem is fuller than the belt it's taken into, which fits the waist and laps by the stands
    const belt = store.get('polygon.belt')
    near(belt.width, measurements.waist + 2 * ext, 0.01, 'belt length')
    assert.ok(2 * (front.hem.x + back.hem.x) >= measurements.waist, 'hem takes up into the belt')
    // The buttons stop above the front hem
    const buttons = Object.values(parts['barberscoat.front'].snippets).filter((s) => s.def === 'button').map((s) => s.anchor.y)
    assert.ok(Math.max(...buttons) < front.edgeHem.y - 5, 'buttons above the hem')
    // The sleeve's fullness goes into the cuff
    const sleeve = store.get('coat.sleeve')
    assert.ok(sleeve.slit > 0, 'sleeve opening')
    assert.ok(sleeve.hem >= store.get('coat.cuff').length, 'sleeve hem pleats into the cuff')
    // The stand collar's replaced: only one collar, ending short of the front edge
    const collar = store.get('coat.collar')
    assert.ok(collar.target < store.get('coat.back').neck + store.get('coat.front').neck + ext, 'collar short of the edge')
  },
)
