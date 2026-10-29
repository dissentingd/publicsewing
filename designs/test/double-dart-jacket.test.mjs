import { DoubleDartJacket } from '../double-dart-jacket/src/index.mjs'
import { testJacket } from './jacket-checks.mjs'

testJacket('double-dart jacket', DoubleDartJacket, {
  default: {},
  loose: { cbSuppression: 0, underarmSuppression: 0, secondSuppression: 0, lengthBelowWaist: 0.3 },
  plain: { lining: false, secondAt: 0.35, secondSuppression: 0.2 },
})
