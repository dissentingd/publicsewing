# Field jacket

**Source:** Merz, *Merz's Practical Cutting System for Ladies' Jackets and Cloaks* (New York,
1911), corpus `merzspracticalcu00merz` (laptop). Diagram XX, "Hunting Jacketâ€”Turn Collar, Fly
Front", pp. 50â€“51 (PDF pp. 52â€“53). US 1911, public domain. Inches below are Merz's.

**Block:** FreeSewing's Breanna, through Mitchell's box coat (`extends: ../womens-box-coat/spec.yaml`,
`lib/jacket.mjs`): its straight body, side seams from the armhole, neck dart, lapel, collar and
two-piece sleeve. Added for this jacket: patch pockets on the box layout (`boxLayout`'s
`patch`), cut by the coats' pocket and flap pieces.

**Status:** draft. Not sewn.

## What the source shows
- **Semi-fitted**, hip length; the front's dart line put "as far back as possible", under the
  arm.
- **Fly front:** an overlap of 1Â¾ in (9â€“49, Mâ€“48, 46â€“47), the buttons hidden in a fly.
- **Turn collar and lapels:** the crease from D, at the bust line; the lapels and collar drawn
  to taste and traced through; the collar 1Â¾ in to the crease and 1Â¾ in more to its edge.
- No pockets are drawn. A hunting or field jacket of the time had patch pockets, usually four.

## How it maps onto the block
| Feature | Merz | Here (option default) |
|---|---|---|
| Fit | Semi-fitted | The box coat's straight body (`chestEase` 18%), `flare` 2% of the seat each side of the side seam |
| Length | Hip | `lengthBelowWaist` 28% of waist to floor (about 11 in below the waist) |
| Front | Fly front, 1Â¾ in overlap | `buttonExtension` 4.9% of the chest, `buttonInset` 100% (buttons on CF), `buttons` 5; `flyFront` on: a fly strip `flyLap` 150% of the lap wide, from half the lap above the top button to half below the last, its buttonholes on CF |
| Lapel and collar | Turn collar, crease from the bust line | `breakBelowBust` 0, `lapelStyle` notch, `lapelWidth` and `collarWidth` 20% of the neck |
| Pockets | Not drawn | Four flapped patch pockets: `breastPockets` (13% of the chest wide, the top 36% of HPS-to-waist above the waist) and `lowerPockets` (17% wide, the top 15% of waist-to-seat below the waist), each `patchDepth` 115% of its width deep, `patchFromCF` 3.5% of the chest behind CF, flaps `flapRatio` 38% of the width; `pocketShape` square |

## Changes and what isn't modelled
- **Straight, not semi-fitted.** Merz takes in the waist with a dart under the arm and a back
  dart; the box body here has no waist shaping, as field jackets usually don't.
- **The fly's size is ours** (2026-11-01): Merz names the fly but doesn't draw it. A straight
  strip, cut 2 and interfaced, sewn behind the right front's facing; `flyFront` off marks the
  buttons on CF with no fly.
- **The pockets are ours**, not Merz's: none are drawn in the source.
- Each pocket is narrowed to stay clear of the armhole and side seam, and shortened to stay
  above the hem, on any figure.

## Pieces
Front, back (CB seam), facing, collar, top and under sleeves, breast pocket and flap (cut 2
each), lower pocket and flap (cut 2 each; flaps also in lining), and the fly (cut 2).

## Construction
The following order is a proposed method for this unsewn draft.
1. N: sew the front neck darts.
2. P10: when breast pockets are selected, hem and turn their patch edges, topstitch to the front marks, and add flaps if selected.
3. P7: when lower pockets are selected, prepare and topstitch them and their optional flaps at the lower front marks.
4. CB, A and B: close centre back, shoulder, and side seams.
5. E, D and BH: make the hidden button fly when selected, join the facings to the fronts and collar to the neck, and work the front buttonholes.
6. F, G and C: join each top and under sleeve at both seams, then set it into the armhole.
7. H: turn the jacket and sleeve hems and attach the front buttons.

