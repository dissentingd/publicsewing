// Bar vest: built from ../spec.yaml (Simons' Bar Vest, 1918, Diagram XVI, on Brian).
import { loadSpec } from '../../lib/spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const BarVest = Design
export { about }
