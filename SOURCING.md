# SOURCING: base-pattern sources (rounds 1–10, 2026-10-16 to 2026-10-27)

Goal: source **complete timeless wardrobes in 4–6 styles** (men, women,
unisex, children) from content our tools can interpret and vectorize
cheaply. This takes priority over infrastructure, per the extraction pilot
([archive/pilot/FINDINGS.md](archive/pilot/FINDINGS.md)): a prose system with freehand
diagrams costs too much per garment.

## Styles (confirmed 2026-10-16)
Children's is a category within each style, not a style of its own.

| # | Style | Core garments (men / women / unisex / children) | Lineage |
|---|---|---|---|
| 1 | **Tailored classic** | suit jacket, waistcoat, trousers, dress shirt, overcoat / tailored jacket & skirt, blouse, coat / — / boy's suit, girl's coat | English bespoke 1880s→ |
| 2 | **Workwear / utility** | work shirt, work trousers/dungarees, overalls, chore coat / work dress, apron, slacks / overalls, aprons / play overalls, rompers | US workwear 1890s–1950s, USDA "work clothes" |
| 3 | **Military-derived outerwear** | reefer/peacoat, trench/ulster, field jacket, breeches, service shirt / same, cut for women / — / reefer | Naval & army dress 1900s–40s |
| 4 | **Simple everyday (shift & smock)** | tunic/nightshirt shirt, drawstring trousers / shift dress, smock, pinafore, gathered skirt / tee, smock / pinafore, shirt, knickers | school needlework & folk cuts, timeless |
| 5 | **Mid-century casual** | camp-collar shirt, slacks / shirtwaist dress, A-line skirt, blouse / — / play clothes | 1930s–50s American sportswear |
| (6) | *optional:* knit basics | tee, sweatshirt, leggings | modern; may come from parametric code, not scans |

## What makes a source "easy" (scoring criteria)
1. **Geometry form**, best to worst: full-size pieces > **printed grid / scale
   diagram with dimensions** > numbered-point system with tabulated values >
   prose rules + freehand diagram (Browne: avoid).
2. **Worked example**: stated measurements that match the drawn draft, so we
   can validate automatically.
3. **Scan quality**: ≥2000 px on *all* leaves, including text pages (Browne's
   text leaves were 370 px). Clean OCR.
4. **Completeness**: whole garments (all pieces, collars, facings), not one block.
5. **Rights**: pre-1931 or US government work (clean) > verified non-renewed >
   renewed (trace-only per policy, no republishing).

## Tested (downloaded to Cloudbox `~/custom-clothing/corpus/`, surveyed)

| Source | Form | Worked ex. | Scan | Rights | Verdict |
|---|---|---|---|---|---|
| **Walker, *Needlework and Cutting Out* (1909)** [`krl00366374`](https://archive.org/details/krl00366374) | **Grid diagrams, 1 sq = 1 in**, labeled dims, grain arrows (pinafores, boy's shirt, man's nightshirt, knickers, petticoat, chemise) | dims printed on draft | 2016×2764 typ.; 4 low-res leaves | UK 1909, PD in US | **Top pick, style 4 + children.** Near-mechanical vectorization |
| **Woman's Institute, *Pattern Drafting* (Picken, 1920)** [`patterdraftingpicken`](https://archive.org/details/patterdraftingpicken) | Lettered-point drafts + Picken square, measuring guide, average-measurement table | **yes**: model measures listed for the foundation waist; references full-size Plate I | 3191–4086 px, crisp type | US 1920, PD | **Top pick for blocks**, plus its sister course books (series below) |
| **Vincent, *Systems of Cutting All Kinds of Tailor-Made Garments* (1903)** [`b1108865`](https://archive.org/details/b1108865) | Numbered-point systems ("0 to 9 = …"), numbers on diagrams; trousers, breeches, vests, lounge/reefer/frock/morning coats, overcoats, ulsters, military tunic, ladies' bodices/blouses/skirts/capes | per-diagram measures lists | 3200 px, all 284 leaves | UK 1903, PD in US | **Top pick, styles 1 & 3.** More structured than Browne, still needs curve tracing |
| Browne, *Up to Date Dress Cutting* pt 1 (1907) | Prose + freehand diagram | none | diagrams 3000 px, **text 370 px** | PD | Avoid (pilot source) |
| USDA BHE leaflets: *Dresses for Little Girls* (1931) etc. | Photos + advice; patterns were sold via Butterick/Simplicity | — | 2500 px | US gov, PD | **Design reference only**, no pieces |
| USDA "Foundation pattern for winter dresses" (1928) | Radio script | — | — | PD | Not a pattern; titles mislead |

## Rights checks done (NYPL CCE renewals dataset, cloned on Cloudbox)
- **Pepin, *Modern Pattern Design* (1942): RENEWED** 1969 (R467864), so it's in
  copyright until 2037, despite being widely called public domain online.
  Trace-only.
- Also renewed: Hillhouse & Mansfield *Dress Design* (1948), Erwin *Practical
  Dress Design*, Picken *Modern Dressmaking Made Easy*, Poulin *Tailoring Suits
  the Professional Way*, Mauck *Modern Tailoring for Women*, Vogue dressmaking books.
- Not renewed (searched): Rohr, Kopp, Bray: no hits. Needs title-level
  checks before relying on it.

## Strong leads, not yet tested
- **Woman's Institute course series (1915–30, PD):** 49 items on archive.org,
  incl. *Draping and Designing with Scissors and Cloth* (1924), *Tailored
  buttonholes… tailored skirts…* (1923), *Underwear and Lingerie* (1925/26),
  *Aprons and Caps*. Look for *Tailored Garments*, *Children's Clothing*,
  *Advanced Pattern Drafting*. Check whether full-size **Plates** are included in scans.
- **British school needlework manuals (1884–1909, grid diagrams):** Longmans'
  *Complete Course of Needlework… and Cutting Out* (1901), Rosevear *Text-book
  of Needlework… Cutting Out* (1893), Jones *Manual of Plain Needlework and
  Cutting-Out* (1884/86). Same grid style as Walker → children/underwear/simple.
- ***The American System of Dressmaking* (1907–12, 1,000+ pp)**, *Margaret
  Blair system* (1897/1904), *Scientific Sewing and Garment Cutting* (1898).
- **Vincent, *Cutter's Practical Guide… Shirts, Undergarments* (1890)**
  [`vincentmakingshirts18xx`]: the jp2 stream is corrupt on archive.org; try the PDF.
- **US gov military specs:** Navy "Shirts, chambray, blue" specs (1941–46),
  QMC M608 "cut-make-trim" manuals; catalogued, scans not found yet. Try
  HathiTrust / NARA. Would be ideal for style 2/3 (graded, dimensioned).
- **USDA *Children's Body Measurements* (O'Brien, 1939)** and *Women's
  Measurements for Garment and Pattern Construction* (1941): PD anthropometric
  data behind US sizing. Use for body presets, not patterns.
- **Already-vector, MIT-licensed:** FreeSewing's design library (bodice/trouser
  blocks, chinos, shirt, jacket, coat, tee…). It's code, so it's the cheapest
  possible source of base patterns. The maintainer rejected FreeSewing as the *project
  model*; using its designs as *inputs* is a separate decision for the maintainer.

## Ruled out
- CoPA (URI Commercial Pattern Archive): subscription catalog of envelope images, no full patterns.
- LACMA Pattern Project: clean but historical costume, not timeless (and license unclear).

## Coverage so far (tested sources only)
| Style | Men | Women | Children |
|---|---|---|---|
| 1 Tailored | Vincent ✔ | Vincent ladies' ✔, WI (blocks) | — |
| 2 Workwear | Vincent trousers (partial) | — | — |
| 3 Military outerwear | Vincent reefer/ulster/tunic/breeches ✔ | Vincent ladies' ulster ✔ | — |
| 4 Simple everyday | Walker nightshirt/shirt ✔ | Walker chemise/petticoat (underwear) | Walker pinafores/knickers ✔ |
| 5 Mid-century | — (needs non-renewed 1930s–50s) | Pepin trace-only | — |

**Gaps:** workwear (needs military/gov specs or 1900s workwear catalogs),
mid-century (needs verified non-renewed commercial patterns), and women's
everyday outerwear.

## Round 2 (2026-10-16): WI series, British grid manuals, workwear, mid-century

