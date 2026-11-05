import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Aprons } from '../aprons/src/index.mjs'
import { sets, checkClean } from './coat-checks.mjs'

const styles = {
  plasterer: ['bibBody', 'waistTies', 'neckTie', 'sidePockets'],
  carpenter: ['bibBody', 'waistTies', 'neckTie'],
  butcherSquare: ['squareBody', 'waistTies'],
  butcherPoint: ['pointedBody', 'waistTies'],
  hairdresser: ['squareBody', 'waistTies'],
  barman: ['shortBody', 'elasticTab'],
  grocer: ['squareBody'],
  painter: ['bibBody', 'waistTies', 'neckTie', 'toolPocket'],
}

for (const [style, expected] of Object.entries(styles)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`aprons (${style}): ${name}`, () => {
      const pattern = new Aprons({ measurements, sa: 10, options: { apronType: style } }).draft()
      const store = checkClean(pattern)
      for (const piece of ['bibBody', 'squareBody', 'pointedBody', 'shortBody', 'elasticTab', 'waistTies', 'neckTie', 'sidePockets', 'toolPocket']) {
        assert.equal(Boolean(pattern.parts[0][`aprons.${piece}`].hidden), !expected.includes(piece), `${piece} visibility`)
      }
      const body = expected.find((piece) => piece.endsWith('Body'))
      assert.ok(store.get(`polygon.${body}`).width > 0, 'body has width')
      assert.ok(store.get(`polygon.${body}`).height > 0, 'body has height')
      if (style === 'butcherPoint') assert.ok(pattern.parts[0]['aprons.pointedBody'].snippets.buttonhole0)
      if (style === 'barman') assert.ok(pattern.parts[0]['aprons.elasticTab'].snippets.button0)
    })
  }
}
