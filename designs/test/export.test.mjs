// Every design's DXF export reads back as the pattern it came from: same pieces, net and cut
// outlines the length of FreeSewing's seam and allowance paths, every notch, a grain line.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadDesign, measurementSet } from '../tools/render.mjs'
import { pieces } from '../lib/export/pieces.mjs'
import { toDxf } from '../lib/export/dxf.mjs'
import { parseDxf, summarise } from '../tools/dxf-aama.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const designs = readdirSync(root).filter((d) => existsSync(join(root, d, 'spec.yaml')))
const sizes = ['cisFemaleAdult34', 'cisMaleAdult42', 'stoutMale48', 'usdaGirlC5']

for (const name of designs) {
  test(`export ${name}`, async () => {
    const Design = await loadDesign(name)
    for (const size of sizes) {
      const pattern = new Design({ measurements: measurementSet(size), sa: 10 }).draft()
      const ps = pieces(pattern)
      assert.ok(ps.length > 0, `${size}: pieces`)
      const text = toDxf(ps, { style: name, size })
      assert.ok(!/NaN|undefined/.test(text), `${size}: no NaN in the DXF`)
      const back = summarise(parseDxf(text))
      assert.equal(back.length, ps.length, `${size}: piece count`)
      back.forEach((b, i) => {
        const part = pattern.parts[0][ps[i].id]
        const tag = `${size} ${ps[i].name}`
        // Flattening keeps every curve within 0.25 mm, so lengths agree to well under 0.1%
        const seam = part.paths.seam.length()
        assert.ok(Math.abs(b.perimeter - seam) <= Math.max(1, seam * 0.001), `${tag}: net ${b.perimeter.toFixed(1)} vs seam ${seam.toFixed(1)}`)
        // A closed allowance is the cut line; an open one (cut on fold) is closed along the fold,
        // which adds at least the straight gap between its ends
        // (dropping a repeated close, which FreeSewing's length() counts twice)
        const ops = part.paths.sa.ops.filter((op, k, all) => !(op.type === 'close' && all[k - 1]?.type === 'close'))
        const sa = part.paths.sa.clone()
        sa.ops = ops
        const saLength = sa.length()
        if (ops.at(-1).type === 'close') assert.ok(Math.abs(b.outerPerimeter - saLength) <= Math.max(1, saLength * 0.001), `${tag}: cut ${b.outerPerimeter.toFixed(1)} vs sa ${saLength.toFixed(1)}`)
        else {
          const gap = Math.hypot(ops[0].to.x - ops.at(-1).to.x, ops[0].to.y - ops.at(-1).to.y)
          assert.ok(b.outerPerimeter >= saLength + gap - 1, `${tag}: cut ${b.outerPerimeter.toFixed(1)} vs sa ${saLength.toFixed(1)} + fold ${gap.toFixed(1)}`)
        }
        assert.ok(b.outerPerimeter > 0, `${tag}: cut line`)
        assert.equal(b.notches, ps[i].notches.length, `${tag}: notches`)
        assert.notEqual(b.grainDeg, null, `${tag}: grain line`)
      })
    }
  })
}
