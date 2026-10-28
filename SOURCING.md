# SOURCING

Where PublicSewing's garments come from, what makes a source worth fetching, and what's
held but not built yet. Current as of 2026-10-27. The full research log (rounds 1–11:
per-source scan quality, rights searches, gate checks, queries) is in
[SOURCING-ARCHIVE.md](SOURCING-ARCHIVE.md); read it only when a source's detail is needed.
Sources are cited by their corpus folder id ([corpus/MANIFEST.yaml](corpus/MANIFEST.yaml)).

## How sources are used
Geometry comes from FreeSewing's blocks, drafted to the wearer's measurements. A source
supplies the garment: its pieces, style lines, proportions, ease, closures and
construction, as option defaults on a block (see CLAUDE.md, "Per-garment workflow").
So a source is only worth fetching if it carries **numbers a design can be built from**.

| Grade | Has | Examples | Fetch? |
|---|---|---|---|
| **A, geometry** | Digitised pieces (DXF), or drafts with numbers: point-by-point drafts, dimensioned pieces, grid diagrams, proportion tables | Simons, Mitchell, Walker, Vincent, ЕМКО | Yes |
| **B, dimensions** | Finished measurements by size, and/or dimensioned placements (pockets, collars, vents) | MIL-DTL-44048H, QM uniform specs 1912–17 | Yes, for a garment no A source covers |
| **C, numeric support** | Body or size data, no garment | USDA O'Brien surveys, DOD-HDBK-743A | Only for size sets |
| **D, description** | Sketches, prose, piece lists, construction steps without dimensions | CIDs, USDA leaflets, quality-inspection standards | No |

Also prefer: a worked example (stated measures that match the draft), legible scans
(≥2000 px on every leaf), whole garments rather than one block.

## Styles
Children's is a category within each style. WARDROBE_GAPS.md tracks each garment.

| # | Style | Core garments (men / women / unisex / children) |
|---|---|---|
| 1 | Tailored classic | suit jacket, waistcoat, trousers, dress shirt, overcoat / tailored jacket & skirt, blouse, coat / — / boy's suit, girl's coat |
| 2 | Workwear / utility | work shirt, work trousers, overalls, chore coat / work dress, apron, slacks / overalls, aprons / play overalls, rompers |
| 3 | Military-derived outerwear | reefer/peacoat, trench/ulster, field jacket, breeches, service shirt / same, cut for women / — / reefer |
| 4 | Simple everyday | nightshirt, drawstring trousers / shift dress, smock, pinafore, gathered skirt / tee, smock / pinafore, shirt, knickers |
| 5 | Mid-century casual | camp-collar shirt, slacks / shirtwaist dress, A-line skirt, blouse / — / play clothes |
| (6) | Knit basics (optional) | tee, sweatshirt, leggings: FreeSewing already has these |

## Rights
- **Public domain:** US publications before 1931; US government works (17 USC §105);
  non-US works old enough to be out of copyright both in the US and at home (Vincent and
  other pre-1931 British books: PD in the US).
- **In copyright, used for method only** (the maintainer, 2026-10-27): methods, formulas and
  proportions as design references, never text, figures or scans in the repo. ЕМКО СЭВ
  т.3 (1988, folder id `emko`, private copy, untracked).
- **Renewed, so trace-only** (NYPL renewals data): Pepin *Modern Pattern Design* (1942,
  renewed 1969), Hillhouse & Mansfield *Dress Design* (1948), Erwin *Practical Dress
  Design*, Picken *Modern Dressmaking Made Easy*, Poulin, Mauck, Vogue dressmaking books.
- **Cleared non-US:** Klemm 1869, Behrendsen 1912, Niedner *Haus-Schneiderei* (German;
  author death dates in the archive).
- Write instructions in our own words; don't copy text.

