# Knee pants

**Source:** Simons, *Designing Boys' and Juveniles' Clothing* (1922), corpus
`designingboysjuv00simo` (laptop). "Boys' Knee Pants", Diagram 40, pp. 115–116. US 1922, public
domain. Size 6: waist 24, seat 26, rise 6, inseam 8, knee 12 (inches).

**Block:** FreeSewing's Titan, through ЕМКО's trousers (`extends: ../suit-trousers/spec.yaml`), the
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

## Construction
Proposed making-up order for this unsewn draft:

1. Sew the M front and back darts. Make the BP back welt pockets and the SP side pockets if those options are selected, closing each pocket bag.
2. Sew the O side seams below and above any side-pocket openings, then the I inseams.
3. Attach the fly facing and shield at Z, install the selected fly closure, and sew the X crotch seam from the fly to centre back.
4. Attach the belt loops and W waistband; finish the waistband ends over the fly.
5. Turn up and secure each H leg hem at the drafted knee-pants length.
