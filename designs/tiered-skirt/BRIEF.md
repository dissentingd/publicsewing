# Tiered skirt

**Source:** Helen Joseph-Armstrong, *Patternmaking for Fashion Design*, 5th ed. (Pearson, 2010;
international edition 2014), the maintainer's own copy; not in the repository. Chapter 13, "Tiers": attached tiers, Design 2, book pp. 315–316 (PDF pp. 322–323;
PDF = book + 7, checked on p. 316). Still in copyright: only its proportions and construction are
used here, as design references, in our own words; no text or figure is reproduced. Lengths below
are the book's inches.

**Block:** none in use: FreeSewing's Sarah is named only so the design has the waist, seat and
lengths; the tiers are `polygon` pieces (`lib/flat.mjs`), the waistband and placket strips.

**Threadloop:** "tiered skirt" finds 55 free patterns (2026-11-15), among them Kokka Fabrics'
Tiered Skirt, I Can Sew This's Tiered Ruffle Skirt and Sewing Therapy's Fuller Tiered Skirt; a
tiered skirt is a common free project. This one adds our sizes, children's included, and printed
pieces from the wearer's measurements.

**Status:** draft. Not sewn.

## What the source shows
Read from the text and checked against the page's figures (PDF p. 323):
- **Tiers:** four, plotted on the basic skirt, 29 in long in all: 6¼, 6¾, 7¼ and 8¾ in.
- **Widths, by fabric width** (36–45 in): the first tier one width, the second two, the third
  four, the fourth eight. The general rule (book p. 315): the first tier 1 to 1½ widths, each
  later one 1½ to 2 times the one above; add half a width or more for more fullness.
- **First tier:** one width divided into quarters, marked CB, side seam, CF, side seam, CB; the
  back waist lowered ⅜ in at CB, blending to the side seam.
- **Waist and opening:** a waistband and zip, from the chapter's earlier waistband and zip
  sections (not read for this design).

What's ours: every width as a proportion of the body, since the book's widths depend on the
fabric and its standard figure; the tier depths as a growth rate; the opening.

## How it maps onto the block
| Feature | Joseph-Armstrong | Here (option default) |
|---|---|---|
| Length | 29 in | `skirtLength` 70% of waist to floor (29 in at a 41.3 in waist to floor) |
| Tier depths | 6¼, 6¾, 7¼, 8¾ in | `tierGrowth` 112%: each tier 12% deeper than the one above, the four adding up to the length (6.1, 6.8, 7.6, 8.5 in at 29 in) |
| First tier | One 36–45 in width | `firstTier` 150% of the waist, never less than 105% of the seat |
| Later tiers | 2, 4, 8 widths | `tierFullness` 200% of the tier above (book range 150–200%) |
| Back waist | ⅜ in lower at CB | `backWaistDrop` 5% of waist to seat (⅜ in at about 8 in), straight to the side seam |
| Opening | Waistband and zip | A placket at the left side seam, `placketLength` 90% of waist to seat; it runs into the second tier's side seam when the first is shallower, never past the second |
| Waistband | The chapter's basic waistband | `waistbandHeight` 3% of waist to floor, with an underlap |

## Changes and what isn't modelled
- **Widths from the body, not the fabric.** Join fabric widths across a tier as the cutting needs;
  the pattern gives each tier's quarter on the fold.
- **No skirt foundation:** the book plots the tiers on its darted basic skirt; here the first
  tier is gathered straight into the waistband, as the tiers' straight panels already are.
- **A side placket** in place of the waistband zip, as on the gathered skirt.
- **The back drop** blends straight to the side seam, not in a curve.
- Joseph-Armstrong's separated tiers on an underskirt (Designs 4–6) and flared tiers aren't modelled.

## Pieces
First tier front and back (each on the fold), second, third and fourth tiers (each on the fold,
cut twice), waistband (folded), placket strip.

## Construction
1. Each tier's side seams; the first tier's left one to the placket's notch (or the second
   tier's, where the notch is on it).
2. Gather each tier's top between its marks and sew it to the tier above, quarter to quarter.
3. Placket: the strip down both edges of the opening.
4. Gather the first tier into the waistband, its underlap at the placket.
5. Hem the fourth tier; button and hole (or hook) at the waistband.
