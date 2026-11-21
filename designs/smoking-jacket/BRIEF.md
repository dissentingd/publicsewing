# Smoking jacket

**Source:** Vincent, *The Cutter's Practical Guide ... Shirts and Other Undergarments* (1890), corpus `vincentmakingshirts18xx` (tracked). "Smoking
Jacket", p. 28 (PDF p. 32). Public domain. Inches below are Vincent's, for a 38 in breast.

**Block:** FreeSewing's Brian, through the dressing gown (`extends`), for its easy body, whole back, wide overlap and shawl collar.

**Status:** draft. Not sewn.

**Threadloop:** 1 free result for "smoking jacket" (2026-11-03): Daphne Jacket, Mood Sewciety. Its listing doesn't say it's drafted from measurements.

## What the source shows
"A garment of the lounge type, made with whole back. D.B. fronts, wide roll collar, and generally easy fitting."
- **Body:** half chest plus 2¾ in (5½ in round); 13 in below the waist; a whole back; the forepart overlapping the back 1½ in at the bottom.
- **Front:** "add 3 to 3½ inches for overlap, and shape turn at F to taste"; ½ in added at the bottom; a rounded corner at G, as drawn.
- **Fastenings:** three frogs across the overlap, as drawn: the first about 1 in below the chest line, the last about 3½ in below the waist.
- **Collar:** wide, rolled, in one with the front, quilted in the diagram.
- **Sleeve:** "cut as for an ordinary jacket, making the elbow about 8½ and cuff about 6¾ inches wide".
- **Cuffs:** "the gauntlet cuff is made up so that the quilted facing forms the turn-up of the cuff". No depth is given.
- **Pockets:** "hip pockets are put in with corded mouth, the cord being finished at the ends to match the fronts". Drawn slanting, falling toward the side,
  with an ornament at each end of the mouth, and the bag quilted below.
- **Materials and finish:** "various fancy materials"; fronts often trimmed with cord; cuffs and collar faced in quilted silk of another colour or pattern.
  "Generally lined through", the fronts steadied with canvas, the pocket in a thin soft wool.

## How it maps onto the block
| Feature | Vincent | Here (option default) |
|---|---|---|
| Ease | 5½ in round | `chestEase` 14.5% |
| Length | 13 in below the waist | `lengthBelowWaist` 122% of waist to seat (13 of FreeSewing's 38's 10⅝) |
| Flare | 1½ in overlap at the bottom | `hemFlare` 1.9% of the seat (¾ in each, of 40) |
| Overlap | 3 to 3½ in | `buttonExtension` 8.6% of the chest (3¼ of 38) |
| Bottom | ½ in added; corner rounded | `frontDrop` 5% of waist to seat; `hemCurve` 45% of the overlap |
| Fastenings | Three, as drawn | `buttons` 3, `buttonTop` 33% of the overlap, `buttonBottom` 34% of waist to seat |
| Cuff width | 6¾ in, so 13½ round | `cuffEase` 190% of the wrist (13½ of 7) |
| Gauntlet | No depth given | `gauntletDepth` 45% of the wrist, about 3 in; `gauntletFlare` 8%: ours |
| Pockets | Set in, corded, slanted | `handPockets`: the coat family's set-in pocket, `handPocketLean` 140%, `handPocketAt` 33%, `handPocketLength` 36%, `handPocketTop` -5%, read from the diagram |
| Lining | Generally lined through | `lining` on |
| Girdle | None | `girdle` off, with the gown's pieces if wanted |

## Pieces
Front, whole back on the fold, facing, sleeve, gauntlet cuff (cut 4: two in the outer, two in the facing), back-neck facing, lining, and each pocket's welt and bag.

## Construction
Proposed making-up order for this unsewn draft:

1. Steady the fronts with canvas, stopping short of the shoulder. Quilt the contrast collar and cuff facings if chosen.
2. If hand pockets are selected, make their corded P8 hip welt mouths and bags while the fronts are flat; put the cord on by hand.
3. Sew the A shoulder and B side seams.
4. Sew the G collar outer edge, turn it and attach it at D to the back neck; sew the E facings to the fronts and collar.
5. Close the F sleeve underarm seams and set the sleeves at C. If gauntlet cuffs are selected, make each as a tube, attach it to the sleeve hem and turn it up, contrast side out.
6. Make and attach the lining; finish the H jacket and sleeve hems with room for the lining to move.
7. Sew frogs across the lap at the BH positions, or work buttonholes and buttons there. Apply the front cord by hand.
8. If a girdle is selected, sew and turn it and attach its loops at the sides.

## Changes and what isn't modelled
- **"D.B." here means a wide overlap, not two rows.** The diagram has one row of frogs across a 3¼ in lap. The marks are at CF, for the frogs' centres, and the
  frogs themselves are bought or made. Buttons work too.
- **The sleeve is the block's one-piece sleeve,** where Vincent says "as for an ordinary jacket", probably two-piece. The wide cuff comes through; the 8½ in elbow isn't set.
- **Quilting, cord and frogs are finish:** the pattern marks where they go, not how to make them. The facing piece is the same for plain or quilted, and the cut list doesn't name a contrast.
- **The pocket's a welt,** the family's set-in pocket, standing in for a corded mouth. Replace the welt with cord for Vincent's.
- **The gauntlet's depth and flare** are ours.
- **A very wide sleeve end on children:** the cuff keeps Vincent's proportion to the wrist at every size. Reduce `cuffEase` for a closer sleeve.
