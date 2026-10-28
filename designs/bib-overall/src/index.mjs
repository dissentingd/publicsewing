// Bib overall: built from ../spec.yaml (Simons 1916, Diagram XII, on the work pants).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const BibOverall = spec.Design
export const { about } = spec
