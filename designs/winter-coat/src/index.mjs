// Winter coat: built from ../spec.yaml (ЕМКО СЭВ т.3's winter coat, 1988, §3, on the
// windbreaker's yoked body).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, parts, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const WinterCoat = Design
export const { backYoke, back, frontYoke, front, facing, hood, collar, sleeve } = parts
export { about }
