// FreeSewing's Bent (Brian with a two-piece sleeve) under PublicSewing's landmark names: the
// same names as Brian, which Bent inherits.
import { back, front } from '@freesewing/bent'
import { brian } from './brian.mjs'

export const bent = {
  parts: { back, front },
  landmarks: brian.landmarks,
}
