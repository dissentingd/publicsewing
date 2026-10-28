// Boy's jacket: built from ../spec.yaml (Simons 1922, on the jacket).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const BoysJacket = spec.Design
export const { about } = spec
