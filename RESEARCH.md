# custom-clothing — research & plan (round 1, 2026-10-16)

## Thesis

Thousands of years of clothing design already exist, and most of the
technical knowledge to draft garments *to an individual's measurements*
was published in tailoring/dressmaking manuals that are now public
domain. The missing piece is not new designs and not a contributor
community — it's **mining that existing corpus into machine-usable,
measurement-driven pattern programs**, then putting a browse →
customize → export (+ 3D preview) front end on it.

Explicitly **not** the direction: a contribution-dependent catalog like
FreeSewing (each design hand-authored by a volunteer, catalog stays thin).

## Legal basis (to verify with a real source before publishing anything)

- **US: garment designs are "useful articles"** — the cut/shape of a
  garment is generally not copyrightable regardless of age. What *is*
  protected: the pattern **document** (drawings, instruction prose, layout),
  plus trademarks/logos and separable decorative artwork (prints).
- **Pre-1931 US publications are public domain** (1930 works entered PD
  2026-01-01). Original manual scans, diagrams and text can be reproduced
  directly.
- **1931–1963 US works whose copyright wasn't renewed are also PD** — a
  large share of mid-century pattern books/manuals. Checkable via the
  Stanford Copyright Renewal Database / Copyright Office renewal records.
  Potentially doubles the corpus; needs per-item verification.
- **Not US**: EU/UK have registered/unregistered design rights and
  life+70 copyright — matters if the site serves those users or uses
  European manuals by authors who died after 1955.
- Archive.org "Public Domain Mark" is metadata, not a legal determination.

### Project policy (the project's decision, 2026-10-16)
- **Drafting methods** are uncopyrightable systems (17 USC §102(b)), so
  any era's method can be extracted into code.
- **Pattern-piece lines:** trace and vectorize directly, treated as fair
  use, including post-1931 scans. Settled; not up for debate.
- **Instruction text:** rephrase from the extracted structure, test it,
  correct it. Use established fair-use practice to its full extent.
- **Naming:** parody names, not pattern-company numbers or brands.

## Source corpus (what exists to mine)

### Drafting-system manuals (the core asset)
These describe *rules*, not fixed shapes — "from point A, square down ¼
breast measure…" — so each is effectively a parametric pattern program
written in prose. That's what makes the corpus usable for made-to-measure.

