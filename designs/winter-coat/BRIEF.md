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
| Back yoke | 12.0 of the 30.0 from the nape to the underarm | `yokeDepth` 40% |
| Front yoke | About 20 below the front neck at the edge; 1.8 above the underarm at the armhole | `frontYokeDepth` 86% and `frontYokeArm` 92% of CF neck to the chest line |
| Closure | (single-breasted) | `buttonExtension` 3.2% of chest; `buttons` 4 on CF, from below the collar to just below the pockets |
| Pockets | A near-level welt at the hip, its front end about 21 behind the front edge, running back to the side seam | `handPockets` on: front end `handPocketTop` 35% of waist-to-seat below the waist and `handPocketAt` 50% of the front's chest width behind CF, running back `handPocketLength` 43% of that width (kept off the side seam), rising `handPocketLean` 5% |
| Collar | Turn-down | A turn-down collar, `collarWidth` 27% of neck, front edge to front edge |
| Lining | (not tabulated) | `lining` on: the yokes, body pieces and sleeves cut again in lining |
| Hood | none | `hood` off; the windbreaker's hood can be turned on in place of the collar |

## Construction order
The joining order below is a proposed method for this unsewn draft.
1. P: with hand pockets on, make each lower-front welt and bag through the outer fabric, securing the welt ends before closing the bags.
2. X and Y: join the back and front yokes to the lower panels and topstitch their seams.
3. A and B: close shoulder and side seams.
4. R and K: if the hood is selected, join its crown and make its casing before attaching it.
5. D and E: attach the under collar to the neckline, the upper collar to the facings, then sew the facings to the front edges and turn. With the hood variant, attach the hood at the neck instead.
6. F and C: make the sleeves and set them into the armholes.
7. With the lining on, make it to match the shell and join it to the facings and back neck, allowing an ease fold at the hem.
8. H and BH: turn and secure coat and sleeve hems; work front buttonholes and sew on buttons.

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
