# ЕМКО СЭВ extraction pilot: men's jacket, Vol. 3 (2026-10-17)

**Source:** ЕМКО СЭВ т.3 *Базовые конструкции мужской одежды* (1988), §1
"Пиджак мужской полуприлегающего силуэта", Table 1.2 (p.6), size 176-100-88,
Fig. 2. a private copy, SHA-256 `422145f8…e3b3`, processed offline in the tools
container (`--network none`).

## What the source gives
Per base construction: a numbered-point draft (Fig.) plus a table where each
row = segment between points, its **formula in body measurements Т##**, the
body value, ease split (ПС movement, ПП interlining, ПТ technological), the
finished-garment value and the **value on the draft**. Point numbers are a
grid: first digit = level (1 neck, 2 shoulder blade, 3 chest, 4 waist, 5 hip,
9 hem), second = vertical line (1 back centre, 3 back width, 5 armhole,
7 front centre). Grading coefficients (p.124) and sleeve/armhole geometry
(pp.127–130) at the back of the volume.

## Result (rows 1–12, the back/front framework)
- Transcribed to [jacket_176-100-88.yaml](jacket_176-100-88.yaml);
  [emko_check.py](emko_check.py) validates and builds the grid.
- **Row arithmetic: 12/12 consistent** (ПК=ПС+ПП, fin=base+ПК, П=ПК+ПТ,
  draft=base+П).
- **Cross-row: every formula agrees with one shared set of body
  measurements to ≤0.01 cm** (least squares; T40=45.5 back waist length,
  T39=21.4, T47=40.7, T57=12.4; T7−T12=29.1 and T15−T14=−5.0 only as
  differences, absolute values come from GOST typical-figure tables).
- Sum row 31–37 checks exactly (52.35 base, 60.15 draft).
- Framework built: half-width 60.15 cm, back length 77.35, levels at 15.5 /
  23.35 / 47.8 / 67.0 (out: `~/custom-clothing/work/emko_jacket_framework.svg`).

## OCR vs vision
Tesseract (rus+eng, psm 6) on the same rows: numbers ~90% right. Errors:
dropped decimal comma (1,2→12; 1,9→19), footnote merged (76,2¹→76,21),
3↔8 in point numbers (31→81), Т→7 (Т40→740), П→11/]. **All are
detectable:** arithmetic identities catch number errors, the point-number
grammar catches 3↔8, formula syntax rules fix Т/П. Pipeline: OCR → rule
cleanup → validate → vision re-read of flagged rows only.

## Assessment
- **Most machine-friendly source found:** explicit formulas, built-in
  redundancy (every row self-checks; formulas cross-check via shared
  measurements), regular point grammar, graded by design (sizes × heights ×
  fullness groups, plus grading coefficients).
- vs Browne (prose + freehand, hand-fitted curves) and Walker (grid,
  near-mechanical but one fixed size): ЕМКО is *parametric*, not one size.
- **Remaining for a full jacket:** rows 13–~95 (shoulder, neck, armhole,
  darts, sleeve, collar) on pp.6, 8–10, 12 (pp.8–10 printed rotated); curve
  rules (armhole/neck curves pass through constructed points: geometry on
  pp.127–130); Т-values for other sizes from GOST tables (or Vol. 1/4).
- Rights note: methods are uncopyrightable (project policy); this pilot uses
  a private copy, offline, extracting the method.

## Full base construction (2026-10-17, continued)
[emko_jacket.py](emko_jacket.py) builds the complete **БК (base construction)**:
back, front and one-piece sleeve for 176-100-88 → [out_jacket_bk.svg](out_jacket_bk.svg),
[out_jacket_sleeve.svg](out_jacket_sleeve.svg) (cm, 1:1).

| Independent check | Built | Table | Δ |
|---|---|---|---|
| Front shoulder vs back shoulder | 16.47 | 16.50 | 0.2% |
| Armhole (incl. 1.0 underarm) vs ДП (row 63.1) | 55.39 | 55.3 | +0.2% |
| Sleeve cap (upper + under) vs ДОР (row 63.3) | 59.21 | 59.15 | +0.1% |
| Sleeve cap height ВОР formula (row 72) | 18.34 | 18.35 | ok |
| Row arithmetic (28 full-column rows) | 28/28 | | |
| Implied waist girth Т18 | 88.0 | size label 88 | exact |

**Debugging that mattered:**
- Shoulder point 14′: a rotation about 22 put it 1.9 cm low and left the
  armhole 3 cm short of ДП. Correct reading: row-35 arc intersected with the
  shoulder-height line through 13–14 (matches Fig. 2 exactly).
