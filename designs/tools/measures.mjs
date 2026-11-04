// A measurement set's numbers, in mm and inches: what to divide a source's numbers by when choosing
// option defaults. Usage: node tools/measures.mjs <set> [measurement ...]     (run in designs/)
import { measurementSet } from './render.mjs'

const [set = 'cisMaleAdult38', ...keys] = process.argv.slice(2)
const m = measurementSet(set)
for (const k of keys.length ? keys : Object.keys(m)) console.log(k.padEnd(22), String(m[k]).padStart(7), `${(m[k] / 25.4).toFixed(2)} in`)
