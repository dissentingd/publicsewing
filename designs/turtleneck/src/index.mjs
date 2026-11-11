// Turtleneck: our own design on FreeSewing's Bibi knit block, with a rib collar (lib/rib.mjs).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, parts, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Turtleneck = Design
export const { back, front, sleeve, cuff, hemBand, collar } = parts
export { about }
