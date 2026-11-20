// Geometry-linked map for the chore coat. Fractions are along drafted paths, in piece-local
// coordinates; no preview pixels or export-layout coordinates are stored here.
export const pieces = { front: 1, back: 2, sleeve: 3, collar: 4, facing: 5, breastPocket: 6, lowerPocket: 7 }

export const stitches = {
  FF: 'flat-felled seam', SS: 'straight seam', TS: 'topstitch', BH: 'buttonhole',
}
export const stitchLegend = [
  'FF flat-fell the allowances', 'SS straight-join; finish raw edges',
  'TS turn edge and topstitch', 'BH reinforced machine buttonhole',
]

export const seams = {
  A: ['shoulder', 'FF'], B: ['side seam', 'FF'], C: ['armhole and sleeve cap', 'SS'],
  D: ['neckline and collar', 'SS'], E: ['front edge and facing', 'SS'],
  F: ['sleeve underarm', 'FF'], G: ['collar outer edge', 'SS'], H: ['coat and sleeve hems', 'TS'],
  P6: ['breast-pocket placement', 'TS'], P7: ['lower-pocket placement', 'TS'],
  BH: ['buttonhole marks', 'BH'],
}
// Only the shell joins present in drape/coat-shell.yaml. Its split-sleeve overarm join is a
// simulation artefact, and its collar, facing and hems are outside that shell drape.
export const drapeSeams = { A: 'shoulder', B: 'side', C: 'armhole', F: 'underarm' }

// A path is used only if that part and path were drafted for the selected options.
export const anchors = [
  { code: 'A', part: 'front', between: ['neck', 'shoulder'] },
  { code: 'A', part: 'back', between: ['neck', 'shoulder'] },
  { code: 'B', part: 'front', between: ['armhole', 'hem'] },
  { code: 'B', part: 'back', between: ['armhole', 'hem'] },
  { code: 'C', part: 'front', path: 'frontArmhole', at: 0.5 },
  { code: 'C', part: 'back', path: 'backArmhole', at: 0.5 },
  { code: 'C', part: 'sleeve', path: 'sleevecap', at: 0.5 },
  { code: 'D', part: 'front', path: 'frontCollar', at: 0.5 },
  { code: 'D', part: 'back', path: 'backCollar', at: 0.5 },
  { code: 'D', part: 'collar', path: 'neck', at: 0.5 },
  { code: 'E', part: 'front', path: 'edge', at: 0.5 },
  { code: 'E', part: 'facing', path: 'edge', at: 0.5 },
  { code: 'F', part: 'sleeve', between: ['capLeft', 'wristLeft'] },
  { code: 'F', part: 'sleeve', between: ['capRight', 'wristRight'] },
  { code: 'G', part: 'collar', between: ['cbOuter', 'tip'] },
  { code: 'H', part: 'front', path: 'hemBase', at: 0.5 },
  { code: 'H', part: 'back', path: 'hemBase', at: 0.5 },
  { code: 'H', part: 'sleeve', path: 'hemBase', at: 0.5 },
  { code: 'P6', part: 'front', path: 'breastPocket', at: 0.5, optional: true },
  { code: 'P7', part: 'front', path: 'lowerPocket', at: 0.5, optional: true },
  { code: 'BH', part: 'front', point: 'buttonhole0_0' },
]

export function resolve(pattern) {
  const active = pattern.parts[0]
  const out = []
  for (const anchor of anchors) {
    const part = active[`chorecoat.${anchor.part}`]
    if (!part || part.hidden || !part.paths.seam || part.paths.seam.hidden) {
      if (anchor.optional) continue
      throw new Error(`pattern map: missing ${anchor.part}`)
    }
    let point
    if (anchor.path) {
      const path = part.paths[anchor.path]
      if (!path) {
        if (anchor.optional) continue
        throw new Error(`pattern map: missing ${anchor.part}.${anchor.path}`)
      }
      point = path.shiftFractionAlong(anchor.at)
    } else if (anchor.between) {
      const [a, b] = anchor.between.map((key) => part.points[key])
      if (!a || !b) throw new Error(`pattern map: missing ${anchor.part} points ${anchor.between}`)
      point = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    } else point = part.points[anchor.point]
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) throw new Error(`pattern map: invalid ${anchor.code} on ${anchor.part}`)
    out.push({ code: anchor.code, part: `chorecoat.${anchor.part}`, x: point.x, y: point.y })
  }
  return out
}

export const legend = (marks) => {
  const active = new Set(marks.map((mark) => mark.code))
  return Object.entries(seams).filter(([code]) => active.has(code))
    .map(([code, [name, stitch]]) => `${code} ${name} (${stitch})`)
}
