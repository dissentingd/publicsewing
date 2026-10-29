// Culottes: built from ../spec.yaml (Pivnick 1949, divided skirt, on the two-piece skirt).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Culottes = spec.Design
export const { about } = spec
