// Every option a design shows in the pattern tool has a label (labels.yaml, or the block's own),
// and every list option's choices have titles
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { parse } from 'yaml'
import { loadSpec, readSpec } from '../lib/load-spec.mjs'
import { i18n as brian } from '@freesewing/brian'
import { i18n as bent } from '@freesewing/bent'
import { i18n as breanna } from '@freesewing/breanna'
import { i18n as titan } from '@freesewing/titan'
import { i18n as sarah } from '@freesewing/sarah'

const labels = parse(readFileSync(new URL('../labels.yaml', import.meta.url), 'utf8'))
const blockLabels = { ...sarah.en.o, ...titan.en.o, ...breanna.en.o, ...bent.en.o, ...brian.en.o }
const root = new URL('..', import.meta.url)
const designs = readdirSync(root).filter((d) => existsSync(new URL(`${d}/spec.yaml`, root)))

for (const d of designs) {
  test(`labels: ${d}`, () => {
    const file = new URL(`${d}/spec.yaml`, root)
    const spec = readSpec(file)
    const { Design } = loadSpec(file)
    for (const [name, o] of Object.entries(Design.patternConfig.options)) {
      if (typeof o !== 'object' || !o.menu || o.hide) continue
      const label = spec.options?.[name]?.title ?? labels.options[name]?.title ?? blockLabels[name]?.t
      assert.ok(label, `${name} has no label`)
      if (o.list && (spec.options?.[name] || labels.options[name]))
        for (const c of o.list) assert.ok(labels.options[name]?.choices?.[c] ?? blockLabels[`${name}.${c}`], `${name}: choice ${c} has no title`)
    }
  })
}
