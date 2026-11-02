# Pleated skirt

**Source:** Mitchell, *The New "Standard" Work on Designing Ladies' Tailor-Made Garments*
(1921), corpus `newstandardworko00mitc` (tracked). "Pleated Skirt Foundation", p. 102; "Side
Pleated Skirt", pp. 104–105; "Box Pleated Skirt", pp. 106–107 (PDF pp. 106–111). US 1921,
public domain. Inches below are Mitchell's, for a 40 in hip.

**Block:** FreeSewing's Sarah, through the gored skirt (`extends: ../gored-skirt/spec.yaml`,
`lib/skirt.mjs`): its gores, fitted above the seat line by their seams, its CB zip and
waistband. Added for this skirt: the `gore` piece's `pleat` (an underlay below the seat line on
one edge or both).

**Status:** draft. Not sewn.

**Threadloop:** many free pleated skirts exist, mostly rectangles pleated to a waistband; few
are drafted from measurements and fitted at the hip as this one is.

## What the source shows
- **Foundation** (p. 102): the plain skirt foundation made straighter for pleats: the waist
  dropped ¼ in at CB, the hip line 1½ in out there, a new CB line through them and the bottom.
  "A fifteen gored skirt is then drafted on the new foundation ... a larger or smaller amount of
  gores may be drafted depending upon the amount of pleats called for."
- **Side pleats** (pp. 104–105): each gore copied with the next laid 2 in away at the hip line
  and 3 in at the bottom; "pleats are allowed between each and every gore including the center
  back". The pleats run up to the hip line only (or to the waist, if desired). The broken lines
  show where the skirt may be seamed, inside the pleats.
- **Box pleats** (pp. 106–107): the same, with two such allowances per gore (2 in each at the hip
  line, 3 in each at the bottom), "each gore forming a box pleat".

## How it maps onto the block
| Feature | Mitchell | Here (option default) |
|---|---|---|
| Gores | Fifteen, more or fewer for the pleats wanted | `gores` 11 (5 to 15) |
| Pleats | Side or box | `pleatStyle` side |
| Pleat allowance | 2 in at the hip line, 3 in at the bottom, per pleat (per side of a box pleat) | `pleatHip` 5% and `pleatHem` 7.5% of the seat (2 and 3 of 40) |
| Where the pleats start | The hip line (or the waist) | The seat line; fitted above it by the gores' seams |
| Foundation | Straighter than the plain one | `goreFlare` 25% (the gored skirt's 70%) |
| Length | Near the floor | `length` 70% of waist to floor (below the knee) |
| Closure | (not given) | The gored skirt's CB zip and waistband |

## Changes and what isn't modelled
- **The skirt is seamed at every gore**, each gore cut separately with its underlay (Mitchell
  allows sections of two or three gores; the seams then fall inside the pleats, where he marks
  them). Side pleats: the next gore's edge is sewn to the underlay's edge. Box pleats: the two
  underlays are sewn together.
- **The foundation's own changes** (the CB dropped ¼ in, the new CB line) aren't drafted; a
  lower flare does the same work of straightening the skirt.
- **Pleats at CB:** the back gore's underlay is on its CB edge, so the two halves' underlays
  meet at the CB seam (an inverted pleat there, the zip above it).
- **Pleats to the waist** aren't offered.

## Pieces
Front panel (on the fold), gores 1 to (gores − 1) / 2 (cut 2 each), waistband.

## Construction
1. Each seam from the waist to the seat line; below it, sew each gore's edge to the next
   gore's underlay (side) or the two underlays together (box).
2. Fold the pleats on the dashed lines (the gores' own edges below the seat line), press, and
   stitch across the top of each underlay at the seat line.
3. CB zip; waistband; hem, then re-press the pleats.

## Checks
`test/pleated-skirt.test.mjs`: every size, side and box pleats and a long fifteen-gore variant:
each seam's two edges (2 mm, the underlays leaning a little more than the gores), every gore's
underlays, the waist and the waistband.
