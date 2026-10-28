# Jumpsuit

**Source:** Thayaht (Ernesto Michahelles), the *TuTa* (Florence, 1920), as digitised by
**Open+Pattern** (openpattern.io): "TuTa Boiler Suit", 2024-11-10, size M, CLO3D export.
Licence **CC BY 4.0**: credit Open+Pattern. Held as corpus folder `openpattern/tuta-jumpsuit/`
(DXF-AAMA, PDF, renders; not tracked). Read with `node tools/dxf-aama.mjs` (net outlines, so
the numbers below are sewn sizes, in cm).

**Block:** none. The TuTa's point is that it's cut from straight-edged shapes with almost no
waste, so every piece here is a rectangle, square, triangle or diamond sized from the wearer's
measurements (`lib/flat.mjs`, Dave's choice 2026-10-27). The defaults reproduce the source's M on
FreeSewing's `cisMaleAdult38` (chest 100, seat 102, biceps 35, neck 38).

**Status:** draft. Not sewn.

## What the source shows
Thirteen pieces, all straight lines:
- **Body**, one piece 123.7 × 158.5, wrapped round the figure: left front, back, right front,
  side by side, the top edge being the shoulder seams and the neck. The two fronts are 28.6 wide
  from CF, the back 60.5; the CF edges have a 2 cm stand down the 56.4 cm opening. No side seams.
- **Armholes:** two slits 32 deep from the top edge, at the fronts' side edges (a 1 cm gap).
- **Legs:** a V slit up the centre back, 15.7 wide each side at the hem, its point 89.4 below the
  shoulder line; each leg's slit edge sews to its CF edge as the inseam, and the CFs above sew
  together as the front crotch seam up to the opening.
- **Sleeves:** rectangles 40 × 60, fold lines at 5 and 10.2 from the hem (a turned cuff).
- **Underarm gussets:** 12 cm squares. The armhole (2 × 32 = 64) is the sleeve top (40) plus two
  sides of the gusset (24).
- **Crotch gusset:** a flat triangle 43.5 × 10.4 (sides 24, 24), notched at the middle of the
  long side.
- **Pockets:** two breast pockets 14 × 16, 2 cm from CF and 15.5 below the shoulder line; two
  lower pockets 20 wide, 27.2 deep at the CF side and 19.1 at the outer side (the mouth slopes
  down to the side), 9 cm from CF, their top 43.6 below the shoulder line.
- **Front facings:** L-shaped strips 4 wide by 56.4, with an 11–13 cm tab at the top; a **collar
  band** 25.5 × 5.
- **Buttons:** six, on CF, buttonholes on the wearer's left front.
- **Hems:** 5 cm on the legs.

## How it maps onto measurements
| Feature | Source (M) | Here (option default) |
|---|---|---|
| Round the body | 117.7 CF to CF, no shaping | `bodyEase` 15% over the chest or seat, whichever is larger; fronts a quarter each, back half |
| Length | 153.5 shoulder line to hem | `totalLength` 94% of HPS to waist plus waist to floor |
| Leg slit point | 89.4 below the shoulder line | `crotchDrop` 10% over HPS to waist plus waist to upper leg |
| Leg slit width at the hem | 15.7 each side | `legTaper` 27% of half the body |
| Sleeve | 40 round | `bicepsEase` 14% |
| Sleeve length | 55 to the hem | Shoulder to wrist, less how far the body's shoulder line drops past the shoulder (a quarter of the body less half the shoulder width); `sleeveLengthBonus` 0% |
| Underarm gusset | 12 square | `armGusset` 34% of the biceps; the armhole slit is then half of the sleeve's width plus two gusset sides |
| Crotch gusset | Triangle 43.5 × 10.4 | A diamond, side `crotchGusset` 12% of the seat, its short diagonal 0.87 of the side (see below) |
| Neck | Straight, front 6 and back 7.8 each side of CF/CB | `neckWidth` 20% of the neck each side of CF and CB, the front curved down `frontNeckDepth` 22% of the neck (see below) |
| Opening | 56.4 from the shoulder line | `placketDepth` 120% of HPS to waist |
| Button stand | 2 | `buttonExtension` 2% of the chest |
| Buttons | 6 | `buttons` 6, evenly down the opening |
| Collar band | 5 high | `bandHeight` 13% of the neck, cut double and folded |
| Facings | 4 wide | `facingWidth` 4% of the chest |
| Breast pockets | 14 × 16, 2 from CF, 15.5 down | 14% × 16% of the chest, 2% of the chest from CF, 33% of HPS to waist down (`breastPockets`) |
| Lower pockets | 20 × 27.2, slope 8, 9 from CF, 43.6 down | 19% × 26% of the seat, slope 8%, 8% from CF, 93% of HPS to waist down (`lowerPockets`) |
| Hem | 5 | `hemDepth` 4.3% of waist to floor, legs and sleeves |

## Departures from the source
- **The neck is curved at the front.** The source's neck is a straight gap in the shoulder line,
  about 28 cm round, worn open. Ours buttons closed: the front neck is a quarter ellipse
  (`frontNeckDepth`), wider each side (`neckWidth`), so the neckline is about 6% over the neck
  measurement and the collar band matches it. The back neck stays straight.
- **Fronts and back are equal quarters and halves.** The source's fronts are about 1.6 cm
  narrower than half the back, balancing its narrower front neck; with equal neck widths the
  shoulder seams match without it.
- **Crotch gusset.** How the source's flat triangle sets in isn't recorded. Read as half a
  diamond cut on the fold (its notch the fold's middle), it's a diamond of 24 cm sides. Ours is
  a diamond with its front corner at the CF crotch point, its back corner at the slit's point,
  and each side sewn to the top of an inseam edge, smaller (`crotchGusset`, 12 cm sides at M).
- **The armhole slits are slashed**, cut down a single line to the point, with the source's 1 cm
  gap kept as the sewn edges (5 mm each side at the top, tapering to nothing).
- **The facings are straight strips** (the source's have a tab at the neck, which the collar
  band covers here). **The sleeve has one hem fold**, not a turned cuff.
- The source's slit point is a body's crotch-to-shoulder plus 10%: the crotch hangs low, as the
  TuTa's does. `crotchDrop` 0 brings it up to the body's own.

## Pieces
1. Body: cut 1.
2. Sleeve: cut 2.
3. Underarm gusset: cut 2.
4. Crotch gusset: cut 1.
5. Front facing: cut 2.
6. Collar band: cut 1, folded lengthwise.
7. Breast pocket: cut 2 (if `breastPockets`).
8. Lower pocket: cut 2 (if `lowerPockets`).

## Construction
1. Pockets: turn and stitch each mouth, press the other edges under, and topstitch the pockets
   on their marks.
2. Facings: sew one to each front edge down the opening, turn and press.
3. Shoulders: sew each front's top edge to the back's, from the armhole slash to the neck notch.
4. Collar band: sew to the neckline from stand edge to stand edge (notches at CF and CB), fold,
   and close its ends.
5. Sleeves: sew each underarm seam from the hem to the gusset notch, then set two adjacent sides
   of an underarm gusset into its open end.
6. Armholes: sew the sleeve's top to the slash edges above the gusset notches (its centre notch
   at the shoulder seam), and the gusset's other two sides to the slash edges below, its corner
   at the slash's point.
7. Legs: sew each inseam, slit edge to CF edge, from the hem to the inseam notch.
8. Crotch gusset: front corner at the CF crotch notches, back corner at the slit's point, its
   four sides to the tops of the inseam edges.
9. Front crotch seam: CF to CF from the crotch notch to the bottom of the opening; lap the left
   stand over the right and stitch across.
10. Buttonholes on the left front and the band, buttons on the right; hem the legs and sleeves.
