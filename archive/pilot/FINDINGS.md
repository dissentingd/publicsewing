# Extraction pilot: Browne 1907 bodice (2026-10-16), paused

**Goal:** can a period drafting system be turned into a program that
reproduces the book's own diagram?

**Source:** M. Prince Browne, *Up to Date Dress Cutting and Drafting* pt 1
(1907), Ch. II, Diagrams 3–4. archive.org `uptodatedresscuttingpartone`.

## Result
- Rule format ([browne1907_bodice.yaml](browne1907_bodice.yaml)) + interpreter ([draft.py](draft.py))
  work. Each step carries its source sentence and any `gap` assumption.
- With measures read off the diagram (~96 px/in at full res), **10 of 12
  landmarks land within 0.3″ (most within 0.15″)**. Outliers are the front
  neck high point (0.6″) and front shoulder point (0.9″), from the
  illustrator's inconsistent neck (back neck implies half neck 6.84″,
  front ~6.0″).
- The **freehand curves (armhole, necks) are the weak point**. The text
  gives anchor points only ("as per Diagram", "with one stroke"), so
  curve shape had to be fitted by eye. A hybrid approach looks right:
  anchor points from text rules, curve shapes traced from the diagram.

## Cost / problems (why sourcing moved ahead of tooling)
- archive.org's scan of this book has **text leaves at ~370×550 px**
  (only the diagram leaves are high-res), so garbled OCR fractions
  ("3£in.") can't be checked. A Ch. II vs Ch. III discrepancy (3½ vs 1½/1¼)
  stayed unresolved; the diagram supports ~3¼–3½.
- Landmark reading by hand is slow and error-prone. I mixed crop-relative
  and page-absolute pixel coords on the first pass, which produced a
  false "diagram is not to scale" conclusion before it was caught.
- Conclusion: prefer sources with **scaled grids / printed dimensions,
  clean line art, high-res scans, complete garments**, over prose systems
  with freehand diagrams.

## Files
`contact_sheet.py`, `extract_leaf.py`, `grid_crop.py`: scan tools (run in
the container with the corpus mounted read-only).
`overlay_browne_dia4.yaml`: landmarks (page-absolute px).
`measures_as_drawn.yaml`: diagram-implied measures.
Scans/outputs live on Cloudbox in `~/custom-clothing/{corpus,work}`.
