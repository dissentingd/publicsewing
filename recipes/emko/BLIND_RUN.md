# ЕМКО blind run: the jacket recipe on the other garments (2026-10-19)

Build step 3 (PIPELINE.md). The question: written once for the jacket, does
`recipes/emko/jacket.yaml` produce the other ЕМКО т.3 garments and sizes
without any garment-specific work?

Method: `python scripts/emko_blind_run.py A|B` (each garment runs the recipe for its kind).
Baseline: the pilot's garment-adapted builds
(`tests/fixtures/pilot_garments_ref.json`, made by
`tests/fixtures/make_pilot_garments_ref.py`). Full output:
[blind_run_A.md](blind_run_A.md) (source data only) and
[blind_run_B.md](blind_run_B.md) (plus the pilot's assumptions: r91 = r90/2,
к81 = 0.4 when unstated).

## Sleeve-cap target corrected (2026-10-20)
Read from the page images (`corpus/emko/emko-sev3-1988.pdf`):
- **Footnote 6 to row 63.3** (Table 1.2 p. 12, Table 2.2 p. 30): "Длина оката
  рукава фактическая должна быть меньше расчетной. ДОР_расч − ДОР_ф =
  2|131–132| ≅ 0,9" (jacket) and "≅ 0,8" (demi coat). In other words, the
  actual cap must be shorter than the calculated one. The recipe builds the
  actual cap (from 132), so `sleeve-cap-vs-DOR` now expects
  ДОР − 2|131–132|. It previously expected ДОР, so every cap was being
  judged about 1.5% too leniently.
- **к81 = 0 confirmed** for Tables 3.2 (p. 48), 4.2 (p. 65) and 5.2
  (p. 88): no row 81 is printed, and rows 82 and 85 are built from 131
  ("131–344 = 0,5|131–342|", "0,5|133–131|"), so 132 ≡ 131 and the target
  is ДОР itself. Tables 1.2 and 2.2 print к81 = 0.4 and 0.25; their row 81
  values (0.45 and 0.4) match the built |131–132| (0.44 and 0.413).
- **Result (stage C):** no sleeved garment passes.

  | Garment | Cap built | Footnote target | Δ |
  |---|---|---|---|
  | jacket, 8 graded figures | 57.37–63.59 | ДОР − 0.88 | +2.42…+2.70% |
  | demi coat | 68.06 | 66.17 | +2.85% |
  | winter coat (к81 0) | 71.04 | 69.50 | +2.22% |
  | summer jacket (к81 0) | 58.26 | 57.20 | +1.85% |
  | insulated jacket (к81 0) | 65.31 | 64.45 | +1.33% |

  Graded 176-92-74 passed only against the uncorrected target (+0.83% vs ДОР).
- **The error is in the cap geometry, not the check.** Setting к81 = 0 on
  the jacket lengthens the cap by 0.66, against the footnote's 0.88, so the
  132 mechanism works roughly as the book intends. The base cap from 131 is
  already long: 60.45 against a ДОР of 59.15 (+2.2%), the same size of
  error as the к81 = 0 garments. Leads, in order:
  1. Point 142's direction from 141 (row 78) is an `INTERP` reading.
  2. The unified arc method's touch points: we put them at segment
     midpoints, and the appendix (pp. 126–131) should be re-read for where
     they go.
  3. The p. 131 посадка-coefficient method (Н = 0.07), not applied yet.
- Still open: whether ДОР applies to the ИМК two-piece sleeve (59.34).

## Cap geometry fixed: the arc method as the book prints it (2026-10-20)
Re-read appendix pp. 126–131 from the page images.
- **The bug.** p. 126: "Радиус … на участке 1–2, равный 1–п1, определяют путем
  пересечения перпендикуляров из точек 1 и 2. Центр … O1 определяют методом
  засечек двух дуг R1 из точек 1 и 2." So each arc runs exactly between two
  touch points, with radius |touch − п| (п = where the two normals meet,
  measured from the touch point on the 355 side) and its centre where two
  arcs of that radius from both touch points cross. `geom.arc_chain` had
  instead started each arc where the previous one ended and kept that
  radius, so the chain drifted off the touch points (0.26 / 0.33 / 0.63 /
  0.76 cm on the jacket) and ran long. Fixed in `ccat/geom.py`; the jacket
  cap is now 0.88 cm shorter than the pilot's. The result reports each
  arc's tangent break (0.1°–5°), since the book's arcs are only
  approximately tangent.
- **Row 78 (142) is right.** Fig. 36 draws the radius 141→142, and 141, 142
  and 355 are collinear on the page, so "142 on 141→352 at |141–15|" is what
  the figure shows.
- **p. 131 (Fig. 39) doesn't apply.** It's a method for building the lower
  cap with a chosen посадка, scaling radii by (1 + Н_уч). It lengthens the
  cap and isn't part of the base tables.
