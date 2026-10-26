# Nightshirt: brief

**Status: draft.** Not sewn.

## Source
Walker, *Manual of Needlework and Cutting Out* (1909), corpus `krl00366374`, "Man's
Night-shirt", Cutting-out Diagrams No. 8–9, PDF pp. 253–254 (book pp. 235–236):
- front 47 × 34 and back 49 × 36 (half widths 17" and 18");
- sleeves 23 × 36 with wristbands;
- a yoke 22 × 4½" over the back shoulders;
- neck band and collar, and an underarm gusset;
- side seams open at the foot, with rounded corners.

The old pipeline traced these pages (`archive/data/walker/trace/p-235.yaml`, `p-236.yaml`); this
design uses them only as the reference.

## Defaults (on lib/yoke.mjs)
| What | Walker | Ours |
|---|---|---|
| Ease | half width 17" on a 34" body | `chestEase` 26% |
| Front | one piece, no yoke, placket from the neck | `frontYoke` off, `opening` front, `placketDepth` 75% of HPS-to-waist |
| Back yoke | 4½" deep | `yokeDepth` 45%, `gathers` 100% (none) |
| Length | 47" front: below the knee | `skirtLength` 62% of waist-to-floor |
| Side slits | the side seam open from 30 to the foot | `sideSlit` 30% of waist-to-hem |
| Corners | rounded (C, D) | `hemCorner` 50% of the slit |
| Neck | band | `neckFinish` band |
| Sleeves | long, wristbands | `sleeves` long, `sleeveBandEase` 15% |
| Buttons | placket | `buttons` 3 |

## Changes
- **No gusset.** FreeSewing's fitted sleeve doesn't need the underarm gusset.
- **No turn-down collar.** The band only.
- **Single yoke.** Walker's back yoke is a double layer laid over the back; ours is a seamed
  yoke.

## Checks
As the smock (test/nightshirt.test.mjs), default and a variant (front yoke, gathered back,
no slits, short sleeves, back opening).
