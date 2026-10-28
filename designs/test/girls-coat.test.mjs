import { GirlsCoat } from '../girls-coat/src/index.mjs'
import { testJacket } from './jacket-checks.mjs'

testJacket('girl\'s coat', GirlsCoat, {
  default: {},
  short: { lengthBelowWaist: 0.4, buttons: 3, ticketPocket: true },
  plain: { pockets: false, cbFlare: 0, buttonInset: 1 },
})
