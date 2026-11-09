// Baby and toddler measurement sets, below our USDA 1939 children's range (whose smallest is
// 40.5 in tall). Not in the test sets every design drafts at: only designs made for babies use
// them (BUILD_QUEUE F10).
//
// Sizes, lengths and most girths: Commercial Standard CS151-50, *Body Measurements for the Sizing
// of Apparel for Infants, Babies, Toddlers and Children* (US National Bureau of Standards, 1950;
// US government work, public domain), Table 1 (babies, p. 9), Table 5 (toddlers, p. 12) and
// Table 7 (children, p. 14). A composite of boys and girls, one "regular" build per size. Its girths
// are taken over indoor clothing, a little larger than a bare-body tape.
//
// Girths CS151-50 doesn't give for babies, and head, ankle and wrist at every size: Snyder et al.,
// *Physical Characteristics of Children as Related to Death and Injury for Consumer Product Safety
// Design* (Univ. of Michigan HSRI for the US Consumer Product Safety Commission, 1975,
// UM-HSRI-BI-75-5), combined-sexes 50th percentiles, cm (report pp. 181-213). A baby's girth is
// toddler size 1's CS151-50 girth scaled by Snyder's growth curve for that girth between the two
// ages, so it stays on CS151-50's clothed basis.
//
// Toddler sizes 2 and 3 are CS151-50's children's sizes 2 and 3 (its Table 5 note A), which add
// the hip. Baby sizes 18, 24 and 36 months are left out: toddler 1, 2 and 3 are the same heights
// with fuller data. All values in mm.

const mm = (inches) => Math.round(inches * 25.4)

/** CS151-50, inches. age: its "approximate age, based on stature", months */
const cs = {
  baby3m: { age: 3, stature: 24, weight: 13, chest: 17, verticalTrunk: 27, shoulderArm: 9,
    headNeck: 5.75, cervicaleHeight: 18.25, cervicaleToKnee: 13, cervicaleToWaist: 6.125,
    waistHeight: 12.125, waistToKnee: 6.875, waistToHip: 2.625, crotchHeight: 7.75, kneeHeight: 5.25 },
  baby6m: { age: 6.5, stature: 26.5, weight: 18, chest: 18, verticalTrunk: 29, shoulderArm: 10.25,
    headNeck: 6, cervicaleHeight: 20.5, cervicaleToKnee: 14.5, cervicaleToWaist: 6.875,
    waistHeight: 13.625, waistToKnee: 7.75, waistToHip: 2.875, crotchHeight: 9.125, kneeHeight: 6 },
  baby12m: { age: 11.5, stature: 29, weight: 22, chest: 19, verticalTrunk: 31, shoulderArm: 11.5,
    headNeck: 6.125, cervicaleHeight: 22.875, cervicaleToKnee: 16.125, cervicaleToWaist: 7.5,
    waistHeight: 15.5, waistToKnee: 8.75, waistToHip: 3.125, crotchHeight: 10.5, kneeHeight: 6.75 },
  toddler1: { age: 16.5, stature: 31, weight: 25, chest: 20, waist: 20, verticalTrunk: 32.5, thigh: 11.5,
    neck: 9.625, armscye: 8.5, upperArm: 5.875, crossBack: 8.125, shoulderLength: 2.5, scyeDepth: 3.75,
    crotchLength: 16, shoulderArm: 12.5, headNeck: 6.25, cervicaleHeight: 24.75, cervicaleToKnee: 17.25,
    cervicaleToWaist: 8, waistHeight: 17, waistToKnee: 9.5, waistToHip: 3.375, crotchHeight: 11.5,
    kneeHeight: 7.5, ankleHeight: 1.625 },
  toddler2: { age: 25.5, stature: 34, weight: 29, chest: 21, waist: 20.5, hip: 21.5, verticalTrunk: 34.5,
    thigh: 12, neck: 10, armscye: 9, upperArm: 6.125, crossBack: 8.625, shoulderLength: 2.625, scyeDepth: 4,
    crotchLength: 17, shoulderArm: 13.75, headNeck: 6.625, cervicaleHeight: 27.375, cervicaleToKnee: 18.875,
    cervicaleToWaist: 8.5, waistHeight: 19.25, waistToKnee: 10.75, waistToHip: 3.875, crotchHeight: 13.125,
    kneeHeight: 8.5, ankleHeight: 1.75 },
  toddler3: { age: 37, stature: 37, weight: 34, chest: 22, waist: 21, hip: 22.5, verticalTrunk: 36.5,
    thigh: 12.5, neck: 10.375, armscye: 9.5, upperArm: 6.375, crossBack: 9, shoulderLength: 2.75, scyeDepth: 4.25,
    crotchLength: 18, shoulderArm: 15, headNeck: 7, cervicaleHeight: 30, cervicaleToKnee: 20.5,
    cervicaleToWaist: 9, waistHeight: 21.5, waistToKnee: 12, waistToHip: 4.375, crotchHeight: 14.875,
    kneeHeight: 9.5, ankleHeight: 1.875 },
}

