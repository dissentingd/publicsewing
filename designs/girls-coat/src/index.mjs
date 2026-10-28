// Girl's coat: built from ../spec.yaml (Sheifer 1908, on the box coat).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const GirlsCoat = spec.Design
export const { about } = spec
