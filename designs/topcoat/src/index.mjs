// Topcoat: built from ../spec.yaml (ЕМКО СЭВ т.3's demi-season coat, 1988, §2, on the military
// blouse's three-piece body on Bent).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Topcoat = Design
export { about }
