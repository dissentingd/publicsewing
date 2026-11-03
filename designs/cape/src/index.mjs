// Cape: built from ../spec.yaml (Mitchell 1921, pp. 58-59; lib/cape.mjs).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Cape = Design
export { about }
