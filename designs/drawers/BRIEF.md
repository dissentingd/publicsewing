# Drawers

**Source:** Vincent, *The Cutter's Practical Guide ... Shirts and Other Undergarments* (1890), corpus `vincentmakingshirts18xx` (tracked). "Pants or Drawers", p. 24 (PDF p. 28). Public domain.
Inches below are Vincent's, on a 40 in seat for the worked numbers.

**Block:** FreeSewing's Titan, through the overall pants (`extends`), for its leg cut in one with no side seam. Not on `pyjama-trousers`, as the queue suggested: those are gathered, with a side seam. Options only; no new code. Drafted from the wearer's measurements, so it fits any size.

**Status:** draft. Not sewn.

**Threadloop:** 535 free results for "long drawers" (2026-11-04), the first ones matching on the word "long": no drawers among them.

## What the source shows
"A moderate demand for drawers made from cotton and other materials, to be worn with trousers that are unlined."
- **No side seam:** "there is no sideseam, so that all the measures must be made up at the seat". The dotted outline, BCDE, is "the pattern laid out flat".
- **Length:** "in the case of drawers they would only extend to just below the knee".
- **Seat:** from I to the line "should not be less than one-fourth of the seat plus 1 inch".
- **Waist:** "the size of the waist, allowing 2 inches for sewing of the seams"; "the extra size of the waist can be drawn in if desired".
- **Leg:** A to 8, the bottom, 1 in less than a quarter of the seat, with about 1½ in added at the bottom of the leg seam.
- **Making up:** "the seams should be treated the same as shirts, namely, turned in and stitched. They are fastened with buttons and holes."
- **Materials:** calico, swansdown, occasionally flannel.

## How it maps onto the block
| Feature | Vincent | Here (option default) |
|---|---|---|
| Seat | A quarter plus 1 in, each quarter: 4 in round | `seatEase` 10% |
| Waist | Plus 2 in, on about 32 | `waistEase` 6.5% |
| Length | Just below the knee | `lengthBonus` -37% of waist to floor: 4 to 9 cm below the knee, by size |
| Bottom | 21 in round, on a 40 seat | `hemWidth` 104% of the knee with its ease |
| Side seam | None | The overall pants' leg in one |
| Fastening | Buttons and holes | The overall's fly and waistband; `beltLoops` 0 |

## Pieces
Leg (cut 2, with no side seam), waistband, fly pieces.

## Construction
Inseam, then crotch seam, felled "the same as shirts". Fly, buttons and holes. Waistband. Hem.

## Changes and what isn't modelled
- **The waist isn't drawn in.** Vincent's "extra size" is fitted away here: the waist is drafted to the waist plus 6.5%.
- **The block's fork, not Vincent's** 1½ in added at the fork.
- **The fly and waistband are the family's;** Vincent says only "buttons and holes".
- **The length follows the block's leg,** so it isn't an equal distance below the knee at every size.
- **At a very wide hem and a large figure** (`seatEase` 15%, `hemWidth` 120%) the two sides of the inseam differ by up to about 4 mm: ease it in.
