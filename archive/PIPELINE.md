# PIPELINE: scope reappraisal + Claude-free catalog pipeline (2026-10-18)

## Scope (2026-10-18)
The primary goal is now a **catalog of garments**: graded, validated pattern
pieces in open formats, importable by franken_textiles (and GarmentCode) once
built. franken_textiles already covers fitting, drape, and print/cut, so we
don't build our own browse → customize → 3D front end. GarmentCode stays as
an export target and 3D sanity check, not the product.

Until now, extraction has depended on Claude for page reading, OCR repair,
figure interpretation and per-garment code. **Next phase: build a pipeline
that turns source inputs into catalog entries without Claude**, within the accuracy gate below.

### Division of labour
- **Claude:** finding, identifying and vetting sources (unchanged), plus
  writing the source adapter and recipe for the **first garment of each new
  source**. Example: the ЕМКО jacket.
- **Pipeline:** every other garment in that source (other ЕМКО garments,
  other sizes and heights), plus OCR, validation, grading and export. No
  Claude involvement.
- **The pipeline stops and reports instead of guessing.** Examples: an
  unknown construction step, a check over the limit, or an OCR row that won't
  validate. A report goes to the maintainer or Claude. Nothing is improvised.
- If per-source turns out not to work, the fallback is one pipeline per
  garment type. The working assumption is that differences between sources
  outweigh differences between garments.

