// Pieces laid out flat for the full-size exports (layered SVG, projector PDF): shelves of
// pieces, left to right, no wider than `width` mm, each piece upright as drafted. Runs in Node
// and the browser.

const bounds = (pts) => {
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }
}

/**
 * @param pieces from pieces()
 * @returns { placed: [{ piece, dx, dy, box }], width, height }: add (dx, dy) to a piece's
 *          points to place it; box is its outline's bounds before moving
 */
export function shelves(pieces, { width = 1400, gap = 30, margin = 20 } = {}) {
  const placed = []
  let x = margin
  let y = margin
  let row = 0
  let W = 0
  for (const piece of pieces) {
    const box = bounds(piece.cut ?? piece.seam)
    if (x > margin && x + box.w > width - margin) {
      x = margin
      y += row + gap
      row = 0
    }
    placed.push({ piece, dx: x - box.x, dy: y - box.y, box })
    x += box.w + gap
    row = Math.max(row, box.h)
    W = Math.max(W, x - gap + margin)
  }
  return { placed, width: Math.max(W, margin * 2), height: y + row + margin }
}

/** A notch as a short tick across the seam, reaching past the cut line */
export function notchTick(n, length) {
  const a = (n.angle * Math.PI) / 180
  const [dx, dy] = [(Math.cos(a) * length) / 2, (Math.sin(a) * length) / 2]
  return [[n.x - dx, n.y - dy], [n.x + dx, n.y + dy]]
}
