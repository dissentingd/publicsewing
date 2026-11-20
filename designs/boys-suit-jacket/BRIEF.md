# Boys' suit jacket

**Source:** Simons, *Designing Boys' and Juveniles' Clothing* (The Clothing Designer Co., New
York, 1922), corpus `designingboysjuv00simo` (laptop). Diagram 1, construction lines (pp.
18–20), and Diagram 2, single-breasted sack coat (pp. 21–23; PDF pp. 24–29); the coat lengths
(p. 13). US 1922, public domain. Inches below are Simons', for size 6 (breast 24, waist length
10½, seat length 14¾, full length 20).

**Block:** FreeSewing's Bent, through ЕМКО's jacket (`extends: ../suit-jacket/spec.yaml`,
`lib/body3.mjs`): its back with a CB seam, side panel, front, notched lapel, rounded front corner,
flap pockets and two-piece sleeve. Drafted from the boy's own measurements (the USDA sets in
`designs/sizes/`), so it fits any size, men included.

**Status:** draft. Not sewn.

## What the source shows
Simons drafts size 6 for juveniles (ages 4 to 8 or 10), size 12 for boys and size 14 for youths,
"the basic drafts explained for size 6 will hold good for most of the other sizes".
- **Body:** a back with a CB seam and a forepart, the side seam well behind the arm, a small
  dart under the arm (15–16).
- **Width:** the forepart's edge ½ the breast plus 3½ in from I: 2¼ in for seams and make-up,
  1¼ in for the button stand.
- **Lapel:** the break (11) 1½ in below the chest line, of 4½ in from the chest line to the
  waist; the break line from 12, 1 in out from the neck point.
- **Length:** 20 in, 9½ in below the waist.
- **Front corner** rounded (10); **one flap pocket** each side below the waist (20); no breast
  pocket, no vent drawn.
- Diagram 3, a "cheaper make", is the same with a little more width and a wider shoulder.

## How it maps onto the block
| Feature | Simons (size 6) | Here (option default) |
|---|---|---|
| Ease | Breast 24 drafted to about 28½ with make-up | `chestEase` 17%, a little over the men's jacket's 15% |
| Length | 9½ in below the waist | `lengthBelowWaist` 150% of waist to seat (the USDA boy C6's is 6¼ in) |
| Stand | 1¼ in | `buttonExtension` 2.4% of the chest past CF |
| Break | 1½ in below the chest line, of 4½ to the waist | `breakAt` 33% of the way from the chest line to the waist |
| Buttons | Not drawn (three, from the break) | `buttons` 3, the last `buttonBottom` 25% of waist to seat below the waist |
| Pockets | A flap pocket each side | The jacket's flap pockets; `breastPockets` off |
| Vent | None | `vent` off |
| Body | Two pieces and an underarm dart | The jacket's three-piece body (a side panel instead of the dart) |

## Changes and what isn't modelled
- **A side panel** (the jacket's three-piece body on Bent) takes the place of Simons' underarm
  dart; it shapes the waist the same way.
- **The cheaper make** (Diagram 3) and the double-breasted, Norfolk and Eton coats aren't built.
- The vent and breast welt can be turned on (`vent`, `breastPockets`).

## Pieces
As the jacket: back (CB seam), side panel, front, facing, collar, top and under sleeves, the
lower pockets' flaps and bags, and the jacket's lining (back-neck facing, front and back
linings, inside pocket; `lining` and `insidePockets`, on by default as on the jacket).

## Construction

Letters are the seam and placement codes on the pattern map; numbers are printed on the pieces. **SS** straight seam pressed as the step says, **HS** hem stitch, **BH** machine buttonhole. The order follows the jacket's, with no vent.

1. Lower pockets at the mouths **P** on the fronts **1**: make up each flap **12**, then the welt **10** and bag **11** below it; stitch, cut the mouth, turn the welt through and the flap down, and close the bag.
2. Join each front **1** to its side body **3** at **B**, then the side bodies to the back **2** at **C**. Press the seams open.
3. Sew the shoulders **A** of the fronts **1** and back **2**, and press them open.
4. Sew the collar **6** to the neckline **E** of the fronts **1** and back **2**, with the back-neck facing **13** behind it, then the facings **7** to the front edges **F**. Turn and press.
5. Assemble each sleeve: join the top sleeve **4** to the under sleeve **5** at **G** and **H**, and press open.
6. Set each sleeve (**4**, **5**) into its armhole **D** across the front **1**, side body **3** and back **2**; press toward the sleeve.
7. Make the lining from the front and back linings **14**, **15**, with the inside welt **16** and bag **17** if fitted, and attach it, leaving an opening to turn; close it after turning and pressing.
8. Turn and stitch the hems **J** of the body (**1**, **2**, **3**) and sleeves (**4**, **5**). Work the buttonholes **BH** on the fronts **1** and sew on the buttons.
