# Raincoat

**Source:** Simons, *Designing Boys' and Juveniles' Clothing* (1922), corpus `designingboysjuv00simo`. "Raincoat", Diagram 36, pp. 105-107 (PDF pp. 111-113). The
book's contents page lists it at p. 118, which is wrong. US 1922, public domain. Size 12, in inches: breast 29, length 40, waist length 14¾.

**Block:** FreeSewing's Brian, through the overcoat (`extends`). No library changes: the stand and leaf are two `collar` pieces, as on the dress shirt. Drafted from
the wearer's measurements, so it fits men too.

**Status:** draft. Not sewn.

**Threadloop:** 10 free results for "raincoat" (2026-11-03), including coats from Modern Sewing Patterns and Bernina. Their listings don't say any is drafted from measurements.

## What the source shows
"This diagram is drafted three sizes larger than the regular breast measure. It is made to button up to the neck with a two piece collar."
- **Body:** a back and a forepart; the side seams leave the armhole at R and cross, so at the hem the forepart's reaches about 5½ in past S (to Z) and the back's about 2½ in the other way (to T). Those two are read from the plate.
- **Length:** 40 in; a slightly slanted CB (H, 1¼ in); a front 1¼ in lower at the hem (14 from 7).
- **Front:** a lap of 2¼ in (4 to 5); buttons as dots on CF, up to the neck.
- **Collar, "drafted in two parts":** a stand (15 to 17, 1½ in) and a leaf (17 to 18, 2¼ in).
- **Pockets:** a slanted mouth with a welt, from the waist line, and a large bag, drawn but not described.
- **Not given:** sleeve, lining, vent. "Shape the armhole, shoulder, neck and front as illustrated."

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Ease | Three sizes up | `chestEase` 26.5%: the overcoat's two sizes are 24%, the balmacaan's four 29% |
| Length | 25¼ in below the waist | `lengthBelowWaist` 315% of waist to seat (of the USDA boy C12's 8) |
| Sweep | 5½ and 2½ in at each side seam | `hemFlare` 12% of the seat at each edge: their mean, 4 of 33 |
| Front drop | 1¼ in | `frontDrop` 15% of waist to seat |
| Lap | 2¼ in on 29 | `buttonExtension` 7.8% of the chest |
| Buttons | Four, to the neck | `buttons` 4, `buttonTop` -210% of the lap, `buttonBottom` 75% of waist to seat (6 of 8) |
| Stand, leaf | 1½ in, 2¼ in | `standHeight` 10%, `collarWidth` 15%, `collarPoint` 5% of the neck |
| Pocket | Slanted, as drawn | `handPockets` on: `handPocketAt` 57%, `handPocketLength` 54%, `handPocketLean` 40%, `handPocketTop` 0 |
| Sleeve, vent, lining | Not given | The overcoat's sleeve; no vent, no lining |

## Pieces
Front, back on the fold, facing, sleeve, collar stand, collar leaf, and each pocket's welt and bag.

## Construction
As the overcoat, unlined. Sew the leaf to the stand's top edge, then the stand round the neckline to the front edges. For a rainproof cloth, tape or fell the seams; Simons doesn't say.

## Changes and what isn't modelled
- **The sweep starts lower.** Simons' seams run straight from the armhole, so the coat widens all the way down. The coat family flares from the seat line, so this one is straighter to the hips and then widens to about the same hem.
- **The two sides' flare is equal,** not 5½ and 2½ in, and the panels don't cross on the pattern. The hem's total width is what's kept.
- **The back is cut on the fold,** without Simons' slight CB slant.
- **A very full coat on a stout figure:** the flare scales with the seat. Reduce `hemFlare` if it's more cloth than wanted.
