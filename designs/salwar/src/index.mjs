// Salwar: built from ../spec.yaml (inspired by CBSE 2014, Practical 3; cut flat).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Salwar = spec.Design
export const { about } = spec
