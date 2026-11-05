# Tunic skirt

**Source:** S. Schorr, *The Expert Designer* (1917), Diagram 7, text PDF p. 38 and plate PDF p. 39, corpus `expertdesignerpr00scho`. The source is public domain. **Status:** draft; not sewn.

**Construction:** This uses a new radial layout on FreeSewing's Sarah block. One half panel is cut twice, with a central dart in each half, a front seam, and a back seam. The source says seams are not allowed in its drawing; the pattern adds them.

## Source geometry and defaults

| Source | Draft |
|---|---|
| A–B: half waist, 13 in for the 26 in example | Inner radius is half the measured waist. |
| B–C: 6 in | `tunicHipDepth` is 58.6% of Women 36's 10.24 in waist-to-seat (6 ÷ 10.24); users can change it. |
| C–G: half hip plus ½ in, 21½ in for the 42 in example | `tunicHipEase` is 1.19% of the full seat on each half (½ ÷ 42). |
| Point 6: 1 in from point 5 | `tunicDartTip` is 9.8% of waist-to-seat (1 ÷ 10.24). |
| Point 4: 1½ in less than half the 1–2 distance | `tunicHemOffset` is 14.6% of waist-to-seat (1½ ÷ 10.24), used as extra drop at the centre of the curved hem. This is an approximation of the plate's midpoint construction. |
| Length and bottom width: “as desired” | `tunicLength` is our short default, 45% of waist-to-floor; the `longer` variant uses 60%. The radial sweep sets the bottom width. |

The plate's lower figure confirms a central dart and a curved hem after the wedge closes. At Schorr's 26/42 in example, the hip radius is 19 in, the hip arc on each half is 21½ in, and the waist needs about 1.7 in of dart intake. The two straight edges are equal length.

## Changes and limits

- The plate narrows its hem by cutting a wedge at points 6–7–8 and joining the legs. This draft retains a continuous radial hem and uses the radial excess at the waist for the dart. Its hem is therefore fuller than a deliberately narrowed source draft; Schorr gives no required bottom width to reproduce.
- D is 2 in from A and E is 1 in below D. The text never refers to them after locating E; the plate shows them outside the cut. They are auxiliary marks, not dimensions of a pattern piece, so this draft does not use them as fit options.
- The source does not specify a closure or finish. This draft marks a back zipper position and uses a plain waist finish; a facing must be cut from the waist edge. The zip and facing are our construction choices.
- When the measured hip arc is near the waist arc, the layout keeps a small 4% dart, adding hip room to retain the defining shape. If it is farther below, the angle is held at one radian and the dart closes to zero. This occurs in some child and stout measurement sets. The waist still fits; the hip has extra room.
- A close fit and the bias hem have not been checked on a body. Let the panel hang, then level the hem before finishing it.

**Threadloop:** A [free circle-skirt calculator](https://threadloop.app/patterns/circle-skirt-calculator-by-anicka-design) drafts from measurements, but its listing describes a circle skirt rather than this hip-controlled panel with a central dart. A targeted search did not establish an exact free equivalent (2026-11-05).

**Checks:** `test/tunic-skirt.test.mjs` drafts the default, plain and longer versions over the size sets, checking the waist, hip room, matched front and back seams, hem expansion, and dart mark. The comparison sheet was inspected beside Schorr's plate.
