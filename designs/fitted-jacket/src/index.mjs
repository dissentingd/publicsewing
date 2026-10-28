// Fitted jacket: built from ../spec.yaml (Mitchell 1921, tight-fitted jacket, on Breanna).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const FittedJacket = spec.Design
export const { about } = spec