## Digitised garments (DXF): best available
**Open+Pattern** (openpattern.io, Hugh Clarke / TSOM): real vintage and military garments
taken apart and digitised. Each pattern: CLO3D, **DXF (AAMA)**, full-size PDF (A4, A0),
GLB, PNG. **CC BY 4.0**: free, commercial use allowed, credit "Open+Pattern". Pieces with
true seam placements, so pocket, collar and panel proportions can be read off directly:
better than grade A. Downloads go through a name-your-price checkout (€0 allowed;
asks for contact details), so the maintainer downloads them. Needs a small DXF-AAMA reader
in `designs/tools/` (plain text: outlines, notches, drill holes, grainlines).

Library (2026-10-27), by gap:
- **Shirts:** British 95 combat shirt (graded XS–XXL, 6 cm steps); CS95 UBACS shirt.
- **Trousers:** British CS95 field combat trouser.
- **Field jacket:** CS95 field combat smock; British combat rain jacket.
- **Jackets:** Finnish M62 reversible jacket and Bundeswehr reversible snow jacket (both
  graded XS–XXL); MA-1 bomber (1971, M); Swedish M54 motorcycle jacket.
- **Coverall:** Thayaht's TuTa jumpsuit (1920).
- **T-shirts:** loose, standard, slim (graded XS–XL).
- Others: Zeltbahn ponchos and hood, boonie hat, high-vis vest, Swiss backpack.

Most are single-size: use them for proportions on our blocks, not as graded pieces.