- **Result (stage C):**

  | Garment | Cap | Target | Δ | Gate |
  |---|---|---|---|---|
  | insulated jacket | 64.62 | 64.45 | +0.26% | **PASS** |
  | winter coat | 69.89 | 69.50 | +0.56% | **PASS** |
  | summer jacket | 57.64 | 57.20 | +0.76% | **PASS** |
  | jacket 176-92-74 | 56.54 | 56.02 | +0.93% | **PASS** |
  | jacket, other 7 graded sizes | 58.48–62.68 | | +1.06…+1.23% | FAIL |
  | demi coat | 66.99 | 66.17 | +1.22% | FAIL |

- **What's left.** The failures are exactly the garments with row 81 (к81 >
  0). Moving 131 → 132 shortens our cap by 0.66 cm, while the footnote
  allows 2|131–132| = 0.88. That 0.22 cm accounts for most of their extra
  ~0.4%, and the footnote itself marks the relation as approximate ("≅").
  I found no construction step that would close it, so these stay out of
  gate rather than being tuned.

## Result

| Garment | Pipeline | Body vs pilot (53 pts) | Gate (≤1%) |
|---|---|---|---|
| Demi-season coat | runs | identical | FAIL: cap +1.59%; row 9 unverified |
| Winter coat | runs | identical | FAIL: cap +1.42%; row 9 unverified |
| Insulated jacket | runs | identical | FAIL: cap +1.33%; row 9 unverified |
| Summer jacket | **stops**: к81 not in data | (B: identical) | (B: row 9 unverified) |
| Jacket, 8 graded figures (Table 1.4) | **stops**: rows 91, к81 not in Table 1.4 | (B: identical on all 8) | (B: PASS only 176-92-74; caps +1.04…+1.26%; 112/112 armhole +1.12%) |
| Waistcoat | runs with `waistcoat.yaml` (after the torso/sleeve split) | identical | FAIL: row 9 and ДП unverified (not transcribed) |
| Summer-jacket hood | not in the recipe | — | — |
| Trousers | not in the recipe (own point system) | — | — |

**The per-source model holds for the torso.** Every garment that shares the
jacket's point system built with no garment-specific work. Its body came out
identical to the pilot's adapted build, as did the sleeve once к81 came from
the data. Armholes are within 0.53% of ДП on every garment and size except
112/112.

## What's missing

1. **Fixed during this run: a silently wrong constant.** The recipe had
   hard-coded к81 = 0.4 (row 81 coefficient). The coats use 0.25 and the
   insulated jacket 0. The sleeves came out wrong without any error, and the
   winter coat's cap **passed** the gate (+0.95%) when the correct value
   fails (+1.42%). к81 is now a required input, so a missing value stops the
   pipeline.
   **Rule for recipes:** any number that comes from the source goes in the
   data. A recipe only holds a constant that is printed inside a formula
   which is itself the same in every garment.
2. **Data gaps (transcription, not code). Filled by OCR step 4 (2026-10-19,
   [OCR_STEP4.md](OCR_STEP4.md)), except ДП for the waistcoat (not printed).
   It also found the pilot's к81 wrong for the winter coat and summer jacket:** row 9 was never transcribed for
   the 5 non-jacket garments, so the chest-width check is unverified. Row 91
   (cuff midpoint) and к81 are not in Table 1.4. к81 is not recorded for the
   summer jacket (the pilot assumed 0.4). These are OCR step-4 work: read
   the rows from the scans, don't assume them.
3. **Engine: check-only values must not block construction.** This was
   fixed in this run. `check_inputs` values (row 9, ДП, ДОР, d_т) may be
   absent. The checks that need them report "unverified", and the gate
   fails.
4. **Recipe structure: optional components (done 2026-10-19).** The
   waistcoat is the jacket torso without a sleeve and with the front ending
   at 57 (no row 12). `jacket.yaml` is now split into `torso.yaml` (body,
   leaves the front hem point 97 to the garment) and `sleeve.yaml` (extends
   torso). `jacket.yaml` extends sleeve and adds 97 at row 12;
   `waistcoat.yaml` extends torso and puts 97 at 57. The waistcoat builds
   identical to the pilot's. Its gate stays unverified until row 9 or ДП is
   transcribed for Table 6.2.
5. **New components need their own construction.** The hood
   (`emko_hood.py`) and the trousers (`emko_trousers.py`, a different point
   layout) are not expressible as data for the jacket recipe. Each needs a
   recipe written once. It then serves every size and every garment that
   reuses the component (hood: summer jacket; trousers: §7 and likely other
   lower-body garments). This is the boundary of "Claude does the first
   garment only". In practice it's the first garment **per component
   type**. As long as the construction steps are read from figures rather
   than from text, they can't be generated automatically.
6. **ИМК for other garments:** Tables 2.3–5.3 are not transcribed, and
   Table 1.3 is printed for the base size only. Whether its constants vary
   by size is unknown until the graded ИМК data is read.
7. **Already known, out of gate:** sleeve caps over 1% (jacket and coats),
   and the 112/112 armhole. These belong to the construction reading, not
   the port: they reproduce the pilot exactly.
