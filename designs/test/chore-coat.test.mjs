import { ChoreCoat } from '../chore-coat/src/index.mjs'
import { testCoat } from './coat-checks.mjs'

testCoat('chore coat', ChoreCoat, 'chorecoat.front', {
  default: {},
  square: { pocketShape: 'square', buttons: 6, hemCurve: 1 },
})
