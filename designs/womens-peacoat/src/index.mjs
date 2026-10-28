// Women's peacoat: built from ../spec.yaml (Merz 1911, on the tailored jacket).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const WomensPeacoat = spec.Design
export const { about } = spec
