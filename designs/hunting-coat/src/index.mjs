// Hunting coat: built from ../spec.yaml (Simons' Hunting Coat, 1918, Diagram XII, on Brian).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const HuntingCoat = Design
export { about }
