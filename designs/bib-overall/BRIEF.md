# Bib overall

**Source:** Simons, *Drafting Pants and Overalls* (The Clothing Designer Co., New York, 1916),
corpus `draftingpantsove00simo` (tracked). "Apron Overall", Diagram XII, pp. 22–23 (PDF pp.
26–27). US 1916, public domain. Inches below are Simons', for a 34 waist, 40 seat, 21 knee, 19
bottom, 11 rise, 32 inseam.

**Block:** FreeSewing's Titan, through the work pants and ЕМКО's trousers (`extends:
../work-pants/spec.yaml`, `lib/trousers.mjs`): the work pants' full straight legs, without their
waistband, fly and pockets. The bib, raised back and pockets are `polygon` pieces (`lib/flat.mjs`,
added for this design: a straight-edged piece from its corners).

**Status:** draft. Not sewn.

## What the source shows
"Made with a side seam and bib… drafted 2 sizes larger at the waist and seat than the actual
measurements… especially adapted for the better grade goods."
- **Legs:** as the pants drafts, larger: the knee 21, the bottom 19, the rise 11; 1 in turned up
  at the bottom.
- **Bib:** squared up from the front's waist at CF, 11 in high (L to 16), 5½ in across the top
  each side of CF (16 to 17), its foot meeting the waist 1¾ in short of the side (A to 14);
  buttons at the top corners for the straps.
- **Back:** raised above the waist, 5¼ in at CB (Y to 2), 3 in across the top (2 to 3), curving
  down to the bib's foot (3 to 14).
- **Side opening** at the top of the side seam, 6¾ in (A to 6), buttoned.
- **Pockets:** on the bib 5 by 6 in; on the back 6 by 7 in; a lower side pocket 6½ in deep and
  3½ in wide.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Size | Two sizes up at waist and seat | `seatEase` and `waistEase` 15% (the work pants' 10% and 9%, plus 2 in) |
| Rise | 11 in | `crotchDrop` 6.5% (the work pants' 5%, plus ½ in) |
| Bottom | 19 on a 21 knee | `hemWidth` 90% of the knee |
| Bib | 11 in high, 11 across the top, foot 1¾ in from the side | `bibHeight` 26% of waist to floor, `bibWidth` 32% of the waist, `bibInset` 5% of the waist |
| Back | 5¼ in above the waist at CB, 3 in across | `backRise` 12.5% of waist to floor, `backRiseTop` 9% of the waist |
| Side opening | 6¾ in | `sideOpening` 20% of waist to floor |
| Straps | Not given | Back top to bib top over the shoulder, plus 6 in to adjust; `strapWidth` 4.5% of the waist |
| Pockets | Bib 5×6, back 6×7, side 3½×6½ | `bibPocket` 15×18% of the waist, `seatPockets` 15×17.5% of the seat, `hipPockets` 14×16% of the seat |

## Changes and what isn't modelled
- **The bib and raised back are separate pieces**, seamed at the waist, not cut in one with the
  legs; each is cut twice, one a facing.
- **The lower side pocket is a full hip patch pocket**, 5½ in wide rather than 3½.
- **The bib's sides are straight**; the raised back's top edge runs straight to the bib's foot
  instead of curving.
- **No buckles or adjusters**: the straps button to the bib (a buttonhole at each strap's end,
  buttons at the bib's top corners).

## Pieces
Front, back, bib (on the fold, cut 2), raised back (on the fold, cut 2), straps (cut 2, folded),
side stands and facings (cut 2 each), bib pocket, hip pockets (cut 2), seat pockets (cut 2).

## Construction
1. Pockets: hem each pocket's top, press the edges under, topstitch on its marks.
2. Inseams, crotch seam; outseams from the hem to the side opening's notch.
3. Side openings: the facing to the front's edge, the folded stand to the back's.
4. Bib and its facing, raised back and its facing: sew each pair round the top and sides, turn;
   sew the bib to the front waist and the raised back to the backs' waists, the two meeting at
   the bib's foot.
5. Straps: fold, sew, turn; sew to the raised back's top corners, crossed; buttonholes at the
   free ends, buttons at the bib's top corners and the side openings.
6. Hems: turn up the bottoms.
