# Two-piece skirt

**Source:** Mitchell, *The New "Standard" Work on Designing… Ladies' Tailor-Made Garments*
(1921), corpus `newstandardworko00mitc` (tracked). "Two-Piece Skirt", p. 86, diagram p. 87; the
skirt foundation, pp. 84–85. US 1921, public domain. Inches below are Mitchell's (hip 40).

**Block:** FreeSewing's Sarah, through the gored skirt (`extends: ../gored-skirt/spec.yaml`,
`lib/skirt.mjs`): the gored layout with three gores is exactly this skirt, a front panel on the
fold and a back gore with a CB seam. Added for it: `panelShare` on `skirtLayout`, the front's
share of the half hip.

**Status:** draft. Not sewn.

## What the source shows
"A plain two-piece skirt, drafted to fit tight at the hips and waist line. The foundation up to
and including point 10 is the same as described on the preceding page."
- **Side seam** at the hip (11) ½ the hip line less 1 in from CB: the front a little wider than
  the back; at the bottom (12) ½ the bottom line less 2 in; the seam drawn straight from 12
  through 11 upward.
- **Waist:** the front ¼ waist plus ½ in (13), the back ¼ waist less ½ in (14), each shaped into
  the side seam 1¼ in below the hip point: all the shaping in the seams, no darts.
- **CB** as the foundation's: a seam, shaped in at the waist.
- The two-piece high-waisted skirt (p. 88) raises the waist 2 in above it; not built.

## How it maps onto the block
| Feature | Mitchell | Here (option default) |
|---|---|---|
| Side seam | 1 in behind the middle of the hip | `panelShare` 55% of the half hip to the front |
| Waist shaping | In the side seam and CB | `panelShaping` 79% at the side seam, `cbShaping` 21% at CB (the foundation's) |
| Flare | Straight from the hem through the hip | `goreFlare` 20% (the gored skirts' 70%) |
| Length, waistband, zip | The foundation's | The gored skirt's: `length` 95%, waistband, CB zip |

## Changes and what isn't modelled
- **The front and back waists come from the hip shaping**, not from ¼ waist ± ½ in.
- **The high-waisted version** isn't built.

## Pieces
Front (on the fold), back (cut 2, CB seam), waistband.

## Construction
As the gored skirt: CB seam and zip, side seams, waistband, hem.
