// Build-time data for the site, from ../designs (run before docusaurus start/build):
// - src/generated/specs.json: every design's spec, `extends` resolved (lib/load-spec.mjs reads
//   files, which the browser can't; lib/spec.mjs builds the designs from these in the browser)
// - src/generated/measurements.json: each design's required and optional measurements
// - src/generated/labels.json: ../designs/labels.yaml (option and part labels)
// - src/generated/sizes.json: the measurement sets the tests use (FreeSewing's adult sets, the
//   stout figures, the 75 USDA children's sets), grouped for the size picker
// - src/generated/catalog.json: source entries plus browsing sections for the React Designs index
// - docs/designs/<category>/<id>.mdx: a page per design from its BRIEF.md, with its drape renders
//   and the editor, at /designs/<id> (its slug); static/img/drape/<id>/: those renders. A folder
//   is a sidebar group, from the design's about.category (lib/categories.mjs)
// - docs/designs/index.mdx: one Designs page, browsed by the sections in catalog-sections.mjs
// - inspired.yaml still identifies the designs based on recent sources; external.yaml's linked
//   patterns appear alongside ours in the index. Design pages keep /designs/<id>.
// - FreeSewing's own designs (../designs/freesewing.yaml): a page each under Designs, with
//   the pattern tool and a credit box but no brief, and src/generated/freesewing.mjs, which imports
//   them from npm for the editor (src/lib/collection.mjs)
// - static/img/illustrations/<id>.jpg: the finished-garment illustration from illustrations/,
//   where there is one, at the top of the design's page and in the Designs index
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
import { designGroups } from '../catalog-sections.mjs'
import { designFromSpec } from '../../designs/lib/spec.mjs'
import { mappedDesigns, validateConstruction } from '../../designs/tools/validate-construction.mjs'
import { sets, stoutSets } from '../../designs/test/coat-checks.mjs'
import { all as children } from '../../designs/sizes/children.mjs'
import { babies } from '../../designs/sizes/babies.mjs'

const site = fileURLToPath(new URL('..', import.meta.url))
const designsDir = join(site, '..', 'designs')
const out = (...p) => join(site, ...p)
const thumbnail = (name) => existsSync(out('static', 'img', 'catalog-thumbs', `${name}.webp`))
  ? `/img/catalog-thumbs/${name}.webp` : null

// The designs: every folder with a spec.yaml and a BRIEF.md
// A design in progress (a spec but no brief yet) isn't listed until its brief is written
const ids = readdirSync(designsDir).filter((d) => existsSync(join(designsDir, d, 'spec.yaml')) && existsSync(join(designsDir, d, 'BRIEF.md')))
// A design page shows its pattern map once its own construction steps check out against it
const mapped = new Set(mappedDesigns().filter((d) => ids.includes(d)))
for (const d of mapped) validateConstruction(d)
const readme = readFileSync(join(site, '..', 'README.md'), 'utf8')
const order = [...readme.matchAll(/^\| `([a-z-]+)` \| (.+?) \| (.+?) \|$/gm)].map((m) => ({ id: m[1], garment: m[2], source: m[3] }))

