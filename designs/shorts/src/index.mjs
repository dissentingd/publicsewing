// Shorts: built from ../spec.yaml (Simons 1945, Diagrams 21, 35 and 41, on the suit trousers).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Shorts = spec.Design
export const { about } = spec
