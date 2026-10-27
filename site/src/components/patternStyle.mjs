// The stylesheet FreeSewing's theme plugin puts inside an SVG it renders, for the editor's React
// renderer, which draws the pattern with classes only (FreeSewing's own sites style them in
// their CSS). Dark mode swaps in the plugin's dark colours, as the editor does for its SVGs.
import { buildStylesheet, paperlessStyle, sampleStyle, colors, darkColors } from '../../node_modules/@freesewing/plugin-theme/src/css.mjs'

const light = [buildStylesheet(1), paperlessStyle(), sampleStyle()].join('\n')
let dark = light.replaceAll('svg.freesewing', "[data-theme='dark'] svg.freesewing")
for (const c of Object.keys(colors)) dark = dark.replaceAll(`: ${colors[c]};`, `: ${darkColors[c]};`)

export const patternStyle = `${light}\n${dark}`
