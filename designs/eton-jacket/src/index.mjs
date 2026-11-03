// Eton jacket: built from ../spec.yaml (Simons 1922, on the boys' suit jacket).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const EtonJacket = spec.Design
export const { about } = spec
