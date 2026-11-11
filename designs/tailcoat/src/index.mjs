// Tailcoat: built from ../spec.yaml (Simons 1918, Diagram XII, on the surtout).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Tailcoat = spec.Design
export const { about } = spec
