// Dinner jacket: built from ../spec.yaml (Simons 1918, Diagram X, on the sack coat).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const DinnerJacket = spec.Design
export const { about } = spec
