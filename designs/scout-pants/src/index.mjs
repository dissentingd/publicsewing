// Scout pants: built from ../spec.yaml (Simons 1922, Diagram 44).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const ScoutPants = spec.Design
export const { about } = spec
