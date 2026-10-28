// Overall pants: built from ../spec.yaml (Simons 1916, Diagram XIII, on the work pants).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const OverallPants = spec.Design
export const { about } = spec
