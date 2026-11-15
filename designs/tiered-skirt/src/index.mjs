// Tiered skirt: built from ../spec.yaml (Joseph-Armstrong, attached tiers).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const TieredSkirt = spec.Design
export const { about } = spec
