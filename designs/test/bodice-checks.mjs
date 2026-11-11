// Checks every bodice on the Bella block (blocks/bella.mjs) must pass at every measurement set:
// a back, a front with a side bust dart and a waist dart, and a set-in sleeve; and every princess
// bodice on Noble (blocks/noble.mjs, on Bella), with checkPrincess.
// Until our operations change Bella's seams and record them in the store (`bodice.seams`, as
// lib/jacket.mjs does with `jacket.seams`), the lengths are measured along each piece's seam path.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sets, checkClean, near } from './coat-checks.mjs'

/**
 * The length of a part's seam path from point a to point b, both ends of its segments, a first.
 * Walks the segments (a split fails where a point appears twice, as Bella's waistDartRight does)
 */
export function along(part, a, b, path = 'seam') {
  const segs = part.paths[path].divide()
  const pa = part.points[a]
  const pb = part.points[b]
  assert.ok(pa && pb, `${part.name} has no point ${pa ? b : a}`)
  const at = (p, from) => segs.findIndex((s, i) => i >= from && s.end().sitsRoughlyOn(p))
  // a at the path's start: from its first segment
  const start = segs[0].start().sitsRoughlyOn(pa)
  const i = start ? -1 : at(pa, 0)
  const j = at(pb, i + 1)
  assert.ok((start || i >= 0) && j > i, `${a} to ${b} along ${path} of ${part.name}`)
  return segs.slice(i + 1, j + 1).reduce((sum, s) => sum + s.length(), 0)
}

/** Whether a point is an end of one of the seam's segments */
export const onSeam = (part, name) => part.paths.seam.divide().some((s) => s.end().sitsRoughlyOn(part.points[name]))

/** Bella's seams as drafted: lengths to compare, from the pieces' own points */
export function bellaSeams(pattern, { back, front, sleeve }) {
  const parts = pattern.parts[0]
  const b = parts[back]
  const f = parts[front]
  return {
    // The back's side seam; the front's, its two parts either side of the bust dart
    sideBack: along(b, 'waistSide', 'armhole'),
    sideFront: along(f, 'sideHem', 'bustDartBottom') + along(f, 'bustSide', 'armhole'),
    // (a reshaped neck moves the shoulder's neck end: lib/bodice.mjs stores the new length)
    shoulderBack: pattern.setStores[0].get('bodice.back', null)?.shoulder ?? b.points.hps.dist(b.points.shoulder),
    shoulderFront: pattern.setStores[0].get('bodice.front', null)?.shoulder ?? f.points.hps.dist(f.points.shoulder),
    bustDart: [along(f, 'bustDartBottom', 'bustDartTip'), along(f, 'bustDartTip', 'bustSide')],
    // (none where the waist is as big as the chest: Bella leaves the front's out on stout figures)
    frontWaistDart: onSeam(f, 'waistDartTip') ? [along(f, 'waistDartLeft', 'waistDartTip'), along(f, 'waistDartTip', 'waistDartRight')] : null,
    backWaistDart: [along(b, 'dartBottomLeft', 'dartTip'), along(b, 'dartTip', 'dartBottomRight')],
    armhole: b.paths.armhole.length() + f.paths.armhole.length(),
    cap: sleeve ? parts[sleeve].paths.sleevecap.length() : undefined,
  }
}

export function checkBodice(pattern, names) {
  const store = checkClean(pattern)
  const s = store.get('bodice.seams', null) ?? bellaSeams(pattern, names)
  near(s.sideBack, s.sideFront, 0.5, 'side seams')
  near(s.bustDart[0], s.bustDart[1], 0.5, 'bust dart legs')
  if (s.frontWaistDart) near(s.frontWaistDart[0], s.frontWaistDart[1], 0.5, 'front waist dart legs')
  near(s.backWaistDart[0], s.backWaistDart[1], 0.5, 'back waist dart legs')
  // The back shoulder is eased onto the front, by up to 5% or 6 mm (Bella eases it about 4.6 mm,
  // which is more than 5% of a shoulder narrowed by a wide neck)
  assert.ok(s.shoulderBack >= s.shoulderFront - 0.5 && s.shoulderBack <= Math.max(s.shoulderFront * 1.05, s.shoulderFront + 6), `shoulders ${s.shoulderBack.toFixed(1)} vs ${s.shoulderFront.toFixed(1)}`)
  // The sleeve cap fits the armhole. Bella fits its cap to the armhole plus sleevecapEase (0 by
  // default) to within 2 mm either way, at every size we have; a design may add up to 5% ease
  if (s.cap !== undefined) assert.ok(s.cap >= s.armhole - 2 && s.cap <= s.armhole * 1.05 + 2, `sleeve cap ${s.cap.toFixed(1)} vs armhole ${s.armhole.toFixed(1)}`)
  return store
}

/**
 * Noble's princess seams as drafted (blocks/noble.mjs): the dart Bella had at the waist runs on
 * up to the shoulder or the armhole (`dartPosition`), cutting back and front each in two.
 * Noble's back pieces keep Bella's whole back as their `seam` path: their own outlines are
 * `insideSeam` and `outsideSeam`
 */
