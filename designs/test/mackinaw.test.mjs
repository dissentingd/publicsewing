import { Mackinaw } from '../mackinaw/src/index.mjs'
import { testCoat } from './coat-checks.mjs'

testCoat('mackinaw', Mackinaw, 'mackinaw.front', {
  default: {},
  shawl: { collarStyle: 'shawl' },
  raglan: { sleeveStyle: 'raglan', collarStyle: 'military' },
  military: { collarStyle: 'military', pocketShape: 'pointed', hemCurve: 0.6 },
  plain: { belt: false, pocketFlaps: false, breastPockets: false, pocketShape: 'square', frontDrop: 0 },
})
