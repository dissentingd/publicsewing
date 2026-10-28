import { Jumpsuit } from '../jumpsuit/src/index.mjs'
import { testSuit } from './suit-checks.mjs'

testSuit('jumpsuit', Jumpsuit, {
  default: {},
  plain: { breastPockets: false, lowerPockets: false, legTaper: 0, neckWidth: 0.22, frontNeckDepth: 0.18, buttons: 4 },
})
