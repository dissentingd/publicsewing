// Dolman cape: built from ../spec.yaml (Pivnick 1949, Chapter XIX; lib/cape.mjs).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const DolmanCape = Design
export { about }
