// FreeSewing's Sarah (skirt block, after Aldrich) under PublicSewing's landmark names. Sarah's
// base drafts the half skirt flat: CB at x = 0 (cbTop, cbSeat, cbBottom), CF at the right
// (cfTop, cfSeat, cfBottom), the seat line at its waist-to-seat depth. Its other names are used
// as they are.
import { base } from '@freesewing/sarah'

export const sarah = {
  parts: { base },
  landmarks: {
    waistIn: 'cbTop', // waist at CB
    sideSeat: 'sideSeat', // side seam at the seat line
  },
}
