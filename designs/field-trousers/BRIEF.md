# Field trousers

**Source:** the British Army **CS95 Field Combat Trouser**, as digitised by **Open+Pattern**
(openpattern.io): "British Army CS95 Field Trouser", 2024-09-16, size M, CLO3D export. Licence
**CC BY 4.0**: credit Open+Pattern. Held as corpus folder `openpattern/cs95-trouser/` (DXF-AAMA,
PDF, renders; not tracked). Read with `node tools/dxf-aama.mjs` (net outlines; sizes below in
cm, size M).

**Garment tradition:** British Army CS95 field uniform (United Kingdom). This identifies the
source garment, not a claim that our redraft is an official uniform pattern.

**Block:** FreeSewing's Titan, through Ð•ÐœÐšÐž's trousers (`extends: ../suit-trousers/spec.yaml`,
`lib/trousers.mjs`): their legs, back dart, fly, side pockets, waistband and loops; the front
pleats as the peg-top pants'. Drafted from the wearer's measurements: the source's sizes are a
design reference, scaled by the seat (M on FreeSewing's `cisMaleAdult38`, seat 102).

**Status:** draft. Not sewn.

## What the source shows
47 pieces in size M:
- **Front** (29.4 Ã— 121.1): two pleats at the waist, a button fly (fly extension 28.3, facing
  24.1), slant top pockets (top and middle pocket bags, pocket bearers).
- **Back** in three: upper (27.5 Ã— 20.3, a yoke at the waist), middle (49.1 Ã— 35.9, the seat,
  cut on a slant) and lower (35.5 Ã— 84.2, the leg).
- **Cargo pockets** on both thighs: the bag 27 Ã— 35 (a 19 cm face with bellows), a flap 19 Ã— 8
  and its facing, buttoned through a buttonhole stand.
- **Seat pocket** on the right back: patch 15 Ã— 19, flap 15 Ã— 6 and facing.
- **Waistband** 4 cm, inside waistband with elastic sections (15 Ã— 4) and buttonhole stands at
  the sides: adjusters.
- **Belt loops**: six, 10 and 13 cm.

## How it maps onto the block
| Feature | CS95 (M) | Here (option default) |
|---|---|---|
| Fit | Loose, straight | `seatEase` 12%, `kneeEase` 40%, `hemWidth` 95% |
| Pleats | Two each front | `pleats` 2, `frontDart` 45% of half the seat less half the waist, `pleatSpacing` 3% of the seat |
| Cargo pockets | 19 cm face, 27 cm bag, flap 19 Ã— 8 | `cargoWidth` 19% of the seat, `bellows` 4% each side, `cargoDepth` 24%; flap 8% of the seat deep, buttoned |
| Seat pocket | 15 Ã— 19, flap 15 Ã— 6 | 15 Ã— 19% of the seat, flap 6%, on one back |
| Front pockets | Slant | The trousers' on-seam side pockets |
| Back | Three pieces | The trousers' one back with its dart |
| Fly | Buttoned | The trousers' fly (sew buttons and holes instead of a zip) |
| Waistband | 4 cm, adjusters | The trousers' waistband (`waistbandHeight`), loops |

## Changes and what isn't modelled
- **One back piece**, not the source's three (the articulated seat); the back dart does the shaping.
- **On-seam side pockets**, not slant pockets.
- **No waist adjusters** (elastic and buttonhole stands inside the waistband).
- **The cargo pocket sits centred on the crease**, a little in from the side seam.

## Pieces
Front, back, waistband, fly shield and facing, belt loops, side pocket bags, cargo pockets and
flaps (flaps cut 4: two pairs), seat pocket and flap (flap cut 2).

## Construction
The following order is a proposed method for this unsewn draft.
1. CP: with cargo pockets on, hem and fold each bellows pocket, turn its edges, topstitch it to the thigh marks, and add its flap.
2. BP: with the seat pocket on, prepare its patch and flap and topstitch them at the right back mark.
3. M: form the front waist pleats and sew the back dart before closing the legs.
4. Z and SP: make the fly and side pocket bags at the front openings.
5. O, I and X: close outseams and inseams, then join the crotch seam.
6. W and H: attach the waistband and loops, then turn the leg hems.

