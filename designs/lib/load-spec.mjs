// Read a spec (YAML) from disk and build its design. Node only; lib/spec.mjs has no file access,
// so the site can build designs from specs resolved at build time.
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { parse } from 'yaml'
import { designFromSpec } from './spec.mjs'

/**
 * Read a spec file (path or file URL). `extends: <file>` starts from another spec: its pieces
 * (keeping their names, unless the parent is a template with no `about`), block and options,
 * with this spec's about, option changes (merged into the parent's, e.g.
 * `buttons: { count: 5 }`), and pieces added or replaced by key.
 */
export function readSpec(file) {
  const url = file instanceof URL ? file : pathToFileURL(file)
  const spec = parse(readFileSync(url, 'utf8'))
  if (!spec.extends) return spec
  const parent = readSpec(new URL(spec.extends, url))
  const options = { ...parent.options }
  for (const [k, o] of Object.entries(spec.options ?? {})) options[k] = { ...options[k], ...o }
  const pieces = {}
  // A parent with no `about` is a template: its pieces take this spec's name
  for (const [k, p] of Object.entries(parent.pieces)) pieces[k] = parent.about ? { prefix: parent.about.id, ...p } : p
  return { ...parent, about: spec.about ?? parent.about, options, pieces: { ...pieces, ...spec.pieces } }
}

/** Read a spec file and build its design */
export const loadSpec = (file) => designFromSpec(readSpec(file))
