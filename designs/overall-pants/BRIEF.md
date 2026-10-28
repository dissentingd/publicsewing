# Overall pants

**Source:** Simons, *Drafting Pants and Overalls* (The Clothing Designer Co., New York, 1916),
corpus `draftingpantsove00simo` (tracked). "One-piece Overall", Diagram XIII, pp. 24–25 (PDF pp.
28–29). US 1916, public domain. Inches below are Simons', for a 34 waist, 40 seat, 20 knee, 18½
bottom, 10½ rise, 32 inseam.

**Block:** FreeSewing's Titan, through the work pants and ЕМКО's trousers (`extends:
../work-pants/spec.yaml`, `lib/trousers.mjs`): their full straight legs, fly, waistband and belt
loops. Added for this design: a straight outseam on `trouserLeg` (`straightOutseam`) and the
`legInOne` piece, which joins the back and front along it.

**Status:** draft. Not sewn.

## What the source shows
"This draft is for a cheap grade of overalls. It is made without any side-seam. The draft is
made 2 sizes larger than the regular pants measurements across the seat and waist."
- **One outseam line** A–B–C–D, straight from the waist to the bottom; the forepart (I–G–O–Q) and
  the back (U–S–P–T) are both drafted against it, so the leg is cut in one, the line a crease
  rather than a seam.
- **Forepart:** the knee ½ the knee each side of C–O, the bottom ½ the bottom at D–Q; the fly
  front shaped I–G.
- **Back:** the seat U–S, its waist ½ of 36 plus 1¾ in with the forepart's; the inseam ¾ in out
  from the forepart's at the knee and bottom.
- No pockets are drawn; this is Simons' only overall without a bib.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Size | Two sizes up at waist and seat | `seatEase` and `waistEase` 15% |
| Knee, bottom | 20, 18½ | `kneeEase` 25%, `hemWidth` 92% of the knee |
| Outseam | One straight line, no seam | `straightOutseam`: straight from the hem corner, leaning out past the seat and waist corner; the back and front then laid together on it (`legInOne`) |
| Front | Fly | The trousers' zip fly, `flyWidth` 3.5% of the waist |
| Waist | Band | The trousers' waistband and `beltLoops` 7 |
| Pockets | None | None (`sidePockets` and `backPocket` off) |

## Changes and what isn't modelled
- **The outseam leans out** wherever the seat or waist corner would otherwise cross it, so the
  waist comes out a little wider than the work pants'; the waistband takes up the difference.
- **No darts**: as the work pants.
- **The hem kinks slightly at the outseam line**, where the back's and front's hems meet at a
  small angle; true it when cutting.

## Pieces
Leg (cut 2, mirrored), waistband (cut 2), fly shield and facing, belt loops.

## Construction
1. Fly as the trousers.
2. Inseams; crotch seam from the back waist round to the fly.
3. Waistband and loops; hems.
