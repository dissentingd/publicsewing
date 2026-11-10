// FreeSewing's Noble (princess bodice block, on Bella: Bella's darts run on into princess seams to
// the shoulder or the armhole, `dartPosition`) under PublicSewing's landmark names. Its own names
// (hps, shoulder, armhole, cfNeck, cbNeck, cfHem, waistSide, sideHem, ...) are used as they are.
// Its back pieces keep Bella's whole back as their `seam` path; their outlines are `insideSeam`
// and `outsideSeam`. test/bodice-checks.mjs (checkPrincess) checks it (BUILD_QUEUE B4, 2026-11-10).
import { backInside, backOutside, frontInside, frontOutside } from '@freesewing/noble'

export const noble = {
  parts: { backInside, backOutside, frontInside, frontOutside },
  landmarks: {
    underarm: 'armhole', // side seam meets the armhole (on the outside pieces)
    neckPoint: 'hps', // shoulder seam meets the neckline (on the inside pieces)
    shoulderTip: 'shoulder', // shoulder seam meets the armhole
    sideWaist: ['waistSide', 'sideHem'], // side seam at the waist: the back's name, then the front's
    cfWaist: 'cfHem',
  },
}
