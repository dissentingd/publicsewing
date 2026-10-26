import { ShirtwaistDress } from '../shirtwaist-dress/src/index.mjs'
import { testYoke } from './yoke-checks.mjs'

testYoke('shirtwaist dress', ShirtwaistDress, {
  default: {},
  variant: { neckFinish: 'band', sleeves: 'short', opening: 'back', gathers: 1.2, skirtLength: 0.9 },
})
