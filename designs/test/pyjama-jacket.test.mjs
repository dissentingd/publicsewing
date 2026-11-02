import { PyjamaJacket } from '../pyjama-jacket/src/index.mjs'
import { testCoat } from './coat-checks.mjs'

testCoat('pyjama jacket', PyjamaJacket, 'barberscoat.front', {
  default: {},
  openNeck: { neckStyle: 'open' },
  open: { neckStyle: 'open', lowerPockets: true, pocketShape: 'rounded', buttons: 4 },
})
