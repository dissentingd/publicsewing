import { Nightshirt } from '../nightshirt/src/index.mjs'
import { testYoke } from './yoke-checks.mjs'

testYoke('nightshirt', Nightshirt, {
  default: {},
  variant: { frontYoke: true, gathers: 1.2, sideSlit: 0, sleeves: 'short', opening: 'back' },
})
