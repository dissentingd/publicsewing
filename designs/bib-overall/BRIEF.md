# Bib overall

**Source:** Simons, *Drafting Pants and Overalls* (The Clothing Designer Co., New York, 1916),
corpus `draftingpantsove00simo` (tracked). "Apron Overall", Diagram XII, pp. 22â€“23 (PDF pp.
26â€“27). US 1916, public domain. Inches below are Simons', for a 34 waist, 40 seat, 21 knee, 19
bottom, 11 rise, 32 inseam.

**Block:** FreeSewing's Titan, through the work pants and Ð•ÐœÐšÐž's trousers (`extends:
../work-pants/spec.yaml`, `lib/trousers.mjs`): the work pants' full straight legs, without their
waistband, fly and pockets. The bib, raised back and pockets are `polygon` pieces (`lib/flat.mjs`,
added for this design: a straight-edged piece from its corners).

**Status:** draft. Not sewn.

## What the source shows
"Made with a side seam and bibâ€¦ drafted 2 sizes larger at the waist and seat than the actual
measurementsâ€¦ especially adapted for the better grade goods."
- **Legs:** as the pants drafts, larger: the knee 21, the bottom 19, the rise 11; 1 in turned up
  at the bottom.
- **Bib:** squared up from the front's waist at CF, 11 in high (L to 16), 5Â½ in across the top
  each side of CF (16 to 17), its foot meeting the waist 1Â¾ in short of the side (A to 14);
  buttons at the top corners for the straps.
- **Back:** raised above the waist, 5Â¼ in at CB (Y to 2), 3 in across the top (2 to 3), curving
  down to the bib's foot (3 to 14).
- **Side opening** at the top of the side seam, 6Â¾ in (A to 6), buttoned.
- **Pockets:** on the bib 5 by 6 in; on the back 6 by 7 in; a lower side pocket 6Â½ in deep and
  3Â½ in wide.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Size | Two sizes up at waist and seat | `seatEase` and `waistEase` 15% (the work pants' 10% and 9%, plus 2 in) |
| Rise | 11 in | `crotchDrop` 6.5% (the work pants' 5%, plus Â½ in) |
| Bottom | 19 on a 21 knee | `hemWidth` 90% of the knee |
| Bib | 11 in high, 11 across the top, foot 1Â¾ in from the side | `bibHeight` 26% of waist to floor, `bibWidth` 32% of the waist, `bibInset` 5% of the waist |
| Back | 5Â¼ in above the waist at CB, 3 in across | `backRise` 12.5% of waist to floor, `backRiseTop` 9% of the waist |
| Side opening | 6Â¾ in | `sideOpening` 20% of waist to floor |
| Straps | Not given | Back top to bib top over the shoulder, plus 6 in to adjust; `strapWidth` 4.5% of the waist |
| Pockets | Bib 5Ã—6, back 6Ã—7, side 3Â½Ã—6Â½ | `bibPocket` 15Ã—18% of the waist, `seatPockets` 15Ã—17.5% of the seat, `hipPockets` 14Ã—16% of the seat |

## Changes and what isn't modelled
- **The bib and raised back are separate pieces**, seamed at the waist, not cut in one with the
  legs; each is cut twice, one a facing.
- **The lower side pocket is a full hip patch pocket**, 5Â½ in wide rather than 3Â½.
- **The bib's sides are straight**; the raised back's top edge runs straight to the bib's foot
  instead of curving.
- **No buckles or adjusters**: the straps button to the bib (a buttonhole at each strap's end,
  buttons at the bib's top corners).

## Pieces
Front, back, bib (on the fold, cut 2), raised back (on the fold, cut 2), straps (cut 2, folded),
side stands and facings (cut 2 each), bib pocket, hip pockets (cut 2), seat pockets (cut 2).

## Construction
The following order is a proposed method for this unsewn draft.
1. PB: when selected, hem and turn the bib pocket, then topstitch it on the bib's mark.
2. PH: when selected, hem and turn the hip pockets and topstitch them on the front marks.
3. PS: when selected, hem and turn the seat pockets and topstitch them on the back marks.
4. I, X and O: close the inseams and crotch seam, then sew each outseam from the hem only to the side opening notch.
5. S and B: sew the side facing to the front and the stand to the back, then join the faced bib to the front waist and the faced raised back to the back waist.
6. Fold, sew, and turn the straps. Attach them to the raised back, cross them, and work their buttonholes; add buttons at the bib corners and side openings.
7. H: turn up the leg hems.

