import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))
export const TunicSkirt = spec.Design
export const { about } = spec
