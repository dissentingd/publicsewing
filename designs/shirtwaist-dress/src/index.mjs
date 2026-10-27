// Shirtwaist dress: built from ../spec.yaml (Woman's Institute, Pattern Drafting, §2, on Brian,
// from templates/yoke.yaml).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const ShirtwaistDress = spec.Design
export const { about } = spec
