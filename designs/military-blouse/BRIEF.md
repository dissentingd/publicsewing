# Military blouse: brief

**Status: draft.** Not sewn. Muslin testing comes at the end of the Simons series.

## Source
Harry Simons, *Drafting Cotton Garments and Mackinaws* (1918), corpus `draftingcottonga00simo`:
- **Diagram XIV, Military Blouse**, PDF pp. 28–29 (book pp. 24–25). Breast 36, waist 32,
  length 28". For cotton: khaki, duck.
- The collar is the military standing collar of the **Barbers' Coat, Diagram X**, PDF pp.
  20–21.
- The sleeve is "similar to the sack coat sleeve", the two-piece sleeve of **Diagram V**.

## Pieces
| Source | Ours | Cut |
|---|---|---|
| Back ("should be made whole") | `back`, on the fold | 1 |
| Side-body (D–8, Q–R–S, U–13, V–14) | `sideBody` | 2 |
| Forepart, buttoning to the neck | `front` | 2 |
| (no facing drawn) | `facing` | 2 |
| Military standing collar (Diagram X) | `collar` | 2 on fold + interfacing |
| Sack-coat sleeve, two pieces | `topsleeve`, `undersleeve` (FreeSewing's two-part sleeve, as Bent) | 2 each |
| Slanted pocket at the breast (line at 18) and "11 inches from the breast line" | `breastWelt`, `breastBag`, `lowerWelt`, `lowerBag` | welts 2 + interfacing; bags 4 |

## Proportions → option defaults
| What | Source | Our rule |
|---|---|---|
| Block | sack-coat chest, two-piece sleeve | FreeSewing's **Bent** (Brian + two-part sleeve) |
| Chest ease | sack-coat ease, close-fitting body | `chestEase` 16% |
| Waist | drafted for waist 32 on breast 36: taken in at the back and side-body seams (S–K–13–14 and 7–9–16) | `waistEase` 16%; the half-body's surplus at the waist split 55/45 between the back and front seams (`backShare`) |
| Seat | the seams cross below the waist and open over the seat (9/10, 11/16, V/14 cross) | `seatEase` 10%; the seams let out over the seat to fit it |
| Back seam | leaves the armhole a third of the way up (Q–R) | 30% of the back armhole from the bottom |
| Front seam | leaves the armhole near its bottom (7–8) | 12% of the front armhole from the bottom |
| Length | 28" for breast 36: waist 16½" and seat 22½" from B | `lengthBelowWaist` 190% of waist-to-seat |
| Front drop | front hem a little lower (25–26) | `frontDrop` 8% |
| Stand | 23–24 is 1" | `buttonExtension` 2.8% of chest |
| Buttons | (not drawn) 5 is the usual military blouse | `buttons` 5 |
| Collar | Diagram X: 1¾" high, front end ½" higher than CB over 8¾" | `collarHeight` 11.5% of neck; spring 5.7%; square ends to the front edge |
| Pockets | slanted openings at the breast and 11" below the breast line | welt pockets: breast opening 36% of the front chest width, lower 50%, both rising toward the side |

## Changes and open points
- **Welt pockets.** The diagram shows only slanted lines at the pocket positions. We read them
  as welt (slash) pockets. Patch pockets with flaps (like the hunting coat's) would be the
  other reading.
- **Side body made by mirroring.** The side body is built from the back's and front's strips
  beyond their seams, joined at the old side seam. Simons drafts it directly. The result is
  the same piece, but the old side seam is a straight line.
- **Sleeve from FreeSewing's two-part sleeve**, fitted to the armhole with its default 1% cap
  ease, rather than Diagram V's rules.

## Construction (our words)
1. Welt pockets: interface the welts. Sew each welt and bag to the opening, cut and turn,
   stitch the welt ends and the bag.
2. Sew the side bodies to the back, then to the fronts (both are curved seams; match the waist
   notches). Shoulders.
3. Collar: interface, sew the outer and ends, turn, sew to the neckline edge to edge.
4. Facings, two-piece sleeves (back seam then front seam), set in. Hems.
5. Buttonholes on the right front (men's) or left (women's).

## Checks the tests run
`test/military-blouse.test.mjs` runs two option sets at every adult and children's measurement
set:
- the pattern drafts cleanly and every seam allowance lies outside its seam;
- each side-body edge matches the panel edge it sews to (back seam, front seam);
- the shoulders match, and the collar matches the neckline;
- the two-part sleeve cap matches the armhole plus its ease;
- the welt pockets stay on the forepart.
