// Frock coat: built from ../spec.yaml (Simons 1918, Diagram XI, on the tailcoat).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const FrockCoat = spec.Design
export const { about } = spec
