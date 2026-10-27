// Waistcoat: built from ../spec.yaml (ЕМКО СЭВ т.3 §6, on Brian).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Waistcoat = spec.Design
export const { about } = spec
