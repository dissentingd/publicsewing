// Dressing gown: built from ../spec.yaml (Vincent 1890, p. 27, on the overcoat).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const DressingGown = Design
export { about }
