# Barber's coat: brief

**Status: draft.** Not sewn. Muslin testing comes at the end of the Simons series.

## Source
Harry Simons, *Drafting Cotton Garments and Mackinaws* (1918), corpus `draftingcottonga00simo`:
- **Diagram X, Barbers' Coat**, PDF pp. 20–21 (book pp. 16–17). Breast 38, waist 35, length
  31". "A military standing collar which buttons to the neck."
- **Diagram XI, No Collar Barber's Coat**, PDF pp. 22–23 (book pp. 18–19). "Similar to the
  work coat with the exception that it does not button to the neck and has no lapel." "A
  narrow neck piece about two inches wide" finishes the back neck. The front facing is the
  same width at the shoulder.

The body and sleeve are the work coat's (the chore coat's rules).

## Pieces
| Source | Ours | Cut |
|---|---|---|
| Back, forepart | `back` (fold), `front` | 1, 2 |
| (facing) | `facing`; for the open neck it runs up to the shoulder (XI) | 2 |
| Back neck piece "about two inches wide" (XI) | `backNeckFacing`, on fold | 1 |
| Military standing collar (X, 20–25) | `collar` (`neckStyle: stand`) | 2 on fold + interfacing |
| Work-coat sleeve | `sleeve` | 2 |
| "Top patch 5½ inches wide and 6½ inches deep", "lower patch 6½ wide and 8½ deep" | `breastPocket`, `lowerPocket` | 1, 2 |

## Proportions → option defaults
| What | Source | Our rule |
|---|---|---|
| Ease | sack-coat ease | `chestEase` 18% |
| Neck | X: buttons to the neck under a standing collar; XI: open to the top button, 1½" above the breast line (4–11) | `neckStyle` stand / open; open neck ends 4% of chest above the chest line |
| Collar | 1¾" high, front end ½" higher than CB over 8¾" | `collarHeight` 11.5% of neck, spring 5.7%, square ends |
| Stand | "1¼ inches from the edge" to the buttons | `buttonExtension` 3.4% of chest |
| Buttons | 4 | `buttons` 4, neck (or top of the opening) to below the waist |
| Pockets | as quoted, rounded bottoms | breast 49% × 58%, lower 58% × 76% of the front chest width; `pocketShape` rounded |
| Front hem | drops ~1" at the front (13–14) | `frontDrop` 12% |
| Neck facing | "about two inches wide" | 14% of neck, front facing meeting it at the shoulder |

## Changes and open points
- **A line runs through X's buttons.** It may mark a fly (concealed buttons). We sew the
  buttons through.
- **Two slanted lines on XI** may be welt pockets. Both versions get the patch pockets.
- **XI's rounded front corner** is available as `hemCurve`; the default is square.
- **Side seam at the side**, as on the chore coat. Back on the fold.

## Checks the tests run
`test/barbers-coat.test.mjs` runs both necks at every adult, stout and children's set:
- the shared coat checks;
- for the open neck, the front facing meets the back neck facing at the shoulder.