const specs = {}
for (const id of ids) specs[id] = readSpec(join(designsDir, id, 'spec.yaml'))
const traditions = parse(readFileSync(join(designsDir, 'garments', 'traditions.yaml'), 'utf8')).traditions
const sourceTraditions = parse(readFileSync(join(designsDir, 'garments', 'source-traditions.yaml'), 'utf8')).sources
const designTraditions = parse(readFileSync(join(designsDir, 'garments', 'design-traditions.yaml'), 'utf8')).designs
for (const id of ids) {
  const keys = [...(designTraditions[id] ?? []), ...(specs[id].about.garmentTraditions ?? (specs[id].about.garmentTradition ? [specs[id].about.garmentTradition] : []))]
  for (const key of keys) if (!traditions[key]) throw new Error(`${id}: no garment tradition ${key}`)
}
for (const id of Object.keys(designTraditions)) if (!specs[id]) throw new Error(`no built design ${id} in design-traditions.yaml`)
// A tradition shows one flag (`flag`) or several side by side (`flags`, for one shared across borders)
const flagsOf = (t) => t.flags ?? (t.flag ? [t.flag] : [])
for (const [key, tradition] of Object.entries(traditions)) {
  tradition.flags = flagsOf(tradition)
  if (!tradition.flags.length) throw new Error(`${key}: tradition needs an icon before appearing on the site`)
  for (const flag of tradition.flags)
    if (!existsSync(out('static', 'img', 'flags', `${flag}.svg`))) throw new Error(`${key}: no flag icon ${flag}.svg`)
}
for (const [source, keys] of Object.entries(sourceTraditions))
  for (const key of keys) if (!traditions[key]) throw new Error(`${source}: no tradition ${key}`)

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
  return `<li class="${descendants.length ? 'wardrobe-branch' : 'wardrobe-leaf'}"><div class="wardrobe-entry"><span>${escapeHtml(node.name)}</span>${links ? `<span class="wardrobe-patterns">${links}</span>` : ''}${node.research ? '<span class="wardrobe-research">Research lead</span>' : ''}</div>${descendants.length ? `<ul>${descendants.map(wardrobeBranch).join('')}</ul>` : ''}</li>`
}
const wardrobeIntro = `---
title: A wardrobe in progress
sidebar_position: 3
description: Explore the garment family tree and the patterns available today.
---

Our aim is to make it possible to sew a **full wardrobe**: everyday layers, work clothes,
occasion wear, outerwear and the pieces worn underneath. A wardrobe means choice across sizes,
ages, weather and ways of dressing, not a single prescribed set of clothes.

This map groups garments by form and use. A garment tradition belongs in each design's source
record, where its community, place and period can be described as precisely as the evidence allows.
Pattern links appear beside types
that have a design on this site. Unlinked types show where the collection can grow: some need
a design, new pattern pieces or techniques; research candidates still need a verified source and
construction method before we can assess whether they are buildable. The map follows our
[garment coverage plan](https://github.com/dissentingd/publicsewing/blob/main/designs/garments/COVERAGE.md)
and updates when the site is built.

The map names garments without claiming to represent every community or regional form.
Wrapped and woven garments may need dimensions, fabric width, wrapping or weaving methods,
and community-specific context beyond a printable sewing pattern.

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

// Books still in copyright that designs take only methods and proportions from: credited once on the
// Sources page (its anchor), and "inspired by" everywhere else. A spec's about.source names the book;
// its about.taken, what the design takes from it ("tier proportions"), goes in the page's credit
const methodSources = [
  { test: /ЕМКО/, tag: 'ЕМКО 1988', name: 'ЕМКО СЭВ', anchor: 'emko' },
  { test: /Armstrong/, tag: 'Joseph-Armstrong 2010', name: "Helen Joseph-Armstrong's *Patternmaking for Fashion Design*", anchor: 'armstrong' },
  { test: /Aldrich/, tag: 'Aldrich 2015', name: "Winifred Aldrich's *Metric Pattern Cutting for Women's Wear*", anchor: 'aldrich' },
  { test: /Central Board of Secondary Education/, tag: 'CBSE 2014', name: "CBSE's *Basic Pattern Development*", anchor: 'cbse' },
]

// Infant safety (designs/safety, BUILD_QUEUE S1): a design reviewed for baby sizes shows its
// restrictions and the sewer's instructions on its page. test/infant-safety.test.mjs requires the review
const infantChecklist = parse(readFileSync(join(designsDir, 'safety', 'infant-checklist.yaml'), 'utf8'))
const infantReviews = parse(readFileSync(join(designsDir, 'safety', 'infant-reviews.yaml'), 'utf8'))
const CHECKLIST_URL = 'https://github.com/dissentingd/publicsewing/blob/main/designs/safety/infant-checklist.yaml'
function safetySection(id) {
  const r = infantReviews[id]
  if (!r) return ''
  const lines = [
    ...Object.entries(r.restrict ?? {}).map(([o, x]) => `- **At baby sizes, set \`${o}\` to ${x.allow.map((v) => `\`${v}\``).join(' or ')}.** ${x.why}`),
    ...Object.values(r.instructions ?? {}).map((t) => `- ${t}`),
  ]
  return `## Safety at baby sizes

