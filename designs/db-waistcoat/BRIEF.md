# Double-breasted waistcoat

**Source:** Simons, *Designing Boys' and Juveniles' Clothing* (1922), corpus `designingboysjuv00simo`. "Double-Breasted Vest", Diagram 16, pp. 56-57 (PDF pp. 62-63), made
"similar to the previous diagram", the single-breasted vest, Diagram 15, pp. 53-55. US 1922, public domain. Size 14, in inches.

**Block:** FreeSewing's Brian, with the coat library's sleeveless body, through the waistcoat (`extends`). That waistcoat's proportions come from ЕМКО; here the front's
style and numbers are Simons', and no ЕМКО text or figure is used. No library changes. Drafted from the wearer's measurements, so it fits men too.

**Status:** draft. Not sewn.

**Threadloop:** 312 free results for "double breasted waistcoat" (2026-11-04); the first ones are coats, blazers and the like, with no waistcoat among them.

## What the source shows
- **Stand:** "8 to 11 is ½ of the button stand, 2¼ inches in this case, which gives a 4½-inch button stand", on the center line at 8.
- **Neck:** a V from 4 and 5 at the neck straight down to 14, on the front edge, about 2½ in below the chest line.
- **Point:** the front edge runs on to 16, then cuts across to 10, on CF, about 4 in below the side's hem; a curve back up to U and F at the side.
- **Buttons:** one row of four dots is drawn, outside CF; the row opposite is implied.
- **Pockets:** a welt below the chest line and one at the waist, both rising toward the side.
- **Shaping:** the side seam takes the waist in, as a lens from Y (17 to X, 1½ in; S and T, 1 in). "A ¼-inch V can be taken at point 18 and 19 when a tight waist is desired."
- **Length:** the side's hem about 2¾ in below the waist, as drawn.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Stand | 2¼ in each side of CF, of about a 31 breast | `buttonExtension` 7.3% of the chest |
| Rows | About 1¾ in from CF, as drawn | `buttonRow` 78% of the stand |
| Buttons | Four, as drawn | `buttons` 4, to a row |
| V | To the edge, 2½ in below the chest line | `neckDepth` 28% of the chest, from the CF neck |
| Length at the side | 2¾ in below the waist | `lengthBelowWaist` 33% of waist to seat (of about 8½) |
| Point | 4 in lower, at CF | `frontDrop` 47% of waist to seat |
| The corner across the stand | 16 to 10 | `cutaway` 10% of the chest |
| The dart at 18, 19 | ¼ in, optional | `frontDart` 1% of the chest |
| Facing | Not given | `facingWidth` 13% of the chest: wider than the stand |
| Pockets | As drawn | Two welts, rising toward the side, from the waistcoat's parts |
| Ease, armhole, back, lining | "Similar to the previous diagram" | Inherited from the waistcoat |

## Pieces
Front, back, facing, front lining, and a welt and bag for each pocket.

## Construction
As the waistcoat. Buttonholes in the row on the over-lapping front's outer side, buttons in its inner row, and buttons on the underlap under the holes.

## Changes and what isn't modelled
- **The waistcoat's darts stay,** a back dart and a small front one, where Simons takes the waist in by the side seam's lens. The waist comes out similar.
- **The hem is straight** from the point to the side, not Simons' curve.
- **The row of buttons is mirrored,** as Simons draws only one.
- **The back keeps the waistcoat's shape,** with no separate reading of Diagram 15's.
