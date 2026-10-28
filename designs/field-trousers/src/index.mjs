// Field trousers: built from ../spec.yaml (Open+Pattern CS95 field trouser, on the trousers).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const FieldTrousers = spec.Design
export const { about } = spec
