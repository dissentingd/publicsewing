import assert from 'node:assert/strict'
import { KimonoDress } from '../kimono-dress/src/index.mjs'
import { testYoke } from './yoke-checks.mjs'
import { near } from './coat-checks.mjs'

// The sleeve is cut in one: front and back's overarm and underarm seams sew together (the yoke
// checks compare the underarm, as the bodice's side seam), and the sleeve's hem goes round the arm
const sleeve = (pattern) => {
  const store = pattern.setStores[0]
  const [b, f] = [store.get('yoke.back'), store.get('yoke.front')]
  near(b.kimono.over, f.kimono.over, 0.5, 'overarm seam')
  const m = pattern.settings[0].measurements
  assert.ok(b.kimono.hem + f.kimono.hem > m.biceps, 'the sleeve goes round the arm')
  // Hem's under corner clear of the side seam, on both sides
  for (const k of ['backBase', 'frontBase']) {
    const q = pattern.parts[0][`kimono-dress.${k}`].points
    assert.ok(q.kimonoHem.x > q.kimonoUnder.x, `${k} hem clears the side seam`)
  }
}

testYoke('kimono dress', KimonoDress, {
  default: {},
  long: { kimonoLength: 0.6, kimonoAngle: 45, buttons: 7, skirtLength: 0.85 },
  back: { opening: 'back', neckFinish: 'binding', kimonoLength: 0.15 },
}, sleeve)
