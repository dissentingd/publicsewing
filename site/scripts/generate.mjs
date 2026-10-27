// Build-time data for the site, from ../designs (run before docusaurus start/build):
// - src/generated/specs.json: every design's spec, `extends` resolved (lib/load-spec.mjs reads
//   files, which the browser can't; lib/spec.mjs builds the designs from these in the browser)
// - src/generated/measurements.json: each design's required and optional measurements
// - src/generated/labels.json: ../designs/labels.yaml (option and part labels)
// - src/generated/sizes.json: the measurement sets the tests use (FreeSewing's adult sets, the
//   stout figures, the 75 USDA children's sets), grouped for the size picker
// - docs/designs/<id>.mdx: a page per design from its BRIEF.md, with its drape renders and the
//   editor; static/img/drape/<id>/: those renders
// - static/img/illustrations/<id>.jpg: the finished-garment illustration from illustrations/,
//   where there is one, at the top of the design's page and in the Designs table
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, copyFileSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { parse } from 'yaml'
import { readSpec } from '../../designs/lib/load-spec.mjs'
import { designFromSpec } from '../../designs/lib/spec.mjs'
import { sets, stoutSets } from '../../designs/test/coat-checks.mjs'
import { all as children } from '../../designs/sizes/children.mjs'

const site = fileURLToPath(new URL('..', import.meta.url))
const designsDir = join(site, '..', 'designs')
const out = (...p) => join(site, ...p)

// The designs: every folder with a spec.yaml and a BRIEF.md, in the README's order where it gives one
// A design in progress (a spec but no brief yet) isn't listed until its brief is written
const ids = readdirSync(designsDir).filter((d) => existsSync(join(designsDir, d, 'spec.yaml')) && existsSync(join(designsDir, d, 'BRIEF.md')))
const readme = readFileSync(join(site, '..', 'README.md'), 'utf8')
const order = [...readme.matchAll(/^\| `([a-z-]+)` \| (.+?) \| (.+?) \|$/gm)].map((m) => ({ id: m[1], garment: m[2], source: m[3] }))
const rank = (id) => (order.findIndex((o) => o.id === id) + 1 || 999)
ids.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))

const specs = {}
for (const id of ids) specs[id] = readSpec(join(designsDir, id, 'spec.yaml'))

