import { designGroups } from './catalog-sections.mjs'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
const catalog = JSON.parse(readFileSync(join(process.cwd(), 'src', 'generated', 'catalog.json'), 'utf8'))

const localDoc = (entry) => entry.href.startsWith('/designs/')
  ? { type: 'doc', id: `designs/${entry.category ?? 'blocks'}/${entry.id}`, className: 'sidebar-design-link' }
  : null
const designItems = designGroups.flatMap((group) => [
  { type: 'link', label: group.label, href: `/designs#${group.id}`, className: 'sidebar-section-link' },
  ...group.sections.flatMap((section) => [
    { type: 'link', label: section.label, href: `/designs#${section.id}`, className: 'sidebar-subsection-link' },
    ...catalog.sections[section.id].map(localDoc).filter(Boolean),
  ]),
])
const blockDocs = [...catalog.designs.blocks, ...catalog.inspired.blocks].map(localDoc).filter(Boolean)

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
export default {
  docs: [
    'index', 'search', 'designs/index', ...designItems,
    { type: 'link', label: 'Blocks', href: '/designs#blocks', className: 'sidebar-section-link' },
    ...blockDocs,
    'wardrobe', 'measure', 'sew-and-test', 'learn', 'contribute', 'sources', 'credits',
  ],
}
