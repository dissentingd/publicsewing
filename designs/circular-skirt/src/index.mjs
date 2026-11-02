// Circular skirt: built from ../spec.yaml (Mitchell 1921, pp. 110-113, on the two-piece skirt).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const CircularSkirt = spec.Design
export const { about } = spec
