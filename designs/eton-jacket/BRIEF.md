# Eton jacket

**Source:** Simons, *Designing Boys' and Juveniles' Clothing* (The Clothing Designer Co., New York, 1922), corpus
`designingboysjuv00simo`. Diagram 13, "English Eton Coat", pp. 46-49 (PDF pp. 52-55). US 1922, public domain. Inches are Simons', for
age 6: breast 24, waist 24, waist length 10¼.

**Block:** FreeSewing's Bent, through the boys' suit jacket (`extends`, `lib/body3.mjs`). No library changes: its body cut off above
the seat line, lapel, collar, facing and two-piece sleeve do all of it. Drafted from the wearer's measurements, so it fits any size.

**Status:** draft. Not sewn.

**Threadloop:** 2 free results for "eton jacket" (2026-11-03), a sweatshirt and a bodysuit; no free equivalent by name.

## What the source shows
"A boy's English Eton coat ... on the same system as explained in the previous diagrams."
- **Length:** E is 3 in below the waist (D), so the jacket ends just below it.
- **Body:** a back with a centre seam (F, ¾ in in at the waist, on through E), a side body (K, S, P, R), and a forepart (T, U, V): three
  pieces, as the boys' suit jacket.
- **Front:** a lap of 1¼ in past CF (4 to 5), squared down to the hem at 11, 12 and 13.
- **Lapel:** wide, its crease reaching the front edge at 10, on the waist line. The heavy line rising from 10 is the lapel's edge folded
  back over the forepart; the flat pattern's edge is the line from 7 down to 10.
- **Hem:** a shallow curve, lowest at the front corner (12) and at the back (E); the front corner drawn square.
- **Not drawn:** pockets, a vent or buttons. The text ends "shape the neck, lapel and front". No separate sleeve or collar: "the same system".

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Length | 3 in below the waist | `lengthBelowWaist` 48% of waist to seat (3 of the USDA boy C6's 6¼) |
| Lap | 1¼ in on a 24 in breast | `buttonExtension` 5.2% of the chest |
| Break | At 10, on the waist | `breakAt` 100%, chest line to waist |
| Lapel | About 2¼ in at its point (read from the diagram) | `lapelWidth` 20% of the neck, on an 11 in neck |
| Front corner | Square, a little below the hem line | `hemCurve` 0%; `frontDrop` 4% of waist to seat, about ¼ in |
| Pockets | None drawn | `lowerPockets` off; the parent's breast welt is off too |
| Vent | None drawn | Off, as the parent |
| Buttons | None drawn | `buttons` 1, at the break: ours, so it can close. 0 is allowed |
| Ease, sleeve, collar, lining | "The same system" | Inherited from the boys' suit jacket |

## Pieces
Front, back, side body, facing, collar, top and under sleeves; back-neck facing, front and back lining, the inside pocket's welt and bag,
as the boys' suit jacket.

## Construction
As the boys' suit jacket, without the outer pockets. Press the lapel on its crease down to the waist, and don't press out the roll.

## Changes and what isn't modelled
- **The back is cut on the fold,** not with Simons' centre seam, as on the boys' suit jacket with no vent: `lib/body3.mjs` keeps the CB straight
  and takes the waist in at its other seams. The ¾ in at the waist goes there.
- **The hem is nearly level,** without Simons' shallow curve down to the front and back. The front only drops `frontDrop`.
- **The lapel is the family's notched lapel:** Simons' top edge is close to it, and "shape the neck, lapel and front" gives no more.
- **The side body is narrower** than Simons' below the armhole, as on the rest of this family.
- **An inside pocket** comes with the parent's lining. On something this short it's a tight fit, and the source doesn't ask for it.
