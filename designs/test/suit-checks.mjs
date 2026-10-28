// Checks every flat-cut suit (lib/flat.mjs) must pass at every measurement set.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sets, checkClean, near } from './coat-checks.mjs'

export function checkSuit(pattern) {
  const store = checkClean(pattern)
  const m = pattern.settings[0].measurements
  const body = store.get('suit.body')
  const sleeve = store.get('suit.sleeve')
  // Seams that sew together
  near(body.shoulder.front, body.shoulder.back, 0.5, 'shoulder seams')
  assert.ok(body.shoulder.front > 0, 'shoulder seam has a length')
  near(body.armhole, sleeve.top + 2 * sleeve.gusset, 1, 'armhole vs sleeve top and gusset')
  near(sleeve.underarm[0], sleeve.underarm[1], 0.5, 'sleeve underarm seam')
  near(body.inseam.slit, body.inseam.cf, 0.5, 'inseam')
  const g = store.get('suit.crotchGusset').side
  near(body.crotchGusset.slit, g, 0.5, 'crotch gusset, back')
  near(body.crotchGusset.cf, g, 0.5, 'crotch gusset, front')
  near(store.get('suit.band').length, body.neckline, 0.5, 'collar band vs neckline')
  near(store.get('suit.facing').length, body.opening, 0.5, 'facing vs opening')
  // It goes on and closes: the neck buttons round the neck, the foot passes the hem, the
  // opening ends above the crotch, the leg clears the thigh where the inseam starts
  assert.ok(body.neckline >= m.neck * 1.02, `neckline ${body.neckline.toFixed(0)} vs neck ${m.neck}`)
  assert.ok(body.legHem >= m.heel * 1.05, `leg hem ${body.legHem.toFixed(0)} vs heel ${m.heel}`)
  assert.ok(body.frontRise > 0, 'opening ends above the crotch')
  assert.ok(body.legTop >= m.upperLeg * 0.85, `leg ${body.legTop.toFixed(0)} vs upper leg ${m.upperLeg}`)
  assert.ok(body.inseam.slit > 0 && body.slit < body.crotch, 'armholes and legs')
  // Pockets sit on the fronts, clear of the side, the armhole and the crotch
  const pockets = store.get('suit.pieces').pockets
  for (const [k, p] of Object.entries(pockets)) {
    assert.ok(p.x + p.w < body.sides.left, `${k} pocket clears the side`)
    assert.ok(p.y + p.h < body.length - body.inseam.cf - g, `${k} pocket clears the crotch`)
  }
  return store
}

export function testSuit(label, Design, variants = { default: {} }) {
  for (const [v, options] of Object.entries(variants)) {
    for (const [name, measurements] of Object.entries(sets)) {
      test(`${label} (${v}): ${name}`, () => {
        checkSuit(new Design({ measurements, sa: 10, options }).draft())
      })
    }
  }
}
