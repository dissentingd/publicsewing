// Sailor pants: built from ../spec.yaml (Simons 1922, Diagram 46, on the overall pants).
import { loadSpec } from '../../lib/load-spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const SailorPants = Design
export { about }
