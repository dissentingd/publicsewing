// Gathered skirt: built from ../spec.yaml (Walker 1909, frock skirt).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const GatheredSkirt = spec.Design
export const { about } = spec
