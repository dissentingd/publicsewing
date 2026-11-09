# Four-gore panel skirt

**Source:** Schorr, *The Expert Designer* (1917), Diagram 65 (text PDF p. 94, plate PDF p. 95),
`expertdesignerpr00scho`. US 1917, public domain. The book's printed page numbers aren't established
for this scan.

**Block:** extends `gored-skirt` (Sarah, `lib/skirt.mjs`), with seven gores. `skirtLayout` gained
`middleShaping`, so the three middle darts needn't be equal.

**Threadloop:** "gored skirt" finds four free patterns, three of them skirts (Indygo Junction's Modern
Gored Skirt; Hot Patterns' Bossa Nova and Voodoo Chile). Nothing listed says it's drafted from measurements.

**Status:** draft. Not sewn.

## What the source shows
- **Outline:** a half skirt from CF (A) to CB (G). Points 1 and 2 are 3 in from each end along the waist;
  their hem ends, 3 and 4, are 5 in from the hem corners. Point 5 bisects 1–2, and point 6 the hip line.
- **Shapes:** the lines 1–3, 5–6 and 2–4 cut the half into **four shapes**: the front on the fold and three
  others cut twice, seven panels in all. That is what "four gore" counts.
- **Waist:** an 18 in outline taken to a 13 in half waist. The 5 in surplus is shared ½ in at the front,
  2½ in at the side and 2 in near the back.
- **Lengths:** front, side and back from the wearer. No seam allowance is included.
- **Not given:** a fixed length, waistband or closure.

## How it maps onto the block
Reference size `cisFemaleAdult36`.

| Feature | Schorr | Here (option default) |
|---|---|---|
| Panels | Four shapes, seven panels | `gores` 7 |
| Front panel | 3 in on a 20 in half hip | `panelShare` 15% of the half hip |
| Front dart | ½ in of the 5 in surplus | `panelShaping` 11.82%, 10% after the layout's seven-gore attenuation (11/13) |
| Middle darts | 2½ in at the side, 2 in near the back | `middleShaping` 40%: the back-middle takes 2 of the 5 in, and the side the 2½ left |
| CB dart | None | `cbShaping` 0 |
| Hem flare | 3 in at the waist to 5 in at the hem, 2 in out per seam edge | `goreFlare` 70% of the half hip, about 2 in at near-floor length |
| Length | From the wearer | `length` 95% of waist to floor: ours |
| Front waist | Not given | `frontWaistDrop` 8%: ours |

**Variant:** `straighter`: less hem flare. Ours.

## Changes and what isn't modelled
- **Seam allowance is added,** where Schorr's draft has none.
- **The darts follow the figure:** the source's 1 : 5 : 4 shares are applied to each wearer's own hip and
  waist difference, not to a fixed 5 in.
- **The length, front waist drop, CB zip and waistband** come from the gored skirt: Diagram 65 gives none
  of them.

## Pieces
Front panel (on the fold), three side panels (each cut 2), waistband.

## Construction
1. Sew the panel seams, leaving an opening at CB for the zip.
2. Insert the zip; join the waistband.
3. Try on, then level and finish the hem.
