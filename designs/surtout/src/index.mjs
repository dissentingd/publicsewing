// Surtout: built from ../spec.yaml (Simons 1916, pp. 38-39, on the suit jacket).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Surtout = Design
export { about }
