// Golf pants: built from ../spec.yaml (Simons 1922, on the breeches).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const GolfPants = spec.Design
export const { about } = spec
