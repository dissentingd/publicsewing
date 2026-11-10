# Dinner jacket

**Source:** Simons, *Designing Sack Coats and Vests* (The Clothing Designer Co., New York, 1918),
corpus `designingsackcoa00simo` (tracked). Young men's tuxedo, Diagram X: text p. 18, plate p. 19
(PDF pp. 22–23). It is "made similar to the young men's English coat" (Diagram VIII, pp. 14–15),
itself drafted from the conservative sack (Diagrams I–V). US 1918, public domain. Inches below are
Simons', for his size 36.

**Block:** FreeSewing's Bent, through the sack coat (`extends: ../sack-coat/spec.yaml`, and so the
suit jacket's three-piece body in `lib/body3.mjs`). `body3Front` gained `cutaway` for the front cut
away below the button. Drafted from the wearer's measurements, so it fits any size.

**Status:** draft. Not sewn.

**Threadloop (2026-11-10):** "tuxedo" finds one free pattern, a women's blouse; "dinner jacket"
finds 30, none a jacket. No free equivalent was found.

## What the source shows
- **As the English coat:** "all the allowances and measurements are the same": its three-piece
  forepart, 30 in long, a little closer at the waist than the conservative sack.
- **Stand:** "only 1 inch is allowed for the button stand from T to U".
- **One button** at 10, on the waist line, where the lapel turns. The plate draws the lapel folded
  over the forepart, its edge a long curve from the shoulder to 10, with its point turned up past
  the notch.
- **Cutaway:** "from 10 to 27 is 1¾ inches. Line 23-27 is then squared to line 13, which gives the
  run of front": the edge runs straight to 27, then away toward the side, about 3 in at the hem
  (11 to 13) on the plate, to a rounded corner.
- **Vees:** ¼ in at the gorge (20), "which gives the garment a slight chest effect", and ¼ in at
  18; the large dart from the armhole (16-17) as on the English coat.
- **Pocket:** a slash pocket "made to sew right into the Vee" at 18 (18-22), or "a regular pocket"
  (24-26, about 5⅞ in, slanting down to the front). No breast pocket or vent drawn.
- **Shoulders** "drafted rather narrow"; the sleeve head ⅜ in higher than the regular sleeve.

## How it maps onto the block
| Feature | Simons (size 36) | Here (option default) |
|---|---|---|
| Chest, waist | As the English coat | `chestEase` 14%, `waistEase` 16% (the sack coat's `english` variant) |
| Stand | 1 in, CF in its middle | `buttonExtension` 1.4% of the chest: ½ in |
| Button | One, at 10 on the waist line | `buttons` 1, `breakAt` 100% (chest line to waist) |
| Lapel | Point turned up past the notch | `lapelStyle: peak` |
| Cutaway start | 27, 1¾ in below 10 | `cutawayTop` 17% of waist to seat (the 36 set's 10.3 in) |
| Cutaway | About 3 in in at the hem, 11 to 13, read from the plate | `cutawayWidth` 8.3% of the chest |
| Corner | Rounded about 2½ in at 13 | `hemCurve` 70% (× 10% of the chest) |
| Pocket | The regular pocket 24-26, no flap | `pocketFlaps` off; `lowerPocketBelow` 43% of waist to seat (24 about 4½ in below the waist), `lowerPocketWidth` 16% of the chest (5⅞ in), `pocketFromCF` 16% (about 5¾ in), `pocketSlant` 22% (26 about 1¼ in higher than 24) |
| Length, seat, cuff | As the sack coat | Inherited: `lengthBelowWaist` 122%, `seatEase` 19%, `cuffEase` 87% |
| Breast pocket, vent, sleeve vent | None drawn | `breastPockets`, `vent`, `sleeveVent` off |

## Changes and what isn't modelled
- **A side panel** (the three-piece body) in place of Simons' forepart and its Vees: the gorge Vee
  at 20, the ¼ in at 18 and the dart 16-17 aren't cut; their suppression is in the side panel.
- **The slash pocket** sewn into the Vee isn't offered; the regular pocket is.
- **Narrow shoulders and the higher sleeve head** are Bent's, from the wearer's measurements.
- **The cutaway** is a straight slope from 27 to the rounded corner; Simons squares 23-27 to 13
  for its run and draws it slightly curved.
- **Faced lapels** (silk or satin) are a choice of cloth for the facing, not a pattern change; the
  pattern's facing runs from the shoulder round the cutaway to the hem.

## Pieces
As the sack coat: back (CB seam), side panel, front, facing, collar, top and under sleeves, the
lower pockets' welts and bags, and the lining (back-neck facing, front and back linings, inside
pocket; `lining` and `insidePockets`, on by default).

## Construction
As the suit jacket's brief, with no vent or sleeve vent and jetted (flapless) lower pockets. Cut
the facing, and the collar's top layer if wanted, from silk or satin facing cloth. Simons gives no
making-up order.
