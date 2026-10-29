// Middy blouse: built from ../spec.yaml (Simons 1922, Diagram 9, on the yoke template).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const MiddyBlouse = spec.Design
export const { about } = spec
