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
| Sash (strap pinafore, p. 248) | a waistband 16 × 2 over the front's gathers, two sash ends 20 × 2 tied at the back (child of 2, chest about 21) | `sash` off; on: a waistband `sashBand` 76% of the chest long and two ties `sashLength` 95%, both `sashWidth` 9.5% of the chest wide, cut on the fold |

## Changes and open points
- **Shoulder straps:** the strap pinafore's neckbands and straps (front band 10½ × 3½, back
  bands, straps 6 × 3½) are one piece here, the yoke: at its shallowest (`yokeDepth` 20%) it is
  a band round the neck and over the shoulders. Walker's bodies are rectangles gathered into
  the bands; ours are Brian's front and back, gathered the same way.
- **The sash** (2026-11-01) is sewn over the front at the waist; no line is marked on the
  front body for it.
- **Ages 4 and up.** The infant pinafores are below the USDA sizes.

## Checks
As the smock (test/pinafore.test.mjs), with a `sash` variant.
