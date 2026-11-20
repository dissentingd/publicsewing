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

## Construction (our words)
The letters below identify matching seam lines in the pattern map. Numbers are printed on the pattern pieces. Stitch codes in the map and steps mean: **FF** flat-felled seam (join with a straight stitch, fold one allowance over the other, then topstitch it down); **SS** straight-stitch seam (finish the raw allowances as directed); **TS** visible topstitching close to a folded edge; **BH** machine buttonhole stitch. These are proposed sewing methods for this unsewn draft, the shared work-coat construction with the shop coat's extra pocket and length.

1. Interface the two facings **5** and one collar layer **4**.
2. Hem the top edges of breast pocket **6**, lower pockets **7** and pencil pocket **8**. Sew the pencil pocket **8** to its lower pocket where mark **P8** shows on the front, then press the remaining allowances under and use **TS** to attach the pockets at marks **P6** and **P7** on fronts **1**.
3. Join front **1** to back **2** at shoulders **A** with **FF**. Leave side seams **B** open for setting the sleeves flat.
4. Join the two collar layers **4** along outer edge **G** with **SS**; trim, turn and press. Attach the under collar to neckline **D** of fronts **1** and back **2** with **SS**, matching centre back.
5. Join facings **5** to front edges **E** of fronts **1** with **SS**, enclosing the collar ends at the top. Trim, turn, press, and finish the facings' inner raw edges.
6. Set sleeves **3** into armholes **C** of fronts **1** and back **2** with **SS** while the underarm is open, matching the cap notches. Close sleeve underarm **F** and the flared side seam **B** in one run with **FF**, keeping the back on its fold.
7. Turn up the hems of the long fronts **1**, back **2** and sleeves **3** and use **TS** along hem edges **H**.
8. Work the four **BH** at the marked positions on the right front **1**; sew buttons at the marked centre-front line.
