import assert from 'node:assert/strict'
import { PrincessCoat } from '../princess-coat/src/index.mjs'
import { near } from './coat-checks.mjs'
import { testJacket } from './jacket-checks.mjs'

testJacket(
  'princess coat',
  PrincessCoat,
  {
    default: {},
    fuller: { hemFlare: 0.18 },
    notch: { lapelStyle: 'notch', buttons: 4 },
    plain: { pockets: false, lining: false, halfBelt: false, doubleBreasted: false, buttonExtension: 0.04, hemFlare: 0, lengthBelowWaist: 0.4 },
  },
  (pattern) => {
    const store = pattern.setStores[0]
    const f = store.get('jacket.front')
    const panels = store.get('jacket.panels')
    // The CB is a flared seam, so the back and its lining are cut in pairs
    assert.equal(panels.back.fold, false, 'back cut in pairs')
    if (panels.backLining) assert.equal(panels.backLining.fold, false, 'back lining cut in pairs')
    // The last button is at the waist, on the front, and clear of the front's waist seam
    const y = Object.values(pattern.parts[0]['tailoredjacket.front'].snippets)
      .filter((s) => s.def === 'button')
      .map((s) => s.anchor.y)
    near(Math.max(...y), f.waistY, 1, 'last button at the waist')
    assert.ok(f.buttonBottom >= f.waistY - 1, 'buttons to the waist')
    // Every button lies on the front panel, clear of its seam at the waist: this is why the seam
    // moves (on men's sets Breanna's waist dart otherwise reaches CF)
    const seam = panels.front.marks.seamWaist.x
    const button = f.cfx + (f.rows ?? 0)
    assert.ok(seam - button > 0.015 * pattern.settings[0].measurements.chest, `button ${button.toFixed(0)} clear of the seam ${seam.toFixed(0)}`)
    // The pocket's band hangs square from its sloped mouth: its front corner stays on the side front
    const q = store.get('jacket.pockets')?.hip
    if (q) {
      const t = (q.angle * Math.PI) / 180
      const { seamWaist: w, hemSeam: h } = panels.sideFront.marks
      const [x, y] = [q.x - q.flap * Math.sin(t), q.y + q.flap * Math.cos(t)]
      assert.ok(x > w.x + ((h.x - w.x) * (y - w.y)) / (h.y - w.y), `band's corner on the side front: ${x.toFixed(0)}`)
    }
  },
)
