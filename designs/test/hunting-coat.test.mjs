import assert from 'node:assert/strict'
import { HuntingCoat } from '../hunting-coat/src/index.mjs'
import { testCoat, near } from './coat-checks.mjs'

// The split back: the pieces sew back into the whole back
function backSeams(pattern) {
  const parts = pattern.parts[0]
  const store = pattern.setStores[0]
  const pts = (n) => parts[`huntingcoat.${n}`].points
  const yoke = pts('backYoke')
  const mid = pts('backMiddle')
  const low = pts('backLower')
  const { pleat } = store.get('coat.backPleat')
  // Yoke seam: yoke bottom = middle top less the pleat
  const midTop = mid.cbYoke.dist(mid.pleatTop) + mid.pleatTop.translate(pleat, 0).dist(mid.armYoke.translate(pleat, 0))
  near(midTop, yoke.cbYoke.dist(yoke.armYoke), 0.5, 'yoke seam')
  // Waist seam: middle bottom (less the pleat) = lower top
  near(mid.cbWaist.dist(mid.sideWaist), low.cbWaist.dist(low.sideWaist), 0.5, 'waist seam')
  // Side seam: middle + lower = the front's
  const side = mid.armhole.dist(mid.sideWaist) + low.sideWaist.dist(low.seat) + low.seat.dist(low.hem)
  near(side, store.get('coat.front').side, 0.5, 'side seam over two back pieces')
  // Armhole: yoke + middle = the back armhole the sleeve was fitted to
  const a = store.get('coat.backArmhole')
  near(a.below + a.above, store.get('library.sleeve.backArmholeLength'), 0.5, 'back armhole')
  assert.ok(yoke.cbYoke.y < yoke.armhole.y, 'yoke above the chest line')
}

testCoat('hunting coat', HuntingCoat, 'huntingcoat.front', {
  default: {},
  plain: { belt: false, pocketFlaps: false, pocketPleat: 0, actionPleat: 0, pocketShape: 'pointed' },
}, backSeams)
