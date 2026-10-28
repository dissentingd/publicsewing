# Field jacket

**Source:** Merz, *Merz's Practical Cutting System for Ladies' Jackets and Cloaks* (New York,
1911), corpus `merzspracticalcu00merz` (laptop). Diagram XX, "Hunting Jacket—Turn Collar, Fly
Front", pp. 50–51 (PDF pp. 52–53). US 1911, public domain. Inches below are Merz's.

**Block:** FreeSewing's Breanna, through Mitchell's box coat (`extends: ../box-coat/spec.yaml`,
`lib/jacket.mjs`): its straight body, side seams from the armhole, neck dart, lapel, collar and
two-piece sleeve. Added for this jacket: patch pockets on the box layout (`boxLayout`'s
`patch`), cut by the coats' pocket and flap pieces.

**Status:** draft. Not sewn.

## What the source shows
- **Semi-fitted**, hip length; the front's dart line put "as far back as possible", under the
  arm.
- **Fly front:** an overlap of 1¾ in (9–49, M–48, 46–47), the buttons hidden in a fly.
- **Turn collar and lapels:** the crease from D, at the bust line; the lapels and collar drawn
  to taste and traced through; the collar 1¾ in to the crease and 1¾ in more to its edge.
- No pockets are drawn. A hunting or field jacket of the time had patch pockets, usually four.

## How it maps onto the block
| Feature | Merz | Here (option default) |
|---|---|---|
| Fit | Semi-fitted | The box coat's straight body (`chestEase` 18%), `flare` 2% of the seat each side of the side seam |
| Length | Hip | `lengthBelowWaist` 28% of waist to floor (about 11 in below the waist) |
| Front | Fly front, 1¾ in overlap | `buttonExtension` 4.9% of the chest, `buttonInset` 100% (buttons on CF), `buttons` 5 |
| Lapel and collar | Turn collar, crease from the bust line | `breakBelowBust` 0, `lapelStyle` notch, `lapelWidth` and `collarWidth` 20% of the neck |
| Pockets | Not drawn | Four flapped patch pockets: `breastPockets` (13% of the chest wide, the top 36% of HPS-to-waist above the waist) and `lowerPockets` (17% wide, the top 15% of waist-to-seat below the waist), each `patchDepth` 115% of its width deep, `patchFromCF` 3.5% of the chest behind CF, flaps `flapRatio` 38% of the width; `pocketShape` square |

## Changes and what isn't modelled
- **Straight, not semi-fitted.** Merz takes in the waist with a dart under the arm and a back
  dart; the box body here has no waist shaping, as field jackets usually don't.
- **The fly** (a hidden button strip) isn't drawn; the buttons are marked on CF. A fly can be
  cut as a strip the facing's width and sewn behind the right front.
- **The pockets are ours**, not Merz's: none are drawn in the source.
- Each pocket is narrowed to stay clear of the armhole and side seam, and shortened to stay
  above the hem, on any figure.

## Pieces
Front, back (CB seam), facing, collar, top and under sleeves, breast pocket and flap (cut 2
each), lower pocket and flap (cut 2 each; flaps also in lining).

## Construction
1. Neck darts; pockets: turn and stitch each pocket's top hem, press the edges under, topstitch
   to the front on its marks; make the flaps (outer and lining), sew each above its pocket.
2. CB, shoulder and side seams.
3. Facings to the fronts; the collar to the neck, from CB to the gorge.
4. Sleeves: the two pieces together, then set in.
5. Hems; buttonholes on the right front (women's), buttons on the left.
