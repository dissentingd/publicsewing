// Pinafore: built from ../spec.yaml (Walker 1909, on Brian, from templates/yoke.yaml).
import { loadSpec } from '../../lib/spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Pinafore = spec.Design
export const { about } = spec
