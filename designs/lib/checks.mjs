// Sanity checks on the measurements a visitor enters: a warning in the pattern tool (its Flags menu)
// when one is badly out of proportion with another, which usually means a slip or the wrong units.
// The limits are well outside every size set we hold (test/measurement-checks.test.mjs checks them
// against all of them), so an unusual body shouldn't set them off. Each is a warning, never a stop.

// [measurement, compared with, lowest ratio, highest ratio]
const proportions = [
  ['neck', 'chest', 0.25, 0.7],
  ['waist', 'chest', 0.5, 1.5],
  ['seat', 'chest', 0.65, 1.6],
  ['biceps', 'chest', 0.15, 0.55],
  ['wrist', 'biceps', 0.25, 1.1],
  ['shoulderToShoulder', 'chest', 0.25, 0.7],
  ['highBust', 'chest', 0.75, 1.2],
  ['knee', 'seat', 0.2, 0.7],
  ['hpsToWaistBack', 'chest', 0.25, 0.8],
  ['waistToFloor', 'chest', 0.6, 2],
]
// Each of these has to be shorter than the next
const shorterThan = [
  ['shoulderToElbow', 'shoulderToWrist'],
  ['waistToArmpit', 'hpsToWaistBack'],
  ['waistToHips', 'waistToSeat'],
  ['waistToSeat', 'waistToKnee'],
  ['waistToKnee', 'waistToFloor'],
]
const chestRange = [300, 2200] // mm: below or above this, most likely the wrong units
const slopeRange = [0, 40] // degrees

const words = (m) =>
  m
    .replace(/^hps/, 'HPS')
    .replace(/[A-Z]/g, (c, i) => (i === 0 ? c : ` ${c.toLowerCase()}`))
    .replace(/^H p s/, 'HPS')
    .replace(/^[a-z]/, (c) => c.toUpperCase())

/** What looks wrong with these measurements (mm, shoulder slope in degrees), in plain words */
export function measurementProblems(m) {
  const out = []
  if (m.chest !== undefined && (m.chest < chestRange[0] || m.chest > chestRange[1]))
    out.push(`Chest is ${Math.round(m.chest / 10)} cm: are the units right?`)
  if (m.shoulderSlope !== undefined && (m.shoulderSlope < slopeRange[0] || m.shoulderSlope > slopeRange[1]))
    out.push(`Shoulder slope is ${m.shoulderSlope}°: about 13° is typical.`)
  for (const [a, b, low, high] of proportions) {
    if (!(m[a] > 0 && m[b] > 0)) continue
    const r = m[a] / m[b]
    if (r < low) out.push(`${words(a)} looks small beside ${words(b).toLowerCase()}.`)
    if (r > high) out.push(`${words(a)} looks large beside ${words(b).toLowerCase()}.`)
  }
  for (const [a, b] of shorterThan) {
    if (m[a] > 0 && m[b] > 0 && m[a] >= m[b]) out.push(`${words(a)} should be shorter than ${words(b).toLowerCase()}.`)
  }
  return out
}

/** Raises the warning in the pattern tool, if there's anything to say */
export function flagMeasurements({ store, measurements }) {
  const problems = measurementProblems(measurements)
  if (!problems.length) return
  store.flag.warn({
    id: 'measurementsLookWrong',
    title: 'Please check these measurements',
    desc: `${problems.join(' ')} See how to take them on the [Measure page](/measure).`,
  })
}