/** Snyder 1975, combined sexes, 50th percentile, cm, by age group (months, inclusive) */
const groups = [[0, 3], [4, 6], [7, 9], [10, 12], [13, 18], [19, 24], [25, 30], [31, 36], [37, 42], [43, 48]]
const snyder = {
  head: [37.8, 42.5, 44.8, 45.6, 47.2, 48.4, 49.0, 49.7, 50.1, 50.4], // p. 181
  chest: [36.0, 40.9, 44.5, 44.7, 46.0, 47.9, 48.9, 49.7, 50.8, 51.5], // p. 189
  waist: [30.4, 36.6, 39.6, 38.4, 41.4, 44.0, 46.3, 47.3, 48.2, 48.5], // p. 193 (an infant's just above the hip bones)
  forearm: [11.1, 13.2, 13.9, 13.9, 14.3, 14.9, 15.0, 15.1, 15.3, 15.5], // p. 197
  upperArm: [10.8, 13.0, 13.6, 14.0, 14.1, 14.5, 14.9, 15.2, 15.3, 15.5], // p. 201
  midThigh: [17.6, 21.5, 22.2, 23.6, 23.5, 25.2, 25.9, 26.7, 27.4, 27.9], // p. 205
  ankle: [9.7, 11.7, 12.3, 12.8, 13.0, 13.8, 13.9, 13.8, 14.2, 14.2], // p. 213
}
const mids = groups.map(([a, b]) => (a + b + 1) / 2)

/** Snyder's value at an age in months, linear between age-group midpoints, in mm */
export function snyderAt(name, age) {
  const v = snyder[name]
  if (age <= mids[0]) return v[0] * 10
  for (let i = 1; i < mids.length; i++) {
    if (age <= mids[i]) return 10 * (v[i - 1] + ((v[i] - v[i - 1]) * (age - mids[i - 1])) / (mids[i] - mids[i - 1]))
  }
  return v.at(-1) * 10
}

const t1 = cs.toddler1
// A baby's missing girth: toddler 1's, scaled by Snyder's growth curve for it
const fromT1 = (z, inches, curve) => (mm(inches) * snyderAt(curve, z.age)) / snyderAt(curve, t1.age)
// A baby's missing width or length: toddler 1's, scaled by chest, or by vertical trunk
const byChest = (z, inches) => (mm(inches) * z.chest) / t1.chest
const byTrunk = (z, inches) => (mm(inches) * z.verticalTrunk) / t1.verticalTrunk

