// Smoking jacket: built from ../spec.yaml (Vincent 1890, on the dressing gown).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const SmokingJacket = spec.Design
export const { about } = spec
