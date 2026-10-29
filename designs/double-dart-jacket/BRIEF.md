# Double-dart jacket

**Source:** Mitchell, *The New "Standard" Work on Designing… Ladies' Tailor-Made Garments*
(1921), corpus `newstandardworko00mitc` (tracked). "Tight-Fitted Jacket, Double Dart", pp.
46–47; the tight-fitted foundation, p. 42. US 1921, public domain. Inches are Mitchell's (bust 39).
The archived reading of this draft (`archive/recipes/mitchell/FINDINGS.md`) gives the
construction below.

**Block:** FreeSewing's Breanna, through the fitted jacket (`extends:
../fitted-jacket/spec.yaml`, `lib/jacket.mjs`): its princess seams, under-arm panel, shaped CB,
shawl collar, facings, lining and two-piece sleeve. Added for this jacket: a second front seam on
`jacketLayout` (`second`), which splits the side front in two.

**Status:** draft. Not sewn.

## What the source shows
- **Seven body parts and the sleeve**: back, side back, under-arm, side front, middle front,
  front, on the tight-fitted foundation (the CB in 2 in at the waist).
- **Two "darts"** on the front (52–46 and 57/58–47): above the bust they're seams carried over
  the shoulder (57–58 opens 1¼ in there); below, each opens into the waist suppression.
- **Shoulder width** "in this case 5½" (p. 36's foundation has 6).
- No length, lap or hem is printed ("finish as represented"); the lap is 1¼ in as drawn. **No
  collar** is drawn or described, and no pockets.

## How it maps onto the block
| Feature | Mitchell | Here (option default) |
|---|---|---|
| First dart | Seam 52–46 over the shoulder | The fitted jacket's princess seam (Breanna's bust dart split shoulder/waist) |
| Second dart | Seam 57/58–47 over the shoulder | `secondAt` 50% along the side front's shoulder, down to the waist half way to the under-arm seam, `secondSuppression` 12% of half the seat less half the waist, flaring to the hem |
| Back, under-arm, CB | Tight-fitted | The fitted jacket's (`cbSuppression` 30%, `underarmSuppression` 18%) |
| Collar | None drawn | The fitted jacket's shawl collar |
| Pockets | None drawn | None (`pockets`, `breastPocket` off) |
| Length, lap | As drawn, 1¼ in lap | The fitted jacket's: `lengthBelowWaist` 42%, `buttonExtension` 3.2% |

## Changes and what isn't modelled
- **The second seam doesn't open at the shoulder** (Mitchell's 1¼ in at 57–58): its top is a
  point, so the front shoulder still matches the back's.
- **The shoulder width is Breanna's**, not 5½ in.
- **A shawl collar**: Mitchell's draft has none; it's the fitted jacket's.

## Pieces
As the fitted jacket without its pockets, plus the middle front: front, middle front, side front,
under-arm, side back, back (all cut 2), facing, back-neck facing, top and under sleeves, lining.

## Construction
As the fitted jacket: the front, middle front and side front joined first (match the bust
notches), then the under-arm panel, side back and back.
