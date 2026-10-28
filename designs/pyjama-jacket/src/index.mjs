// Pyjama jacket: built from ../spec.yaml (Vincent 1890, on the barber's coat).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const PyjamaJacket = Design
export { about }
