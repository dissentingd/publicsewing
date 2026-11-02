// Kimono dress: built from ../spec.yaml (Pivnick 1949, Pattern 101, pp. 290-295, on the yoke template).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const KimonoDress = spec.Design
export const { about } = spec
