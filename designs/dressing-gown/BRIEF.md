# Dressing gown

**Source:** Vincent, *The Cutter's Practical Guide ... Shirts and Other Undergarments* (1890), corpus
`vincentmakingshirts18xx` (tracked). "Dressing Gowns", p. 27; "The Bath Robe", pp. 30-31 (PDF pp. 31, 34-35). Public
domain. Inches below are Vincent's, for a 38 in breast.

**Block:** FreeSewing's Brian, through the overcoat (`extends: ../overcoat/spec.yaml`): its body, one row of fastenings, and the
mackinaw's shawl collar. Added for this gown: a girdle and its loops. Strips can now name their own `options`.

**Status:** draft. Not sewn.

**Threadloop:** 55 free results for "dressing gown" (2026-11-03). The first six include one dressing gown by name
as a pattern, one a quilt and one a Sewing Bee gown; their listings don't say whether any is drafted from measurements.

## What the source shows
- **The garment** (p. 27): "long and easy-fitting", "usually finished with a roll collar", a girdle round the waist. From "the simple
  loose make of woollen cloth", unlined with patch pockets, to the lined and quilted.
- **Width:** half chest plus 2½ to 3 in.
- **Length:** full length plus seams, drawn as 46.
- **Overlap:** 2½ to 3½ in.
- **Sleeve:** a coat's, a little wider: elbow ¼ breast less ½ in, wrist ⅙ breast plus 1 in.
- **Fastenings:** three frogs drawn 3½ in apart, the middle at the waist. Loops on the side seams carry the girdle.
- **The bath robe** (pp. 30-31): the same system, drawn to 44, loose, a 1½ in button stand, a Prussian collar or a turn-down, buttons to
  the neck; sometimes a hood, sometimes double-breasted; patch pockets on the hips.

## How it maps onto the block
| Feature | Vincent | Here (option default) |
|---|---|---|
| Chest | Half chest + 2¾ in | `chestEase` 14.5% (5½ of 38) |
| Length | 46 from the nape, 17 to the waist | `lengthBelowWaist` 275% of waist to seat (29 of about 10⅝) |
| Hem | About 1 in out each side, measured off the diagram | `hemFlare` 2.5% of the seat |
| Front hem | ¾ in lower | `frontDrop` 7% |
| Overlap | 3 in | `buttonExtension` 7.9% of the chest |
| Fastenings | Three, 3½ in apart | `buttons` 3, `buttonTop` 100%, `buttonBottom` 33%: the middle at the waist, 3½ in apart at a 38 |
| Wrist | ⅙ breast + 1 in: 7⅓ in, doubled | The mackinaw's `cuffEase` 110%, which comes to that |
| Collar | Roll collar | `collarStyle` shawl; `collarWidth` 30% of the neck (ours) |

## Changes and what isn't modelled
- **Fastenings** are marked as buttons; the book's are frogs. Either goes on the marks.
- **The girdle** is a cloth tie, not a cord; its length and width are ours. Its loops have no marks on the pattern: sew them on the
  side seams at the waist notches.
- **Lining** is a setting, off, as the book's plainer kind. **Quilted collar, cuffs and trimming cord** aren't drafted.
- **Sleeve:** Brian's sleeve with the mackinaw's ease, not Vincent's scye. **No turn-back cuffs.**
- **The bath robe's hood and double-breasted form** aren't offered. Its towelling asks for a test of the ease.
- **Fit on stout figures** follows the coats' rule, not Vincent's, who says only that these are made to fit loosely.

## Pieces
Front, back (fold), sleeve, facing, patch pocket, girdle, girdle loop (cut 2). The bath robe adds a collar.

## Construction
1. Patch pockets on the fronts.
2. Shoulders; the collar seam at CB, and the collar to the back neck.
3. Facing round the fronts and collar, turned and stitched.
4. Sleeves, side seams, girdle loops caught in at the waist.
5. Hems, fastenings; sew and turn the girdle.

## Checks
`test/dressing-gown.test.mjs`: every size, the gown, the bath robe, and a plain version. The coat checks, and the girdle
round the waist with ends to tie, no sewn belt, the pockets below the waist.
