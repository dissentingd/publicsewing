// Churidar: built from ../spec.yaml (inspired by CBSE 2014, Practical 4; cut flat, on the bias).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Churidar = spec.Design
export const { about } = spec
