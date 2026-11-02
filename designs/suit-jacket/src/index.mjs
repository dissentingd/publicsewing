// Jacket: built from ../spec.yaml (ЕМКО СЭВ т.3 §1, on the topcoat's body on Bent).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Jacket = spec.Design
export const { about } = spec
