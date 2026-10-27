# Topcoat

**Source:** ЕМКО СЭВ, vol. 3, *Base constructions of men's clothing* (Moscow, 1988), corpus
`emko` (a private copy, not in the repository). §2, the men's demi-season (spring and autumn)
coat: the model on p. 23, model construction Table 2.3 with Figs. 9–10 (base construction Table
2.2, Fig. 7). Still in copyright: only its proportions and construction are used here, as design
references, in our own words. Lengths below are the book's centimetres, for its 176-100-88
figure. The archived pipeline's reading: `archive/recipes/emko/coat_demi_imk.yaml` and
`archive/pilot/emko/FINDINGS.md`.

**Block:** FreeSewing's Bent, through the military blouse (`designs/military-blouse`, Simons
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

## Construction order
1. Welt pockets in the foreparts (the military blouse's order).
2. Side panels to the foreparts and the backs; CB seam to the top of the vent, the vent's lap
   folded back on the left back as its facing.
3. Shoulders.
4. Collar: under collar to the neckline, top collar to the facings' neckline; facings to the
   front edges, turned and pressed.
5. Sleeves: the two seams, then set in, easing the cap.
6. Hems; buttonholes on the right front.

## Changes and what isn't modelled
- **Geometry from Bent**, through the military blouse's three-piece body; only ЕМКО's
  proportions are kept.
- **No chest or belly dart.** The waist is taken in at the side panel's seams instead, and stout
  figures are handled by Bent's own drafting.
- **No lining yet.** The three-piece body has no lining pieces; the sleeves are FreeSewing's.
- **The vent's length is ours.** ЕМКО draws an open vent without tabulating it.
