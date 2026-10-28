# Field trousers

**Source:** the British Army **CS95 Field Combat Trouser**, as digitised by **Open+Pattern**
(openpattern.io): "British Army CS95 Field Trouser", 2024-09-16, size M, CLO3D export. Licence
**CC BY 4.0**: credit Open+Pattern. Held as corpus folder `openpattern/cs95-trouser/` (DXF-AAMA,
PDF, renders; not tracked). Read with `node tools/dxf-aama.mjs` (net outlines; sizes below in
cm, size M).

**Block:** FreeSewing's Titan, through ЕМКО's trousers (`extends: ../trousers/spec.yaml`,
`lib/trousers.mjs`): their legs, back dart, fly, side pockets, waistband and loops; the front
pleats as the peg-top pants'. Drafted from the wearer's measurements: the source's sizes are a
design reference, scaled by the seat (M on FreeSewing's `cisMaleAdult38`, seat 102).

**Status:** draft. Not sewn.

## What the source shows
47 pieces in size M:
- **Front** (29.4 × 121.1): two pleats at the waist, a button fly (fly extension 28.3, facing
  24.1), slant top pockets (top and middle pocket bags, pocket bearers).
- **Back** in three: upper (27.5 × 20.3, a yoke at the waist), middle (49.1 × 35.9, the seat,
  cut on a slant) and lower (35.5 × 84.2, the leg).
- **Cargo pockets** on both thighs: the bag 27 × 35 (a 19 cm face with bellows), a flap 19 × 8
  and its facing, buttoned through a buttonhole stand.
- **Seat pocket** on the right back: patch 15 × 19, flap 15 × 6 and facing.
- **Waistband** 4 cm, inside waistband with elastic sections (15 × 4) and buttonhole stands at
  the sides: adjusters.
- **Belt loops**: six, 10 and 13 cm.

## How it maps onto the block
| Feature | CS95 (M) | Here (option default) |
|---|---|---|
| Fit | Loose, straight | `seatEase` 12%, `kneeEase` 40%, `hemWidth` 95% |
| Pleats | Two each front | `pleats` 2, `frontDart` 45% of half the seat less half the waist, `pleatSpacing` 3% of the seat |
| Cargo pockets | 19 cm face, 27 cm bag, flap 19 × 8 | `cargoWidth` 19% of the seat, `bellows` 4% each side, `cargoDepth` 24%; flap 8% of the seat deep, buttoned |
| Seat pocket | 15 × 19, flap 15 × 6 | 15 × 19% of the seat, flap 6%, on one back |
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
1. Pockets: make the cargo pockets (hem the top, fold the bellows, press the edges under) and
   topstitch them on the thigh marks; flaps sewn, turned and topstitched above them; seat pocket
   and flap the same on the right back.
2. Pleats basted at the waist; fly; side pockets; back dart.
3. Outseams, inseams, crotch seam; waistband and loops; hems.
