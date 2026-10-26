import { Nightgown } from '../nightgown/src/index.mjs'
import { testYoke } from './yoke-checks.mjs'

testYoke('nightgown', Nightgown, {
  default: {},
  variant: { opening: 'back', sleeves: 'long', neckFinish: 'band', gathers: 1.3 },
})
