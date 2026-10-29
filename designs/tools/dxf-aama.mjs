// Read an AAMA/ASTM DXF pattern file (as CLO, Gerber and others export it): one BLOCK per
// pattern piece, entities on numbered layers. Prints each piece's size and features, and
// optionally writes an SVG of all pieces.
//
//   node tools/dxf-aama.mjs <file.dxf> [--svg out.svg] [--json]
//
// AAMA layers: 1 piece boundary (and piece text), 2 turn points, 3 curve points, 4 notches,
// 5 grade reference, 6 mirror line, 7 grain line, 8 internal lines, 13 drill holes,
// 14 sew line. The standard puts the cut line (with seam allowance) on layer 1 and the seam
// on 14, as lib/export/dxf.mjs writes them; CLO swaps them (net outline on 1). Of the two,
// the one enclosing less is taken as the net outline (not the shorter: a seam can run into
// a dart the cut line bridges), so sizes here are net either way. Units come from
// the "UNITS:" text (METRIC = mm).
import { readFileSync, writeFileSync } from 'node:fs'

/** Group-code pairs → entities (type, layer, codes, vertices) grouped by block */
export function parseDxf(text) {
  const lines = text.split(/\r?\n/)
  const pairs = []
  for (let i = 0; i + 1 < lines.length; i += 2) pairs.push([lines[i].trim(), lines[i + 1].trim()])
  const blocks = []
  const notes = []
  let block = null
  let ent = null
  let poly = null
  const flush = () => {
    if (!ent) return
    if (ent.type === 'VERTEX' && poly) poly.pts.push([ent.x, ent.y])
    else if (ent.type === 'POLYLINE') poly = ent
    else if (ent.type === 'SEQEND') poly = null
    else if (block && ent.type !== 'BLOCK' && ent.type !== 'ENDBLK') block.ents.push(ent)
    else if (!block && ent.type === 'TEXT') notes.push(ent.text)
    ent = null
  }
  for (const [code, val] of pairs) {
    if (code === '0') {
      flush()
      if (val === 'BLOCK') block = { name: '', ents: [] }
      else if (val === 'ENDBLK') {
        blocks.push(block)
        block = null
      }
      ent = { type: val, pts: [] }
      if (val === 'POLYLINE' && block) block.ents.push(ent)
      continue
    }
    if (!ent) continue
    if (code === '2' && ent.type === 'BLOCK') block.name = val
    else if (code === '8') ent.layer = Number(val)
    else if (code === '10') ent.x = Number(val)
    else if (code === '20') ent.y = Number(val)
    else if (code === '11') ent.x2 = Number(val)
    else if (code === '21') ent.y2 = Number(val)
    else if (code === '1') ent.text = val
  }
  flush()
  return { blocks, notes }
}

const len = (pts, closed) => {
  let s = 0
  for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  if (closed && pts.length > 2) s += Math.hypot(pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1])
  return s
}
const area = (pts) => Math.abs(pts.reduce((a, p, i) => a + p[0] * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * p[1], 0) / 2)

