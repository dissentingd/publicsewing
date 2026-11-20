// Pattern maps: printed piece numbers, seam and placement codes and a stitch key, from a spec's
// `patternMap:` (SPEC.md, "Pattern map"). No file access: the site's download buttons run this in
// the browser, with the specs bundled at build time. `extends` passes a parent's map on.
//
// A map is resolved against each draft, at its size and options: codes sit on drafted paths and
// points, never on stored coordinates, and a piece or path the options leave out drops its codes.

/**
 * Check a spec's map and name each piece's drafted part (`<prefix>.<name>`, an inherited piece
 * keeping its parent's prefix). Called by designFromSpec, which puts the result in the design's
 * data, so every tool reads it with mapFor(Design).
 */
export function prepareMap(spec) {
  const map = spec.patternMap
  if (!map) return null
  const partOf = (key) => {
    const piece = spec.pieces[key]
    if (!piece) throw new Error(`patternMap: no piece "${key}"`)
    return `${piece.prefix ?? spec.about.id}.${piece.name ?? key}`
  }
  const numbers = {}
  for (const [key, n] of Object.entries(map.pieces ?? {})) {
    if (Object.values(numbers).includes(n)) throw new Error(`patternMap: piece number ${n} is used twice`)
    numbers[partOf(key)] = n
  }
  const codes = {}
  for (const [code, c] of Object.entries(map.codes ?? {})) {
    if (!map.stitches?.[c.stitch]) throw new Error(`patternMap ${code}: unknown stitch "${c.stitch}"`)
    if (c.kind && !['seam', 'placement', 'closure'].includes(c.kind)) throw new Error(`patternMap ${code}: unknown kind "${c.kind}"`)
    const at = (c.at ?? []).map((a) => {
      const ways = ['path', 'between', 'point'].filter((k) => a[k] !== undefined)
      if (ways.length !== 1) throw new Error(`patternMap ${code}: each anchor needs one of path, between, point`)
      if (a.path && !(a.along >= 0 && a.along <= 1)) throw new Error(`patternMap ${code}: a path anchor needs along: 0..1`)
      return { ...a, piece: a.part, part: partOf(a.part) }
    })
    codes[code] = { ...c, kind: c.kind ?? 'seam', at }
  }
  return { numbers, stitches: map.stitches ?? {}, codes }
}

/** The design's prepared map, or null */
export const mapFor = (Design) => Design.designConfig.data?.patternMap ?? null

const drafted = (part) => part && !part.hidden && part.paths.seam && !part.paths.seam.hidden

/** Every code's position in its piece's own frame: [{ code, part, x, y }], for this draft */
export function resolve(pattern, map) {
  const parts = pattern.parts[0]
  const out = []
  for (const [code, c] of Object.entries(map.codes)) {
    for (const a of c.at) {
      const part = parts[a.part]
      if (!drafted(part)) {
        if (a.optional) continue
        throw new Error(`pattern map: missing ${a.part}`)
      }
      let point
      if (a.path) {
        const path = part.paths[a.path]
        if (!path) {
          if (a.optional) continue
          throw new Error(`pattern map: missing ${a.part}.${a.path}`)
        }
        point = path.shiftFractionAlong(a.along)
      } else if (a.between) {
        const [p, q] = a.between.map((k) => part.points[k])
        if (!p || !q) throw new Error(`pattern map: missing ${a.part} points ${a.between}`)
        point = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 }
      } else point = part.points[a.point]
      if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) throw new Error(`pattern map: invalid ${code} on ${a.part}`)
      out.push({ code, part: a.part, x: point.x, y: point.y })
    }
  }
  return out
}

/** The key's code lines, for the codes this draft drew */
export function legend(map, marks) {
  const active = new Set(marks.map((m) => m.code))
  return Object.entries(map.codes).filter(([code]) => active.has(code)).map(([code, c]) => `${code} ${c.name} (${c.stitch})`)
}

/** The key's stitch lines */
export const stitchLegend = (map) => Object.entries(map.stitches).map(([code, s]) => `${code} ${s.key}`)

/** What the exporters draw: the marks, both key parts and the printed piece numbers */
export function mapData(Design, pattern) {
  const map = mapFor(Design)
  if (!map) return null
  const marks = resolve(pattern, map)
  return { marks, legend: legend(map, marks), stitchLegend: stitchLegend(map), numbers: map.numbers }
}
