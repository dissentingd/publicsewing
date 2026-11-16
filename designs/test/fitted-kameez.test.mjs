import assert from 'node:assert/strict'
import { FittedKameez } from '../fitted-kameez/src/index.mjs'
import { test } from 'node:test'
import { along, onSeam } from './bodice-checks.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

const names = { back: 'fitted-kameez.back', front: 'fitted-kameez.front', sleeve: 'fitted-kameez.sleeve' }

const variants = {
    default: {},
    kurti: { skirtLength: 0.32, sideSlit: 0.3 },
    longSleeves: { sleeves: 'long' },
    apart: { neckShape: 'v', neckWiden: 0.15, neckDepth: 0.5, neckSlit: 0, backNeckDepth: 0.3, skirtLength: 0.85, hemFlare: 0.15, seatEase: 0.3, sideSlit: 0.75, lowerDart: 0.9, zipLength: 0, shortSleeve: 0.7 },
}

// Bella's seams, as the shell top checks them (its waist darts are inside the piece now)
function check(pattern) {
    const store = checkClean(pattern)
    const parts = pattern.parts[0]
    const bk = parts[names.back]
    const fr = parts[names.front]
    near(along(bk, 'waistSide', 'armhole'), along(fr, 'sideHem', 'bustDartBottom') + along(fr, 'bustSide', 'armhole'), 0.5, 'upper side seams')
    near(along(fr, 'bustDartBottom', 'bustDartTip'), along(fr, 'bustDartTip', 'bustSide'), 0.5, 'bust dart legs')
    const sb = store.get('bodice.back').shoulder
    const sf = store.get('bodice.front').shoulder
    assert.ok(sb >= sf - 0.5 && sb <= Math.max(sf * 1.05, sf + 6), `shoulders ${sb.toFixed(1)} vs ${sf.toFixed(1)}`)
    const o = pattern.settings[0].options ?? {}
    const [b, f] = ['back', 'front'].map((w) => store.get(`bodice.tunic.${w}`))
    // The side seams below the waist match; the hip line takes the seat with its ease
    near(b.side, f.side, 0.5, 'side seams below the waist')
    const m = pattern.settings[0].measurements
    const ease = o.seatEase ?? 0.11
    const half = ['back', 'front'].map((w) => parts[names[w]]).reduce((s, p) => s + p.points.hipSide.x - (p.points.cfHem ?? p.points.waistCenter).x, 0)
    if (b.out > 0 && f.out > 0) near(half * 2, m.seat * (1 + ease), 1, 'hip round')
    else assert.ok(half * 2 >= m.seat * (1 + ease) - 1, 'hip round at least the seat with ease')
    for (const w of ['back', 'front']) {
      const p = parts[names[w]]
      assert.ok(onSeam(p, 'hipSide') && onSeam(p, 'hemSide') && onSeam(p, 'hipCenter'), `${w} outline reaches the hem`)
      if (p.points.hipDartTip) assert.ok(p.points.hipDartTip.y < p.points.hipSide.y, `${w} waist dart closes above the hip`)
    }
    // The hem's side end drops from centre as the waist's does, within 15 mm or 2.5% of the length (the second side
    // seam is matched to the first's length; Bella's front waist dips at the side under the bust dart)
    for (const w of ['back', 'front']) {
      const pts = parts[names[w]].points
      const waist = w === 'front' ? pts.sideHem.y - pts.cfHem.y : pts.waistSide.y - pts.waistCenter.y
      const hem = pts.hemSide.y - pts.hipCenter.y
      assert.ok(Math.abs(hem - waist) <= Math.max(15, (pts.hipCenter.y - (w === 'front' ? pts.cfHem.y : pts.waistCenter.y)) * 0.025), `${w} hem drop ${hem.toFixed(1)} vs waist ${waist.toFixed(1)}`)
    }
    const sleeve = parts[names.sleeve]
    if (!sleeve.hidden) {
      near(...store.get('bodice.sleeve').underarm, 1, 'sleeve underarm seams')
      const cap = store.get('bodice.sleeve').cap
      const armhole = bk.paths.armhole.length() + fr.paths.armhole.length()
      assert.ok(cap >= armhole - 2 && cap <= armhole * 1.05 + 2, `sleeve cap ${cap.toFixed(1)} vs armhole ${armhole.toFixed(1)}`)
    }
}

for (const [variant, options] of Object.entries(variants)) for (const [set, measurements] of Object.entries(sets)) {
  test(`fitted kameez ${variant}: ${set}`, () => check(new FittedKameez({ measurements, options, sa: 10 }).draft()))
}
