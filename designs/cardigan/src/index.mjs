// Cardigan: our own design on FreeSewing's Bibi knit block, with an open V front (lib/knit.mjs)
// and a buttoned front band (lib/placket.mjs).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, parts, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Cardigan = Design
export const { back, front, sleeve, cuff, hemBand, frontBand } = parts
export { about }
