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
// - FreeSewing's own designs (../designs/freesewing.yaml): a page each under Inspired Designs, with
//   the pattern tool and a credit box but no brief, and src/generated/freesewing.mjs, which imports
//   them from npm for the editor (src/lib/collection.mjs)
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
import { babies } from '../../designs/sizes/babies.mjs'

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
    .replace(/^cs151Baby(\d+)m$/, 'Baby $1 months')
    .replace(/^cs151Toddler(\d+)$/, 'Toddler $1')
const group = (obj) => Object.entries(obj).map(([id, measurements]) => ({ id, label: label(id), measurements }))
const sizes = {
  women: group(Object.fromEntries(Object.entries(adult).filter(([k]) => /Female/.test(k)))),
  men: group(Object.fromEntries(Object.entries(adult).filter(([k]) => /^cisMale/.test(k)))),
  stout: group(stoutSets),
  girls: group(Object.fromEntries(Object.entries(children).filter(([k]) => /Girl/.test(k)))),
  boys: group(Object.fromEntries(Object.entries(children).filter(([k]) => /Boy/.test(k)))),
  // offered only to designs whose freesewing.yaml entry has `sizes: babies` or `all`
  babies: group(babies),
}

// Measurements each design needs
const measurements = {}
for (const id of ids) {
  const { patternConfig } = designFromSpec(specs[id]).Design
  measurements[id] = { name: specs[id].about.name, editorId: specs[id].about.id, required: patternConfig.measurements, optional: patternConfig.optionalMeasurements }
}

// FreeSewing's designs we list: imported from npm (site/package.json), never copied
const fsList = parse(readFileSync(join(designsDir, 'freesewing.yaml'), 'utf8'))
const fs = {}
for (const [id, d] of Object.entries(fsList.designs)) {
  if (ids.includes(id)) throw new Error(`freesewing.yaml: ${id} is also one of our design ids`)
  for (const o of d.ours ?? []) if (!ids.includes(o)) throw new Error(`freesewing.yaml, ${id}: no design ${o}`)
  const Design = (await import(d.package))[d.export]
  if (!Design) throw new Error(`freesewing.yaml, ${id}: ${d.package} has no export ${d.export}`)
  fs[id] = { ...d, data: Design.designConfig.data, url: `${fsList.upstream}${id}/` }
  measurements[id] = { name: Design.designConfig.data.name, editorId: id, required: Design.patternConfig.measurements, optional: Design.patternConfig.optionalMeasurements }
}
const fsIds = Object.keys(fs)
mkdirSync(out('src', 'generated'), { recursive: true })
// The wardrobe page follows the planning tree and links only to pages in this build.
const garmentNodes = parse(readFileSync(join(designsDir, 'garments', 'tree.yaml'), 'utf8')).nodes
const garmentChildren = new Map()
for (const [id, node] of Object.entries(garmentNodes)) {
  const siblings = garmentChildren.get(node.parent ?? null) ?? []
  siblings.push({ id, ...node })
  garmentChildren.set(node.parent ?? null, siblings)
}
const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
function wardrobeBranch(node) {
  const patterns = [...(node.designs ?? []), ...(node.variants ?? []), ...(node.freesewing ?? [])]
  const links = [...new Set(patterns)].map((name) => {
    const id = name.split('.')[0]
    if (!ids.includes(id) && !fsIds.includes(id)) return ''
    return `<a href="/designs/${id}">${escapeHtml(name.replace(/[-.]/g, ' '))}</a>`
  }).filter(Boolean).join(' ')
  const descendants = garmentChildren.get(node.id) ?? []
  return `<li class="${descendants.length ? 'wardrobe-branch' : 'wardrobe-leaf'}"><div class="wardrobe-entry"><span>${escapeHtml(node.name)}</span>${links ? `<span class="wardrobe-patterns">${links}</span>` : ''}</div>${descendants.length ? `<ul>${descendants.map(wardrobeBranch).join('')}</ul>` : ''}</li>`
}
const wardrobeIntro = `---
title: A wardrobe in progress
sidebar_position: 3
description: Explore the garment family tree and the patterns available today.
---

Our aim is to make it possible to sew a **full wardrobe**: everyday layers, work clothes,
occasion wear, outerwear and the pieces worn underneath. A wardrobe means choice across sizes,
ages, weather and ways of dressing, not a single prescribed set of clothes.

This map shows the garment families we are working toward. Pattern links appear beside types
that have a design on this site. Unlinked types show where the collection can grow; some need
only a new design, while others need new pattern pieces or techniques. The map follows our
[garment coverage plan](https://github.com/dissentingd/publicsewing/blob/main/designs/garments/COVERAGE.md)
and updates when the site is built.

The patterns are still drafts until they have been sewn and tested. [See how to test one](/sew-and-test).

`
writeFileSync(out('docs', 'wardrobe.mdx'), wardrobeIntro + `<div class="wardrobe-tree">${(garmentChildren.get(null) ?? []).map((zone) => `<section class="wardrobe-zone"><h2>${escapeHtml(zone.name)}</h2><ul>${(garmentChildren.get(zone.id) ?? []).map(wardrobeBranch).join('')}</ul></section>`).join('')}</div>\n`)
writeFileSync(
  out('src', 'generated', 'freesewing.mjs'),
  `// Generated by scripts/generate.mjs from designs/freesewing.yaml: FreeSewing's designs we list
${fsIds.map((id) => `import { ${fs[id].export} as d_${id}, i18n as i_${id} } from '${fs[id].package}'`).join('\n')}
export const designs = { ${fsIds.map((id) => `${JSON.stringify(id)}: d_${id}`).join(', ')} }
export const i18n = { ${fsIds.map((id) => `${JSON.stringify(id)}: i_${id}`).join(', ')} }
`
)
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
// A section's own illustration, when it isn't a design's (designs copy theirs below)
for (const c of categories) {
  const src = join(site, 'illustrations', `${c.image}.jpg`)
  if (existsSync(src)) copyFileSync(src, out('static', 'img', 'illustrations', `${c.image}.jpg`))
}
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
    const fsHere = folder === 'inspired' && fsIds.some((id) => fs[id].category === c.id)
    if (!fsHere && !ids.some((id) => has(id) && specs[id].about.category === c.id)) return
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

