import { Smock } from '../smock/src/index.mjs'
import { testYoke } from './yoke-checks.mjs'

testYoke('smock', Smock, {
  default: {},
  variant: { opening: 'front', sleeves: 'short', neckFinish: 'band', yokeDepth: 0.3, gathers: 2 },
})
