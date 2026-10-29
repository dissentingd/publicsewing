// Pieces (lib/export/pieces.mjs) -> an AAMA DXF, the pattern-interchange file that CLO3D,
// Marvelous Designer, Browzwear, Style3D, Optitex, Gerber, Lectra and Tukatech import, and
// that LibreCAD, AutoCAD and Inkscape open as plain drawings. ASCII DXF R12, mm.
//
// One BLOCK per piece, laid side by side by INSERTs. AAMA layers, as the standard has them:
//   1 boundary = the cut line (with seam allowance) and the piece's text, 2 turn points,
//   3 curve points, 4 notches, 6 mirror (fold) line, 7 grain line, 8 internal lines,
//   13 drill holes, 14 sew line (the seam). Without seam allowance the seam is the boundary.
// CLO writes these the other way round (net on 1, cut on 14); tools/dxf-aama.mjs reads both.
// DXF's y axis points up, FreeSewing's down, so y is flipped.

const f = (n) => (Math.abs(n) < 5e-7 ? 0 : n).toFixed(6)

/**
 * @param pieces from pieces()
 * @param opts { style: design name, size: measurement-set label, notes: extra header texts
 *               (credit lines), gap: mm between pieces }
 */
export function toDxf(pieces, { style = 'pattern', size = '', notes = [], gap = 50 } = {}) {
  const o = []
  const put = (...pairs) => {
    for (let i = 0; i < pairs.length; i += 2) o.push(String(pairs[i]), String(pairs[i + 1]))
  }
  const text = (layer, x, y, s) => put(0, 'TEXT', 8, layer, 10, f(x), 20, f(y), 40, 2.5, 1, s.replace(/[\r\n]+/g, ' '))
  const point = (layer, x, y, angle) => (angle == null ? put(0, 'POINT', 8, layer, 10, f(x), 20, f(y)) : put(0, 'POINT', 8, layer, 10, f(x), 20, f(y), 50, f(angle)))
  const poly = (layer, pts, closed) => {
    put(0, 'POLYLINE', 8, layer, 66, 1, 70, closed ? 1 : 0)
    for (const [x, y] of pts) put(0, 'VERTEX', 8, layer, 10, f(x), 20, f(y))
    put(0, 'SEQEND', 8, layer)
  }

  const blocks = pieces.map((p, i) => {
    const outline = p.cut ?? p.seam
    const minX = Math.min(...outline.map((q) => q[0]))
    const maxY = Math.max(...outline.map((q) => q[1]))
    const tx = (q) => [q[0] - minX, maxY - q[1]]
    const width = Math.max(...outline.map((q) => q[0])) - minX
    const height = maxY - Math.min(...outline.map((q) => q[1]))
    return { p, tx, width, height, name: `${p.name}_${size || 'M'}`.replace(/\s+/g, '_'), i }
  })

  put(0, 'SECTION', 2, 'HEADER', 9, '$ACADVER', 1, 'AC1009', 9, '$INSUNITS', 70, 4, 9, '$MEASUREMENT', 70, 1, 0, 'ENDSEC')
  put(0, 'SECTION', 2, 'TABLES', 0, 'TABLE', 2, 'LAYER', 70, 9)
  for (const l of [1, 2, 3, 4, 6, 7, 8, 13, 14]) put(0, 'LAYER', 2, l, 70, 0, 62, 7, 6, 'CONTINUOUS')
  put(0, 'ENDTAB', 0, 'ENDSEC')

  put(0, 'SECTION', 2, 'BLOCKS')
  for (const { p, tx, name, height } of blocks) {
    put(0, 'BLOCK', 8, 0, 2, name, 70, 64, 10, f(0), 20, f(0))
    const ty = height / 2
    text(1, 20, ty, `PIECE NAME: ${p.name}`)
    text(1, 20, ty - 5, `SIZE: ${size}`)
    text(1, 20, ty - 10, `QUANTITY: ${p.quantity}`)
    text(1, 20, ty - 15, `CATEGORY: ${p.material}`)
    if (p.onFold) text(1, 20, ty - 20, 'ANNOTATION: cut on fold')
    const outline = p.cut ?? p.seam
    poly(1, outline.map(tx), true)
    const corners = new Set(p.corners)
    outline.forEach((q, i) => point(corners.has(i) ? 2 : 3, ...tx(q)))
    // AAMA measures a notch's angle anticlockwise in y-up space: mirror FreeSewing's
    for (const n of p.notches) point(4, ...tx([n.x, n.y]), (360 - n.angle) % 360)
    if (p.fold) put(0, 'LINE', 8, 6, 10, f(tx(p.fold[0])[0]), 20, f(tx(p.fold[0])[1]), 11, f(tx(p.fold[1])[0]), 21, f(tx(p.fold[1])[1]))
    if (p.grain) put(0, 'LINE', 8, 7, 10, f(tx(p.grain[0])[0]), 20, f(tx(p.grain[0])[1]), 11, f(tx(p.grain[1])[0]), 21, f(tx(p.grain[1])[1]))
    for (const l of p.internal) poly(8, l.map(tx), false)
    for (const d of p.drills) point(13, ...tx([d.x, d.y]))
    if (p.cut) poly(14, p.seam.map(tx), true)
    put(0, 'ENDBLK', 8, 0)
  }
  put(0, 'ENDSEC')

  put(0, 'SECTION', 2, 'ENTITIES')
  let x = 0
  for (const b of blocks) {
    put(0, 'INSERT', 8, 1, 2, b.name, 10, f(x), 20, f(0))
    x += b.width + gap
  }
  const header = [`STYLE NAME: ${style}`, 'AUTHOR: PublicSewing (publicsewing.org)', `SAMPLE SIZE: ${size}`, ...notes, 'UNITS: METRIC']
  header.forEach((t, i) => text(1, 0, -20 - 5 * i, t))
  put(0, 'ENDSEC', 0, 'EOF')
  return o.join('\r\n') + '\r\n'
}
