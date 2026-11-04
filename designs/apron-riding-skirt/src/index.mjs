import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const ApronRidingSkirt = spec.Design
export const { about } = spec
