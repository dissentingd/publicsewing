# Surtout

**Source:** Simons, *Designing Overcoats* (1916), corpus `designingovercoa00simo` (tracked). "Two Button D. B. Y. Men's Surtout", text p. 38, text and diagram
p. 39 (PDF pp. 42-43). US 1916, public domain. Inches below are Simons', for a 38 breast, drafted on a 20 and 21 scale.

**Block:** FreeSewing's Bent, through the suit jacket (`extends: ../suit-jacket/spec.yaml`, `lib/body3.mjs`): back, side body, front, lapel, collar, two-piece
sleeve. Added for this coat: a body cut off above the seat line, buttons in two rows on `body3Front`, and `body3Skirt`, the skirt.

**Status:** draft. Not sewn.

**Threadloop:** no free frock coat or surtout among the 6 results for frock coat (2026-11-03), all of them dresses and tops by name.

## What the source shows
- **The coat** (p. 38): "drafted with a high waist effect and a narrow shoulder". Breast 38, waist 16½, "fashionable waist" 18, full length 40.
- **Body:** back, side body, forepart, cut through at the fashionable waist; the forepart's waist falling toward the front (7 to 18).
- **Front:** double-breasted: "X to Y is 2¼ inches, ½ of the button stand". The lapel from 17 down 14 in to 16, two rows of two buttons, the first near the natural waist.
- **Vee:** "take out ¼ inch Vee at point 20".
- **Skirt** (p. 39): one piece: 26 down through 24 to 25, "1 inch longer than J-K"; the top from 26 to 21 "hollowing out 1 inch at point 27"; squared down from 21 to 22, out ¼ in at 22; the back seam
  "rounding out 1 inch at point 24".
- **Pockets:** a breast welt is drawn. Nothing else.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Waist seam | 18 in against 16½ | `lengthBelowWaist` 14% of waist to seat |
| Front fall | About 3¾ in as drawn | `frontDrop` 35% |
| Stand | 2¼ in, half of it | `buttonExtension` 5.9% of the chest |
| Buttons | Two rows of two | `buttons` 2, `buttonRow` 62% of the stand (ours), `buttonBottom` 38% (about 4 in below the waist, as drawn) |
| Lapel break | At the top button | `breakAt` 100% |
| Skirt length | 23 in down the back seam | `skirtSeam` 216% of waist to seat |
| Skirt flare | 23°, measured off the diagram | `skirtLean` 23° |
| Back seam rounding | 1 in | `skirtRound` 9.4% |
| Chest | Drafted on 20-21 for 38 | `chestEase` 22%, `waistEase` 14% (ours) |

## Changes and what isn't modelled
- **Bent's body, not Simons' draft.** So the "narrow shoulder" is Bent's, and the side body's seams are the library's.
- **The skirt's top:** its length fits the three panels' bottoms, hollowed and rising by the front's fall. Simons rules it from 26 to 21.
- **The front's fall** is on the forepart only, the back and side body level, not a straight line 7-18 across all three.
- **The ¼ in Vee at 20 isn't drafted.**
- **The CF hem** is set from the back seam and the fall, a little shorter at the front than his: compare in a muslin.
- **Skirt facing:** cut on and folded back (ours). The body's is the suit jacket's.
- **No pockets in the skirt, no lining, no vent, no sleeve vent**: the book gives none, though a real coat would want pockets and a lining.
- **Fit:** Simons draws a young man's coat. Children's and stout sizes draft, but it's a young man's cut.

## Pieces
Front, back (fold), side body (cut 2 each but the back), skirt (cut 2), facing, collar, top and under sleeves, breast welt and bag.

## Construction
1. Breast welts. Back, side bodies and fronts together.
2. Skirt's CB seam, then the skirt to the body, matching CB, each panel's seams and the front edge. Fold the skirt's facing back.
3. Facing, collar, lapels.
4. Shoulders, sleeves.
5. Hem, buttons and buttonholes.

## Checks
`test/surtout.test.mjs`: every size, the default, long, plain, and a wider stand and skirt. Seams between the panels, shoulders, collar, sleeve cap, the skirt's
top against the body's bottom, the buttons and the break.
