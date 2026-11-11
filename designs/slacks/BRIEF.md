# Slacks

**Source:** Simons, *Drafting Trousers for Men, Boys, Women* (The Garment Technical Institute,
Morris Plains, N.J., 1945), corpus `simonsdraftingtrousers1945` (not tracked; a copy on the laptop and
on the home server). Young men's slacks, Diagram 9 (pp. 42–44); slacks with a continuous waistband,
Diagram 10 (pp. 45–46); cotton slacks, Diagram 10A (p. 47). PDF pages are the book's plus 8 (Diagram
10's plate is PDF p. 54). US 1945, **not renewed**: NYPL's renewal records for 1972 and 1973, the years
a 1945 copyright had to be renewed in, list no renewal by Simons or his publisher (checked
2026-11-11), so it is in the public domain in the US. Inches below are Simons', for waist 34, seat 40,
inseam 32, rise 12 including the band, knee 22, bottom 21.

**Block:** FreeSewing's Titan, through the peg-top pants (`extends: ../peg-pants/spec.yaml`, and so the
suit trousers): front and back legs, the front's pleats, fly, side pockets, jetted back pocket and belt
loops. `trouserLeg` gained `bandRise`, the leg cut on above the waist for a continuous waistband.
Drafted from the wearer's measurements, so it fits any size.

**Status:** draft. Not sewn.

**Threadloop (2026-11-11):** "pleated trousers" finds 115 free patterns, a few of them trousers
(Petaluma, Haz, Cato, Alexa, a zoot suit); whether any is drafted from measurements wasn't checked.

## What the source shows
- **Diagram 9, young men's slacks:** two front pleats, "the pleat from V to W is 1½ inches and the
  pleat from X to Y is 1 inch", the centre pleat lined up with the crease and "turned towards the outside
  seam". "It can be drafted without pleats if desired." A ¼ in vee at the back. A separate waistband
  1¾ in wide, "any width desired, providing the rise measurement remains constant". ¼ in seams.
- **Diagram 10, continuous waistband:** "drafted the same as the regular slack trousers. The only
  difference is that the waistband is added to the front and back and the pleats are extended to the
  top of the forepart. These pleats are sewed down from the normal waistline to the top of the
  waistband." The front squared up 2 in at G and N (12, 13), the pleats' lines extended to the top;
  the back's rise extended 2 in (4 to 19), its seat seam carried up (3 to 18), and its vee to 20.
- **Diagram 10A, cotton slacks:** one pleat, "Q is 1½ inches from P", a wide knee and bottom, ½ in
  seams, and a separate waistband "2¾ inches to finish 2 inches wide".
- **Legs:** knee 22, bottom 21, nearly straight.

## How it maps onto the block
| Feature | Simons (waist 34, seat 40) | Here (option default) |
|---|---|---|
| Seat | Not stated as an ease | `seatEase` 8%, the peg-top pants' (Simons 1916's pleated draft) |
| Knee | 22 | `kneeEase` 37.5% of the knee, as the peg-top pants (22 in there) |
| Bottom | 21 on a 22 knee | `hemWidth` 95% of the knee |
| Pleats | 1½ and 1 in, 2½ in on the front | `pleats` 2, `frontDart` 73% of half the seat less half the waist (about 3⅜ in at his size) |
| Back vee | ¼ in | `backDart` 8% of the same |
| Band | Cut on, 2 in above the waist | `continuousBand` on, `waistbandHeight` 4.8% of waist to floor (2 in on about 42 in) |
| Cotton slacks | One 1½ in pleat, separate 2 in band | the `cotton` variant: `continuousBand` off, `pleats` 1, `frontDart` 44% |

## Changes and what isn't modelled
- **Equal pleats:** the trousers' library lays the pleat width in equal pleats; Simons' are 1½ and 1 in.
- **The band's sides:** squared up from the waist at the outseam and CF, and the back's seat seam
  carried straight on up, as on Diagram 10. Its top is the waist's length at the front and a little
  shorter at the back.
- **Seat and rise** are Titan's, from the wearer's measurements, not Simons' 1945 points; the seat
  ease is his 1916 pleated pants', since this book gives it only as drafted lines.
- **Pockets and belt loops** are the trousers' (on-seam side pockets, a jetted back pocket, seven
  loops on the band); Simons' slacks diagrams don't draft them.
- **Seams:** our allowances are added outside the net pattern, not Simons' ¼ in and ½ in in the draft.

## Pieces
Front and back legs (the band cut on), fly shield and facing, belt loops, side pocket bags, back
welt and bag. With `continuousBand` off, a separate waistband.

## Construction
As the suit trousers, with the waistband cut on: fold and stitch the pleats from the waist line up
to the band's top; sew the side and seat seams through the band; set the zip through the band; face
the band's top with a waistband lining or a curtain (not drafted). Simons gives no making-up order.
