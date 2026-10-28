// Box overcoat: built from ../spec.yaml (Simons 1916, medium box overcoat, on the overcoat).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const BoxOvercoat = Design
export { about }
