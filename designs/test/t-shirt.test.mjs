import { test } from 'node:test'
import { TShirt } from '../t-shirt/src/index.mjs'
import { sets, checkClean, near } from './coat-checks.mjs'

for (const [name, measurements] of Object.entries(sets)) {
  test(`T-shirt: ${name}`, () => {
    const pattern = new TShirt({ measurements, sa: 10 }).draft()
    const store = checkClean(pattern)
    const back = store.get('coat.back')
    const front = store.get('coat.front')
    near(back.side, front.side, 0.5, 'side seams')
    near(back.shoulder, front.shoulder, 0.5, 'shoulder seams')

    const sleeve = store.get('coat.sleeve')
    near(sleeve.cap, sleeve.armhole, 3, 'sleeve cap vs armhole')
    near(sleeve.underarm[0], sleeve.underarm[1], 0.5, 'sleeve underarm seam')

    const collar = store.get('coat.collar')
    near(collar.neck, collar.target, 1, 'collar vs neckline')
  })
}
