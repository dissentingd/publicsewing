# Riding frock coat

**Source:** Merz, *Practical Cutting System for Ladies' Jackets and Cloaks* (1911), Diagram XIV,
"Riding Frock Coat", printed pp. 38–39 (text PDF p. 40, plate PDF p. 41), `merzspracticalcu00merz`.
US 1911, public domain.

**Block:** extends `fitted-jacket` (Breanna, `lib/jacket.mjs`), with `jacketLayout`'s `waistSeam`: every
panel but the back stops at the waist, and a one-piece skirt is laid out from the panels' waists.

**Threadloop:** no free riding coat or frock coat ("frock coat" finds only dresses). Nothing listed is
this garment or says it's drafted from measurements.

**Status:** draft. Not sewn.

## What the source shows
- **Length:** 36 in, R to 44; "the draft is the same for longer or shorter length".
- **Upper coat:** drawn as Diagram IV. The back opens opposite J, the "skirt seam effect", a little
  below the short waist line.
- **Opening:** M to d, 4 in below the level waist.
- **Lapels:** ¾ in out from M to 43 and from d to 48, as wide as from CF to the first dart, folded back
  on the line 49 to 51.
- **Skirt:** drafted on its own. It is swept from pivot 6 through the waist, the hip line and the hem,
  with the hip measured as 20 in plus ½ in ease on the half.
- **Plate (p. 41):** a long back seam curving into the armhole, a broad swept hem, a turned lapel.
- **Not given:** the hem's sweep as a number, sleeve, collar, pockets, buttons.

## How it maps onto the block
Reference size `cisFemaleAdult36`.

| Feature | Merz | Here (option default) |
|---|---|---|
| Length | 36 in overall | `lengthBelowWaist` 48% of waist to floor, about 20 in below the waist |
| Hip ease | ½ in on a 20 in half hip | `seatEase` 2.5% of the seat |
| Lapel extension | ¾ in | `buttonExtension`, `lapWaist`, `lapHip` 2.1% of the chest (¾ in at 36 in) |
| Skirt sweep | Broad, not numbered | `skirtSpread` 7% of the chest per skirt division, from the plate |
| Break | 4 in below the level waist (text) | `breakBelowBust` 11.4% of HPS to waist front, where the plate draws it, above the waist |
| Back seam | Curving into the armhole | `backSeamRise` 55%, `backSeamChest` 200%: ours |
| Back pleat, vent, CB shaping | None drawn | 0 |
| Collar | Not given | The parent's: `collarWidth` 20% of the neck, `collarSpring` 14%, `collarPoint` 5% |
| Pockets | None drawn | Off |

**Variant:** `fuller` (Fuller skirt): `skirtSpread` 11%. Ours.

## Changes and what isn't modelled
- **The break follows the plate, not the text:** the text puts the opening 4 in below the waist, but the
  plate draws the lapel's break above it.
- **The back is cut in pairs,** because the shared waist-skirt construction has a CB seam; Merz puts
  it on the fold.
- **The back's opening at the waist is left out.**
- **Sleeve and collar** are the fitted jacket's: Merz gives neither here.
- **The upper panels** are the parent's divisions, an approximation of the plate's.
- No pockets or pleats.

## Pieces
Front, side front, under-arm, side back and back (each cut 2), skirt (cut 2), facing, back neck facing,
collar, top and under sleeves; front, back and skirt lining.

## Construction
1. Sew the upper panels.
2. Join the skirt to the upper coat at the waist, matching the division marks.
3. Shoulders; collar and facings, the lapels turned back on the roll line.
4. Make and set the two-piece sleeves; line the coat and skirt.
5. Hem, buttonholes and buttons.
