// Which measurements each design needs (from src/generated/measurements.json), and how to take
// each one. The wording is ours.
import React from 'react'
import Link from '@docusaurus/Link'
import designs from '@site/src/generated/measurements.json'

export const guide = {
  chest: ['Chest', 'Around the fullest part of the chest (or bust), under the arms, tape level all round.'],
  highBust: ['High bust', 'Around the chest above the bust, high under the arms and across the shoulder blades.'],
  highBustFront: ['High bust, front', 'The front half of the high bust: from side seam to side seam, under the arms.'],
  bustFront: ['Bust, front', 'The front half of the bust: from side seam to side seam across the fullest part.'],
  bustSpan: ['Bust span', 'Straight across between the two bust points.'],
  waist: ['Waist', 'Around the natural waist, the narrowest part of the torso. Tie a string round it first: other measurements start from it.'],
  waistBack: ['Waist, back', 'The back half of the waist, from side to side.'],
  seat: ['Seat', 'Around the fullest part of the seat (the buttocks), feet together.'],
  seatBack: ['Seat, back', 'The back half of the seat, from side to side.'],
  neck: ['Neck', 'Around the base of the neck, where a shirt collar sits, one finger under the tape.'],
  biceps: ['Biceps', 'Around the fullest part of the upper arm, arm relaxed.'],
  wrist: ['Wrist', 'Around the wrist bone.'],
  knee: ['Knee', 'Around the knee, leg straight.'],
  shoulderToShoulder: ['Shoulder to shoulder', 'Across the back from one shoulder point (the bony tip) to the other.'],
  shoulderSlope: ['Shoulder slope', 'The angle of the shoulder from the neck down to the shoulder point, in degrees. About 13° is typical; under 10° is square, over 18° sloping.'],
  shoulderToWrist: ['Shoulder to wrist', 'From the shoulder point down the outside of the arm to the wrist bone, arm hanging straight.'],
  shoulderToElbow: ['Shoulder to elbow', 'From the shoulder point to the point of the elbow, arm bent a little.'],
  hpsToBust: ['HPS to bust', 'From the high point of the shoulder (where the shoulder meets the neck) straight down to the bust point (or the chest line).'],
  hpsToWaistBack: ['HPS to waist, back', 'From the high point of the shoulder down the back to the waist string.'],
  hpsToWaistFront: ['HPS to waist, front', 'From the high point of the shoulder down the front, over the bust, to the waist string.'],
  waistToArmpit: ['Waist to armpit', 'From the waist string up the side to the armpit.'],
  waistToHips: ['Waist to hips', 'From the waist string down the side to the top of the hip bone (where trousers sit).'],
  waistToSeat: ['Waist to seat', 'From the waist string down the side to the fullest part of the seat.'],
  waistToUpperLeg: ['Waist to upper leg', 'From the waist string down the side to where the leg meets the seat.'],
  waistToKnee: ['Waist to knee', 'From the waist string down the side to the middle of the knee.'],
  waistToFloor: ['Waist to floor', 'From the waist string down the side to the floor, barefoot.'],
  crossSeam: ['Crotch length', 'From the waist at the centre front, between the legs, to the waist at the centre back.'],
  crossSeamFront: ['Crotch length, front', 'The front part of the crotch length: from the centre-front waist to between the legs, under the body.'],
}

export function MeasurementGuide() {
  return (
    <dl>
      {Object.entries(guide).map(([id, [title, how]]) => (
        <React.Fragment key={id}>
          <dt id={id}>
            {title} <code>{id}</code>
          </dt>
          <dd>{how}</dd>
        </React.Fragment>
      ))}
    </dl>
  )
}

export function MeasurementTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Design</th>
          <th>Needs</th>
          <th>Optional</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(designs).map(([id, d]) => (
          <tr key={id}>
            <td>
              <Link to={`/designs/${id}`}>{d.name}</Link>
            </td>
            <td>{d.required.map((m) => guide[m]?.[0] ?? m).join(', ')}</td>
            <td>{d.optional.map((m) => guide[m]?.[0] ?? m).join(', ') || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
