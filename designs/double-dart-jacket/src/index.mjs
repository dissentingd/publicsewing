// Double-dart jacket: built from ../spec.yaml (Mitchell 1921, pp. 46-47, on the fitted jacket).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const DoubleDartJacket = spec.Design
export const { about } = spec
