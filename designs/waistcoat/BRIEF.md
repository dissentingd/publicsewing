# Waistcoat

**Source:** ЕМКО СЭВ, vol. 3, *Base constructions of men's clothing* (Moscow, 1988), corpus
`emko` (a private copy, not in the repository). §6, the men's semi-fitted waistcoat: base
construction Table 6.2 (p. 99) with Fig. 30, model construction Table 6.3 (initial model rows
1–27.2 with Fig. 31, then the finished model's rows 1–13 with Fig. 32, p. 107). Still in
copyright: only its proportions and construction are used here, as design references, in our own
words; no text or figure is reproduced. Lengths below are the book's centimetres, for its
176-100-88 figure. The archived pipeline's reading is `archive/recipes/emko/waistcoat_imk.yaml`,
`waistcoat_mk.yaml` and `archive/data/emko/waistcoat_176-100-88.yaml`.

**Block:** FreeSewing's Brian, with the coat body from `lib/coat.mjs` (`coatBack` and
`coatFront` with a sleeveless armhole, a waist dart and a cutaway point), as the bar vest uses it.

**Status:** draft. Not sewn.

## What the source shows
- **Ease:** half the chest is 56.2 across, 3.9 over the half chest (about 7.5%); the waist 13%.
- **Waist shaping** (6.5 per half): a fish dart in the back (3.2 at the waist), 15.0 from CB
  (0.7 of the back's width), from the chest line to the hip line; a dart in the front (1.6), from
  under the breast pocket to the hip line; 0.65 at each side seam; 0.4 at CB. Both darts are
  still open at the hem, which is drawn with them closed.
- **Length:** the back 9.6 below the waist (half the waist to hip); the side seam the same; the
  front edge runs 5.0 lower, to a point cut off 4.0 in from the edge (the cutaway).
- **Front:** a 2.5 button stand; a V neck from the shoulder, tangent to the neckline, to 16.0
  below the front neck; buttons from the V to above the point.
- **Shoulders and armhole:** the front shoulder cut to 10.0 (from 15.85), the back to 11.0 with
  its 1.0 ease; the armhole redrawn larger, cut in at the front and back. Fig. 32 draws it; the
  table gives it only "by the model".
- **Pockets:** welts, one just below the chest line and one at the waist, across the front dart.

## How it maps onto the block
| Feature | ЕМКО (176-100-88) | Here (option default) |
|---|---|---|
| Chest ease | about 7.5% | `chestEase` 8% |
| Waist | 13% over the waist | `waistShaping` on, `waistEase` 13% |
| Back dart | 3.2, at 0.7 of the back width, chest line to hip | `backDart` 3.2% of chest, at 70% of the back's width at the armhole, chest line to waist + waist to seat |
| Front dart | 1.6, under the breast pocket to the hip | `frontDart` 1.6% of chest, at 45% of the front's width from CF |
| Length | 9.6 below the waist | `lengthBelowWaist` 50% of waist to seat |
| Point | 5.0 below the side hem, cut 4.0 | `frontDrop` 26% of waist to seat, `cutaway` 4% of chest |
| V neck | 16.0 below the front neck | `neckDepth` 16% of chest |
| Button stand | 2.5 | `buttonExtension` 2.5% of chest; `buttons` 5 |
| Shoulder | 10.0 of 15.85 | `shoulderLength` 63% of Brian's shoulder |
| Armhole | Redrawn by the model | `armholeDrop` 3% of chest below Brian's (this design's number), curving up to the shortened shoulder |
| Welts | At the chest and the waist | `breastPocket`, `lowerPockets`: welts 31% and 45% of the front's chest width long |
| Facing, lining | (not tabulated) | `facingWidth` 6% of chest, up the V to the shoulder; front lining; `liningBack` cuts the back twice from lining |

## Construction order
1. Darts in the fronts and backs, sewn to the hem.
2. Welt pockets in the fronts (welt, bags; the lower welt is sewn over the closed dart).
3. Facings to the front linings; back to back lining at the shoulders.
4. Fronts to the backs at the shoulders, linings likewise.
5. Outer shell and lining right sides together round the front edges, V neck, back neck and the
   armholes; turn through the side seams.
6. Side seams, the shell's and the lining's, closing the last opening by hand.
7. Buttonholes and buttons.

## Changes and what isn't modelled
- **Geometry from Brian, not ЕМКО's tables**, so the waistcoat drafts at any size.
- **Darts let out at the side seam.** Brian's coat body shapes the waist at the side seams only;
  here the side seams are let out by half the two darts' total (no more than they were taken in,
  so they never bow out), so the darts take that shaping instead. On figures with no waist
  shaping to give, the darts shrink to nothing.
- **No CB seam.** ЕМКО's 0.4 at the centre back is left out: the back is cut on the fold.
- **The armhole** isn't traced from Fig. 32; it is lowered by `armholeDrop` and drawn as one curve
  to the shortened shoulder.
- **No back belt.** ЕМКО shows none; a buckled half-belt is a common addition.
