import assert from 'node:assert/strict'
import { NorfolkJacket } from '../norfolk-jacket/src/index.mjs'
import { testCoat, near } from './coat-checks.mjs'

// The cut pieces sew back into the whole front and back, the pleats folded out
function seams(pattern) {
  const parts = pattern.parts[0]
  const store = pattern.setStores[0]
  const find = (n) => parts[`norfolkjacket.${n}`]
  const base = find('front').points
  const fp = store.get('coat.frontPleat')
  const bp = store.get('coat.backPleat')
  const mid = find('frontMiddle')
  const low = find('frontLower').points
  // Front waist seam: the middle's, pleats folded out, is the skirt's
  const midWaist = mid.points.edgeAtWaist.dist(mid.points.sideWaist.translate(fp.pleat, 0)) - fp.pleat
  near(midWaist, low.edgeAtWaist.dist(low.sideWaist), 0.5, 'front waist seam')
  // Back waist seam
  const bm = find('backMiddle').points
  const bl = find('backLower').points
  near(bm.cbWaist.dist(bm.sideWaist), bl.cbWaist.dist(bl.sideWaist), 0.5, 'back waist seam')
  // The armhole moves out with the side seam, by all the pleats' cloth
  near(find('backMiddle').paths.seam.bbox().bottomRight.x, Math.max(bm.armhole.x, bm.sideWaist.x) + bp.pleat, 0.5, 'back middle width')
  // The pleats stay on the panels, clear of the armhole
  assert.ok(fp.last < fp.width, `front pleats ${fp.last.toFixed(0)} clear the armhole ${fp.width.toFixed(0)}`)
  if (bp.last) assert.ok(bp.last < bp.width, `back pleats ${bp.last.toFixed(0)} clear the armhole ${bp.width.toFixed(0)}`)
  // The yoke seams sit above the chest line, the lapel on the yoke
  assert.ok(base.edgeYoke.y < base.cfWaist.y, 'front yoke above the waist')
  const lapel = store.get('coat.lapel', null)
  if (lapel) assert.ok(lapel.breakY < base.edgeYoke.y, 'lapel breaks above the yoke seam')
  // The front's armhole: the two panels' parts are the whole the sleeve was fitted to
  const a = store.get('coat.frontYoke')
  near(a.below + a.above, store.get('library.sleeve.frontArmholeLength'), 0.5, 'front armhole')
  // Every button is on a panel
  const count = ['frontYoke', 'frontMiddle', 'frontLower'].reduce((t, n) => t + Object.keys(find(n).snippets).filter((s) => s.startsWith('button')).length, 0)
  assert.equal(count, pattern.settings[0].options?.buttons ?? 4, 'buttons on the panels')
}

const front = 'norfolkjacket.front'
testCoat('norfolk jacket', NorfolkJacket, front, {
  default: {},
  closed: { lapels: false, buttons: 5 },
  plain: { pleats: 0, backVent: false, pocketFlaps: false, lowerPockets: false },
  deep: { pleats: 4, pleatDepth: 0.025, hemCurve: 0.5 },
}, seams)
