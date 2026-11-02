// Shirt: built from ../spec.yaml (Vincent 1890 yoked shirt, collar and cuffs, on the service shirt).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Shirt = spec.Design
export const { about } = spec
