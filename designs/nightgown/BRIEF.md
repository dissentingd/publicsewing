# Nightgown: brief

**Status: draft.** Not sewn.

## Source
Walker, *Manual of Needlework and Cutting Out* (1909), corpus `krl00366374`:
- "Night-dress with Yoke for Girl of 15 Years (or Woman's Small Size)", Cutting-out
  Diagrams No. 13–14, PDF pp. 258–259 (book pp. 240–241);
- "Upper Part of Woman's Night-dress with Yoke on Back", No. 15, PDF p. 260;
- "Plain Sleeves for Woman's Night Dress", PDF p. 259.

The body pieces are 51" × 40": long, gathered into a yoke. There is a front placket 17" ×
2½" (front opening), a neck band ("collar" 13" × 2½"), and long sleeves into wristbands.

## Defaults (on lib/yoke.mjs)
| What | Walker | Ours |
|---|---|---|
| Length | to the ankle | `skirtLength` 90% of waist-to-floor |
| Fullness | 40" breadths into the yoke | `gathers` 140%, `hemFlare` 10% of seat at each side |
| Opening | front placket 17" | `opening` front, `placketDepth` 55% |
| Neck | band | `neckFinish` band, `bandHeight` 9% of neck |
| Yoke | yoke, front and back | `yokeDepth` 40% |
| Sleeves | plain long sleeves, wristbands | `sleeves` long |

## Changes
- **One yoke style.** Walker's yokes vary: a back-only yoke on No. 15, and tucked fronts.
  The front body here is gathered, not tucked.

## Checks
As the smock (test/nightgown.test.mjs, test/yoke-checks.mjs), default and a back-opening variant.
