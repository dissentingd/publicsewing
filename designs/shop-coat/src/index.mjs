// Shop coat: built from ../spec.yaml (Simons' Grocers' Gown, 1918, Diagram XIII, on Brian).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const ShopCoat = Design
export { about }
