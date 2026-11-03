// Build-time data for the site, from ../designs (run before docusaurus start/build):
// - src/generated/specs.json: every design's spec, `extends` resolved (lib/load-spec.mjs reads
//   files, which the browser can't; lib/spec.mjs builds the designs from these in the browser)
// - src/generated/measurements.json: each design's required and optional measurements
// - src/generated/labels.json: ../designs/labels.yaml (option and part labels)
// - src/generated/sizes.json: the measurement sets the tests use (FreeSewing's adult sets, the
//   stout figures, the 75 USDA children's sets), grouped for the size picker
// - docs/designs/<category>/<id>.mdx: a page per design from its BRIEF.md, with its drape renders
//   and the editor, at /designs/<id> (its slug); static/img/drape/<id>/: those renders. A folder
//   is a sidebar group, from the design's about.category (lib/categories.mjs)
// - docs/designs/index.mdx: the Historical Designs page, a table per category, by name within each
// - docs/inspired/: the same for the designs in inspired.yaml, at /inspired, with others' patterns
//   from external.yaml among ours: a link out, with no page here. Design pages keep /designs/<id>
// - static/img/illustrations/<id>.jpg: the finished-garment illustration from illustrations/,
//   where there is one, at the top of the design's page and in the Designs table
// - static/img/previews/<id>.png: the design's preview-<set>.png (its pattern pieces, from
//   designs/tools/preview.mjs; <set> is the spec's about.preview, else cisMaleAdult38), beside
//   the illustration
// - a design's `variants` (its spec): a Variants section after the pattern tool, each with the
//   settings to change, its illustration (illustrations/<id>.<variant>.jpg, when there is one)
//   and its pattern pieces (preview-<set>-<variant>.png); see variantSteps
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, copyFileSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { parse } from 'yaml'
import { readSpec } from '../../designs/lib/load-spec.mjs'
import { categories } from '../../designs/lib/categories.mjs'
import { designFromSpec } from '../../designs/lib/spec.mjs'
import { sets, stoutSets } from '../../designs/test/coat-checks.mjs'
import { all as children } from '../../designs/sizes/children.mjs'

const site = fileURLToPath(new URL('..', import.meta.url))
const designsDir = join(site, '..', 'designs')
const out = (...p) => join(site, ...p)

// The designs: every folder with a spec.yaml and a BRIEF.md
// A design in progress (a spec but no brief yet) isn't listed until its brief is written
const ids = readdirSync(designsDir).filter((d) => existsSync(join(designsDir, d, 'spec.yaml')) && existsSync(join(designsDir, d, 'BRIEF.md')))
const readme = readFileSync(join(site, '..', 'README.md'), 'utf8')
const order = [...readme.matchAll(/^\| `([a-z-]+)` \| (.+?) \| (.+?) \|$/gm)].map((m) => ({ id: m[1], garment: m[2], source: m[3] }))

const specs = {}
for (const id of ids) specs[id] = readSpec(join(designsDir, id, 'spec.yaml'))

// Section by section, by name within each: the order of the Designs page and the sidebar
const section = (id) => {
  const i = categories.findIndex((c) => c.id === specs[id].about.category)
  if (i < 0) throw new Error(`${id}: about.category isn't one of lib/categories.mjs`)
  return i
}
ids.sort((a, b) => section(a) - section(b) || specs[a].about.name.localeCompare(specs[b].about.name))

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
const labelData = parse(readFileSync(join(designsDir, 'labels.yaml'), 'utf8'))
writeFileSync(out('src', 'generated', 'labels.json'), JSON.stringify(labelData))
writeFileSync(out('src', 'generated', 'specs.json'), JSON.stringify(specs))
writeFileSync(out('src', 'generated', 'sizes.json'), JSON.stringify(sizes))

// Design pages
rmSync(out('docs', 'designs'), { recursive: true, force: true })
rmSync(out('docs', 'inspired'), { recursive: true, force: true })
rmSync(out('static', 'img', 'drape'), { recursive: true, force: true })
rmSync(out('static', 'img', 'illustrations'), { recursive: true, force: true })
mkdirSync(out('static', 'img', 'illustrations'), { recursive: true })
rmSync(out('static', 'img', 'previews'), { recursive: true, force: true })
mkdirSync(out('static', 'img', 'previews'), { recursive: true })

