import { Frock } from '../frock/src/index.mjs'
import { testYoke } from './yoke-checks.mjs'

testYoke('frock', Frock, {
  default: {},
  variant: { opening: 'back', sleeves: 'long', neckFinish: 'band', gathers: 1.3 },
})
