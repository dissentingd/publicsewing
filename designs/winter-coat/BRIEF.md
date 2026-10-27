# Winter coat

**Source:** ЕМКО СЭВ, vol. 3, *Base constructions of men's clothing* (Moscow, 1988), corpus
`emko` (a private copy, not in the repository). §3, the men's winter coat: the model on p. 41,
model construction Table 3.3 with Figs. 14–15 (base construction Table 3.2). Still in
copyright: only its proportions and construction are used here, as design references, in our
own words. Lengths below are the book's centimetres, for its 176-100-88 figure. The archived
pipeline's reading: `archive/recipes/emko/coat_winter_imk.yaml` and
`archive/pilot/emko/FINDINGS.md`.

**Block:** FreeSewing's Brian, through the windbreaker (`designs/windbreaker`, ЕМКО §4), whose
yoked back and front it shares, with a button front, turn-down collar and lining.

**Status:** draft. Not sewn.

## What the source shows
A straight-silhouette winter overcoat:
- **Back:** a shallow yoke (12.0 down CB from the neck) taking the back shoulder dart into its
  seam at the armhole; the back below it with a centre seam.
- **Front:** a deep yoke, its seam from the front edge (about 20 below the front neck) to the
  armhole 1.8 above the underarm, taking the chest dart; no side panel. The stomach is taken by
  swinging the lower front about the waist, which leaves a small dart in the pocket line.
- **Side seam:** moved 2.5 toward the back.
- **Pockets:** a welt on each hip, about 7 below the waist, running from the front of the hip
  back almost to the side seam and rising slightly as it goes.
- **Collar:** turn-down.
- **Sleeves:** two pieces, seams at the front and back of the arm.
- **Ease:** half the chest is 64.6 across: 29% over the chest.
- **Length:** 110.35 from the nape, 61.45 below the waist.

## How it maps onto the block
| Feature | ЕМКО (176-100-88) | Here (option default) |
|---|---|---|
| Ease | 29% over the chest; straight | `chestEase` 27%, `seatEase` 16%; `hemFlare` 3% of seat at each side seam, room to walk |
| Length | 61.45 below the waist | `lengthBelowWaist` 230% of waist-to-seat |
| Back yoke | 12.0 of the 30.0 from the nape to the underarm | `backYokeDepth` 40% |
| Front yoke | About 20 below the front neck at the edge; 1.8 above the underarm at the armhole | `frontYokeDepth` 86% and `frontYokeArm` 92% of CF neck to the chest line |
| Closure | (single-breasted) | `buttonExtension` 3.2% of chest; `buttons` 4 on CF, from below the collar to just below the pockets |
| Pockets | A near-level welt at the hip, its front end about 21 behind the front edge, running back to the side seam | `handPockets` on: front end `handPocketTop` 35% of waist-to-seat below the waist and `handPocketAt` 50% of the front's chest width behind CF, running back `handPocketLength` 43% of that width (kept off the side seam), rising `handPocketLean` 5% |
| Collar | Turn-down | A turn-down collar, `collarWidth` 27% of neck, front edge to front edge |
| Lining | (not tabulated) | `lining` on: the yokes, body pieces and sleeves cut again in lining |
| Hood | none | `hood` off; the windbreaker's hood can be turned on in place of the collar |

## Construction order
1. Welt pockets in the lower fronts (the windbreaker's order).
2. Front yokes to the lower fronts; back yoke to the back. Topstitch the yoke seams.
3. Shoulders; side seams.
4. Collar: under collar to the neckline, top collar to the facings' neckline; facings to the
   front edges, turned and pressed.
5. Sleeves made up and set in.
6. Lining made up the same way, sewn to the facings and the back neck; hemmed to the coat's hem
   allowance with an ease fold.
7. Hems; buttonholes on the right front.

## Changes and what isn't modelled
- **Geometry from Brian.** Only ЕМКО's proportions are kept.
- **The back is cut on the fold**, without ЕМКО's centre seam; a vent isn't drafted.
- **No side-seam shift, no belly dart, no pocket-line dart.** Brian's side seam stays where it is;
  stout figures get the front share of the waist (`lib/coat.mjs`) instead of ЕМКО's swing of
  the lower front.
- **No darts into the yoke seams**: Brian's back and front have none to close.
- **The sleeve** is FreeSewing's one-piece sleeve, not ЕМКО's two-piece sleeve.
- **The pocket's welt and bag** are the windbreaker's (`lib/body3.mjs` welt parts), sized from
  the mouth.
