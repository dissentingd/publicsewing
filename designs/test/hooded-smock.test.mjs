import assert from 'node:assert/strict'
import { HoodedSmock } from '../hooded-smock/src/index.mjs'
import { testYoke } from './yoke-checks.mjs'
import { near } from './coat-checks.mjs'

testYoke(
  'hooded-smock',
  HoodedSmock,
  {
    default: {},
    variant: { chestPocket: false, kangarooPocket: false, hoodDrawstring: false, buttons: 1 },
  },
  (pattern) => {
    const store = pattern.setStores[0]
    // The hood's neck edge sews to the whole neckline, to the placket's edges
    const hood = store.get('coat.hood')
    near(hood.neck, hood.target, 1, 'hood neck edge vs neckline')
    // The kangaroo pocket sits on the front body, above the hem and inside its half width
    const pk = store.get('yoke.frontPocket', null)
    if (pk) {
      const f = store.get('yoke.front')
      assert.ok(pk.y > f.yokeY && pk.y + pk.h < f.hemY, 'kangaroo between the yoke seam and the hem')
      assert.ok(pk.w < pattern.parts[0]['hooded-smock.frontBody'].paths.seam.bbox().bottomRight.x, 'kangaroo across the front')
    }
  },
)