// Drape verdicts from the drape README's results tables (by garment name)
const drapeReadme = readFileSync(join(designsDir, 'drape', 'README.md'), 'utf8')
const verdicts = {}
for (const m of drapeReadme.matchAll(/^\| ([a-z' ]+?)(?: \([^)]*\))? \| (?:male|female)\*? \| \**(OK|REVIEW)\** \|/gm))
  verdicts[m[1].replace(/'/g, '').replace(/ /g, '-')] = m[2]

// Size sets: name -> measurements (mm), grouped
const adult = Object.fromEntries(Object.entries(sets).filter(([k]) => /^cis/.test(k)))
const label = (k) =>
  k
    .replace(/^cisFemaleAdult(\d+)$/, 'Women $1')
    .replace(/^cisMaleAdult(\d+)$/, 'Men $1')
    .replace(/^stoutMale(\d+)$/, 'Stout men $1')
    .replace(/^stoutFemale(\d+)$/, 'Stout women $1')
    .replace(/^usdaBoy([BCD])(\d+)$/, 'Boys $2$1')
    .replace(/^usdaGirl([BCD])(\d+)$/, 'Girls $2$1')
const group = (obj) => Object.entries(obj).map(([id, measurements]) => ({ id, label: label(id), measurements }))
const sizes = {
  women: group(Object.fromEntries(Object.entries(adult).filter(([k]) => /Female/.test(k)))),
  men: group(Object.fromEntries(Object.entries(adult).filter(([k]) => /^cisMale/.test(k)))),
  stout: group(stoutSets),
  girls: group(Object.fromEntries(Object.entries(children).filter(([k]) => /Girl/.test(k)))),
  boys: group(Object.fromEntries(Object.entries(children).filter(([k]) => /Boy/.test(k)))),
}

// Measurements each design needs
const measurements = {}
for (const id of ids) {
  const { patternConfig } = designFromSpec(specs[id]).Design
  measurements[id] = { name: specs[id].about.name, required: patternConfig.measurements, optional: patternConfig.optionalMeasurements }
}

mkdirSync(out('src', 'generated'), { recursive: true })
writeFileSync(out('src', 'generated', 'measurements.json'), JSON.stringify(measurements))
writeFileSync(out('src', 'generated', 'labels.json'), JSON.stringify(parse(readFileSync(join(designsDir, 'labels.yaml'), 'utf8'))))
writeFileSync(out('src', 'generated', 'specs.json'), JSON.stringify(specs))
writeFileSync(out('src', 'generated', 'sizes.json'), JSON.stringify(sizes))

// Design pages
rmSync(out('docs', 'designs'), { recursive: true, force: true })
rmSync(out('static', 'img', 'drape'), { recursive: true, force: true })
rmSync(out('static', 'img', 'illustrations'), { recursive: true, force: true })
mkdirSync(out('static', 'img', 'illustrations'), { recursive: true })
mkdirSync(out('docs', 'designs'), { recursive: true })
writeFileSync(
  out('docs', 'designs', '_category_.json'),
  JSON.stringify({ label: 'Designs', position: 2, link: { type: 'doc', id: 'designs/index' } }, null, 2)
)

/** A brief's Markdown, made safe for MDX: no H1 (the page has its own), relative links to GitHub */
const repo = 'https://github.com/dissentingd/publicsewing/blob/main'
function mdx(md, id) {
  return md
    .replace(/^# .*\n+/, '')
    .replace(/\]\((?!https?:|#)([^)]+)\)/g, (_, p) => `](${repo}/designs/${id}/${p})`)
    .replace(/[{}]/g, (c) => `\\${c}`)
    .replace(/<(?=[^a-zA-Z/!])/g, '&lt;')
}

const rows = []
ids.forEach((id, i) => {
  const spec = specs[id]
  const about = spec.about
  const info = order.find((o) => o.id === id) ?? { garment: about.description, source: about.source }
  const brief = readFileSync(join(designsDir, id, 'BRIEF.md'), 'utf8')
  const drapeSrc = join(designsDir, 'drape', id)
  const renders = existsSync(drapeSrc) ? readdirSync(drapeSrc).filter((f) => /\.png$/.test(f)).sort() : []
  if (renders.length) {
    mkdirSync(out('static', 'img', 'drape', id), { recursive: true })
    for (const f of renders) copyFileSync(join(drapeSrc, f), out('static', 'img', 'drape', id, f))
  }
  const verdict = verdicts[id] ?? verdicts[about.name?.toLowerCase().replace(/'/g, '').replace(/ /g, '-')]
  const drape = renders.length
    ? [
        '## 3D drape',
        '',
        `A cloth-simulator check that the pieces sew together into the garment, not a fit result. Verdict: **${verdict ?? 'not recorded'}**. See [the drape notes](${repo}/designs/drape/README.md).`,
        '',
        '<div className="drape">',
        ...renders.map((f) => `  <img src={useBaseUrl('/img/drape/${id}/${f}')} alt="${about.name}, ${f.replace('.png', '')}, draped" loading="lazy" />`),
        '</div>',
        '',
      ].join('\n')
    : ''
  const illustrated = existsSync(join(site, 'illustrations', `${id}.jpg`))
  if (illustrated) copyFileSync(join(site, 'illustrations', `${id}.jpg`), out('static', 'img', 'illustrations', `${id}.jpg`))
  const img = (cls, lazy) => `<img className="${cls}" src={useBaseUrl('/img/illustrations/${id}.jpg')} alt="${about.name}: illustration of the finished garment"${lazy ? ' loading="lazy"' : ''} />`
  const illustration = illustrated
    ? `<figure className="illustration">
  ${img('illustration-img')}
  <figcaption>An AI-generated illustration of the design at its default options, not drawn from the pattern.</figcaption>
</figure>
`
    : ''
  rows.push(`| ${illustrated ? `<a href="/designs/${id}">${img('thumb', true)}</a>` : ''} | [${about.name}](/designs/${id}) | ${info.garment} | ${info.source} |`)
  writeFileSync(
    out('docs', 'designs', `${id}.mdx`),
    `---
title: ${JSON.stringify(about.name)}
description: ${JSON.stringify(about.description)}
sidebar_position: ${i + 1}
hide_table_of_contents: true
---
import useBaseUrl from '@docusaurus/useBaseUrl'
import PatternEditor from '@site/src/components/PatternEditor'

${illustration}
:::warning[Draft, untested]
No one has sewn this design yet. It drafts cleanly at every size in the test suite and its seams
match, but that doesn't prove it fits. Sew a muslin before good fabric, and please
[report what happened](/report).
:::

${info.garment}. Source: ${info.source}.

## Make the pattern

Pick a size set or enter your own measurements, change options, then **Export** a tiled PDF
(A4 or Letter). Your measurements stay in this browser. See [Measure yourself](/measure) and
[Print and sew a muslin](/muslin).

<PatternEditor design="${about.id}" />

${drape}
## The brief

How the source became this design: its pieces, how the source's proportions became options, and
the construction order. The same file is [BRIEF.md on GitHub](${repo}/designs/${id}/BRIEF.md).

${mdx(brief, id)}
`
  )
})

writeFileSync(
  out('docs', 'designs', 'index.mdx'),
  `---
title: Designs
sidebar_position: 0
---
import useBaseUrl from '@docusaurus/useBaseUrl'

Every design is a **draft**: none has been sewn yet. Each page has the pattern tool for that
design, its 3D drape, and its brief.

| | Design | Garment | Source |
|---|---|---|---|
${rows.join('\n')}
`
)

console.log(`generated: ${ids.length} designs, ${Object.values(sizes).flat().length} size sets`)
