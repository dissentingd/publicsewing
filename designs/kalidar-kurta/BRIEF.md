# Kalidar kurta

**Source:** Central Board of Secondary Education with the National Institute of Fashion Technology,
*Basic Pattern Development: Students Handbook + Practical Manual, Class XII* (CBSE, Delhi, 2014),
published free by CBSE; the maintainer's copy, not in the repository. Practical 11, "Kalidar Kurta",
book pp. 95–97 (PDF pp. 107–109; PDF = book + 12), and section 5.8.2, p. 41. In copyright: only its
construction and proportions are used here, as design references, in our own words; no text or figure
is reproduced. Inches below are the handbook's, for its sample: bust 34¾, shoulder 14, cross back
14½, sleeve 18.

**Threadloop (2026-11-16):** not searched for this one.

**Block:** none: cut flat from straight-edged `polygon` pieces, as the salwar is, on a hidden Brian
part that only carries the measurements. No library code changed.

**Status:** draft. Not sewn.

## What the source shows
- **The garment (pp. 41, 95):** a comfortable kurta made of geometric pieces, traditionally its centre
  panel cut on the fold; its side panels (kalis) cut like the salwar's; a straight armhole, and a
  square gusset between the sleeve and the kalis for movement. The Bhopali kurta, jama and angarkha
  are cut on the same principles. It needs only the bust, the length and the sleeve length.
- **Centre panel (p. 96, text and plate):** AB the length on the fold, AC half the cross back; the neck
  a twelfth of the chest wide, the front a twelfth plus 1 in deep, the back 1 in; the shoulder dropping
  ¾ in to C'; a front placket opening a sixth of the length. One draft, cut twice (front and back).
- **Sleeve:** HI the sleeve length on the fold, HJ a quarter of the bust less 1 in, the hem IL 2 in
  less; cut two.
- **Kalis:** a rectangle, MN the length less the sleeve's width, MO a sixth of the bust plus 1 in at
  one end and OP a twelfth plus ½ in, QR = MO at the other; cut on the diagonal O–R, adjusted ½ in
  down at O and up at R, it gives two tapering panels, four from a doubled cut.
- **Gusset (p. 97):** a square, its side a twelfth of the bust plus 1 in; cut two.
- **Figure (p. 97):** a long kurta below the knee flaring from the underarm, a round neck, a placket
  with three buttons, sleeves to below the elbow, no side slits.
- The table's length, 14¾ in, is a misprint, as in the kameez practicals.

## How it maps onto the pieces
| Feature | CBSE | Here (option default) |
|---|---|---|
| Length | "as measured", below the knee | back neck to waist plus `skirtLength` 50% of waist to floor |
| Centre panel | half the cross back, 7¼ in | `panelWidth` 20.9% of the chest (we have no cross back) |
| Armhole and sleeve width | a quarter of the bust less 1 in | `armholeDepth` 22.1% of the chest |
| Shoulder drop | ¾ in | `shoulderDrop` 2.2% of the chest |
| Sleeve hem | 2 in narrower | `sleeveTaper` 5.8% of the chest |
| Sleeve length | 18 in, as measured | `sleeveLength` 79% of shoulder to wrist, from the shoulder point (the panel's side is a little inside it) |
| Kali top, hem | a twelfth of the bust plus ½ in; a sixth plus 1 in | `kaliTop` 9.8%, `kaliHem` 19.5% of the chest |
| Kali corners | ½ in down at the top, ½ in up at the hem | `kaliCurve` 1.4% of the chest |
| Neck | a twelfth of the chest wide; front a twelfth plus 1 in, back 1 in deep | `neckWidth` 8.3%, `neckDepth` 11.2%, `backNeckDepth` 2.9% of the chest |
| Placket | a sixth of the length | `placketDepth` 16.7% of the length; `placketWidth` 8% of the neck (ours) |

## Changes and what isn't modelled
- **The gusset** is sized to the kalis' tops (`kaliTop` with the corner's drop), so its seams match:
  CBSE's square, a twelfth of the bust plus 1 in, is ½ in bigger than the kali top it sews to.
- **The kali's length** is the centre panel's side below the sleeve. CBSE's (the length less the
  sleeve's width) ignores the shoulder's ¾ in drop, and would run ¾ in past the panel's hem.
- **Chest-based widths:** CBSE uses the cross back for the centre panel; FreeSewing's measurements
  have none, so every width is a share of the chest, giving the sample's ease (about 8 in at the
  underarm) at every size.
- **The neck** is drawn as a quarter ellipse in straight steps; the polygon pieces have no curves.
- **The placket** pieces and the three buttons are ours: CBSE marks only the slit, and the figure
  shows the buttons.
- **No collar:** CBSE mentions a Chinese (band) collar as an option, with a shallower neck; not drawn.
- **The sleeve is never shorter than** the gusset plus 4 cm, so the underarm seam has a length to sew.

## Variants
- **Short kurta:** to the hip (`skirtLength` 20%), the kalis narrower at the hem (`kaliHem` 14%).
- **Long sleeves:** to the wrist (`sleeveLength` 100%).

## Pieces
1. Front panel, on the fold, with the placket slit marked.
2. Back panel, on the fold.
3. Sleeve, on the fold (the top of the arm), cut two.
4. Side panel (kali), cut four: the straight edge sews to a centre panel, the sloping edge to the
   next kali at the side seam.
5. Underarm gusset, cut two, on the bias.
6. Placket, cut two, each folded in half lengthways.

## Construction
1. Cut the slit; sew a placket to each side of it, the buttonholed one on top; finish the slit's foot.
2. Sew the shoulders; bind or face the neck.
3. Sew each sleeve's top edge to the panels' sides, shoulder seam to the sleeve's fold, down to the
   notches.
4. Sew a kali to each side of each centre panel, from the notch to the hem, its straight edge to the
   panel.
5. Set in the gusset: two sides to the front and back kali tops, two to the sleeve's underarm edges up
   to the notches. Sew the underarm seams from the notch to the hem, and the side seams (kali to
   kali) from the gusset to the hem.
6. Hem the kurta and the sleeves; sew on the buttons.
