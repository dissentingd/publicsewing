// Button-on middy: built from ../spec.yaml (Simons 1922, Diagram 10, on the pyjama jacket).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const ButtonMiddy = spec.Design
export const { about } = spec