### Accuracy gate: ≤ max(1% relative, ½ the source's printed step), on every independent check
**Amended 2026-10-20:** each check passes within max(1% relative,
half the step the source prints its values to). Each source adapter
declares that step as `PRINTED_STEP` in cm (ЕМКО 0.05; an inch source
printed to ¼" is 0.635). The cap is ¼" (`MAX_STEP`), and a source without a
declared step gets strict 1%. Why: a value printed to ¼" carries up to ±⅛"
of rounding, which is more than 1% on any dimension under 25". Rosenfeld's
children's checks were failing on print precision, not drafting. The floor
belongs to the source, not the recipe: a recipe's `tol` still only tightens
the relative part. Reports mark checks that pass only by the floor (`ok~`,
`by_floor`).
A piece enters the catalog only if all its checks pass. Checks compare
against values the **source itself prints**, never against our earlier
outputs. Typical checks: printed dimensions, ДП / ДОР, seam pairs that sew
together, row arithmetic, and the implied body measurement against the size
label.
**In gate (2026-10-20):** the winter coat, insulated jacket, summer jacket
and graded jacket 176-92-74 pass every check, after the cap target became the
book's actual cap (ДОР − 2|131–132|, footnote 6) and the arc method was
corrected (recipes/emko/BLIND_RUN.md). ИМК in gate: the jacket 176-100-88
(Table 1.3), the demi coat (Table 2.3), the winter coat (Table 3.3), the summer jacket
(Table 4.3), the insulated jacket (Table 5.3) and the waistcoat (Table 6.3), the jackets
without hoods; all 176-100-88. The waistcoat also has its МК (finished garment), the armhole
traced from Fig. 32 because the book leaves it "по модели".
Currently out of gate (keep out of finished results): the other 7 graded
jacket sizes (+1.06…+1.23%) and the demi coat (+1.22%), all on the sleeve
cap. These are the garments with row 81, and the residual sits within the
footnote's "≅". Also the graded jacket armholes on full-belly figures, up to
+1.1% (112/112). Walker night-shirt front and back: in gate (2026-10-22) with no label rescale (a rescale to
the printed figures would make checks against them circular): scale from the grid per axis,
field 34.00 × 48.81 in measured vs 34 × 49 printed; the figures govern the points, the
drawing the curves. Mitchell box coat: the body is in gate (2026-10-24); its drawn shoulder (5¾ in
against a printed 6) is a report under the project's ruling that the text governs. With the sleeve and
collar it passes 25/25: four slips on the sleeve diagram (p. 61), which the large-size sleeve's
diagram (p. 67) contradicts, are reports under the same rule, extended. Mitchell semi-fitted
jacket (2026-10-24): in gate, 33/33. Mitchell five-gored skirt (2026-10-24): in gate. The printed
surplus (2½; the text gives 2.35) and 11 (drawn 3.77 for 3½ on p. 91) are reports by the project's ruling. Mitchell tight-fitted jacket, single dart
(2026-10-24): in gate, 35/35. Mitchell seven-gored skirt (2026-10-24): in gate, 10/10. Mitchell nine-, eleven-, thirteen- and
fifteen-gored skirts (2026-10-24): in gate, 10/10 each. Mitchell tight-fitted jacket, double dart
(2026-10-24): in gate, 49/49.

## Where Claude is currently required (inventory from the pilots)

| # | Step | Today | Replacement |
|---|---|---|---|
| 1 | Find the pages for each table/figure | Claude reads contact sheets (`survey_item.py`, `contact_sheet.py`) | Per-source page map written once; OCR of headings ("Таблица 2.2", "Рис.") to locate pages for new garments |
| 2 | Table transcription | Tesseract, then Claude vision re-reads flagged rows | Better OCR (benchmark below) + **arithmetic repair** (solve the one wrong cell from row identities) + local VLM re-read; unresolved rows are held |
| 3 | Constructive ("К") rows / figure interpretation | Hand-written per garment (`emko_jacket.py` 34 KB, 16 `INTERP` marks) | **Declarative recipe**: point ops vocabulary (offset, ⊥ foot, arc∩line, arc∩arc, rotate, mirror, tangent arc) keyed to the source's point grammar |
| 4 | Curves | Chosen per case (Hermite, tangent arcs, then the book's arc method) | One curve rule per source (ЕМКО appendix pp.126–131 arc method), declared in the source adapter |
| 5 | Checks | Bespoke in each script | Generic check declarations in the recipe (seam pair, length vs row, row arithmetic, ratio), enforced by the 1% gate |
| 6 | Grid vectorization params | Crop box, tone and width thresholds picked by hand; pieces split by hand | Per-source params + label OCR → rescale to printed dims, piece split, names, grain |
| 7 | Sewing-ready export | Not built | Seam allowance, notches, grain, labels; SVG / DXF / tiled PDF / GarmentCode JSON |
| 8 | Catalog metadata | In prose (FINDINGS) | Catalog entry: source, page, rights, garment, size range, check results, gate status |

**Main risk to the per-source model (step 3).** ЕМКО's constructive rows have
no formula. Their placement came from reading the figure. Garments that
share the torso point system (waistcoat, coats, summer and insulated
jackets) already ran from YAML data alone. Those count as evidence the model
works. New components did not: the hood, trousers (different point layout),
the two-piece sleeve and the side panel all needed new code. The pipeline
will hit these as unknown ops and stop.
**Measure it, don't assume it:** run the jacket-only recipe blind on each of
the other 6 ЕМКО garments and compare against the book's printed checks. The
hand-built versions are the test cases. Garments that stop show which ops
the vocabulary is missing. If the gaps are few and reusable, per-source
holds. If every garment needs new ops, switch to the per-garment-type
fallback.

**Measured (2026-10-19, [recipes/emko/BLIND_RUN.md](recipes/emko/BLIND_RUN.md)):**
the jacket recipe built 4 other garments and 8 graded sizes with no
garment-specific work, so the model holds for a shared point system.
Components with their own construction (hood, trousers) each need a recipe
written once. In practice "first garment per source" is "first garment per
component type per source".

## Tool survey (2026-10-18)
Criteria: accuracy first, then runs on Cloudbox (CPU; GTX 1650 4 GB), then
coding preference.

**Language: Python.** The workload is small: point construction takes
milliseconds, and scan processing is OpenCV / scikit-image. The existing pilots,
GarmentCode, ezdxf and all OCR candidates are Python. franken_textiles is
reached through files, not by linking, so Rust gains nothing for
compatibility. Rust only if a hot spot appears (e.g. nesting via sparrow,
already Rust).

**Construction / pattern format:**
- *Own declarative recipe (YAML) + catalog JSON*: **chosen.** It keeps the
  source's point names and row references, which the checks need.
- Seamly2D/Valentina: rejected as the core format. No official schema, the
  format changes between versions, and it's C++/Qt. A CLI export exists
  (`-f` PDF / DXF / AAMA DXF / tiled PDF), but there's no seam-allowance
  flag. Possible export target later.
  ([CLI](https://wiki.seamly.io/wiki/Command_Line), [no spec](https://forum.seamly.io/t/looking-for-official-documentation-or-xml-schema-for-sm2d-files/15403))
- FreeSewing: rejected. Patterns are JS code, not data, so adopting it means
  a JS rewrite. Its `svg2pdf` tiling backend is a reference for our tiled PDF.
  ([svg2pdf](https://npmjs.com/package/@freesewing/svg2pdf))
- GarmentCode JSON: kept as an **export target only**. It's component-based,
  where period sources are point-based.

**OCR (step 2):** benchmark on ЕМКО pages, using our validated YAMLs as
ground truth. Metric: cell-level digit accuracy, plus the share of rows
the arithmetic checks pass without any vision re-read.
- Tesseract rus+eng: baseline (~90% numbers).
- PaddleOCR PP-OCRv5 / PaddleOCR-VL (0.9B, Russian listed, tables).
  First candidate; check whether it fits 4 GB.
  ([PaddleOCR-VL](https://www.paddleocr.ai/v3.5.0/en/version3.x/algorithm/PaddleOCR-VL/PaddleOCR-VL.html))
- qwen2.5vl:3b via Ollama (~3.2 GB Q4): candidate replacement for Claude's
  flagged-row re-read. Accept only when the row then validates.
- Surya: lowest priority. Weights CC-BY-NC-SA with a waiver under $5M; the
  terms conflict between sources, so check before use.
  ([repo](https://github.com/pyNpy/surya-ocr))
- No public Cyrillic-table benchmark exists, so our own bench is the evidence.
- **franken_ocr** (Rust, CPU-only int8, single `focr` binary; Unlimited-OCR
  ~3B MoE (DeepSeek-OCR-derived) + GOT-OCR2 `--task tables`; Markdown/JSON
  with bboxes; minutes per page on CPU; Cyrillic support not stated).
  Strong fit for Cloudbox, since it needs no GPU. **Same rider as
  franken_textiles, and it names "executing, benchmarking, testing,
  analyzing"**, so it's gated on the same permission. Meanwhile we can bench
  the upstream models it ports (GOT-OCR2, DeepSeek-OCR) under their own
  licenses.
- **llm_aided_ocr** (Python: Tesseract + LLM correction via llama-cpp or an
  API, with a numeric-token recall check). Same rider, same gate. It's also a
  weaker fit: the LLM rewrites text, while our tables need number-exact
  cells. Our arithmetic-identity repair is a stronger check than token
  recall. Its preprocessing (deskew, CLAHE, Otsu) is worth matching.

**Vectorization (step 6):** keep our stroke-width mask + skeleton tracer,
which is already centerline. Potrace and VTracer trace outlines of filled
shapes, not centerlines
([VTracer](https://github.com/visioncortex/vtracer)). AutoTrace has a
centerline mode; it's a fallback only.

**Export:** reuse before building (prior-art round 2, RESEARCH.md
2026-10-19): seam allowance via shapely offsets; tiled PDF from the 1:1
PNG via myogpatterns/tiled-pattern-exporter (MIT), checked against
pdfstitcher. ezdxf for DXF. AAMA/ASTM D6673 layer conventions come later; the
standard is paywalled and was withdrawn in 2019 (D6673-10)
([ASTM](https://store.astm.org/d6673-10.html)). Tiled PDF via reportlab or
pypdf. Nesting later: sparrow (MIT) or GarmentCode-Nesting.

## franken_textiles compatibility (README only; permission still pending)
Per its README: input is `pattern.json`, a pattern sheet image
(PNG/JPEG/WebP traced), or an idea; measurements come as `M.json` or photos;
the body model is Anny (fitted to stature, weight and ~15 girths/heights).
Outputs include SVG, DXF, GarmentCode, PDF, HPGL and cutter files.
Neither schema is documented in the README.
**Plan:** keep source-native measurement names (ЕМКО Т##) in the catalog,
with a mapping table to a neutral set (GarmentCode's 25 / ISO 8559) per
source. Emit SVG + DXF + GarmentCode JSON + 1:1 PNG sheet; the PNG is
importable via its sheet tracer even before any schema work. Write a
`pattern.json` adapter only after written permission. Mark repos "not for
AI training".

## Build order (proposed)
1. Core: geometry ops + recipe interpreter + check engine + 1% gate, as a
   package (`ccat/`?) with pytest. Test oracle = the book's printed values.
2. Port the ЕМКО jacket to a recipe. Must reproduce the hand-built jacket's
   check results.
3. Blind-run the other ЕМКО garments (the risk test above).
4. OCR bench → table ingest with arithmetic repair → Table 1.4 / 7.4 graded
   runs from scans end to end.
5. Export layer (seam allowance, notches, grain, labels, tiled PDF, DXF).
   **First pass done (2026-10-20):** `ccat/export.py` and
   `scripts/catalog_build.py`, with the four in-gate ЕМКО garments as the
   first catalog entries in `catalog/emko/`.
   - Seam allowance: uniform 1.5 cm, recorded in each entry as an export
     default, since the base tables give none.
   - Darts are closed across the mouth and drawn as markings; dart caps
     aren't trued yet.
   - Notches only at points the construction defines (waist level, cap
     top, elbow, dart legs).
   - Not done yet: GarmentCode JSON, AAMA/ASTM DXF layer conventions,
     per-edge allowances (e.g. hems), trued dart caps, nesting.
   - **The four ЕМКО entries are БК, so reference only (found 2026-10-20).**
     ЕМКО's base construction is the basis for ИМК, not a pattern to sew.
     It has no model seams (yokes, side panels), and Fig. 3 draws the
     sleeve as an upper and an under half. (The "1.9 cm side gap" first
     noted here was torso.yaml's error, fixed 2026-10-21: back and front
     share one side line from the middle of 341–346.) The БК export now includes the under half
     (`sleeve_under`), and each entry carries `status.sewable: false`.
     **Plan:** settle the ИМК jacket's checks, build ИМК for the
     other garments, rebuild the catalog from ИМК, then the GarmentCode
     drape, then Simons.
6. **Source #2 = Harry Simons / Clothing Designer Co. family** (decided
   2026-10-19, see SOURCING.md round 5). Claude's first garment is the
   **sack coat from *Science of Grading* (1924)**: body, sleeve, collar.
   The checks are the 4 graded sizes nested in each diagram plus the men's
   proportion table. The pipeline then has to produce the family's other
   garments (pants, overalls, work coat, mackinaw, overcoat, boys') with
   no Claude involvement.
7. Grid adapter (Walker), for style 4 and children: built for the night-shirt (2026-10-22), and
   a figure reader for its engraved numerals (`ccat/figread.py`, 2026-10-22: the trace cache
   lists each field's figures with value and place, or `unread`; sideways captions aren't read).
8. **Women's/children's source (proposed 2026-10-20, the maintainer to pick; SOURCING.md
   round 8).** These no longer wait on ЕМКО vols 2/5/6.
   - ~~Goldsberry 1888 *Book of Diagrams*~~: **fails the gate (checked
     2026-10-20).** The diagrams are in units of physical rulers (No. 18–45)
     whose space length no companion text prints. All its internal checks
     are scale-invariant, so they can't catch a wrong size. Backup only;
     see SOURCING.md "Goldsberry gate check".
   - ~~Blakely & Patton 1907~~: **no independent checks (checked
     2026-10-20).** It's a single-size direct-measure system. Its printed
     inches are construction inputs, and its figures aren't to scale (Fig.
     11's height is −4.7%).
   - **Children's via the Simons family** (*Science of Grading* covers
     boys' and children's; plus *Designing Boys' and Juveniles' Clothing*
     1922). These are graded nests in source #2's own system, so they need
     no new adapter.
   - **Rosenfeld 1911/1918 (checked 2026-10-20):** it has **real result
     checks**. The children's table prints width of back and collar (half,
     seams included) for sizes 2–14, and grading prints increments with
     totals. Width of back on the size-6 box coat is −3.0%, and across the
     7 sizes −1.7…0%. The table is rounded to ¼", which is ±2% at these
     sizes, so it can't meet 1%. The source also contradicts itself on
     size-6 depth and sleeve. See SOURCING.md "Rosenfeld gate check".
   - **Gate question resolved 2026-10-20:** the tolerance is now max(1%,
     ½ printed step), per source (see "Accuracy gate" above). Under it,
     Rosenfeld's width of back passes on 5 of 7 children's sizes. Sizes 6
     and 14 are off by 0.42 cm (−0.167"), which is more than ⅛", so they
     still fail and the pipeline stops on them.
   - **Lesson for vetting:** a gated source must print values that are
     *results*, not just the inputs to its construction (multi-size nests,
     size tables, ДП/ДОР-style totals, finished dimensions). Check this
     first.
   - **Mitchell 1921 ladies'**: numbered-point steps, the same shape as
     Simons. Women's tailored jackets, sleeves, collars, skirts. It may share
     an adapter with the men's Mitchell.
     **Started 2026-10-23 (source #3).** The text prints almost no results, but every draft has a
     to-scale diagram with its points marked. `scripts/mitchell_trace.py` caches each page's
     markers and heavy strokes (`ccat/diagram.py`). The recipe's `drawing:` section fits the page
     on the points the text places by printed measures alone; `marker_near` gives the drawn points
     for checks, and the trace ops take `drawing:` for curves "as per diagram". First garment: the
     box coat (`recipes/mitchell/foundation.yaml`, `box_coat.yaml`), back and front. It's in gate
     (14/14). The diagrams draw the shoulder 5¾ in where the text prints 6; ruled 2026-10-24
     that the text governs and the drawn shoulder is a report (`recipes/mitchell/FINDINGS.md`).