// Others' patterns: a row in the Historical tables (Open+Pattern copies real garments), linking out.
// `ours` ties one to our design from it. A thumbnail where we hold their render:
// illustrations/external/<path>.jpg, a front view from their CC BY 4.0 download, resized
// The Designs tables. Design column: name, difficulty as dots, then small link tags for the
// source and licence (coloured for another project's design). Garment column: description,
// variants, and for another project's design one short, uniform credit line.
const difficultyDots = (n) =>
  n ? `<span className="difficulty" title="Difficulty ${n} of 5" aria-label="Difficulty ${n} of 5">${'●'.repeat(n)}<span className="difficulty-off">${'●'.repeat(Math.max(0, 5 - n))}</span></span>` : ''
const srcTag = (text, href, kind = 'source') => `<a className="src-tag src-tag--${kind}" href="${href}">${text}</a>`
const tagLine = (...tags) => tags.filter(Boolean).join(' ')
const supportNote = (project, href) =>
  `<small className="support-note">[${project}](${href}) did the hard part, so please support them and use their design from them first. Feel free to use ours if it offers something you need.</small>`
const designCell = (link, difficulty, tags) => [link, difficultyDots(difficulty), tags].filter(Boolean).join('<br />')
const garmentCell = (text, ...extra) => [text, ...extra.filter(Boolean)].join('<br />')
const CC_BY = 'https://creativecommons.org/licenses/by/4.0/'

