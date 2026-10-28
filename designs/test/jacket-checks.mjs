// Checks every jacket on lib/jacket.mjs (princess or box body) must pass at every measurement set.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sets, checkClean, near } from './coat-checks.mjs'

export function checkJacket(pattern) {
  const store = checkClean(pattern)
  const s = store.get('jacket.seams')
  // Princess jackets: each seam pair; box bodies: the neck dart's legs
  if (s.backPrincess) near(s.backPrincess[0], s.backPrincess[1], 0.5, 'back princess seam')
  if (s.frontPrincess) near(s.frontPrincess[0], s.frontPrincess[1], 0.5, 'front princess seam')
  if (s.dart) near(s.dart[0], s.dart[1], 0.5, 'neck dart legs')
  // A side seam, or (with an under-arm panel) the two seams either side of that panel
  if (s.underarmBack) {
    near(s.underarmBack[0], s.underarmBack[1], 0.5, 'back under-arm seam')
    near(s.underarmFront[0], s.underarmFront[1], 0.5, 'front under-arm seam')
  } else near(s.sideBack, s.sideFront, 0.5, 'side seams')
  near(s.shoulderBack, s.shoulderFront, 0.5, 'shoulder seams')
  // The two-piece sleeve's cap fits the armhole within its ease (sleevecapEase, 1-2%)
  const a = store.get('jacket.armhole')
  const cap = store.get('library.twoPartSleeve.sleevecapLength')
  const arm = a.back + a.front
  assert.ok(cap >= arm - 1 && cap <= arm * 1.05, `sleeve cap ${cap.toFixed(1)} vs armhole ${arm.toFixed(1)}`)
  const collar = store.get('coat.collar')
  near(collar.neck, collar.target, 1, 'collar vs neckline')
  // The lapel reaches past the crease, and the flare never narrows the seat
  const f = store.get('jacket.front')
  assert.ok(f.B.y > f.G.y && f.P.y < f.B.y, 'lapel runs up from the break')
  assert.ok(store.get('jacket.flare') >= 0, 'flare')
  // Set-in pockets clear the facing, the side seam and the hem; buttons sit on the underlap
  for (const [id, q] of Object.entries(store.get('jacket.pockets') ?? {})) {
    assert.ok(q.w > 0.5 * q.flap, `${id} pocket mouth ${q.w.toFixed(1)}`)
    assert.ok(q.x > f.facingX, `${id} pocket clear of the facing`)
    assert.ok((q.ex ?? q.x + q.w) < q.side, `${id} pocket clear of the side seam`)
    assert.ok(Math.max(q.y, q.ey ?? q.y) + q.bag < f.hemY, `${id} pocket bag above the hem`)
  }
  // Welt pockets: the parts either side of a seam add up to the welt, which is long enough
  for (const [id, w] of Object.entries(store.get('jacket.welts') ?? {})) {
    near(w.front + w.side, w.len, 0.5, `${id} welt parts`)
    assert.ok(w.len > 2 * w.welt, `${id} welt length ${w.len.toFixed(1)}`)
  }
  // The back-neck facing and the front facing meet on the shoulder
  if (s.facingShoulder) near(s.facingShoulder[0], s.facingShoulder[1], 0.5, 'facing shoulders')
  if (f.holeX !== undefined) assert.ok(f.holeX > f.edgeX && f.holeX <= f.cfx && f.buttonX >= f.cfx, 'buttons')
  return store
}

/** `extra(pattern)`: a design's own checks, after the shared ones */
export function testJacket(label, Design, variants = { default: {} }, extra) {
  for (const [v, options] of Object.entries(variants)) {
    for (const [name, measurements] of Object.entries(sets)) {
      test(`${label} (${v}): ${name}`, () => {
        const pattern = new Design({ measurements, sa: 10, options }).draft()
        checkJacket(pattern)
        if (extra) extra(pattern)
      })
    }
  }
}
