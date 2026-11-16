// Kalidar kurta: built from ../spec.yaml (inspired by CBSE 2014, Practical 11, cut flat).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const KalidarKurta = spec.Design
export const { about } = spec
