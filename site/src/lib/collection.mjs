// Stands in for @freesewing/collection (a webpack alias in docusaurus.config.js), which the
// editor (@freesewing/react) uses for its list of designs and for option and part labels. It
// exports the same names, for PublicSewing's designs instead of FreeSewing's 73.
import specs from '../generated/specs.json'
import labels from '../generated/labels.json'
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

// Labels: the blocks' own (their strings are shared, e.g. 'brian:waistLine'), and for each of our
// designs the FreeSewing shape { en: { o, p } }: its block's option labels, then labels.yaml's,
// then the spec's own `title` / `description`; list choices as `<option>.<choice>`
const blockI18n = { brian, bent, breanna, titan }
export const i18n = { ...blockI18n }
for (const spec of Object.values(specs)) {
  const o = { ...blockI18n[spec.block]?.en?.o }
  for (const [name, l] of Object.entries(labels.options)) {
    o[name] = { t: l.title, d: l.description }
    for (const [c, t] of Object.entries(l.choices ?? {})) o[`${name}.${c}`] = { t, d: '' }
  }
  for (const [name, so] of Object.entries(spec.options ?? {}))
    if (so.title || so.description) o[name] = { t: so.title ?? o[name]?.t, d: so.description ?? o[name]?.d }
  i18n[spec.about.id] = { en: { o, p: { ...labels.parts } } }
}