:::warning[Read before sewing for a baby or toddler]
${lines.join('\n')}

Reviewed ${r.date} against our [infant safety checklist](${CHECKLIST_URL}) (version ${infantChecklist.version}): a
desk review of the pattern, not a sewn or lab test. If you sell what you make, your market's rules
for children's clothing apply.
:::

`
}
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
  { folder: 'designs', label: 'Designs', position: 2, has: () => true },
]
for (const { folder, label: name, position, has } of collections) {
  mkdirSync(out('docs', folder), { recursive: true })
  writeFileSync(
    out('docs', folder, '_category_.json'),
    JSON.stringify({ label: name, position, link: { type: 'doc', id: `${folder}/index` } }, null, 2)
  )
  // A section links to the matching heading on the combined index.
  categories.forEach((c, i) => {
    const fsHere = fsIds.some((id) => fs[id].category === c.id)
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

// Keep the source brief intact while moving practical making information ahead of the editor.
// A mapped design's step that only applies with some option on (a pocket) says so on the page,
// from construction.yaml's `whenAny` and the pattern tool's own option titles.
function conditionalSteps(construction, id) {
  if (!mapped.has(id)) return construction
  const { steps } = parse(readFileSync(join(designsDir, id, 'construction.yaml'), 'utf8'))
  let out = construction
  for (const step of steps) {
    if (!step.whenAny?.length) continue
    const titles = step.whenAny.map((o) => labelData.options[o]?.title ?? o)
    const note = ` *Only with ${titles.join(' or ')} on in the pattern tool.*`
    out = out.replace(new RegExp(`^(${step.order}\\. .*)$`, 'm'), `$1${note}`)
  }
  return out
}

function briefSections(brief, id) {
  const converted = mdx(brief, id)
  const sections = converted.split(/(?=^## )/m)
  const pieces = []
  const construction = []
  const background = []
  for (const section of sections) {
    const heading = section.match(/^## (.+)$/m)?.[1] ?? ''
    if (/^Pieces.*construction/i.test(heading)) construction.push(section)
    else if (/^Pieces\b/i.test(heading)) pieces.push(section)
    else if (/^Construction\b/i.test(heading)) construction.push(section)
    else {
      const label = /^What (?:the source|the sources|Mitchell)\b/i.test(heading) ? 'What Source Shows'
        : /^How (?:it|the source) maps\b|^Mapping\b/i.test(heading) ? 'How It Maps'
        : /^(Changes|Departures)\b/i.test(heading) ? "Changes and what isn't modelled" : null
      background.push(label
        ? `<details className="brief-detail">\n<summary>${label}</summary>\n\n${section.replace(/^## .+\n/, '')}\n</details>`
        : section)
    }
  }
  return { pieces: pieces.join('\n'), construction: construction.join('\n'), background: background.join('\n') }
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
const traditionTag = (key) => {
  if (!key) return ''
  const { flags, label } = traditions[key]
  return `<span className="tradition-tag" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}">${flags.map((flag) => `<img src={useBaseUrl('/img/flags/${flag}.svg')} alt="" />`).join('')}</span>`
}
const traditionKeys = (id, about) => {
  const keys = new Set([...(designTraditions[id] ?? []), ...(about.garmentTraditions ?? (about.garmentTradition ? [about.garmentTradition] : []))])
  for (const [source, inherited] of Object.entries(sourceTraditions))
    if (about.source?.includes(`(${source})`) || about.source?.includes(`; ${source})`))
      for (const key of inherited) keys.add(key)
  return [...keys]
}
const traditionTags = (id, about) => traditionKeys(id, about).map(traditionTag).join(' ')
const supportNote = (project, href) =>
  `<small className="support-note">[${project}](${href}) did the hard part, so please support them and use their design from them first. Feel free to use ours if it offers something you need.</small>`
