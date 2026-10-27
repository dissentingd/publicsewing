// Nightgown: built from ../spec.yaml (Walker 1909, on Brian, from templates/yoke.yaml).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Nightgown = spec.Design
export const { about } = spec