/** FreeSewing name -> [rule, function of the CS151-50 row z (inches; age in months)], in mm */
export const rules = {
  chest: ['CS151-50 chest', (z) => mm(z.chest)],
  highBust: ['= chest', (z) => mm(z.chest)],
  underbust: ['= chest (no bust)', (z) => mm(z.chest)],
  bustFront: ['0.52 x chest (USDA 1939 front arc proportion)', (z) => 0.52 * mm(z.chest)],
  highBustFront: ['0.52 x chest', (z) => 0.52 * mm(z.chest)],
  // Checked 2026-11-09: Snyder's bare-body waist is 0.86-0.90 of chest under 18 months, 0.95 at 3 years,
  // where CS151-50 agrees. CS151-50 measured over clothing, a nappy included, and its ratio falls as
  // children leave them (1.00 at toddler 1, 0.90 by 6), so waist = chest suits clothes worn over one
  waist: ['CS151-50 waist; babies: = chest, as at toddler size 1 (over a nappy)', (z) => mm(z.waist ?? z.chest)],
  waistBack: ['half the waist', (z) => mm(z.waist ?? z.chest) / 2],
  seat: ['CS151-50 hip (sizes 2, 3); else 1.05 x waist (its size 2 proportion)', (z) => (z.hip ? mm(z.hip) : 1.05 * mm(z.waist ?? z.chest))],
  seatBack: ['0.49 x seat (USDA 1939 back hip arc proportion)', (z) => 0.49 * (z.hip ? mm(z.hip) : 1.05 * mm(z.waist ?? z.chest))],
  hips: ['halfway between waist and seat', (z) => (mm(z.waist ?? z.chest) + (z.hip ? mm(z.hip) : 1.05 * mm(z.waist ?? z.chest))) / 2],
  neck: ['CS151-50 neck base; babies: toddler 1 scaled by chest', (z) => (z.neck ? mm(z.neck) : byChest(z, t1.neck))],
  biceps: ['CS151-50 upper arm girth; babies: toddler 1 scaled by Snyder upper arm', (z) => (z.upperArm ? mm(z.upperArm) : fromT1(z, t1.upperArm, 'upperArm'))],
  upperLeg: ['CS151-50 thigh; babies: toddler 1 scaled by Snyder mid-thigh', (z) => (z.thigh ? mm(z.thigh) : fromT1(z, t1.thigh, 'midThigh'))],
  knee: ['0.75 x thigh (USDA 1939 size B1 proportion)', (z) => 0.75 * (z.thigh ? mm(z.thigh) : fromT1(z, t1.thigh, 'midThigh'))],
  ankle: ['Snyder ankle girth at the age', (z) => snyderAt('ankle', z.age)],
  heel: ['1.5 x ankle', (z) => 1.5 * snyderAt('ankle', z.age)],
  wrist: ['0.65 x Snyder forearm girth (the rule children.mjs uses on elbow girth)', (z) => 0.65 * snyderAt('forearm', z.age)],
  head: ['Snyder head girth at the age', (z) => snyderAt('head', z.age)],
  crossSeam: ['CS151-50 total crotch length; babies: toddler 1 scaled by vertical trunk', (z) => (z.crotchLength ? mm(z.crotchLength) : byTrunk(z, t1.crotchLength))],
  crossSeamFront: ['half the cross seam', (z) => (z.crotchLength ? mm(z.crotchLength) : byTrunk(z, t1.crotchLength)) / 2],
  inseam: ['CS151-50 crotch height', (z) => mm(z.crotchHeight)],
  waistToFloor: ['CS151-50 waist height', (z) => mm(z.waistHeight)],
  crotchDepth: ['waist height - crotch height', (z) => mm(z.waistHeight - z.crotchHeight)],
  waistToUpperLeg: ['= crotch depth', (z) => mm(z.waistHeight - z.crotchHeight)],
  waistToKnee: ['CS151-50 waist to knee', (z) => mm(z.waistToKnee)],
  waistToSeat: ['CS151-50 waist to hip', (z) => mm(z.waistToHip)],
  waistToHips: ['half of waist to seat', (z) => mm(z.waistToHip) / 2],
  hpsToWaistBack: ['CS151-50 cervicale to waist (from cervicale, not HPS, as the USDA sets)', (z) => mm(z.cervicaleToWaist)],
  hpsToWaistFront: ['= back waist length', (z) => mm(z.cervicaleToWaist)],
  hpsToBust: ['0.6 x back waist length', (z) => 0.6 * mm(z.cervicaleToWaist)],
  waistToArmpit: ['back waist length - scye depth (babies: toddler 1 scye depth scaled by chest)', (z) => mm(z.cervicaleToWaist) - (z.scyeDepth ? mm(z.scyeDepth) : byChest(z, t1.scyeDepth))],
  waistToUnderbust: ['0.3 x waist to armpit', (z) => 0.3 * (mm(z.cervicaleToWaist) - (z.scyeDepth ? mm(z.scyeDepth) : byChest(z, t1.scyeDepth)))],
  shoulderToShoulder: ['1.12 x cross-back width (babies: toddler 1 scaled by chest)', (z) => 1.12 * (z.crossBack ? mm(z.crossBack) : byChest(z, t1.crossBack))],
  bustSpan: ['0.4 x cross-back width', (z) => 0.4 * (z.crossBack ? mm(z.crossBack) : byChest(z, t1.crossBack))],
  bustPointToUnderbust: ['20 mm (no bust)', () => 20],
  shoulderToWrist: ['CS151-50 shoulder-and-arm length (from the neck) - shoulder length (babies: toddler 1 scaled by chest)', (z) => mm(z.shoulderArm) - (z.shoulderLength ? mm(z.shoulderLength) : byChest(z, t1.shoulderLength))],
  shoulderToElbow: ['0.57 x shoulder to wrist (USDA 1939 proportion)', (z) => 0.57 * (mm(z.shoulderArm) - (z.shoulderLength ? mm(z.shoulderLength) : byChest(z, t1.shoulderLength)))],
  shoulderSlope: ['13 degrees, FreeSewing\'s default', () => 13],
}

const toFreeSewing = (z) => Object.fromEntries(Object.entries(rules).map(([k, [, f]]) => [k, Math.round(f(z))]))

/** e.g. cs151Baby3m, cs151Toddler1 */
export const babies = Object.fromEntries(
  Object.entries(cs).map(([id, z]) => [`cs151${id[0].toUpperCase()}${id.slice(1)}`, toFreeSewing(z)])
)

/** Each set's height (in), weight (lb) and CS151-50's approximate age (months) */
export const labels = Object.fromEntries(
  Object.entries(cs).map(([id, z]) => [`cs151${id[0].toUpperCase()}${id.slice(1)}`, { height: z.stature, weightLb: z.weight, ageMonths: z.age }])
)
