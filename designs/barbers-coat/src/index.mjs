// Barber's coat: built from ../spec.yaml (Simons' Barbers' Coats, 1918, Diagrams X and XI, on
// Brian).
import { loadSpec } from '../../lib/spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const BarbersCoat = Design
export { about }
