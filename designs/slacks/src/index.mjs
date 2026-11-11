// Slacks: built from ../spec.yaml (Simons 1945, Diagrams 9-10, on the peg-top pants).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Slacks = spec.Design
export const { about } = spec
