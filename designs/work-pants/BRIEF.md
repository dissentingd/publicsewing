# Work pants

**Source:** Simons, *Drafting Pants and Overalls* (New York, 1916), corpus
`draftingpantsove00simo` (tracked). Work Pants, Diagram IX (pp. 16–17); compared with the
Regular Pants draft, Diagrams III–V (pp. 6–9); pockets from "Drafting Pants Pockets and Pocket
Lays" (p. 28). US 1916, public domain. Inches below are Simons', for his model: waist 34, seat
40, inseam 32.

**Block:** FreeSewing's Titan, through the trousers design (`extends: ../trousers/spec.yaml`):
the same `trouserLeg` legs, fly, waistband, loops and pocket pieces, with Simons' proportions
for work pants as option defaults.

**Status:** draft. Not sewn.

## What the source shows
Work pants are drafted on the regular pants system, "especially adapted for khaki and all
cotton materials". Against the regular draft, for the same man:
- **Rise** 10½ against 9½: an inch deeper.
- **Seat:** the forepart is ¼ seat plus ½ in, half an inch wider than the regular's (2 in round).
- **Waist:** front and back together are ½ waist plus 1½ in each side, 3 in over the waist round.
- **Knee** 21 against 20, **bottom** 17 against 15½: a straight, full leg.
- **No darts:** the waist is shaped in the side and seat seams.
- **The hem** is drawn straight across, front and back.
- The draft gives no pockets, fly or waistband. The book's pocket page gives front pockets sewn
  in 1 in below the waistband with a 6½ in opening, and back pockets 3½ in below the top of
  the waistband with a 5½ in opening.

The book's stout and young men's pants are the same system for other figures; drafting from
the wearer's measurements covers them. Its peg-top, bow-legged and knock-kneed variations,
breeches and overalls are left for later.

## How it maps onto the trousers
| Feature | Simons (34/40/32) | Here (option default) |
|---|---|---|
| Seat ease | 2 in more than regular round | `seatEase` 10%: the trousers' 5% plus 5% |
| Waist ease | 3 in round | `waistEase` 9% |
| Knee | 21, against regular 20 | `kneeEase` 31%: the trousers' 25% × 21/20 |
| Bottom | 17, against knee 21 | `hemWidth` 81% of the knee's width |
| Rise | 1 in deeper than regular | Titan's `crotchDrop` 5% of the inseam (its own 2%, plus 1 in of 32) |
| Darts | None | `backDart` 0% (can be added); no front dart |
| Hem | Straight | `hemShaping` 0% |
| Front pockets | 1 in below the band, 6½ in opening | In the side seams, from 9% of waist to seat below the waist, 59% of it long |
| Back pockets | 3½ in below the band's top, 5½ in opening | Jetted, 14% of the seat long, 18% of waist to seat below the waist |
| Fly, waistband, belt loops | Not given | As the trousers: zip fly (a button fly sews to the same pieces), band in two halves, 7 loops |

## Pieces
As the trousers: front, back (cut 2 each), waistband (2, folded), fly shield, fly facing, belt
loops, side pocket bags, back pocket jets and bags.

## Construction
As the trousers' brief. Simons' khaki work pants were usually finished with a button fly and
felled or double-stitched seams; either suits these pieces.
