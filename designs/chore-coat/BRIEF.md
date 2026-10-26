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
| Source | Ours | Cut |
|---|---|---|
| Back, one piece, CB on the fold | `back` | 1 on fold |
| Forepart, button stand, 4 buttons | `front` | 2 |
| (none drawn; needed to finish the stand and rounded corner) | `facing` | 2 |
| Collar, one piece | `collar` | 2 on fold + interfacing |
| Sleeve, one piece | `sleeve` | 2 |
| Breast patch pocket (left only) | `breastPocket` | 1 |
| Lower patch pockets | `lowerPocket` | 2 |

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
D–M reads 8¼" against the text's 1/3 of 18 + 2¼). They are design proportions, not checked
values.

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
1. Interface the facings and one collar piece.
2. Hem the pocket tops: fold on the marked line, stitch. Press the seam allowances under and
   topstitch the pockets to the fronts at the marks (breast pocket on the left front only).
3. Sew the shoulders and the side seams, flat-felled.
4. Sew the collar pieces together along the outer edge and ends, turn and press. Sew the under
   collar to the neckline, CB to CB, ending halfway across each button stand.
5. Sew the facings to the fronts along the front edge and corner, sandwiching the collar ends;
   turn, and finish the facing's inner edge.
6. Set the sleeves flat, then sew the underarm and side seam in one, flat-felled.
7. Turn up the hems (3 × seam allowance) and topstitch.
8. Buttonholes on the right front for men's wear (left for women's), buttons on CF.

## Checks the tests run (`npm test`)
At every FreeSewing adult set and all 75 USDA children's sets:
- it drafts with no errors, warnings or non-numeric points;
- the side seams and the shoulders match front to back;
- the collar's neck edge matches the neckline it sews to;
- the sleeve cap matches the armhole within 3 mm;
- the pockets stay clear of the armhole, side seam and hem.

The tests don't cover fit. A muslin does that.
