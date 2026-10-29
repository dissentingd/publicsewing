# Shift dress

**Source:** Esther Pivnick, *How to Design Beautiful Clothes* (Wm. H. Wise, New York, 1949),
corpus `pivnickdesignclothes1949` (laptop, Cloudbox). Chapter XXI, "One-Piece Dress Foundation
Pattern for Children's Sizes", pp. 269–273, Figures 1–8. US 1949, copyright not renewed
(HathiTrust-cleared): public domain. Inches are Pivnick's.

**Block:** FreeSewing's Brian, through the yoke template (`extends: ../templates/yoke.yaml`,
`lib/yoke.mjs`) with no yokes: added for this dress, `backYoke` off makes the back one piece
from neck to hem, as `frontYoke` off already did the front. Pivnick drafts it for children;
drafted from the wearer's measurements it fits any size, adults included.

**Status:** draft. Not sewn.

## What the source shows
"Used to make the majority of children's patterns": a back and a front, each in one piece from
the shoulder to the hem, no waist seam.
- **Back:** the CB line squared down, then a new CB from the neck through a point 4¼ in below
  the waist, so the back swings out a little; the hem squared from it; the side seam from the
  armhole (10) to the hem at ½ the hip plus 1¼ in (13), the hem corner rounded.
- **Front:** the same through the armhole; the side seam made as long as the back's, the hem at
  ½ the hip plus 1½ in.
- **Waist darts** only "if a fitted waistline is desired" (G–D–E, G–F); the foundation hangs
  straight from the bust.
- **Length** to measure ("dress length"); no ease or seams in the foundation: it's fitted in
  cloth. A sleeve "by following the regular instructions".

## How it maps onto the block
| Feature | Pivnick | Here (option default) |
|---|---|---|
| Body | One piece each, shoulder to hem | `frontYoke` and `backYoke` off |
| Flare | 1¼–1½ in past the half hip at the hem | `hemFlare` 4% of the seat at each side seam |
| Ease | Fitted in cloth | `chestEase` 12% |
| Length | To measure | `skirtLength` 45% of waist to floor below the waist (to the knee) |
| Opening | Not given | A placket down the CB from the neck, `placketDepth` 40%, `buttons` 2 |
| Neck | Not given | `neckFinish` binding (or a band, or a flat collar) |
| Sleeves | "The regular instructions" | The yoke sleeve, `sleeves` short (or long, or none) |

## Changes and what isn't modelled
- **No waist darts**: the shift is the foundation without its optional darts.
- **The CB is straight**, on the fold, not swung out below the waist; the flare is at the sides.
- **Brian has no bust dart**, so the front isn't shaped over the bust; with the ease and flare
  the dress hangs straight from the shoulders, as a shift does.

## Pieces
Front (on the fold), back (on the fold, with the placket slit), sleeves and sleeve bands, placket,
neck binding (or band or collar).

## Construction
1. Placket at the CB slit; shoulder seams.
2. Neck binding (or band or collar).
3. Sleeves set in, bands on; underarm and side seams in one.
4. Hem; buttons and holes on the placket.
