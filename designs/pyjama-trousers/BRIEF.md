# Pyjama trousers

**Source:** Vincent, *The Cutter's Practical Guide to Cutting and Making Shirts, Undergarments,
Collars, Cuffs, Aprons, and Specialité Clothing for Various Occupations* (London, 1890), corpus
`vincentmakingshirts18xx` (Cloudbox; PDF p. 30). "Pyjama Trousers", p. 26; "Pants or Drawers",
p. 24, which Vincent says they may also be cut from. Public domain (published 1890; Vincent died
1926). Inches below are Vincent's, for a seat of 40.

**Block:** FreeSewing's Titan, through the knickerbockers (`extends:
../knickerbockers/spec.yaml`): their full gathered legs with a waist casing, run down to the
ankle with a plain hem instead of into a knee band. Worn with the pyjama jacket
(`designs/pyjama-jacket`).

**Status:** draft. Not sewn.

## What the source shows
- **Measures:** waist, seat over the trousers, and the leg, "usually made 1 inch shorter than
  the trousers measure".
- **Cut from doubled cloth** with the crease at the side: no side seam.
- **Topside** a quarter of the seat plus ½ in at the fork line, a quarter of the seat less 1 in
  at the bottom; the **underside** let out 1½ in at the fork, ½ in at the knee, 1½ in at the
  bottom. The leg runs nearly straight, about 20 in round at the hem.
- **Waist:** half the waist plus 5 in each side, "an inch for making up and 4 for gathering".
- **With or without feet:** two ways to sew a foot to the bottom (a tongue, or a cut and seamed
  bottom; Diagrams 2–4).

## How it maps onto the block
| Feature | Vincent | Here (option default) |
|---|---|---|
| Seat and waist | Full, the waist gathered in | The knickerbockers' `seatEase` 18% and waist casing: the waist wide enough to pull on over the seat, gathered by elastic or a drawstring |
| Leg length | The trousers' less 1 in | `legLength` 95% of waist to floor |
| Leg | Nearly straight, about 20 in round at the hem | `legFlare` −20% of the seat at each outseam: about 23 in round at FreeSewing's 38, and never under the knee round |
| Hem | Not given | `hemDepth` 5% of waist to floor (2 in) |

## Changes and what isn't modelled
- **Side seams.** Titan's front and back legs are separate pieces, so there is an outseam;
  Vincent's leg is folded at the side. The outseam can be cut on the fold by laying the two
  pieces' outseams together, where the cloth is wide enough.
- **Feet** aren't modelled.
- **The waist** is wider than Vincent's (the knickerbockers' pull-on rule), so there's more to
  gather; a drawstring through the casing is closest to his.
- **The taper** is limited so the leg is at least the knee round at the hem, which the
  smallest children's sets need.

## Pieces
Front (cut 2), back (cut 2).

## Construction
1. Outseams and inseams, felled or turned in and stitched.
2. Crotch seam, from front waist to back waist.
3. Waist casing: turn under, then over by the casing width, stitch, leaving a gap; thread the
   elastic or drawstring.
4. Hems: turn up on the fold line.
