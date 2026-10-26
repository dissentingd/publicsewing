// Parse the hand transcriptions of USDA Misc. Pub. 365, Tables 8 (boys) and 9 (girls).
// Usage: node parse.mjs            -> writes usda1939.json next to this file
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))

// The table's item numbers (1-37) and our keys for them
export const items = {
  1: 'waistHeight',
  2: 'hipHeight',
  3: 'weight', // pounds
  4: 'stature',
  5: 'cervicaleHeight',
  6: 'tibialeHeight',
  7: 'crotchHeight',
  8: 'bitrochantericDiameter',
  9: 'shoulderSlope', // degrees
  10: 'anteriorChestWidth',
  11: 'anteriorWaistLength',
  12: 'posteriorChestWidth',
  13: 'posteriorWaistLength',
  14: 'chestGirthAtArmscye',
  15: 'scyeDepth',
  16: 'posteriorHipArc',
  17: 'maximumChestGirth',
  18: 'anteriorChestArc',
  19: 'waistGirth',
  20: 'hipGirth',
  21: 'neckBaseGirth',
  22: 'shoulderLength',
  23: 'armscyeGirth',
  24: 'upperArmGirth',
  25: 'elbowGirth',
  26: 'upperPosteriorArmLength',
  27: 'totalPosteriorArmLength',
  28: 'trunkLine',
  29: 'waistToHips',
  30: 'thighGirth',
  31: 'maximumCalfGirth',
  32: 'kneeGirth',
  33: 'totalCrotchLength',
  34: 'anteriorCrotchLength',
  35: 'extremeBend',
  36: 'verticalTrunkGirth',
  37: 'percentage', // percent of children in the height interval
}

/** "23 7/8" -> 23.875; "-" -> null. A trailing "?" marks a reading to re-check. */
export function value(s) {
  s = s.trim()
  const unsure = s.endsWith('?')
  if (unsure) s = s.slice(0, -1).trim()
  if (s === '-') return { v: null, unsure }
  const m = s.match(/^(\d+)(?: (\d)\/(\d))?$/)
  if (!m) throw new Error(`bad value "${s}"`)
  const v = Number(m[1]) + (m[2] ? Number(m[2]) / Number(m[3]) : 0)
  return { v, unsure }
}

export function parse(text, file) {
  const sizes = []
  let block = null
  text.split('\n').forEach((line, i) => {
    const where = `${file}:${i + 1}`
    line = line.trim()
    if (!line || line.startsWith('#')) return
    if (line.startsWith('==')) {
      const [ids, ...rest] = line.slice(2).split('|')
      const parts = rest.map((p) => p.trim())
      const hi = parts.findIndex((p) => p.startsWith('height '))
      const pi = parts.findIndex((p) => p.startsWith('hip '))
      const heights = [parts[hi].slice(7), parts[hi + 1], parts[hi + 2]].map((s) => value(s).v)
      const hips = [parts[pi].slice(4), parts[pi + 1], parts[pi + 2]].map((s) => value(s).v)
      block = ids
        .trim()
        .split(/\s+/)
        .map((id, k) => ({ id, height: heights[k], hip: hips[k], m: {}, unsure: [] }))
      if (block.length !== 3) throw new Error(`${where}: expected 3 size ids`)
      sizes.push(...block)
      return
    }
    const m = line.match(/^(\d+):(.*)$/)
    if (!m || !block) throw new Error(`${where}: can't read "${line}"`)
    const key = items[m[1]]
    if (!key) throw new Error(`${where}: unknown item ${m[1]}`)
    const cells = m[2].split('|')
    if (cells.length !== 3) throw new Error(`${where}: expected 3 values`)
    cells.forEach((c, k) => {
      const { v, unsure } = value(c)
      if (key in block[k].m) throw new Error(`${where}: ${key} given twice`)
      block[k].m[key] = v
      if (unsure) block[k].unsure.push(key)
    })
  })
  for (const s of sizes) {
    const missing = Object.values(items).filter((k) => !(k in s.m))
    if (missing.length) throw new Error(`${file} ${s.id}: missing ${missing.join(', ')}`)
  }
  return sizes
}

export function load() {
  const read = (f) => parse(readFileSync(join(here, f), 'utf8'), f)
  return { boys: read('table8_boys.txt'), girls: read('table9_girls.txt') }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const data = load()
  writeFileSync(join(here, 'usda1939.json'), JSON.stringify(data, null, 1) + '\n')
  console.log(`boys ${data.boys.length}, girls ${data.girls.length}`)
}
