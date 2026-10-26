# Shop coat: brief

**Status: draft.** Not sewn. Muslin testing comes at the end of the Simons series.

## Source
Harry Simons, *Drafting Cotton Garments and Mackinaws* (1918), corpus `draftingcottonga00simo`,
**Diagram XIII, Grocers' Gown**, PDF pp. 26–27 (book pp. 22–23):
- size 38, length 46", "drafted two sizes larger than the regular sack coat";
- "a swinging collar similar to the work coat";
- "With a few common sense changes this draft can be used for auto dusters, doctor's gowns
  and the like."

Named for that wider use: a long work overcoat (shop coat, lab coat, duster).

## Pieces
| Source | Ours | Cut |
|---|---|---|
| Back, forepart | `back` (fold), `front` | 1, 2 |
| (facing) | `facing` | 2 |
| Collar (20–26) | `collar` | 2 on fold + interfacing |
| "The same sleeves as the work coat" | `sleeve` | 2 |
| Breast patch (W–V), lower patch, the narrow pocket above the lower one | `breastPocket`, `lowerPocket`, `pencilPocket` | 1, 2, 1 |

## Proportions → option defaults
| What | Source | Our rule |
|---|---|---|
| Ease | two sizes larger | `chestEase` 24% |
| Length | 46" from B: 28½" below the waist (17½") | `lengthBelowWaist` 380% of waist-to-seat |
| Flare | the side seams spread from the armhole to the hem (R–U, R–12; "S to U is ⅛ of breast") | `hemFlare` 6% of the seat at each side seam |
| Buttons | 4, neck to the seat line | `buttons` 4 |
| Collar | 22–23 is 4" wide, 21–22 1¾" spring over 8½", 24–25 a 1½" point | `collarWidth` 27%, `collarSpring` 20%, `collarPoint` 10% of neck |
| Pockets | bottoms with corners cut off; lower patch round the seat line F | breast 44% × 50%, lower 62% × 72% of the front chest width; `pocketShape` chamfered |
| Pencil pocket | narrow, standing up out of the lower pocket's inner side | 11% × 58% of the front chest width, half inside the lower pocket; `pencilPocket` |

## Changes
- **The pencil pocket stands upright**; the source tilts it a little. **Pocket tops level.**
- **Back on the fold**: the source has a CB seam ("for a whole back, take off ¼ inch").
- **No back vent.** The flare gives the walking room.

## Checks the tests run
`test/shop-coat.test.mjs` runs two option sets at every adult, stout and children's set:
- the shared coat checks;
- the hem flares.
