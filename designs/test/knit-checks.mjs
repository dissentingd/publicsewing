// Checks every knit top or dress on the Bibi block (blocks/bibi.mjs) must pass at every
// measurement set. Knit garments may fit with negative ease, and the fabric absorbs small seam
// differences that a woven seam couldn't, so these are stretch-aware where coat-checks.mjs isn't:
// - the side seams (the front's either side of its bust dart or gathers) agree within 4%. Bibi
//   gathers up to 2.7% more front than back into the side seam at the bust, and with negative ease
//   (−5%) its front comes out 3.9% short at Women 28: stretched on, both sew flat;
// - the finished chest is the body's plus the design's chest ease (negative too), within 1%;
// - a binding or rib is never longer than the edge it finishes.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sets, near } from './coat-checks.mjs'

// FreeSewing warnings from Bibi itself that don't affect the draft: it reads `bindingHeight`
// before any part has stored it (every draft, every size, 4.10.2)
const upstream = [/^Store\.get\(key\) on key `bindingHeight`, which is undefined$/]
export const KNIT_SEAM = 0.04

export function checkKnitClean(pattern) {
  const store = pattern.setStores[0]
  assert.deepEqual(store.logs.error, [], 'errors')
  assert.deepEqual(store.logs.warn.map(String).filter((w) => !upstream.some((re) => re.test(w))), [], 'warnings')
  for (const [p, part] of Object.entries(pattern.parts[0])) {
    for (const [id, pt] of Object.entries(part.points)) {
      assert.ok(Number.isFinite(pt.x) && Number.isFinite(pt.y), `${p}.${id} is not a number`)
    }
  }
  return store
}

/** Bibi's seams as drafted, from its paths and its store */
export function bibiSeams(pattern, prefix = 'bibi') {
  const parts = pattern.parts[0]
  const store = pattern.setStores[0]
  const b = parts[`${prefix}.back`]
  const f = parts[`${prefix}.front`]
  const s = parts[`${prefix}.sleeve`]
  const dart = store.get('dart')
  const half = (part, cf) => Math.abs(part.points.chest.x - part.points[cf].x)
  return {
    sideBack: b.paths.sideSeam.length(),
    sideFront: dart.beforeDart.length() + dart.afterDart.length(),
    shoulderBack: b.paths.shoulder.length(),
    shoulderFront: f.paths.shoulder.length(),
    armhole: b.paths.armhole.length() + f.paths.armhole.length(),
    cap: s && !s.hidden ? s.paths.sleevecap.length() : undefined,
    // The whole neck opening (both halves) and the binding cut for it
    neck: 2 * (store.get('neckSizeBack') + store.get('neckSizeFront')),
    binding: parts[`${prefix}.neckBinding`].points.topLeft.dist(parts[`${prefix}.neckBinding`].points.bottomLeft),
    chest: 2 * (half(b, 'cbChest') + half(f, 'cbChest')),
  }
}

/** `prefix`: the design's part names, `<prefix>.back` and so on (its spec's `about.id`) */
export function checkKnit(pattern, prefix) {
  const store = checkKnitClean(pattern)
  const s = store.get('knit.seams', null) ?? bibiSeams(pattern, prefix)
  const side = s.sideFront / s.sideBack - 1
  assert.ok(Math.abs(side) <= KNIT_SEAM, `side seams ${s.sideFront.toFixed(1)} vs ${s.sideBack.toFixed(1)} (${(100 * side).toFixed(1)}%)`)
  near(s.shoulderBack, s.shoulderFront, 0.5, 'shoulder seams')
  // Bibi fits its cap to the armhole to within 2 mm either way, as Bella does
  if (s.cap !== undefined) assert.ok(Math.abs(s.cap - s.armhole) <= 2, `sleeve cap ${s.cap.toFixed(1)} vs armhole ${s.armhole.toFixed(1)}`)
  assert.ok(s.binding <= s.neck + 0.5, `neck binding ${s.binding.toFixed(1)} vs neck ${s.neck.toFixed(1)}`)
  const { measurements, options } = pattern.settings[0]
  const ease = options?.chestEase ?? pattern.config.options.chestEase.pct / 100
  assert.ok(s.chest >= measurements.chest * (1 + ease - 0.01), `finished chest ${s.chest.toFixed(0)} vs body ${measurements.chest} at ${(100 * ease).toFixed(0)}% ease`)
  // Every rib band is shorter than its edge by its stretch, and no longer than the edge
  for (const [k, r] of Object.entries(store.get('rib', null) ?? {})) {
    near(r.length, r.edge * (1 - r.stretch), 0.01, `rib ${k}`)
    assert.ok(r.length <= r.edge, `rib ${k} longer than its edge`)
  }
  return store
}

/** One test per variant and size set; `extra(pattern)` adds the design's own checks */
export function testKnit(label, Design, prefix, variants = { default: {} }, extra) {
  for (const [variant, options] of Object.entries(variants)) {
    for (const [set, measurements] of Object.entries(sets)) {
      test(`${label} ${variant}: ${set}`, () => {
        const pattern = new Design({ measurements, options, sa: 10 }).draft()
        checkKnit(pattern, prefix)
        extra?.(pattern)
      })
    }
  }
}
