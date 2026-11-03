// Kilt: built from ../spec.yaml (a wrap kilt; Simons 1922 for its hem and length).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Kilt = spec.Design
export const { about } = spec