// The two pages of designs. `folder` is under docs/: a sidebar group, and the page's address
const inspiredIds = parse(readFileSync(out('inspired.yaml'), 'utf8')).designs
for (const id of inspiredIds) if (!ids.includes(id)) throw new Error(`inspired.yaml: no design ${id}`)
const collections = [
  { folder: 'designs', label: 'Historical Designs', position: 2, has: (id) => !inspiredIds.includes(id) },
  { folder: 'inspired', label: 'Inspired Designs', position: 2.5, has: (id) => inspiredIds.includes(id) },
]
const collectionOf = (id) => collections.find((c) => c.has(id))
for (const { folder, label: name, position, has } of collections) {
  mkdirSync(out('docs', folder), { recursive: true })
  writeFileSync(
    out('docs', folder, '_category_.json'),
    JSON.stringify({ label: name, position, link: { type: 'doc', id: `${folder}/index` } }, null, 2)
  )
  // A section with no page of its own here (only others' patterns, or nothing) isn't a sidebar group
  categories.forEach((c, i) => {
    if (!ids.some((id) => has(id) && specs[id].about.category === c.id)) return
    mkdirSync(out('docs', folder, c.id), { recursive: true })
    writeFileSync(out('docs', folder, c.id, '_category_.json'), JSON.stringify({ label: c.label, position: i + 1 }, null, 2))
  })
}

/** A brief's Markdown, made safe for MDX: no H1 (the page has its own), relative links to GitHub */
const repo = 'https://github.com/dissentingd/publicsewing/blob/main'
// What a variant's option looks like in the pattern tool's menus, from the same labels the tool
// shows. An option the tool doesn't show can't be a variant's: fail the build rather than publish
// instructions nobody can follow.
function variantSteps(spec, labels, options, where) {
  return Object.entries(options).map(([name, value]) => {
    const o = spec.options?.[name]
    if (!o) throw new Error(`${where}: no option ${name}`)
    if (!o.menu) throw new Error(`${where}: option ${name} isn't shown in the pattern tool`)
    const l = labels.options[name] ?? {}
    const show = (v) => {
      if (typeof v === 'boolean') return v ? 'Yes' : 'No'
      if (o.list) return l.choices?.[v] ?? String(v)
      if (o.pct !== undefined) return `${Math.round(v * 1000) / 10}%`
      if (o.deg !== undefined) return `${v}°`
      return String(v)
    }
    const dflt = o.bool ?? o.dflt ?? o.count ?? o.deg ?? (o.pct !== undefined ? o.pct / 100 : undefined)
    if (o.list && !o.list.includes(value)) throw new Error(`${where}: ${name} has no choice ${value}`)
    const menu = o.menu[0].toUpperCase() + o.menu.slice(1)
    return { menu, title: o.title ?? l.title ?? name, value: show(value), dflt: show(dflt) }
  })
}

