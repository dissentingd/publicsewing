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
- **High-waisted (pp. 88-89):** "a manipulation from a plain two-piece skirt": CF and CB continue "2 inches above the waist line or the
  amount desired", the side seam's dart reshaped above the waist, adding ½ or ¾ in to the front and back at the waist line, the top shaped
  as the heavy line. No band is drawn or described.

## How it maps onto the block
| Feature | Mitchell | Here (option default) |
|---|---|---|
| Side seam | 1 in forward of the middle of the hip | `panelShare` 45% of the half hip to the front (9 of 20) |
| Waist shaping | In the side seam and CB | `panelShaping` 79% at the side seam, `cbShaping` 21% at CB (the foundation's) |
| Flare | Straight from the hem through the hip | `goreFlare` 20% (the gored skirts' 70%) |
| Length, waistband, zip | The foundation's | The gored skirt's: `length` 95%, waistband, CB zip |
| High waist: the rise | 2 in on a 7 in waist to hip | `riseHeight` 29% of waist to seat; `highWaist` is off by default, on in the `high-waisted` variant |
| High waist: at the waist | ½ or ¾ in added to each part | `riseEase` 1.56% of the seat (⅝ of 40) at each side seam |
| High waist: above it | The side edges open a little (p. 89) | `riseFlare` 10% of the height, read from the plate; CB runs on along its own line, CF straight up |

## Changes and what isn't modelled
- **The front and back waists come from the hip shaping**, not from ¼ waist ∓ ⅜ in. At Mitchell's
  figure (40 in hip, 26½ in waist) they draft close to his 6¼ and 7 in; `test/two-piece-skirt.test.mjs`
  checks this.
- **The shaping ends at the seat line**, not 1½ in below it.
- **Less flare than the diagram.** `goreFlare` 20% is straighter than p. 87, whose bottom measures
  about 1.6 times its hip line. The seam is still straight from the hem through the hip.
- **Corrected 2026-11-03:** this design first read 11 as measured from CB, giving the front 55% of the
  hip, and swapped the front and back waists. Its side seam moved about 2 in on an adult size.
- **The high waist is a variant, not a design:** the same pieces, by Mitchell's own description.
- **The high waist's facings** aren't in the source, which doesn't say how the top is finished. They're cut from the rise, top to waist, in
  place of the band, and interfaced.
- **The high waist adds up to 2½ in round the waist** (⅝ in on each edge of each side seam), as Mitchell says, on a figure drafted tight.
  Reduce `riseEase` for a closer fit.

## Pieces
Front (on the fold), back (cut 2, CB seam), waistband; or, high-waisted, a front facing and a back facing in its place.

## Construction
As the gored skirt: CB seam and zip, side seams, waistband, hem.
