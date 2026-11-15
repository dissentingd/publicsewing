// Jodhpurs: built from ../spec.yaml (Simons 1945, Diagrams 18 and 45, on the breeches).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Jodhpurs = spec.Design
export const { about } = spec
