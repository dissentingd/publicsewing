// Mackinaw: built from ../spec.yaml (Simons' belted mackinaw, 1918, Diagrams XVII, XX, XXI,
// on Brian).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Mackinaw = Design
export { about }
