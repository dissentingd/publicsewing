# Prince Albert jacket

**Source:** Mitchell, *The New "Standard" Work on Designing and Pattern-Making of Ladies'
Tailor-Made Garments* (1921), corpus `newstandardworko00mitc` (book page = PDF page − 4). "Prince
Albert" cut tight-fitted jacket p. 48 (diagram p. 49), its skirt p. 50 (diagram p. 51). US 1921,
public domain. Inches below are Mitchell's (his standard figure: bust 36, waist 26½, hips 40).

**Block:** FreeSewing's Breanna, through the fitted jacket (`extends`), and `lib/jacket.mjs`, which
gained two things for this jacket: `waistSeam` and `backArmhole`.

**Status:** draft. Not sewn.

**Threadloop:** no free equivalent by name. 3 free results for "prince albert" (2026-11-03), none of them jackets; 48 for "peplum jacket", the closest a jacket from SHOWstudio and a blazer from Sewing Lab Milano. Their listings don't say either is drafted from measurements.

## What the source shows
"A tight-fitted waist line, cut through at the waistline and the skirt part cut in one piece from
the center front to the back seam."
- **Foundation:** the tight-fitted jacket's, single dart, with the same seams (p. 48).
- **Back seam:** curves into the armhole at 29, 3 in up from the chest line. At 28, on the chest
  line, the back is twice as wide as at the waist (26). The side part follows, ¼ in in front of 28
  and 29.
- **Pleat:** 1 in at the waist and 1½ in at the bottom, from 26 and from 30 downward.
- **Vent:** at the CB from 7 downward, also 1 in at the waist and 1½ in at the bottom.
- **Lap:** 2¼ in about 2½ in below the bust line, 1½ in at the waist, 2¼ in again at the hip line:
  "a semi-double breasted effect".
- **Lapel:** "generally, although not exclusively" peaked.
- **Skirt (pp. 50–51):** the parts below the waist, traced and laid together as one piece. Spread
  them at the bottom if more flare is wanted; no amount is given.
- **No length, button positions or pockets are printed or drawn.** The diagram's length below the
  waist reads about 16 in.

## How it maps onto the block
| Feature | Mitchell | Here (option default) |
|---|---|---|
| Back seam on the armhole | 3 in above the chest line | `backSeamRise` 55% of the way from the under-arm seam's top to the shoulder point (p. 49: 3 of about 5½ in) |
| Back seam at the chest | 28 from 8 is twice 26 from 7 | `backSeamChest` 200% of the back's waist width, kept inside half the way to the armhole |
| Lap at the break | 2¼ in, 2½ in below the bust line | `buttonExtension` 6.25% of the chest (2¼ of 36); `breakBelowBust` 11.4% of `hpsToWaistFront` (2½ of 22) |
| Lap at the waist, hip | 1½ in, 2¼ in | `lapWaist` 4.2%, `lapHip` 6.25% of the chest; straight on from the hip to the hem |
| Pleat | 1 in, 1½ in | `backPleatWaist` 2.8%, `backPleatHem` 4.2% of the chest, on the back and on the skirt |
| Vent | 1 in, 1½ in | `ventWaist` 2.8%, `ventHem` 4.2% of the chest |
| Skirt length | About 16 in (read) | `lengthBelowWaist` 40% of `waistToFloor` (16 of about 40) |
| Skirt laid together | Double lines, p. 51 | Laid edge to edge as an even fan: each panel keeps its waist width and flares by the jacket's usual share, so the seat stays as drafted |
| Extra flare | "the amount necessary" | `skirtSpread` 0% by default; the `flared` variant uses 4% of the chest at each of the 3 seams, our number |
| Lapel | Peaked, generally | `lapelStyle` peak; `notch` is a variant |
| CB, under-arm panel, ease, sleeve | As the tight-fitted jacket | Inherited from `fitted-jacket` |
| Collar | Not described | The tailored jacket's "mannish" collar |
| Buttons | Not printed | 3 (inherited), on CF from the break to just above the waist seam |

## Pieces
Front, side front, under-arm panel and side back, all to the waist; the back, in one to the hem;
the skirt, in one from the front edge to the back seam; the facing, in one to the hem; back-neck
facing; collar; two-piece sleeve; lining for the front, back and skirt (side panels and sleeves are
cut in lining too).

## Construction
1. Front to side front, side back to under-arm panel, under-arm panel to side front.
2. Bodice to skirt at the waist seam, matching the skirt's seam ends to the bodice's.
3. The back seam, from the armhole down to the waist (back to side back); CB seam to the top of the vent.
4. Pleat: the back's extension and the skirt's together, pressed under, the rest of that seam
   closed to the waist. Vent extensions lapped.
5. Shoulders, collar, facings, as the tailored jacket.
6. Sleeves: the two pieces together, then set in.
7. Lining, hems, buttons.

## Changes and what isn't modelled
- **The ¼ in at 28 and 29 is left out.** Back and side back share one point on the chest line and
  one on the armhole, so the two sides of the seam can be matched to the same length. Mitchell's
  armhole is reshaped between that ¼ in and 32; ours keeps the armhole, and the sleeve that fits it.
- **Skirt's waist curve:** smoothed through the seam ends, where the bodice's is straight between
  them; the test allows 4 mm between the two.
- **Children and stout figures:** the CB and under-arm shaping scale away as on the fitted jacket,
  so their skirts are nearly straight. The vent stays, so the back is always cut in pairs.
- **Back lining:** one piece to the hem on the fold, with no vent or pleat of its own, left open
  over both when sewn. Not spelled out by the source.
- **No pockets**, as none are drawn. The bodice's seams and skirt could take them, unbuilt.
