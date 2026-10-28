// Jumpsuit: built from ../spec.yaml (Thayaht's TuTa, 1920, via Open+Pattern; flat-cut).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Jumpsuit = spec.Design
export const { about } = spec
