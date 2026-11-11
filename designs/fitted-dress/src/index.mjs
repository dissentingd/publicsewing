// Fitted dress: our own design on FreeSewing's Bella bodice block (lib/bodice.mjs).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, parts, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const FittedDress = Design
export const { back, front, sleeve, skirtFront, skirtBack } = parts
export { about }
