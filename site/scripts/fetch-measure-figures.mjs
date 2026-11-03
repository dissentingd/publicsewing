// Copies FreeSewing's how-to-measure figures into static/img/measure/ from a fixed commit, for the
// Measure page and the pattern tool's measurement help. Run by hand; the results are in git, so a
// build needs no network. Each measurement is an SVG overlay (a tape that animates by itself, with
// no script) over one JPG of the figure. still/ holds the same overlays with the animation taken out,
// for people who've asked their device to reduce motion.
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const commit = process.argv[2]
if (!commit) throw new Error('usage: node scripts/fetch-measure-figures.mjs <freesewing commit>')
const repo = 'https://codeberg.org/freesewing/freesewing'
const out = fileURLToPath(new URL('../static/img/measure/', import.meta.url))
const get = async (path) => {
  const res = await fetch(`${repo}/raw/commit/${commit}/${path}`)
  if (!res.ok) throw new Error(`${path}: ${res.status}`)
  return res
}
const list = async (dir) => {
  const res = await fetch(`https://codeberg.org/api/v1/repos/freesewing/freesewing/contents/${dir}?ref=${commit}`)
  if (!res.ok) throw new Error(`${dir}: ${res.status}`)
  return (await res.json()).map((e) => e.name)
}

const base = 'sites/org/src/theme/MDXComponents'
let count = 0
for (const figure of ['sarah', 'tim']) {
  mkdirSync(join(out, figure, 'still'), { recursive: true })
  for (const name of (await list(`${base}/${figure}`)).filter((n) => n.endsWith('.svg'))) {
    // The page draws the JPG behind the overlay, so the overlay's own link to it can go
    const svg = (await (await get(`${base}/${figure}/${name}`)).text()).replace(/<image [^>]*\/>\s*/g, '')
    writeFileSync(join(out, figure, name), svg)
    writeFileSync(join(out, figure, 'still', name), svg.replace(/<animate [^>]*\/>\s*/g, ''))
    count++
  }
  for (const pose of ['standing', 'seated']) {
    const jpg = await get(`sites/org/static/img/${figure}-${pose}.jpg`)
    writeFileSync(join(out, `${figure}-${pose}.jpg`), Buffer.from(await jpg.arrayBuffer()))
  }
}

const licence = await (await get('LICENSE')).text()
writeFileSync(
  join(out, 'NOTICE.txt'),
  `These figures are FreeSewing's, from ${repo} at commit ${commit}
(sites/org/src/theme/MDXComponents/ and sites/org/static/img/). The overlays have their link to the
background image removed, and still/ has their animation removed too. FreeSewing's licence:

${licence}`
)
console.log(`${count} overlays from ${commit}`)
