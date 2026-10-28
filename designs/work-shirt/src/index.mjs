// Work shirt: built from ../spec.yaml (Vincent 1890, the working-man's shirt, on the yoke template).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const WorkShirt = spec.Design
export const { about } = spec
