// Trousers: built from ../spec.yaml (ЕМКО СЭВ т.3 §7, on Titan).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Trousers = spec.Design
export const { about } = spec
