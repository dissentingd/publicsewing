# FINDINGS digest: ЕМКО СЭВ т.3 (men's base and model constructions)

Digest of [FINDINGS.md](FINDINGS.md) (over 20 KB). Read this first; open the full file for
tables, numbers and per-row reasoning. Sections in the full file are dated.

## Source and point system
- ЕМКО СЭВ т.3 (1988), a private copy, processed offline. Each garment has a БК table (x.2:
  segment, formula in body measurements Т##, ease split, draft value) and an ИМК table
  (x.3: model construction rows, mostly constructions with few printed values).
- Point grammar: first digit = level (1 neck … 9 hem), second = vertical line (1 back
  centre, 3 back width, 5 armhole, 7 front centre). Rows are self-checking
  (ПК = ПС + ПП, draft = base + П).

## Pilot results (2026-10-17/18)
- Jacket БК rebuilt from Table 1.2, all row arithmetic consistent; body measurements solve
  to ≤0.01 cm. Trousers, waistcoat, summer jacket, coats, insulated jacket and the
  8 graded jacket figures followed.
- Sleeve cap: the book's unified arc method (appendix p. 126). The true cap target is
  ДОР − 2|131–132| (footnote 6). Hood for the summer jacket piloted (emko_hood.py),
  not yet a recipe.
- Base fix: row 47 is |46–36|. The jacket's ИМК (side panel, belly-dart transfer, two-piece
  sleeve) went in from Table 1.3.

## ИМК garments (2026-10-20/21), all 176-100-88, all in gate
- **Winter coat (Table 3.3):** yoke model, no side panel. Calls from the figure: 123′, 96,
  931′, 451. The side seam is 1.95 longer on the front (БК hem levels).
- **Demi coat (Table 2.3):** jacket-family side panel; the chest and belly darts end in the
  pocket cut; back rows 32–37.3 (shoulder ease, armhole about O). The sleeve is shared with the
  jacket (imk_sleeve.yaml). The БК hem is read from Fig. 7: one side corner, the front hem
  down to 96.
- **Summer jacket (Table 4.3):** yokes, one-piece lower back on the fold, one-piece sleeve
  with an inner seam and an elbow dart. Hood not built.
- **Waistcoat (Table 6.3):** ИМК (rows 1–27.2: back fish dart, side seams in at the waist and
  out at the hip, chest dart turned into the armhole; no ДП printed) and **МК** (МК rows 1–13:
  V-neck, button stand, cutaway, shortened back). The МК armhole is "по модели", traced from
  Fig. 32 (rms 0.07 cm map) in chord frames between the constructed ends.
- **Insulated jacket (Table 5.3):** the summer jacket's back yoke (shared), a sloped front yoke
  seam taking the chest dart, the front cut back for the placket, a two-piece sleeve. Hood not
  built.

## БК corrections and open questions
- **Fixed 2026-10-21:** row 23 (О11) is horizontal. 111 sits 0.5 right of 11, level with it,
  so every shoulder is 0.65 shorter. Confirmed by Figs. 2, 7 and by Table 4.3 row 1.
- **Fixed 2026-10-21:** one БК side line from the middle of 341–346 (341′), with the side
  corner 941 = 941′ at the back hem level and the front hem 941 → 96 → 971. It used to be a
  2 cm "side gap".
- **Open:** (1) sleeve.yaml's БК sleeve hem is level, but the book's slopes; (2)
  jacket_imk.yaml's 55/55′ hip levels look swapped (Fig. 9 detail I); (3) the БК front neck
  radius: torso.yaml uses |16–17| (equilateral), but Fig. 32 suggests ≈9.2, and rows 55–56
  use |16–171| with 171 not tabulated.
- **Graded tables 2.4–6.4 (2026-10-22):** two book disagreements, recorded as printed: demi coat
  row 50.1 (2.2: 0, 2.4: 0.5 at the base; open for the maintainer) and insulated jacket row 72 (5.4's base
  18.3 vs 5.2's 18.2, plus 20.4 off trend at 176-112-112; both held). Waistcoat row 44 prints 0
  where grading goes slightly negative. Gate: the demi coat ИМК armhole runs +0.7…+2.1% over ДП
  with size (3 figures fail), the summer jacket cap +0.6…+1.0% (1 fails).