function mdx(md, id) {
  return md
    .replace(/^# .*\n+/, '')
    .replace(/\]\((?!https?:|#)([^)]+)\)/g, (_, p) => `](${repo}/designs/${id}/${p})`)
    .replace(/[{}]/g, (c) => `\\${c}`)
    .replace(/<(?=[^a-zA-Z/!])/g, '&lt;')
}

const newRows = () => Object.fromEntries(categories.map((c) => [c.id, []]))
const rows = { designs: newRows(), inspired: newRows() }

// Others' patterns: a row in the Inspired tables, linking out. `ours` ties one to our design from it
const external = parse(readFileSync(out('external.yaml'), 'utf8'))
const original = {}
for (const p of external.patterns) {
  const where = `external.yaml, ${p.name}`
  if (!rows.inspired[p.category]) throw new Error(`${where}: category isn't one of lib/categories.mjs`)
  if (p.ours && !ids.includes(p.ours)) throw new Error(`${where}: no design ${p.ours}`)
  if (p.ours && !inspiredIds.includes(p.ours)) throw new Error(`${where}: ${p.ours} isn't in inspired.yaml`)
  const url = `${external.base}${p.path}/`
  if (p.ours) original[p.ours] = { name: p.name, url }
  const ours = p.ours ? ` We also draft it to measure: [${specs[p.ours].about.name}](/designs/${p.ours}).` : ''
  rows.inspired[p.category].push({
    name: p.name,
    row: `| | [${p.name}](${url})<br /><span className="external-tag">External</span> | ${p.about}.<br /><small>Fixed sizes: ${p.sizes}. Pattern by [${external.by}](/sources#open-pattern), on their site.${ours}</small> |`,
  })
}

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
  // The pattern pieces beside it: the design's preview at its preview size (designs/tools/preview.mjs)
  const previewSet = about.preview ?? 'cisMaleAdult38'
  const previewSrc = join(designsDir, id, `preview-${previewSet}.png`)
  const preview = existsSync(previewSrc)
  if (preview) copyFileSync(previewSrc, out('static', 'img', 'previews', `${id}.png`))
  const figures = [
    illustrated &&
      `<figure className="illustration">
  ${img('illustration-img')}
  <figcaption>An <a href="/sources#illustrations">AI-generated illustration</a> of the design at its default options, not drawn from the pattern.</figcaption>
</figure>`,
    preview &&
      `<figure className="illustration">
  <a href={useBaseUrl('/img/previews/${id}.png')}><img className="illustration-img preview-img" src={useBaseUrl('/img/previews/${id}.png')} alt="${about.name}: the pattern pieces" /></a>
  <figcaption>The pattern pieces at the default options, size ${label(previewSet)}, with seam allowance. Click to enlarge.</figcaption>
</figure>`,
  ].filter(Boolean)
  const illustration = figures.length ? `<div className="design-figures">\n${figures.join('\n')}\n</div>\n` : ''
  // The variants: this design with other options, each with how to set them. The buttons need
  // every option any variant touches, and those options' defaults
  const variantKeys = [...new Set(Object.values(spec.variants ?? {}).flatMap((v) => Object.keys(v.options)))]
  const variantDefaults = Object.fromEntries(
    variantKeys.map((k) => {
      const o = spec.options?.[k] ?? {}
      return [k, o.bool ?? o.dflt ?? o.count ?? o.deg ?? (o.pct !== undefined ? o.pct / 100 : null)]
    })
  )
  const variants = Object.entries(spec.variants ?? {}).map(([key, v]) => {
    const steps = variantSteps(spec, labelData, v.options, `${id} variant ${key}`)
    const pic = existsSync(join(site, 'illustrations', `${id}.${key}.jpg`))
    if (pic) copyFileSync(join(site, 'illustrations', `${id}.${key}.jpg`), out('static', 'img', 'illustrations', `${id}.${key}.jpg`))
    const pieces = existsSync(join(designsDir, id, `preview-${previewSet}-${key}.png`))
    if (pieces) copyFileSync(join(designsDir, id, `preview-${previewSet}-${key}.png`), out('static', 'img', 'previews', `${id}.${key}.png`))
    const figs = [
      pic &&
        `<figure className="illustration">
  <img className="illustration-img" src={useBaseUrl('/img/illustrations/${id}.${key}.jpg')} alt="${about.name}, ${v.name}: illustration of the finished garment" loading="lazy" />
  <figcaption>An <a href="/sources#illustrations">AI-generated illustration</a> of this variant, not drawn from the pattern.</figcaption>
</figure>`,
      pieces &&
        `<figure className="illustration">
  <a href={useBaseUrl('/img/previews/${id}.${key}.png')}><img className="illustration-img preview-img" src={useBaseUrl('/img/previews/${id}.${key}.png')} alt="${about.name}, ${v.name}: the pattern pieces" loading="lazy" /></a>
  <figcaption>The pattern pieces of this variant, size ${label(previewSet)}, with seam allowance. Click to enlarge.</figcaption>
</figure>`,
    ].filter(Boolean)
    return `### ${v.name} {#${key}}

${v.description}

<VariantButton design="${about.id}" label="Use this variant" options={${JSON.stringify(v.options)}} keys={${JSON.stringify(variantKeys)}} defaults={${JSON.stringify(variantDefaults)}} />

Or set it by hand: in the pattern tool above, open **Design Options**, then set:

${steps.map((s) => `- **${s.menu} → ${s.title}:** ${s.value} (the design's default is ${s.dflt})`).join('\n')}

${figs.length ? `<div className="design-figures">\n${figs.join('\n')}\n</div>\n` : ''}`
  })
  const variantNames = Object.entries(spec.variants ?? {}).map(([key, v]) => `[${v.name}](#${key})`)
  const variantsLine = variantNames.length ? `\n\nThe same pattern also makes these variants: ${variantNames.join(', ')}.` : ''
  const variantsSection = variants.length
    ? `## Variants

Each of these is the ${about.name} pattern with different options, not a separate design. To make one, choose your size above, press its button (or change its settings by hand), then export.

<VariantButton design="${about.id}" label="Use the design as shown at the top of this page" keys={${JSON.stringify(variantKeys)}} defaults={${JSON.stringify(variantDefaults)}} />

${variants.join('\n')}
`
    : ''
  const variantLinks = Object.entries(spec.variants ?? {}).map(([key, v]) => `[${v.name}](/designs/${id}#${key})`)
  const { folder } = collectionOf(id)
  const sourceLabel = folder === 'inspired' ? 'Inspired by' : 'Source'
  rows[folder][about.category].push({
    name: about.name,
    row: `| ${illustrated ? `<a href="/designs/${id}">${img('thumb', true)}</a>` : ''} | [${about.name}](/designs/${id})${variantLinks.length ? `<br /><small>Variants: ${variantLinks.join(' · ')}</small>` : ''} | ${info.garment}<br /><small>Difficulty ${about.difficulty} of 5. ${sourceLabel}: ${info.source}</small> |`,
  })
  const originalLine = original[id]
    ? `\n\nOur own interpretation, inspired by [${original[id].name}](${original[id].url}) from [${external.by}](/sources#open-pattern).`
    : /ЕМКО/.test(about.source ?? '')
      ? `\n\nOur own interpretation, inspired by [ЕМКО СЭВ](/sources#emko).`
      : ''
  writeFileSync(
    out('docs', folder, about.category, `${id}.mdx`),
    `---
title: ${JSON.stringify(about.name)}
description: ${JSON.stringify(about.description)}
slug: /designs/${id}
sidebar_position: ${i + 1}
hide_table_of_contents: true
---
import useBaseUrl from '@docusaurus/useBaseUrl'
import PatternEditor from '@site/src/components/PatternEditor'
import VariantButton from '@site/src/components/VariantButton'

${illustration}
:::warning[Draft, untested]
No one has sewn this design yet. It drafts cleanly at every size in the test suite and its seams
match, but that doesn't prove it fits. Sew a muslin before good fabric, and please
[report what happened](/sew-and-test#report).
:::

${info.garment}. ${sourceLabel}: ${info.source}.${originalLine}${variantsLine}

## Make the pattern

Pick a size set or enter your own measurements, change options, then **Export** a tiled PDF
(A4 or Letter). Your measurements stay in this browser. See [Measure yourself](/measure) and
[Sew & Test](/sew-and-test).

<PatternEditor design="${about.id}" />

${variantsSection}
${drape}
## The brief

How the source became this design: its pieces, how the source's proportions became options, and
the construction order. The same file is [BRIEF.md on GitHub](${repo}/designs/${id}/BRIEF.md).

${mdx(brief, id)}
`
  )
})

// A page of designs: its introduction, then a table per section that has anything in it
const designsPage = (folder, title, slug, position, intro) => {
  const sections = categories.filter((c) => rows[folder][c.id].length)
  writeFileSync(
    out('docs', folder, 'index.mdx'),
    `---
title: ${title}
slug: ${slug}
sidebar_position: ${position}
---
import useBaseUrl from '@docusaurus/useBaseUrl'

${intro}

<nav className="design-sections" aria-label="Sections">
${sections
  .map(
    (c) => `  <a href="#${c.id}"><img src={useBaseUrl('/img/illustrations/${c.image}.jpg')} alt="" /><span>${c.label.replace('&', '&amp;')}</span></a>`
  )
  .join('\n')}
</nav>

${sections
  .map(
    (c) => `## ${c.label} {#${c.id}}

| | Design | Garment |
|---|---|---|
${rows[folder][c.id]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((r) => r.row)
  .join('\n')}
`
  )
  .join('\n')}`
  )
}

designsPage(
  'designs',
  'Historical Designs',
  '/designs',
  0,
  `Designs from old drafting books and other public-domain sources, redrafted from the wearer's
measurements. Every design is a **draft**: none has been sewn yet. Each page has the pattern tool
for that design, its 3D drape, and its brief.

See also [Inspired Designs](/inspired), from copied garments and sources still in copyright.`
)

designsPage(
  'inspired',
  'Inspired Designs',
  '/inspired',
  0,
  `Garments that start from a rub-off, a deconstructed tracing, or an original still in copyright.
Our own designs here take the original's pieces, proportions and construction, and draft them from
the wearer's measurements, so none is an exact copy. They are all **drafts**: none has been sewn yet.
You can [copy a garment and submit it](/contribute) too.

Entries tagged <span className="external-tag">External</span> aren't ours: they're fixed-size
patterns on [${external.by}](/sources#open-pattern)'s site.

See also [Historical Designs](/designs), from old drafting books.`
)

console.log(`generated: ${ids.length} designs, ${external.patterns.length} external, ${Object.values(sizes).flat().length} size sets`)
