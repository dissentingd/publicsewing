// Riding frock coat: Merz Diagram XIV, built from ../spec.yaml.
import { loadSpec } from '../../lib/load-spec.mjs'

const spec = loadSpec(new URL('../spec.yaml', import.meta.url))

export const RidingFrockCoat = spec.Design
export const { about } = spec
