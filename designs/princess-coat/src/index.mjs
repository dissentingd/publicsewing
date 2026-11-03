// Princess coat: built from ../spec.yaml (Pivnick 1949, on the women's peacoat).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const PrincessCoat = spec.Design
export const { about } = spec
