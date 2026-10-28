# Women's peacoat

**Source:** Merz, *Merz's Practical Cutting System for Ladies' Jackets and Cloaks* (New York,
1911), corpus `merzspracticalcu00merz` (laptop). Diagram XXI, "Double-Breasted Jacket, Storm
Collar, Tight Back, Semi-Fitted Front", pp. 52–53 (PDF p. 55). US 1911, public domain. Inches
below are Merz's.

**Block:** FreeSewing's Breanna, through Mitchell's tailored jacket (`extends:
../tailored-jacket/spec.yaml`, `lib/jacket.mjs`): its princess seams, flare, lapel, collar,
facings, lining, set-in flap pockets and two-piece sleeve. Added for this coat: a
double-breasted front (`jacketLayout`'s `rows`), with two rows of buttons.

**Status:** draft. Not sewn.

## What the source shows
- **Double-breasted:** an overlap of 4¾ in at the top (9–49), ¾ in less at the waist (M–48,
  3¾), 4 in below (V–47 and at 25); the edge drawn through those points.
- **"For this style of overlap, it needs a 1¼-inch dart at 25"**: a dart at the neck.
- **Storm collar:** a deep collar, 4¼ in at the front (52–53), 3¾ at the back (25–58), its
  outer edge swept out ⅓ of the height for the turn; it can be worn up.
- **Tight back** (CB seam and side backs), **semi-fitted front** with its dart line.
- **Hip length** (diagram); buttons in two rows, from high on the chest to below the waist.
- No pockets are drawn.

## How it maps onto the block
| Feature | Merz | Here (option default) |
|---|---|---|
| Fit | Tight back, semi-fitted front | The tailored jacket's princess seams, looser: `chestEase` 18%, `waistEase` 20%, `seatEase` 12% (worn over a sweater) |
| Length | Hip length | `lengthBelowWaist` 28% of waist to floor (about 11 in below the waist) |
| Overlap | 3¾–4¾ in | `buttonExtension` 11% of the chest (4 in at bust 36), straight |
| Buttons | Two rows | `doubleBreasted` on; `buttons` 3 to a row, each row `buttonRow` 62% of the lap from CF (2½ in); holes on the outer row |
| Lapel and collar | Storm collar | `lapelStyle` notch, `lapelWidth` 32% and `collarWidth` 28% of the neck: a wide lapel turning at the bust line (`breakBelowBust` 0) and a deep turn-down collar |
| Pockets | None drawn | The tailored jacket's hip flap pocket; no breast welt or ticket pocket |
| Lining | Not given | `lining` on, as the tailored jacket |
| Facing | Not given | `facingWidth` 17% of the chest (wider than the lap) |

## Changes and what isn't modelled
- **The storm collar** is the tailored jacket's notched collar, deeper. Merz's collar, which
  stands up and buttons across the throat, isn't built.
- **Merz's neck dart** isn't taken; the bust shaping goes into the princess seams, as on the
  tailored jacket.
- **The overlap is straight**, not narrowed ¾ in at the waist.
- **The inner row of buttons** can fall behind the facing's edge (the facing stops short of
  the princess seam); sew those buttons through the front and its interfacing.

## Pieces
As the tailored jacket, without the breast welt and ticket pocket: front, back, side back, side
front, facing, collar, top and under sleeves, back-neck facing, front and back lining, and the
hip pocket's flap, jet and bag.

## Construction
As the tailored jacket's brief. Buttonholes on the outer row of the front that laps over (the
right, for women); buttons on its inner row, and on the other front under the holes.
