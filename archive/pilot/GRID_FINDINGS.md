# Grid-vectorization pilot: Walker 1909, man's nightshirt (2026-10-17)

**Question:** is a grid-drafted source ("1 square = 1 inch") cheap to turn
into a true-scale vector pattern, compared with the Browne prose pilot?

**Source:** Agnes Walker, *Needlework and Cutting Out* (1909), Cutting-Out
Diagrams No. 8, p. 235 (archive.org `krl00366374`, leaf 252, 2016×2764 px).

## Method ([grid_vectorize.py](grid_vectorize.py), runs in `custom-clothing/tools` image)
1. Deskew (projection sharpness): 0.45°.
2. Grid calibration: autocorrelation for a first period estimate, then each
   grid line located and **regression-fit** (40 vertical / 54 horizontal
   lines, residual sd 1.2–1.7 px) → 38.25 × 38.58 px per square.
3. Pattern mask by **stroke width**, not tone: a morphological opening
   (r = 4 px) keeps the ~12 px pattern band and drops thin grid lines, the
   construction box, and text.
4. Skeletonize → trace polylines → simplify (0.03″ tolerance) → inches → SVG at 1:1.

## Result
- Output: [out/walker1909_mans_nightshirt.svg](out/walker1909_mans_nightshirt.svg) (inches, 1:1),
  [overlay](out/walker1909_mans_nightshirt_overlay.png), [json](out/walker1909_mans_nightshirt.json).
- **Complete outline captured:** shoulders, armholes, neck, side seams, front
  opening, both front and back hems. 21 polylines, 215 vertices.
- **Accuracy vs the dimensions printed on the draft:** median error **0.21″**,
  typically ≤0.5″. Overall 33.79 × 48.71″ vs printed 34 × 49″ (−0.6%).
  The printed grid itself is 0.9% non-square, so the residual is the 1909
  engraving's own accuracy (~1%), not the pipeline. A final 2-parameter
  rescale against the printed labels would remove it.
- **Effort:** two script iterations, no hand-picked landmarks, no curve
  guessing. Compare the Browne pilot: OCR fraction ambiguity, hand-read
  landmarks (with an error), freehand curves fitted by eye.

## Known cleanups (not done)
- A few stray fragments of the thin construction box survive near corners
  (filter: drop polylines lying on the box lines, or with dark tone).
- Two small gaps in the inner (front) hem; close by endpoint snapping
  (<0.5″).
- Front and back are drawn overlaid (shared top, different hems). Split
  into two pieces using the printed labels (Front 47×34, Back 49×36).
- Labels (OCR) → automatic rescale + piece names + grain arrow.

## Pipeline result (2026-10-22): the night-shirt's front and back in gate
Built by `ccat/grid.py` + `recipes/walker/nightshirt.yaml` (see CLAUDE.md). The field measured
from its lines is 34.00 × 48.81 in (printed 34 × 49) and the traced front hem 46.6 in (printed
47), all within 1%. The drawing departs from its own figures (drawn − figure, inches): neck
corner +0.25 left / −0.04 right, shoulder +0.29 / +0.05 across and −0.01 / +0.07 down, armhole
−0.30 / −0.19, neck depth −0.08, opening foot −0.20, back hem +0.02 from C but −0.74 from D (the
right back hem reaches the bottom ¾ in early). The book's key makes the figures the draft, so
the pattern takes the figures and the drawing's curve shapes (similarity onto the figure
points; the right back hem curve is stretched ×1.20). "Back 49 × 36": the page draws one field,
34 wide; what the 36 is for isn't explained (not used). Figure OCR: tesseract reads the
engraved italic numerals poorly, so they were transcribed; `ccat/figread.py` (2026-10-22) now
reads them from the book's own glyphs (see HANDOFF.md). Page 236 (the
night-shirt's sleeves, bands, yoke, collars, gussets) traces with no changes: 7 fields, sizes
within 1% of their labels except the 3 × 3 gusset (2.88 × 2.90).

## Conclusion
The "easy source" thesis holds: **grid-drafted sources vectorize almost
mechanically at ~1% accuracy.** Prioritize grid/scale-diagram sources;
treat prose systems as last resort.
