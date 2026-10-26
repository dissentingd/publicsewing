// FreeSewing's Breanna (women's bodice block) under PublicSewing's landmark names. Its own
// names (hps, shoulder, armhole, cfNeck, cfWaist, cbNeck, cbWaist, waist, ...) are used as
// they are; the jacket operations (lib/jacket.mjs) read its darts by name.
import { back, front } from '@freesewing/breanna'

export const breanna = {
  parts: { back, front },
  landmarks: {
    underarm: 'armhole', // side seam meets the armhole
    neckPoint: 'hps', // shoulder seam meets the neckline
    shoulderTip: 'shoulder', // shoulder seam meets the armhole
    sideWaist: 'waist', // side seam at the waist
  },
}
