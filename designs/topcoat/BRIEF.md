# Topcoat

**Source:** ЕМКО СЭВ, vol. 3, *Base constructions of men's clothing* (Moscow, 1988), corpus
`emko` (a private copy, not in the repository). §2, the men's demi-season (spring and autumn)
coat: the model on p. 23, model construction Table 2.3 with Figs. 9–10 (base construction Table
2.2, Fig. 7). Still in copyright: only its proportions and construction are used here, as design
references, in our own words. Lengths below are the book's centimetres, for its 176-100-88
figure. The archived pipeline's reading: `archive/recipes/emko/coat_demi_imk.yaml` and
`archive/pilot/emko/FINDINGS.md`.

**Block:** FreeSewing's Bent, through the military blouse (`designs/military-tunic`, Simons
1918), whose three-piece body (back, side panel, forepart: `lib/body3.mjs`), welt pockets and
two-piece sleeve it shares. The topcoat is the military blouse's spec with these changes.

**Status:** draft. Not sewn.

## What the source shows
A semi-fitted overcoat in the cut of a suit jacket:
- **Back:** a centre seam with an open vent at the hem.
- **Side panel:** cut off between the back and the front, as the jacket's.
- **Front:** a chest dart running down into the side pocket and a belly dart along the pocket
  mouth; single-breasted.
- **Pockets:** slanted welts on the hips.
- **Collar:** turn-down.
- **Sleeves:** two pieces (the jacket's construction).
- **Ease:** half the chest is 63.5 across: 27% over the chest.
- **Length:** 110.15 from the nape, 61.45 below the waist.

## How it maps onto the block
| Feature | ЕМКО (176-100-88) | Here (option default) |
|---|---|---|
| Ease | 27% over the chest, semi-fitted | `chestEase` 25%, `waistEase` 22%, `seatEase` 14%; the waist taken in at the two body seams as the military blouse's |
| Length | 61.45 below the waist | `lengthBelowWaist` 230% of waist-to-seat |
| Back | CB seam, open vent | `vent` on: a CB seam with a vent `ventLength` 140% of waist-to-seat up from the hem, lapping `ventWidth` 4.5% of chest, its top cut at 45° |
| Side panel | Cut off between back and front | The military blouse's side body, seams leaving the armhole 30% up the back and 12% up the front |
| Closure | Single-breasted | `buttonExtension` 3.2% of chest; `buttons` 4 on CF, from below the collar to below the waist |
| Pockets | Slanted welts, the darts ending in them | `lowerPockets` on: a welt below the waist, slanting down toward the front, its welt 18% of the mouth; `breastPockets` off |
| Collar | Turn-down | A turn-down collar `collarWidth` 27% of neck, front edge to front edge |
| Sleeves | Two pieces | FreeSewing's two-part sleeve fitted to the armhole; `cuffEase` 85% of the wrist |
| Lining | Lined (not tabulated) | `lining` on: the facing runs to the shoulder and meets a back-neck facing `neckFacingWidth` 14% of neck deep; a front lining from the facing to the front seam, the side panel and sleeves cut again from lining, a back lining below the neck facing with `liningPleat` 2.5% of chest extra at CB (cut in pairs above the vent); `insidePockets` on: a welt in the left front lining at the chest line, half the front's width long |

## Construction order
1. If lower pockets are selected, make their P welts and bags in the foreparts while they are flat.
2. If a breast pocket is selected, make its P8 welt and bag before closing the coat body.
3. Join the B front-body and C back-body seams; close CB to the top of the vent and fold its left lap back as a facing.
4. Sew the A shoulder seams.
5. Attach the under collar at E to the neckline and the top collar to the facings; sew the F facings to the front edges, turn and press.
6. Sew each sleeve's G front and H back seam, then set it at D into the armhole, easing the cap.
7. Make the lining: add the inside pocket, join front, side and back linings with a CB ease pleat, make and set sleeve linings, then bag to the coat and finish around the vent.
8. Finish the J body and sleeve hems; work BH buttonholes on the right front and attach buttons opposite.

## Changes and what isn't modelled
- **Geometry from Bent**, through the military blouse's three-piece body; only ЕМКО's
  proportions are kept.
- **No chest or belly dart.** The waist is taken in at the side panel's seams instead, and stout
  figures are handled by Bent's own drafting.
- **The lining pieces are ours** (`lib/body3.mjs`, the coat library's lining on the three-piece
  body, 2026-11-01): ЕМКО lines the coat but gives no lining pattern. Turning `lining` off
  gives the old facing, which stops at the neckline.
- **The vent's length is ours.** ЕМКО draws an open vent without tabulating it.
