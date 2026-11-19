# Chore coat: brief

**Status: draft.** No muslin has been sewn yet. Record the first one here (date, who sewed it,
size or measurements, what fit and what didn't), then mark the design `tested`.

## Source
Harry Simons, *Drafting Cotton Garments and Mackinaws* (Clothing Designer Co., 1918), "Work Coat,
Diagram VIII". Corpus id `draftingcottonga00simo`, PDF pp. 16–17 (book pp. 12–13); conventions on
PDF p. 8 (book p. 4). US 1918, so public domain. Simons calls it "the basic draft for all
garments of this kind" in the book: the barber's coat, hunting coat, boys' work coat and the
mackinaws all build on it, so the later designs can reuse this one.

The draft is for breast 36, height 5 ft 8 in, and its divisions use half the breast (18). It
includes allowances "for double needle machine work", i.e. flat-felled seams.

## Pieces (the source's and ours)
| Pattern no. | Source | Ours | Cut |
|---|---|---|---|
| 1 | Forepart, button stand, 4 buttons | `front` | 2 |
| 2 | Back, one piece, CB on the fold | `back` | 1 on fold |
| 3 | Sleeve, one piece | `sleeve` | 2 |
| 4 | Collar, one piece | `collar` | 2 on fold + interfacing |
| 5 | (none drawn; needed to finish the stand and rounded corner) | `facing` | 2 |
| 6 | Breast patch pocket (left only) | `breastPocket` | 1 |
| 7 | Lower patch pockets | `lowerPocket` | 2 |

## Style lines and proportions → option defaults
Inches below are the source's at breast 36. Everything becomes a proportion, so it grades.

| What | Source | Our rule (option) |
|---|---|---|
| Chest ease | half-chest 21½" drafted for 18" → 43" round on 36" | `chestEase` 20% |
| Length | hem 31" below the shoulder line, 13½" below the waist; seat line 7½" below the waist | `lengthBelowWaist` 180% of waist-to-seat |
| Side seam | straight, flaring a little toward the hem (14→13 is 2¼") | straight, let out to `seatEase` 12% over the seat where needed |
| Button stand | 1½" beyond the front line ("come out 1½" for stand") | `buttonExtension` 4.2% of chest |
| Buttons | 4, from the neck to just below the waist | `buttons` 4, on CF, top just below the neck, bottom at 80% waist-to-seat |
| Front corner | rounded ("come in ¾" at 9") | `hemCurve` 50% (radius = stand width) |
| Front hem | level | `frontDrop` 0 (the boys' coat uses 10%) |
| Collar width | 4" at CB (6–5) | `collarWidth` 25% of neck |
| Collar spring | neck edge 1" lower at CB than at the front (3–6) over 8½" | `collarSpring` 12% of the collar's half length |
| Collar point | 1" beyond the front end (4–8) | `collarPoint` 7% of neck |
| Breast pocket | ≈5" × 6", pointed bottom, inner edge ≈1⅓" from CF, top on the breast line | 47% × 56% of the front chest width; `pocketShape` pointed |
| Lower pockets | ≈7¾" × 8", pointed bottom, inner edge ≈3¾" from CF, top ≈4½" below the waist | 72% × 76% of the front chest width, top at 60% waist-to-seat |
| Sleeve | one piece; hem 12¾" round (6½ + 6¼); inseam 1" over the 18" standard | `cuffEase` 100% of wrist; `sleeveLengthBonus` 4% |
| Biceps ease | not stated (roomy work sleeve) | `bicepsEase` 25% |

Pocket sizes were measured off the printed diagram, which is roughly to scale (the back width
D–M reads 8¼" against the text's 1/3 of 18 + 2½ = 8½, book p. 12, so the diagram is about 3%
small). They are design proportions, not checked values.

## Stout figures (Diagrams VI and XI)
The shared coat body applies Simons' stout rule. The "fat" is how far the waist exceeds a
regular waist for that breast (breast less 3" at 40; `stoutDrop` 8.3% of chest). Half of it
goes into the half-body draft:
- **⅔ at the front.** The front edge, CF and buttons move forward from the chest line to the
  waist and below.
- **⅓ split between the side seams.**
- **Front length.** The front gets ⅙ of the fat in extra length, his under-arm "vee" opened
  ½" on 3" of fat.

The tests include three stout figures, and check that the coat clears the waist.

## Changes from the source (deliberate)
- **Side seam at the side.** Simons puts it toward the back (the forepart wraps round under
  the arm). We keep the Brian block's side seam, the usual modern placement.
- **Buttons on CF.** The source sets them 1¼" from the front edge, which is ¼" off CF.
- **A separate front facing.** The source draws none. The rounded corner needs one.
- **Pocket tops level.** The source's pocket tops slope down toward CF.
- **Plain shirt-type sleeve cap** fitted to the armhole with no ease (FreeSewing's sleeve), which
  suits flat-felled seams.
- **Neck and shoulders from the Brian block**, not Simons' neck points.

## Construction (our words)
The letters below identify matching seam lines in the pattern map. Numbers are printed on the pattern pieces. Stitch codes in the map and steps mean: **FF** flat-felled seam (join with a straight stitch, fold one allowance over the other, then topstitch it down); **SS** straight-stitch seam (finish the raw allowances as directed); **TS** visible topstitching close to a folded edge; **BH** machine buttonhole stitch. These are proposed sewing methods for this unsewn draft.

1. Interface the two facings **5** and one collar layer **4**.
2. Hem the top edges of breast pocket **6** and lower pockets **7**. Press their other allowances under and use **TS** to attach them at marks **P6** and **P7** on fronts **1** (pocket **6** goes on the left front only).
3. Join front **1** to back **2** at shoulders **A** with **FF**. Leave side seams **B** open for setting the sleeves flat.
4. Join the two collar layers **4** along outer edge **G** with **SS**; trim, turn and press. Attach the under collar to neckline **D** of fronts **1** and back **2** with **SS**, matching centre back and ending halfway across each button stand. Clip the curved allowances before turning where needed.
5. Join facings **5** to front edges **E** of fronts **1** with **SS**, enclosing the collar ends at the top and rounded corners below. Trim the corners, turn, press, and finish the facings' inner raw edges.
6. Set sleeves **3** into armholes **C** with **SS** while the underarm is open, matching the cap notches; finish those raw allowances together. Close sleeve underarm **F** and body side seam **B** in one run with **FF**.
7. Turn up the coat and sleeve hems (3 × seam allowance) and use **TS** along hem edges **H**.
8. Work **BH** at the marked positions on the right front **1** for men's wear (left for women's); sew buttons at the marked centre-front line. Fit a muslin before cutting final cloth.

## Checks the tests run (`npm test`)
At every FreeSewing adult set and all 75 USDA children's sets:
- it drafts with no errors, warnings or non-numeric points;
- the side seams and the shoulders match front to back;
- the collar's neck edge matches the neckline it sews to;
- the sleeve cap matches the armhole within 3 mm;
- the pockets stay clear of the armhole, side seam and hem.

The tests don't cover fit. A muslin does that.
