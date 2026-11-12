import { loadSpec } from '../../lib/load-spec.mjs'
const { Design, parts, about } = loadSpec(new URL('../spec.yaml', import.meta.url))
export const HarringtonJacket = Design
export const { back, front, facing, collar, sleeve, cuff, waistband } = parts
export { about }