const designCell = (link, difficulty, tags, icons = '') => [difficulty ? link : tagLine(link, icons), difficulty ? tagLine(difficultyDots(difficulty), icons) : '', tags].filter(Boolean).join('<br />')
const garmentCell = (text, ...extra) => [text, ...extra.filter(Boolean)].join('<br />')
const CC_BY = 'https://creativecommons.org/licenses/by/4.0/'

const external = parse(readFileSync(out('external.yaml'), 'utf8'))
const original = {}
for (const p of external.patterns) {
  const where = `external.yaml, ${p.name}`
  if (!rows.designs[p.category]) throw new Error(`${where}: category isn't one of lib/categories.mjs`)
  for (const key of p.traditions ?? []) if (!traditions[key]) throw new Error(`${where}: no tradition ${key}`)
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
    entry: {
      id: `openpattern-${p.path}`, name: p.name, href: url,
      image: existsSync(pic) ? `/img/illustrations/external/${p.path}.jpg` : useAi ? `/img/illustrations/openpattern/${p.path}.jpg` : null,
      thumbnail: thumbnail(`openpattern-${p.path}`),
      imageCredit: existsSync(pic) ? "Open+Pattern's render, CC BY 4.0, resized" : useAi ? 'AI-generated illustration, not drawn from the pattern' : null,
      description: p.about, difficulty: null, status: 'External pattern',
      source: { text: external.by, href: url },
      licence: { text: 'CC BY 4.0', href: CC_BY },
      traditions: (p.traditions ?? []).map((key) => ({ key, ...traditions[key] })),
      sizing: `Fixed sizes: ${p.sizes}`,
      related: p.ours ? [{ name: specs[p.ours].about.name, href: `/designs/${p.ours}` }] : [],
    },
    row: `| ${thumb} | ${designCell(`[${p.name}](${url})`, 0, tagLine(srcTag(external.by, url, 'external'), srcTag('CC BY 4.0', CC_BY, 'licence')), (p.traditions ?? []).map(traditionTag).join(' '))} | ${garmentCell(`${p.about}.`, `<small>Fixed sizes: ${p.sizes}, on their site.${picCredit}${ours}</small>`)} |`,
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
    entry: {
      id, name, href: `/designs/${id}`,
      image: fsIllustrated ? `/img/illustrations/freesewing/${id}.jpg` : null,
      thumbnail: thumbnail(id),
      imageCredit: fsIllustrated ? 'AI-generated illustration, not drawn from the pattern or by FreeSewing' : null,
      description: d.about, difficulty: d.data.difficulty ?? null, status: 'FreeSewing design',
      source: { text: 'FreeSewing', href: d.url },
      licence: { text: 'MIT', href: '/sources#freesewing' },
      traditions: [],
      sizing: d.sizes === 'babies' ? 'Baby and toddler sizes' : d.sizes === 'all' ? 'Adult, child and baby sizes' : 'Adult and child sizes',
      related: (d.ours ?? []).map((o) => ({ name: specs[o].about.name, href: `/designs/${o}` })),
    },
    row: `| ${fsIllustrated ? `<a href="/designs/${id}">${fsImg('thumb', true)}</a>` : ''} | ${designCell(`[${name}](/designs/${id})`, d.data.difficulty, tagLine(srcTag('FreeSewing', d.url, 'external'), srcTag('MIT', '/sources#freesewing', 'licence')))} | ${garmentCell(`${d.about}.`, ours.length ? `<small>We also draft our own: ${ours.join(', ')}.</small>` : '', supportNote('FreeSewing', d.url))} |`,
  })
  writeFileSync(
    out('docs', 'designs', d.category, `${id}.mdx`),
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

${safetySection(id)}## Make the pattern

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
  const sections = briefSections(brief, id)
  const { pieces, background } = sections
  const construction = conditionalSteps(sections.construction, id)
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
    preview && !mapped.has(id) &&
      `<figure className="illustration">
  <a href={useBaseUrl('/img/previews/${id}.png')}><img className="illustration-img preview-img" src={useBaseUrl('/img/previews/${id}.png')} alt="${about.name}: the pattern pieces" /></a>
  <figcaption>The pattern pieces at the default options, size ${label(previewSet)}, with seam allowance. Click to enlarge.</figcaption>
</figure>`,
  ].filter(Boolean)
  const illustration = figures.length ? `<div className="design-figures">\n${figures.join('\n')}\n</div>\n` : ''
  const patternMap = mapped.has(id) && preview ? `<section className="pattern-map-section" aria-labelledby="pattern-map-title">
  <h2 id="pattern-map-title">Pattern map</h2>
  <p>Numbers identify cut pieces. Letters and short codes match the seam edges sewn together and mark placements such as pockets and buttonholes. The stitch and finish key is inside the image; the construction steps use the same codes.</p>
  <figure className="pattern-map-figure">
    <div className="pattern-map-scroll" tabIndex={0} aria-label="Scrollable pattern map"><a href={useBaseUrl('/img/previews/${id}.png')}><img className="preview-img" src={useBaseUrl('/img/previews/${id}.png')} alt="${about.name}: numbered pieces, seam and pocket codes, with embedded stitch and finish key" /></a></div>
    <figcaption>Default options, size ${label(previewSet)}, with seam allowance. Scroll sideways on a narrow screen or click to enlarge.</figcaption>
  </figure>
</section>` : ''
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
  const folder = 'designs'
  const sourceLabel = inspiredIds.includes(id) ? 'Inspired by' : 'Source'
  // Our version of a pattern people can pay for on its maker's site asks them to, by name of garment
  if (/Open\+Pattern/.test(about.source ?? '') && !original[id]) throw new Error(`${id}: from Open+Pattern, but no entry in external.yaml has ours: ${id}, so it has no donation link`)
  // Tags: the source (to the brief, which names it in full), or the original another project made
  const methodSource = methodSources.find((m) => m.test.test(about.source ?? ''))
  const ourTags = original[id]
    ? tagLine(srcTag(external.by, original[id].url, 'external'), srcTag('CC BY 4.0', CC_BY, 'licence'))
    : methodSource
      ? srcTag(methodSource.tag, `/sources#${methodSource.anchor}`)
      : srcTag(info.source.replace(/[*_]/g, ''), `/designs/${id}#the-brief`)
  rows[folder][about.category].push({
    name: about.name,
    entry: {
      id, name: about.name, href: `/designs/${id}`,
      image: illustrated ? `/img/illustrations/${id}.jpg` : null,
      thumbnail: thumbnail(id),
      imageCredit: illustrated ? 'AI-generated illustration, not drawn from the pattern' : null,
      description: info.garment, difficulty: about.difficulty ?? null, status: 'Draft · not yet sewn',
      source: original[id]
        ? { text: `Inspired by ${original[id].name}`, href: original[id].url }
        : methodSource
          ? { text: `Inspired by ${methodSource.tag}`, href: `/sources#${methodSource.anchor}` }
          : { text: info.source.replace(/[*_]/g, ''), href: `/designs/${id}#the-brief` },
      licence: original[id] ? { text: 'Source: CC BY 4.0', href: CC_BY } : null,
      traditions: traditionKeys(id, about).map((key) => ({ key, ...traditions[key] })),
      sizing: 'Drafted to your measurements',
      patternParts: Object.keys(spec.pieces ?? {}).length,
      techniques: about.techniques ?? [],
      variants: Object.entries(spec.variants ?? {}).map(([key, v]) => ({ name: v.name, href: `/designs/${id}#${key}` })),
      related: original[id] ? [{ name: original[id].name, href: original[id].url }] : [],
    },
    row: `| ${illustrated ? `<a href="/designs/${id}">${img('thumb', true)}</a>` : ''} | ${designCell(`[${about.name}](/designs/${id})`, about.difficulty, ourTags, traditionTags(id, about))} | ${garmentCell(info.garment, variantLinks.length ? `<small>Variants: ${variantLinks.join(' · ')}</small>` : '', original[id] ? supportNote(external.by, original[id].url) : '')} |`,
  })
  const originalLine = original[id]
    ? `\n\nOur own interpretation, inspired by [${original[id].name}](${original[id].url}) from [${external.by}](/sources#open-pattern). ${external.by} did the hard part, so please [support them](${original[id].url}) and use their design from them first. Feel free to use ours if it offers something you need.`
    : methodSource
      ? about.taken
        ? `\n\nOur own design: its ${about.taken} follow [${methodSource.name}](/sources#${methodSource.anchor}), and the rest is drafted from your measurements.`
        : `\n\nOur own interpretation, inspired by [${methodSource.name}](/sources#${methodSource.anchor}).`
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

