// Knee pants: built from ../spec.yaml (Simons 1922, Diagram 40, on the trousers).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const KneePants = spec.Design
export const { about } = spec