- Sleeve crown: 133/144/143 are tangent-guide marks on the top line, not
  curve points. Passing through them made a dip; the cap goes
  132→134→14 (horizontal)→142→352.
- Chest dart opens at the front edge under the lapel (36–371/371′).

**Interpretations still open (marked INTERP in code):** 36 placement (on the
46 vertical), 371 (horizontal from 36), 133 offset (3.2 cm, read off Fig. 3),
142 on line 141→352, neck-curve radii (equilateral construction), hem detail
932/933, shoulder seam refinement 123/123′, meaning of 470/570 (waist/hip
widths; likely dart/side-panel distribution in the model construction ИМК).
**Not yet:** the model construction (Table 1.3: lapel, collar, side panel,
two-piece sleeve), seam allowances, other sizes (needs GOST Т-values or Vol. 4 grading).

## Trousers (§7), base construction + graded (2026-10-17)
- [emko_trousers.py](emko_trousers.py): front + back БК from Table 7.2 / Fig. 34.
  Back vs front **inseam match within 0.06 cm** (independent check of the crotch construction);
  hip width exact; waist 51.7 vs garment 47.1 (the 4.6 cm the model construction's darts remove).
- **Graded across 8 base typical figures** (height 176; chest/waist 92/74, 100/82, 100/88,
  100/94, 100/100, 112/100, 112/106, 112/112) from Table 7.4 (OCR → validated:
  base column = Table 7.2 on all 25 rows, row relations hold per column).
  Inseams match within 0.01–0.09 cm on every figure. Nest: `out_trousers_graded/nest.png`.
- **Source discrepancy logged:** Table 7.4, figure 92/74, row 13 printed 19.8 vs 19.68 implied
  by rows 3 and 11 (verified on the scan; kept as printed).
- INTERP: 511 rise 6.0 cm above the hip line (seat-seam tilt; read off Fig. 34);
  68/68′ on the inseam lines through 58/58′; 581 at the intersection of 68→58 and 54→512.

## Waistcoat (§6), base construction (2026-10-17)
- Same point system as the jacket, so `emko_jacket.py` now takes a garment YAML of draft
  values (`waistcoat_176-100-88.yaml`, Table 6.2 via OCR + arithmetic + vision for 2 rows)
  and skips the sleeve. Jacket regression unchanged.
- Shoulders match 15.92 / 15.85; armhole 54.7; length to hip (back 66.6, front ends at 57).
- V-neck, pockets, lining are model-construction (Table 6.3) work, still to do.

## Summer jacket (§4, workwear), base construction (2026-10-17)
- Shared torso builder + `summer_jacket_176-100-88.yaml` (Table 4.2; no ПТ column, so draft = finished).
  Sleeve constants moved into garment YAML (`sleeve_rows`); suit-jacket regression unchanged.
- Body: shoulders 16.69/16.66, armhole 55.06 vs ДП 55.25 (−0.3%). ✔
- **Sleeve cap 55.72 vs ДОР 57.2 (−2.6%) ✘**: the cap-curve reading (Hermite through
  132→134→14→142→352, 133 offset 3.2 INTERP) was tuned on the suit sleeve and does not
  transfer to this lower/wider cap. Fix = implement the book's **unified arc method for the
  sleeve cap (appendix pp.126–131)** instead of the fitted curve. Next task.
- Hood (Table 4.2 pp.66–68, Fig. 19–20) not built yet.

## Unified arc method for the sleeve cap (appendix pp.126–131), 2026-10-17
- Implemented Fig. 36: tangent polygon 132–134–144–143–142–355(≡352), touch points at
  segment midpoints (3 ≡ 14), straight end runs, arcs centred on intersecting normals,
  chained end-to-start for continuity (book: arcs must share tangents).
- Point **133 no longer guessed**: row 84 + Fig. 3 → 133′ = top line ∩ extension of 345→132,
  133 = mirror of 133′ about 13′.
- Correct target is the jacket table's footnote 6: **actual cap = ДОР − 2|131–132|**.
- **Superseded 2026-10-20:** this pilot chained each arc from the previous arc's end, which
  drifts off the touch points. The pipeline now follows p. 126 exactly; see
  recipes/emko/BLIND_RUN.md ("Cap geometry fixed").

| Sleeve | Cap built | Target | Δ |
|---|---|---|---|
| Summer jacket | 55.96 | 55.80 | **+0.3%** ✔ |
| Suit jacket | 59.79 | 58.27 | +2.6% (open) |

Suit residual is likely 142 (row 78, direction from 141 is INTERP) or the suit's lower-cap
посадка (p.131 coefficient method, Н = 0.07) — not yet applied. Next to resolve.

## Hood for the summer jacket (Table 4.2 hood rows, Fig. 19), 2026-10-17
- [emko_hood.py](emko_hood.py): crown arc about O (square-corner construction), tangent from
  111 to the crown circle, neckline-insertion arc about O1 (from n1 = 172→162 ∩ 012→111),
  3.0 cm neck dart to O, back part redrawn per rows 18–20.2 (111′, O1′, 012′).
- **Independent check:** hood neckline 23.25 cm vs jacket neckline (half back + front) 22.99 cm
  (+0.26 cm, slight easing); front-neck segment identical to the jacket's.
- Debug: rigid rotation of the back segment about O left a gap at 16″ (16′ and 16″ are at
  different radii from O). The table redraws it instead (111′ from two radii, new centre O1′).
- Suit cap +2.6% investigated: constructed points (133, 144, 143, 134, 142, 345) agree with
  Fig. 3 measurements within ~0.3 cm. Fig. 3 draws the cap ~1 cm taller than the table's
  ВОР = 18.35 (figure not to exact scale). Cause not found; left open (1.5 cm extra cap ease).

## Jacket graded across 8 typical figures (Table 1.4), 2026-10-17
- Table 1.4 OCR → `jacket_table14.yaml` (3 OCR glyph fixes, documented) → validated by
  `emko_grade_jacket.py`: base column = Table 1.2 on all rows; per-column relations
  (r9 = r6+r7+r8, r17/r18/r19 from r7, r28 = 0.25·r27, ШОР ≈ r7+5.1, ДОР = 1.07·ДП) hold.
- Built all 8 with the shared builder. **Armhole vs book ДП: within 0.1 cm on every figure**
  (53.27/53.2 … 58.70/58.7); front/back shoulder match ≤ 0.05 cm.
- Sleeve cap = ДОР + 0.5–0.8 cm on every figure (systematic, not size-dependent) → it's my
  cap reading, not data. Same open item as before; consistent across sizes.
- Overlay: `out_jacket_graded/nest.png`.

## Demi-season coat (§2), base construction (2026-10-17)
- Shared builder + `coat_demi_176-100-88.yaml` (Table 2.2; OCR + arithmetic + vision for
  p.28's right-hand columns). New per-garment parameter `k81` (0.25 for the coat vs 0.4).
- Armhole 61.40 vs ДП 61.45 ✔, shoulders 16.14/16.13 ✔, no chest dart (50.1 = 0).
- Sleeve cap = ДОР + 1.06 (+1.6%): same systematic overshoot as the suit jacket.

## Winter coat (§3) + insulated jacket (§5), and a corrected sleeve-cap conclusion (2026-10-17)
- Both built with the shared builder (`coat_winter_…yaml`, `jacket_insulated_…yaml`);
  insulated jacket has no row 81 → к81 = 0 (new garment parameter handles it).
- **Correction:** the summer jacket's ВОР had been OCR-misread (15.05). The row-72 formula
  0.885·ДОР·√(0.25−(ШОР/ДОР)²) reproduces every other garment's printed ВОР and gives
  **15.85** for the summer jacket. The builder now recomputes ВОР and warns on mismatch.
  With that fixed, the "footnote-6 target" match was coincidence; the consistent picture is:

| Garment | Armhole vs ДП | Sleeve cap vs ДОР |
|---|---|---|
| Suit jacket | +0.2% | +1.1% |
| Summer jacket | −0.3% | −0.2% |
| Demi-season coat | −0.1% | +1.6% |
| Winter coat | −0.6% | +1.4% |
| Insulated jacket | −0.6% | +1.3% |

  So the sleeve-cap "open issue" is closed: caps land within 0–1.6% of the book's ДОР
  (the book itself treats ДОР as a calculated target that the drawn cap approximates).

## Jacket model construction ИМК (Table 1.3, Figs. 4–5), 2026-10-17
`python emko_jacket.py <out> --imk` adds `_imk.svg` (back / side panel / front + waist dart)
and `_imk_sleeve.svg` (two-piece sleeve). Base outputs unchanged without the flag.

**Body (Fig. 4, rows 1–19, 28–29).** Seam A (back/side) through 334–333 with waist 432/432′
and hip 532/532′; seam B (side/front) through 354–353 with waist 452/452′, hip 551/551′
(1.5 cm hip overlap that cancels seam A's 1.5 gap). Unprimed points = back/front, primed =
side panel (deduced from the suppression budget).

| Check | Built | Book |
|---|---|---|
| d_т (row 9) | 8.65 | 8.65 |
| suppression 0.4 + 2·2.45 + 2·1.25 + 0.8 | 8.65 | = d_т |
| half-waist of the three panels | 51.42 | 51.5 |
| seam A back vs side | 57.28 / 57.28 | equal |
| seam B side vs front | 51.84 / 51.72 | ≈ equal |

**Two-piece sleeve (Fig. 5).** 135/135′ (mirror at 4.5), roll-overs from lines 136/135→934
(elbow 1.14, underarm 2.23), fronts ±2 cm off the front fold with elbow stretch (452′/452″),
top-sleeve cap continued past the fold by the arc about 343′ (mirror of 343).
Front seam top/under 49.22/48.72 (+0.5 stretch), back 50.71/50.09 (+0.6 ease), cap total
59.24 vs one-piece 59.79 (−0.9%).
Debug: 357′ first took the upper circle–line root (curl upward, +8 cm seam mismatch);
the lower root matches 357's level.

**Not yet:** belly-dart transfer to the pocket line and front-edge shaping (rows 20–36),
lapel/collar (book: "by model", not tabulated), vent detail (935), hem curves.

## Base fix (36) + jacket belly-dart transfer (Table 1.3 rows 20–36), 2026-10-18
**Base correction.** Row 47 is |46–36| = 21.1 (the builder had used |47–36|, putting 36,
361, 16 and the front neck ~3 cm low). Fig. 2's right-angle marks give 471′ = foot of the
perpendicular from 46 to the front edge and 36 on the perpendicular to 46–471′; the chest
line 36→371 runs parallel to the tilted waist. Now 16 sits 1.34 cm below 121 (Fig. 2: ~1.1;
old: ~4.3). The front-shoulder "check" never caught this — it is equal by construction.
- Effect on armholes: base figures unchanged (55.46 vs ДП 55.3), but graded figures now drift
  with belly size (row 44 grows 0 → 4.45 → larger tilt): 92/74 −0.0%, 100/88 +0.3%,
  100/100 +0.7%, 112/112 +1.1%. Open question whether the book measures the tilt off the
  front edge exactly this way for full figures.

**Belly transfer** (`--imk`), two rigid rotations, as Fig. 4:
1. lower front (below pocket cut 453–462 at 87°, and below the waist right of 46) rotates
   about 46 by θ = ∠471–46–471′ (3.49°) → 462′, 453′, front edge lifts to 471′;
2. dart at 462 reduced to 1.5 (row 26, 462″) and the remainder φ = ∠462′–36–462″ (2.30°)
   rotated about 36 onto the lapel edge (сутюжка, 371″): front edge 1.23 cm shorter.

| Check | Value |
|---|---|
| dart opening at 462 | 1.50 (row 26: 1.5) |
| seam B front after transfer vs side panel | 51.72 / 51.84 |
| panel half-waist | 51.40 (target 51.5) |
| pocket-line wedge |453–453″| | 1.85 |

Still not built: back armhole dart/shoulder-ease rows 37–42.3 (23–22–23′, 123″, new back
armhole about O), lapel/collar ("by model").

## Winter coat ИМК (Table 3.3, Figs. 14–15), 2026-10-20
Built as `recipes/emko/coat_winter_imk.yaml` (no pilot). Model (p. 41): yokes front and
back, back centre seam, slanted welt pockets, two-piece sleeve, turn-down collar.
- **Back yoke.** Table 3.2 rows 35–37 (not in torso.yaml) give 141 (R 22–141 = 22–14',
  R 121–141 = 121–14) and 123 (R 22–123 = 22–123'). **123' has no row**; Fig. 14 puts it
  where the dart leg 22–122' meets the shoulder line 121–141. The yoke shoulder 121–141
  stays straight (the dart is eased, hatched in the figure); the angle ∠123–221–123'
  (6.71°) opens the yoke seam at the armhole, 23 → 23'.
- **Front.** The chest dart becomes the front yoke seam (353–36–371 / 353–36–371').
  Rows 7–13.1 turn the lower front about 46 by the belly angle (3.49°).
  **Not in the rows:** 96 (Table 3.2 has none; Fig. 14 puts it on the hem below 46),
  931' (the front hem level 97 on the side vertical), and 451. The side dart's apex 451
  is measured on Fig. 14: on the vertical through 351 (x ≈ 41.5) and on the lower edge
  432'–461'. The two pocket-line edges themselves cross at 461, not there.
- **As printed:** row 13 reads R 96'–931'' = 96–931 (931, the back hem point), while row
  13.1 uses 931'. Built as printed; the difference is 0.07 cm.
- **Side seam:** the front (334 → 931'') is 1.95 cm longer than the back (334 → 931). This is
  the БК's own difference between the back (91) and front (97) hem levels, which the
  jacket's ИМК side panel absorbs. The book doesn't true the hem in the table.

| Check | Value | Target | |
|---|---|---|---|
| two-piece cap | 69.297 | ДОР 69.5 | −0.29% |
| model armhole (yoke + body) | 63.429 | ДП 63.75 | −0.50% |
| row 7, 0.335·r11 | 6.466 | printed 6.45 | +0.24% |

Reports: sleeve back seam top/under 60.18/59.66 (0.52 ease at 334″ and 434′–434″), front
seam top/under 48.75/48.17 (elbow stretch); elbow roll 2.11.

## Demi coat ИМК (Table 2.3, Figs. 9–10), 2026-10-20
Built as `recipes/emko/coat_demi_imk.yaml` (no pilot). This is the jacket's side-panel model
(Table 1.3's rows 1–14 have the same form, with different values). The chest dart (apex 36,
0.8 each side at the waist, rows 15–16) runs down into the pocket cut, and the belly dart
opens at seam B along it (rows 22–26). The lower front is rebuilt from the front edge (rows
27–31). Rows 32–37.3 are the back-shoulder rows the jacket's ИМК still lacks: 1.0 of the
shoulder dart is eased (123'–123''), the rest (2.65°) is shrunk out at the armhole
(23–22–23'), and the upper back armhole is redrawn about O from 142 to 332. The two-piece
sleeve rows are numbered and built as in Table 1.3, so the construction is shared
(`recipes/emko/imk_sleeve.yaml`).
- **Hem (no rows in Table 2.2).** Fig. 7 (p. 25) draws the БК side as one line, with the
  back and front hems meeting at one corner 941/941' on the back hem level. The front hem
  then falls to 96 (below 46) and runs level to 971. Row 8's 952 and 952' are built on that
  line. Seam B closing to −0.27% supports this reading.
- **Hip levels.** Fig. 9 detail I puts 55' (side panel) on the back's hip line (51) and 55
  (front) on the front's (57). jacket_imk.yaml has these the other way round (an INTERP,
  0.25 cm apart in y for the demi coat). Recheck it against Fig. 4 detail when the jacket's
  rows 37–42.3 go in.
- **Also from the figures:** 571 (front edge at hip; row 17's printed d_б = 1.9 checks it
  exactly), 96, 912 (centre back runs on 412–512 to the hem), 932/932' at the back hem level.
- **Not drafted:** the back vent (open, Fig. 9), the sleeve vent's 2.0 underlap (933–935),
  pocket flaps, and the hem's bend at 94 (the shared sleeve runs it straight).

| Check | Value | Target | |
|---|---|---|---|
| two-piece cap | 66.550 | ДОР − 2|131–132| = 66.175 | +0.57% |
| model armhole (back about O) | 61.916 | ДП 61.45 | +0.76% |
| seam B front vs side panel | 81.663 | 81.884 | −0.27% |
| half-waist / half-hip of panels | 55.997 / 61.600 | 56.1 / 61.6 | −0.18% / 0 |
| d_т, d_б by formula | 7.400 / 1.900 | 7.4 / 1.9 | 0 |

Reports: back shoulder 16.38 vs front 15.48 (+0.90; row 32 eases 1.0); belly angle 3.49°;
belly dart mouth at seam B 0.94; sleeve rolls 0.83 (elbow), 1.72 (underarm).

## БК row 23 corrected: 111 is right of 11, not above it (2026-10-21)
Row 23, 11–111 = О11 = 0,5, is a centre-back deviation like rows 24–26 (О41, О51, О91), all
horizontal. Figs. 2 (p. 7) and 7 (p. 25) agree. 111 sits 0.5 right of the frame corner 11,
level with it, under a right-angle mark. The neck line 111–112–12 runs level from 11's height,
and the bold centre-back seam slants from 111 onto the frame line by 21. The pilot had raised
111 by 0.5 instead (emko_jacket.py, never checked against the figure). Fixed in the pilot and
torso.yaml, and the centre back now runs 21 → 111 (11 is off the seam). The fixtures are
regenerated from the corrected pilot.
- Effect: 121 moves (+0.5, +0.5), so every shoulder |121–14| is 0.65 shorter (jacket 16.47 →
  15.82, coats 16.11–16.13 → 15.46–15.48), and the armholes move by ~0.05. Gate status is
  unchanged for every garment: no printed value checks the shoulder.
- Found because Table 4.3 rows 3–4 (summer jacket yoke) project onto the line 21–111. That
  only has a length if the line isn't vertical.

## Summer jacket ИМК (Table 4.3, Figs. 21–22), 2026-10-21
Built as `recipes/emko/summer_jacket_imk.yaml` (no pilot). Model (p. 58): hood, zip, straight
yokes front and back, lower back in one piece (centre back on the fold), one-piece sleeve
with an inner seam, elastic at the hem sides and cuffs.
- **Back yoke.** Row 1's 211 is 21 (Fig. 21: "21≡211"). The printed 16,0 = |111–21| = 16.008
  holds only with 111 beside 11 (БК row 23 above); raised, it would be 16.5. Rows 3–4 lift
  the yoke's neck by |211–211'| = 0.34 along the slanted line 21–111. The dart angle (6.23°)
  opens the yoke seam at the armhole, as in the winter coat.
- **Front.** The yoke seam is square to the front edge 17.0 below 17. The lower front has the
  362–362' ease. The chest dart and the 46–471 belly zigzag are shrunk out (hatched), not cut;
  the belly dart runs 46 → hem (96–96', 3.56°). **As printed** row 17 says /971'–96/ for the
  hem; the dart needs 96', which Fig. 21 also draws, so it is built to 96'.
- **Sleeve (Fig. 22, inner seam).** Both БК under-cap halves are mirrored outward about the
  front fold (vertical 355–95) and the back fold (131–431–933). The elbow dart 441'–431–441''
  is the variant Fig. 22 draws bold; the hem dart (rows 17–18.1) and Fig. 23's back-seam
  sleeve are the alternatives. **The hem arc about O degenerates:** O is where the vertical
  through 95 meets the ⊥ to the hem line at 941, and sleeve.yaml's БК hem is level, so the
  two are parallel. Fig. 22 draws the БК hem sloping (933 below 941), so sleeve.yaml's level
  hem (rows 88–92) is a simplification to revisit. Built straight: 941' = 941 mirrored.
- **БК side line.** Figs. 2, 7 and 21 draw one side line from the middle of the armhole
  bottom 341–346 (labels 341/341', 441/441', 941/941'). Rows 17–18 (a17 = −1, a18 = +1) make
  that bottom a 2 cm flat, which torso.yaml's back and front pieces left open as a "side
  gap". Fixed in torso.yaml the same day (below).

| Check | Value | Target | |
|---|---|---|---|
| one-piece cap | 57.603 | ДОР 57.2 | +0.71% |
| model armhole (yoke + body) | 55.367 | ДП 55.25 | +0.21% |
| row 1, |111–211| | 16.008 | printed 16,0 | +0.05% |

Reports: shoulders back yoke 16.09 / front 15.99; yoke seams 22.90/22.90 (back),
22.83/22.98 (front, ease 0.15); sleeve inner seam 49.19 both sides; elbow dart 7.66°.

## БК side line corrected: one line from the middle of 341–346 (2026-10-21)
torso.yaml gave the back its side line from 341 and the front its own from 346, leaving the
2 cm armhole-bottom flat (rows 17–18, a17 = −1, a18 = +1) as a gap between them. Figs. 2, 7 and
21 draw one side line from its middle (341′). The paired labels 441/441′, 541/541′ and 941/941′
are the back's and front's copies of the same points. The back and front now share that line
and the corner 941 = 941′ at the back hem level. The front hem falls from 941 to 96 (below 46)
and runs level to 971, which is the figures' hem and the reading the demi coat already used.
- 341′ and 96 moved into torso.yaml from the garment recipes. The gates are unchanged
  (armhole and chest are untouched). The demi coat's seam B goes from −0.27% to −0.28%, since
  952/952′ now sit on the shared corner's hem line.

## Insulated jacket ИМК (Table 5.3, Figs. 27–28), 2026-10-21
Built as `recipes/emko/jacket_insulated_imk.yaml` (no pilot). Model (p. 81): hood, buttoned to
the top with attached plackets, quilted yokes front and back, two-piece sleeve, slanted welts,
hem elastic.
- **Back yoke:** rows 1–11.2 are word for word Table 4.3's, now shared (`imk_back_yoke.yaml`).
  Row 1 prints 16,75 = r2, so 211 ≡ 21 again (Fig. 27); |111–21| = 16.757.
- **Front yoke:** the seam runs from 373' (17.0 down the front edge) to 353, 15.0 up the 35
  vertical from 351, and crosses the armhole at 354 (rows 12–13). 362 is the foot from 36. 362'
  is 362 turned about 36 by the chest dart's angle (3.15°) to the right of 36–362, as row 15
  says and Fig. 27 draws. The lower front's top 354–362'–373 is 0.44 longer than the yoke's
  354–373' (the 362–362' посадка).
- **Placket (row 20):** the front edge is cut back by half the placket (2.5), along one line
  through 972 parallel to the front edge. It runs from the hem up through the yoke to the
  neckline (Fig. 27). 972 is measured along the hem (interp). The placket strip isn't drafted.
- **Sleeve (Fig. 28):** the back line 131–333–431–933 is the shared back seam; the front part
  of the БК under-cap is mirrored about the front fold 355–951. The front seam is 341–941 on
  the under sleeve and 341'–941' on the top. Rows 7–8 state the two are equal. They differ by
  0.43 (−0.85%, in gate), because sleeve.yaml's БК hem is level while the front fold tilts by β;
  the book's hem arc would close it.

| Check | Value | Target | |
|---|---|---|---|
| two-piece cap | 64.588 | ДОР 64.45 | +0.21% |
| model armhole | 62.495 | ДП 62.55 | −0.09% |
| row 1, |111–211| | 16.757 | printed 16,75 | +0.04% |
| sleeve front seam top vs under | 49.375 | 49.800 | −0.85% |

## Waistcoat ИМК (Table 6.3 rows 1–27.2, Fig. 31), 2026-10-21
Built as `recipes/emko/waistcoat_imk.yaml` (no pilot). Table 6.3 is "исходная и модельная": rows
1–27.2 are the ИМК, and a second block (МК rows 1–13, Fig. 32) makes the finished waistcoat
(V-neck 16 deep, button stand 2.5, front points, back 9.6 below the waist, darts closed into the
hem, armhole deepened to 143/143′ and "оформляется ... по модели").
- **Waist:** the d_т of 6.5 is taken at the centre back (0.4), a back fish dart at 42 (15.0 =
  0.7|31–33|, 1.6 each side), the side seams (raised 0.5 and in 0.65 each) and a front dart at 46
  (0.8 each). The budget closes exactly. **Hip:** d_б = −0.85, so the side seams are let out by
  0.45 each (0.5·d_б = −0.425, printed rounded). The fish dart's ends 321 (chest line) and 52
  (hip line) come from Fig. 31.
- **Hip = hem (51 ≡ 91).** The back and front share the БК side corner at the back level, so
  541′ = 541's level, and the front hem falls from 542′ to 56 (row 14). Putting 541′ on the front
  hip level made the side seams differ by 3%.
- **Shoulder and armhole:** the back is like the demi coat's rows 32–35 (1.0 ease, the rest
  shrunk at 23–22–23′), but the armhole is redrawn 23′⌒142 on the БК radius instead of about
  O. The chest dart is closed by turning the upper front about 36 (rows 22–27) and opened at the
  armhole 352–352′. Both armhole mouths are hatched like 23–23′ (сутюжка), so they're built as
  shrunk jogs in the outline, not cut darts. That also keeps the front outline from passing
  through 36 twice.
- **Rows 26/26.1** both fix 17′ (a distance along the edge, and a radius from 16′). They agree
  to 1e-6, an independent check of the turn.
- **No ДП:** Table 6.2 has none (no sleeve), so the inherited armhole check is dropped and the
  armhole (54.68) is reported.

## Waistcoat МК (Table 6.3 МК rows 1–13, Fig. 32), 2026-10-21
Built as `recipes/emko/waistcoat_mk.yaml` on the ИМК. It's the first МК (finished-garment)
construction in the catalog: back shortened to 9.6 below the waist (dart open at the hem),
side hem halfway down the hip, a 2.5 button stand, a cutaway front point (971'–972–973), the
hem drawn with the front dart closed (942'', pivot 56), a V-neck 16 deep, and shoulders cut to
10.0 / 11.0 (the 1.0 ease).
- **Rows 10–11 are a Thales construction:** 162 lies on the circle with diameter 172'–373, so
  the V line 373–162 is tangent to the neckline at 162 (built: exactly 90°).
- **Armhole: row 13 says "по модели (см. рис. 32)"**, drawn, not tabulated. It's traced:
  - **Map:** Fig. 32 maps to cm by a least-squares affine fit on six ИМК points (121, 341′,
    321, 331, 351, 41), rms **0.07 cm**.
  - **Trace:** the bold armhole is followed row by row (ink runs 18–60 px wide, the bold
    stroke, with continuity), and by columns along the flat bottom.
  - **Storage:** each half is stored in its chord frame, p = A + u(B − A) + v·perp(B − A),
    with A, B the constructed 143 → 341′ and 341′ → 143′. So the figure's shape spans the
    table's ends.
  - **Smoothing:** one [1,2,1] pass on both halves, two more on the back over the row/column
    joint (largest point move 3.4 mm). The result turns at most 15° between 2.4 cm steps and
    meets the shoulders at 95° (front) and 100° (back).
  - **Length:** 65.1 cm. There's no printed target.
- **Figure vs table (the table governs):** Fig. 32's shoulder ends are 0.81 short (back
  143) and 0.77 short (front 143′, at the trace's own top) of rows 12–13's 11.0 and 10.0.
  Held-out МК points: 942 0.13 cm, 973 0.88 cm and 373 1.20 cm from the construction. The
  upper front (16′, 172′, 373, 143′) is where Fig. 32 and the construction disagree most.
- **New open БК question (front neck):** Fig. 32's neckline centre 172′ sits ≈9.2 from 16′,
  while torso.yaml draws the БК front neck as an equilateral arc of radius |16–17| = 11.5
  (an interp). Table x.2 rows 55–56 give the radius as |16–171|, where 171 is constructive (K)
  and not tabulated. This likely affects every garment's front neck. In the МК it only moves
  162 slightly.

## Graded tables 2.4–6.4: what the book prints that doesn't add up (2026-10-22)
Read by `scripts/emko_grade_ocr.py` (page OCR, then per-cell re-OCR from
`scripts/emko_ocr_rows.py`). Recorded as printed; nothing is "fixed". A cell held as off the
row's trend is left out of the data (`null`), so only that figure's build stops.
- **Demi coat row 50.1 (chest dart), Table 2.2 vs 2.4:** 2.2 prints 0 (no chest dart); 2.4
  prints 0.05, 0.3, 0.5, 0.7, 0.9, 0.95, 1.15, 1.35, i.e. 0.5 at 176-100-88, each 0.25 below
  the jacket's Table 1.4. The reader keeps 2.4 as printed. Open for the maintainer.
- **Insulated jacket row 72 (ВОР), Table 5.4:** prints 18.25, 18.4, **18.3**, 18.15, 18.0, 18.5,
  18.35, **20.4**. The base column (18.3) disagrees with Table 5.2 (18.2), and 176-112-112's 20.4
  is ~2.2 off the row's trend (18.2 expected). Both cells held; the other six fit Table 5.2's
  18.2. Each figure's ВОР is still checked against the row-72 formula in the gate.
- **Waistcoat row 44, Table 6.4:** prints 0 for 176-92-74, where the linear grading gives about
  −0.13: the book prints a quantity that can't be negative as 0 (the reader allows this).
- Single cells held as off-trend (misread or misprint; the scan would tell): demi coat r72
  (cols 176-100-88, -100-100, -112-100: a smudged "21"), summer jacket r74 (176-92-74: 12.25 vs
  ~15.7), insulated jacket r63.3 and r80 (176-112-112: 71.0 and 5.1), waistcoat r44
  (176-92-74, 176-100-88). Held because the re-reads split between two values that both fit
  (the scan decides): winter coat r24 (1.5 or 1.45, three cells), summer jacket r50.1
  (176-112-106: 1.1 or 1.0), waistcoat r44 (176-112-112: 4.45 or 4.4).
- **Gate results on the graded ИМК (dry run, 2026-10-22), not reading errors:** the demi
  coat's model armhole runs over ДП by +0.67% (176-92-74) to +2.10% (176-112-112), failing at
  176-100-94, -112-106 and -112-112. Taking row 50.1 as 0 brings it to +0.66…+1.49% (176-100-94
  then passes). The summer jacket's model sleeve cap is +0.60…+1.01% over ДОР (fails at
  176-112-112), the same overshoot as the base sizes.