const external = parse(readFileSync(out('external.yaml'), 'utf8'))
const original = {}
for (const p of external.patterns) {
  const where = `external.yaml, ${p.name}`
  if (!rows.designs[p.category]) throw new Error(`${where}: category isn't one of lib/categories.mjs`)
  if (p.ours && !ids.includes(p.ours)) throw new Error(`${where}: no design ${p.ours}`)
  if (p.ours && !inspiredIds.includes(p.ours)) throw new Error(`${where}: ${p.ours} isn't in inspired.yaml`)
  const url = `${external.base}${p.path}/`
  if (p.ours) original[p.ours] = { name: p.name, url }
  const ours = p.ours ? ` We also draft it to measure: [${specs[p.ours].about.name}](/designs/${p.ours}).` : ''
  const pic = join(site, 'illustrations', 'external', `${p.path}.jpg`)
  if (existsSync(pic)) {
    mkdirSync(out('static', 'img', 'illustrations', 'external'), { recursive: true })
    copyFileSync(pic, out('static', 'img', 'illustrations', 'external', `${p.path}.jpg`))
  }
  // Where Open+Pattern has no render we can use, our AI illustration (illustrations/openpattern/)
  const aiPic = join(site, 'illustrations', 'openpattern', `${p.path}.jpg`)
  const useAi = !existsSync(pic) && existsSync(aiPic)
  if (useAi) {
    mkdirSync(out('static', 'img', 'illustrations', 'openpattern'), { recursive: true })
    copyFileSync(aiPic, out('static', 'img', 'illustrations', 'openpattern', `${p.path}.jpg`))
  }
  const thumb = existsSync(pic)
    ? `<a href="${url}"><img className="thumb" src={useBaseUrl('/img/illustrations/external/${p.path}.jpg')} alt="${p.name}: ${external.by}'s 3D render" loading="lazy" /></a>`
    : useAi
      ? `<a href="${url}"><img className="thumb" src={useBaseUrl('/img/illustrations/openpattern/${p.path}.jpg')} alt="${p.name}: illustration of the finished garment" loading="lazy" /></a>`
      : ''
  const picCredit = existsSync(pic)
    ? ` Image: ${external.by}'s render, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), resized.`
    : useAi
      ? ` Image: an [AI-generated illustration](/sources#illustrations), not ${external.by}'s.`
      : ''
  rows.designs[p.category].push({
    name: p.name,
    row: `| ${thumb} | ${designCell(`[${p.name}](${url})`, 0, tagLine(srcTag(external.by, url, 'external'), srcTag('CC BY 4.0', CC_BY, 'licence')))} | ${garmentCell(`${p.about}.`, `<small>Fixed sizes: ${p.sizes}, on their site.${picCredit}${ours}</small>`)} |`,
  })
}

// FreeSewing's designs: theirs, credited, with the pattern tool here. `ours` links both ways
const alsoFs = {}
fsIds.forEach((id, i) => {
  const d = fs[id]
  const name = d.data.name
  // We list them to send people to FreeSewing, not to take their place (Dave, 2026-11-09)
  const by = d.data.design === 'Joost De Cock' ? '' : `, this one by ${d.data.design}`
  const credit = `one of many amazing designs from Joost De Cock's [FreeSewing](https://freesewing.eu) project${by}, [MIT licensed](/sources#freesewing)`
  const thanks = `They deserve more credit and have more to offer, so [check this design out there first](${d.url}).`
  const ours = (d.ours ?? []).map((o) => `[${specs[o].about.name}](/designs/${o})`)
  for (const o of d.ours ?? []) (alsoFs[o] ??= []).push(`[${name}](/designs/${id})`)
  const fsPic = join(site, 'illustrations', 'freesewing', `${id}.jpg`)
  const fsIllustrated = existsSync(fsPic)
  if (fsIllustrated) {
    mkdirSync(out('static', 'img', 'illustrations', 'freesewing'), { recursive: true })
    copyFileSync(fsPic, out('static', 'img', 'illustrations', 'freesewing', `${id}.jpg`))
  }
  const fsImg = (cls, lazy) => `<img className="${cls}" src={useBaseUrl('/img/illustrations/freesewing/${id}.jpg')} alt="${name}: illustration of the finished garment"${lazy ? ' loading="lazy"' : ''} />`
  rows.inspired[d.category].push({
    name,
    row: `| ${fsIllustrated ? `<a href="/designs/${id}">${fsImg('thumb', true)}</a>` : ''} | ${designCell(`[${name}](/designs/${id})`, d.data.difficulty, tagLine(srcTag('FreeSewing', d.url, 'external'), srcTag('MIT', '/sources#freesewing', 'licence')))} | ${garmentCell(`${d.about}.`, ours.length ? `<small>We also draft our own: ${ours.join(', ')}.</small>` : '', supportNote('FreeSewing', d.url))} |`,
  })
  writeFileSync(
    out('docs', 'inspired', d.category, `${id}.mdx`),
    `---
title: ${JSON.stringify(name)}
description: ${JSON.stringify(d.about)}
slug: /designs/${id}
sidebar_position: ${1000 + i}
hide_table_of_contents: true
---
import useBaseUrl from '@docusaurus/useBaseUrl'
import PatternEditor from '@site/src/components/PatternEditor'
${fsIllustrated ? `
<div className="design-figures">
<figure className="illustration">
  ${fsImg('illustration-img')}
  <figcaption>An <a href="/sources#illustrations">AI-generated illustration</a> of the design at its default options, not drawn from the pattern and not FreeSewing's.</figcaption>
</figure>
</div>
` : ''}
:::info[FreeSewing's design, not ours]
${name} is ${credit}. ${thanks} Its page there has its documentation, its testing status and the
community around it. Feel free to use ours, if it offers something you need otherwise: here you can
draft it ${d.sizes === 'babies' ? 'at our baby and toddler sizes, 3 months to 3 years' : d.sizes === 'all' ? "at our sizes too, babies' and children's included" : "at our sizes too, children's included"}. The printed pattern carries
FreeSewing's name.
:::

${d.about}.${ours.length ? ` We also draft our own: ${ours.join(', ')}.` : ''}

## Make the pattern

Pick a size set or enter your own measurements, change options, then **Export** a tiled PDF
(A4 or Letter). Your measurements stay in this browser. See [Measure yourself](/measure?for=${id}).

<PatternEditor design="${id}"${d.sizes ? ` sizes="${d.sizes}"` : ''}${d.skip ? ` skip="${d.skip.join(' ')}"` : ''} />
`
  )
})

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
  // Our version of a pattern people can pay for on its maker's site asks them to, by name of garment
  if (/Open\+Pattern/.test(about.source ?? '') && !original[id]) throw new Error(`${id}: from Open+Pattern, but no entry in external.yaml has ours: ${id}, so it has no donation link`)
  // Tags: the source (to the brief, which names it in full), or the original another project made
  const ourTags = original[id]
    ? tagLine(srcTag(external.by, original[id].url, 'external'), srcTag('CC BY 4.0', CC_BY, 'licence'))
    : /ЕМКО/.test(about.source ?? '')
      ? srcTag('ЕМКО 1988', '/sources#emko')
      : srcTag(info.source.replace(/[*_]/g, ''), `/designs/${id}#the-brief`)
  rows[folder][about.category].push({
    name: about.name,
    row: `| ${illustrated ? `<a href="/designs/${id}">${img('thumb', true)}</a>` : ''} | ${designCell(`[${about.name}](/designs/${id})`, about.difficulty, ourTags)} | ${garmentCell(info.garment, variantLinks.length ? `<small>Variants: ${variantLinks.join(' · ')}</small>` : '', original[id] ? supportNote(external.by, original[id].url) : '')} |`,
  })
  const originalLine = original[id]
    ? `\n\nOur own interpretation, inspired by [${original[id].name}](${original[id].url}) from [${external.by}](/sources#open-pattern). ${external.by} did the hard part, so please [support them](${original[id].url}) and use their design from them first. Feel free to use ours if it offers something you need.`
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

