# Fitted overcoat

**Source:** Simons, *Designing Overcoats* (1916), corpus `designingovercoa00simo` (tracked). "Young Men's Three Button S. B. Form Fitting Overcoat", text p. 18, text and diagram p. 19 (PDF pp.
22-23). US 1916, public domain. Inches below are Simons', for a 36 breast, drafted on a 20 and 21 scale.

**The name:** the book's contents list "Form Fitting Overcoats, Y. Men's" at p. 18 and "French Overcoat, Y. Men's" at p. 19, but p. 19 is this coat's diagram and there's no other French draft. So this is the
French overcoat the queue asked for, if the book has one, under a plain name. The queue's pp. 42-44 are a mackinaw.

**Block:** FreeSewing's Bent, through the suit jacket (`extends: ../suit-jacket/spec.yaml`, `lib/body3.mjs`): body, lapel, collar, two-piece sleeve, lining. Added for this coat: `flare` on `body3Back` and `body3Front`.

**Status:** draft. Not sewn.

**Threadloop:** 3 free results for overcoat (2026-11-03): two coats and a cape, none of them a fitted overcoat by name.

## What the source shows
- **The coat:** form-fitting, three-button, single-breasted; breast 36, length 40.
- **Back:** CB shaped in 1¼ in at the waist (E to 20), a vent from 22 to the hem, with the skirt flared at the side seam (R to S 1 in; the forepart's seam crossing it to 5 at the hem).
- **Forepart:** a waist dart with a long slanted flap pocket below the waist, and a long slanted breast welt.
- **Front:** the lapel rolling from 9 to 16, about at the top button; three buttons; the hem falling 2 in to the front (11 to 12).

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Length | 23½ in below the waist | `lengthBelowWaist` 221% of waist to seat |
| Front hem | 2 in lower | `frontDrop` 19% |
| Flare | Measured off p. 19 | `hemFlare` 3.2% of the seat, on each panel's edge |
| Break | About half way from the chest line to the waist | `breakAt` 48% |
| Last button | About 6 in below the waist | `buttonBottom` 57% |
| Vent | About 21 in, 22 to the hem | `ventLength` 198%, `ventWidth` 4% of the chest |
| Pockets | A rising welt, a falling flap | `breast` and `lower` welts, `rise` as drawn |
| Chest and waist | Drafted on 20-21 for 36 | `chestEase` 18%, `waistEase` 14% (ours) |

## Changes and what isn't modelled
- **Three panels, not two.** Simons has a back and forepart with a waist dart; here Bent's side body does the shaping in two seams. The look from outside is closer to a fitted coat than a seam-for-seam copy.
- **Flare:** it goes on the seam edges, not by crossing the two pieces at the side seam as he draws it.
- **Lining and inside pocket** are the suit jacket's. He doesn't mention one, and a real overcoat wants it. It can be turned off.
- **Sleeves:** Bent's two-piece; no vent.
- **Sizes:** drafted for a young man, for any figure here.

## Pieces
Front, back (cut 2, CB seam and vent), side body (cut 2), facing, back-neck facing, collar, top and under sleeves, flap, welts and bags. In lining: front, back, side body, sleeves, inside pocket.

## Construction
1. Pockets on the fronts. Back's CB seam and vent.
2. Back, side bodies and fronts together.
3. Facing, collar, lapels. Shoulders, sleeves.
4. Lining made up the same way, set in round the facings and cuffs, free at the vent.
5. Hem, buttons and buttonholes.

## Checks
`test/fitted-overcoat.test.mjs`: every size, the default, a plain unlined one with no flare or vent, and a short, flared one. Seams, shoulders, collar, sleeve cap, the vent below the waist, the welts clear of the seam, the buttons and the break.
