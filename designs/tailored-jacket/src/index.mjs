// Tailored jacket: built from ../spec.yaml (Mitchell 1921, semi-fitted jacket, on Breanna).
import { loadSpec } from '../../lib/spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const TailoredJacket = spec.Design
export const { about } = spec
