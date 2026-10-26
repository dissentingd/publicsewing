import { BoxCoat } from '../box-coat/src/index.mjs'
import { testJacket } from './jacket-checks.mjs'

testJacket('box coat', BoxCoat, {
  default: {},
  variant: { lapelStyle: 'peak', neckDartWidth: 0, buttons: 4, lengthBelowWaist: 0.45, flare: 0.08 },
  plain: { pockets: false, cbFlare: 0, buttonInset: 1 },
})
