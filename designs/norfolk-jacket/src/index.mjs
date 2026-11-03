// Norfolk jacket: built from ../spec.yaml (Simons 1922, Diagrams 6-7, on the hunting coat).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const NorfolkJacket = Design
export { about }
