# Sailor pants

**Source:** Simons, *Designing Boys' and Juveniles' Clothing* (1922), corpus `designingboysjuv00simo`
(tracked). Diagram 46, "Sailor Pants": text pp. 128 and 130, diagram p. 129 (PDF pp. 134-136). US 1922,
public domain. Inches below are Simons', for a size 6: waist 24, seat 28, inseam 18, knee 13½, bottom 16, rise 6.

**Block:** FreeSewing's Titan, through the overall pants (`extends: ../overall-pants/spec.yaml`,
`lib/trousers.mjs`): the back and front drafted on one straight outseam and joined there (`legInOne`). Added
for these: `legInOne`'s `fall`, the slit and fold of a drop front.

**Status:** draft. Not sewn.

**Threadloop:** 21 free results for "sailor pants" (2026-11-03). Of the first eight, most are other sailor garments and one is a pair of trousers; the listings don't say any is drafted from measurements.

## What the source shows
- **The cut** (p. 128): "the forepart and the back part of these pants are cut in one piece", with a bell bottom.
- **Knee and bottom** (p. 130): V ½ knee from D, 4 an inch further; W ½ bottom less ½ in from C, 5 an inch
  and a half further: 14 in round the knee and 16½ in round the bottom, against the 13½ and 16 stated.
- **Seat and waist:** the forepart ¼ seat plus ½ in, ¼ waist; the back ¼ waist plus 1½ in.
- **Lines on the forepart:** F 3 in below E on the outseam's line, T 2 in below O on the centre front, a
  line shaped from T to F (the OCR reads "TS", the diagram shows T to F). The waist's two ends curve to F from Q and from 3.
- **Not stated:** the book doesn't say how the pants open. Those lines are all it gives.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Knee | 14 round as drafted, on a boy C6's 10¾ in knee | `kneeEase` 30% |
| Bell bottom | 16½ round, of 14 | `hemWidth` 118% of the knee's width |
| Seat | ½ in a side, 2 in of 28 | `seatEase` 7% |
| Waist | The back's 1½ in a side, 3 in of 24 | `waistEase` 12.5% |
| Rise | 6 in | Titan's, `crotchDrop` 2% |
| F | 3 in below the waist | `fallDepth` 48% of waist to seat |
| T | 2 in below the waist | `fallCentre` 32% of waist to seat |

## Changes and what isn't modelled
- **The drop front is our reading** of the lines at F and T, and of the queue's note. The V from the waist to F is
  left open as a side slit, not sewn as a dart, and the panel above T-F folds down when the slits and front band
  are undone: a sailor's fall. No book text confirms it. Treat it as a design choice until someone sews it.
- **Buttons, stands and bands:** ours. Two buttons on each slit, a stand under it, a back band whose ends lap
  under the front band's.
- **Waist split:** Titan's own front and back, not ¼ waist and ¼ waist plus 1½ in.
- **The hem** is straight across each piece, not curved at the crease as the diagram's bottom is.
- **Back rise and seat line:** Titan's, not points 2, O and Y.
- **Slits on full figures:** where the waist is as wide as the seat, the V closes to a thin slit. It still opens
  and buttons.
- **Tolerances:** the inseams can differ by up to 5 mm, as the back and front knees are not the same width. The bell makes
  this a little worse than on the overall pants. The slit's edges can differ by as much, or by 9% on the shortest slits, since they button and aren't sewn.

## Pieces
Leg (cut 2), back band, front band, slit stand (cut 4).

## Construction
1. Sew the legs' centre fronts and crotch to the crotch point; the same for the centre backs. Sew the inseams.
2. Sew a stand to each edge of the slits, folded: the back's stands out under the front's, the front's is a facing.
3. Fold the drop front along the T-F line, inside, and stitch the fold's facing.
4. Back band to the back waist, its ends past the slits. Front band to the front waist, lapping them.
5. Buttonholes where marked, and in the front band's ends; buttons on the stands and the back band.
6. Hem.

## Checks
`test/sailor-pants.test.mjs`: every size, at the default, a shallow front with straight legs, and a wide bell with
five buttons. The outseam and inseams, the slit's edges, the waist against the bands, the buttonholes.
