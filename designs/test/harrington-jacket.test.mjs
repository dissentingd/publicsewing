import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HarringtonJacket } from '../harrington-jacket/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const variants = {
  default: {},
  relaxed: { chestEase: 0.24, bandHeight: 0.06 },
  apart: { chestEase: 0.3, bicepsEase: 0.45, cuffEase: 1.5, seatEase: 0.2, lengthBelowWaist: 0.95, hemFlare: 0.1, frontDrop: 0.15, ribStretch: 0.3 },
}

for (const [variant, options] of Object.entries(variants)) for (const [set, measurements] of Object.entries(sets)) {
  test(`Harrington ${variant}: ${set}`, () => {
    const pattern = new HarringtonJacket({ measurements, options, sa: 10 }).draft()
    const store = checkClean(pattern)
    const [back, front] = [store.get('coat.back'), store.get('coat.front')]
    near(back.side, front.side, 0.5, 'body side seams')
    near(store.get('coat.collar').neck, store.get('coat.collar').target, 1, 'collar seam')
    const raglan = store.get('raglan.sleeve.front')
    const other = store.get('raglan.sleeve.back')
    near(raglan.underarm, other.underarm, 0.5, 'raglan underarm seam')
    near(raglan.cap, store.get('library.sleeve.frontArmholeToArmholePitch'), 3, 'front raglan cap')
    near(other.cap, store.get('library.sleeve.backArmholeToArmholePitch'), 3, 'back raglan cap')
    near(store.get('rib.cuff').edge, store.get('coat.raglanSleeveHem'), 0.01, 'cuff to sleeve hem')
    near(store.get('rib.waistband').edge, 2 * (store.get('coat.hem.back') + store.get('coat.hem.front')), 0.01, 'band to body hem')
    assert.ok(store.get('coat.zip').length > 0, 'front zip runs from collar to hem')
    assert.equal(store.cutlist['harrington-jacket.cuff'].materials.ribbing[0].cut, 2, 'two rib cuffs')
  })
}
