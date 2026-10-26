import { Pinafore } from '../pinafore/src/index.mjs'
import { testYoke } from './yoke-checks.mjs'

testYoke('pinafore', Pinafore, {
  default: {},
  variant: { opening: 'back', sleeves: 'long', neckFinish: 'band', gathers: 1.3 },
})
