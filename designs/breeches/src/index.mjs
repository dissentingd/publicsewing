// Breeches: built from ../spec.yaml (Simons 1916, Diagram XV, on the trousers).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Breeches = spec.Design
export const { about } = spec
