// Quilted jacket: built from ../spec.yaml (ЕМКО СЭВ т.3's insulated jacket, 1988, §5, on the
// windbreaker's body).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, parts, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const QuiltedJacket = Design
export const { backYoke, back, frontYoke, front, facing, hood, collar, sleeve } = parts
export { about }
