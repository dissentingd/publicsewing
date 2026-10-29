# Culottes

**Source:** Esther Pivnick, *How to Design Beautiful Clothes* (1949), corpus
`pivnickdesignclothes1949` (laptop, Cloudbox). Chapter XVIII, "Divided Skirt", pp. 248–252,
Figures 1–8. US 1949, copyright not renewed: public domain. Inches are Pivnick's.

**Block:** FreeSewing's Sarah, through the two-piece skirt (`extends:
../two-piece-skirt/spec.yaml`, `lib/skirt.mjs`): its three-gore layout gives the skirt's front
and back; added for these, the `culotte` piece type, which carries each down to the crotch and
out into a crotch extension.

**Status:** draft. Not sewn.

## What the source shows
"A garment halfway between a skirt and slacks. It is a trouser which looks like a skirt, and is
based on a skirt foundation pattern."
- **Start** from the front and back skirt patterns (Chapter IV), side seams together.
- **Crotch depth** measured down the CF (A–1) and the same down the CB (H–2).
- **Front crotch:** CF moved ½ in out at the crotch line; the extension 1/16 of the hip (3–5),
  the front crotch curved from 7 to 5; the inseam squared down to the hem (5–6).
- **Back crotch:** CB moved 1 in out; the extension ⅛ of the hip (8–10), curved from 12 to 10;
  the inseam 10–11 equal to the front's.
- **Fit:** "no tightness at the crotch at all"; the skirt should "hang exactly the way any
  skirt should". Flare or a CF/CB inverted pleat hides the split.

## How it maps onto the block
| Feature | Pivnick | Here (option default) |
|---|---|---|
| Skirt | Front and back skirt foundation | The two-piece skirt's layout, `panelShare` 50% |
| Crotch depth | From the chart | The `crotchDepth` measurement, plus `crotchEase` 8% |
| Front extension | 1/16 hip | `frontExtension` 6.25% of the hips |
| Back extension | ⅛ hip | `backExtension` 12.5% of the hips |
| Flare | To hide the split | `goreFlare` 35% at the side seams |
| Length | To taste | `length` 55% of waist to floor (just below the knee) |
| Opening | Not given | The skirt's CB zip, `zipLength` 85% of waist to seat |

## Changes and what isn't modelled
- **The CF and CB aren't moved out** (½ and 1 in) at the crotch line; the extensions start
  from the skirt's own centre lines.
- **No CF or CB pleat**: the flare at the sides does the hiding.

## Pieces
Front (cut 2), back (cut 2), waistband.

## Construction
1. CB seam from the zip's notch to the crotch; zip; CF seam to the crotch.
2. Side seams; inseams in one, crotch to hem on each leg.
3. Waistband; hem.