<div className="design-page">
<div className="design-hero">
<div className="design-hero-art">
${illustration}
</div>
<div className="design-hero-copy">
<p className="design-eyebrow">Made-to-measure sewing pattern</p>
:::warning[Draft, untested]
No one has sewn this design yet. It drafts cleanly at every size in the test suite and its seams
match, but that doesn't prove it fits. Sew a muslin before good fabric, and please
[report what happened](/sew-and-test#report).
:::

${info.garment}. ${sourceLabel}: ${info.source}.${originalLine}${alsoFs[id] ? `\n\nAlso as FreeSewing's ${alsoFs[id].join(', ')}, on the Designs page.` : ''}${variantsLine}

${traditionTags(id, about) ? `${traditionTags(id, about)}\n` : ''}
</div>
</div>

${patternMap}

<nav className="design-jump" aria-label="On this design page">
<a href="#make-the-pattern">Make the pattern</a>
<a href="#construction">Construction</a>
<a href="#the-brief">Source notes</a>
</nav>

${pieces ? `<section className="design-pieces">\n${pieces}\n</section>` : ''}

<section className="design-construction">
${construction || '## Construction\n\nStep-by-step sewing instructions are being prepared for this draft. Check the source notes below before sewing a test garment.'}
</section>

${safetySection(id)}## Make the pattern

Pick a size set or enter your own measurements, change options, then **Export** a tiled PDF
(A4 or Letter). Your measurements stay in this browser. See [Measure yourself](/measure?for=${id}) and
[Sew & Test](/sew-and-test).

<PatternEditor design="${about.id}" />

${variantsSection}
${drape}
<details className="brief-detail brief-main" id="the-brief">
<summary>The Brief</summary>

How the source became this design. The full file is [BRIEF.md on GitHub](${repo}/designs/${id}/BRIEF.md).

${background}
</details>
</div>
`
  )
})

const catalog = Object.fromEntries(Object.entries(rows).map(([folder, sections]) => [
  folder,
  Object.fromEntries(Object.entries(sections).map(([category, entries]) => [
    category,
    entries.sort((a, b) => a.name.localeCompare(b.name)).map(({ entry }) => entry),
  ])),
]))
const entriesById = new Map()
for (const [folder, sections] of Object.entries(catalog))
  for (const [category, entries] of Object.entries(sections))
    for (const entry of entries) {
      if (entriesById.has(entry.id)) throw new Error(`Duplicate catalog id: ${entry.id}`)
      entriesById.set(entry.id, { ...entry, folder, category })
    }
const sectionIds = designGroups.flatMap((group) => group.sections.flatMap((section) => section.ids))
if (new Set(sectionIds).size !== sectionIds.length) throw new Error('A design appears in more than one catalog section')
const expectedIds = [...entriesById.values()].filter((entry) => entry.category !== 'blocks').map((entry) => entry.id)
const missing = expectedIds.filter((id) => !sectionIds.includes(id))
const unknown = sectionIds.filter((id) => !entriesById.has(id))
if (missing.length || unknown.length) throw new Error(`Catalog placement mismatch: missing ${missing.join(', ') || 'none'}; unknown ${unknown.join(', ') || 'none'}`)
catalog.sections = Object.fromEntries(designGroups.flatMap((group) => group.sections.map((section) => {
  if (section.ids.length > 10) throw new Error(`${section.id} has ${section.ids.length} designs; split the section`)
  return [section.id, section.ids.map((id) => entriesById.get(id)).sort((a, b) => a.name.localeCompare(b.name))]
})))
writeFileSync(out('src', 'generated', 'catalog.json'), JSON.stringify(catalog))

const designsPage = (folder, title, slug, position, intro) => {
  const groups = [...designGroups, { id: 'blocks', label: 'Blocks', image: 'blocks', sections: [] }]
  writeFileSync(
    out('docs', folder, 'index.mdx'),
    `---
title: ${title}
slug: ${slug}
sidebar_position: ${position}
---
import useBaseUrl from '@docusaurus/useBaseUrl'
import DesignCatalog from '@site/src/components/DesignCatalog'

${intro}

<nav className="design-sections" aria-label="Sections">
${groups
  .map((g) => existsSync(join(site, 'illustrations', `${g.image}.jpg`))
    ? `  <a href="#${g.id}"><img src={useBaseUrl('/img/illustrations/${g.image}.jpg')} alt="" /><span>${escapeHtml(g.label)}</span></a>`
    : `  <a href="#${g.id}" className="no-image"><span>${escapeHtml(g.label)}</span></a>`)
  .join('\n')}
</nav>

${groups
  .map((g) => `## ${g.label} {#${g.id}}

${g.id === 'blocks' ? '<DesignCatalog folder="all" category="blocks" />' : g.sections.map((c) => `### ${c.label} {#${c.id}}

<DesignCatalog folder="section" category="${c.id}" />
`).join('\n')}
`)
  .join('\n')}`
  )
}

designsPage(
  'designs',
  'Designs',
  '/designs',
  0,
  `All designs here draw on earlier garments or drafting methods and have been adapted to our
parametric pattern system. Our patterns are **drafts**: none has been sewn yet. Each design page
has its pattern tool, a 3D drape where available, and its brief.

Entries with a coloured tag aren't ours: <span className="src-tag src-tag--external">Open+Pattern</span> ones are
[${external.by}](/sources#open-pattern)'s patterns of real garments, in fixed sizes, on their site.

Entries tagged <span className="src-tag src-tag--external">FreeSewing</span> are
[FreeSewing](/sources#freesewing)'s designs, drafted to measure here with their credit.`
)

// A small, static index of public pages. The browser searches this without sending queries away.
const searchPages = []
function addSearchPages(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name)
    if (entry.isDirectory()) { addSearchPages(file); continue }
    if (!/\.mdx?$/.test(entry.name) || entry.name === 'search.mdx') continue
    const raw = readFileSync(file, 'utf8')
    const front = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    const meta = front ? parse(front[1]) : {}
    const relative = file.slice(out('docs').length + 1).replaceAll('\\', '/')
    const route = meta.slug ?? `/${relative.replace(/\.(md|mdx)$/, '').replace(/\/index$/, '')}`
    const title = meta.title ?? relative.split('/').at(-1).replace(/\.(md|mdx)$/, '')
    const body = raw.slice(front?.[0].length ?? 0)
      .replace(/^import .*$/gm, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[\*_`#|{}]/g, ' ')
      .replace(/\s+/g, ' ').trim()
    searchPages.push({ title, href: route, description: meta.description ?? '', body })
  }
}
addSearchPages(out('docs'))
writeFileSync(out('src', 'generated', 'search.json'), JSON.stringify(searchPages))

console.log(`generated: ${ids.length} designs, ${fsIds.length} from FreeSewing, ${external.patterns.length} external, ${Object.values(sizes).flat().length} size sets`)
