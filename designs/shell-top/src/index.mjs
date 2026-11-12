import { loadSpec } from '../../lib/load-spec.mjs'
const { Design, parts, about } = loadSpec(new URL('../spec.yaml', import.meta.url))
export const ShellTop = Design
export const { back, front } = parts
export { about }
