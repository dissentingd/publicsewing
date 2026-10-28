import { WorkShirt } from '../work-shirt/src/index.mjs'
import { testYoke } from './yoke-checks.mjs'

testYoke('work-shirt', WorkShirt, {
  default: {},
  variant: { neckFinish: 'collar', breastPocket: false, sideSlit: 0, opening: 'back' },
})
