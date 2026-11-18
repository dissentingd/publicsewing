// Fitted kameez: built from ../spec.yaml (inspired by CBSE 2014, Practical 9, on Bella).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const FittedKameez = spec.Design
export const { about } = spec
