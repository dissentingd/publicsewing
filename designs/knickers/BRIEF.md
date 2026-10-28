# Knickers

**Source:** Simons, *Designing Boys' and Juveniles' Clothing* (1922), corpus
`designingboysjuv00simo` (laptop). "Boys' Knickerbockers", Diagram 41, pp. 117–119. US 1922,
public domain. Size 6: waist 24, seat 26, rise 6, knee 11½, below knee 10 (inches).

**Block:** FreeSewing's Titan, through ЕМКО's trousers (`extends: ../trousers/spec.yaml`), the
leg run 4 in below the knee with `trouserLeg`'s breeches mode, its side seam open at the bottom.

**Status:** draft. Not sewn.

## What the source shows
"Drafted somewhat similar to… boys' knee pants… made fuller and longer": the drop 4 in below the
knee (D to E); the bottom 14 round, "4 inches… for fullness to be left in at the strap"; the
strap 10 in long, ¾ in wide, with a 3 in tongue to buckle or button.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Length | 4 in below the knee | `knickerDrop` 33% of knee to floor below the knee |
| Fullness | 14 round the bottom on an 11½ knee | `knickerFullness` 122% of the knee, `kneeEase` 30% |
| Strap | 10 × ¾ in, 3 in tongue | Strap 87% of the knee plus a 26% tongue, 6.5% of the knee wide |
| Opening | (for the strap) | The side seam open the last quarter-knee, notched |

## Changes and what isn't modelled
- The trousers' waist, fly and pockets.
- The gathers are marked along the bottom; the slit is hemmed, not faced.

## Pieces, construction
As the trousers, plus the strap (cut 2, folded). Gather the bottom into the strap, buckle or
button at the slit.
