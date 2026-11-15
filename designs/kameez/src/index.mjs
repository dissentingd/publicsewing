// Kameez: built from ../spec.yaml (inspired by CBSE 2014, Practicals 9-10, on the shift dress).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Kameez = spec.Design
export const { about } = spec
