// A notched or peaked lapel, shared by the women's jackets (lib/jacket.mjs) and the Brian coats
// (lib/coat.mjs).

/**
 * A lapel on a front whose edge runs straight down through the break B. The crease runs from B
 * through R (just in front of the neck point). From the gorge point G (where the collar ends)
 * the notch N and the lapel point P lie beyond the crease, and the lapel edge curves from P
 * down to B. u runs up the crease, v square to it, away from the body (toward x < 0).
 * `lapelWidth` is the lapel's width from the crease; `peak` puts P above the notch.
 * Returns { N, P, lapelEdge (P -> B) }.
 */
export function lapelLines(Path, Point, { B, R, G }, { lapelWidth, peak }) {
  const L = B.dist(R)
  const u = { x: (R.x - B.x) / L, y: (R.y - B.y) / L }
  const v = u.y < 0 ? { x: u.y, y: -u.x } : { x: -u.y, y: u.x } // the side with x < 0
  const at = (pu, pv) => new Point(B.x + u.x * pu + v.x * pv, B.y + u.y * pu + v.y * pv)
  const uG = (G.x - B.x) * u.x + (G.y - B.y) * u.y
  const vG = (G.x - B.x) * v.x + (G.y - B.y) * v.y
  const w = lapelWidth
  const N = at(uG - 0.12 * w, Math.max(vG, 0) + 0.35 * w)
  const P = at(uG + (peak ? 0.45 : -0.15) * w, w * 1.05)
  const lapelEdge = new Path().move(P).curve(at(uG * 0.75, w * 1.08), at(uG * 0.3, w * 0.75), B)
  return { N, P, lapelEdge }
}
