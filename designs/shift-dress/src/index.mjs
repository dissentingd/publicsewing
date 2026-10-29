// Shift dress: built from ../spec.yaml (Pivnick 1949, one-piece dress foundation, on the yoke template).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const ShiftDress = spec.Design
export const { about } = spec