**Held** (2026-10-27, `corpus/openpattern/<id>/`: DXF, PDF, PNG; the CLO and GLB files
stay in the maintainer's Downloads). Read with `node designs/tools/dxf-aama.mjs <file.dxf>
[--svg out.svg]`: per piece, net size and perimeter, notches, drill holes, internal lines,
grain. CLO puts the net outline on layer 1 and the cut line (with allowance) on 14.
- `tuta-jumpsuit`: Thayaht's TuTa (1920), size M, 13 pieces: one body piece with a crotch
  slit, rectangular sleeves (40 × 60 cm), triangle and square gussets, patch pockets.
  All straight lines: the quickest build here.
- `cs95-trouser`: British CS95 field trouser, size M, 39 pieces: three-piece back,
  front, fly, waistband, belt loops, cargo and patch pockets with flaps.
- `us-tactical-smock`: hooded smock, **graded XS–XXL** (six sizes): back, front, sleeves,
  three-piece hood, front placket, pocket bags and flaps.
- `standard-tshirt`: **graded XS–XL** (Grade Rule Table "Normal_Tee"): front, back,
  sleeve, collar, back-neck tape.

## Sources in use
| Source (folder id) | Grade | Designs |
|---|---|---|
| Simons, *Drafting Cotton Garments and Mackinaws* (1918) `draftingcottonga00simo` | A | chore coat, boys' work coat, shop coat, barber's coat, hunting coat, mackinaw, military blouse, bar vest |
| Simons, *Designing Overcoat Patterns* (1916) `designingovercoa00simo` | A | peacoat |
| Walker, *Manual of Needlework and Cutting Out* (1909) `krl00366374` | A (grid) | nightshirt, nightgown, smock, frock, pinafore, knickerbockers |
| Woman's Institute, *Pattern Drafting* (1915/1920) `patterdraftingpicken` | A (blocks) | shirtwaist dress |
| Mitchell, *Ladies' Tailor-Made Garments* (1921) `newstandardworko00mitc` | A | tailored jacket, box coat, gored skirt |
| ЕМКО СЭВ т.3 (1988) `emko` | A (tables) | windbreaker, quilted jacket, winter coat, topcoat, jacket, waistcoat, trousers |
| Simons, *Drafting Pants and Overalls* (1916) `draftingpantsove00simo` | A | work pants |
| Open+Pattern, Thayaht's TuTa (1920), DXF, CC BY 4.0 `openpattern/tuta-jumpsuit` | better than A | jumpsuit |
| USDA O'Brien body-measurement surveys (1939–41) `childrensbodymea365obri`, `bodymeasurements366obri`, `womensmeasuremen454obri` | C | the 75 children's size sets (`designs/sizes/`) |

Left to build from these: Mitchell's tight-fitted single- and double-dart jackets;
Simons' regular, box and ulster overcoats (1916).

## Held, grade A, not built yet
In the corpus; all public domain in the US. Grouped by the gap they'd fill. **Variants are
welcome**: a shirt, trouser or dress close to existing work (same source system, block or
library) is cheap and counts as progress; don't skip a garment because a similar one exists
here or in FreeSewing. So far 15 of 27 designs are coats or jackets (plus two waistcoats); shirts, trousers,
skirts and dresses are under-represented.

**Quickest next (same systems and libraries as built designs):**
- Simons, *Drafting Pants and Overalls* (1916) `draftingpantsove00simo`: work pants built
  (2026-10-27); left: bib (apron) overall, one-piece overall, peg-top pants, breeches.
- Vincent, *Cutter's Practical Guide… Shirts, Undergarments* (1890) `vincentmakingshirts18xx`:
  shirts (work, dress), pyjamas, aprons. Builds on the nightshirt's yoke template.
- Simons, *Designing Boys' and Juveniles' Clothing* (1922) `designingboysjuv00simo`: boys'
  pants, blouses, knickers.
- Mitchell 1921 (built system): two-piece skirts; ЕМКО trousers library: shorts and variants.

**By gap:**

| Gap | Source (folder id) | Has |
|---|---|---|
| Girl's coat, women's coats | Sheifer, *Designing and Grading Ladies', Misses' & Children's Garments* (1908) `nssheiferssystem00shei` | Lettered drafts in inches: tight-fitting, semi-fitting and box coats; grading |
| Boy's suit jacket, children's | Greenstein, *Method of Cutting for Men's and Boy's Clothing* (New York 1895, bilingual; archive.org `erstefranzsischa00gree`, not yet downloaded) | Inch and reduction systems; children's clothing |
| Boy's suit jacket | d'Alessio, *Designing, Cutting and Grading Gentlemen and Boys Clothes* (1906) `artofdesigningcu00ales` | Boy's jacket and sailor coat (8 years); grading |
| Boy's suit jacket, boys' wear | Simons, *Designing Boys' and Juveniles' Clothing* (1922) `designingboysjuv00simo`; Vincent, *Cutter's Practical Guide*, boys (1902) `cutterspracticalguide-part1boys1902` | Same system as the built Simons designs |
| Pyjamas, reefer | Vincent, *Cutter's Practical Guide to Jacket Cutting* (1897) `cutters-prac-guide-jacket-cutting` | Reefers, Norfolk and patrol jackets, pyjamas |
| Women's peacoat / field jacket | Merz, *Ladies' Jackets and Cloaks* (1911) `merzspracticalcu00merz`; Sheifer (above) | Women's jacket and cloak drafts |
| Field jacket, pea jacket | Vincent, *British Military Uniforms* (1902, 1914) `cutters-guide-brit.-mil.-uniforms.-1`, `militaryuniformsbritish-images` | Pea jacket ("British warm"), tunics, overcoats |
| Children's (graded) | Rosenfeld, *Practical Designer* (1911, 1918) `practicaldesigne01rose`, `practicaldesigne02rose` | Children's size tables, grading nests |
| Women's | Schorr, *The Expert Designer* (1917) `expertdesignerpr00scho`; Ratner (1908) `ratnersuptodatem00ratn`; Weiler (1915) `weilerladiestail00weil` | Drafting; Ratner grades ladies' and children's |
| Men's tailored, trousers | Simons, *Science of Grading* (1924) `scienceofgrading00simo`, *Sack Coats* (1918) `designingsackcoa00simo`, *Pants and Overalls* (1916) `draftingpantsove00simo`; Vincent, *Systems of Cutting* (1903) `b1108865`; Regal (1904–17) `americangarmentc01rega`, `americanpatterng00rega`; Rude (1906) `gb_rude1906_nycuttingschool`; Croonborg, Gordon | Men's systems; Simons is the reference system |

Downloaded 2026-10-27 and not yet in MANIFEST.yaml or on Cloudbox: the round-11 books
above (Sheifer, d'Alessio, Vincent jacket and military, Merz, Schorr, Ratner, Weiler) and
the government documents below.

## Government and military sources
Below the drafting books in quality: none gives piece shapes. Only the B sources are
worth using, for a garment no A source covers. The rest (C/D documents, where specs are
indexed, DLA pattern requests, DTIC being off limits) is in the archive.

| Source (folder id) | Has |
|---|---|
| MIL-DTL-44048H (2000) with MIL-C-44048G, F `mil-dtl-44048` | Combat coat: finished sizes for 34 sizes, dimensioned cuffs and buttons; G has the full construction order |
| MIL-DTL-43455K (2007) `mil-dtl-43455k` | M-65 field coat: finished sizes, construction table |
| Quartermaster *Specifications for the Uniform of the US Army* (1912–17) `s00pecificationsfounitrich`, `specificationsfo00unitrich`, `specificationsfo01unit`, `specificationsfo00unitiala` | Officers' uniforms with dimensioned placements (e.g. the ulster) |

### Other militaries (scoped 2026-10-27)
Beyond the US and the USSR (ЕМКО), the two best options:

1. **Germany.** (a) *Historic, public domain:* the Prussian army's *Bekleidungs-Vorschrift
   für Offiziere* (1895–96, archive.org `bekleidungsvors00kriegoog`, `bekleidungsvors01kriegoog`):
   about 670 measurements in cm across officers' items, B like the QM specs (Fraktur OCR is
   rough). German cutting literature of the same era is large (Klemm 1869 and Behrendsen 1912
   are already cleared and held) and is grade A. (b) *Modern:* BwBM, the Bundeswehr's clothing
   company, publishes its tender specifications openly on bwbm.de: product specifications with
   size tables and finished measurements for men's and women's cuts (e.g. the mountain troops'
   tapered trousers, *Keilhose*, Bw3-02-0011/0012, 2026): B. The technical delivery specs (TL)
   name DXF cut sets and RUL grade rules from WIWeB, the Bundeswehr materials institute; those
   files aren't published. Modern specs: use as method only, like ЕМКО.
2. **Ukraine.** The Ministry of Defence publishes its technical specifications (ТС) on
   mil.gov.ua / mod.gov.ua, with annexes for the parts list, finished linear dimensions and
   bartack positions, men's and women's: B. Ukrainian copyright law excludes official
   documents (archive, round 3). Tender documents on Prozorro sometimes attach cut patterns
   (лекала): unverified. The PDFs need a browser to download.

Runners-up: Poland (its technical documentation includes 1:1 pattern sets, but they go to
bidders only); the UK (Vincent covers the historic side; modern specs are Crown copyright);
Canada.

## Searching
- **archive.org by subject heading** works best: `subject:"garment cutting"`,
  `"tailoring"`, `"dressmaking"`, `"children's clothing"`, `"coats"`, dates 1850–1930.
  The 2026-10-27 run listed about 120 drafting systems not yet assessed (mostly men's
  tailoring overlapping Vincent, Croonborg and Gordon). Check a candidate's OCR text for
  measurement density before downloading.
- **Google Books:** full-view PDFs are 600 ppi. The anonymous API's daily quota runs
  out and the search page shows a CAPTCHA; search from a normal browser. The 2026-10-19
  sweep's queries and shortlist are in `archive/sourcing/`.
- **HathiTrust** needs a browser (Cloudflare). LoC scans are 300–400 ppi.
- After a good find, search the same author and publisher.

## Open gaps (sources)
- **Mid-century (style 5):** needs non-renewed 1930s–50s pattern books; Pivnick *How to
  Design Beautiful Clothes* (1949, not renewed) `pivnickdesignclothes1949` is held.
- **Shift dress:** no A source assessed yet.
- Goldsberry's *National Garment Cutter* (1888) is dimensioned but its scale unit was
  never printed (archive, round 8).