### Tested
| Source | Form | Scan | Rights | Verdict |
|---|---|---|---|---|
| **Pivnick, *How to Design Beautiful Clothes* (1949)** [`pivnickdesignclothes1949`](https://archive.org/details/pivnickdesignclothes1949) | Modern flat-pattern design: numbered-point foundation bodice/skirt/sleeve, dart manipulation, collars (convertible coat, military band), set-in/raglan/dolman sleeves, **trousers/slacks/shorts**, children's dresses, coats, capes; **graded Misses' size chart** appendix | 1635–2380 px, clean line art | **PD: HathiTrust-cleared**, no renewal in CCE | **Top pick, style 5 + women's blocks.** Modern uncorseted figure |
| WI *Library of Dressmaking: Tailored Garments* (1925) [`womansinstitutel0000unse_p6g4`](https://archive.org/details/womansinstitutel0000unse_p6g4) | Construction (seams, plackets, pockets, buttonholes, suits/coats/capes, **garments for men & boys**: shirts, trousers, house coats), photos; few drafts | 1800+ px | PD | **Instructions source**, not patterns |
| Rosevear, *Text-book of Needlework… Cutting Out* (1893) | Mostly stitches/knitting; a few grid layouts (shirt/nightgown) | 2600 px | PD | Low; Walker covers this better |
| Jones, *Manual of Plain Needlework and Cutting-Out* (1886) | Grid plates + point-by-point statements ("From A measure 2 down…"); petticoats, baby clothes | 2147 px | PD | Low–medium (children/underwear) |
| Shelton, *How to Design Your Own Clothes* (1934) | Design sketching, silhouettes | 4275 px | PD mark, no renewal | Style reference only |
| *Distinctive Clothes* (1940) | Home-ec textbook: adapting commercial patterns, construction | 1589 px | PD mark | Instructions/reference only |

### Menswear trade manuals found (pre-1931, text-triaged, not yet image-surveyed)
Croonborg *Grand Edition of Supreme System for Producing Men's Garments* (1907)
[`grandeditionofsu00croo`] and *New Supreme System* (1917) [`newsupremesystem00croo`];
Regal *American Garment Cutter* (1904/08/14) and **_American Pattern Grader_ (1917)**
[`americanpatterng00rega`] (grading = multiple sizes); *Gordon's Work on
Cutting Men's Garments* (1910); Vincent *Cutter's Practical Guide*: jacket
cutting (1897), British military uniforms (1902), body coats (1893);
*Practical Essays on Shirt Cutting* (1881) [`cihm_34564`]; Strickland *A
Tailoring Manual* (1956, HathiTrust PD). These cover suits, trousers, coats,
shirts, grading: **styles 1 & 3**. **None cover overalls/jumpers/chore coats.**

### Workwear (style 2): still the gap
- No digitized overall/work-shirt/chore-coat drafts found in archive.org's
  trade manuals or USDA leaflets (USDA *Work Clothes for Women* 1942 = design
  reference; patterns were sold commercially).
- WPA sewing rooms made trousers, coveralls, shirts from stock patterns. Not
  digitized; possible NARA (WPA records, RG 69) lead.
- QM / Navy specs (e.g. P.Q.D. 246 jungle suit 1942, Navy chambray shirt
  specs 1941–46) are catalogued but no scans found.
- **Practical fallback:** workwear garments are simple derivatives of blocks
  we *do* have: work shirt ← shirt drafts (Vincent 1890/1903, Walker, shirt
  essays 1881), dungarees ← trouser drafts (Vincent, Croonborg, Pivnick),
  overalls = trousers + bib, chore coat ← sack/lounge jacket simplified.
  Document each derivation with a period style reference (Sears/Ward catalogs
  1932/1941 are on archive.org, PD-marked).

### Blocked / needs the maintainer
- **HathiTrust** blocks automated access (Cloudflare bot check on catalog,
  403 on Hathifiles). It is the best place to find rights-cleared 1931–63
  full-view books. Searches for the maintainer to run in a browser (Full view only,
  1931–1963): "pattern drafting", "flat pattern", "pattern making",
  "dressmaking", "tailoring", "overalls", "work clothing", "Quartermaster
  specification", "children's clothing patterns".

## Coverage after round 2
| Style | Men | Women | Children |
|---|---|---|---|
| 1 Tailored | Vincent ✔, Croonborg/Regal/Gordon (found) | Vincent ladies' ✔, WI drafting ✔ | — (Regal grader may help) |
| 2 Workwear | derive from shirt/trouser/jacket drafts | derive from Pivnick slacks/shirts | derive |
| 3 Military outerwear | Vincent ✔, Vincent military uniforms (found) | Vincent ladies' ulster ✔, Pivnick coats/capes ✔ | — |
| 4 Simple everyday | Walker ✔ | Walker ✔ | Walker ✔, Jones |
| 5 Mid-century | Pivnick trousers (women's cut) | **Pivnick ✔** | Pivnick children's dresses ✔ |

Remaining real gaps: dedicated workwear drafts, men's mid-century casual
(camp shirt; derivable from shirt drafts), children's tailored/outerwear.

## Round 3 (2026-10-17): government sources

**Key finding:** modern government garment *specifications* are freely
downloadable and rich, but they **never contain the pattern geometry**:
patterns are "government-furnished" to contractors separately. So government
docs split into two tiers:

### Tier A: open now (download freely): construction + graded measurements
| Source | Content (tested) | Use |
|---|---|---|
| **US MIL specs via [EverySpec](https://everyspec.com/FSC-CODE/8405/) / DLA ASSIST**, e.g. [MIL-S-87046A](https://everyspec.com/MIL-SPECS/MIL-SPECS-MIL-S/MIL-S-87046A_44698/) Shirt, Utility, Man's (USCG, 1986, 40 pp, tested) | Construction operation table (every seam: stitch type, seam type, SPI), **finished-measurement table by size**, flats with measuring points, materials, defect classification. Patterns listed as government-furnished | **Instructions + validation/grading targets** for workwear (style 2) & military (style 3). Leads: MIL-S-3001 (OG-107 utility shirt, 1958→82), MIL-T-838 (OG-107 trousers), MIL-J-3001, FSC 8405/8410/8415 indexes |
| **Ukrainian MoD technical descriptions (ТО/ТУ)**, e.g. [men's service uniform](https://mod.gov.ua/assets/tu_k_sh_88419e9b3f.pdf) (34 pp, tested) | Flats, **full piece list with cut counts**, **graded finished measurements per size × height**, materials, construction | Same as above; very clean modern tables. Ukrainian copyright law also excludes official documents |

### Tier B: pattern geometry exists, but behind a request
| Source | What | Route |
|---|---|---|
| **DLA Troop Support C&T Technical Data Repository** | Current graded government patterns as **Gerber AccuMark** zip (paper on request) for every issue item (ACU, utility, dress, coveralls…). US federal work → PD (17 USC §105) | Contractor portal (DIBBS/CAGE, not something I can register for), **or a FOIA request to DLA Troop Support** naming specific items. Best single government geometry source. I can draft the FOIA text |
| **NARA RG 92 (Quartermaster General) / Army Quartermaster Museum** | WWII-era QM patterns/pattern dates referenced on garment labels (P.Q.D. specs) | Archive request/visit; not digitized |
| **NARA RG 69 (WPA)** | Sewing-room stock patterns (trousers, coveralls, shirts, children's) | Archive request; not digitized |
| **UK National Archives (Board of Trade, Utility CC41, 1941–52)** | Numbered Utility patterns (suits, skirts, coats). Published Crown copyright expires after 50 years | Archive request; not digitized |

### Soviet / CMEA
- **ЕМКО СЭВ** (ЦНИИТЭИлегпром/ЦНИИШП, 1988): volumes for theory (т.1), base
  constructions for women (т.2), men, children (incl. girls, т.5). Formula-based point
  construction from typical-figure tables, **actual geometry**, unlike modern
  specs. Official catalogue: [НЭБ](https://rusneb.ru/catalog/000200_000018_rc_426811/)
  (**geo-blocks non-Russian traffic**). archive.org has almost nothing Soviet on
  garment construction (only Бланк, *Кройка женского платья*, 1952). The
  volumes are not public domain: a copy means a used print copy or a library.
- **GOST typical figures** (ГОСТ 31396-2009 women, 31399 men, 31400, older
  17522-72; children's series): sizes × heights × **4 fullness groups (=
  body-shape classes)**, exactly our "common body shapes". Full texts are sold
  by Росстандарт; tables are reproduced in university course PDFs. Useful for
  body presets alongside ANSUR/NHANES.
- Not yet searched: East German TGL garment standards, Czechoslovak ČSN, other
  CMEA design institutes.

### What this means for styles 2 & 3
Use **pre-1931 drafting books for geometry** (Vincent, Croonborg, Regal,
Walker, Pivnick), **government specs for construction, finished sizes and
grading targets**, and pursue **one FOIA to DLA** for authoritative graded
patterns of a handful of classic items (utility shirt, utility trousers,
peacoat/reefer, field jacket, coveralls).

## Round 4 (2026-10-17): the maintainer's HathiTrust finds, DLA details, ЕМКО СЭВ, NARA

### The maintainer's HathiTrust finds (all checked against NYPL CCE renewals)
| HathiTrust id | Title | Renewal | Open mirror | Verdict |
|---|---|---|---|---|
| uiug.30112101477625 | Pivnick, *How to Design Beautiful Clothes* (1949) | none | `pivnickdesignclothes1949` | already top pick (confirms) |
| coo.31924003596800 | Arny (Clara Brown), *Clothing Construction* (1934, 332 pp) | none; HT says PD | `brownclothingconstruction1934` | instructions source |
| ? | Dickson & Blondin, *New Encyclopedia of Modern Sewing* (1943–48) | none | `B-001-001-414-03` (1948, 370 pp, 3300+ px) | instructions + a few **grid patterns** (e.g. Pattern XVIII), so it can go through the grid pipeline |
| ? | Helen Hall, *Simplified Home Sewing* (1943) | none | `hallsimplifiedhomesewing1943` (jp2 corrupt; PDF works) | text + margin diagrams: instructions only |
| ? | Picken, *Singer Sewing Library* v.3 | none under that title | lending copy only | not surveyed |
| ? | *Dressmaking Made Easy*: **edition unknown** | none (Picken's *Modern…* and Palestrant's are different, renewed works) | 1919 (`dressmakingmadee00cono`), 1946 rev. (`dressmaking-made-easy`) | need the maintainer's edition |

### DLA government patterns: how access actually works
- Form: <https://www.dla.mil/Troop-Support/Clothing-and-Textiles/Industry-Support/Spec-Request/>.
  Public, no login. "For vendors and DLA employees". Fulfilled **within 5
  business days**. Request types: spec/CID, **pattern**, drawings, cartoons, swatch.
- Required: company name/address/POC, item description/NSN, **solicitation
  number** (N/A allowed only for swatch requests), so pattern requests are
  expected to reference an open DLA solicitation (public on SAM.gov).
- Delivery: **Gerber AccuMark** zip (storage area v9+; DLA won't convert)
  or **paper** if requested in special instructions (shipped via the requester's FedEx account).
- No CAGE/SAM field on the form itself. Alternative for a non-vendor: FOIA to
  DLA (no precedent found either way).
- AccuMark is proprietary. Opening it needs AccuMark (or a converter to
  DXF-AAMA); paper patterns avoid that and fit a scan/vectorize pipeline.

### ЕМКО СЭВ: in hand + what to look for
- **In hand:** `emko-sev3-1988.pdf`, Vol. 3 *Базовые конструкции мужской
  одежды* (1988), 133 pp, image-only scan 2500×3526, 51,144,001 bytes,
  **SHA-256 `422145f88bcbca1d8cf177232840fe5bc533994460de4a9638fbcdb1d7f0e3b3`**.
  Copied to Cloudbox `~/custom-clothing/corpus/emko/`.
- **Contents (surveyed):** base constructions for men's jacket, coat, summer
  hooded jacket, two-piece sleeves, collars; each draft has numbered points +
  a **table of the formula for every point with computed values across
  sizes/heights/fullness groups**; grading-coefficient tables (p.124);
  armhole/sleeve-head construction geometry (pp.127–130). **Effectively a
  printed parametric program.** Best-structured source so far. Needs Russian
  OCR (tables + formulas). Then extraction is mostly transcription, not interpretation.
- **Volume set:**
  | Vol. | Title | Held |
  |---|---|---|
  | 1 | Теоретические основы | no |
  | 2 | Базовые конструкции женской одежды (1988) | no |
  | 3 | Базовые конструкции мужской одежды (1988) | **yes** (personal copy, not for redistribution) |
  | 4 | Градация деталей женской и мужской одежды (1989) | no |
  | 5 | Базовые конструкции одежды для девочек (1988/90) | no |
  | 6 | Базовые конструкции одежды для мальчиков (1988/90) | no |
- **Search terms:** `ЕМКО СЭВ том 2`, `Единая методика конструирования одежды СЭВ
  базовые конструкции женской одежды`, `ЕМКО СЭВ градация деталей`,
  `ЕМКО СЭВ базовые конструкции одежды для девочек`, `… для мальчиков`,
  `ЕМКО СЭВ теоретические основы`. libarch.nmu.org.ua (a Ukrainian university library
  repository) lists the girls' volume.

### NARA WPA patterns
- **Not digitized** as pattern sets. Catalog hits (3,200 for "WPA sewing project
  patterns", online-only) are Louisiana WPA correspondence microfilm (RG 64
  copies; one reel covers "Home Economics, 1939–1940") and RG 69 photo
  indexes. A reference inquiry to NARA (RG 69, Women's and Professional
  Projects division) is needed before expecting patterns.

## Round 5 (2026-10-18): men's sources, the maintainer's finds + author/publisher follow-up
**Process lesson:** the best family below turned up from a plain archive.org
*author/publisher* search on one of the maintainer's finds. Rounds 1–4 missed it
because we never followed author and publisher threads. From now on, every
good find gets an author + publisher catalog search before we move on.
Scans were checked from contact sheets (`~/custom-clothing/work/review/` on
Cloudbox); PDFs are in `~/custom-clothing/corpus/<id>/`.

### The maintainer's four
| Source | What it is | Scan | Verdict |
|---|---|---|---|
| Simons, *Science of Grading Patterns for Men's and Young Men's Clothing* (1924, 2nd ed.) [`scienceofgrading00simo_0`](https://archive.org/details/scienceofgrading00simo_0) | 40 full-page lettered-point diagrams with **4 graded sizes nested in each**, plus step text giving the per-size increments. Covers sack coat, vest, pants, overcoats (balmacaan, raglan, chesterfield), frock, full dress, tuxedo and stout figures. **Men's proportion table, sizes 34–52** (p.9) | LoC, 300 ppi (2592×4285 page images), crisp | **Top pick.** Grading is built into the geometry, so the nests double as validation |
| Regal, *American Garment Cutter* (1904) [`americangarmentc01rega`](https://archive.org/details/americangarmentc01rega) | Lesson per garment: a **worked measure set** (e.g. breast 38, waist 34, seat 39), then lettered steps with inch values, and a full-page diagram on the facing page. Sack coats, frock, overcoats, vests, trousers | LoC, 400 ppi, light but clean | **Strong.** Close to Woman's Institute in form; worked example = check values |
| Vincent, *Cutters' Practical Guide* pt 1, young men's/youths' (1898, 3rd ed.) [`cutterspracticalguide-part-1-youngmens`](https://archive.org/details/cutterspracticalguide-part-1-youngmens) | Text up front; ~12 plates of shaded pieces with point numbers (trousers, vests, military, livery, boys) | **100 ppi**: plate images about 1082×826 px for a whole plate | System good, scan too coarse for ≤1%. Look for a better copy |
| US Navy *Uniform Regulations* (1922) [`uniformregulatio00unit`](https://archive.org/details/uniformregulatio00unit) | Construction specs + **finished-garment size tables** (13 sizes: waist / inseam / seat / knee / bottom for trousers; chest / length / sleeve for the jersey; also the jumper and overcoat), plus illustration plates | 500 ppi | **No pattern geometry.** Validation targets for style 3 (sailor trousers, jumper, overcoat), like the MIL specs |

### Found by following the threads
| Source | Covers | Scan | Rights | Verdict |
|---|---|---|---|---|
| **Simons / Clothing Designer Co. family** (same lettered-point system and same author as *Science of Grading*): *Drafting Pants and Overalls* (1916) [`draftingpantsove00simo`](https://archive.org/details/draftingpantsove00simo); *Drafting Cotton Garments and Mackinaws* (1918) [`draftingcottonga00simo`](https://archive.org/details/draftingcottonga00simo); *Designing Overcoat Patterns* (1916) [`designingovercoa00simo`](https://archive.org/details/designingovercoa00simo); *Designing Sack Coats, Dress Coats and Vests* (1918) [`designingsackcoa00simo`](https://archive.org/details/designingsackcoa00simo); *Designing Boys' and Juveniles' Clothing* (1922) [`designingboysjuv00simo`](https://archive.org/details/designingboysjuv00simo); *Science of Grading* 1st ed. (1916, men's, boys' and children's) [`scienceofgrading00simo`](https://archive.org/details/scienceofgrading00simo) | Pants (regular, stout, young men's, peg, work), **overalls (bib, apron, one-piece)**, riding breeches, knickers, proportion tables; **work coat, stout work coat, barbers' coat, grocers' gown, military blouse, boys' work coat, bar vest, mackinaws** (shawl, convertible, military collar, raglan); overcoats; sack/dress coats and vests; boys' 4–18 | LoC, 300–400 ppi, one diagram per page | US, pre-1931 → PD | **Best men's source found; second after ЕМКО.** One system covers styles 1, 2 (fills the workwear gap), 3 (military blouse, breeches, mackinaw) and boys. Ideal for the per-source pipeline |
| Simons, *Drafting Trousers for Men, Boys, Women* (1945) [`simonsdraftingtrousers1945`](https://archive.org/details/simonsdraftingtrousers1945) | Trousers, a later version of the same system | 600 ppi | No renewal found in local CCE data (1950–1990 files; Simons, Harry and title searched) | Usable; mid-century style 5 trousers |
| Bridgland (ed.), *Modern Tailor, Outfitter and Clothier* (1919, 4th ed.), vols 1–2 [`moderntailoroutf0001asbr`](https://archive.org/details/moderntailoroutf0001asbr), [`0002`](https://archive.org/details/moderntailoroutf0002asbr); vol. 3 only on DLI | Comprehensive British trade reference; framed diagrams, but **several contributors' systems mixed** (Tuckett, Poole, …) | 360 ppi | UK 1919 → PD in US | Secondary; many systems = many adapters |
| Schorr, *American Designer and Cutter* (1915) [`americandesigner00scho`](https://archive.org/details/americandesigner00scho) | Bold numbered-point diagrams + a proportionate-measurement table; men's and women's (vests, coats, waists, skirts) | 400 ppi | US 1915, PD | Good backup system |
| Mitchell, *"Standard" Work on Cutting* (1884/1886/1894) [`standardworkoncu00mitc`](https://archive.org/details/standardworkoncu00mitc); *New Standard Coat System* (1906) [`newstandardcoats00jnoj`](https://archive.org/details/newstandardcoats00jnoj) | US trade systems, coats/vests/trousers | 300–400 ppi | PD | Not yet reviewed visually |
| Vincent series on archive.org (trousers 1905, coats pt 2 1893/1905, jackets 1897/1903, waistcoats 1902, British military 1902/1914, livery, boys 1902) | Full tailoring range incl. military | **99–200 ppi**, except coats pt 2 (1893) at 300 ppi and shirts (1890) at 600 ppi | UK, PD | Content strong, mostly too coarse. Use where 300+ ppi exists |
| Not on archive.org yet: Croonborg *New Supreme System* (1917), Streiff *Ideal System* (1920), *Red-Book of Men's Tailoring* (1917), Schulman (1916) | — | — | — | Check HathiTrust (needs the browser) |

### Proposed men's build order
1. **Simons family** = source #2. First garment with Claude: a sack coat from
   *Science of Grading* (body + sleeve + collar, with graded nests as the
   check). The pipeline then does pants, overalls, work coat, mackinaw,
   overcoat and boys' from the same system.
2. Regal 1904 = cross-check system for men's coats/trousers (independent
   method, same era).
3. Navy 1922 + MIL specs = finished-measurement validation for style 3.

## Round 6 (2026-10-19): sources named by historical-tailoring.com
Its pattern generator (commercial, Seamly2D CLI, see RESEARCH.md prior-art
round 2) names almost no sources. Its notebook names two pre-1931 ones that
we didn't have. **First finds on Google Books:** archive.org has neither,
and Google Books has never been swept systematically for this project.

| Source | What | Scan | Rights | Assessment |
|---|---|---|---|---|
| **Louis Devere, *The Handbook of Practical Cutting on the Centre Point System*** (London: Simpkin Marshall; eds 1865/66 → 5th ed. 1883) | Complete men's tailoring system: coats (frock, morning, double-breasted), paletots, top coats, cloaks, capes, waistcoats, trousers, boys'; draft to measure with Devere's **graduated measures** (proportional scales) + "Centre Point" balance method; stout/erect figure adjustments | **5th ed. 1883, Google Books full view, PDF download, Oxford copies:** text [`Vak5c60mOnkC`](https://books.google.com/books?id=Vak5c60mOnkC), plates [`20Sd-kXwXzcC`](https://books.google.com/books?id=20Sd-kXwXzcC). **No 1866 scan found:** Google Books lists 1865/66/69/79/80/83 editions as catalogue-only; archive.org has only Shep's 1986 reprint (`handbookofpracti0000deve`, lending-only, adds modern notes: don't use); HathiTrust record 004382245 is the 1986 reprint (search only) | UK 1883, PD everywhere | **Candidate, style 1 (tailored, 19th-c. cut).** Graduated-measure drafting is proportional, so it fits the recipe model (scale = f(breast)). Check: plate legibility/ppi; whether worked examples print dimensions we can gate against. Related Devere items in full view: *Gentleman's Magazine of Fashion* (vol. 25, 1873 [`_xcGAAAAQAAJ`](https://books.google.com/books?id=_xcGAAAAQAAJ); vol. 29, the 1877 issues, which Google dates 1878 [`SBgGAAAAQAAJ`](https://books.google.com/books?id=SBgGAAAAQAAJ); both held, see round 7): monthly Centre Point diagram plates |
| ***Sartorial Gazette*** (London: R. Taylor; trade monthly, incorporates *Master Tailor & Cutters' Gazette*) | Cutting articles + diagrams by working cutters; e.g. A. H. Scriven's three skirt systems (Conical, Ashbourne, Dovedale), Aug 1915 | vol. 25 (1918): Google Books full view [`xd2D_O5qhjwC`](https://books.google.com/books?id=xd2D_O5qhjwC) (Illinois copy); vol. 26 (1919): archive.org [`sartorialgazette2619unse`](https://archive.org/details/sartorialgazette2619unse) (400 ppi, open). **1915 (vol. ~22) not found yet**; Illinois likely holds the run → HathiTrust (Cloudflare: needs the maintainer's browser) | UK, pre-1931 → PD in US | **Candidate, secondary.** Many authors and systems, like Bridgland 1919: one adapter per article system, so use only for specific garments (women's skirts, styles 1/4) |

## Round 7 (2026-10-19): Google Books full-view sweep + patents
**Method.** `archive/scripts/gbooks_sweep.py` ran the 124 queries in
[archive/sourcing/queries.yaml](archive/sourcing/queries.yaml) through the Books API with
`filter=full` (key in gitignored SECRETS.md). The groups were systems/authors,
what trade, design and correspondence schools taught from, textbooks, US
government, trade journals, the workwear/military/children gaps, and foreign
terms. Results are kept if published before 1931 or flagged PD:
**1,631 volumes** in [archive/sourcing/gbooks_hits.tsv](archive/sourcing/gbooks_hits.tsv),
**252 shortlisted** by title in
[archive/sourcing/gbooks_relevant.tsv](archive/sourcing/gbooks_relevant.tsv) (rerun from the
gitignored cache costs no quota). The full-view filter caps each query at
~20 results, so the sweep is broad, not exhaustive.
**Caveats.**
- All 22 volumes vetted below are `ALL_PAGES` + PD + PDF download. The search
  results' `pdf` flag under-reports this; trust the per-volume lookup.
- Resolution: PDFs saved from Google Books in a browser carry **600 ppi**
  page images (checked 2026-10-19, 13 volumes), the same as archive.org's
  `*goog` mirrors. (An earlier note here said they were downsampled; that
  was wrong.)
- Rights: a Google "full view" is a strong PD signal, but post-1931 items
  (USDA 1939–41) are PD only as US government works.

### Top finds (vetted 2026-10-19; `id` → books.google.com/books?id=…)
| Pick | Source | id | Why |
|---|---|---|---|
| **Fills a gap in source #2** | Simons, *Designing Sack Coats, Dress Coats and Vests* (Clothing Designer Co., 1917, 56 pp) | `qjUyAQAAMAAJ` | The *Sack Coats* LoC download failed (HTTP 500); this is an alternative copy |
| Source #2 family | Simons, *Drafting Pants and Overalls* (1915, 40 pp) | `LDYyAQAAMAAJ` | Second copy of a planned source; overalls = workwear gap |
| Source #2 context | *Clothing Designer and Manufacturer* (Simons' trade journal; 1916 `EjAwAAAAYAAJ`, 1917 `6C8wAAAAYAAJ`) | | Monthly drafts in the same lettered-point system: more garments, worked examples (checks) |
| **Women's + children's, encyclopedic** | Rosenfeld, *The Practical Designer… for self-instruction* (Leading Pattern Co., NY 1911, 460 pp) | `o0MyAQAAMAAJ` | Single-author lettered-point system for women's, misses', juniors' and children's cloaks and suits, with proportional size tables and a grading section. **Not men's** (corrected after download) |
| **School system (men's)** | Rude, *The A. D. Rude Great Modern System for Designing & Cutting Men's Garments as Taught at the New York Cutting School* (1906, 96 pp) | `YkAyAQAAMAAJ` | Exactly what a trade school taught from |
| Men's cross-check | Regal, *The American Garment Cutter* (American Fashion Co., **1924 ed.**, 332 pp) | `Va83HIbOVPwC` | Later edition of our cross-check system (1904 `QPkCE4HNMrgC` also full view) |
| **Children + women, public schools** | Blakely & Patton, *The Practical System for Drafting Ladies' and Children's Clothing: Designed for Use in the Public Schools* (Hinds, Noble & Eldredge, 1907, 56 pp) | `-EBDAAAAIAAJ` | Children's gap; short school system, quick to evaluate |
| School texts (women's/children's) | Wake, *Scientific Sewing and Garment Cutting: For Use in Schools and in the Home* (Silver Burdett 1898) `9TRCAAAAIAAJ`; Ingalls, *Text-book on Domestic Art, with Illustrations and Drafts* (1911) `zQSAAAAAMAAJ`; Fales, *Dressmaking: A Manual for Schools and Colleges* (Scribner 1917, 536 pp) `mjoaAAAAMAAJ`; Baldt, *Clothing for Women* (Teachers College text; 1916 `oQZRAAAAYAAJ`, **1929 ed.** `csJAAAAAIAAJ`); Hanna, *Pattern Making* (Macmillan 1922) `q4jcT9PiuXgC` | | The textbooks US home-economics and normal schools used; style 4 + women's blocks. Woman's Institute *Drafting and Pattern Designing* (1924) `_X3OAAAAMAAJ` adds to WI 1920 |
| **Body data → size presets** | USDA (Ruth O'Brien et al.): *Children's Body Measurements for Sizing Garments and Patterns* (Misc. Pub. 365, 1939, 900 pp) `YWigVY6l7bAC`; *Body Measurements of American Boys and Girls…* (1941) `p0aTJOpiG1gC`; *Women's Measurements for Garment and Pattern Construction* (Misc. Pub. 454, 1941) `0U1ehDXbLsEC` | | US-gov PD. The surveys behind US standard sizes: fills the "body-type presets" gap with period-appropriate civilian data (vs ANSUR/NHANES) |
| Proportions | Carlstrom, *Proportions of the Human Form… as They Apply to Garment Construction* (J. J. Mitchell Co., 1905) | `kD4yAQAAMAAJ` | Mitchell school's figure theory; pairs with graded tables |
| Women's/skirts journal | *Sartorial Gazette* **1915** (500 pp) | `3_8lCHJXjssC` | Probably holds Scriven's Aug 1915 skirt article (round 6); 1917 `eR8ewF6vsBMC` |
| **Military/livery gap** | Klemm, *Vollständiges Handbuch der höhern Bekleidungskunst für Civil, Militär und Livree* (25th ed., 1869, 404 pp) | `8MAlySd_ok4C` | German, PD in US; civil + **military** + livery in one system |
| Military (French) | Ladevèze, *Cours de coupe du tailleur de Paris… avec les uniformes* (1874, 310 pp) | `uslob6dZbJAC` | Includes uniforms |
| Early British | Compaing & Devere, *L'Art du tailleur / The Tailor's Guide* (Simpkin Marshall 1855, 2 vols) | `UulhAAAAcAAJ` | Predecessor of Devere's Centre Point (round 6) |

### Secondary (in the shortlist, not yet vetted)
- **Men's systems:** Giles/Mogford *West-End System* (1875/77), Holding (*Coats*,
  *Ladies' Cutting Made Easy*, *Direct System*, *Cutter's Difficulties*, 1885–1901),
  Williamson *Garment Making* (1899), Brophy *Pattern Cutting Made Easy*
  (1889), Paul Elle *The Cutter* (1903), Couts (1848), Jackson (1829), Keyworth
  *Form-growth* (1895), Mongelli *Il taglio da uomo* (1910), Curthiz *El sastre
  práctico* (1922, men's + boys'), Zeischke (1880).
- **Women's:** Gordon *"Standard" Work on Ladies' Tailor-made Garments* (1908,
  full view here), Weiler (1915), Engelmann *American Garment Cutter: women's
  skirts* (1904), Williams *Science of Skirt Drafting* (1908), Merwin
  *American System of Dressmaking* (1907), Davis (1896), Broughton (1897),
  Smith *Cutting Out for Student Teachers* (1904, UK), Cooke & Kidd *Dressmaking
  in the School* (1914, UK), Wallbank *Pattern Making for Dressmaking* (1929, UK),
  Picken *Tissue Paper Patterns* (1923), WI *Pattern Designing and Draping* (1928).
- **Trade journals (monthly diagram plates):** *American Tailor and Cutter*
  (US; 1886, 1892, 1900, 1902–04, 1913), *Sartorial Art Journal* (1918),
  *Croonborg's Gazette of Fashions* (1915–16), *Progressive Tailor* (1917, 1920),
  *International Tailor* (1919–27), *Tailor and Cutter* (1867, 1890, 1914),
  Minister's *Gazette of Fashion* (1866–70), *West-End Gazette* (1870, 1873),
  Humphreys' *Monthly Record of Fashion* (1882–84), Devere's *Gentleman's
  Magazine of Fashion* (1870–78). Journals = many authors, so per-article
  adapters; use for specific garments only.
- **Validation (finished sizes):** US Navy *Uniform Regulations* (1913), USMC
  (1900, 1913), NY National Guard uniform specs (1912).
- Post-1931, needs a renewal check: Gurney *Pattern Drafting, Pattern Grading,
  Garment Making* (1939).

### Google Patents (pre-1931 US)
About 450 patents in CPC A41H3/00 (patterns, cutting) and 390 in A41H1/00
(measuring). Most are dressmakers' charts and adjustable patterns (the
devices Kidwell 1979 catalogues), plus "method of drafting/cutting" patents
(e.g. US711479 Curran 1900, US1114190 Scott 1912 trousers, US1274364 Babb
1918) and tailor's squares (Picken US1204900, 1915). Patents are PD and
publish the method + drawings, but each is a device or a narrow method.
**Lower priority than books.**
Kidwell, *Cutting a Fashionable Fit* (Smithsonian Studies in History and
Technology 42, 1979; [repository](https://repository.si.edu/handle/10088/2441),
hi-res PDF 400 ppi) indexes US dressmakers' systems with patent dates. Held:
corpus `kidwell1979/`.

### Downloaded + checked (2026-10-19)
**Google's own PDF downloads are CAPTCHA-gated for scripts** (HTTP 429 "unusual
traffic"). So the picks came from **archive.org copies** via
`scripts/corpus_fetch.py` (MD5-verified, original JP2 page images) into
Cloudbox `~/custom-clothing/corpus/<identifier>/`. archive.org's `*goog`
items are Google's scans at **full resolution**: Hanna `patternmaking00hanngoog`
is 600 ppi (as are browser-saved Google PDFs, see below).
Simons *Sack Coats* was already in the corpus (`designingsackcoa00simo`,
fetched 13:17 today from LoC via archive.org), so source #2 isn't blocked.

| archive.org id | Item | ppi / leaves | Legibility (native-res crops) | Use |
|---|---|---|---|---|
| `practicalsystemf00blak` | Blakely & Patton 1907 (LoC) | 400 / 62 | Crisp line art; LINE n + lettered points; inch dimensions printed on drafts; directions as numbered steps | **Children's gap.** Infant/girl/child garments + drawers, night shirt, dress shirt; short and regular: good candidate for a children's source |
| `practicaldesigne02rose` (1911), `…01rose` (1918) | Rosenfeld *Practical Designer* (LoC) | 400 / 328, 186 | Clean; lettered points; **diagrams printed sideways** (rotate on ingest) | Women's/misses'/juniors'/children's; proportional measurement tables per size; grading section with nested sizes (I/II/III) = gate checks |
| `americangarmentc02rega` | Regal *American Garment Cutter* 1914 (LoC) | 300 / 310 | Sharp; each diagram lists its worked measurements (fractions) | Men's cross-check, later edition than our 1904; separate plate section |
| `carlstromspropor00carl` | Carlstrom 1905 (LoC) | 400 / 190 | Readable; rotated tables full of fractions (hard OCR) | Men's proportion tables by height × breast: validation data |
| `womensmeasuremen454obri`, `bodymeasurements366obri`, `childrensbodymea365obri` | USDA O'Brien surveys 1939/41 | 350 / 112, 216, 54 | Clean typeset tables | Size presets; `childrensbodymea365obri` is the 54-pp summary (sample sizes: read from the text when extracting) |
| `scientificsewing00wake` | Wake 1898 (LoC) | 500 / 174 | Clean | Mostly a graded sewing course, few drafts (drawers, shirt): **low value for geometry** |
| `textbookondomest00ingarich` | Ingalls 1911 (UC) | 500 / 268 | Clean | Prose "Dot n" drafting, few diagrams: Browne-like, **costly** |
| `dressmaking00fale`, `clothingforwomen00bald`, `patternmaking00hanngoog` | Fales 1917, Baldt 1916, Hanna 1922 | 400–600 | not yet sampled | School texts; evaluate when building women's |

**Saved by the maintainer from Google Books / the Smithsonian (2026-10-19)**, placed in
both corpus copies as `gb_*/` and `kidwell1979/` (SHA-256 identical on
Cloudbox and laptop). Identified by title, page count and printed dates,
since Google's notice page carries no volume id. All page images are 600 ppi
grayscale; Kidwell is 400 ppi.

| Folder | Item | pp | Notes |
|---|---|---|---|
| `gb_rude1906_nycuttingschool` | Rude, NY Cutting School system 1906 (John Crerar Library copy; `YkAyAQAAMAAJ`) | 97 | **Strong men's candidate (source #3?).** Per garment: printed *Measure* block, foundation lines, lettered points, full plate. Sack (SB/DB), box overcoat, Chesterfield, covert, cutaway and DB frock, corpulent-form variants, "inclines" + graded inclines |
| `gb_devere1883_handbook_text` | Devere *Handbook of Practical Cutting* 5th ed. 1883, **text volume** (`Vak5c60mOnkC`) | 165 | Prose keyed to "Plate n / Fig. n". **The plates volume (`20Sd-kXwXzcC`) is still missing**; without it there is no geometry |
| `gb_sartorialgazette1915_v22-23` | *Sartorial Gazette* vols 22–23 (Illinois; `3_8lCHJXjssC`) | 501 | Should contain Scriven's Aug 1915 skirt article (round 6); not yet located in the volume |
| `gb_clothingdesigner1918_v13` | *Clothing Designer and Manufacturer* vol. XIII, **1918** | 373 | Simons' journal; a third year (not the 1916/1917 ids found by the sweep) |
| `gb_compaingdevere1855_tailorsguide` | Compaing & Devere *L'Art du tailleur / The Tailor's Guide* 1855 (`UulhAAAAcAAJ`) | 361 | |
| `gb_ladeveze1874_coursdecoupe` | Ladevèze *Cours de coupe… uniformes* 1874 (`uslob6dZbJAC`) | 312 | Large colour plates (300 ppi RGB) + text |
| `gb_wi1928_patterndesigningdraping` | Woman's Institute *Pattern Designing and Draping* 1928 (Cornell; `DTCWHJjH1aIC`) | 137 | Not the WI 1924 *Drafting and Pattern Designing* (`_X3OAAAAMAAJ`, still not held) |
| `gb_wi1916_tailoring` | Woman's Institute tailoring volume (Tailored Buttonholes… Suits, Coats, and Capes; ©1916–23) | 341 | Construction instructions (style 1 women's) |
| `gb_baldt1916_clothingforwomen` | Baldt *Clothing for Women* 1916 (1917 reprint) | 491 | Same edition as `clothingforwomen00bald`; alternate scan |
| `gb_longmans1901_needlework` | *Longmans' Complete Course of Needlework, Knitting and Cutting Out* 1901 (UK) | 481 | New; school course, Walker-like |
| `gb_plainneedlework1898` | *A Manual of Plain Needlework and Cutting-out*, new rev. ed. 1898 (UK) | 185 | Later edition of `manualofplainnee1886jone` |
| `gb_rosevear1893_needlework` | Rosevear *Text-book of Needlework, Knitting and Cutting Out* 1893 | 539 | Same work as `textbookofneedle1893rose`; alternate scan |
| `gb_wi1925_underwearlingerie` | Woman's Institute *Underwear and Lingerie* (©1925) | 141 | Likely the same work as `CAT31314740` (1926); alternate scan |
| `kidwell1979` | Kidwell, *Cutting a Fashionable Fit* (Smithsonian 1979), hi-res | 169 | Index of US dressmakers' systems + patents |
| `gb_devere1883_handbook_plates` | Devere *Handbook* 1883, **plates volume** (`20Sd-kXwXzcC`; saved later the same day) | 105 | Clean full-page plates (two-page landscape spreads): proportionate pattern, graduated rulers, draft-to-measure operations, supplementary measures, figure variations. **With the text volume the 1883 set is complete** |
| `gb_klemm1869_bekleidungskunst` | Klemm *Vollständiges Handbuch der höhern Bekleidungskunst für Civil, Militär und Livree*, 25th ed., Dresden 1869 (`8MAlySd_ok4C`) | 406 | Fraktur text keyed to "Tafel n". **All 16 fold-out Tafeln scanned unfolded**, each ~8000×6200 px at 300 ppi RGB (~27×21 in), many figures per plate, plus a *Reductions-Schema* (scale chart for converting between sizes). Military gap: German, Fraktur OCR needed |
| `gb_wi1924_draftingpatterndesigning` | Woman's Institute *Drafting and Pattern Designing* ©1924 (`_X3OAAAAMAAJ`) | 169 | Adds to WI 1920 *Pattern Drafting* |
| `gb_clothingdesigner1916` | *Clothing Designer and Manufacturer* 1916 (`EjAwAAAAYAAJ`) | 301 | Simons' journal; with 1917 and 1918, three consecutive years held |
| `gb_clothingdesigner1917_v11` | *Clothing Designer and Manufacturer* vol. XI, 1917 (`6C8wAAAAYAAJ`) | 417 | |

**Third batch** (saved; placed and manifested by the catalog
infrastructure session, 2026-10-19):

| Folder | Item | pp | Notes |
|---|---|---|---|
| `gb_gentlemansmagazine1873_v25` | Devere's *Gentleman's Magazine of Fashion* vol. 25, 1873 (`_xcGAAAAQAAJ`) | 345 | Monthly Centre Point diagram plates |
| `gb_gentlemansmagazine1877_v29` | Same, vol. 29: the 1877 monthly issues, from January 1877 (`SBgGAAAAQAAJ`; Google's metadata says 1878, probably the binding year) | 433 | Same item SOURCING listed as "1878" (Google 432 pp, same title) |
| `gb_sartorialgazette1918_v25` | *Sartorial Gazette* vol. XXV, 1918 (`xd2D_O5qhjwC`) | 329 | With vols 22–23 and 26, four volumes held |
| `gb_baldt1929_clothingforwomen` | Baldt *Clothing for Women: Selection and Construction*, ©1929 (`csJAAAAAIAAJ`) | 591 | Revised edition of the 1916 Teachers College text |
| `gb_vincent1902_cpg_part1` | Vincent *Cutters' Practical Guide* part 1, 1902 (Google scan) | 103 | Replaces the archive.org PDF that returns 500 (`cutterspracticalguide-part1boys1902`, page images held) |
| `gb_vincent_cpg_coatcutting` | Vincent *Cutters' Practical Guide to Coat Cutting & Making* (UCD copy, year not printed) | 161 | **New Vincent part** (coats); not in SOURCING before. Date: check the catalogue record before relying on it |

**Still not held:** nothing from this round. (NOT_HELD keeps only the
lending-only Devere 1986 reprint.)

### Next
1. Children's: evaluate Blakely & Patton 1907 as the children's source (the
   printed dimensions on drafts can serve as checks).
2. Women's/children's: Rosenfeld 1911 (rotate diagrams; size tables + grading
   nests = checks).
3. Extract the USDA 1939–41 measurement tables as body-size presets.
4. Men's: evaluate Rude 1906 as source #3 (measure blocks + plates = checks).
5. Devere 1883 (text + plates now held): evaluate as a 19th-c. style-1
   source; graduated measures fit the recipe model.
6. Klemm 1869: the military/livery candidate; needs Fraktur OCR and plate
   vectorizing at 300 ppi.

## Round 8 (2026-10-20): the maintainer's links: Goldsberry, 19th-c. systems, trade journals
**Inputs.** Three pages the maintainer linked:
[Chicago History Museum, scaling historical patterns](https://www.chicagohistory.org/scaling-historical-patterns/),
[sewingwithkenna's 19th-c. tailors' and dressmakers' books](https://sewingwithkenna.wordpress.com/2025/03/16/online-resources-19th-century-tailors-and-dressmakers-books-patterns/),
and [empressofbuttons, historical costuming](https://empressofbuttons.wordpress.com/category/historical-costuming/).
They yielded 22 archive.org items, all fetched into both corpus copies, and
Google Books men's titles. The maintainer saved the six most useful of those from a
browser. Two were already held: `practicaldesigne02rose` and Ladevèze 1874.
**Vetting (2026-10-20).** Contact sheets plus one full-resolution crop
(Cloudbox `~/custom-clothing/work/r8/`). Widths are page-image pixels.
Rights: every archive.org item is a pre-1931 US publication with LoC "no known
restrictions". The UK titles (1868–1885) are long out of copyright everywhere.

| Source | What | Scan | Assessment |
|---|---|---|---|
| **Goldsberry, Doran & Nelson, *National Garment Cutter Book of Diagrams*** (Chicago 1888, `nationalgarment00gold`) | Women's (basques, polonaises, street costumes, wraps, Spencer waist, combination undergarment, kitchen apron), misses', girls', children's (cloaks, aprons, combinations), boys' (plain waist and pants, suit, overcoat). **Every piece is dimensioned:** a vertical base line carries cumulative distances, each construction line carries its horizontal offset, and all values are in apportioning-scale units of the bust (or waist/hip) measure. Seam allowances ("⅜ inch seam") and grain arrows are printed. | 108 leaves, ~2860 px, numbers crisp at full res | **Demoted to backup 2026-10-20: the scale unit isn't printed (see "Goldsberry gate check" below).** First read: strongest new find, and a new source type, the dimensioned diagram. Each piece is in effect a printed point table, so the adapter OCRs numbers at points and needs no figure reading; the scale gives grading for free. **Caveats:** (1) the women's outerwear is 1880s bustle-era and fails "timeless"; the usable subset is children's, boys', undergarments, aprons and basic waists. (2) Few *independent* checks: seam pairs and the piece's own arithmetic, with no printed finished measurements. Whether that's enough for the ≤1% gate is the open question. (3) The scale's definition comes from the companion texts. |
| Goldsberry companions: *National Garment Cutter* 1884 (`nationalgarmentc00gold`, 74 leaves, ~2360 px), *Diamond Garment Cutter* 1895 (`diamondgarmentcu00gold`), Diamond school *Instruction Book* 1903 (`instructionbook00diam`), *Voice of Fashion* 1897 ×2 (`VoiceOfFashionV11N451897Fall`, `VoiceOfFashionV12N461897Winter`) | Scale definition, measuring, instructions; the journal prints new diagrams per season | resolution surveyed only | Needed for the scale and for any check values. Read before an adapter. |
| **Mitchell, *New "Standard" Work on Designing and Pattern-Making of Ladies' Garments*** (NY 1921, `newstandardworko00mitc`) | Numbered-point step text ("from 0 to 1 …") per garment, with a full-page diagram, using the Mitchell Divisional Square. Covers box/kimono/semi-fitted/tight-fitted/mannish jackets, two-piece, raglan and bell sleeves, collars, skirts (7/11/15-gore, circular, pleated, riding). | 146 leaves, ~3230 px | **Women's tailored candidate (styles 1/5).** 1921 cuts are far closer to timeless than 1880s ones. Same publisher as the men's Mitchell `standardworkoncu00mitc` (held), so one adapter may serve both. Numbered points fit the recipe model as Simons does. |
| Merwin, *American System of Dressmaking* (1909, `americansystemof00merw`) | Correspondence course; mostly prose with a few lettered-line drafts | 460 leaves, ~2110 px | Instructions source; low geometry value. |
| Dobson & Humphreys, *£20 Prize Essay on Cutting by Block Patterns* (London 1885, `gb_dobsonhumphreys1885_blockpatterns`) | Men's block patterns (frock, lounge, infantry tunic) on shaded plates, several diagrams each; text on making and grading blocks; one proportional table | 43 pp, Google 600 ppi | Men's style 1, secondary. Its block-grading method is a reference for catalog grading. |
| Giles et al., *The West-End System* pt I (London 1875, `gb_giles1875_westendsystem`) | Proportionate-measure table (breast → proportional measures), plus plates for the normal figure and for disproportions (corpulent, stooping, erect, large shoulders…) | 119 pp, 600 ppi | Men's style 1, secondary to Simons/Rude. The disproportion plates are a fit-adjustment source; the table can supply checks. |
| Holding, *Coats: How to Cut and Try Them On* (London 1885, `gb_holding1885_coats`) | Prose plus lettered-point plates: frock, Chesterfield, cassock, working men's, cuffs/flaps, skirts | 117 pp, 600 ppi | Prose system (like Browne), so costly. Low priority. |
| Trade journals: *Gazette of Fashion* v22 1868 (`gb_gazetteoffashion1868_v22`) and v35 1881 (`gb_gazetteoffashion1881_v35`), *Record of Fashion* v7 1882 (`gb_recordoffashion1882_v7`) | Monthly diagram plates by many cutters | 600 ppi | Like the *Sartorial Gazette*: per-article only. |
| Not image-vetted (held): Young 1845 (`archetypalconsum00youn`), Hunter 1853 (`garmentcutterlad00hunt`), L. Jackson 1876 (`sciencegeometryo02jack`), Hecklinger 1881/1884/1891/1895 (`dresscloakcutter00heck`, `handbookondressc00heck`, `keystonesystemte00heck`, `keystonejacketdr00heck`), Dittmar & Sheifer 1891 (`selfbalancingsys00ditt`), Blair 1897 (`margaretblairsys00blai`, ~1890 px), Stone 1897 (`superlativesyste00ston`), Rude 1900 ladies' (`textbookofgreatm00rude`), Weinberg 1900 (`weinbergscloaksk00wein`) | Mostly women's systems, 1845–1900 | Keystone ~2390 px; the rest unsurveyed | Backups for women's. Pre-1880 styles are the least timeless. |
| German: Behrendsen 1912 (`anfertigungvonw00behr`), Marie Niedner, *Das Buch der Haus-Schneiderei* (`dasbuchderhausschneiderei`, loose page JPEGs; the title page names the author) | Underwear and outerwear | | Niedner **cleared** (1863–1945). Behrendsen **cleared** (1855–1936). See "German rights check" below. |

**Not held (Google Books, needs the maintainer's browser).** Higher value: Hertzer,
*Garment Cutting in the Twentieth Century* 1892 `GscPAwAAQBAJ`; Jones,
*Sartor Novus* 1872 `isQwLC2eaDcC`; M. Prince Browne, *New and Simplified
System* 1896 `YIbdtYn9fpEC` (author of the Browne pilot). Journals: *Record of
Fashion* v8 1883 `rBsGAAAAQAAJ`; *American Tailor and Cutter* v7 1885
`611YAAAAYAAJ`; *Tailor and Cutter* v25 1890 `a3ADAAAAYAAJ`. Early systems,
1822–1855 (styles less timeless): Wyatt `xkvCVMA_OskC`, Peele `6Gi5faiiZ74C`,
Byfield *Sectum* `zc0GAAAAQAAJ`, Hadfield `USRhAAAAcAAJ`, Jackson 1829
`6t66hxOANlwC` and 1830 `ZMLtsqf1NGoC`, Minister 1833 (trousers)
`UWpeCc0Ib-wC`, Manwaring `uJS9WXHoTtYC`, Humphreys 1840 `2iUBAAAAQAAJ`,
Ellard `WK6-kydii5IC`, Couts 1843 `N6iwMawi-xYC` and 1848 `6YEc0k9WPgkC`,
Woods 1847 (trousers) `od0DAAAAQAAJ`, Barnett `oCzkBS_T1TYC`, Oliver
`UZMNAAAAQAAJ`. Probable duplicates, skip: Mitchell *Standard Work* 5th ed.
1886 `3vkoAAAAYAAJ`; Walker 1897 `1qIiU40fgxUC` (earlier edition of our Walker 1909).
sewingwithkenna also lists many French and English dressmaking books on
Google Books (1833–1897).

**Leads not explored:** [cuttersguide.com](https://www.cuttersguide.com/)
(mostly American guides, plates, catalogues); archive.org uploader
[@michiel_de_baerdemaeker](https://archive.org/details/@michiel_de_baerdemaeker)
(tailoring guides 1910–1951, many men's); women's pattern-sheet archives
(La Mode Illustrée at Palais Galliera and the MAD Paris library, De Gracieuse
on Delpher, Der Bazar at Düsseldorf, Die Frauenwelt at ONB, Sonntagszeitung
fürs Deutsche Haus on ANNO, Harper's Bazaar at Cornell, Delineator and Ladies'
Home Journal on HathiTrust, archive.org `pub_vogue`, Gallica, and Brazilian,
Polish and Finnish periodicals); the Chicago History Museum's Abakanowicz
Research Center holds Goldsberry 1890/1897 and *Voice of Fashion*
1892/1900/1901 in print only.

### German rights check (2026-10-20)
The rule is that a non-US source is used only if it's clearly out of
copyright. German terms run 70 years after the author's death (§ 64 UrhG),
or 70 years after publication for an anonymous work (§ 66). Death dates
were looked up in the German National Library's authority file (GND, via
lobid.org), the Deutsche Biographie and web searches.
- **Klemm 1869 (`gb_klemm1869_bekleidungskunst`): cleared.** Johann Heinrich
  Klemm, 1819–1886, Dresden tailor and publisher (Deutsche Biographie). Public
  domain everywhere since 1957.
- **Behrendsen 1912 (`anfertigungvonw00behr`): cleared (2026-10-20).
  Gertrud Behrendsen, 1855–1936; public domain in Germany since 2007.**
  Gertrud
  Behrendsen (Leipzig: Dürr) published textbooks 1909–1928
  (*Maschinennähen*, Springer; *Moderner Werkunterricht* 1912), and one
  Springer record places her in Potsdam. She has no GND person record and
  no death date anywhere. It's public domain in the US (1912), but in
  Germany it's protected if she died after 1955, and that's unknown. A
  MyHeritage name search the maintainer saved (2026-10-20) lists only *Berendsen*
  records, without the h, mostly Dutch and North Rhine-Westphalia
  registers. None mentions Potsdam, Leipzig or teaching, so none can be
  matched to her. **From the book itself (p. VII–VIII, "Zum Geleit"):** the
  preface is signed "Potsdam, im September 1912. Die Verfasserin". She
  taught at the *Königliche Handels- und Gewerbeschule zu Potsdam*, and her
  *Maschinennähen* first appeared with Julius Springer, Berlin, 1909. Leads
  for a death date: Potsdam civil records, and the school's staff records
  in the Brandenburgisches Landeshauptarchiv.
  **Update (2026-10-20):**
  [German Wikipedia on August Behrendsen](https://de.wikipedia.org/wiki/August_Behrendsen)
  (landscape painter, 1819–1886, professor at the Königsberg academy;
  sourced to the Preußische Akademie der Künste and the *Memeler
  Dampfboot*) lists his daughters Hedwig (1852–1883) and **Gertrud
  Behrendsen (born 1855 in Königsberg, died after 1889)**. His daughters
  lived with him partly in Meran, Wiesbaden and Hildesheim.
  - **If she is our author,** the book could still be protected in Germany
    only if she died after 1955, i.e. lived past 100. Nothing contradicts
    the identification: she'd be 54 at the first book (1909), 57 as a
    Potsdam teacher (1912) and 73 at the last edition (1928).
  - **The weak link is the identification itself.** It rests on the same
    unusual name and a matching age; no record yet says the painter's
    daughter taught sewing in Potsdam.
  - **Registers:** no entries for "Behrendsen", *Maschinennähen* or her
    1912 title in the EUIPO Orphan Works Database or the EUIPO
    Out-of-Commerce Works Portal (both searched 2026-10-20). The DPMA's
    register of out-of-commerce works took no new entries after 6 June
    2021, and its search is no longer offered.
  - **Confirmed (2026-10-20):** the
    [Schumann-Briefdatenbank, person 15394](https://sbd.schumann-portal.de/Person.html?ID=15394)
    gives Gertrud Behrendsen, **born 1855 in Königsberg, died 15 February
    1936 in Potsdam**, "jüngere Tochter von August Behrendsen". She was a
    teacher from 1890 at the Potsdam Gewerbeschule, led by her life partner
    Johanna Just (1861–1929). Her first post was in Baden-Baden in 1879,
    arranged by Marie Schumann, and she lived in Rotterdam and Paris in the
    late 1880s. The Potsdam school matches her 1912 preface, so this is the
    author. The entry cites no sources and has no GND number; the death date
    rests on that database.
- **Niedner, *Das Buch der Haus-Schneiderei* (`dasbuchderhausschneiderei`):
  cleared (2026-10-20).** It isn't anonymous: the title page reads "von Marie
  Niedner" (the Fraktur N reads like R), published by the Erste Wiener
  Damenmoden-, Schnittzeichnen- und Zuschneide-Werkstätten, Chemnitz
  (owner Anna Jacob). The "1914" is a Leipzig gold-prize date. The 1990
  reprint (Ed. Libri Rari, Hannover) dates the original "Leipzig ca. 1910".
  Niedner was a Leipzig author on fashion and housekeeping for the
  *Deutsche Moden-Zeitung* and Beyer's needlework series from 1898 to
  1926. She has no GND person record, but
  [German Wikipedia](https://de.wikipedia.org/wiki/Marie_Niedner) gives
  17 March 1863 (Wiesbaden) to January 1945 (Leipzig). She was editor-in-chief
  of the *Deutsche Moden-Zeitung* from 1911. Wikipedia flags the death date
  as unsourced ("Beleg für Todeszeitpunkt fehlt"). Even so, with a birth
  year of 1863 she would have had to live past 92 for the book to still be
  protected. Public domain in Germany since 2016 and in the US.

Behrendsen is cleared (died 1936, see above). Places to look for a primary
death record:
- Potsdam and Leipzig civil registers (Standesamt);
- Kürschners Deutscher Literatur-Kalender for the 1920s–30s;
- the Deutsche Moden-Zeitung's records.

### Later saves (2026-10-20, the maintainer's Downloads)
- **Holding, *Trousers Cutting, together with Vests, Breeches, Gaiters*, 2nd
  ed., London 1892** (`gb_holding1892_trousers`, 145 pp, Google 600 ppi).
  Men's trousers, vests, breeches and gaiters by the author of *Coats* (1885).
  UK 1892 by T. H. Holding, so public domain. It's a prose system like
  *Coats*; I haven't vetted it for checks yet.
- ***Stone's Advanced Superlative Trouser System*, 1913**
  (`gb_stone1913_trousers`, 65 pp, Google 600 ppi, John Crerar Library copy,
  LC TT605.S88 1913a). Men's trousers by the author of the *Superlative
  System* for ladies' garments (1897, `superlativesyste00ston`, held). US
  1913, so public domain. Not vetted yet.
- *Women's Measurements for Garment and Pattern Construction* (USDA Misc.
  Pub. 454, 1941): a duplicate of `womensmeasuremen454obri`, so not added.

### Goldsberry gate check (2026-10-20): fails the ≤1% gate on size
I read the text layers of all six companions: 1884, the 1888 diagram book,
1895, the 1903 *Instruction Book*, and both *Voice of Fashion* 1897 issues.
They're in Cloudbox `~/custom-clothing/work/gold/*.txt`.
- **How the scale works:** "a series of scales, commencing with No. 18 and
  ending with No. 45, fourteen in all, arranged with two numbers printed on
  each rule" (1884, General Directions). You pick the rule whose number is
  the person's bust, waist or chest measure in inches; the diagram names
  which. Each rule has 10 spaces, subdivided into fractions, and you step it
  along for larger numbers. The 1903 book drafts all its lessons on Scale
  No. 34.
- **The length of a space is never printed.** It was a property of the
  physical rulers sold with the square. The Chicago History Museum article
  doesn't give it either: its author used commercial reproduction rulers
  (The American Seamstress, Mrs. Depew). The 1903 book defers measuring
  rules to volumes 2–3, which we don't hold.
- **No printed worked measures.** The only inch values are trim widths
  ("straps 3½ inches wide"), seam allowances ("⅜ inch seam"; some seams are
  given in spaces) and a minimum bust ("do not attempt to cut this for a
  bust less than 35 inches"). Lengths of skirts, sleeves and waists are
  "regulated by the tape measure" for each person, not drafted by scale.
- **Why the remaining checks can't gate size:** seam pairs, base-line
  monotonicity and the piece's own arithmetic are all *scale-invariant*. A
  wrong unit length passes every one of them. They can validate OCR and
  shape, but not size.
- **Ways out, none of them from the source alone:**
  - an original ruler measured with a reference scale in the photo (a
    museum, or an antique listing);
  - a reproduction ruler's value, which is the maker's claim and not the
    source;
  - calibrating the unit so the draft's bust line equals the measure plus an
    assumed ease, which breaks the rule that checks come from values the
    source prints.

**Status: demoted to backup.** Goldsberry is a shape reference for
children's, boys', undergarments and aprons. It enters the catalog only if
an original ruler's unit is obtained.

### Blakely & Patton gate check (2026-10-20): no independent checks
`practicalsystemf00blak` (1907, 62 leaves, ~2070 px): 37 figures. I read
the text layer (Cloudbox `work/bp/bp.txt`) and measured Fig. 11 at full
resolution.
- **How it drafts.** It's a direct-measure school system: each garment has
  one worked set of body measures in inches (e.g. child's waist: bust 24,
  front length 11, under arm 5½, shoulder 3½), plus numbered steps with
  inch offsets and fractions of a measure. Curves are freehand ("all the
  draftings … are done with the ruler and free-hand curves"). No seams are
  allowed.
- **The "dimensions printed on drafts" are inputs, not results.** In 11
  figures (Illus. 1, 6–9, 21, 26, 28, 35–37) "the number of inches will be
  found on each line instead of in directions". Those numbers *are* the
  construction: Fig. 26 prints each line's offset once, with no redundant
  totals. The other figures carry only line numbers and letters.
- **The checks it does offer don't qualify.**
  - Seam lengths and gore widths come out equal by construction (e.g. skirt
    gores are fractions of the waist), so they can't fail.
  - The measures that aren't consumed by a step (arm's eye, neck) are
    body girths compared against freehand curves, with unstated ease.
  - Single size only: no size table, no nest, no grading.
- **The figures aren't to scale.** Fitting Fig. 11's scale to its
  12 in width puts line 6 at 2.49 in (printed 2.5) and the under-arm
  line at 5.56 in from the bottom (printed 5.5). But the oblong's height
  comes out 10.48 in against the 11 in front length (−4.7%), so the figure
  can't serve as a ≤1% overlay check.
- Directions are also ambiguous in places. "Place the end of ruler at F,
  7 inches touching line 6 … make G" doesn't say where G falls; the figure
  suggests G is at the shoulder measure, which would be a Claude reading,
  not a pipeline op.

**Status: not a gated source.** It's useful as an instructions and garment-
list reference (infant and children's basics, drawers, night shirt, dress
shirt). **Better children's routes, both held:**
- the Simons family, already source #2: *Science of Grading* (men's,
  boys' and children's graded nests) and `designingboysjuv00simo` (*Designing
  Boys' and Juveniles' Clothing*, 1922). This covers boys and juveniles
  with no new adapter.
- Rosenfeld (`practicaldesigne02rose`, `practicaldesigne01rose`):
  misses'/children's proportional size tables and nested grading. These
  print multi-size values, which are real checks.

### Rosenfeld gate check (2026-10-20): real checks, but at ¼-inch precision
`practicaldesigne02rose` (1911, 328 leaves, ~2020 px) has the complete
children's part. `practicaldesigne01rose` (1918 revised edition, 186
leaves) is women's-first, with the same children's model rules (size 10 =
30/25½/34). Text layers are in Cloudbox `work/rose/`; they're garbled, so
the values below were read from page images.
- **It prints values that are results of the draft.** The children's table
  (sizes 2–14) gives breast, waist, hip, depth, natural waist length and
  inside sleeve length. It also gives **width of back and collar**, "showing
  the half way only, with seams included". Those two are pattern
  dimensions, not body measures, so they're real checks: 7 sizes × 2.
  Misses' and juniors' have their own tables. Grading prints per-point
  increments with stated totals (blouse 36→38: back ⅜ + front ⅝ = 1 inch
  per half), which gives an arithmetic check on the grade rule.
- **Tested: width of back on the size-6 box coat (Lesson 101; the figure
  on page 190 confirms the reading).** Width of back = ½·(B–G) + 1¼, where
  B–G = ⅔ of size and size = ½ breast. That gives 5.58 in exactly, or
  5.56 in from the printed "8⅝". The table says 5¾: **−3.0% / −3.3%.**
- **Across all 7 sizes the same rule lands within ¼ inch.** Rounded to ¼",
  it reproduces 5 of 7 table entries; sizes 6 and 14 are off by one
  quarter:

  | size | breast | rule | table | dev |
  |---|---|---|---|---|
  | 2 | 22 | 4.92 | 5 | −1.7% |
  | 4 | 24 | 5.25 | 5¼ | 0.0% |
  | 6 | 26 | 5.58 | 5¾ | −2.9% |
  | 8 | 28 | 5.92 | 6 | −1.4% |
  | 10 | 30 | 6.25 | 6¼ | 0.0% |
  | 12 | 31 | 6.42 | 6½ | −1.3% |
  | 14 | 32 | 6.58 | 6¾ | −2.5% |

  This assumes H→I = 1¼ at every size; the lesson states it for size 6 only.
- **The source contradicts itself.** For size 6 the lessons use depth 5 and
  inside sleeve 10 (Lessons 100 and 101), but the table says 5½ and 11, and
  the text's own rule gives 5¼ (waist length ½ − ¼). It also prints ⅔ of
  size 13 as both 8⅝ (Lesson 101) and 8¾ (Lesson 100).
- **Why it can't pass ≤1%:** the check values are printed to ¼ inch, so on
  5–7 in quantities the print precision alone is ±2–2.5%. That's coarser
  than the gate. Even with a tolerance of half the printed step (±⅛"),
  sizes 6 and 14 still fail (−0.17").

**Status: real checks; gate amended for print precision (2026-10-20).**
It's the first non-ЕМКО source with real result checks. The gate is now
max(1%, ½ printed step), and a Rosenfeld adapter would declare
`PRINTED_STEP = 0.635` (¼"). Under that gate, width of back passes on 5 of
7 sizes. Sizes 6 and 14 are off by 0.42 cm, more than the 0.32 cm floor,
so the pipeline would stop on them.

### Woman's Institute *Pattern Drafting* vetted (2026-10-23): blocks only, few checks
`patterdraftingpicken` (Picken 1920, instruction paper §2, 48 leaves, 3191–4086 px). The page
images (`patterdraftingpicken_jp2.zip`, 31 MB) are now tracked in git. The 174 MB PDF is over
GitHub's limit, so it stays out.
- **Contents: blocks, not garments.** The paper covers the Picken square (Figs. 10–11), the
  measuring guide, Table I (average measurements, busts 30–48: 16 waist, sleeve and skirt
  measures), the foundation waist (§§ 48–59, lettered points A–X), the one-piece foundation
  sleeve (§ 60), a collar and cuff (§§ 62–63) and the shirtwaist sleeve (§ 64). There's no
  tailored jacket, shirtwaist, work dress, shift or blouse variant. Those are in the sister
  course papers (`gb_wi1916_tailoring`, `gb_wi1924_draftingpatterndesigning`,
  `gb_wi1928_patterndesigningdraping`; Google Books saves, laptop and Cloudbox only).
- **Values that are results of the draft: two, on one size.** The model measures (bust 36,
  neck 13, armhole 15, …) and Table I are inputs. Every other "in this case" figure is the
  step's own arithmetic. The full-size Plates I and II, where real checks would be, aren't in
  the scan.
  - Sleeve § 60: "one-eighth the length of line B C, in this case opposite 8¾". By
    construction, BC = √(7² + 5²) = 8.60 in. That's −1.7%, or 0.15 in, against a gate of
    max(1%, ⅛") = 0.125 in, so **it fails narrowly**.
  - Waist § 53: "the back shoulder is 5¾ in. in this case" (E to K). This depends on the
    Picken square's long-arm curve, so it can't be checked until the square is digitized. A
    rough chord estimate gives about 5.9 in.
- **Every curve is drawn with the Picken square.** Steps place lettered points of the
  square's curves (mm, ff, jj, q, ii, the arrowhead of the S. A. C.) on draft points.
  An adapter would first need the square's outline digitized from Figs. 10–11. The figures
  carry printed graduations (long arm 27 in., short arm 12 in.), so they could be rescaled the
  way the Walker grids are.

**Status: reference only.** It doesn't cover the women's gaps, and its one checkable value
fails the gate.

### Mitchell 1921 ladies' vetted (2026-10-23): the diagrams are the results
`newstandardworko00mitc` (144 PDF pages, 300 ppi ink layer).
- **What it prints that's a result:** almost nothing in the text. There's one "surplus in this
  case is 2½ inches" (five-gored skirt); the measures and "in this case" figures are inputs.
- **The diagrams are to scale** (scale unstated, reduction varies by page), with every
  construction point marked by a target. Fitting each diagram on the points the text places by
  printed measures alone puts the rest within about 0.1 in (rms 0.08 cm), so the drawn points
  can serve as checks.
- **Source type:** a fifth kind beside table, grid, lettered-point text and dimensioned diagram:
  **point text with a to-scale marked diagram**. New plumbing: `archive/ccat/diagram.py` (markers,
  heavy strokes) and a recipe `drawing:` fit (ccat.recipe). `PRINTED_STEP` = ¼ in.
- **First garment built:** the box coat (pp. 16–19), back and front, in gate 14/14. The
  diagrams (pp. 17 and 37) draw the shoulder 5¾ in where the text prints 6. ruled
  2026-10-24 that the text governs, so the drawn shoulder is a report. Findings, discrepancies and readings are in
  `archive/recipes/mitchell/FINDINGS.md`.

**Status: source #3 (women's tailored), in progress.** Table I could be a size-preset input later. Women's tailored goes to Mitchell
1921 (`newstandardworko00mitc`).

### What round 8 changes
1. **Women's and children's are no longer blocked on ЕМКО vols 2/5/6.** The
   candidates are now Mitchell 1921 (women's tailored); Simons' boys'
   and juveniles' books, which extend source #2; and Rosenfeld 1911/1918
   (misses'/children's, graded). Goldsberry 1888 and Blakely & Patton 1907
   both fail the gate (checks above); keep them as references.
2. **A fourth source type** joins table (ЕМКО), grid (Walker) and
   lettered/numbered-point text (Simons, Mitchell): the dimensioned diagram
   (Goldsberry). Its numbers are in units of a ruler that isn't printed.
   The lesson for any apportioning-scale system: confirm the unit is printed
   before vetting further.
3. **Men's order unchanged:** Simons is #2. Rude 1906, Devere 1883 and the
   West-End System compete for #3.

## ЕМКО pilot (2026-10-17)
Jacket base construction rows 1–12 transcribed, **12/12 self-consistent, formulas
cross-check to ≤0.01 cm**; OCR ~90% with all error types detectable.
See [archive/pilot/emko/FINDINGS.md](archive/pilot/emko/FINDINGS.md).

## Next steps (proposed)
1. ~~Grid-vectorization pilot on Walker~~ **done 2026-10-17: ~1% accuracy,
   near-mechanical** ([archive/pilot/GRID_FINDINGS.md](archive/pilot/GRID_FINDINGS.md)).
2. ~~Government-sources round~~ done 2026-10-17 (above). Follow-ups: DLA FOIA, ЕМКО СЭВ copy.
3. Image-survey the menswear trade manuals (Croonborg 1907/1917, Regal
   grader 1917, Vincent jacket/military) and pick the men's block source.
4. The maintainer: HathiTrust browser searches (list above); optionally a NARA WPA
   pattern inquiry.
5. Define the per-style garment list → source mapping (which book/page
   supplies each garment), as the build list for vectorization.

## Round 9 (2026-10-27): US government specs and patterns, revisited

Sources reviewed for the field coat, and a search for pattern geometry
(DXF-AAMA, AccuMark, solicitation packages). Round 3's split still holds:
specs give construction and finished sizes, never piece shapes.

### Spec quality, by document type
| Type | Examples reviewed | What it gives | Verdict |
|---|---|---|---|
| **Commercial Item Description** (A-A-…) | A-A-59549 fleece bib overalls (2000), A-A-55068 flight-deck jersey (1991), A-A-50358B disposable coveralls (1990, image scan, no text layer), A-A-50383A waffle undershirt (1998) | A paragraph of design, materials, sometimes seam types, finished measurements by body-size range, a rough sketch | Thin. Ease checks at most; three of the four are knits |
| **Detail spec** (MIL-C-… / MIL-DTL-…) | MIL-C-44048G (1995, 54 pp) and MIL-DTL-44048H (2000, 25 pp, current), combat coat | Full pattern-parts list with cut counts; G: a 19-page operation-by-operation construction table; H: a finished-measurement grid over 34 sizes (6 chests × up to 8 heights) with body ranges, a per-seam ASTM D6193 seam/stitch table, 7 dimensioned figures (fronts, pocket and flap construction, two cuff versions, bartacks) | Good. Use H for style, sizes and details, G for the construction order. Pocket sizes and positions are "as marked on patterns": not given |

All are US federal works (17 USC §105), most marked Distribution Statement A,
so they can be tracked in `corpus/` and quoted. Their OCR text layers are
messy (G especially); read tables from the page images.

### Finding specs
- **ASSIST QuickSearch** (<https://quicksearch.dla.mil/>) is the authoritative
  index: current revisions (into 2026), active/cancelled status, page counts,
  revision history. Each record holds the spec PDF only: no patterns,
  drawings or CAD. Search tip: Document ID `MIL-DTL` plus "any term" in the
  title (`COAT,JACKET,SHIRT,TROUSERS,…`); the FSC drop-down alone didn't filter.
- **everyspec** keeps older revisions and CIDs. Its FSC listings
  (`/FSC-CODE/8405/`, `8410`, `8415`: 108, 40 and 233 documents) are the way
  in; its search page returns 404 and web `site:` searches don't index it.
- **Shortlist** for dimensioned figures (recent detail specs carry figures
  like 44048H's), not yet downloaded:

| Spec | Garment | Note |
|---|---|---|
| MIL-DTL-32686(1) (2024, 39 pp) / MIL-DTL-32688(1) (2025) | Marine Corps tropical blouse / trousers | A current field coat and trousers |
| MIL-DTL-32768A / 32767A (2026) | All-weather coat, men's / women's | Trench/raincoat, both cuts |
| MIL-DTL-3649(1) (2026) | Men's khaki shirt, long sleeves | |
| MIL-DTL-32082B (2026) | Mechanic's coveralls, cold weather | The coverall gap |
| MIL-DTL-29424B (2024), 29427C (2025), 29429C (2022), 29432C (2024), 32747 (2025) | Men's service coat with belt; women's service coat, skirts, slacks; men's dress trousers | Tailored |
| MIL-C-2202H, MIL-T-87062B, MIL-S-87063B, MIL-S-87046A (everyspec, 1986–90) | Sateen coveralls, denim utility trousers and women's slacks, utility shirt | Legacy workwear |

### Pattern geometry: where it is and isn't
- **SAM.gov** (Contract Opportunities): DLA Troop Support C&T notices are
  presolicitations; the solicitations themselves go to DIBBS. The notices
  carry **no pattern attachments**. They say patterns come as **Gerber
  AccuMark zip (storage area v9+), no conversion**, and **paper patterns on
  request during the solicitation phase** via the Spec Request form (round 4).
  Example: SPE1C1-24-R-0007, CWU-27/P flyer's coveralls (Dec 2024).
  Keyword "AccuMark": 60 notices, mostly DLA presolicitations and the Navy
  Clothing and Textile Research Facility's own AccuMark licences. Keyword
  "DXF pattern": no clothing at all. The claim that SAM packages include
  DXF or marker (`.HPGL`) files wasn't borne out.
- **DIBBS** (<https://www.dibbs.bsm.dla.mil/>): opens with a DoD warning and
  consent banner (accepted with the maintainer's OK, 2026-10-27). Browsing
  and viewing solicitation records needs no login; quoting needs registration.
  - Solicitations are listed **only while open**: SPE1C1-24-R-0007 (27P
    coveralls) returns "No Open Solicitation is on file".
  - The one garment solicitation open on 2026-10-27, **SPE1C1-26-R-0089**
    (men's trousers, closes 2026-11-12), lists a package zip, the solicitation
    PDF, two amendments and attachments as PDF, DOCX and XLSX (procurement item
    descriptions, forms). **No DXF, HPGL or CAD files**, and "Tech Data: None"
    on all four items. Nothing was downloaded.
  - Its "Tech Data" section points to TDMT (DLA's engineering-data system,
    login required, mostly hardware bidsets) and to ASSIST for specs. Pattern
    files still come only through the Spec Request form (above).
  - So the claim that DIBBS packages include pattern CAD files wasn't borne out
    either. A future open solicitation for a garment we want is the moment to
    ask for a **paper pattern** through the Spec Request form, if that's ever
    pursued (it asks for a company and the solicitation number).
- **Public DXF-AAMA collections of military garments:** none found (web,
  everyspec, ASSIST). Hits were CNC insignia clip art and commercial pattern
  sellers (off-limits).
- **If DXF-AAMA files do turn up:** they're plain text. A small reader in
  `designs/tools/` can pull out each piece's outline, notches, drill holes,
  grainline and internal lines, which give pocket placements and collar
  shapes directly; Seamly2D isn't needed.
- **Routes to geometry, best first:** (1) a paper pattern through the Spec
  Request form while a solicitation for the item is open (it asks for a
  solicitation number and a company); (2) a FOIA request to DLA Troop
  Support; (3) a surplus garment, measured flat or taken apart and scanned.
  The design only needs proportions (pocket sizes and positions, collar
  shape) to lay on a FreeSewing block, so (3) is the quickest.

## Round 10 (2026-10-27): everyspec beyond the garment specs, and older copies

**DTIC is off limits** (the maintainer, 2026-10-27): its reports are treated as
military/contractor-only. Natick technical reports on pattern development
aren't pursued.

### everyspec, searched by document type
Its search box is a Google custom search over titles, so garment names find
only garment specs. Crawling the library listings (about 9,400 titles, 86
folders) found other kinds of document:

| Title phrase | Documents | Use |
|---|---|---|
| ANTHROPOMETRY | **DOD-HDBK-743A**, *Anthropometry of U.S. Military Personnel* (1991) | Body-measurement statistics, men and women: size sets, proportion checks |
| SIZE LABELING | **MIL-STD-984A**, size labeling for women's uniform clothing (1994) | The women's size system with body measurements per size |
| PROVISIONS FOR EVALUATING QUALITY | **MIL-STD-1488G** trousers; 1492C men's shirts; 1609C women's skirts; 656 women's slacks; 1668B cloth coveralls; 1608C women's dress coats | How each garment is measured and inspected |
| MILITARY UNIFORMS, CLOTHING FABRICATION | **MIL-HDBK-150C** *Military Uniforms* (1995); **MIL-HDBK-156A** *Glossary of Military Clothing Fabrication Items* (1995); MIL-HDBK-151B components and materials | Uniform descriptions; standard construction terms |
| FABRIC REPAIR | TM 4-21 / FM 10-16 *General Fabric Repair* (2013 / 2000) | Sewing and repair methods (instructions) |

More garment CIDs the FSC listings missed: A-A-55291 utility jacket (unisex),
A-A-55178 cotton sateen coveralls (replaces MIL-C-2202), A-A-55095A utility
coveralls, A-A-55229 raincoat, A-A-55110A and A-A-55260 all-weather coats,
A-A-55265 A-2 leather flight jacket, A-A-52112B men's shirt, A-A-55085 and
A-A-1784 trousers, A-A-55285 women's slacks. Searched with nothing useful:
FSC 8450 (children's: empty), the Fed Spec clothing series (DDD-, JJ-), the
ARMY-General, USAF and USMC sections. Download links are
`<folder>/download.php?spec=<file>` on each document page.

### Older copies
- **Quartermaster *Specifications for the uniform of the United States Army***
  (1912, 1913, 1915, 1917; archive.org, public domain). The pre-1931
  equivalent of a MIL spec, for officers' uniforms, **with dimensioned style
  details** the modern specs leave to the pattern. Example, the 1917 officer's
  ulster (§47): double-breasted, 5 buttons a side, 8–10 in below the knee,
  collar fall 4–5 in, a 25 in back slit, welted vertical pockets centred
  opposite the lowest button and in line with the sleeve's front seam, turn-
  back front corners. The 1914 Alaska clothing spec (no. 1171) is not
  downloadable.
- **USDA Bureau of Home Economics leaflets by Clarice L. Scott** (1929–1952,
  public domain): sketches and prose only. **No patterns, no dimensions, no
  proportions: not importable, rated D below.** *Rompers* (Leaflet 79, 1931),
  *Dresses for Little Girls* (80, 1931), *Suits for the Small Boy* (52, 1929),
  *Ensembles for Sunny Days* (63, 1930), *Child's Self-Help Overall* (251,
  1948), *Dresses Designed for Little Girls* (255, 1949), *Shopper's Coat*
  (271, 1950), *Dresses and Aprons for Work in the Home* (Farmers' Bulletin
  1963). Others with clothing titles (*Sun Suits for Children* 1930, *Winter
  Play Suits* 1938, *Work Clothes for Women* 1942, *Pattern Alteration* 1945)
  are radio-talk transcripts. *Standard Sizes for Children's Clothes* (1941)
  is a sizing primer for consumers, also without tables we lack (the O'Brien
  surveys it summarises are already held).
- **Older MIL specs:** MIL-C-44048F (1991, the combat coat's G predecessor,
  56 pp), MIL-T-838L (1975, OG-107 utility trousers, 31 pp, pattern parts
  listed), MIL-C-2202H (1990, sateen coveralls; image scan, no text layer),
  **MIL-DTL-43455K** (2007, the M-65 field coat, 39 pp: pattern parts, an
  operation-by-operation construction table and finished measurements; pocket
  and flap positions still "as indicated on pattern").

### Rated by what can be imported
The catalog is built efficiently only from sources that carry numbers a design
can be built from. Rating, best first:
- **A, geometry:** drafts or pieces with numbers (point-by-point drafts,
  dimensioned pieces, grid diagrams, proportion tables). Nothing found in
  rounds 9–10 reaches A.
- **B, dimensions:** finished measurements by size plus dimensioned placements
  (pockets, collar, vents) that can become option defaults on a block.
  QM uniform specifications 1912–17 (placements, no sizes); MIL-DTL-44048H
  (sizes, cuff and button dimensions, no pocket placements);
  MIL-DTL-43455K (sizes, construction; pocket placements by pattern only).
- **C, numeric support:** data for size sets or checks, no garment.
  DOD-HDBK-743A, MIL-STD-984A.
- **D, description only:** sketches, prose, piece lists or construction steps
  without dimensions. CIDs, the Scott leaflets, MIL-HDBK-150C/156A,
  MIL-STD-1488G-type inspection standards, TM 4-21. Not worth fetching for
  the catalog; construction order can come from a B source.

### Where they are
Downloaded 2026-10-27 to the laptop corpus (`corpus/<id>/`, gitignored), not
yet in MANIFEST.yaml or on Cloudbox: `dod-hdbk-743a`, `mil-std-984a`,
`mil-hdbk-150c`, `mil-hdbk-156a`, `mil-std-1488g`, `mil-dtl-44048` (F, G, H),
`mil-t-838l`, `mil-c-2202h`, `mil-dtl-43455k`, the four QM editions
(`specificationsfo00unitiala` 1917, `specificationsfo00unitrich` 1913,
`s00pecificationsfounitrich` 1912, `specificationsfo01unit` 1915) and the
USDA items under their archive.org ids. The first five are to be assessed.
