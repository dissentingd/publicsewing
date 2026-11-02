// Pleated skirt: built from ../spec.yaml (Mitchell 1921, pp. 102-107, on the gored skirt).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const PleatedSkirt = spec.Design
export const { about } = spec
