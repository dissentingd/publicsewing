# Tailcoat

**Source:** Simons, *Designing Sack Coats and Vests* (The Clothing Designer Co., New York, 1918),
corpus `designingsackcoa00simo` (tracked). Young man's full dress coat, Diagram XII: text p. 22,
plate p. 23 (PDF pp. 26–27). "It is similar to the frock coat" (Diagram XI). US 1918, public
domain. Inches below are Simons', for breast 36, waist 32, seat 38, natural waist length 17½,
"fashionable" waist length 16.

**Block:** FreeSewing's Bent, through the surtout (`extends: ../surtout/spec.yaml`, `lib/body3.mjs`):
back, side body and front cut through at the waist, a peaked lapel, collar, two-piece sleeve, and the
one-piece skirt below. `body3Skirt` gained `tailAt` and `tailWidth`, which cut the skirt away in
front to a tail. Drafted from the wearer's measurements, so it fits any size.

**Status:** draft. Not sewn.

**Threadloop (2026-11-10):** no free pattern for "tailcoat" (0 results); "tail coat" finds 63, all
blankets, plush toys and tops by name. No free equivalent was found.

## What the source shows
- **Body:** back, side body and forepart, cut through at the natural waist (F, 17½ in); "B to H is
  37 inches", the full length at the back.
- **Front:** "40 to 10 is ½ of the breast, 18 inches. 10 to 11 is 2⅝ inches. 11 to 12 is 1 inch."
  The forepart is cut off below the waist: "15 is ⅙ of 18 from line F", its point 17, the bottom
  edge rising straight from 17 through 19 to 18 at the side body.
- **Lapel:** peaked (31 above the notch 32), rolling to 14 on the fashionable waist line (E).
- **Buttons:** three drawn on the forepart, about 3¼ in behind CF, the last about 2½ in below F,
  close to the bottom edge. The coat is worn open.
- **Skirt (the tail):** from 20 on the forepart's bottom edge, a long curve down and back to 25 at
  the hem; "24 to 25 is ¼ of 18". The back runs on below the waist (I to 5), with a 1¾ in
  extension (I-K, 5-L) along it.
- **Vee:** "take out x inch Vee at point 19" (the fraction is lost in the scan).
- No pockets drawn.

## How it maps onto the block
Simons' widths include his seams' make-up: ½ in a half off each, as on the sack coat (ours).

| Feature | Simons (size 36) | Here (option default) |
|---|---|---|
| Chest | 2⅝ in past half the breast to 11, plus ½ in (half of 11-12) to CF, less ½ in | `chestEase` 15% |
| Waist | Half waist about 18¼ in at F, as drawn, less ½ in, on 16 | `waistEase` 11% |
| Waist seam | At F, the natural waist, where Bent's waist is | `lengthBelowWaist` 3% of waist to seat, just below it |
| Front's point | 17, about 4 in below the side's bottom at 18, as drawn | `frontDrop` 39% of waist to seat (the 36 set's 10.3 in) |
| Stand | 11-12, 1 in, CF in its middle | `buttonExtension` 1.4% of the chest: ½ in |
| Lapel | Peaked, rolling to 14, 1½ in above F | `lapelStyle: peak`, `breakAt` 80% (chest line to waist) |
| Lapel width | About 3⅞ in from the crease at 31, read from the plate | `lapelWidth` 26% of the neck (his 15 in) |
| Buttons | Three, about 3¼ in behind CF | `buttons` 3, `buttonsBehindCF` 9% of the chest |
| Last button | About 2½ in below F | `buttonBottom` 20% of waist to seat, and never lower than ¾ of the bottom edge's fall below the side where it sits, less 1% of the chest (ours: so it stays on the front at any size and setting) |
| Tail length | 19½ in below the waist (37 − 17½) | `skirtSeam` 190% of waist to seat |
| Tail hang | I-5 almost straight | `skirtLean` 4°, `skirtRound` 0 |
| Tail start | 20, about 27% of the waist seam from the front, read from the plate | `tailAt` 27% |
| Tail width | 5 to 25, about 4¾ in at the hem, read from the plate | `tailWidth` 13% of the chest |
| Pockets | None drawn | breast, lower and skirt pockets off |

## Changes and what isn't modelled
- **A one-piece tail** cut from the surtout's skirt, which is drafted to fit the whole waist seam
  and then cut away in front. Simons runs the back on below the waist and adds a separate skirt
  piece beside it; the extension I-K, 5-L along the back (the tails' overlap at CB) isn't drawn.
- **The front's bottom edge** curves up to the side (the body's hem with a front drop), where
  Simons rules it straight from 17 to 18.
- **The Vee at 19** isn't cut: its amount is lost in the scan, and the side panel takes the waist's
  shaping.
- **Buttons:** one row on each front, behind CF, as drawn; worn open, they're decorative. The last
  is capped above the bottom edge, which Simons doesn't need to say for his one size.
- **Bent's shoulders and armhole**, not Simons' points; FreeSewing's two-part sleeve.

## Pieces
Back, side body and front (to the waist seam), facing, collar, top and under sleeves, the tail
(skirt, cut in pairs), and the lining: back-neck facing, front and back linings, the tail again in
lining, an inside breast pocket (`lining`, `insidePockets`, on by default).

## Construction
As the surtout's brief, with tails in place of its skirt: join the body, then sew each tail to the
waist seam from point 20 back to CB, and the two tails together at CB from the waist down as far as
wanted (Simons' tails overlap a little there). Face the tail's front edge with its lining. Cut the
lapels' facing in silk if wanted. Simons gives no making-up order.
