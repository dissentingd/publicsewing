// Children's measurement sets for FreeSewing designs, from the USDA 1939 survey of 147,000
// American children (O'Brien & Girshick, Misc. Pub. 365, Tables 8 and 9). US government work,
// public domain. FreeSewing itself ships no children's sizes.
//
// A size is a height-hip interval: B/C/D = slimmer/regular/fuller hip at that height, 1-13 for
// boys and 1-12 for girls (C is where most children of that height fall). Values in mm.
//
// Measurements the survey took map straight across; the rest are derived and listed in
// `derived` below with the rule used. FreeSewing's own adult sets are extrapolated from a
// single neck measurement, so even the derived values here rest on more data than those do.
import { readFileSync } from 'node:fs'

const raw = JSON.parse(readFileSync(new URL('./usda1939/usda1939.json', import.meta.url), 'utf8'))

const mm = (inches) => Math.round(inches * 25.4)

/** Measured: FreeSewing name -> USDA item (inches) */
export const measured = {
  biceps: 'upperArmGirth', // midway shoulder-elbow
  bustFront: 'anteriorChestArc', // side to side across the front at chest level
  crossSeam: 'totalCrotchLength', // waist front through the crotch to waist back
  crossSeamFront: 'anteriorCrotchLength',
  highBust: 'chestGirthAtArmscye',
  highBustFront: 'anteriorChestArc',
  hpsToWaistBack: 'posteriorWaistLength', // USDA measures from cervicale, not HPS
  inseam: 'crotchHeight',
  knee: 'kneeGirth',
  neck: 'neckBaseGirth',
  seat: 'hipGirth', // USDA "hip" is the average hip level, i.e. the seat
  seatBack: 'posteriorHipArc',
  shoulderToElbow: 'upperPosteriorArmLength',
  shoulderToWrist: 'totalPosteriorArmLength',
  upperLeg: 'thighGirth', // at the gluteal fold
  waist: 'waistGirth',
  waistToArmpit: 'trunkLine', // underarm midpoint to waist, at the side
  waistToFloor: 'waistHeight',
  waistToSeat: 'waistToHips', // waist to average hip (seat) level
}

/** Derived: FreeSewing name -> [rule, function of the USDA measurements m (inches) and s (mm so far)] */
export const derived = {
  chest: ['maximum chest girth; chest girth at armscye where the table leaves it blank (younger children)',
    (m) => mm(m.maximumChestGirth ?? m.chestGirthAtArmscye)],
  crotchDepth: ['waist height - crotch height', (m) => mm(m.waistHeight - m.crotchHeight)],
  waistToUpperLeg: ['= crotch depth (as FreeSewing\'s own menswear set)', (m) => mm(m.waistHeight - m.crotchHeight)],
  waistToKnee: ['waist height - tibiale (knee joint) height', (m) => mm(m.waistHeight - m.tibialeHeight)],
  hips: ['halfway between waist and seat girth', (m) => mm((m.waistGirth + m.hipGirth) / 2)],
  waistToHips: ['half of waist-to-seat', (m) => mm(m.waistToHips / 2)],
  waistBack: ['half the waist', (m) => mm(m.waistGirth / 2)],
  hpsToWaistFront: ['= back waist length (USDA measures the front from the neck base)', (m) => mm(m.posteriorWaistLength)],
  hpsToBust: ['0.6 x back waist length (FreeSewing adult proportion)', (m) => mm(0.6 * m.posteriorWaistLength)],
  shoulderToShoulder: ['1.12 x across-back width (FreeSewing adult proportion)', (m) => mm(1.12 * m.posteriorChestWidth)],
  shoulderSlope: ['13 degrees, FreeSewing\'s default; USDA\'s ~25 degrees uses a different protractor method', () => 13],
  underbust: ['= chest girth at armscye (no bust)', (m) => mm(m.chestGirthAtArmscye)],
  waistToUnderbust: ['0.3 x trunk line', (m) => mm(0.3 * m.trunkLine)],
  bustSpan: ['half the across-front width', (m) => mm(m.anteriorChestWidth / 2)],
  bustPointToUnderbust: ['20 mm (no bust)', () => 20],
  wrist: ['0.65 x elbow girth (FreeSewing adult proportion)', (m) => mm(0.65 * m.elbowGirth)],
  ankle: ['0.57 x knee girth (FreeSewing adult proportion)', (m) => mm(0.57 * m.kneeGirth)],
  heel: ['1.5 x ankle', (m) => mm(1.5 * 0.57 * m.kneeGirth)],
  head: ['400 mm + 0.1 x stature (growth-chart approximation)', (m) => Math.round(400 + 0.1 * mm(m.stature))],
}

function toFreeSewing(m) {
  const s = {}
  for (const [k, u] of Object.entries(measured)) s[k] = mm(m[u])
  for (const [k, [, f]] of Object.entries(derived)) s[k] = f(m)
  return s
}

const build = (prefix, list) =>
  Object.fromEntries(list.map((z) => [`${prefix}${z.id}`, toFreeSewing(z.m)]))

/** e.g. usdaBoyC5, usdaGirlB3 */
export const boys = build('usdaBoy', raw.boys)
export const girls = build('usdaGirl', raw.girls)
export const all = { ...boys, ...girls }

/** The survey's size labels: height and hip in inches, share of children of that height */
export const labels = Object.fromEntries([
  ...raw.boys.map((z) => [`usdaBoy${z.id}`, { height: z.height, hip: z.hip, percent: z.m.percentage, weightLb: z.m.weight }]),
  ...raw.girls.map((z) => [`usdaGirl${z.id}`, { height: z.height, hip: z.hip, percent: z.m.percentage, weightLb: z.m.weight }]),
])
