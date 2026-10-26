// Consistency checks on the transcribed USDA 1939 tables. They catch misreadings: the table's
// own structure (sizes in a block share a height and step up in hip) bounds every value.
// Usage: node check.mjs   (prints problems; exit 1 if any)
import { fileURLToPath } from 'node:url'
import { readFileSync, existsSync } from 'node:fs'
import { load, items } from './parse.mjs'

// Girths grow with the hip interval at a fixed height
const girths = [
  'weight', 'bitrochantericDiameter', 'chestGirthAtArmscye', 'posteriorHipArc',
  'maximumChestGirth', 'anteriorChestArc', 'waistGirth', 'hipGirth', 'neckBaseGirth',
  'armscyeGirth', 'upperArmGirth', 'elbowGirth', 'thighGirth', 'maximumCalfGirth', 'kneeGirth',
  'totalCrotchLength', 'anteriorCrotchLength', 'verticalTrunkGirth', 'anteriorChestWidth',
  'posteriorChestWidth',
]
// Lengths follow height and barely move with hip
const lengths = [
  'waistHeight', 'hipHeight', 'stature', 'cervicaleHeight', 'tibialeHeight', 'crotchHeight',
  'totalPosteriorArmLength', 'upperPosteriorArmLength', 'trunkLine',
]

export function check(sizes) {
  const out = []
  const say = (s, msg) => out.push(`${s.id}: ${msg}`)
  for (const s of sizes) {
    if (Math.abs(s.m.stature - s.height) > 0.75) say(s, `stature ${s.m.stature} vs height ${s.height}`)
    if (Math.abs(s.m.hipGirth - s.hip) > 0.75) say(s, `hip girth ${s.m.hipGirth} vs hip ${s.hip}`)
    if (s.m.maximumChestGirth !== null && Math.abs(s.m.maximumChestGirth - s.m.chestGirthAtArmscye) > 1.5)
      say(s, `max chest ${s.m.maximumChestGirth} vs chest at armscye ${s.m.chestGirthAtArmscye}`)
    if (s.m.cervicaleHeight >= s.m.stature) say(s, 'cervicale above stature')
    if (!(s.m.waistHeight > s.m.hipHeight && s.m.hipHeight > s.m.crotchHeight)) say(s, 'waist > hip > crotch height fails')
    for (const k of s.unsure) say(s, `${k} marked unsure`)
  }
  for (let b = 0; b < sizes.length; b += 3) {
    const [x, y, z] = sizes.slice(b, b + 3)
    for (const k of girths) {
      if (x.m[k] === null) continue
      if (!(x.m[k] <= y.m[k] && y.m[k] <= z.m[k])) say(y, `${k} not rising across the block: ${x.m[k]}, ${y.m[k]}, ${z.m[k]}`)
    }
    for (const k of lengths) {
      const span = Math.max(x.m[k], y.m[k], z.m[k]) - Math.min(x.m[k], y.m[k], z.m[k])
      if (span > (k === 'stature' ? 1 : 0.75)) say(y, `${k} spread ${span} across the block: ${x.m[k]}, ${y.m[k]}, ${z.m[k]}`)
    }
    if (b + 3 < sizes.length) {
      const n = sizes[b + 4]
      for (const k of lengths) if (n.m[k] < y.m[k] - 0.25) say(n, `${k} falls from ${y.id}: ${y.m[k]} -> ${n.m[k]}`)
    }
    const pct = x.m.percentage + y.m.percentage + z.m.percentage
    if (pct < 75 || pct > 100) say(y, `block percentages sum to ${pct}`)
  }
  return out
}

// The survey's own editing rules (Misc. Pub. 366, p. 20 footnote) hold for each child:
//   waist height - hip height = waist to hips
//   waist height + posterior waist length = cervicale height
//   hip height + waist to hips + trunk line + scye depth = cervicale height
// For the size averages they hold up to a steady offset (taped lengths follow the body's
// curve). A size far from its table's mean offset is worth a second look; these are reports.
export function identities(sizes) {
  const rules = {
    'waist-hip height vs waist to hips': (m) => m.waistHeight - m.hipHeight - m.waistToHips,
    'waist height + back waist vs cervicale': (m) =>
      m.waistHeight + m.posteriorWaistLength - m.cervicaleHeight,
    'hip height + waist-hips + trunk + scye vs cervicale': (m) =>
      m.hipHeight + m.waistToHips + m.trunkLine + m.scyeDepth - m.cervicaleHeight,
  }
  const out = []
  for (const [name, f] of Object.entries(rules)) {
    const r = sizes.map((s) => f(s.m))
    const mean = r.reduce((a, b) => a + b) / r.length
    sizes.forEach((s, i) => {
      if (Math.abs(r[i] - mean) > 0.5)
        out.push(`${s.id}: ${name} off by ${r[i].toFixed(3)} (table mean ${mean.toFixed(3)})`)
    })
  }
  return out
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const data = load()
  let bad = 0
  for (const [k, sizes] of Object.entries(data)) {
    const p = check(sizes)
    bad += p.length
    console.log(`${k}: ${sizes.length} sizes, ${p.length} problems`)
    for (const l of p) console.log('  ' + l)
    for (const l of identities(sizes)) console.log('  note: ' + l)
  }
  process.exit(bad ? 1 : 0)
}
