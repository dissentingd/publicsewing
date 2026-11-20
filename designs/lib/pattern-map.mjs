// The one place that says which designs carry a pattern map, and where its records live.
// Tools ask `mapFor(Design)` instead of testing a design id themselves. For now the chore coat's
// map is a design-local module; the planned refactor moves map records into each spec
// (`patternMap:`), read here, so `extends` passes a map on and the browser exporters get it too.
import * as chore from '../chore-coat/pattern-map.mjs'

const maps = { chorecoat: chore }

/** The design's map module ({ resolve, legend, anchors, seams, ... }), or null */
export const mapFor = (Design) => maps[Design.designConfig.data?.id] ?? null
