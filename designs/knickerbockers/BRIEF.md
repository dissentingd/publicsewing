# Knickerbockers: brief

**Status: draft.** Not sewn.

## Source
Walker, *Manual of Needlework and Cutting Out* (1909), corpus `krl00366374`:
- "Child's Drawers, 5 to 6 Years" (No. 19, PDF p. 264; "if made as Knickerbockers the
  slant at the foot prevents them from drooping at the sides");
- "Girl's Knickerbockers" (No. 20, p. 265; leg bands 15 × 2¾);
- "Woman's Knickerbockers" (No. 21, p. 266; waistband 26 × 4, leg bands 17 × 2½).

Full legs gathered into bands below the knee.

## Built on FreeSewing's Titan (trouser block)
Titan gives the crotch and seat. We keep its cross seam and fork, and change the rest:
- **Legs:** straight down from the fork (inseam) and from the seat (outseam, flared), to a
  band below the knee plus a blouse that hangs over it.
- **Waist:** a pull-on elastic casing. The waist edge is widened to at least the piece's
  width across the seat (+4%) so it passes over the hips.

| What | Walker | Ours |
|---|---|---|
| Band | below the knee, 2½–2¾" wide | `bandBelowKnee` 12% of waist-to-knee; `bandWidth` 6% of knee (finished); band 15% easy round the knee, with a 30 mm button overlap |
| Blouse | full, gathered into the band | `blouse` 10% of waist-to-knee; `seatEase` 18%; `legFlare` 8% of seat |
| Waist | waistband 26 × 4 | elastic casing (elastic `casing` 3.5% of waist wide) |
| Vent | — | notch on the outseam 12% of waist-to-knee above the hem, for the band's opening |

## Notes
- **Titan's back and front forks sit a few mm apart in height.** So the inseams can be equal
  length, the hem slants a few mm into the band.
- **Combinations aren't drafted** (Walker No. 21–22, a one-piece undergarment).

## Checks (test/knickerbockers.test.mjs)
At every adult, stout and children's set, default and a variant (band above the knee, more
blouse, no flare):
- drafts cleanly;
- outseam and inseam front and back match within 1%;
- the waist passes over the seat, and the legs gather into the band.
