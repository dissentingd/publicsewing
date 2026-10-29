// Pieces -> a full-size SVG (mm, 1:1) with an Inkscape layer per piece and sub-layers for the
// cut line, the seam line and the marks, so each can be hidden, recoloured or sent to a cutter
// on its own. Plain SVG elsewhere (Illustrator, Affinity, cutting-machine software). Runs in
// Node and the browser.
import { shelves, notchTick } from './layout.mjs'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
const f = (n) => (Math.round(n * 100) / 100).toString()
const pts = (list, dx, dy) => list.map(([x, y]) => `${f(x + dx)},${f(y + dy)}`).join(' ')
const layer = (id, label, body, attrs = '') => `<g id="${esc(id)}" inkscape:groupmode="layer" inkscape:label="${esc(label)}"${attrs}>${body}</g>`

/**
 * @param pieces from pieces()
 * @param opts { title, size: measurement-set label, notes: credit lines, sa: mm }
 */
export function toLayeredSvg(pieces, { title = 'pattern', size = '', notes = [], sa = 10 } = {}) {
  const { placed, width, height } = shelves(pieces)
  const scale = 100 // the test square, mm
  const H = height + scale + 30
  const layers = placed.map(({ piece: p, dx, dy, box }) => {
    const cut = p.cut ? `<polygon points="${pts(p.cut, dx, dy)}" class="cut"/>` : ''
    const seam = `<polygon points="${pts(p.seam, dx, dy)}" class="${p.cut ? 'seam' : 'cut'}"/>`
    const marks = [
      ...p.internal.map((l) => `<polyline points="${pts(l, dx, dy)}" class="mark"/>`),
      ...p.notches.map((n) => `<polyline points="${pts(notchTick(n, 2 * sa + 6), dx, dy)}" class="notch"/>`),
      ...p.drills.map((d) => `<circle cx="${f(d.x + dx)}" cy="${f(d.y + dy)}" r="2" class="mark"/>`),
      p.grain ? `<polyline points="${pts(p.grain, dx, dy)}" class="grain" marker-start="url(#arrow)" marker-end="url(#arrow)"/>` : '',
      p.fold ? `<polyline points="${pts(p.fold, dx, dy)}" class="fold"/>` : '',
    ].join('')
    const cx = box.x + dx + box.w / 2
    const cy = box.y + dy + box.h / 2
    const text = [p.name, `${size}`, `cut ${p.quantity}${p.onFold ? ' on the fold' : ''}`]
      .map((t, i) => `<text x="${f(cx)}" y="${f(cy + (i - 1) * 9)}" class="${i ? 'small' : 'label'}">${esc(t)}</text>`)
      .join('')
    return layer(p.name, p.name, layer(`${p.name}-cut`, 'cut line', cut + (p.cut ? '' : seam)) + (p.cut ? layer(`${p.name}-seam`, 'seam line', seam) : '') + layer(`${p.name}-marks`, 'marks', marks + text))
  })
  const ty = height + 10
  const info = layer(
    'info',
    'test square and notes',
    `<rect x="20" y="${f(ty)}" width="${scale}" height="${scale}" class="cut"/><text x="70" y="${f(ty + 52)}" class="label">10 cm</text>` +
      [`${title}, ${size}`, 'PublicSewing (publicsewing.org). Print or project at 100%: the square measures 10 cm.', ...notes]
        .map((t, i) => `<text x="${scale + 40}" y="${f(ty + 10 + i * 8)}" class="small" text-anchor="start">${esc(t)}</text>`)
        .join(''),
  )
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="${f(width)}mm" height="${f(H)}mm" viewBox="0 0 ${f(width)} ${f(H)}">
<title>${esc(`${title}, ${size}`)}</title>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker>
<style>.cut{fill:none;stroke:#000;stroke-width:0.5}.seam{fill:none;stroke:#000;stroke-width:0.3;stroke-dasharray:4 2}.mark,.notch,.grain{fill:none;stroke:#000;stroke-width:0.3}.fold{fill:none;stroke:#000;stroke-width:0.3;stroke-dasharray:8 2 2 2}text{font-family:sans-serif;text-anchor:middle}.label{font-size:7px}.small{font-size:4.5px}</style></defs>
${layers.join('\n')}
${info}
</svg>
`
}
