// Sack coat: built from ../spec.yaml (Simons 1918, Diagram III, on the suit jacket).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const SackCoat = spec.Design
export const { about } = spec
