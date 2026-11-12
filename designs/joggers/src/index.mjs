import { loadSpec } from '../../lib/load-spec.mjs'
const { Design, parts, about } = loadSpec(new URL('../spec.yaml', import.meta.url))
export const Joggers = Design
export const { front, back, cuff, pocketBag } = parts
export { about }
