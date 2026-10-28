# Gathered skirt

**Source:** Walker, *Manual of Needlework and Cutting Out* (1909), corpus `krl00366374`. "Low-
necked Bodice … Skirt 27 × 36", No. 25, PDF p. 270 (book p. 252): a child's frock skirt of
straight breadths, "pleated" or gathered on to the bodice. Public domain. Inches are Walker's.

**Block:** none in use: FreeSewing's Sarah is named only so the design has the waist, seat and
lengths; the front and back are `polygon` pieces (`lib/flat.mjs`), the waistband and placket
strips.

**Status:** draft. Not sewn.

## What the source shows
Walker's frock skirt is two straight breadths, 27 in deep and 36 in round in all, gathered on to a
20 in waist: 180% of the waist. The frock design uses it under a bodice; here it's a skirt on its
own, on a waistband.

## How it maps onto the block
| Feature | Walker | Here (option default) |
|---|---|---|
| Fullness | 36 in round a 20 in waist | `gathers` 180% of the waist, never less than 110% of the seat |
| Length | The frock's, to the knee | `skirtLength` 65% of waist to floor (below the knee) |
| Opening | At the back of the bodice | A placket at the left side seam, `placketLength` 90% of waist to seat |
| Waist | Gathered to the bodice | A waistband, `waistbandHeight` 3% of waist to floor, with an underlap |

## Changes and what isn't modelled
- **A waistband and side placket** take the place of the bodice.
- **Straight breadths**, as Walker; no flare.

## Pieces
Front and back (on the fold), waistband (folded), placket strip.

## Construction
1. Side seams, the left one to the placket's notch.
2. Placket: the strip down both edges of the opening.
3. Gather the top between the gathering marks; waistband on, its underlap at the placket.
4. Hem; button and hole (or hook) at the waistband.
