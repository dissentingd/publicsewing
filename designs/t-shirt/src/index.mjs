// T-shirt: Open+Pattern's Standard T-shirt proportions redrafted on Brian.
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, parts, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const TShirt = Design
export const { back, front, collar, sleeve } = parts
export { about }
