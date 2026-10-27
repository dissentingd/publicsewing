// Windbreaker: built from ../spec.yaml (ЕМКО СЭВ т.3's summer jacket, 1988, §4, on Brian).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, parts, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Windbreaker = Design
export const { backYoke, back, frontYoke, front, facing, hood, collar, sleeve } = parts
export { about }