${info.garment}. ${sourceLabel}: ${info.source}.${originalLine}${alsoFs[id] ? `\n\nAlso as FreeSewing's ${alsoFs[id].join(', ')}, under Inspired Designs.` : ''}${variantsLine}

## Make the pattern

Pick a size set or enter your own measurements, change options, then **Export** a tiled PDF
(A4 or Letter). Your measurements stay in this browser. See [Measure yourself](/measure?for=${id}) and
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
    (c) =>
      existsSync(join(site, 'illustrations', `${c.image}.jpg`))
        ? `  <a href="#${c.id}"><img src={useBaseUrl('/img/illustrations/${c.image}.jpg')} alt="" /><span>${c.label.replace('&', '&amp;')}</span></a>`
        : `  <a href="#${c.id}" className="no-image"><span>${c.label.replace('&', '&amp;')}</span></a>`
  )
  .join('\n')}
</nav>

${sections
  .map(
    (c) => `## ${c.label} {#${c.id}}

<div className="design-table">

| | Design | Garment |
|---|---|---|
${rows[folder][c.id]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((r) => r.row)
  .join('\n')}

</div>
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

Entries with a coloured tag aren't ours: <span className="src-tag src-tag--external">Open+Pattern</span> ones are
[${external.by}](/sources#open-pattern)'s patterns of real garments, in fixed sizes, on their site.

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

Entries tagged <span className="src-tag src-tag--external">FreeSewing</span> aren't ours: they're [FreeSewing](/sources#freesewing)'s
own designs, drafted to measure here with their credit.

See also [Historical Designs](/designs), from old drafting books.`
)

console.log(`generated: ${ids.length} designs, ${fsIds.length} from FreeSewing, ${external.patterns.length} external, ${Object.values(sizes).flat().length} size sets`)
