// Knickerbockers: built from ../spec.yaml (Walker 1909, on Titan).
import { loadSpec } from '../../lib/spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Knickerbockers = spec.Design
export const { about } = spec
