// Every export format for one drafted pattern, shared by tools/export.mjs and the site's
// download panel. Runs in Node and the browser.
import { pieces } from './pieces.mjs'
import { toDxf } from './dxf.mjs'
import { toSeamly } from './seamly.mjs'
import { toSmis } from './smis.mjs'

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
 * @returns { dxf, sm2d, smis } file texts
 */
export function exportFiles(Design, settings, { name, size = 'own measurements', source } = {}) {
  const sa = settings.sa ?? 10
  const pattern = new Design({ ...settings, sa, complete: true }).draft()
  const notes = credits(source)
  return {
    dxf: toDxf(pieces(pattern), { style: name, size, notes }),
    sm2d: toSeamly(pattern, { name, size, notes, sa }),
    smis: toSmis(settings.measurements ?? {}, { notes: `PublicSewing, ${size}` }),
  }
}
