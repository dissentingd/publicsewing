// Every export format for one drafted pattern, shared by tools/export.mjs and the site's
// download panel. Runs in Node and the browser.
import { pieces } from './pieces.mjs'
import { toDxf } from './dxf.mjs'
import { toSeamly } from './seamly.mjs'
import { toSmis } from './smis.mjs'
import { toLayeredSvg } from './svg.mjs'
import { toProjectorPdf } from './pdf.mjs'

export { fromSmis } from './smis.mjs'

/** Credit lines for the files, from a design's `about.source` (CC BY sources must be credited in them) */
export function credits(source) {
  const lines = source ? [`SOURCE: ${source}`] : []
  if (/Open\+Pattern/.test(source ?? '')) lines.push('CREDIT: based on a pattern by Open+Pattern (openpattern.io), CC BY 4.0')
  return lines
}

/**
 * @param Design a design constructor
 * @param settings pattern settings (measurements, options, sa); sa defaults to 10 mm (0: none)
 * @param meta { name: design id, size: label for the measurements, source: about.source }
 * @returns { dxf, sm2d, smis, svg, pdf, darkPdf } file texts (the PDFs one byte per character:
 *          write them as 'latin1')
 */
export function exportFiles(Design, settings, { name, size = 'own measurements', source } = {}) {
  const sa = settings.sa ?? 10
  const pattern = new Design({ ...settings, sa, complete: true }).draft()
  const notes = credits(source)
  const ps = pieces(pattern)
  return {
    dxf: toDxf(ps, { style: name, size, notes }),
    sm2d: toSeamly(pattern, { name, size, notes, sa }),
    smis: toSmis(settings.measurements ?? {}, { notes: `PublicSewing, ${size}` }),
    svg: toLayeredSvg(ps, { title: name, size, notes, sa }),
    pdf: toProjectorPdf(ps, { title: name, size, notes, sa }),
    darkPdf: toProjectorPdf(ps, { title: name, size, notes, sa, dark: true }),
  }
}
