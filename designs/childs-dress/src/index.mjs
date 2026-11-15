// Child's dress: built from ../spec.yaml (Pivnick 1949, Patterns 105-106, on the shift dress).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const ChildsDress = spec.Design
export const { about } = spec
