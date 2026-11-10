# Sack coat

**Source:** Simons, *Designing Sack Coats and Vests* (The Clothing Designer Co., New York, 1918),
corpus `designingsackcoa00simo` (tracked). Diagram A and the construction lines (p. 4), the back,
Diagrams I–II (p. 5), the conservative sack's forepart, Diagram III (text p. 6, plate p. 7), the
under collar, Diagram IV (p. 8), and the regular sleeve, Diagram V (p. 9); the men's proportions
(p. 47). PDF pages are the book's plus four (Diagram III's plate is PDF p. 11). US 1918, public
domain. Inches below are Simons', for his size 36 (breast 36, waist 32, seat 38, neck 15, height
5 ft 8 in).

**Block:** FreeSewing's Bent, through the suit jacket (`extends: ../suit-jacket/spec.yaml`,
`lib/body3.mjs`): its back with a CB seam, side panel, front, notched lapel, rounded front corner,
flap pockets, lining and two-piece sleeve. Drafted from the wearer's measurements, so it fits any
size, children included.

**Status:** draft. Not sewn.

**Threadloop (2026-11-10):** "sack coat" finds no garment among its free patterns (20 results,
all bags and sleep sacks). "men's suit jacket" finds 90, among them a "Men's Suit Style Jacket";
whether any is drafted from measurements wasn't checked.

## What the source shows
Simons asks the reader to memorise Diagrams I–III: the rest of the book's coats are drafted from
them.
- **Body:** a back with a CB seam and a forepart that runs round under the arm, with no side
  panel or dart. The forepart's side seam (27-28-29-30) crosses the back's (18-4-11-6) below the
  waist and lies 2¼ in over it at the seat line, so the coat hangs straight from the chest.
- **Widths:** the forepart's line 31 is half the breast (18 in) from the back's CB at the chest
  line (24); 32 is 2½ in beyond, and 33, the front edge, 1½ in beyond that.
- **Lengths:** the waist (D) 17½ in from the neck point (A), the seat line (E) 23 in, the full
  length (F) 30 in "in this case" (the proportions give 31 for size 36).
- **Lapel:** the gorge (23-35) and its notch (36) 2 in on; the front edge runs straight up to
  the lapel's point; the break (46) is 2 in below the chest line.
- **Front:** the waist ¾ in lower at the front edge (37-38); the hem sweeps down to 41, found by
  swinging the length 23-30 from 30; the corner (40-42) rounded.
- **Pocket:** a slanted mouth 44-45, 3¼ in each side of 43, which is ⅔ of the breast (12 in)
  below the chest line on the line squared down from 21.
- **Collar** (Diagram IV): an under collar drafted on the break line, about 1¼ in from the break
  line to the neck point (N-D) and a 2¼ in turnover (C-K), "in various widths".
- **Sleeve** (Diagram V): two-piece, with about 2 in fullness in the top sleeve's head and 1 in the
  under sleeve's.
- Not drawn: buttons, a breast pocket, a vent.

## How it maps onto the block
Simons' widths include his seams' make-up. We take ½ in a half off each (¼ in at the CB and side
seams; our reading, since he doesn't say), and divide by his own body measure for size 36.

| Feature | Simons (size 36) | Here (option default) |
|---|---|---|
| Chest | 2½ in past half the breast to 32, plus ¾ in (half the stand) to CF: 3¼ in on 18 | `chestEase` 15%: (3¼ − ½) / 18 |
| Waist | Back H to 4 6½ in, forepart 28 to CF 13⅜ in: 19⅞ in on a half waist of 16 | `waistEase` 21% |
| Seat | Back to 11 6⅞ in, forepart 29 to CF 16¼ in: 23⅛ in on a half seat of 19 | `seatEase` 19% |
| Length | 12½ in below the waist (30 − 17½) | `lengthBelowWaist` 122% of waist to seat (the 36 set's is 10.3 in; Simons' seat line is only 5½ in down, so his own isn't used) |
| Front hem | 41 about 1¾ in below the back's hem line at the edge, ¾ in of it the waist's drop (38) | `frontDrop` 10% of waist to seat: the 1 in left |
| Corner | 40-42 rounded about 2 in | `hemCurve` 55% (× 10% of the chest) |
| Stand | 33 is 1½ in past 32; CF taken as its middle, as on the boys' jacket (Simons 1922) | `buttonExtension` 2.1% of the chest: ¾ in |
| Break | 46, 2 in below the chest line, of 8 in to the waist | `breakAt` 25% |
| Buttons | Not drawn | `buttons` 3, from the break to the pockets' level: `buttonBottom` 35% of waist to seat (3⅝ in below the waist at 43) |
| Lapel | About 3 in from the crease at its widest, read from the plate | `lapelWidth` 20% of the neck (his 15 in) |
| Collar | 1¼ in stand and 2¼ in turnover | `collarWidth` 23% of the neck: 3½ in on 15 |
| Pocket height | 44, the mouth's front end, 4¼ in below the waist | `lowerPocketBelow` 41% of waist to seat (10.3 in) |
| Pocket width | 6½ in (44-45) | `lowerPocketWidth` 18% of the chest |
| Pocket place | 44 about 4⅞ in behind CF, read from the plate | `pocketFromCF` 13.5% of the chest |
| Pocket slant | 45 about ⅞ in higher than 44, read from the plate | `pocketSlant` 13% of the mouth's length |
| Cuff | 12½ in round (proportions, size 36) | `cuffEase` 87% over the 36 set's 6.7 in wrist |
| Breast pocket, vent, sleeve vent | None drawn | `breastPockets`, `vent`, `sleeveVent` off |

## Changes and what isn't modelled
- **A side panel** (the suit jacket's three-piece body on Bent) takes the place of Simons'
  two-piece body with its forepart running under the arm. The seams are in different places, but
  the widths at the chest, waist and seat are his.
- **The front edge below the waist** runs in toward the corner on the plate (about 1¼ in at the
  hem, 38 to 42); here it runs straight down to the rounded corner.
- **The armhole, shoulder and neck** are Bent's, drafted from the wearer's measurements, not
  Simons' points 15–27. His collar is the suit jacket's turn-down collar at his width, not
  Diagram IV point by point, and his sleeve is FreeSewing's two-part sleeve.
- **Buttons** aren't drawn: three is ours, the conservative style of the time.
- The double-breasted and two-button English coats (Diagrams VI and VIII), the dinner jacket,
  frock coat and dress coat are queued separately (BUILD_QUEUE.md, items 39–42).
- The vent, sleeve vent and breast welt can be turned on (`vent`, `sleeveVent`, `breastPockets`).

## Pieces
As the suit jacket: back (CB seam), side panel, front, facing, collar, top and under sleeves, the
lower pockets' flaps and bags, and the lining (back-neck facing, front and back linings, inside
pocket; `lining` and `insidePockets`, on by default).

## Construction
As the suit jacket's brief, with no vent or sleeve vent. Simons gives no making-up order.
