# Riding habit coat

**Source:** Weiler, *The Ladies' Tailor* (1915), `weilerladiestail00weil`, "Riding Habit Coat", printed
pp. 82–83 (text PDF p. 86, plate PDF p. 87). The upper coat follows his tight-fitting coat, printed pp.
80–81. US 1915, public domain. Worked example: 40 in hip.

**Block:** extends `double-dart-jacket` (Breanna, `lib/jacket.mjs`): princess seams with a second front
seam, an under-arm panel, shawl collar, two-piece sleeve, facings and lining. `jacketBase` gained
`backWaistWidth` for Weiler's narrow back, and `jacketLayout` gained `backHemFlare`.

**Threadloop:** no free riding habit or riding coat ("riding habit" finds hoods and corsets). Nothing
listed is this garment or says it's drafted from measurements.

**Status:** draft. Not sewn.

## What the source shows
- **Upper coat:** "similar to those already given for a tight fitting coat" (p. 82).
- **Back:** 1¼ in wide at the waist and 1¾ in at the hip line, ½ in more. From there 1 in out to A.
- **Side pieces:** 5 in in from A and from C, with B between the two lines; the second side piece is
  arced 2½ in each way from B.
- **Front:** in ¾ in at the waist, then 2 in; the hem steps are 4 and 4½ in.
- **Lap:** 2 in from the waist to the top, 1½ in from the waist down, "for button and button holes".
- **Back slit:** optional, 1¾ in of extra cloth from the waist down.
- "All the lines from waist to bottom must be of equal length", and more cloth over the seat than an
  ordinary coat, "as a riding habit demands more fullness at the seat".
- **Plate (p. 83):** a narrow CB, six shaped panels a side running from the shoulder or armhole to a long
  flared hem, and a roll line on the front for a lapel.
- **Not given:** finished length, ease, button count, pockets, collar or sleeve.

## How it maps onto the block
Reference size `cisFemaleAdult36`.

| Feature | Weiler | Here (option default) |
|---|---|---|
| Back at the waist | 1¼ in on a 40 in hip | `ridingBackWidth` 3.125% of the seat (1¼ / 40) |
| Back at the hip | ½ in more than at the waist | `ridingBackFlare` 2.2% of the seat, chosen to give about ½ in at hip depth |
| Seat room | "More cloth on hip line" | `seatEase` 14%, against the fitted jacket's 10%: ours |
| Second side piece | B halfway between the 5 in lines | `secondAt` 50% |
| Hem flare | 4 and 4½ in steps | `ridingHemFlare` 10% of the seat at each seam edge, the same at every seam |
| Length | Not given | `lengthBelowWaist` 55% of waist to floor, read from the plate (about 23 in) |
| Lap | 2 in above the waist, 1½ below | `buttonExtension` 5.6% of the chest (2 in on an assumed 36 in chest), the same all the way down |
| CB | Straight | `cbSuppression` 0, `cbSeat` 0 |
| Buttons | Not given | `buttons` 5: ours |
| Pockets | None drawn | Off |

**Variant:** `fuller` (Fuller riding skirt): `seatEase` 20%, `ridingHemFlare` 15%. Ours.

## Changes and what isn't modelled
- **The parent's construction stands in for Weiler's point draft:** its seam shaping and shawl collar
  are ours. The plate's roll line suggests a lapel, but its shape isn't given.
- **One lap width** all the way down, not 2 in above the waist and 1½ in below.
- **The side piece** is the parent's second front seam at `secondAt`, not arced 2½ in from B.
- **No back slit.**
- The hem flare is equal at every seam, where Weiler steps it 4 and 4½ in.

## Pieces
Front, middle front, side front, under-arm, side back and back (each cut 2), facing, back neck facing,
top and under sleeves, front and back lining.

## Construction
1. Sew the body panels, matching the waist notches; the seams below the waist are trued to equal length.
2. Shoulders; collar and facings; lining.
3. Make and set the two-piece sleeves.
4. Hem, then buttonholes on the right front and buttons on the left. Try the length in the saddle, or
   seated astride, before hemming.
