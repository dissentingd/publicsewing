# RESEARCH.md: digest (as of 2026-10-16, rounds 1–3 + similar-projects round 2)

**Goal:** open infrastructure for timeless made-to-measure wardrobes (men,
women, unisex, children). Mine existing published drafting methods and
patterns into parametric programs; browse → customize → export (+3D).
Not a FreeSewing-style contributor model. Research/plan stage only.

**Legal policy (decided, not up for debate):** drafting methods are
uncopyrightable (§102(b)); trace and vectorize pattern pieces as fair use,
pre- and post-1931; rewrite instructions from extracted structure; parody
names. Non-US sources only if clearly not under copyright.

**Sources:** pre-1931 drafting manuals on archive.org/HathiTrust (Browne
1907, Kunz 1914, 1930 compilation, 1880s–1910s tailor systems, Vincent),
post-1931 patterns (vectorized), LACMA Pattern Project (terms unchecked).
Body data: ANSUR II (detailed, military), NHANES (civilian, sparse).

**Engine = GarmentCode ecosystem (build on it):**
- GarmentCode/pygarment (MIT): Python DSL, 25-measurement body YAML,
  JSON pattern spec (cm, Bézier edges, stitches), NiceGUI web
  configurator, **1:1 print SVG/PDF export exists**; no seam allowance,
  tiling, notches, grain, instructions. Unmaintained since 2025-06.
- GarmentCodeData v2: 115k samples, **CC BY-SA 4.0** (share-alike on
  derived data). 2021 Zenodo dataset: 84.8 GB, **CC BY 4.0**, has a
  jacket template.
- **Blocker:** NvidiaWarp-GarmentCode (the 3D sim) is NVIDIA
  non-commercial; upstream Warp is now Apache-2.0, so port the ~5 changes.
  SMPL-based assets are non-commercial too.
- Reusable add-ons: Design2GarmentCode (MIT, LLM → GarmentCode programs,
  configurable API), GarmentCodeRC (MIT, open-front garments),
  GarmentCode-Nesting (MIT, fabric cut layout), AIpparel (MIT, model +
  ~29 GB data). Watch only: garment-cad-mcp (Valentina+GarmentCode
  agents), Chinese traditional-dress component library (precedent).

**Missing pieces to build:** classic garment library; manual-extraction
front end (period manuals are point-construction, GarmentCode is
component-based, so a translation layer may be needed); sewing-ready
output; commercially licensed simulator; body-type presets.

**Infra:** clone and download on Cloudbox, not the laptop.
**Hosting:** undecided, depends on licensing.
**Open:** AIpparel archive contents; GarmentMeasurements PCA model;
GCD v2 size; museum licenses; prior drafting-OCR work; body-shape clusters.

**Similar projects (GitHub, 2026-10-17 + round 2 2026-10-19):** none extract
period/government drafting systems into source-validated data; no ЕМКО code.
Nearest: historical-tailoring.com (commercial, closed, Seamly2D CLI, period
menswear), OpenPattern (GPL, classic systems as code), franken_textiles
(license rider excludes Anthropic), JBlockCreator (GPL). **Reuse for export:**
shapely offsets for seam allowance, tiled-pattern-exporter (MIT) for tiled
PDF, astm-parser/bera as AAMA layer references, sparrow (MIT) nesting.
**Watch:** d2p-open-standard (Apache, pattern schemas + tolerance profiles,
v0), ktr (pattern DSL with constraint search).
