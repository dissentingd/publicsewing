// Pyjama trousers: built from ../spec.yaml (Vincent 1890, on the knickerbockers).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const PyjamaTrousers = Design
export { about }
