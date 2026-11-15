// Jeans: built from ../spec.yaml (inspired by Joseph-Armstrong 2010 and Aldrich 2015, on the suit trousers).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Jeans = spec.Design
export const { about } = spec
