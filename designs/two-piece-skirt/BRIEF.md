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
- **Side seam** at the hip (11) ½ the hip line less 1 in from the CF side (4): the front a little
  narrower than the back; at the bottom (12) ½ the bottom line less 2 in, again from the CF side (6);
  the seam drawn straight from 12 through 11 upward. CF is the diagram's right edge: p. 84 sets the
  front length at point 3, on that side.
- **Waist:** the back ¼ waist plus ⅜ in (13, measured from CB at 8), the front ¼ waist less ⅜ in
  (14, from CF at 10), each shaped into the side seam 1½ in below the hip point: all the shaping
  in the seams, no darts.
- **CB** as the foundation's: a seam, shaped in at the waist.
- The two-piece high-waisted skirt (p. 88) raises the waist 2 in above it; not built.

## How it maps onto the block
| Feature | Mitchell | Here (option default) |
|---|---|---|
| Side seam | 1 in forward of the middle of the hip | `panelShare` 45% of the half hip to the front (9 of 20) |
| Waist shaping | In the side seam and CB | `panelShaping` 79% at the side seam, `cbShaping` 21% at CB (the foundation's) |
| Flare | Straight from the hem through the hip | `goreFlare` 20% (the gored skirts' 70%) |
| Length, waistband, zip | The foundation's | The gored skirt's: `length` 95%, waistband, CB zip |

## Changes and what isn't modelled
- **The front and back waists come from the hip shaping**, not from ¼ waist ∓ ⅜ in. At Mitchell's
  figure (40 in hip, 26½ in waist) they draft close to his 6¼ and 7 in; `test/two-piece-skirt.test.mjs`
  checks this.
- **The shaping ends at the seat line**, not 1½ in below it.
- **Less flare than the diagram.** `goreFlare` 20% is straighter than p. 87, whose bottom measures
  about 1.6 times its hip line. The seam is still straight from the hem through the hip.
- **Corrected 2026-11-03:** this design first read 11 as measured from CB, giving the front 55% of the
  hip, and swapped the front and back waists. Its side seam moved about 2 in on an adult size.
- **The high-waisted version** isn't built.

## Pieces
Front (on the fold), back (cut 2, CB seam), waistband.

## Construction
As the gored skirt: CB seam and zip, side seams, waistband, hem.
