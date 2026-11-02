import { Smock } from '../childrens-smock/src/index.mjs'
import { testYoke } from './yoke-checks.mjs'

testYoke('children's smock', Smock, {
  default: {},
  variant: { opening: 'front', sleeves: 'short', neckFinish: 'band', yokeDepth: 0.3, gathers: 2 },
})
