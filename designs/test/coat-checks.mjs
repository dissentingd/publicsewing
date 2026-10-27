// Checks every PublicSewing coat must pass at every measurement set: it drafts cleanly, its
// seam allowances lie outside the seams, and the seams that sew together match.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as models from '@freesewing/models'
import { all as children } from '../sizes/children.mjs'

// Stout figures (Simons' Diagrams VI, XI, XXII): waist at or above the breast
const stout = (m, waistOverChest) => ({ ...m, waist: m.chest + waistOverChest, hips: m.chest + waistOverChest, seat: Math.max(m.seat, m.chest + waistOverChest) })
export const stoutSets = {
  stoutMale42: stout(models.cisMaleAdult42, 0),
  stoutMale48: stout(models.cisMaleAdult48, 75),
  stoutFemale44: stout(models.cisFemaleAdult44, 40),
}

// Every adult set FreeSewing ships, three stout figures, and all 75 children's sets
export const sets = {
  ...Object.fromEntries(Object.entries(models).filter(([k]) => /^cis(Fe)?maleAdult\d+$/i.test(k))),
  ...stoutSets,
  ...children,
}

export const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a.toFixed(1)} vs ${b.toFixed(1)}`)

/** Drafts with no errors or warnings, every point a number, every allowance outside its seam */
export function checkClean(pattern) {
  const store = pattern.setStores[0]
  assert.deepEqual(store.logs.error, [], 'errors')
  assert.deepEqual(store.logs.warn, [], 'warnings')
  for (const [p, part] of Object.entries(pattern.parts[0])) {
    for (const [id, pt] of Object.entries(part.points)) {
      assert.ok(Number.isFinite(pt.x) && Number.isFinite(pt.y), `${p}.${id} is not a number`)
    }
    if (part.hidden || !part.paths.seam || !part.paths.sa) continue
    const a = part.paths.seam.bbox()
    const b = part.paths.sa.bbox()
    const outside =
      b.topLeft.x <= a.topLeft.x + 0.01 &&
      b.bottomRight.x >= a.bottomRight.x - 0.01 &&
      b.bottomRight.y >= a.bottomRight.y - 0.01
    assert.ok(outside, `${p}: seam allowance is not outside the seam`)
  }
  return store
}

export function checkCoat(pattern, frontName) {
  const store = checkClean(pattern)
  const get = (k) => store.get(`coat.${k}`)
  const [bk, fr] = ['back', 'front'].map(get)
  // The side seam runs down from the armhole: waist, seat (if the coat reaches it), hem
  const fp = pattern.parts[0][frontName].points
  assert.ok(fp.armhole.y < fp.sideWaist.y && fp.sideWaist.y < fp.seat.y + 0.01 && fp.seat.y <= fp.hem.y + 0.01, 'side seam runs downward')
  near(fr.side, bk.side, 0.5, 'side seams')
  near(fr.shoulder, bk.shoulder, 0.5, 'shoulder seams')
  // (no collar on an open-necked coat)
  const collar = store.get('coat.collar', null)
  if (collar) near(collar.neck, collar.target, 1, 'collar neck edge vs neckline')
  const raglan = store.get('raglan.sleeve.front', null)
  if (raglan) {
    // Raglan: each sleeve's cap below the notch matches the body's armhole below it; the
    // over-arm seam's two sides match within 1% (eased); the underarm seam matches
    const rb = store.get('raglan.sleeve.back')
    near(raglan.cap, store.get('library.sleeve.frontArmholeToArmholePitch'), 3, 'front raglan cap vs armhole')
    near(rb.cap, store.get('library.sleeve.backArmholeToArmholePitch'), 3, 'back raglan cap vs armhole')
    near(raglan.overarm, rb.overarm, raglan.overarm * 0.01, 'over-arm seam')
    near(raglan.underarm, rb.underarm, 0.5, 'raglan underarm seam')
  } else if (store.get('coat.sleeve', null)) {
    const sleeve = get('sleeve')
    near(sleeve.cap, sleeve.armhole, 3, 'sleeve cap vs armhole')
    near(sleeve.underarm[0], sleeve.underarm[1], 0.5, 'sleeve underarm seam')
  }
  // The facing is cut from the front's own edge, so they sew together by construction
  assert.ok(get('facing').edge >= fr.edge, 'facing runs the full front edge')
  // Pockets stay on the front, clear of the armhole, side seam and hem
  const front = pattern.parts[0][frontName].points
  const pockets = store.get('coat.pockets', null) ?? {}
  for (const [k, p] of Object.entries(pockets)) {
    assert.ok(p.w > 0 && p.h > 0, `${k} pocket has a size`)
    assert.ok(p.x + p.w < front.hem.x, `${k} pocket clears the side seam`)
    assert.ok(p.y + p.h < front.cfHem.y, `${k} pocket clears the hem`)
  }
  const { breast } = pockets
  if (breast) assert.ok(breast.x + breast.w < front.armholeHollow.x, 'breast pocket clears the armhole')
  // Round the waist the coat clears the body (stout figures most of all)
  const back = pattern.parts[0][frontName.replace('front', 'back')]?.points ?? pattern.parts[0][frontName.replace('front', 'backBase')]?.points
  if (back) {
    const { f = 0 } = get('frontEdge')
    const waist = 2 * (back.sideWaist.x + front.sideWaist.x + f)
    assert.ok(waist > pattern.settings[0].measurements.waist * 1.02, `coat waist ${waist.toFixed(0)} vs body ${pattern.settings[0].measurements.waist}`)
  }
  // Buttons, or a zip
  const b = store.get('coat.buttons', null) ?? get('zip')
  assert.ok(b.top < b.bottom, 'buttons run down the front')
  // A hood sews to the whole neckline
  const hood = store.get('coat.hood', null)
  if (hood) near(hood.neck, hood.target, 1, 'hood neck edge vs neckline')
  return store
}

/** Run checkCoat for a design at every set, under each settings variant */
export function testCoat(label, Design, frontName, variants = { default: {} }, extra) {
  for (const [v, options] of Object.entries(variants)) {
    for (const [name, measurements] of Object.entries(sets)) {
      test(`${label} (${v}): ${name}`, () => {
        const pattern = new Design({ measurements, sa: 10, options }).draft()
        checkCoat(pattern, frontName)
        if (extra) extra(pattern)
      })
    }
  }
}
