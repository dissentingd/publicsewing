# Pinafore: brief

**Status: draft.** Not sewn.

## Source
Walker, *Manual of Needlework and Cutting Out* (1909), corpus `krl00366374`:
- "Pinafores for Infants up to 2 Years" (Nos. I–IV), PDF p. 246 (book p. 228);
- "Pinafores for Standards I. and II. Children", PDF p. 247;
- "Pinafore with Shoulder Straps for Child of 2 Years" (front 19 × 24 and back 19 × 22,
  gathered into bands), PDF p. 248.

A sleeveless over-dress, its body gathered into narrow yokes or bands, open at the back.

## Defaults (on lib/yoke.mjs)
| What | Walker | Ours |
|---|---|---|
| Sleeves | none (armholes) | `sleeves` none; the armholes are bound |
| Ease | worn over a frock | `chestEase` 22% |
| Yoke | narrow bands or a shallow yoke | `yokeDepth` 30% |
| Fullness | gathered | `gathers` 170% |
| Length | to the knee | `skirtLength` 47% |
| Opening | back | `opening` back, `placketDepth` 60%, `buttons` 2 |

## Changes and open points
- **No shoulder straps or sash.** The strap pinafore's straps and sash aren't drafted. The
  yoke version covers the same use.
- **Ages 4 and up.** The infant pinafores are below the USDA sizes.

## Checks
As the smock (test/pinafore.test.mjs).