| Source | Date | Covers |
|---|---|---|
| [Browne, *Up to Date Dress Cutting and Drafting* pt 1](https://archive.org/details/uptodatedresscuttingpartone), [pt 3](https://archive.org/details/uptodatedresscuttingpartthree) | 1907 | Women's bodices, sleeves, tailoring, draping (4 parts) |
| [Kunz, *Manual of Apparel Drafting and Sewing*](https://archive.org/details/manualofappareld00kunz) | 1914 | General garment drafting (LoC scan) |
| [1930 "Dress making" compilation](https://archive.org/details/practical-sewing-and-dressmaking) | ≤1930 | Coates, Blair's system, "simple rule method", scientific tailor system |
| Bisbee, Fountain, Martin, Merz tailor systems ([list](https://jeremyerwin.github.io/blog/2020/02/14/some-books-from-the-internet-archive)) | 1888–1911 | Men's tailoring, jackets, cloaks — availability not yet confirmed |
| W.D.F. Vincent, *The Cutters' Practical Guide* (series) | 1890s | Comprehensive menswear — widely cited, PD; locate scans |
| Simons, *Drafting Trousers* ([1945 ed.](https://archive.org/details/simonsdraftingtrousers1945)) | 1916 1st ed. | Trousers — use the 1916 edition, not the 1945 |

Other places to sweep: HathiTrust full-text (search by "drafting",
"cutting system", "tailor system"), Google Books PD, trade journals
(*Sartorial Art Journal*, *American Gentleman*, *Delineator*), Butterick/
McCall pre-1931 catalogs, Wikimedia Commons.

### Museum extant-garment patterns
- [LACMA Pattern Project](https://www.lacma.org/patternproject) — scaled
  patterns taken off real historical garments, with construction notes.
  Free download; **license not stated** — need to check terms.
- [V&A collections](https://collections.vam.ac.uk/item/O1371281) — has
  pattern records; licensing per item.
- Met / Smithsonian open access: not yet checked for pattern content.

These are *fixed-size* (one body), unlike drafting systems — useful as
style references and for validating that a drafted pattern reproduces a
period silhouette.

## Body data (sizes/shapes for "common body types")

- [ANSUR II](https://www.openlab.psu.edu/ansur2/) (US Army 2012, public
  2017): 93 measurements × ~6,000 adults (4,082 m / 1,986 f). Raw data
  public, 3D scans not. Military population — skews fit/young, **not**
  representative of civilians.
- [NHANES anthropometry via Penn State OpenLab](https://www.openlab.psu.edu/data/)
  — civilian, representative, but only a few measurements (height,
  weight, waist, a few circumferences).
- Combining them: NHANES for population distribution of size, ANSUR II
  for the correlations between the many detailed measurements → generate
  representative measurement sets per size × shape cluster. Shape
  clustering itself (pear/hourglass/etc.) has no good open dataset found
  yet; would be derived.
- GarmentCodeData uses a statistical body model built from CAESAR
  (commercial dataset) — their *derived* body shapes may be reusable even
  though CAESAR isn't.

## Engines (pattern generation + 3D)

- **[GarmentCode](https://github.com/maria-korosteleva/GarmentCode)**
  (ETH Zurich, SIGGRAPH Asia 2023, **MIT**, ~475★, last push 2025-06).
  Python DSL (`pygarment` on PyPI) for parametric sewing patterns built
  from panels/edges/seams, with a configurator GUI and cloth simulation.
  [GarmentCodeData](https://arxiv.org/abs/2405.17609) (ECCV 2024) is its
  dataset: 115k garments across tops, shirts, dresses, jumpsuits, skirts,
  pants on varied bodies. Strongest candidate engine — already does
  measurement → pattern → 3D drape. Gap: its designs are generic
  parametric templates, not historical styles, and it's research
  software (no print-at-home export, no tiling, no instructions).
- **[Seamly2D](https://flathub.org/en/apps/io.seamly.seamly2d)** (GPLv3+)
  — desktop parametric drafting CAD; explicitly targets historical
  drafting methods. Good for hand-transcribing a system, poor as a web
  backend, and GPL constrains reuse.
- **FreeSewing** (MIT, JS) — has the best print-at-home export (tiled PDF)
  and measurement UX; worth borrowing *techniques* from even though its
  contribution model isn't the direction.

## GarmentCode ecosystem — what exists and what we can access (round 2)

| Asset | Where | License | Usable? |
|---|---|---|---|
| GarmentCode + `pygarment` (DSL, GUI configurator, Warp/XPBD sim, pattern fitter/sampler) | [GitHub](https://github.com/maria-korosteleva/GarmentCode) | **MIT** | Yes, freely |
| Garment programs: `bodice, tee, sleeves, collars, pants, skirt_paneled, circle_skirt, skirt_levels, godet, bands, shapes, meta_garment` | `assets/garment_programs/` | MIT | Yes. This is the entire design library, about 12 modules of generic modern parts that combine into tops, shirts, dresses, jumpsuits, skirts, pants |
| Body presets: mean male/female/all (own model) + SMPL averages | `assets/bodies/` | MIT (own); SMPL averages CC BY 4.0 per their readme | Yes. Only the *average* bodies; the 5,000 sampled shapes aren't shared (SMPL restrictions) |
| Body measurement doc | `docs/Body Measurements GarmentCode.pdf` | MIT repo | Yes. Defines their 25 measurements |
| Body shape model + measurement tool (PCA sampler → mesh → 25 auto-measurements) | [GarmentMeasurements](https://github.com/mbotsch/GarmentMeasurements) | **GPL-3.0** | Yes, but GPL (copyleft) if linked into our code; needs Autodesk FBX SDK. Built from 1,700 European CAESAR scans; the PCA model's inclusion in the repo still needs checking |
| GarmentCodeData v2: 115k samples = pattern JSON + draped 3D mesh + segmentation + UV + body measurements + design params + renders; 5,000 body shapes × 2 poses | ETH Research Collection, [DOI 10.3929/ethz-b-000690432](https://doi.org/10.3929/ethz-b-000690432) (blocks automated access; checked by hand in a browser) | **CC BY-SA 4.0** | Yes, commercial use allowed. **Share-alike**: anything derived from the *data* (a modified or extended dataset) must also be CC BY-SA. Doesn't affect our code. Size still unknown; download to Cloudbox when needed |
| Online configurator | [garmentcode.ethz.ch](https://garmentcode.ethz.ch/) (desktop only) | n/a | Back online since 2025-06; good for hands-on evaluation |
| AIpparel: LLaVA-7B fine-tune that generates/edits patterns from text/image; GCD-MM = ~120k GarmentCodeData patterns + captions + edit pairs; includes `garment_specifications_archive.tar.gz` | [Hugging Face](https://huggingface.co/georgeNakayama/AIpparel) (~29 GB total) | **MIT** (HF tag) | Likely the easiest route to the pattern specs without ETH's site. Archive contents not yet verified |
| ChatGarment: VLM → GarmentCode JSON from image/text (CVPR 2025) | [GitHub](https://github.com/biansy000/chatgarment) | Apache-2.0 | Yes. Shows LLM-to-GarmentCode extraction works on modern garments |
| Design2GarmentCode: text/image/sketch → GarmentCode programs (CVPR 2025) | [arXiv 2412.08603](https://arxiv.org/abs/2412.08603) | Code release unconfirmed | Most relevant prior art to our "prose drafting rules → program" step |
| `Pekcfe/GarmentCodeData` on HF | third-party, <1k rows, created 2026-10 | none stated | Ignore. Unofficial subset |

### What this means for us
- **The engine is free to use (MIT); the design library is thin and modern.**
  GarmentCode is a parameter space of generic parts, not a catalog of
  styles. Nothing historical, no tailoring (no jackets/coats/waistcoats,
  no collar stands with set-in band construction, no darts-and-shaping of
  a period bodice beyond its own bodice module). Every classic garment we
  want would be **new garment programs** written in `pygarment`. That's
  exactly where the extraction pipeline plugs in.
- **The dataset mainly matters for ML**, not for sewing. 115k random
  samples of the same ~12 modules don't add designs. They would matter
  if we train or fine-tune an extractor. AIpparel/ChatGarment already show
  that LLMs can emit GarmentCode JSON.
- **Known gaps for real sewing** (from the paper): no seam allowances,
  ease or fit validation discussed; no closures (buttons, zips), layers,
  sharp pleats, or linings; minimal fabric model; measurements drift on
  extreme bodies (bust about +2.8 cm, shoulder width about −4.6 cm). We would
  have to build print export, seam allowance, notches, grainlines and
  instructions ourselves.
- **Body model licensing is the messiest part.** CAESAR is paywalled, SMPL
  restricts sharing, and GarmentMeasurements is GPL. For body-type presets,
  ANSUR II/NHANES (public) + GarmentCode's MIT average bodies may be the
  cleaner route; to be decided.

## Round 3 (2026-10-16): full review of github.com/maria-korosteleva + derived projects

### Author's repos (the research line, oldest → newest)
| Repo | What | License | Relevance |
|---|---|---|---|
| [Body-Shape-Estimation](https://github.com/maria-korosteleva/Body-Shape-Estimation) (2021) | Fits SMPL body under clothing in a 3D scan (C++, Win/VS2017) | MIT code, but **requires SMPL blendshapes (non-commercial only, not redistributable)** | Low. Body-from-scan isn't our need, and the SMPL dependency rules it out for a public tool |
| [Garment-Pattern-Generator](https://github.com/maria-korosteleva/Garment-Pattern-Generator) (NeurIPS 2021) | First-generation template JSON patterns + Maya/Qualoth sim (commercial software) | MIT | Superseded by GarmentCode. Its [template spec with comments](https://github.com/maria-korosteleva/Garment-Pattern-Generator/blob/main/docs/template_spec_with_comments.json) is the best docs for the JSON format GarmentCode still uses |
| [Dataset of 3D Garments with Sewing Patterns](https://zenodo.org/records/5267549) (Zenodo, 2021) | ~23.5k samples, 12 train types (tee, jacket, hooded jacket, dresses, jumpsuit, pants, 2/4/8-panel skirts) + 9 test types; 84.8 GB in per-type zips | **CC BY 4.0** (no share-alike) | Moderate. Includes a **jacket** template, which GarmentCode lacks. Per-type zips can be pulled individually to Cloudbox |
| [Garment-Pattern-Estimation](https://github.com/maria-korosteleva/Garment-Pattern-Estimation) (NeuralTailor, SIGGRAPH 2022) | 3D point cloud → sewing pattern (neural) | MIT | Low for now. Possibly later: "scan a garment you own → pattern" |
| [GarmentCode](https://github.com/maria-korosteleva/GarmentCode) (2023→v2.0.2 2025-04) | The engine (see above) | MIT | **Core** |
| [NvidiaWarp-GarmentCode](https://github.com/maria-korosteleva/NvidiaWarp-GarmentCode) (2024) | Fork of NVIDIA Warp 1.0.0-beta.6 with cloth self-collision, attachment, body-collision constraints | **NVIDIA Source Code License: non-commercial only** | **Licensing blocker for a public/commercial 3D preview.** Upstream [NVIDIA Warp](https://github.com/NVIDIA/warp) is now **Apache-2.0**; the fork's README says they follow NVIDIA's licensing. Fix: port the ~5 documented changes onto current Apache Warp, or ask the author to relicense |

### GarmentCode internals verified from source
- **Print export exists.** `pygarment/pattern/wrappers.py` writes
  `*_print_pattern.svg` and `*_print_pattern.pdf` (non-overlapping
  panels, no fill, cm units, DPI derived from px-per-cm, so 1:1 scale).
  Also `*_pattern.svg/png` and a 3D layout PNG. **Not present:** seam
  allowance (no code mentions it), tiling for home printers, notches,
  grainlines, cutting quantities, instructions.
- **Body = 25 named measurements** in YAML (`bust, underbust, waist, hips,
  waist_line, bust_line, back_width, shoulder_w, shoulder_incl,
  armscye_depth, arm_length, wrist, leg_circ, crotch_hip_diff, neck_w,
  height`…), defined in `docs/Body Measurements GarmentCode.pdf`. That
  maps reasonably onto period drafting measures (breast, waist, scye
  depth, back width…), which is good news for the extraction pipeline.
  Some period measures (nape-to-waist, over-shoulder, inside leg/seat)
  have no direct equivalent yet.
- **Pattern JSON**: panels = 2D vertices + edges (straight/quadratic/
  cubic Bézier) + 3D placement; stitches connect panel edges. Units cm.
- **Design params** are grouped as `meta, waistband, shirt, collar,
  sleeve, left (asymmetry), skirt, pants`, each with value + range.
  Built as one "MetaGarment" configurator, not a catalog of garments.
- **GUI** is a local NiceGUI web app (`python gui.py`), runs in a
  browser, so it's suitable to try on Cloudbox. CLI: `test_garmentcode.py`.
- **Maintenance:** last push 2025-06, 5 open issues; author has moved on
  (latest work with her as co-author is the nesting paper below). Treat it
  as stable but unmaintained. We'd likely work from a fork.

### Projects built on GarmentCode by others
| Repo | What | License | Relevance |
|---|---|---|---|
| [Style3D/design2garmentcode-impl](https://github.com/Style3D/design2garmentcode-impl) (CVPR 2025, pushed 2025-11) | Text/image/sketch → GarmentCode **program** via a multimodal LLM (defaults to GPT-4o via API; configurable base URL) | **MIT** | **Highest.** Closest existing thing to our "prose drafting rules → program" step. Since the base URL is configurable, it might run against Claude or local Ollama |
| [biansy000/chatgarment](https://github.com/biansy000/chatgarment) + [GarmentCodeRC](https://github.com/biansy000/GarmentCodeRC) | VLM → GarmentCode JSON; RC adds **open-front garments**, tighter pants, high waists | Apache-2.0 / MIT | High. Open front is needed for shirts, jackets and waistcoats; reuse RC's garment programs |
| [fittedgenes/GarmentCode-Nesting](https://github.com/fittedgenes/GarmentCode-Nesting) (VMV 2026, Korosteleva co-author, pushed 2026-09) | Genetic-algorithm **cutting layout** on fabric width; can split panels or nudge design params to save fabric without changing fit | MIT | High for the export step: "how to lay pieces on 45″/60″ fabric" |
| [georgeNakayama/AIpparel](https://huggingface.co/georgeNakayama/AIpparel) | LLaVA-7B pattern generator + GCD-MM data (~29 GB) | MIT | Medium. Data mirror, plus a possible local model |
| [0xZoharHuang/garment-cad-mcp](https://github.com/0xZoharHuang/garment-cad-mcp) (pushed 2026-10) | MCP server driving **Valentina + GarmentCode** for LLM agents; its own docs report fit failures (jeans waist) | none stated | Watch, can't reuse. Shows others pursuing agent-driven drafting with Valentina's point-based drafting model (which suits period manuals) |
| [Moon-shiyue/…Traditional_Clothing…](https://github.com/Moon-shiyue/Research_on_Traditional_Clothing_Generation_Models_Based_on_Large_Language_and_Visual_Models) | Chinese traditional-dress GarmentCode component library + 23-rule "form validation engine" | none stated | Can't reuse code. Good **precedent**: a style-specific component library + rule validator on top of GarmentCode is the same shape as our plan |

### Implications
1. **The ecosystem already covers most of the stack**: engine (GarmentCode
   MIT), LLM→program (Design2GarmentCode MIT), open-front garments
   (GarmentCodeRC), cut layout (Nesting MIT), training data (CC BY /
   CC BY-SA). The missing pieces are narrower: **the classic garment
   library itself, a drafting-manual extraction front end, sewing-ready
   output (seam allowance, notches, grain, tiling, instructions), and a
   commercially licensed simulator.**
2. **For public hosting, the only hard license problem so far is the Warp
   fork** (non-commercial) and anything SMPL-based. Everything else is
   MIT/Apache/CC BY(-SA).
3. **Extraction approach:** Design2GarmentCode turns *pictures/descriptions*
   into programs. We want *drafting procedures* into programs, which is a
   different input. GarmentCode is component/parameter based, while period
   manuals are point-construction based (like Valentina/Seamly2D). We may
   need a thin point-construction layer that compiles into GarmentCode
   panels. To decide after a test.

### Still open
- AIpparel `garment_specifications_archive.tar.gz` contents and size:
  probe on Cloudbox if needed.
- GarmentMeasurements: does it ship the PCA shape model?
- GarmentCodeData v2 total size.

## The actual missing infrastructure

1. **Corpus → structured drafting rules.** OCR'd manual text + diagrams →
   a formal representation (steps referencing measurements, points,
   curves). This is the novel, hard, high-value part. LLM-assisted
   extraction with human verification against the original diagram is
   plausible; each extracted system gets tested by drafting it on known
   measurements and comparing to the manual's own worked example.
2. **Common pattern representation.** Probably compile drafted systems
   into GarmentCode panels so one engine handles drape + export.
3. **Wardrobe catalog.** Curated per gender/era/style: which garments
   make a complete wardrobe (shirt, trousers, waistcoat, jacket, coat,
   underlayers; bodice, skirt, dress, blouse, etc.), each linked to its
   source system + period images.
4. **Body-type presets** from ANSUR/NHANES, plus "enter your own".
5. **Export**: full-size plotter PDF/SVG, tiled home-printer PDF, cut
   layout for given fabric width, plus construction steps (modernized
   from the manual, adapted to a home machine).
6. **3D preview** via GarmentCode's simulator.

## Suggested first slice (when moving past research)

One garment, one system, one person: e.g. a men's shirt or trousers from
a single PD manual → transcribe the drafting steps → implement in
GarmentCode → draft to the maintainer's measurements → print, sew a muslin on the
CS6000i, check fit. That validates the whole pipeline (corpus → rules →
engine → export → real garment) before scaling anything.

## Scope decisions (2026-10-16)

1. **"Classic" = timeless.** Not a particular era, not reproductions.
   Period manuals are a source of methods, not a style target.
2. **Corpus: pre-1931 and post-1931 both.** Vectorized post-1931 patterns
   may turn out to be the richer source.
3. **Non-US sources: not yet**, unless clearly not under copyright.
4. **Build on existing work** (GarmentCode ecosystem). Don't reinvent.
5. **Hosting/audience: undecided**, depends on licensing (see Warp fork).
6. **Categories: men, women, unisex, children.**
7. **Infra:** clone repos and pull large downloads on **Cloudbox**
   (a home server) for probing and testing, not on the laptop.

## Not yet researched

- Met/Smithsonian/Europeana open-access pattern content and licenses
- LACMA Pattern Project terms of use
- Existing efforts to formalize/OCR historical drafting systems (none
  found in one search)
- Open body-shape clustering work beyond raw ANSUR/NHANES
- (done in round 3: GarmentCode export + ecosystem review)

## Similar-projects check on GitHub (2026-10-17)
Searched repos/topics/code: made-to-measure, vintage/historical patterns,
pattern drafting, sewing-patterns/pattern-making/garment/valentina/seamly2d
topics, Russian terms (выкройка, конструирование одежды), ЕМКО/EMKO code.
**Nobody is building a classic/public-domain wardrobe corpus or extracting
period drafting systems.** No ЕМКО implementation exists.

| Repo | Overlap | Note |
|---|---|---|
| Dicklesworthstone/franken_textiles (Rust/Wasm, created 2026-10-12, active) | Infrastructure: draft/trace pattern sheets, body fit (Anny), drape, print-PDF/DXF/HPGL export | **License is MIT plus a rider that grants no rights to Anthropic/OpenAI or anyone acting for them** (incl. analyzing/executing). Don't build on it while working with Claude. README only was read |
| aharwood2/JBlockCreator (Java, GPL-3, U. Manchester, dormant 2022) | Published block-drafting methods as code + body-scan input | Same idea as our extraction step, for modern textbooks |
| FabriceSalvaire/Patro (Python) | Valentina-file pattern library | Possible reader/writer for Seamly/Valentina formats |
| JeroenGar/sparrow (MIT, 406★) | 2D irregular nesting | Candidate cut-layout engine |
| kellyjones-jpg/regrade | Vintage pattern grader | Tiny |
| Tailora, sloper-generator, ai-tailor-block-generator, Aras, Costumy, qcad_sewing_patterns_lib, kana001-bit Seamlint/Loomit/Truer, myogpatterns tiled-pattern-exporter, pdfstitcher | Generators/tools | Pieces of infrastructure, no corpus |

## Similar-projects check, round 2 (2026-10-19, against the catalog-pipeline scope)
~140 GitHub repo queries + 14 topic sweeps (EN/RU/DE/FR/ES/IT/PT/JA terms:
drafting systems, grading, sloper/block, AAMA/ASTM D6673, tiled PDF, seam
allowance, digitizing/vectorizing, centerline tracing, nesting, pattern
DSLs, historical/vintage/costume, ЕМКО/ЦНИИШП/лекала), plus web searches
for non-GitHub work (Seamly forum/wiki, GitLab/Codeberg, arXiv).
**Verdict: still nobody extracts drafting systems into data validated
against the source's own printed values.** No ЕМКО/ЦНИИШП code anywhere.
The `ccat` core (recipe + check gate) is not a reinvented wheel. Several
export-side pieces are (see "Use instead of building").

**Nearest prior art (not reusable):**
| Project | What | Why not build on it |
|---|---|---|
| [historical-tailoring.com generator](https://historical-tailoring.com/notebook/why-im-building-a-custom-historical-pattern-generator) | 1750–WWII menswear drafted from period manuals; measurements → print-shop + tiled PDF; built on the **Seamly2D CLI**. Prototype 2025-12, beta 2026 | Commercial, closed ($147–397 lifetime). Confirms demand and that Seamly2D is what period-manual drafters use |
| [fmetivier/OpenPattern](https://github.com/fmetivier/OpenPattern) (Python, **GPL-3**, 15★, dormant 2024-10) | Classic French/Italian systems (Gilewska, Donnanno, Chiappetta) as Python classes; standard sizes in SQLite; tiled A4 PDF | Patterns are code, not data, and there are no source checks. GPL. Its A4 tiling is a reference only |
| [Seamly forum: new drafting system](https://forum.seamly.io/t/discussion-about-a-new-seamly-pattern-drafting-system/14012) (2025-06) | Members propose base patterns from Vincent/Croonborg; one shared Systemschnitt trousers `.sm2d` | Discussion only. Shows a likely audience for a Seamly export of our PD sources |
| [Seamly wiki Pattern Systems](https://wiki.seamly.io/wiki/Pattern_Systems) | Aldrich, Armstrong, McCunn, Knowles implemented | Modern copyrighted systems, no pre-1950 |
| [Joosehot/Aras](https://github.com/Joosehot/Aras) (Rust, licence unclear) | Words → deterministic pattern via lexicon + drafting rules | Modern generic garments; same "fail-closed, no model in the path" stance as ours |

**Use instead of building (export step 5 and later):**
- **Seam allowance:** shapely `offset_curve`/`buffer` (BSD) on piece outlines,
  not our own offsetter. FreeSewing core's SA paths (MIT, JS) are the
  behaviour reference (corner handling, per-edge SA).
- **Tiled PDF:** [myogpatterns/tiled-pattern-exporter](https://github.com/myogpatterns/tiled-pattern-exporter)
  (MIT, Python, PNG → print-at-home PDF): adopt or vendor it for the 1:1
  PNG sheet. [cfcurtis/pdfstitcher](https://github.com/cfcurtis/pdfstitcher)
  (MPL-2.0, 188★, active 2026-07) is the user-side inverse (tiles → one
  sheet, layer/line edits); test our PDFs against it.
  [Ax1zz/tilewright](https://github.com/Ax1zz/tilewright) (licence unclear) keeps size layers.
- **AAMA/ASTM DXF:** the standard is paywalled, so read the layer and
  block conventions from [totorototo/astm-parser](https://github.com/totorototo/astm-parser)
  (Zig, **no licence**: read only) and
  [bera-hpgl-converter](https://github.com/soulaimaneberraadi/bera-hpgl-converter)
  (AccuMark-targeted). Write with ezdxf.
- **Seamly2D export (if wanted):** [FabriceSalvaire/Patro](https://github.com/FabriceSalvaire/Patro)
  (Python, AGPL-3, dormant 2024-08) reads/writes Valentina files; use it
  as a format reference rather than a dependency (AGPL).
- **Nesting:** unchanged: [sparrow](https://github.com/JeroenGar/sparrow)
  (MIT, active 2026-10-19; browser demo sparrow-studio) or GarmentCode-Nesting.

**Watch:**
- [LeonNonnast/d2p-open-standard](https://github.com/LeonNonnast/d2p-open-standard)
  (Apache-2.0, created 2026-10-19, v0): vendor-neutral JSON Schemas for
  pattern semantics (seam pairs, grading, measurement vocab), **versioned
  tolerance profiles and conformance fixtures**. That is our gate's shape. If
  it stabilises, it's a candidate catalog interchange format next to
  GarmentCode JSON (mm + radians, where we use cm).
- [kutur-labs/ktr](https://github.com/kutur-labs/ktr) (Zig, MIT, v0.1,
  quiet since 2026-02): pattern DSL with `search … require curve.length ==
  target`. Same problem as fitting a sleeve cap to ДОР; an idea source only.
- [toros100/draft](https://github.com/toros100/draft) (Rust, MIT, 2026-08):
  Seamly-style parametric drafting. Early.

**Different input, not our vectorizer:** static9/pattern-digitizer (MIT,
ArUco photo of a paper pattern → SVG/DXF), Sliskislimak/image-to-pattern-cad
(no licence), nakitachand/TraceAR. These take photographed physical
patterns; our grid-scan centerline tracer stays.

**Checked, irrelevant:** grading repos (serona C#, garment-bim, Pattern-Forge),
AI "pattern generator" apps (dozens, 0★), ML garment papers (Sewformer,
DressCode, SewingLDM, NGL, GCD-TS: image → pattern for modern garments),
Chinese women's-trousers Qt CAD (wushuangabao, 2021), MATLAB shirt
(ChristinaHein), sewing-pattern-editor (Elm, AGPL, dormant), tmtp (dormant).
