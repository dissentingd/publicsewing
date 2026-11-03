// Kimono jacket: built from ../spec.yaml (Mitchell 1921, pp. 40-41, on the tailored jacket).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const KimonoJacket = spec.Design
export const { about } = spec
