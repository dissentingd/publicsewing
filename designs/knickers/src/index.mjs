// Knickers: built from ../spec.yaml (Simons 1922, Diagram 41, on the trousers).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Knickers = spec.Design
export const { about } = spec
