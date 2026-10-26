// Military blouse: built from ../spec.yaml (Simons' Military Blouse, 1918, Diagram XIV, on
// Bent).
import { loadSpec } from '../../lib/spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const MilitaryBlouse = Design
export { about }
