// Ulster: built from ../spec.yaml (Simons 1916, D.B. ulster collar overcoat, on the peacoat).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Ulster = Design
export { about }
