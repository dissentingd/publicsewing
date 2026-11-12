import { loadSpec } from '../../lib/load-spec.mjs'
const { Design, parts, about } = loadSpec(new URL('../spec.yaml', import.meta.url))
export const WrapDress = Design
export const { back, front, sleeve, skirtFront, skirtBack, tie } = parts
export { about }
