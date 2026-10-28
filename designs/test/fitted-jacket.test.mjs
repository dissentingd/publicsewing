import { FittedJacket } from '../fitted-jacket/src/index.mjs'
import { testJacket } from './jacket-checks.mjs'

testJacket('fitted jacket', FittedJacket, {
  default: {},
  loose: { cbSuppression: 0, underarmSuppression: 0, buttons: 4, lengthBelowWaist: 0.3 },
  plain: { pockets: false, breastPocket: false, lining: false },
})
