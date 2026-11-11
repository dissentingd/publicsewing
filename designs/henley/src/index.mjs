// Henley: our own design on FreeSewing's Bibi knit block, with a box placket (lib/knit.mjs,
// lib/placket.mjs) and a knit neckband or collar (lib/rib.mjs).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, parts, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Henley = Design
export const { back, front, sleeve, cuff, hemBand, placket, neckBand, collar } = parts
export { about }
