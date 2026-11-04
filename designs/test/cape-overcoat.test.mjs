import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CapeOvercoat } from '../cape-overcoat/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  plain: { buttons: 0, capeFlare: 0, capeLength: 0.55 },
  shorter: { capeLength: 0.50 },
  wide: { capeFlare: 25, buttonExtension: 0.12, collarWidth: 0.15 },
}

for (const [variant, options] of Object.entries(variants)) {
  for (const [name, measurements] of Object.entries(sets)) {
    test(`cape overcoat (${variant}): ${name}`, () => {
      const pattern = new CapeOvercoat({ measurements, sa: 10, options }).draft()
      const store = checkClean(pattern)
      const parts = pattern.parts[0]
      assert.ok(!parts['cape.front'].hidden && !parts['cape.back'].hidden, 'two-piece cape')
      assert.ok(parts['cape.whole'].hidden, 'no one-piece Mitchell cape')
      const s = store.get('cape.seams')
      near(s.side[0], s.side[1], 3, 'cape side seam')
      near(s.shoulder[0], s.shoulder[1], 2, 'shoulders')
      near(store.get('coat.collar').neck, store.get('coat.collar').target, 1, 'stand collar')
      assert.ok(s.sweep > measurements.chest * 1.5, 'cape clears the body')
      if (variant === 'default' && name === 'cisMaleAdult38') {
        near(s.hemCb, 42 * 25.4, 3, 'Simons 1916 back length')
      }
    })
  }
}