export function nobleSeams(pattern, prefix = 'noble') {
  const parts = pattern.parts[0]
  const bi = parts[`${prefix}.backInside`]
  const bo = parts[`${prefix}.backOutside`]
  const fi = parts[`${prefix}.frontInside`]
  const fo = parts[`${prefix}.frontOutside`]
  const to = 'armholeDartInside' in fi.points && onSeam(fi, 'armholeDartInside') ? 'armhole' : 'shoulder'
  return {
    backPrincess: [bi.paths.princess.length(), bo.paths.dart.length()],
    frontPrincess: [along(fi, 'waistDartLeft', `${to}DartInside`), along(fo, `${to}DartOutside`, 'waistDartRight')],
    sideBack: along(bo, 'waistSide', 'armhole', 'outsideSeam'),
    sideFront: along(fo, 'sideHem', 'armhole'),
  }
}

/** checkClean for Noble: each piece's allowance lies outside its own outline, not its `seam` */
const outline = { backInside: 'insideSeam', backOutside: 'outsideSeam' }
export function checkNobleClean(pattern) {
  const store = pattern.setStores[0]
  assert.deepEqual(store.logs.error, [], 'errors')
  assert.deepEqual(store.logs.warn, [], 'warnings')
  for (const [p, part] of Object.entries(pattern.parts[0])) {
    for (const [id, pt] of Object.entries(part.points)) assert.ok(Number.isFinite(pt.x) && Number.isFinite(pt.y), `${p}.${id} is not a number`)
    const seam = part.paths[outline[p.split('.').pop()] ?? 'seam']
    if (part.hidden || !seam || !part.paths.sa) continue
    const a = seam.bbox()
    const b = part.paths.sa.bbox()
    const outside = ['x', 'y'].every((k) => b.topLeft[k] <= a.topLeft[k] + 0.01 || b.bottomRight[k] >= a.bottomRight[k] - 0.01)
    assert.ok(outside, `${p}: seam allowance is not outside the seam`)
  }
  return store
}

/** `prefix`: the design's part names, `<prefix>.backInside` and so on (its spec's `about.id`) */
export function checkPrincess(pattern, prefix) {
  checkNobleClean(pattern)
  const s = nobleSeams(pattern, prefix)
  near(s.backPrincess[0], s.backPrincess[1], 0.5, 'back princess seam')
  near(s.frontPrincess[0], s.frontPrincess[1], 2, 'front princess seam')
  near(s.sideBack, s.sideFront, 0.5, 'side seams')
}

/** As testBodice, for princess bodices on Noble */
export function testPrincess(label, Design, prefix, variants = { default: {} }, extra) {
  for (const [variant, options] of Object.entries(variants)) {
    for (const [set, measurements] of Object.entries(sets)) {
      test(`${label} ${variant}: ${set}`, () => {
        const pattern = new Design({ measurements, options, sa: 10 }).draft()
        checkPrincess(pattern, prefix)
        extra?.(pattern)
      })
    }
  }
}

/**
 * One test per variant and size set. `names`: the design's part names for the back, front and
 * sleeve (`sleeve` left out for a sleeveless design). `extra(pattern)` adds the design's own checks
 */
export function testBodice(label, Design, names, variants = { default: {} }, extra) {
  for (const [variant, options] of Object.entries(variants)) {
    for (const [set, measurements] of Object.entries(sets)) {
      test(`${label} ${variant}: ${set}`, () => {
        const pattern = new Design({ measurements, options, sa: 10 }).draft()
        checkBodice(pattern, names)
        extra?.(pattern)
      })
    }
  }
}

/**
 * A dress on Bella (lib/bodice.mjs): the bodice checks, and the skirt sewn to it. A straight or
 * A-line skirt's waist equals the bodice's (darts closed); a gathered one is at least 20% longer.
 * The skirt's side seams match, its darts' legs match, and the zip notch is on centre back below
 * the waist. `prefix`: the design's part names
 */
export function checkDress(pattern, prefix) {
  const parts = pattern.parts[0]
  const sleeve = parts[`${prefix}.sleeve`]
  const store = checkBodice(pattern, { back: `${prefix}.back`, front: `${prefix}.front`, sleeve: sleeve && !sleeve.hidden ? `${prefix}.sleeve` : undefined })
  for (const which of ['front', 'back']) {
    const w = store.get(`bodice.waist.${which}`)
    const k = store.get(`bodice.skirt.${which}`)
    if (k.dartLegs) near(k.dartLegs[0], k.dartLegs[1], 0.5, `${which} skirt dart legs`)
    if (pattern.settings[0].options?.skirtStyle === 'gathered') assert.ok(k.waist >= w.seam * 1.2 - 0.01, `${which} gathers ${k.waist.toFixed(0)} into ${w.seam.toFixed(0)}`)
    else near(k.waist, w.seam, 0.5, `${which} waist seam, skirt to bodice`)
  }
  near(store.get('bodice.skirt.front').side, store.get('bodice.skirt.back').side, 1, 'skirt side seams')
  return store
}

/** One test per variant and size set, for a dress on Bella; `extra(pattern)` adds the design's own */
export function testDress(label, Design, prefix, variants = { default: {} }, extra) {
  for (const [variant, options] of Object.entries(variants)) {
    for (const [set, measurements] of Object.entries(sets)) {
      test(`${label} ${variant}: ${set}`, () => {
        const pattern = new Design({ measurements, options, sa: 10 }).draft()
        checkDress(pattern, prefix)
        extra?.(pattern)
      })
    }
  }
}
