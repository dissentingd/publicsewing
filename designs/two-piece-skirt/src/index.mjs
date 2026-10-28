// Two-piece skirt: built from ../spec.yaml (Mitchell 1921, p. 86, on the gored skirt).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const TwoPieceSkirt = spec.Design
export const { about } = spec
