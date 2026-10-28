# Knee pants

**Source:** Simons, *Designing Boys' and Juveniles' Clothing* (1922), corpus
`designingboysjuv00simo` (laptop). "Boys' Knee Pants", Diagram 40, pp. 115–116. US 1922, public
domain. Size 6: waist 24, seat 26, rise 6, inseam 8, knee 12 (inches).

**Block:** FreeSewing's Titan, through ЕМКО's trousers (`extends: ../trousers/spec.yaml`), the
leg ended just below the knee with the breeches mode of `trouserLeg` (`cuffBelow`, `cuffW`).

**Status:** draft. Not sewn.

## What the source shows
Short trousers to the knee, drafted by proportion: a 1½ in waistband, the forepart ½ the knee at
the bottom (S, T a quarter each side), the back ⅝ in wider each side, a 1¼ in turn-up.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Length | Inseam 8 on size 6, to the knee | `kneePantsLength` 4% of knee to floor below the knee |
| Bottom | ½ knee + ⅝ in each side of the back (14½ on 12) | `legBottom` 120% of the knee, `kneeEase` 20% |
| Waist, fly, pockets | Waistband | The trousers' |

## Changes and what isn't modelled
- The trousers' darts, fly and pockets; Simons' Vees and pocket details aren't read.

## Pieces, construction
As the trousers; the bottom turned up.
