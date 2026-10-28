// Balmacaan: built from ../spec.yaml (Simons 1916, on the overcoat).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Balmacaan = Design
export { about }
