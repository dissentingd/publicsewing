# Bar vest: brief

**Status: draft.** Not sewn. Muslin testing comes at the end of the Simons series.

## Source
Harry Simons, *Drafting Cotton Garments and Mackinaws* (1918), corpus `draftingcottonga00simo`,
**Diagram XVI, Bar Vest**, PDF pp. 32–33 (book pp. 28–29):
- breast 36, waist 32, length 26½";
- "The regular sack coat or work coat sleeves can be used with this vest";
- "The collar of this draft should be made similar to the military collar of the barber's
  coat."

A bartender's white jacket: short, waisted, with pointed fronts.

## Pieces
| Source | Ours | Cut |
|---|---|---|
| Back, forepart | `back` (fold), `front` | 1, 2 |
| (facing) | `facing` | 2 |
| Military collar (Diagram X) | `collar` (`collarHeight` 0 leaves it off) | 2 on fold + interfacing |
| Sleeves, optional | `sleeve` (`sleeves`, off by default) | 2 |
| Two patch pockets on each front | `upperPocket`, `lowerPocket` | 2, 2 |

## Proportions → option defaults
| What | Source | Our rule |
|---|---|---|
| Waist | taken in at the side seams (19 is half the waist; 18-20-21) | `waistShaping` on, `waistEase` 10% |
| Ease | close sack-coat fit | `chestEase` 14% |
| Length | 3" below the waist at the back (5–6) | `lengthBelowWaist` 45% of waist-to-seat |
| Points | fronts run down to points (38–39) about 3¾" below the back hem, the hem straight up to the side seam | `frontDrop` 55%, straight hem |
| Buttons | 6, neck to just below the waist | `buttons` 6 |
| Stand | 33–34 ¾" plus the edge | `buttonExtension` 3.2% of chest |
| Pockets | rounded patches at the breast line (27) and the waist (36) | 42% × 42% and 50% × 40% of the front chest width |

## Changes
- **Sleeveless by default**, as the name says. The armholes are bound (bias) when there are
  no sleeves; the option adds the work-coat sleeve.
- **Back on the fold**: the source shapes a CB seam ¾" in at the waist. All the waist
  shaping is at the side seams here.

## Checks the tests run
`test/bar-vest.test.mjs` runs it sleeveless and sleeved (with and without pockets and
collar) at every adult, stout and children's set:
- the shared coat checks;
- the side seam is taken in at the waist;
- the fronts drop to points.
