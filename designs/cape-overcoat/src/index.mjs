// Cape overcoat: built from ../spec.yaml (Simons 1916, pp. 30-31).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const CapeOvercoat = spec.Design
export const { about } = spec
