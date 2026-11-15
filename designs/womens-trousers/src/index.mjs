// Women's trousers: built from ../spec.yaml (Simons 1945, Diagrams 39-40, on the suit trousers).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const WomensTrousers = spec.Design
export const { about } = spec
