# Peacoat

**Source:** Simons, *Designing Overcoat Patterns for Men and Young Men* (The Clothing Designer
Co., New York, 1916), corpus `designingovercoa00simo` (book page = PDF page − 4). D.B.
overcoat pp. 10–11, D.B. ulster collar overcoat pp. 28–29. US 1916, public domain. Inches below
are Simons' (the ulster is for a 38 breast, drafted by the 42).

**Block:** FreeSewing's Brian, through the mackinaw (`designs/mackinaw`, Simons 1918), whose
double-breasted front, convertible collar and sleeves it shares. The peacoat is the mackinaw's
spec with these defaults.

**Status:** draft. Not sewn.

## What the source shows
Simons has no reefer or pea jacket as such; a peacoat is his double-breasted overcoat cut to the
hip. Two of his drafts give its details:
- **D.B. overcoat (p. 10, diagram p. 11):** drafted as the single-breasted coat, plus a button
  stand 2½" each side of CF (5" in all), with a ½" V at the waist making it "semi-form fitting".
- **D.B. ulster collar overcoat (pp. 28–29):** a 7" stand (3½" each side of CF); the diagram
  draws one row of three buttons about 2⅝" from CF, the top about 5¼" below the chest line and
  the others about 6¾" apart. The collar is 4" deep at the back, cut to button up to the
  throat. A slanted welt pocket runs from just above the waist line down to the hip line
  (about 8" long, its foot about 12° toward the side), its top about 8" behind CF.
- **Length:** the overcoats run 40–50" from the nape; a peacoat is hip length.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Ease | Semi-form fitting; the ulster is drafted four sizes up | `chestEase` 22% (the mackinaw's 24% is a work coat's), `bicepsEase` 32% |
| Length | 40–50" (overcoats) | `lengthBelowWaist` 130% of waist-to-seat: about 31½" from the nape at FreeSewing's men's 38 |
| Stand | 3½" each side of CF (ulster) | `buttonExtension` 9.2% of chest (3½/38) |
| Buttons | Three to a row, 2⅝" from CF, the top 5¼" below the chest line | `buttons` 3; `buttonRow` 74% of the half stand (2⅝/3½); `buttonTop` 150% of it (5¼/3½); `buttonBottom` 90% of waist-to-seat below the waist |
| Collar | Ulster collar, 4" at CB, buttons up | the mackinaw's convertible collar, `collarWidth` 29% of neck (4" plus its stand) |
| Pockets | Slanted welt, waist to hip line | `handPockets` on: a welt pocket, its top `handPocketTop` 10% of waist-to-seat above the waist and `handPocketAt` 56% of the front's chest width behind CF, `handPocketLength` 58% of that width long, leaning `handPocketLean` 21% toward the side per unit down (12°), the welt `handPocketWelt` 12% of the mouth; kept off the side seam and the hem |
| Belt, patch pockets | none | `belt`, `breastPockets`, `lowerPockets` off |
| Front hem | (overcoat) | `frontDrop` 10% of waist-to-seat |

## Construction order
1. Hand pockets: interface the welts; fold each lengthwise and lay it on the front, raw edges
   to the mouth line, a bag piece over it; stitch, cut the mouth, turn the bag through, press
   the welt over the mouth and sew its ends down; the second bag piece on, then the bags
   together.
2. CB seam; shoulders; side seams.
3. Facings to the fronts; collar to the neckline and facings.
4. Sleeves: underarm seam, then set in, easing the cap.
5. Hems; two rows of buttonholes and buttons (on the right front over the left).

## Changes and what isn't modelled
- **Not one of Simons' garments.** The peacoat is his double-breasted overcoat at hip length,
  with the ulster's stand, buttons, collar and pocket; the length and the ease are ours.
- **The collar** is the mackinaw's convertible collar (Simons 1918), not the ulster's own
  draft, which has a deeper fall at the front.
- **No lining or vents** drafted; a peacoat is often unlined in heavy melton.
- **Both rows of buttons** are marked on the front, which is cut in pairs; only the outer row
  of the overlapping front shows.
