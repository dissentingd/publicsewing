// FreeSewing's Brian (men's upper-body block) under PublicSewing's landmark names.
// A spec names landmarks by their standard name; `landmarks` maps the ones whose Brian name
// differs. Any other name is looked up on the part as is (Brian's own names: cfNeck, cbNeck,
// cfWaist, armholeHollow, armholePitch, ...). The coat operations (lib/coat.mjs) add cfHem,
// cbHem, cfSeat, sideWaist, seat and hem.
import { back, front } from '@freesewing/brian'

export const brian = {
  parts: { back, front },
  landmarks: {
    underarm: 'armhole', // side seam meets the armhole
    neckPoint: 's3CollarSplit', // shoulder seam meets the neckline (Brian's hps, moved by s3Collar)
    shoulderTip: 's3ArmholeSplit', // shoulder seam meets the armhole
    sideSeat: 'seat', // side seam at the seat line
    sideHem: 'hem', // side seam meets the hem
  },
}
