// Checks every yoke garment (lib/yoke.mjs) must pass at every measurement set.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sets, checkClean, near } from './coat-checks.mjs'

export function checkYoke(pattern) {
  const store = checkClean(pattern)
  const b = store.get('yoke.back')
  const f = store.get('yoke.front')
  // Body gathers into the yoke: its top edge is the yoke seam times the gathering ratio
  for (const s of [b, f]) {
    assert.ok(s.bodyTop >= s.yokeSeam - 0.01, 'body at least as wide as the yoke seam')
    assert.ok(s.hemY > s.yokeY + 50, 'body below the yoke')
  }
  near(b.side, f.side, 0.5, 'side seams (body)')
  near(b.yokeSide, f.yokeSide, 0.5, 'side seams (bodice)')
  near(b.shoulder, f.shoulder, 0.5, 'shoulder seams')
  near(b.yokeY, f.yokeY, 0.01, 'yoke seam at the same level')
  const sl = store.get('yoke.sleeve', null)
  if (sl) {
    near(sl.cap, sl.armhole, 3, 'sleeve cap vs armhole')
    near(sl.underarm[0], sl.underarm[1], 0.5, 'sleeve underarm seam')
    assert.ok(sl.hem >= sl.band * 0.95, 'sleeve hem gathers into its band')
  }
  const collar = store.get('coat.collar', null)
  if (collar) near(collar.neck, collar.target, 1, 'neck band vs neckline')
  return store
}

export function testYoke(label, Design, variants = { default: {} }, extra) {
  for (const [v, options] of Object.entries(variants)) {
    for (const [name, measurements] of Object.entries(sets)) {
      test(`${label} (${v}): ${name}`, () => {
        const pattern = new Design({ measurements, sa: 10, options }).draft()
        checkYoke(pattern)
        if (extra) extra(pattern)
      })
    }
  }
}
