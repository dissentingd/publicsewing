// Yoke skirt: built from ../spec.yaml (Aldrich, yoked skirt with gores).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const YokeSkirt = spec.Design
export const { about } = spec
