// Pieces -> a projector PDF: one untiled page at 1:1 (project it onto the cutting table and
// calibrate with the 10 cm square), heavy lines, large labels. `dark: true` draws light lines
// on black, which many projector users prefer. A tiny PDF writer, no dependencies; runs in Node
// and the browser.
import { shelves, notchTick } from './layout.mjs'

const PT = 72 / 25.4 // points per mm
const n = (v) => (Math.round(v * 100) / 100).toString()
// The standard Helvetica's WinAnsi text: ASCII only, other characters as '?'
const txt = (s) => String(s).replace(/[^\x20-\x7e]/g, '?').replace(/([\\()])/g, '\\$1')

/**
 * @param pieces from pieces()
 * @param opts { title, size, notes: credit lines, sa: mm, dark: light lines on black }
 * @returns the PDF as a string of single-byte characters (write it as 'latin1')
 */
export function toProjectorPdf(pieces, { title = 'pattern', size = '', notes = [], sa = 10, dark = false } = {}) {
  const { placed, width, height } = shelves(pieces, { gap: 40, margin: 30 })
  const square = 100
  const Hmm = height + square + 40
  // Pages are limited to 14400 units a side; past that, a UserUnit scales the units up
  const unit = Math.max(1, Math.ceil((Math.max(width, Hmm) * PT) / 14400))
  const k = PT / unit
  const X = (x) => n(x * k)
  const Y = (y) => n((Hmm - y) * k) // PDF's y runs up
  const ops = []
  const path = (list, close) => {
    ops.push(list.map(([x, y], i) => `${X(x)} ${Y(y)} ${i ? 'l' : 'm'}`).join(' ') + (close ? ' h S' : ' S'))
  }
  const fg = dark ? '1 1 1' : '0 0 0'
  if (dark) ops.push(`0 0 0 rg 0 0 ${X(width)} ${n(Hmm * k)} re f`)
  ops.push(`${fg} RG ${fg} rg 1 J 1 j`)
  const text = (x, y, s, mm) => ops.push(`BT /F1 ${n(mm * k)} Tf ${X(x)} ${Y(y)} Td (${txt(s)}) Tj ET`)
  const lw = (mm) => ops.push(`${n(mm * k)} w`)
  const dash = (on, off) => ops.push(on ? `[${n(on * k)} ${n(off * k)}] 0 d` : '[] 0 d')

  for (const { piece: p, dx, dy, box } of placed) {
    const mv = (list) => list.map(([x, y]) => [x + dx, y + dy])
    lw(1.2)
    dash()
    path(mv(p.cut ?? p.seam), true)
    if (p.cut) {
      lw(0.6)
      dash(4, 3)
      path(mv(p.seam), true)
    }
    lw(0.6)
    dash()
    for (const l of p.internal) path(mv(l), false)
    lw(1)
    for (const t of p.notches) path(mv(notchTick(t, 2 * sa + 8)), false)
    for (const d of p.drills) path(mv([[d.x - 3, d.y], [d.x + 3, d.y], [d.x, d.y], [d.x, d.y - 3], [d.x, d.y + 3]]), false)
    if (p.grain) {
      const [a, b] = mv(p.grain)
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0])
      const head = (q, s) => [[q[0] - s * 8 * Math.cos(ang - 0.4), q[1] - s * 8 * Math.sin(ang - 0.4)], q, [q[0] - s * 8 * Math.cos(ang + 0.4), q[1] - s * 8 * Math.sin(ang + 0.4)]]
      path([a, b], false)
      path(head(b, 1), false)
      path(head(a, -1), false)
    }
    if (p.fold) {
      dash(10, 4)
      path(mv(p.fold), false)
      dash()
    }
    const cx = box.x + dx + 10
    const cy = box.y + dy + box.h / 2
    text(cx + 10, cy, p.name, 12)
    text(cx + 10, cy + 10, `cut ${p.quantity}${p.onFold ? ' on the fold' : ''}`, 7)
  }
  // The test square
  const ty = height + 10
  lw(1)
  dash()
  path([[30, ty], [30 + square, ty], [30 + square, ty + square], [30, ty + square]], true)
  text(55, ty + 55, '10 cm', 10)
  ;[`${title}, ${size}`, 'PublicSewing (publicsewing.org). Project or print at 100%: the square measures 10 cm.', ...notes].forEach((s, i) => text(square + 50, ty + 12 + i * 9, s, 6))

  const content = ops.join('\n')
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${X(width)} ${n(Hmm * k)}]${unit > 1 ? ` /UserUnit ${unit}` : ''} /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>`,
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    `<< /Title (${txt(`${title}, ${size}`)}) /Producer (PublicSewing) >>`,
  ]
  let out = '%PDF-1.6\n%\xe2\xe3\xcf\xd3\n'
  const offsets = []
  objs.forEach((o, i) => {
    offsets.push(out.length)
    out += `${i + 1} 0 obj\n${o}\nendobj\n`
  })
  const xref = out.length
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return out
}
