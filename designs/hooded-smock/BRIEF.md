# Hooded smock

**Source:** the **US tactical smock**, as digitised by **Open+Pattern** (openpattern.io): "US
Tactical Smock", 2023-12-23, graded XS–XXL, CLO3D export. Licence **CC BY 4.0**: credit
Open+Pattern. Held as corpus folder `openpattern/us-tactical-smock/` (DXF-AAMA, PDF, renders;
not tracked). Read with `node tools/dxf-aama.mjs` (net outlines; sizes below in cm, size M).

**Block:** FreeSewing's Brian, through the yoke template (`extends: ../templates/yoke.yaml`,
`lib/yoke.mjs`): a front yoke, the body below it, a placket slit at the front, sleeves into bands;
the hood is the windbreaker's (`lib/hood.mjs`), the pockets `polygon` pieces. Drafted from the
wearer's measurements: the source's M is a design reference, scaled by the chest (M on
FreeSewing's `cisMaleAdult38`, chest 100).

**Status:** draft. Not sewn.

## What the source shows
Size M, 27 pieces:
- **Body:** a back in one (68.2 × 80.6) and a front below a yoke (68.0 × 55.0); the front yoke in
  two top panels (23.0 × 25.2 each, with facings), a zip or button placket between them (20 cm).
- **Hood:** three pieces, a CB panel (13.8 × 42.0) between two side panels (22.2 × 52.5), lined.
- **Pockets:** a chest bag (30 × 22) under a flap (26 × 6) at the yoke seam; a kangaroo pocket low
  on the front (44.6 × 24.5), open at its slanted sides.
- **Sleeves:** wide, dropped (54.7 × 59.3).
- **Button tabs** (7 × 5) and hook-and-loop strips (12 × 2) at the neck.

## How it maps onto the block
| Feature | Source (M) | Here (option default) |
|---|---|---|
| Fit | 68 cm across back and front on chest 100 | `chestEase` 34% |
| Length | Back 80.6 | `skirtLength` 30% of waist to floor below the waist |
| Front yoke | 25 cm deep | `frontYoke` on, `yokeDepth` 85% of neck point to chest line |
| Placket | 20 cm | `opening` front, `placketDepth` 43% of HPS to waist, `buttons` 2 |
| Hood | Three pieces, drawstring | The windbreaker's two-piece hood (`hoodHeight` 75%, `hoodDepth` 46% of the head), `hoodDrawstring` |
| Chest pocket | 30 × 22, flap 26 × 6 | `chestPocket`: 30 × 22% of the chest, flap 26 × 6% |
| Kangaroo pocket | 44.6 × 24.5 | `kangarooPocket`: 44.6 × 24.5% of the chest, the top 10% in from each side |
| Sleeves | Wide | The yoke sleeve into a band, `sleeveBandEase` 45% |

## Changes and what isn't modelled
- **A back yoke too**: the yoke template cuts the back at the same level as the front, flat
  (`gathers` 100%); the source's back is one piece. Cut the back yoke and body as one by
  overlapping their seam if wanted.
- **A two-piece hood**, not three, unlined.
- **Buttons, not a zip or hook and loop**, at the placket; no button tabs.
- **The chest pocket's place** is the yoke seam (the flap is sewn into it); it isn't marked.

## Pieces
Front body (on the fold), back body (on the fold), front and back yokes, sleeves, sleeve bands,
placket, hood (cut 2), chest pocket bag, chest flap (cut 2), kangaroo pocket.

## Construction
1. Kangaroo pocket: hem the slanted openings, press the edges under, topstitch on its mark.
2. Chest pocket: hem its top; baste it and the made-up flap into the front yoke seam; yokes to the
   bodies; shoulder seams.
3. Placket at the front slit; buttons and holes.
4. Hood: CB seam, drawstring casing at the face; sew to the neckline between the placket's edges,
   binding the seam inside.
5. Sleeves set in; underarm and side seams; bands; hem.
