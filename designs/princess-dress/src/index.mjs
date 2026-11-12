import { loadSpec } from '../../lib/load-spec.mjs'
const { Design, parts, about } = loadSpec(new URL('../spec.yaml', import.meta.url))
export const PrincessDress = Design
export const { backInside, backOutside, frontInside, frontOutside } = parts
export { about }
