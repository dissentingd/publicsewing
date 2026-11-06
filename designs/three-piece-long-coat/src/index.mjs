// Three-piece long coat: Merz Diagram XVII, built from ../spec.yaml.
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const ThreePieceLongCoat = spec.Design
export const { about } = spec
