// Peacoat: built from ../spec.yaml (the mackinaw with Simons' 1916 double-breasted overcoat
// details).
import { loadSpec } from '../../lib/spec.mjs'

const { Design, about } = loadSpec(new URL('../spec.yaml', import.meta.url))

export const Peacoat = Design
export { about }
