# Windbreaker

**Source:** ЕМКО СЭВ, vol. 3, *Base constructions of men's clothing* (Moscow, 1988), corpus
`emko` (a private copy, not in the repository). §4, the men's summer jacket: the model on
p. 58, model construction Table 4.3 with Figs. 21–22, base construction Table 4.2 (hood rows
pp. 66 and 68, Figs. 19–20). Still in copyright: only its proportions and construction are
used here, as design references, in our own words; no text or figure is reproduced. Lengths
below are the book's centimetres, for its 176-100-88 figure (height 176, chest 100, waist 88).
The archived pipeline's reading of these tables is `archive/recipes/emko/summer_jacket_imk.yaml`
and `archive/pilot/emko/FINDINGS.md`.

**Block:** FreeSewing's Brian, with the coat body from `lib/coat.mjs`, the back cut by
`backYokeCut` (`lib/panels.mjs`), the front cut by `frontYokeCut`, and the hood from
`lib/hood.mjs`.

**Status:** draft. Not sewn.

## What the source shows
A straight, hip-length jacket for summer:
- **Back:** a yoke across the shoulders (16.0 down CB from the neck), and the rest of the back
  in one piece, on the fold. The back shoulder dart closes into the yoke seam at the armhole.
- **Front:** a yoke (17.0 down the front edge from the neck), its seam square to the front
  edge and meeting the armhole 3.2 above the underarm; the lower front eased onto it; a belly
  dart from the waist to the hem.
- **Closure:** a zip, neck to hem.
- **Hood:** two halves joined over the crown, its neck edge sewn to the whole neckline. The face
  edge leans 10° toward the face; the crown is 25.6 deep, rounded at the back on a 12.8 radius;
  the face end of the neck edge sits 9.5 below the neck point.
- **Sleeves:** one piece with a seam on the inside of the arm and an elbow dart; narrowed 2.0 at
  the hem.
- **Pockets:** slanted welt pockets in the lower front.
- **Hem and cuffs:** elastic at the sides of the hem and in the cuffs.
- **Ease:** half the chest is 61.65 across: 23% over the chest.
- **Length:** 76.95 from the nape, 29.1 below the waist.

## How it maps onto the block
| Feature | ЕМКО (176-100-88) | Here (option default) |
|---|---|---|
| Ease | 23% over the chest; straight to the hem | `chestEase` 22%, `seatEase` 10%; side seams straight |
| Length | 29.1 below the waist | `lengthBelowWaist` 110% of waist-to-seat |
| Back yoke | 16.0 of the 27.75 from the nape to the underarm | `yokeDepth` 58% of CB neck to the chest line |
| Front yoke | At the front edge 17.0 below the front neck; at the armhole 3.2 above the underarm | `frontYokeDepth` 78% and `frontYokeArm` 85% of CF neck to the chest line; kept inside the armhole |
| Zip | Neck to hem | Each front `zipExtension` 0.6% of chest past CF, covering half the teeth; the zip marked from the neckline to the hem |
| Hood | Face edge from the neck up past the crown, 10° forward; crown 25.6 deep, 12.8 corner; neck edge dropping 9.5 to the face | `hoodHeight` 75% of the head, `hoodLean` 10°, `hoodDepth` 44.5% of the head, `hoodCorner` 50% of the depth, `hoodNeckDrop` 35% of the neck edge; the neck edge fitted to the neckline, CB to the front edge |
| Drawstring | A drawstring in the face edge (the insulated jacket's hood, §5) | `hoodDrawstring` on: a casing 4% of the head turned back on the face edge |
| Collar | None (the hood) | Without the hood: a stand collar `collarWidth` 18% of neck, front edge to front edge |
| Pockets | Slanted welts | `handPockets` on: top `handPocketTop` 10% of waist-to-seat above the waist (kept below the yoke), `handPocketAt` 50% of the front's chest width behind CF, `handPocketLength` 55% of it long, leaning `handPocketLean` 30% toward the side per unit down, the welt `handPocketWelt` 12% of the mouth |
| Sleeve | One piece, inner seam, elbow dart, 2.0 narrower at the hem | FreeSewing's one-piece sleeve fitted to the armhole; `cuffEase` 110% of the wrist, drawn in by elastic |
| Facing | (not tabulated) | `facingWidth` 5% of chest, behind the zip |

## Construction order
Letters are the seam and placement codes on the pattern map; numbers are printed on the pieces. **SS** straight seam, **TS** topstitch, **CS** a casing turned up for elastic or a drawstring.

1. Welt pockets in the lower fronts **1**: interface the welts **9**, fold each lengthwise, lay it on the mouth line **P** with a bag piece **10** over it, stitch, cut the mouth, turn the bag through, press the welt over the mouth and sew its ends down; then the second bag piece, and the bags together.
2. Sew the front yokes **2** to the lower fronts **1** at **Y**, and the back yoke **4** to the back **5** at **X**. Topstitch the yoke seams with **TS**.
3. Sew the shoulders **A** of the front and back yokes **2**, **4**, then the side seams **B** of the fronts **1** and back **5**.
4. Hood **7**: sew the crown seam **R**; with a drawstring, work two eyelets near the front ends of the face edge, then fold the casing back along **K** and stitch it with **CS**. Sew the hood to the neckline **D** of the yokes **2** and **4**, its notch to the shoulder seam.
5. Sew the zip between the fronts **1** and **2** and the facings **6** along **Z** and the front edges **E**, the facings turned to the inside, catching the hood's **7** front ends.
6. Sleeves **3**: sew the underarm seam **F**, then set each into the armhole **C** of the yokes **2**, **4**, front **1** and back **5**.
7. Turn up the hem of the fronts **1** and back **5** and the sleeve cuffs **3** as casings **H** (**CS**), with elastic in the cuffs and the sides of the hem.

## Changes and what isn't modelled
- **Geometry from Brian, not ЕМКО's tables.** ЕМКО drafts its own base construction from its
  own measurements; here only its proportions are kept, on Brian's back and front, so the
  jacket drafts at any size.
- **No belly dart.** ЕМКО's dart from the waist to the hem shapes the front over the stomach;
  Brian's front is straight, and stout figures get the front share of the waist instead
  (`lib/coat.mjs`).
- **No yoke ease.** ЕМКО eases the lower front onto the front yoke; here the two edges are the
  same length.
- **The back shoulder dart** isn't drafted: Brian's back has no dart to close into the yoke
  seam.
- **The sleeve** is FreeSewing's one-piece sleeve with its seam under the arm, not ЕМКО's inner
  seam and elbow dart.
- **The hood** is drafted from the head and the neckline, not from Table 4.2's rows: its height,
  depth and corner are shares of the head chosen to give ЕМКО's sizes at an average head; the
  drawstring is from the insulated jacket.
- **Elastic** isn't drafted: the hem and cuffs are plain turned casings.
