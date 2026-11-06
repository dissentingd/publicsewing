import assert from 'node:assert/strict'
import { ThreePieceLongCoat } from '../three-piece-long-coat/src/index.mjs'
import { testJacket } from './jacket-checks.mjs'

testJacket('Three-piece long coat', ThreePieceLongCoat, {
  default: {},
  fuller: { seatEase: 0.12 },
  plain: { lining: false, buttons: 2, lengthBelowWaist: 0.5 },
}, (pattern) => {
  const panels = pattern.setStores[0].get('jacket.panels')
  assert.ok(panels.front && panels.back && panels.sideFront && panels.sideBack)
})
