# Tiered skirt

**Source:** inspired by Helen Joseph-Armstrong, *Patternmaking for Fashion Design*, 5th ed. (Pearson,
2010), the maintainer's own copy; not in the repository. In copyright: only its methods and
proportions are used. This text and the pattern are our own.

**Block:** none in use: FreeSewing's Sarah is named only so the design has the waist, seat and
lengths; the tiers are `polygon` pieces (`lib/flat.mjs`), the waistband and placket strips.

**Threadloop:** "tiered skirt" finds 55 free patterns (2026-11-15), among them Kokka Fabrics'
Tiered Skirt, I Can Sew This's Tiered Ruffle Skirt and Sewing Therapy's Fuller Tiered Skirt; a
tiered skirt is a common free project. This one adds our sizes, children's included, and printed
pieces from the wearer's measurements.

**Status:** draft. Not sewn.

## What we took
The proportions of four attached tiers, each a little deeper than the one above and up to twice as
wide.

## How it maps onto the block
| Feature | Here (option default) |
|---|---|
| Length | `skirtLength` 72.5% of waist to floor |
| Tier depths | `tierGrowth` 112%: each tier 12% deeper than the one above, the four adding up to the length |
| First tier | `firstTier` 150% of the waist, never less than 105% of the seat |
| Later tiers | `tierFullness` 200% of the tier above |
| Back waist | `backWaistDrop` 5% of waist to seat, straight to the side seam |
| Opening | A placket at the left side seam, `placketLength` 90% of waist to seat; it runs into the second tier's side seam when the first is shallower, never past the second |
| Waistband | `waistbandHeight` 3% of waist to floor, with an underlap |

## Changes and what isn't modelled
- **Widths come from the body, not the fabric.** Join fabric widths across a tier as the cutting needs;
  the pattern gives each tier's quarter on the fold.
- **No skirt foundation:** the first tier is gathered straight into the waistband.
- **A side placket** is the opening, as on the gathered skirt.
- **The back drop** runs straight to the side seam, not in a curve.
- Separate tiers on an underskirt and flared tiers aren't modelled.

## Pieces
First tier front and back (each on the fold), second, third and fourth tiers (each on the fold,
cut twice), waistband (folded), placket strip.

## Construction
1. Each tier's side seams; the first tier's left one to the placket's notch (or the second
   tier's, where the notch is on it).
2. Gather each tier's top between its GM marks and sew it to the tier above, quarter to quarter.
3. Placket: the strip down both edges of the opening.
4. Gather the first tier into the waistband, its underlap at the placket.
5. Hem the fourth tier; button and hole (or hook) at the waistband.
