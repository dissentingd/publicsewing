// Box coat: built from ../spec.yaml (Mitchell 1921, box coat, on Breanna).
import { loadSpec } from '../../lib/spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const BoxCoat = spec.Design
export const { about } = spec
