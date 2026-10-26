import { TailoredJacket } from '../tailored-jacket/src/index.mjs'
import { testJacket } from './jacket-checks.mjs'

testJacket('tailored jacket', TailoredJacket, {
  default: {},
  notch: { lapelStyle: 'notch', buttons: 4, lengthBelowWaist: 0.3, backSeamAt: 0.6 },
  plain: { pockets: false, breastPocket: false, lining: false },
})
