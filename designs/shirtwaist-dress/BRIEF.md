# Shirtwaist dress

**Source:** Woman's Institute of Domestic Arts and Sciences (Mary Brooks Picken), *Pattern
Drafting*, §2 (corpus `patterdraftingpicken`). The scan's lesson is printed "Copyright, 1915";
the manifest dates the item 1920. Either way it is a US publication before 1931, so public
domain. Inches below are the source's.

**Status:** draft. Not sewn.

## What the source gives
The lesson is one section, not a whole book: a loose foundation waist, a plain and a
shirtwaist sleeve, and a collar and cuff (pp. 24–42). It has no skirt and no dress. The
dress is ours: the shirtwaist on top, joined at the waist to a gathered skirt, as a practical
work dress (WARDROBE_GAPS.md, "Shirtwaist / work dress").

| Source | Pages | Read for |
|---|---|---|
| Foundation waist, Figs. 31–44, Plate I | 24–37 | pieces, ease, waist line |
| One-piece foundation sleeve, Fig. 45 | 37–38 | cap height, sleeve fullness |
| Collar, Fig. 46 | 39 | collar depth and spring |
| Cuff, Fig. 47 | 39–40 | cuff depth and length |
| Shirtwaist sleeve, Fig. 48 | 40–41 | fullness at the hand, cuff, opening |
| Regulating the fullness of sleeves | 41–42 | cap ease |

## Pieces
- **Bodice** back (on the fold) and two fronts, opening down CF with buttons: to the waist.
- **Skirt** back and front, each on the fold, gathered into the bodice at the waist.
- **Sleeve** (one-piece), long, its hem gathered into a **cuff**.
- **Collar**, turn-down, cut on the fold at CB.
- Placket strip only if the opening runs past the waist (not by default).

## Proportions, ease and style lines
| Feature | Source | Option default |
|---|---|---|
| Body ease | The waist "should set easy": 4" over the bust (40" drafted for a 36" bust), 1" over chest width, ½" over back width (p. 28) | `chestEase` 11% (4/36) |
| Front length | 1" added to the front length, so the waist blouses over the belt (p. 28) | not modelled (see below) |
| Waist line | The waist runs 4" below the waist line to tuck into a skirt (pp. 35–36) | the dress joins bodice and skirt at the waist instead: `yokeAt` waist |
| Sleeve fullness at the hand | Shirtwaist sleeve: half the hand measure + 1½" at the hand, where the plain sleeve has half the hand + ½" (pp. 38, 40) | `cuffEase` 80% of wrist (the template's), gathered into the cuff |
| Cuff | 2½" deep, length the hand measure + 1" (pp. 39–40) | `sleeveBand` 40% of wrist (2½" on a 6–6½" wrist), `sleeveBandEase` 45% (so it passes the hand) |
| Sleeve opening | A slit I–J, half the hand + ½" long, at the cuff (p. 41) | not drafted: the cuff is cut to pass over the hand |
| Cap | Sleeve "a trifle full", 2½–2¾" more than the armhole (pp. 41–42) | FreeSewing's fitted sleeve (`libraryFitSleeve`), eased to the armhole |
| Collar | On the fold at CB; 3½" deep at CB; its neck edge 1" higher at the front end over half the neck (6½"); square ends (p. 39) | `collarWidth` 27% of neck (3½/13), `collarSpring` 15% (1/6½) |
| Skirt | (none in the source) | `skirtLength` 70% of waist-to-floor (below the knee), `gathers` 150%, `hemFlare` 6% |
| Closure | (a foundation draft has none) | front opening, `buttons` 6, stand `openingExt` 2.5% of chest |

## Construction order
1. Shoulder and side seams of the bodice; collar to the neckline, faced by the front stand.
2. Skirt side seams; gather the skirt top and sew it to the bodice at the waist.
3. Sleeve underarm seams; gather the sleeve hem into the cuff; set the sleeves, easing the cap.
4. Hem; buttons and buttonholes down the front.

## Source discrepancies and changes
- **Date:** the lesson says 1915, the manifest 1920 (above).
- **Changed:** the waist's 4" below the waist line (a shirtwaist tucked into a separate skirt)
  becomes a waist seam to a gathered skirt.
- **Not modelled:** the 1" extra front length for blousing (the template's bodice front and
  back are the same length at the side seam); the shaped under-arm line (in 1" at the waist
  each side, pp. 34–35), since the template's bodice is straight to the waist; the cuff's
  shaped edge (½" dip, Fig. 47) and the sleeve opening, since the cuff is cut wide enough to
  pass the hand.
- **WARDROBE_GAPS.md expected this source to cover a tailored jacket and a shift dress.** It
  doesn't: the held scan is this one lesson.
