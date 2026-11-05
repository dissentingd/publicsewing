import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))
export const CyclingBreeches = spec.Design
export const { about } = spec
