// Stands in for @freesewing/collection (a webpack alias in docusaurus.config.js), which the
// editor (@freesewing/react) uses for its list of designs and for option and part labels. It
// exports the same names, for PublicSewing's designs instead of FreeSewing's 73.
import specs from '../generated/specs.json'
import { designFromSpec } from '../../../designs/lib/spec.mjs'
import { i18n as brian } from '@freesewing/brian'
import { i18n as bent } from '@freesewing/bent'
import { i18n as breanna } from '@freesewing/breanna'
import { i18n as titan } from '@freesewing/titan'

export const designs = {}
for (const spec of Object.values(specs)) designs[spec.about.id] = designFromSpec(spec).Design

export const collection = Object.keys(designs)

export const requiredMeasurements = {}
export const optionalMeasurements = {}
export const measurements = {}
export const about = {}
for (const [id, design] of Object.entries(designs)) {
  requiredMeasurements[id] = design.patternConfig.measurements
  optionalMeasurements[id] = design.patternConfig.optionalMeasurements
  measurements[id] = [...requiredMeasurements[id], ...optionalMeasurements[id]]
  about[id] = { ...design.designConfig.data }
}
export const tags = [...new Set(Object.values(about).flatMap((a) => a.tags ?? []))].sort()
export const techniques = [...new Set(Object.values(about).flatMap((a) => a.techniques ?? []))].sort()
export const developers = []
export const designers = []
export const examples = { id: [], href: {} }

// Labels: the blocks' own (their strings are shared, e.g. 'brian:waistLine'); ours come in phase 2
export const i18n = { brian, bent, breanna, titan }
