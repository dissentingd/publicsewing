// Field jacket: built from ../spec.yaml (Merz 1911, on the box coat).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const FieldJacket = spec.Design
export const { about } = spec
