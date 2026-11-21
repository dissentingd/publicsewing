# Yoke skirt

**Source:** inspired by Winifred Aldrich, *Metric Pattern Cutting for Women's Wear*, 6th ed. (Wiley,
2015), the maintainer's own copy; not in the repository. In copyright: only its methods and
proportions are used. This text and the pattern are our own.

**Threadloop:** "yoke skirt" finds 54 free patterns (2026-11-15), mostly other skirts with a yoke
(Tiana's Closet's Kyra and Nadine, DG Patterns' Sofia); none listed is a yoked skirt of flared
gores drafted from measurements.

**Block:** FreeSewing's Sarah, which FreeSewing describes as based on Aldrich's skirt block: its waist
darts, side seams and length. `lib/skirt-yoke.mjs` cuts it into yokes and gores.

**Status:** draft. Not sewn.

## What we took
The idea of closing the waist darts inside a hip yoke, with flared gores below that begin to widen
partway down the skirt.

## How it maps onto the block
| Feature | Here (option default) |
|---|---|
| Yoke line | Straight across at `hipYokeDepth` 65% of waist to seat |
| Darts | Each dart's point sits on the yoke line; the yoke sections pivot on it to close the dart |
| Gore lines | Halfway across the yoke line, back and front |
| Flare | `goreEdgeFlare` 7.5% of the seat at each gore edge |
| Flare start | `flareFrom` 50% of the length, never above the seat line |
| Length | `length` 90% of waist to floor |
| Opening | A zip in the left side seam, `zipLength` 90% of waist to seat |
| Waist | A waistband, `waistbandHeight` 3% of waist to floor, with an underlap |

## Changes and what isn't modelled
- **The yoke line, gore positions, opening and waistband** are our choices. A shaped yoke edge is a
  possible later option.
- **The hem is straight** across each gore.
- **Centre back is on the fold** for the back yoke and back gore, so the zip goes in the side seam.
- Bias cutting isn't modelled.

## Pieces
Front yoke and back yoke (on the fold), front gore and back gore (on the fold), side front and
side back gores (cut twice each), waistband (folded).

## Construction
1. Sew the G gore seams: front to side front, side back to back, matching the balance notches.
2. Side seams of the gores, the left one from the zip's notch down.
3. Yoke side seams, the left one open for the zip.
4. Yokes to the gores, matching the side seams.
5. Insert the Z zip in the left side seam, through the yoke and into the gores.
6. Waistband on, its underlap at the zip; hem.
