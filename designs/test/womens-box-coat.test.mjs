import { BoxCoat } from '../womens-box-coat/src/index.mjs'
import { testJacket } from './jacket-checks.mjs'

testJacket('box coat', BoxCoat, {
  default: {},
  peakLapels: { lapelStyle: 'peak' },
  variant: { lapelStyle: 'peak', neckDartWidth: 0, buttons: 4, lengthBelowWaist: 0.45, flare: 0.08 },
  plain: { pockets: false, cbFlare: 0, buttonInset: 1 },
})
