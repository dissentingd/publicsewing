// Overcoat: built from ../spec.yaml (Simons 1916, regular overcoat, on the peacoat).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Overcoat = Design
export { about }
