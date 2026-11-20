# Hunting coat: brief

**Status: draft.** Not sewn. Muslin testing comes at the end of the Simons series.

## Source
Harry Simons, *Drafting Cotton Garments and Mackinaws* (1918), corpus `draftingcottonga00simo`,
**Diagram XII, Hunting Coat**, PDF pp. 24–25 (book pp. 20–21). The text in full is short; its
points are:
- "Similar to the work coat, this garment is drafted, and is intended to be made of cotton
  materials, such as khaki."
- The back is split from Q to D (a yoke) and at the waist from W to I, with ⅜" seams.
- A 1" inverted plait runs from 30 to 31.
- The belt goes all round and sews down on the back over the waist seam.
- The pockets are box-plaited.
- The collar is like the work coat's.

The geometry is the work coat's, so this design shares its body and collar rules
(`../chore-coat/BRIEF.md`) and adds what's listed below, read off the diagram.

## Pieces
| Source | Ours | Cut |
|---|---|---|
| Forepart, 5 buttons | `front` | 2 |
| Back yoke (above Q–D) | `backYoke`, on fold | 1 |
| Back between yoke and waist, inverted plait 30–31 | `backMiddle`, on fold, with the action pleat | 1 |
| Back below the waist (W–I) | `backLower`, on fold | 1 |
| Collar "similar to the work coat collar" | `collar` | 2 on fold + interfacing |
| Sleeve (work coat's) | `sleeve` | 2 |
| Breast and lower pockets, box plaits, flaps with button | `breastPocket`, `breastFlap`, `lowerPocket`, `lowerFlap` | 2 each; flaps + lining |
| Belt, all round | `backBelt`, `frontBelt` | 2 on fold; 4 |
| (no facing drawn) | `facing` | 2 |

## Proportions → option defaults
| What | Source | Our rule |
|---|---|---|
| Ease, collar, stand | as the work coat | as the chore coat (`chestEase` 20%, `collarWidth` 25%, …) |
| Length | about as the work coat, hem curving down to the front | `lengthBelowWaist` 190%, `frontDrop` 12% of waist-to-seat |
| Buttons | 5, neck to below the belt | `buttons` 5 on CF |
| Yoke | Q–D at a little over half the depth from neck to chest line | `yokeDepth` 55% |
| Action pleat | "1-inch inverted plait", near the armhole side of the back | `actionPleat` 2.8% of chest (1" at 36), at `pleatAt` 80% of the yoke width from CB |
| Belt | band at the waist, covering the back's waist seam | `beltWidth` 4.2% of chest, centred on the waist |
| Pockets | rounded bottoms, box plait down the middle, flap with button; breast pockets at the chest line, lower below the belt | breast 42% × 48%, lower 70% × 74% of the front chest width; `pocketPleat` 6% of the pocket width |

## Changes and open points
- **The shape 20–26 on the back hip is the collar** laid on the draft. The grocers' gown
  (Diagram XIII) draws its collar the same way with the same numbering (20–26), and the text
  says the collar is like the work coat's. Read off the figure, it's about 1¾" spring and 4"
  wide, close to our work-coat collar.
- **Back on the fold, in three pieces.** The source's back has a CB seam like the work coat's.
- **Side seam at the side**, as on the chore coat.
- **Pocket tops level.**

## Construction (our words)
Letters are the seam and placement codes on the pattern map; numbers are printed on the pieces. **SS** straight seam pressed open, **TS** topstitch close to a turned edge or seam, **BH** reinforced machine buttonhole.

1. Pockets **8** and **10**: fold and press the box pleat (outer lines to the centre line), baste across top and bottom and hem the top. Make the flaps **9** and **11** and their buttonholes.
2. Use **TS** to sew the pockets **8**, **10** and their flaps **9**, **11** to the fronts **1** at marks **P8** and **P10**.
3. Back: fold the inverted pleat **K** in the middle panel **4** (outer lines to the centre) and baste it top and bottom. Sew the yoke **2** to the middle panel at **Y**, then the middle panel to the lower back **5** at **W**, and topstitch both with **TS**.
4. Join the fronts **1** to the back yoke **2** at the shoulders **A**, and to the middle **4** and lower back **5** at the side seams **B**, with **SS**.
5. Make the belts **12** and **13** and use **TS** to sew the belt round the body at the marks **BT** on the fronts **1**, covering the back's waist seam.
6. Join the collar **6** along its outer edge **G**, turn it and set it to the neckline **D** of the fronts **1** and yoke **2**; sew the facings **7** to the front edges **E**, all with **SS**.
7. Close each sleeve **3** at the underarm **F** and set it into the armhole **C** of the front **1**, yoke **2** and middle back **4** with **SS**.
8. Turn up the hems of the fronts **1**, lower back **5** and sleeves **3** and topstitch them along **H** with **TS**.
9. Work the **BH** buttonholes on the right front **1** and sew the buttons at the marked centres.

## Checks the tests run
`test/hunting-coat.test.mjs` runs two option sets (default; no belt, flaps or pleats, with
pointed pockets) at every adult and children's measurement set:
- the shared coat checks (`test/coat-checks.mjs`);
- the three back pieces sew back together: yoke seam (less the pleat), waist seam, side seam
  over two pieces, and back armhole equal to what the sleeve was fitted to.
