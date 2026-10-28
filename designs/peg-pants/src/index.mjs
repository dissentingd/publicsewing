// Peg-top pants: built from ../spec.yaml (Simons 1916, Diagram VIII, on the trousers).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const PegPants = spec.Design
export const { about } = spec
