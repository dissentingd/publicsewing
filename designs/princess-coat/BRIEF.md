# Princess coat

**Source:** Esther Pivnick, *How to Design Beautiful Clothes* (1949), corpus `pivnickdesignclothes1949` (untracked). Chapter XXII,
"Coats", Section I, "A Fitted Princess Coat", book pp. 274-279, Figures 1-9 (PDF pp. 282-287); its convertible coat collar, Chapter
XVI, Section X, book p. 233 on. US 1949, copyright not renewed (see the shift dress's brief).

**Block:** FreeSewing's Breanna, through the women's peacoat (`extends`), for its princess seams, double-breasted rows and collar
sewn round to the front edge. `lib/jacket.mjs` gained `hemFlare`, a flared CB (`cb.flare`), `buttonBottom` and `frontSeamMin`.

**Status:** draft. Not sewn.

**Threadloop:** 77 free results for "princess coat" (2026-11-03), mostly dresses and quilts by name; FreeSewing's Carlita is a coat, drafted from measurements. A princess-seamed coat wasn't among the first results.

## What the source shows
"This type of fitted coat is generally in style season after season." Its figures carry no numbers, so every default below is read
from them, on a figure with about 17½ in from neck point to waist. They're proportions from small drawings, not measurements.
- **Panels:** a front, a side front, a side back and a back, with a CB seam flaring like the others (Figs. 5, 6).
- **Length:** to mid-calf (Fig. 1); about 30 in below the waist.
- **Flare:** "moderate"; about 4¼ in on each edge at the hem. It "can start any place on the skirt and be as wide as desired"; the
  figures start it slightly below the waist.
- **Closure:** two rows of six buttons, from the neck to the waist; buttonholes on the outer row (Figs. 1, 3, 5).
- **Collar:** the convertible coat collar: "a large collar" that rolls when closed and falls open as a notch collar (Figs. 1, 2).
- **Pockets:** slash pockets on the side fronts, with a band, sloping to the side (Figs. 1, 5).
- **Back:** a half belt at the waist, in Fig. 1's back view only; the text doesn't mention it.
- **Sleeve:** "the regulation two-piece sleeve".
- **Ease:** "enough larger than a dress to permit lining and wearing over dresses", "but not be too snug".
- **Lining:** cut like the coat, to the facing's edge at the front, with a full-length pleat at the CB.

## How it maps onto the block
| Feature | Pivnick (read from the figures) | Here (option default) |
|---|---|---|
| Ease | "Enough larger than a dress" | `chestEase` 16%, `waistEase` 14%, `seatEase` 10%: ours, between the tailored jacket's and the peacoat's |
| Length | About 30 in below the waist | `lengthBelowWaist` 72% of `waistToFloor` (30 of about 41) |
| Flare | About 4¼ in per edge | `hemFlare` 11% of the seat (4¼ of 40), or what the seat itself needs if that's more. The hem rises at the seams as in Fig. 5, so every edge is the same length |
| CB | A seam, flared | `cb.flare`: the back and its lining are cut in pairs |
| Lap, rows | About 2¼ in; about 1½ in either side of CF | `buttonExtension` 6% of the chest; `buttonRow` 62% of the lap |
| Buttons | Six to a row, the last on the waist | `buttons` 6; `buttonBottom` 0% |
| Front seam | About 3¾ in from CF at the waist | `frontSeamClear` 4% of the chest past the row (about 3 in from CF at Women 36) |
| Collar | Large, width as desired | The storm collar's construction, sewn round to the front edge; `collarWidth` 24% of the neck, about 3¼ in |
| Pocket band | 5½ by 2½ in, sloping 23°, 3 in below the waist | `pocketBelow` 34%, `pocketWidth` 85%, `pocketAngle` 23°, `flapDepth` 44%, `pocketFromSeam` 3.5% |
| Half belt | About 1 in wide, a third of the waist | `halfBelt` on; `halfBeltLength` 33% of the waist; `beltWidth` 2.8% of the chest |

## Pieces
Front, side front, side back and back, each to the hem and cut in pairs; facing; back-neck facing; collar; two-piece sleeve; band,
jet and bag for each pocket; half belt; lining for the front and back (the side panels and sleeves are cut in lining too).

## Construction
1. Front to side front and back to side back; CB seam; side seams.
2. Pockets: as the tailored jacket's set-in pocket, the band sewn in at the mouth.
3. Shoulders; collar to the neck, round to the front edges; facings, back-neck facing and top collar.
4. Sleeves: the two pieces together, then set in.
5. Half belt: folded lengthwise, sewn, turned; stitched across the back at the waist, with a button at each end.
6. Lining, with its CB pleat; hems; buttonholes in the outer row, buttons in the inner, matching ones inside the outer to hold the
   underlap.

## Changes and what isn't modelled
- **The front seam moves the other way.** Pivnick shifts the princess line slightly toward CF from the book's own foundation. Breanna's waist
  dart sits much closer to CF, and on men's sets reaches it, so ours moves toward the side, with the dart's width unchanged, until it's
  clear of the button row. It ends close to where Fig. 5 puts it.
- **The flare starts at the waist,** not slightly below it: the book allows it to start anywhere, and one straight edge is simpler to true. It
  adds a little room at the hip.
- **The band is sewn as the jacket library's flap,** hanging from the mouth, so it covers the slash. The book's "finishes" the slash, and the
  figures can't settle which way it lies. The piece is labelled a flap.
- **The facing is a separate piece.** The book prefers it cut in one with the front panel for a thinner edge (Fig. 8), and allows this.
- **The lining's extra ease** at the shoulder and waist darts (Fig. 9) isn't drafted; the CB pleat is.
- **The top collar's extra length** at CB and the bias under collar (Figs. 7B, 7C) aren't separate pieces: the one collar piece is cut
  twice. The Section X collar draft isn't followed line by line.
- **Lapelled when open:** a convertible collar makes lapels only by turning the fronts back. The `notch` variant cuts real lapels instead.
- **Men's sizes** draft cleanly, but Breanna is a bust block, and the seams curve strongly over a bust the wearer doesn't have.
- **The half belt's place isn't marked.** The chapter's loose-hanging coat (pp. 279-282) isn't built here; `womens-box-coat` is close.
