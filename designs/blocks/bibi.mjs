// FreeSewing's Bibi (knit top and dress block, on Brian: a back, a front whose side seam takes a
// bust dart or gathers, a sleeve, and a neck binding) under PublicSewing's landmark names. Its own
// names (hps, shoulder, armhole, waist, hips, hem, cfNeck, cbNeck, ...) are used as they are.
// Its pieces have no single `seam` path: the side seam, hem, shoulder and armhole are separate
// paths, and the store holds the dart (`dart`) and the neck sizes. test/knit-checks.mjs checks it
// (BUILD_QUEUE B2, 2026-11-10).
import { back, front, sleeve, neckBinding } from '@freesewing/bibi'

export const bibi = {
  parts: { back, front, sleeve, neckBinding },
  landmarks: {
    underarm: 'armhole', // side seam meets the armhole
    neckPoint: 'hps', // shoulder seam meets the neckline
    shoulderTip: 'shoulder', // shoulder seam meets the armhole
    sideWaist: 'waist', // side seam at the waist
    sideHips: 'hips',
    sideHem: 'hem', // side seam at the hem
  },
}
