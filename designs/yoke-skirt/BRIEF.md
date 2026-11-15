# Yoke skirt

**Source:** Winifred Aldrich, *Metric Pattern Cutting for Women's Wear*, 6th ed. (Wiley, 2015),
corpus `aldrichwomenswear2015` (a private copy, not in the repository). Chapter 3, "Waistline
adaptations: yokes", 5, Yoked skirt with gores, book p. 41 (PDF p. 45; PDF = book + 4, checked on
pp. 24 and 41), on the basic skirt block, book p. 24 (PDF p. 28). Still in copyright: only its
construction and proportions are used here, as design references, in our own words; no text or
figure is reproduced. Lengths below are the book's centimetres.

**Threadloop:** "yoke skirt" finds 54 free patterns (2026-11-15), mostly other skirts with a yoke
(Tiana's Closet's Kyra and Nadine, DG Patterns' Sofia); none listed is a yoked skirt of flared
gores drafted from measurements.

**Block:** FreeSewing's Sarah, which is drafted after Aldrich's own skirt block: its waist darts,
side seams and length. `lib/skirt-yoke.mjs` cuts it into yokes and gores.

**Status:** draft. Not sewn.

## What the source shows
Read from the text and checked against the page's figure (PDF p. 45):
- **Block:** the straight skirt traced from the basic block (natural waist: waist 68, hip 94,
  waist to hip 20.6 for its size 12; two back darts, 2 cm, and one front dart, 2.5 cm).
- **Yoke:** a shaped yoke drawn across the hips, its lower edge scalloped up between points; the
  waist darts carried down to the yoke line; the yokes cut off and the darts closed. Front and
  back yokes on the fold.
- **Gores:** vertical lines dropped from the yoke's points, so four gores a half: back, side back,
  side front, front. Balance points halfway down the skirt; each gore edge flared 7 cm at the hem,
  ruled to those points. The figure is long, near the floor.
- The skirt may be cut on the cross. The page doesn't give the opening or the waist finish.

What's ours: the yoke line's shape and depth, where the gore lines fall, the opening and the
waistband.

## How it maps onto the block
| Feature | Aldrich | Here (option default) |
|---|---|---|
| Yoke line | Shaped: scallops between points, from about half to nine tenths of waist to hip (read from the figure) | Straight across at `hipYokeDepth` 65% of waist to seat, the scallops' middle depth |
| Darts | Carried to the yoke line and closed | The same: each dart's point on the yoke line, as far from both legs; the sections pivot on it |
| Gore lines | Dropped from the yoke's points | Halfway across the yoke line, back and front |
| Flare | 7 cm each edge at the hem | `goreEdgeFlare` 7.5% of the seat (7 cm on a 94 cm hip) |
| Flare from | Balance points halfway down the skirt | `flareFrom` 50% of the length, never above the seat line |
| Length | Near the floor | `length` 90% of waist to floor |
| Opening | Not given | A zip in the left side seam, `zipLength` 90% of waist to seat |
| Waist | Not given | A waistband, `waistbandHeight` 3% of waist to floor, with an underlap |

## Changes and what isn't modelled
- **A straight yoke line** in place of the scalloped one; a shaped yoke edge is a later option.
- **Gore lines at the halves**, not under scallop points the design no longer has.
- **The hem is straight** across each gore; the book's figure curves it a little at the flared
  corners.
- **CB on the fold** for the back yoke and back gore (the book's yoke too), so the zip goes in the
  side seam.
- Cutting on the cross isn't modelled.

## Pieces
Front yoke and back yoke (on the fold), front gore and back gore (on the fold), side front and
side back gores (cut twice each), waistband (folded).

## Construction
1. Gore seams: front to side front, side back to back, matching the balance notches.
2. Side seams of the gores, the left one from the zip's notch down.
3. Yoke side seams, the left one open for the zip.
4. Yokes to the gores, matching the side seams.
5. Zip in the left side seam, through the yoke and into the gores.
6. Waistband on, its underlap at the zip; hem.
