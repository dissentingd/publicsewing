# Gored skirt

**Source:** Mitchell, *The New "Standard" Work on Designing and Pattern-Making of Ladies'
Tailor-Made Garments* (1921), corpus `newstandardworko00mitc` (book page = PDF page − 4). Skirt
foundation p. 84 (diagram p. 85); five-gored skirt p. 90 (diagram p. 91); seven-, nine-,
eleven-, thirteen- and fifteen-gored skirts pp. 92–101 (diagrams on the odd pages). US 1921,
public domain. Inches below are Mitchell's, for his standard figure: waist 26½, hip 40, back
length 39½, front length 38. The archived pipeline's readings are
`archive/recipes/mitchell/skirt_foundation.yaml` and `*_gored_skirt.yaml`, with
`archive/recipes/mitchell/FINDINGS.md` (item 5 and "Skirt foundation").

**Block:** FreeSewing's Sarah (a straight skirt block, after Aldrich), for its seat line, eased
waist, waist-to-seat depth and length. Sarah's darts and side seams are replaced by the gores
(`lib/skirt.mjs`).

**Status:** draft. Not sewn.

## What the source shows
- **The foundation (p. 84)** is drafted on sweeps: arcs about a pivot one and a half waists above
  the centre front. The waist, the hip line (7 in down) and the bottom are concentric arcs, so
  the skirt widens evenly from the hip to the hem: a cone. Its hem is about 1.7 times the hip
  line, for a skirt nearly to the floor.
- **Front and back lengths:** the back length 39½, the front 38 plus ⅜ in, so the centre front
  waist sits about 1⅛ in lower than the back.
- **Gores (pp. 90–101):** a front panel cut on the fold, and gores cut in pairs, the back gores
  seamed at the centre back. Five gores is a panel and two gores a side; seven, a panel and
  three; and so on to fifteen.
- **The front panel** is narrower than the others at the hip: ½ hip divided by the gore count,
  less ½ in (five and seven gores), ⅜ (nine), 5⁄16 (eleven), ¼ (thirteen), ⅛ (fifteen). At the
  hem it is 1 in wider again than at the hip. The other gores share the rest of the hip line
  equally, and their seams run straight from the hem through the hip points.
- **Waist shaping** is all in darts centred on the seams, their legs running straight to the
  hip points. For five gores: ⅞ in at the centre back, ¾ at the panel seam (¼ in front of it, ½
  behind), and the rest (about 2½ in, "the surplus") at the side seam. With more gores the CB
  and panel darts get smaller (⅛ in less per two gores, to ¼ and ⅛ at fifteen) and the surplus
  is shared among the other seams, the largest near the side.
- **Closure and finish** aren't described for these skirts.

## How it maps onto the block
| Feature | Mitchell | Here (option default) |
|---|---|---|
| Gores | 5 to 15 | `gores` 5 (a list: 5, 7, 9, 11, 13, 15) |
| Seat and waist | His hip and waist, no stated ease | Sarah's: seat with its seat ease, the waist as measured (`extraWaistEase` 0) |
| Front panel | ½ in narrower than an equal share at the hip | `panelNarrowing` 1.25% of the seat (½ of 40 in), for five gores |
| CB dart | ⅞ in of about 4⅛ in of shaping | `cbShaping` 21% of the waist shaping, for five gores |
| Panel seam dart | ¾ in of about 4⅛ | `panelShaping` 18%, for five gores |
| More gores | ⅛ in or so less of the panel narrowing and of each of those darts per two gores | All three scaled by 1 − (gores − 5) / 13: about a quarter at fifteen |
| The other seams | The surplus, largest near the side | Shared equally |
| Flare | The cone: the hem about 1.7 times the hip | `goreFlare` 70% of the half seat at floor length, less for a shorter skirt, the same at every seam edge |
| Front waist | About 1⅛ in lower than the back, of a 7 in hip depth | `frontWaistDrop` 16% of waist to seat |
| Length | Back length 39½, nearly to the floor | `length` 95% of waist to floor |
| Closure | Not described | A CB zip, `zipLength` 100% of waist to seat |
| Waistband | Not described | `waistbandHeight` 3% of waist to floor, folded, with an underlap its own height |

## Pieces
1. Front panel: cut 1 on the fold.
2. Gores 1 to 7, from the panel back: cut 2 each; as many as the gore count needs (two for five
   gores, seven for fifteen). The last is the back gore, with the zip's end notched on its CB
   seam.
3. Waistband: cut 1, folded lengthwise.

Each gore's edges are notched at the seat line.

## Construction order
1. Seam the gores to each other and to the front panel, matching the seat notches.
2. Seam the centre back below the zip notch; set the zip.
3. Waistband to the waist, the underlap at the zip; close its ends.
4. Hem.

## Changes and what isn't modelled
- **Geometry from Sarah, not the sweeps.** The gores are laid on Sarah's seat line and waist, so
  the skirt drafts at any size, children's included. The flare is shared out at the seams in
  place of the cone's arcs; at the book's figure the hem comes out at about the same width.
- **The centre front stays on the straight fold.** Mitchell's panel also widens 1½ in at the
  fold (6 from 2); here its share of the flare goes to the panel's seam.
- **Equal darts at the other seams**, not Mitchell's graded ones (largest at the side,
  stepping down ⅛ or ¼ in toward the front and back).
- **Every seam edge flares the same**, so the two edges of a seam are mirror images and sew
  together; Mitchell's gores widen with their angle on the cone.
- **The hip curves** run smoothly from the waist into the seams, not straight dart legs.
- **A CB zip and a waistband** are added; Mitchell describes neither.
- **The front waist drop** is the book's, for its corseted standard figure. A figure with a
  fuller front may want it near 0.
