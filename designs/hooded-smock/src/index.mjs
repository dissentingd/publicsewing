// Hooded smock: built from ../spec.yaml (Open+Pattern US tactical smock, on the yoke template).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const HoodedSmock = spec.Design
export const { about } = spec
