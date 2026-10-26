// FreeSewing's Titan (trouser block) under PublicSewing's landmark names. Titan's other names
// (knee, kneeIn, kneeOut, floor, ...) are used as they are.
import { back, front } from '@freesewing/titan'

export const titan = {
  parts: { back, front },
  landmarks: {
    crotchPoint: 'fork', // inseam meets the crotch seam
    waistIn: 'styleWaistIn', // waist at CB / CF
    waistOut: 'styleWaistOut', // waist at the outseam
    sideSeat: 'seatOut', // outseam at the seat line
  },
}
