// Prince Albert jacket: built from ../spec.yaml (Mitchell 1921, on the fitted jacket).
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const PrinceAlbertJacket = spec.Design
export const { about } = spec
