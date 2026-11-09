# Three-piece long coat

**Source:** Merz, *Practical Cutting System for Ladies' Jackets and Cloaks* (1911), Diagram XVII,
"Three-Piece Long Coat, Semi-Fitted Front and Back", printed pp. 44–45 (text PDF p. 46, plate PDF p. 47),
`merzspracticalcu00merz`. US 1911, public domain.

**Block:** extends `tailored-jacket` (Breanna, `lib/jacket.mjs`): continuous princess panels from shoulder
or armhole to hem, two-piece sleeve, facings and lining, with its `storm` front closed to the neck.

**Threadloop:** no free three-piece or semi-fitted long coat by those names. "Princess coat" finds a few
coats (Carlita Coat, Cappotto Parigi) among dresses and costumes; nothing says it's drafted from
measurements.

**Status:** draft. Not sewn.

## What the source shows
- **Back:** part of the waist taken out at two positions, the balance of the back's waist surplus
  shared between them, and the back enlarged at the hip line (S).
- **Side:** the hip addition divided into four and added around the side back (S to T, T to 3, either
  side of U).
- **Front:** semi-fitting, the suppression placed by small steps from points 10 and 11, then the front's
  waist surplus and the hip and waist difference.
- **Length:** swept from the collar point for the front and from the back's collar point for the back,
  with the same length carried to each seam.
- "For clients with full side hip" the addition goes in three parts, not four.
- **Plate (p. 47):** long shaped divisions through the waist to the hem, a narrow back, a side section
  and a front. The diagonal and transfer lines are construction lines, not seams.
- **Not given:** finished length, ease, buttons, pockets, collar, lapel or sleeve.

The scan's fractions are poorly printed in this section: the numbers above are only those legible on the
page image.

## How it maps onto the block
Reference size `cisFemaleAdult36`.

| Feature | Merz | Here (option default) |
|---|---|---|
| Length | Not given; the plate's waist to hem is about 1.15 × neck to waist | `lengthBelowWaist` 70% of waist to floor, read from the plate |
| Ease | Local drafting offsets only | `chestEase` 14%, `waistEase` 14%, `seatEase` 8%: ours |
| Front | Closed high, from the plate | `lapelStyle` storm (notch and peak on the menu) |
| Lap | Not given | `buttonExtension` 4.5% of the chest, about 1⅝ in |
| Buttons | Not given | `buttons` 3: ours |
| Front seam | — | `frontSeamClear` 2.8% of the chest, keeping the buttons on the front panel on small waists: ours |
| Pockets | None drawn | Off |

**Variant:** `fuller` (Fuller coat): `seatEase` 12%. Ours.

## Changes and what isn't modelled
- **The parent's princess panels stand in for Merz's divisions.** Front, side front, side back and back
  approximate his front, side and back; his points can't all be placed on that geometry.
- **The hip additions aren't distributed his way** (in quarters round the side back), and the "full side
  hip" alternative isn't an option.
- **Collar, lap, buttons, lining, facings and sleeve** are ours or the parent's: Diagram XVII gives none.

## Pieces
Front, side front, side back and back (each cut 2), facing, back neck facing, collar, top and under
sleeves, front and back lining.

## Construction
1. Sew the long panel seams from shoulder or armhole to hem, matching the waist notches.
2. Shoulders; collar and facings.
3. Make and set the two-piece sleeves; line the coat.
4. Hem, buttonholes and buttons. Check the long seams and the hem's balance in a muslin first.
