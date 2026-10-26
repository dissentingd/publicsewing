# Frock: brief

**Status: draft.** Not sewn.

## Source
Walker, *Manual of Needlework and Cutting Out* (1909), corpus `krl00366374`:
- "Frock Bodice for Child of 2 Years", Cutting-out Diagrams No. 16, PDF p. 261 (book p.
  243): half front, half back, upper and under sleeve;
- "Low-necked Bodice ... Skirt 27 × 36", No. 25, PDF p. 270 (book p. 252): a bodice, and a
  skirt "pleated" or gathered on.

A simple dress for any size: a bodice to the waist, a gathered skirt, short sleeves, back
buttons.

## Defaults (on lib/yoke.mjs with `yokeAt: waist`)
| What | Walker | Ours |
|---|---|---|
| Bodice | to the waist, close | `yokeAt` waist, `chestEase` 12% |
| Skirt | 27" × 36" breadths gathered on | `gathers` 180% of the bodice's waist, `hemFlare` 4% |
| Length | about the knee | `skirtLength` 45% of waist-to-floor |
| Sleeves | short (upper and under) | `sleeves` short, band 25% easy round the arm |
| Opening | back | `opening` back, `buttons` 4 |

## Changes
- **One-piece sleeve.** Walker's is two-piece.
- **No tucks.**
- **Ages 4 and up.** The USDA sizes start at about age 4, so the "child of 2" isn't covered.

## Checks
As the smock (test/frock.test.mjs).
