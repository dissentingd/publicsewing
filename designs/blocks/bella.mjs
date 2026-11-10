// FreeSewing's Bella (womenswear bodice block: a back with a waist dart, a front with a side bust
// dart and a waist dart, and a one-piece sleeve) under PublicSewing's landmark names. Its own
// names (hps, shoulder, armhole, cfNeck, cbNeck, cfHem, waistDart*, bustDart*, ...) are used as
// they are. test/bodice-checks.mjs measures its seams (BUILD_QUEUE B1, 2026-11-10).
import { back, frontSideDart, sleeve } from '@freesewing/bella'

export const bella = {
  parts: { back, front: frontSideDart, sleeve },
  landmarks: {
    underarm: 'armhole', // side seam meets the armhole
    neckPoint: 'hps', // shoulder seam meets the neckline
    shoulderTip: 'shoulder', // shoulder seam meets the armhole
    sideWaist: ['waistSide', 'sideHem'], // side seam at the waist: the back's name, then the front's
    cfWaist: 'cfHem', // the front ends at the waist
  },
}
