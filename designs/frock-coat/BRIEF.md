# Frock coat

**Source:** Simons, *Designing Sack Coats and Vests* (The Clothing Designer Co., New York, 1918),
corpus `designingsackcoa00simo` (tracked). Three-button single-breasted frock coat, Diagram XI:
text p. 20, plate p. 21 (PDF pp. 24–25). Simons calls it "the basis for all body fitting garments.
Various styles of cutaways and frock coats can be created from this draft." US 1918, public domain.
Inches below are Simons', for breast 36, waist 32, waist length 16¾, fashionable length 18, full
length 37.

**Block:** FreeSewing's Bent, through the tailcoat (`extends: ../tailcoat/spec.yaml`, and so the
surtout's three-piece body cut at the waist, `lib/body3.mjs`): back, side body, front, notched lapel,
collar, two-piece sleeve, and the skirt, cut away in front with the tailcoat's `tailAt` and
`tailWidth`. Options only; no library change. Drafted from the wearer's measurements, so it fits any
size.

**Status:** draft. Not sewn.

**Threadloop (2026-11-11):** "morning coat" finds 28 free patterns, none a man's coat (women's coats,
tops, a robe). The surtout's brief found no free frock coat (2026-11-03). No free equivalent.

## What the source shows
- **Body:** back, side body and forepart, cut through at the "fashionable length", F, 18 in, 1¼ in
  below the natural waist (E, 16½ in on the plate's lines; 16¾ in the measurements). "The shoulder
  is made ½ inch more crooked than the regular sack draft."
- **Front:** "9 to 10 is 4 inches for 1½ inches button stand and 2½ make-up". The forepart's point
  18 falls about 2½ in below the side's bottom (29) at F, its bottom edge 18-20-29.
- **Lapel:** "16 is the length of lapel, 2¾ inches from 10"; the notch 14 "2¼ inches from break
  line", the point 15 "2 inches from 14".
- **Buttons:** three, by the title; not drawn. The lapel turns at 16; 17 is on line F.
- **Vee:** "Take out ¼ inch Vee at point 20".
- **Skirt:** its back seam U-23-H, "23 is 1 inch from 22" (rounded out 1 in); its top from U to 24,
  ¼ in from the forepart's point; its front "24-25", 25 "⅓ of breast from H" (6 in), shaped "as
  illustrated": a long slope from the front edge back to a narrow hem.
- No pockets drawn.

## How it maps onto the block
Simons' widths include his seams' make-up: ½ in a half off each, as on the sack coat (ours).

| Feature | Simons (size 36) | Here (option default) |
|---|---|---|
| Chest | 2½ in make-up plus ¾ in (half the stand) to CF, less ½ in, on 18 | `chestEase` 15% |
| Waist | Half waist about 19⅜ in at F, as drawn, less ½ in, on 16 | `waistEase` 17% |
| Waist seam | F, 1¼ in below the natural waist | `lengthBelowWaist` 12% of waist to seat (the 36 set's 10.3 in) |
| Front's point | 18, about 2½ in below 29, as drawn | `frontDrop` 25% of waist to seat |
| Stand | 1½ in, CF in its middle | `buttonExtension` 2.1% of the chest: ¾ in |
| Lapel | 2¾ in from the chest line to 16, of 7¼ in to the waist | `breakAt` 38% |
| Lapel width | 14, 2¼ in from the break line | `lapelWidth` 17% of the neck (his 15 in), `lapelStyle: notch` |
| Buttons | Three, from 16 to 17 on line F | `buttons` 3 on CF, `buttonBottom` 12% of waist to seat |
| Skirt length | 19 in down the back (37 − 18) | `skirtSeam` 185% of waist to seat |
| Skirt | U to H about 12°, as drawn; rounded out 1 in at 23 | `skirtLean` 12°, `skirtRound` 9.7% |
| Skirt front | From 24, at the front edge, to 25, 6 in from H | `tailAt` 2%, `tailWidth` 16.7% of the chest |
| Pockets | None drawn | breast, lower and skirt pockets off |

## Changes and what isn't modelled
- **The skirt's front** is the tailcoat's curve from the top's front end to 6 in from the back seam;
  Simons draws it nearly straight, bowing out a little, and "as illustrated".
- **The forepart's bottom edge** curves up to the side, where Simons draws 18-20-29 nearly straight.
- **The Vee at 20** isn't cut; the side panel takes the waist's shaping. The "more crooked" shoulder
  is Bent's, from the wearer's shoulder slope.
- **The back's pleat** (I-J, 1¼ and 1½ in past the back's CB below the waist) isn't drawn: the two
  skirts meet at the back seam.
- **The last button** keeps the tailcoat's cap, so it stays on the front at any setting.
- Simons' other cutaways and the Prince Albert (Diagram XIII, double-breasted) aren't built here.

## Pieces
Back, side body and front (to the waist seam), facing, collar, top and under sleeves, the skirt (cut
in pairs), and the lining: back-neck facing, front and back linings, the skirt again in lining, an
inside breast pocket (`lining`, `insidePockets`, on by default).

## Construction
As the surtout's brief, with the cut-away skirt in place of its skirt: sew the skirts to the waist
seam from the front edge back to CB, and to each other down the back seam. Face the skirt's sloping
front edge with its lining, or with a facing cut to its shape. Simons gives no making-up order.
