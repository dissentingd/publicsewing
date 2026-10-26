// Chore coat: built from ../spec.yaml (Simons' Work Coat, 1918, Diagram VIII, on Brian).
import { loadSpec } from '../../lib/spec.mjs'

const { Design, parts, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const ChoreCoat = Design
export const { back, front, facing: frontFacing, collar, sleeve, breastPocket, lowerPocket } = parts
export { about }
