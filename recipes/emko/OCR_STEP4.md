# ЕМКО OCR step 4: filling the data gaps from the scans (2026-10-19)

PIPELINE.md build step 4, first pass. The pipeline now reads the Table x.2
rows itself (`ccat/ocr.py`, `ccat/sources/emko_ocr.py`) and fills the gaps
the blind run found (`scripts/emko_fill_gaps.py` writes `data/emko/*.yaml`,
with each OCR-derived value's provenance in a comment).

```bash
ssh cloudbox 'cd ~/custom-clothing && docker run --rm --network none -v ~/custom-clothing:/work custom-clothing/tools:2026-10-19 python scripts/emko_ocr_pages.py corpus/emko/emko-sev3-1988.pdf 6-22 24-30 42-48 58-68 82-88 98-104'
```
```bash
python scripts/emko_ocr_bench.py
```
```bash
python scripts/emko_fill_gaps.py
```
```bash
python scripts/emko_blind_run.py C
```

## How the reader works (no Claude in the loop)
1. Render each page at native resolution, run tesseract (rus+eng) at 0/90/270/180°,
   and keep the rotation that yields the most table rows. Text is stored in
   `data/emko/ocr/`.
2. Parse rows: row number, segment, formula, the numeric columns (right-aligned;
   8 with ПТ, 7 without), and the note (`ПС=1,0`, `к81 = 0,4`).
3. Verify with the row identities. Accept a repair only when exactly one cell
   has exactly one plausible misreading (a dropped comma, a merged footnote
   digit, or a known glyph swap) that makes every identity hold. Allowance cells
   printed blank count as 0, but only when exactly one column alignment fits.
4. Constructive rows print only a draft value, so their own columns can't
   check them. Where the table prints a rule over other rows, the rule is
   evaluated (`ccat/sources/emko_formula.py`, added 2026-10-19):
   - scaled segment, `c·|A–B| ± a`: |A–B| is the verified row with that
     segment (3/8-tolerant matching), and `a` comes from the note;
   - armhole trio, ПОР = Н·ДП and ДОР = (1+Н)·ДП, with Н from row 63.2's
     note. Both holding confirms ДП, ПОР and ДОР.
   A row is accepted only when exactly one reading of its printed value (as
   read, or one plausible misreading, at most 2 decimals) matches within
   0.03 cm. Rules over body measurements (Т##) are not evaluated.

## Benchmark against the pilot's validated rows (6 tables, 242 rows)
- **Verified and correct: 110 rows (45%). Verified but wrong: 0.** That is
  79 from row identities and 31 more from formula checks, Т## checks and
  parser fixes. The pilot used Claude vision for the rest.
- Formula checks also confirm the gate's own targets: ДП, ПОР and ДОР for
  Tables 1.2–4.2.
- One false accept was caught during development and closed: ДОР read as
  `59,158` (a merged footnote digit). Values with more than 2 decimals are
  now rejected.
- Still unverified: rows tesseract dropped, full rows with two or more
  misread cells, rows over Т## measurements, and angle rows (°).

## Gaps filled
| Gap | Result | How |
|---|---|---|
| Row 9 (31–37), Tables 2.2–6.2 | 63.5 / 64.6 / 61.65 / 64.55 / 56.2 | verified by row identities; also = r6+r7+r8 of the pilot data |
| к81, Table 1.2 / 2.2 | 0.4 / 0.25 | row 81 note |
| к81, Tables 3.2 / 4.2 / 5.2 | **0** | no row 81 printed, and row 82 starts at 131 instead of 132 (132 ≡ 131) |
| Row 91, graded Table 1.4 | r91 = 0.5·r90 | Table 1.2's own row-91 formula `0,5/95—931/`, parsed |
| к81, graded Table 1.4 | 0.4 | Table 1.2 (same garment) |
| ДП, waistcoat (6.2) | **not printed** | sleeveless: Table 6.2 has no row 63. The armhole check stays unverified |

## What changed because of it
- **The pilot's к81 assumptions were wrong for two garments.** The winter
  coat had 0.25 (written up as "not legible"; the row isn't printed). The
  summer jacket defaulted to 0.4. With the table's к81 = 0, their sleeve
  caps are +2.22% and +1.85% against ДОР. The summer jacket's earlier "within
  0.2%" result depended on the wrong value.
- All 13 garment/size runs build from pipeline-filled data. All row-9 checks
  pass. Gate status:
  - PASS: graded 176-92-74 only (no longer, since 2026-10-20: the cap target is now ДОР − 2|131–132|, see BLIND_RUN.md);
  - FAIL: everything else, on sleeve caps (+1.04 to +2.22%) and the 112/112
    armhole;
  - unverified: waistcoat ДП (not printed).
- One interpretation to confirm against the book: "no row 81 + row 82 from
  131 ⇒ 132 ≡ 131 (к81 = 0)". The alternative would be that the absent row
  means "use the garment family's default". Nothing printed supports that.

## Next for OCR
- Done: formula checks for constructive rows (scaled segment, armhole trio).
- Done, with little gain: rows over Т## measurements
  (`ccat/sources/emko_tsolve.py`). Every Table x.2 is for the same figure
  (header РАЗМЕР 176-100-88), so the verified rows of all six tables are
  pooled and the body measurements solved by least squares. Training rows
  that don't fit are dropped. A prediction counts only if it survives
  leaving out any one training row. The predicted base then picks the reading
  of an unresolved row, and may re-derive one misread non-draft cell.
  - Result: +1 row (4.2 row 6, ПП misread 9,55 for 2,55); 110/242 verified,
    0 wrong.
  - Side benefit: the pooled fit gives waist Т18 = 88.0 (the size label's
    88), with Т47 = 40.7 and Т57 = 12.4 as the pilot found. That is an
    independent check that the tables and their header agree.
  - Why so little: OCR garbles formula text more than numbers (Т40 → 740,
    Т35 → 185, +П → 411), and most remaining unverified rows are segment
    rules or rows tesseract dropped. Higher-yield next steps: a stronger OCR
    engine on the invalid/dropped rows (PaddleOCR or a local VLM, PIPELINE.md),
    and re-reading dropped rows from their bands.
- Recover dropped rows by re-reading the band between neighbouring rows. This
  was tried and works for locating rows, but the row-81 bands turned out to
  be genuinely empty.
- Benchmark PaddleOCR / a local VLM for the full rows that are still invalid
  (PIPELINE.md tool survey).