/** One summary per piece: net outline box, area and perimeter, the allowance outline's perimeter, counts, grain, texts */
export function summarise({ blocks }) {
  return blocks.map((b) => {
    const polys = b.ents.filter((e) => e.type === 'POLYLINE')
    const one = polys.filter((p) => p.layer === 1).sort((a, c) => c.pts.length - a.pts.length)[0]
    const four = polys.filter((p) => p.layer === 14).sort((a, c) => c.pts.length - a.pts.length)[0]
    const [net, outer] = four && one && area(four.pts) < area(one.pts) ? [four, one] : [one, four]
    const xs = (net?.pts ?? []).map((p) => p[0])
    const ys = (net?.pts ?? []).map((p) => p[1])
    const grain = [...polys, ...b.ents.filter((e) => e.type === 'LINE')].find((p) => p.layer === 7)
    const gp = grain?.pts?.length >= 2 ? grain.pts : grain ? [[grain.x, grain.y], [grain.x2, grain.y2]] : null
    const texts = b.ents.filter((e) => e.type === 'TEXT' && e.text && !/^#\s*\d+$/.test(e.text)).map((e) => e.text)
    return {
      name: b.name,
      width: xs.length ? Math.max(...xs) - Math.min(...xs) : 0,
      height: ys.length ? Math.max(...ys) - Math.min(...ys) : 0,
      area: net ? area(net.pts) : 0,
      perimeter: net ? len(net.pts, true) : 0,
      outerPerimeter: outer ? len(outer.pts, true) : 0,
      notches: b.ents.filter((e) => e.layer === 4).length,
      drills: b.ents.filter((e) => e.layer === 13).length,
      internal: polys.filter((p) => p.layer === 8).length + b.ents.filter((e) => e.type === 'LINE' && e.layer === 8).length,
      grainDeg: gp ? Math.round((Math.atan2(gp[1][1] - gp[0][1], gp[1][0] - gp[0][0]) * 180) / Math.PI) : null,
      texts,
    }
  })
}

/** All pieces side by side: net outline, allowance outline (dashed), internal lines, grain, notches */
export function toSvg({ blocks }) {
  const style = { 1: 'stroke:#111;fill:none', 14: 'stroke:#c33;fill:none;stroke-dasharray:6 4', 8: 'stroke:#36c;fill:none', 7: 'stroke:#393;fill:none' }
  let x0 = 0
  const groups = []
  let H = 0
  for (const b of blocks) {
    const polys = b.ents.filter((e) => e.type === 'POLYLINE' && style[e.layer])
    const all = polys.flatMap((p) => p.pts)
    if (!all.length) continue
    const minX = Math.min(...all.map((p) => p[0]))
    const maxX = Math.max(...all.map((p) => p[0]))
    const minY = Math.min(...all.map((p) => p[1]))
    const maxY = Math.max(...all.map((p) => p[1]))
    H = Math.max(H, maxY - minY)
    const tx = x0 - minX
    const ty = -minY
    const paths = polys.map((p) => `<polyline style="${style[p.layer]}" points="${p.pts.map(([x, y]) => `${(x + tx).toFixed(1)},${(maxY - minY - (y + ty)).toFixed(1)}`).join(' ')}${p.layer === 1 || p.layer === 14 ? ` ${(p.pts[0][0] + tx).toFixed(1)},${(maxY - minY - (p.pts[0][1] + ty)).toFixed(1)}` : ''}"/>`)
    const dots = b.ents.filter((e) => e.layer === 4 && e.type === 'POINT').map((e) => `<circle cx="${(e.x + tx).toFixed(1)}" cy="${(maxY - minY - (e.y + ty)).toFixed(1)}" r="4" fill="#c90"/>`)
    groups.push(paths.join('') + dots.join('') + `<text x="${x0}" y="${(maxY - minY + 30).toFixed(0)}" font-size="22">${b.name}</text>`)
    x0 += maxX - minX + 60
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 ${x0 + 40} ${H + 80}" width="${Math.round((x0 + 40) / 4)}" height="${Math.round((H + 80) / 4)}" style="background:#fff;stroke-width:2">${groups.join('')}</svg>`
}

if (process.argv[1] && import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const [file, ...args] = process.argv.slice(2)
  const dxf = parseDxf(readFileSync(file, 'latin1'))
  const pieces = summarise(dxf)
  if (args.includes('--json')) console.log(JSON.stringify({ notes: dxf.notes, pieces }, null, 1))
  else {
    console.log(dxf.notes.join(' | '))
    for (const p of pieces)
      console.log(`${p.name.padEnd(34)} ${(p.width / 10).toFixed(1).padStart(6)} x ${(p.height / 10).toFixed(1).padStart(6)} cm  perimeter ${(p.perimeter / 10).toFixed(1).padStart(6)} cm  notches ${p.notches}  drills ${p.drills}  internal ${p.internal}  grain ${p.grainDeg}°  ${p.texts.filter((t) => !/^(Piece Name|Size|Annotation|Category)/i.test(t)).slice(0, 3).join('; ')}`)
  }
  const i = args.indexOf('--svg')
  if (i >= 0) writeFileSync(args[i + 1], toSvg(dxf))
}
