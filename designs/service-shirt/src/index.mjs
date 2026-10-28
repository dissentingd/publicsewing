// Service shirt: built from ../spec.yaml (Vincent 1890 coat shirt, Simons 1918 collar, on the pyjama jacket).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const ServiceShirt = spec.Design
export const { about } = spec
