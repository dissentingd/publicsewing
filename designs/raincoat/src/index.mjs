// Raincoat: built from ../spec.yaml (Simons 1922, on the overcoat).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Raincoat = spec.Design
export const { about } = spec
