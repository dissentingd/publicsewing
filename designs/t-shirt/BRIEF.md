# T-shirt

**Source:** Open+Pattern (openpattern.io), *Standard T-shirt*, 2023-12-13, CLO3D/AAMA DXF,
sample size M, grade rule `Normal_Tee`, held as `openpattern/standard-tshirt`. Licensed CC BY 4.0;
credit Open+Pattern. The source includes XS–XXL graded pattern outlines and a standard crew-neck
T-shirt illustration. No body-measurement chart accompanies the DXF.

**Block:** FreeSewing's Brian, through the shared coat body and fitted sleeve operations. The
source is used for style and proportions; Brian drafts the shape from the wearer's measurements.

**Status:** draft. Not sewn.

## What the source shows

A plain short-sleeved crew-neck T-shirt with separate front and back, a sleeve for each side, a
15 mm-wide collar band and a narrow back-neck tape. There are no pockets, closures, cuffs or
other details. At size M the DXF reports a front outline 530.5 mm wide by 719.9 mm high, a back
outline 530.7 mm wide by 738.9 mm high, a sleeve outline 394.5 by 232.2 mm, and a collar band
413.5 by 15.0 mm. These are bounding-box dimensions, not seam measurements. The pattern is
graded from XS through XXL.

## How it maps onto the block

| Feature | Source | Here (option default) |
|---|---|---|
| Body fit | M garment width is about 1,061 mm across front and back; no body chart is supplied | `chestEase` 6% and `seatEase` 6%; assumes M is near a 1,000 mm chest/seat |
| Length | M front outline height 720 mm; back 739 mm | Hem at the seat line (`lengthBelowWaist` 100% of waist to seat) |
| Sleeve | M sleeve outline is about 232 mm high | `sleeveLengthBonus` −60% of shoulder to wrist; intended to land near the upper arm |
| Neck band | M collar piece is 15 mm wide | `collarWidth` 4% of neck; no collar spring by default |

## Changes and what isn't modelled

- The source does not state the body measurements behind its M size. The 100 cm chest/seat
  reference is an assumption for translating its finished width to Brian; the ease defaults
  should be treated as a starting point and adjusted for the wearer's fabric and fit preference.
- The source's XS–XXL grade rules are not reproduced. This design uses Brian's measurement-driven
  geometry, including for children and sizes outside that range.
- The back-neck tape is omitted. The collar is generated as a shaped band from the measured
  neckline; its length must be checked in a sewn muslin, especially for stretch fabric.
- The source is a knit T-shirt. Use a suitable knit; this draft does not model fabric stretch or
  recovery.

## Pieces

Back (on the fold), front (cut as a pair), two short sleeves and a crew-neck band.

## Construction

1. Sew shoulder seams and join the front and back at the shoulders.
2. Sew the collar band into a ring, quarter it, and attach it evenly to the neckline.
3. Set in the sleeves, then sew each underarm and side seam in one pass.
4. Hem sleeve ends and body.
