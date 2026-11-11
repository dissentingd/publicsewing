// FreeSewing's Bibi (knit top and dress block, on Brian: a back, a front whose side seam takes a
// bust dart or gathers, a sleeve, and a neck binding) under PublicSewing's landmark names. Its own
// names (hps, shoulder, armhole, waist, hips, hem, cfNeck, cbNeck, ...) are used as they are.
// Its pieces have no single `seam` path: the side seam, hem, shoulder and armhole are separate
// paths, and the store holds the dart (`dart`) and the neck sizes (`block.neckSizeBack` and
// `block.neckSizeFront` in a spec: half the neck each). test/knit-checks.mjs checks it
// (BUILD_QUEUE B2, 2026-11-10).
import { back, front, sleeve, neckBinding, cuff, waistband } from '@freesewing/bibi'

export const bibi = {
  // cuff and waistband: Bibi's rib cuffs and hem band, drafted (and shown) only with
  // useCuffRibbing / useWaistRibbing; a piece from them needs that `if:`
  parts: { back, front, sleeve, neckBinding, cuff, waistband },
  landmarks: {
    underarm: 'armhole', // side seam meets the armhole
    neckPoint: 'hps', // shoulder seam meets the neckline
    shoulderTip: 'shoulder', // shoulder seam meets the armhole
    sideWaist: 'waist', // side seam at the waist
    sideHips: 'hips',
    sideHem: 'hem', // side seam at the hem
  },
}
