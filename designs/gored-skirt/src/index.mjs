// Gored skirt: built from ../spec.yaml (Mitchell 1921, pp. 84-101, on Sarah).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const GoredSkirt = spec.Design
export const { about } = spec
