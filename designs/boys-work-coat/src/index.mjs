// Boys' work coat: built from ../spec.yaml (the chore coat with Simons' boys' details, 1918,
// Diagram XV).
import { loadSpec } from '../../lib/spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const BoysWorkCoat = Design
export { about }
