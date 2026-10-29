// FreeSewing measurements <-> a SeamlyMe individual measurements file (.smis, schema 0.3.4),
// so Seamly users can bring their measurements here and take ours there. Only measurements
// with a clear Seamly equivalent are mapped; lengths in mm, the shoulder slope in degrees.
// Runs in Node and the browser.

export const SMIS_VERSION = '0.3.4'

/** FreeSewing name -> Seamly name (Seamly's names: src/libs/vpatterndb/measurements_def.cpp) */
export const SEAMLY_NAMES = {
  height: 'height',
  head: 'head_circ',
  neck: 'neck_circ',
  highBust: 'highbust_circ',
  highBustFront: 'highbust_arc_f',
  chest: 'bust_circ',
  bustFront: 'bust_arc_f',
  underbust: 'lowbust_circ',
  waist: 'waist_circ',
  waistBack: 'waist_arc_b',
  hips: 'highhip_circ',
  seat: 'hip_circ',
  seatBack: 'hip_arc_b',
  biceps: 'arm_upper_circ',
  wrist: 'arm_wrist_circ',
  upperLeg: 'leg_thigh_upper_circ',
  knee: 'leg_knee_circ',
  ankle: 'leg_ankle_circ',
  inseam: 'leg_crotch_to_floor',
  waistToFloor: 'leg_waist_side_to_floor',
  waistToKnee: 'leg_waist_side_to_knee',
  waistToHips: 'waist_to_highhip_side',
  waistToSeat: 'waist_to_hip_side',
  waistToArmpit: 'armpit_to_waist_side',
  waistToUnderbust: 'lowbust_to_waist_f',
  crossSeam: 'crotch_length',
  crossSeamFront: 'crotch_length_f',
  crotchDepth: 'rise_length_side_sitting',
  shoulderToShoulder: 'shoulder_tip_to_shoulder_tip_b',
  shoulderToElbow: 'arm_shoulder_tip_to_elbow',
  shoulderToWrist: 'arm_shoulder_tip_to_wrist',
  shoulderSlope: 'shoulder_slope_neck_side_angle',
  hpsToWaistBack: 'neck_side_to_waist_b',
  hpsToWaistFront: 'neck_side_to_waist_f',
  hpsToBust: 'bustpoint_to_neck_side',
  bustSpan: 'bustpoint_to_bustpoint',
  bustPointToUnderbust: 'bustpoint_to_lowbust',
}
const FREESEWING_NAMES = Object.fromEntries(Object.entries(SEAMLY_NAMES).map(([k, v]) => [v, k]))
const ANGLES = new Set(['shoulderSlope'])

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** FreeSewing measurements (mm) -> .smis text */
export function toSmis(measurements, { notes = '' } = {}) {
  const ms = Object.entries(SEAMLY_NAMES)
    .filter(([fs]) => typeof measurements[fs] === 'number' && Number.isFinite(measurements[fs]))
    .map(([fs, sm]) => `        <m name="${sm}" value="${Math.round(measurements[fs] * 100) / 100}"/>`)
  return `<?xml version="1.0" encoding="UTF-8"?>
<smis>
    <!--Measurements exported by PublicSewing (publicsewing.org).-->
    <version>${SMIS_VERSION}</version>
    <read-only>false</read-only>
    <notes>${esc(notes)}</notes>
    <unit>mm</unit>
    <pm_system>998</pm_system>
    <personal>
        <family-name/>
        <given-name/>
        <birth-date>1800-01-01</birth-date>
        <gender>unknown</gender>
        <email/>
    </personal>
    <body-measurements>
${ms.join('\n')}
    </body-measurements>
</smis>
`
}

const TO_MM = { mm: 1, cm: 10, inch: 25.4 }

/**
 * .smis (or .vit) text -> { measurements (FreeSewing names, mm), skipped: Seamly names not
 * mapped or not plain numbers (Seamly allows formulas) }
 */
export function fromSmis(text) {
  const unit = /<unit>\s*(\w+)\s*<\/unit>/.exec(text)?.[1] ?? 'cm'
  const scale = TO_MM[unit]
  if (!scale) throw new Error(`unknown unit ${unit}`)
  const measurements = {}
  const skipped = []
  for (const [, tag] of text.matchAll(/<m\b([^>]*)\/?>/g)) {
    const name = /\bname="([^"]*)"/.exec(tag)?.[1]
    const value = /\bvalue="([^"]*)"/.exec(tag)?.[1]
    const fs = FREESEWING_NAMES[name]
    const n = Number(value)
    if (!fs || value === undefined || value.trim() === '' || !Number.isFinite(n)) skipped.push(name)
    else measurements[fs] = ANGLES.has(fs) ? n : n * scale
  }
  return { measurements, skipped }
}
