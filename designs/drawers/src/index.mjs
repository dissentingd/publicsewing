// Drawers: built from ../spec.yaml (Vincent 1890, on the overall pants).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Drawers = spec.Design
export const { about } = spec
