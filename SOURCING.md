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

## Garment submissions
Anyone can copy a garment (rub-off or deconstruction) and offer it through the `garment-submission`
issue form; the site's Contribute page explains how. Intake:
1. **Grade it** with the table above: dimensioned pieces or a DXF are A, finished measurements are
   B. Photos and prose alone are D: thank them, say what numbers would make it usable, close it.
2. **Check the rights.** Both permission boxes ticked (their work, CC BY 4.0). A current designer's
   recent garment, or one with logos or printed art: ask or decline.
3. **Add it to the corpus** as `corpus/submission-<issue number>/`: the attachments, the issue text
   as `submission.md`. In `scripts/corpus_manifest.py`, add it to the by-hand sources, with the issue
   URL as `origin`, the licence and credit as `rights`; run `write`. Allow the folder in `.gitignore`.
4. **Queue it** in BUILD_QUEUE.md, cited by folder id, and link the item on the issue. Credit the
   contributor in the brief and on the site's Sources page, as CC BY 4.0 needs.

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
- **T-shirts:** loose, standard, slim (graded XS–XXL in the held standard tee DXF).
- Others: Zeltbahn ponchos and hood, boonie hat, high-vis vest, Swiss backpack.

Most are single-size: use them for proportions on our blocks, not as graded pieces.

**Held** (2026-10-27, `corpus/openpattern/<id>/`: DXF, PDF, PNG; the CLO and GLB files
stay in the maintainer's Downloads). Read with `node designs/tools/dxf-aama.mjs <file.dxf>
[--svg out.svg]`: per piece, net size and perimeter, notches, drill holes, internal lines,
grain. CLO puts the net outline on layer 1 and the cut line (with allowance) on 14.
- `tuta-jumpsuit`: Thayaht's TuTa (1920), size M, 13 pieces: one body piece with a crotch
  slit, rectangular sleeves (40 × 60 cm), triangle and square gussets, patch pockets.
  All straight lines: the quickest build here.
- `cs95-trouser` (built 2026-10-28 as `designs/field-trousers`): British CS95 field trouser, size M, 39 pieces: three-piece back,
  front, fly, waistband, belt loops, cargo and patch pockets with flaps.
- `us-tactical-smock` (built 2026-10-28 as `designs/anorak`): hooded smock, **graded XS–XXL** (six sizes): back, front, sleeves,
  three-piece hood, front placket, pocket bags and flaps.
- `standard-tshirt`: **graded XS–XXL** (Grade Rule Table "Normal_Tee"): front, back,
  sleeve, collar, back-neck tape; drafted as `designs/t-shirt` (2026-10-28).

## Sources in use
| Source (folder id) | Grade | Designs |
|---|---|---|
| Simons, *Drafting Cotton Garments and Mackinaws* (1918) `draftingcottonga00simo` | A | chore coat, boys' work coat, shop coat, barber's coat, hunting coat, mackinaw, military blouse, bar vest |
| Simons, *Designing Overcoat Patterns* (1916) `designingovercoa00simo` | A | peacoat, overcoat, box overcoat, ulster, balmacaan, mantle, surtout, fitted overcoat, cape overcoat |
| Pivnick, *How to Design Beautiful Clothes* (1949, not renewed) `pivnickdesignclothes1949` | A | shift dress, culottes, kimono dress, dolman cape, princess coat |
| Walker, *Manual of Needlework and Cutting Out* (1909) `krl00366374` | A (grid) | nightshirt, nightgown, smock, frock, pinafore, knickerbockers |
| Woman's Institute, *Pattern Drafting* (1915/1920) `patterdraftingpicken` | A (blocks) | shirtwaist dress |
| Mitchell, *Ladies' Tailor-Made Garments* (1921) `newstandardworko00mitc` | A | tailored jacket, fitted jacket, box coat, gored skirt, pleated skirt, circular skirt, divided riding skirt, apron riding skirt, kimono jacket, cape, Prince Albert jacket |
| Schorr, *The Expert Designer* (1917) `expertdesignerpr00scho` | A | tunic skirt (Diagram 7), four-gore panel skirt (Diagram 65) |
| d'Alessio, *The Art of Designing, Cutting and Grading Gentlemen and Boys Clothes* (1906) `artofdesigningcu00ales` | A | cycling breeches (Fig. 30) |
| ЕМКО СЭВ т.3 (1988) `emko` | A (tables) | windbreaker, quilted jacket, winter coat, topcoat, jacket, waistcoat, trousers |
| Simons, *Drafting Pants and Overalls* (1916) `draftingpantsove00simo` | A | work pants, breeches, bib overall, overall pants, peg-top pants, turn-ups |
| Simons, *Designing Sack Coats and Vests* (1918) `designingsackcoa00simo` | A | sack coat, dinner jacket |
| Open+Pattern, Thayaht's TuTa (1920), DXF, CC BY 4.0 `openpattern/tuta-jumpsuit` | better than A | jumpsuit |
| Open+Pattern, British CS95 field trouser, DXF, CC BY 4.0 `openpattern/cs95-trouser` | better than A | field trousers |
| Open+Pattern, US tactical smock, DXF, CC BY 4.0 `openpattern/us-tactical-smock` | better than A | hooded smock |
| Open+Pattern, Standard T-shirt, graded DXF, CC BY 4.0 `openpattern/standard-tshirt` | better than A | T-shirt |
| Vincent, *Cutter's Practical Guide… Shirts, Undergarments* (1890) `vincentmakingshirts18xx` | A | pyjama jacket, pyjama trousers, work shirt, service shirt, shirt, dressing gown, smoking jacket, drawers, painter's jacket, work aprons |
| Sheifer, *Designing and Grading Ladies', Misses' & Children's Garments* (1908) `nssheiferssystem00shei` | A | girl's coat |
| Merz, *Practical Cutting System for Ladies' Jackets and Cloaks* (1911) `merzspracticalcu00merz` | A | women's peacoat, field jacket, Inverness coat, riding frock coat, three-piece long coat |
| Simons, *Designing Boys' and Juveniles' Clothing* (1922) `designingboysjuv00simo` | A | boy's jacket, Norfolk jacket, sailor pants, Eton jacket, golf pants, scout pants, cape overcoat, kilt (hem and length only), raincoat, double-breasted waistcoat, scout coat, button-on middy, reefer |
| USDA O'Brien body-measurement surveys (1939–41) `childrensbodymea365obri`, `bodymeasurements366obri`, `womensmeasuremen454obri` | C | the 75 children's size sets (`designs/sizes/`) |

Left to build from these: Mitchell's double-dart tight-fitted jacket; Simons 1916's
balmacaans, mantle, surtout, French overcoats and cape overcoat.

## Held, grade A, not built yet
In the corpus; all public domain in the US. Grouped by the gap they'd fill. **Variants are
welcome**: a shirt, trouser or dress close to existing work (same source system, block or
library) is cheap and counts as progress; don't skip a garment because a similar one exists
here or in FreeSewing. So far 15 of 27 designs are coats or jackets (plus two waistcoats); shirts, trousers,
skirts and dresses are under-represented.

**Quickest next (same systems and libraries as built designs):**
- Simons, *Drafting Pants and Overalls* (1916) `draftingpantsove00simo`: work pants built
  (2026-10-27), breeches, bib overall, one-piece overall (overall pants) and full peg pants (2026-10-28); left: stout and young men's drafts, cuff bottoms.
- Vincent, *Cutter's Practical Guide… Shirts, Undergarments* (1890) `vincentmakingshirts18xx`:
  pyjamas and the work shirt built (2026-10-28); left: shirts (dress, fronted), drawers, dressing gown, aprons.
- Simons, *Designing Boys' and Juveniles' Clothing* (1922) `designingboysjuv00simo`: boy's
  jacket, knee pants, knickers and middy blouse built (2026-10-28/29); left: Norfolk, Eton,
  scout coat, bloomers, golf and sailor pants.
- Mitchell 1921 (built system): two-piece skirts; ЕМКО trousers library: shorts and variants.

**By gap:**

| Gap | Source (folder id) | Has |
|---|---|---|
| Girl's coat, women's coats | Sheifer, *Designing and Grading Ladies', Misses' & Children's Garments* (1908) `nssheiferssystem00shei` | Lettered drafts in inches: tight-fitting, semi-fitting and box coats; grading |
| Boy's suit jacket, children's | Greenstein, *Method of Cutting for Men's and Boy's Clothing* (New York 1895, bilingual; archive.org `erstefranzsischa00gree`, not yet downloaded) | Inch and reduction systems; children's clothing |
| Boy's suit jacket | d'Alessio, *Designing, Cutting and Grading Gentlemen and Boys Clothes* (1906) `artofdesigningcu00ales` | Boy's jacket and sailor coat (8 years); grading |
| Boy's suit jacket, boys' wear | Simons, *Designing Boys' and Juveniles' Clothing* (1922) `designingboysjuv00simo`; Vincent, *Cutter's Practical Guide*, boys (1902) `cutterspracticalguide-part1boys1902` | Same system as the built Simons designs |
| Reefer | Vincent, *Cutter's Practical Guide to Jacket Cutting* (1897) `cutters-prac-guide-jacket-cutting` | Reefers, Norfolk and patrol jackets (the laptop's copy lacks book pp. 57–60, plates 26–27: the dressing gown and pyjama jackets) |
| Women's peacoat / field jacket | Merz, *Ladies' Jackets and Cloaks* (1911) `merzspracticalcu00merz`; Sheifer (above) | Women's jacket and cloak drafts |
| Field jacket, pea jacket | Vincent, *British Military Uniforms* (1902, 1914) `cutters-guide-brit.-mil.-uniforms.-1`, `militaryuniformsbritish-images` | Pea jacket ("British warm"), tunics, overcoats |
| Children's (graded) | Rosenfeld, *Practical Designer* (1911, 1918) `practicaldesigne01rose`, `practicaldesigne02rose` | Children's size tables, grading nests |
| Women's | Schorr, *The Expert Designer* (1917) `expertdesignerpr00scho`; Ratner (1908) `ratnersuptodatem00ratn`; Weiler (1915) `weilerladiestail00weil` | Drafting; Ratner grades ladies' and children's; Weiler's riding habit coat is drafted |
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
- **Threadloop** (threadloop.app): a crowdsourced index of modern patterns that links to each
  designer's own site. Search it before choosing a garment, both for free equivalents and
  for designers whose licence lets us redraft their patterns. Anonymous search works:
  `/patterns?q=<term>&free=only&commit=Search`, and `/designers?page=N` lists every designer
  with total and free counts. See the survey below.

## Free modern patterns: Threadloop survey (2026-10-29)
Threadloop indexes 120,863 patterns from 6,636 designers. 8,750 are free, from 1,799
designers, and only 150 designers have ten or more. Free doesn't mean reusable: almost every
free pattern is still the designer's copyright. The aim was to find designers whose licence
would let PublicSewing redraft their free patterns as made-to-measure designs, with credit.
Their own sites were checked, not Threadloop's listing.

**Open licences: two, both already in use.**

| Publisher | Free | Licence | Notes |
|---|---|---|---|
| Open+Pattern | 9 sets | CC BY 4.0 | Military and workwear; the jumpsuit, field trousers and hooded smock come from it. The rest (Zeltbahn, M54 jacket, MA-1 bomber, M1951 parka, backpacks) are candidates |
| FreeSewing | 49 listed (278 search hits) | MIT (npm `license` field of every design package) | Already drafted from measurements; our blocks |

**Everything else checked keeps its rights.** Grouped by what its terms say:

| Terms | Publishers (free patterns on Threadloop) |
|---|---|
| Personal use only, no derivatives | Peppermint Magazine (17), Grainline Studio (12; read from a search summary), The Museum at FIT (5; site terms forbid modification) |
| Copyright kept, made items may be sold, files not redistributed | So Sew Easy (84) |
| Non-commercial research, study and education only | V&A (9: shirt, huipil, Mary Quant dresses, kimono dress, tie-on pockets, bags) |
| Copyright notice only, no licence | Mood Sewciety (586), Snaply (101), Kotiliesi (83), pattydoo (81; terms forbid editing), Modern Sewing Patterns (42; men's, women's, children's, free in S–XL), Tiana's Closet (178, flagged by Threadloop), LACMA (13 historic garments, each one scaled size), Genesee Country Village & Museum (8; corsets, bloomers), MYOG Tutorials (gear) |
| No licence found | Initiative Handarbeit (132, knitting), Bernina (109), Meillä kotona (95, knitting), Shkatulka (78; Russian; men's, women's and children's, large size range), DRCOS (43; Japanese garments and cosplay), Dress Developer (48; drafted from measurements already), Choly Knight (197, toys), Unfettered and Sewing Times (bags), Rafael Kouto, Jess Dang, LearnMYOG |
| Not readable (blocked or verification page) | Burda (383 free of 16,755), La Maison Victor (271), Made for Mermaids (135), Patterns for Pirates (50), Petite Stitchery (48), See Kate Sew (45), Closet Core (15), SHOWstudio (19; designer garments), Umi Mode (no site) |

Many of the top free designers aren't garment designers: SewCanShe (300), Tilda's World (177),
Purl Soho (121), the fabric shops (Kokka, Art Gallery, Robert Kaufman, Riley Blake, Moda) and
the quilting sites publish bags, toys, quilts and home goods.

**Tutorial section** Can link to other sewing resources to teach anyone interested in learning. https://sewcraftlypatterns.com/tutorials/ is a good first link. We may also wish to provide our own small intro tutorial, with illustrations for understanding basic sewing items and tools used in the process.

**What PublicSewing adds.** Of the free garment patterns found, only FreeSewing's and Dress
Developer's are drafted from the wearer's measurements; the rest come in a graded size range
or, for museum patterns, one size. That is the gap: made-to-measure, children's sizes
included.

**Next step: ask.** Designers whose terms are silent or keep all rights could still agree to
have their free patterns redrafted as made-to-measure designs here, credited and linked. The
strongest candidates for garments are Mood Sewciety, Modern Sewing Patterns, Shkatulka,
DRCOS, LACMA and the V&A (museums often license on request), and Open+Pattern needs no
permission. Every use needs the designer's written permission on file before any work. A
free pattern with no licence is a design reference at most, used the way ЕМКО is: its
proportions and methods, never its text, pieces or images.

## Open gaps (sources)
- **Mid-century (style 5):** needs non-renewed 1930s–50s pattern books; Pivnick *How to
  Design Beautiful Clothes* (1949, not renewed) `pivnickdesignclothes1949` is held.
- Goldsberry's *National Garment Cutter* (1888) is dimensioned but its scale unit was
  never printed (archive, round 8).

## Baby and toddler measurements (2026-11-09)

`designs/sizes/babies.mjs` builds six sets below the USDA 1939 range (24 to 37 in tall, 3 to 37
months) for BUILD_QUEUE F10. Both sources were supplied as PDFs (`~/Downloads/chatgpt/`), not in
the corpus.

| Source | What it gives | Use |
|---|---|---|
| Commercial Standard CS151-50, *Body Measurements for the Sizing of Apparel for Infants, Babies, Toddlers and Children* (US National Bureau of Standards, 1950; US government work), supplied as `Body_Measurements_for_the_Sizing_of_Appa.pdf` (19 pp.) | Size tables in inches, boys and girls together, one build: babies 3–36 months (Table 1: stature, chest, vertical trunk, shoulder-and-arm and vertical lengths only), toddlers 1–4 (Table 5: adds waist, thigh, neck, armscye, upper arm, cross-back, shoulder, scye depth, crotch length), children 2–6X (Table 7: adds hip). Girths over indoor clothing. Garment lengths (Tables 2, 6) | The sets' sizes, lengths and most girths |
| Snyder, Spencer, Owings and Schneider, *Physical Characteristics of Children as Related to Death and Injury for Consumer Product Safety Design* (Univ. of Michigan HSRI for the CPSC, 1975, UM-HSRI-BI-75-5; [NIST AnthroKids](https://math.nist.gov/~SRessler/anthrokids/child.html)), supplied as `Snyder_1975_Child.pdf` (240 pp., tables are images) | Bare-body percentiles by age from birth: head, chest, waist, forearm, upper arm, mid-thigh, calf, ankle girth (neck from 25 months); no hip or wrist girth | Head, ankle and wrist (from forearm) at every size; babies' arm and thigh girths as growth curves applied to toddler size 1 |

Babies' waist is set equal to chest (CS151-50's toddler size 1). Cross-checked 2026-11-09:
Snyder's bare-body waist is 0.86–0.90 of chest under 18 months and 0.95 at 3 years, where
CS151-50 agrees; CS151-50's ratio falls from 1.00 at toddler 1 to 0.90 by 6 as nappies go, so its
clothed basis is kept.

Checked and not used: NHANES 2021–23 body measures (BMX_L): its babies have only weight, length,
head (to 6 months) and arm girth and length, and it's per-person data, not size tables.

## Children's source follow-up (2026-11-07)

The archive's prior gate checks control this list. These are not newly cleared
Grade A build sources merely because a scan contains numbered drafting steps.

| Source | Grade A material inspected | Best use |
|---|---|---|
| [Blakely and Patton, *The Practical System for Drafting Ladies' and Children's Clothing* (1907)](https://archive.org/details/practicalsystemf00blak) | Boy's working apron with measurements printed on the diagram; girl's working apron with numbered measurements and directions; children's waists and a one-piece dress | **Previously tested and rejected by the archive's 2026-10-20 gate check**: no independent result checks, ambiguous directions, and diagrams not reliably to scale. Instructions/reference only; do not queue as a verified Grade A source. |
| [Glickstein, *Ladies', Misses' and Children's Garments* (1909)](https://archive.org/details/glicksteinssyste00glic) | Children's box-coat diagrams for size 8 (28-inch bust, stated scale) and sleeve diagrams for sizes 8 and 12 | Previously listed in the archive as unassessed. Its printed scale and actual pattern geometry still need verification; lower priority than held Simons and Rosenfeld sources. |

Related access lead, **not graded**: Glickstein's separate *System of Designing and
Cutting for Men's, Boys' and Children's Garments and Novelties* (1909) is
[catalogued with page images at HathiTrust](https://onlinebooks.library.upenn.edu/webbin/book/browse?c=x&key=Tailoring+--+Handbooks%2C+manuals%2C+etc.&type=lcsubc),
but its garment plates have not been inspected.

## Expanded wardrobe sourcing leads (2026-11-07)

The current catalog has drafted suit jackets, trousers and dresses, but limited
variety in those families. Further sourcing should prioritize distinct trousers,
dresses, one-piece garments, shirts and neckwear over additional coats. Non-Western
garments are a catalog-wide gap. These leads are research inputs, not build-queue
items; inspect each garment's complete draft and rights before implementation.

| Gap | New source and evidence | Status |
|---|---|---|
| South Asian garments, women's trousers, neckline variants | [CBSE, *Basic Pattern Development*](https://cbseacademic.nic.in/web_material/publication/cbse/41BasicPatternDevelopment-XII.pdf), practicals 3–14: measured drafts for salwar, churidar payjama, saree and choli blouses, kameez, A-line kameez, kalidar and two-kali kurtas; V, U, round, square, glass and sweetheart necklines | **A geometry, inspected online.** In-copyright educational source: methods and proportions only under the project's current policy; do not copy pages or figures. |
| South Asian clothing, dress variation, jeans and shirt/trouser construction | [Bharat Skills, *Dress Making, Volume I of II: Practical*](https://bharatskills.gov.in/pdf/E_Books/Dress_Making_Volume_I_of_II_Practical.pdf): measured drafting exercises for princess-line and umbrella/yoke kameez, salwar/surwar, children's frock, and a denim jeans exercise; construction and grading for men's shirts and trousers | **A for the measured draft exercises; inspect garment by garment.** It is a separate Indian government vocational source, not simply another CBSE edition. Some chapters are construction or block adaptation only. Apply the project's in-copyright method-only policy unless reuse permission is established. |
| Jeans and adult short-leg jumpsuit | [Atacac Sharewear](https://shop.atacac.com/collections/sharewear): [3D-pocket jeans](https://shop.atacac.com/products/3d-pocket-jeans) and [jumpsuit](https://shop.atacac.com/collections/sharewear/products/jumpsuit) list printable PDF and DXF pattern files and CC BY-SA terms on their item pages | **A geometry offered, files not obtained.** Check download content and the share-alike obligations before adapting or redistributing pattern geometry. |
| Dresses and neckwear | Isabel De Nyse Conover, *A Complete Course in Dressmaking* (1922): [dress volume](https://archive.org/details/completecoursein06cono) and [men's-clothes volume](https://archive.org/details/completecoursein00cono). The latter has a measured necktie draft; the dress volume discusses multiple dress forms and pattern making. | **Lower-priority lead.** Much of the material adapts existing patterns rather than supplying complete new drafts; inspect individual plates before considering Grade A. US public domain by publication date. |

For T-shirts and related tops, the maintainer supplied
[WikiHow's neckline overview](https://www.wikihow.com/Types-of-Necklines) as a
**style vocabulary reference**, not a Grade A geometry source. The page was inaccessible
to the research agent (robots.txt); a screenshot supplied by the maintainer on
2026-11-07 shows 27 labeled examples. It names round, scoop, boat, V-neck,
plunging, halter, jewel, collar, sweetheart, square, surplice, split, mock,
cowl, turtleneck, one-shoulder, off-the-shoulder, strapless, tie neck, apron
neck, Queen Anne, asymmetrical neck, keyhole neck, scalloped neck, U-shaped
neck, illusion neck and convertible neckline. This is a vocabulary and scope
reference, not a dimensioned pattern source.

For implementation, group simple neckline reshaping (round, scoop, boat, V,
plunging, jewel, square, sweetheart, split, Queen Anne, asymmetrical, scalloped,
U-shaped and keyhole) separately from designs
that change support, closure, collar or bodice structure (halter, surplice,
cowl, collar, mock, turtleneck, one-shoulder, off-the-shoulder, strapless,
tie neck, apron neck, illusion and convertible). These groupings are implementation judgments,
not claims made by the screenshot. Use CBSE's dimensioned neckline constructions
above for draft geometry, and verify other shapes against measured sources.

The maintainer welcomes additional **inspired designs** based on Open+Pattern. Keep a
historic source design distinct from a new design inspired by it. An inspired design
should name and link its direct source and encourage a donation to that source,
following the existing Open+Pattern attribution practice. Check each source's own
license before reusing pattern files.

**Decisions (2026-11-09):**
- **Atacac Sharewear is a reference only.** Its patterns are CC BY-SA, and share-alike
  would carry over to an adapted design, against the repo's noncommercial licences. Jeans
  are our own design instead, on our trousers, from public-domain work-trouser drafts.
- **CBSE and Bharat Skills are queued as inspired designs,** methods and proportions only,
  under the copyright rule above: never their text, figures or page images.

Still without a newly verified Grade A source in this pass: matched men's and women's
suit trouser/jacket sets, broader women's trouser cuts, a conventional adult romper,
bowties and ascots, Henley or jersey drafting, and denim garments beyond jeans.
More jacket or coat references alone will not fill these gaps.

### Institutional specifications found 2026-11-07

The previous search understated institutional documentation. Search by **manufacturing
specification**, **purchase description**, **pattern number** and **FOI release**, not
only by sewing-pattern terms. These examples contain useful numbers, but their
full cutting patterns are generally separate contractor/government files.

| Institution and direct source | Relevant content | Geometry and access |
|---|---|---|
| [UK Ministry of Defence, FOI2024-13877](https://assets.publishing.service.gov.uk/media/677d59f6d119b3453766554d/FOI2024_13877.pdf) | Released specifications include men's No. 2 dress jacket and trousers (DC/MS/6263-2), women's No. 2 dress trousers (DC/MS/7108), and men's long-sleeve shirts (DC/MS/6951). The men's suit lists 99 sizes; women's trousers list 31 sizes. | **B, detailed manufacturing/finished dimensions.** Electronic pattern numbers are identified but the pattern geometry is not in the PDF. The specifications assert Crown copyright and restrictive use terms; inspect rights before use beyond factual methods or measurements. |
| [US DLA, A-A-55199A necktie specification](https://quicksearch.dla.mil/Transient/9E1920CF835F4B1C90FD84451B5D2913.pdf) | Four-in-hand construction, interlining and placement dimensions; points to government-furnished patterns. | **B.** The separate cutting pattern is not included. |
| [US Army, GL-PD 19021 necktie purchase description](https://imlive.s3.amazonaws.com/Federal%20Government/ID262543746976429383384241382749370320737/GL-PD_19021_-_Necktie_-_Final_-_15Jul19.pdf) | Regular and short ties: 61 and 57 inches long, both 3 inches at the widest end, with intermediate and narrow-end widths; component list and construction. | **B, strong for a modern tie.** It explicitly says standard cutting patterns are furnished by the government separately. |
| [US Navy, MIL-N-29113B woman's bow necktie](https://quicksearch.dla.mil/Transient/DADB5BA85AE548BE80BDA0451491FAFC.pdf) | Specification for a pre-tied women's bow necktie. | **B candidate.** Inspect its full dimensional tables and figures; the transient DLA link may expire. |

The UK document demonstrates that modern public-sector suit and trouser data exists.
Its pattern identifiers give a concrete path for an access request, while its
published measurements can support an independently drafted pattern. Do not list
the unpublished government patterns as held Grade A sources.

### Historical-source recheck 2026-11-07

Historical cutting manuals often print the actual draft rather than referring
the reader to a contractor's separate pattern file. The immediate problem is
partly catalog use: some usable drafts are already held but were overlooked
when summarizing gaps.

- [Vincent, *Cutter's Practical Guide… Shirts, Undergarments*](https://archive.org/details/vincentmakingshirts18xx), already held as `vincentmakingshirts18xx`, includes a **football shirt** chapter at book pp. 29–31 with a numbered draft and sleeve/hood instructions. It describes a woven Association-football shirt and distinguishes it from a knitted Rugby jersey. This is a shirt/athletic-wear lead, **not** a knit jersey pattern.
- [Pivnick, *How to Design Beautiful Clothes* (1949)](https://archive.org/details/pivnickdesignclothes1949), already held as `pivnickdesignclothes1949`, has trousers, slacks and shorts as well as dresses. Recheck those plates before claiming a women's trouser source gap; the gap may be in queued/built variants.
- [Simons, *Drafting Trousers for Men, Boys, Women* (1945)](https://archive.org/details/simonsdraftingtrousers1945), already held as `simonsdraftingtrousers1945`, is a direct source for women's and men's mid-century trouser cuts. The archive reports a 600 ppi scan and no renewal found in its local CCE search. Check its specific drafts before looking for another trouser manual.
- Vincent's [*Systems of Cutting All Kinds of Tailor-Made Garments* (1903)](https://archive.org/details/b1108865), already held as `b1108865`, includes proportioned trousers, breeches, waistcoats, and lounge/reefer coats. It may serve tailored sets even where a separate uniform specification is inaccessible.

Search future historical additions by the **specific garment name in the full
text or contents** and verify the corresponding diagram. A title or catalog
subject alone does not establish Grade A completeness.

**Additional historical leads located after the archive recheck:**

| Source | Garments supported by the scanned text | Gate before use |
|---|---|---|
| [Allington, *Practical Sewing and Dressmaking* (1913)](https://archive.org/details/practicalsewingd00alli) | Book pp. 203–209 give a child's romper draft and cutting directions; the contents also list children's pajamas, a Russian blouse suit, and several dresses. US public domain by date. | **Candidate, not gated.** The catalog says its drafting chart was supplied in a pocket. Confirm that the scan includes that chart, that all romper curves can be reconstructed, and that the print gives a usable independent check. This is a child's romper, not the requested adult one. |
| [Weidel, *Instruction Book* (1914 edition)](https://archive.org/details/weidelsinstructi01weid) | Contents list a ladies' shirt, middy blouse, skirts, drawers, and a numbered “Japanese Kimono with Straight Front” draft. US public domain by date. | **Candidate, not gated.** The method depends on Weidel's combined square and curves; establish the tool's dimensions and scan completeness. The labeled kimono is a Western tailoring interpretation, not evidence for traditional Japanese construction. |
| [Blackmore, *The ABC of Cutting and Making Garments for Everyday Needs* (1920)](https://play.google.com/store/books/details/Betsy_L_Blackmore_The_ABC_of_Cutting_and_Making_Ga?id=Jpw_AQAAMAAJ) | Bibliographic description promises drawn patterns, cutting layouts, and construction for everyday garments. Free full-view listing, but plates and garment contents have not been inspected. | **Unverified lead, access may require a browser.** Check exact garment list, numbered dimensions, completeness, scan quality, and US rights before assigning a grade. |

### Locally supplied scans reviewed 2026-11-07

The newly supplied scans add two useful candidates to the expanded wardrobe search. These are **candidate sources**, not garment-level Grade A approvals; check the relevant plate, text, scale and independent dimensions before building a design.

| Work | Scope and finding | Next check |
|---|---|---|
| Paul Elle, *The Cutter: A Treatise on Cutting Ladies' Garments* (1903), supplied as `The_Cutter.pdf` | Numbered proportional drafts for women's waist and jacket forms, long and short trousers, skirts, blouses, girls' dresses, vests and riding wear. The scale is printed in the book. Previously named in the sourcing archive, but this scan was not in the corpus manifest. | Prioritize the women's trouser and blouse plates, then a dress or tailored jacket; confirm each draft can be reconstructed without a missing tool or chart. |
| W. D. F. Vincent, *The Cutter's Practical Guide to Cutting Livery Garments*, supplied as `The Cutters Practical Guide_British Liveries.pdf` | The title page identifies coats, vests, trousers, breeches and gaiters for livery servants. This image-only scan adds a specific ceremonial and occupational clothing source. | Inspect the numbered plates visually for complete dimensions and usable resolution. It is not evidence for non-Western garments or ordinary suit sets. |
| Walker and Strachan, *Manual of Needlework and Cutting Out*, revised edition (1914), supplied as `Manual_of_Needlework_and_Cutting_Out.pdf` | A substantially revised edition of the Walker work already held in a 1909 scan. Its later cutting section includes blouses, skirts, nightwear, children’s overalls, sleeping suits, and other basic garments. | Compare exact plates with the held edition; keep only drafts that add usable geometry or a distinct garment. |
| Wakeman and Heller, *Scientific Sewing and Garment Cutting* (1898), supplied as `Scientific_Sewing_and_Garment_Cutting.pdf` | Another scan of a work already in the corpus manifest (`scientificsewing00wake`). It covers basic and children's garments. | Compare image quality and completeness with the held scan before replacing or adding anything. |
| Anna Ben-Yûsuf, *The Art of Millinery* (New York 1909, public domain in the US), supplied as `The_Art_of_Millinery.pdf` (Google Books scan, 265 pp., text layer) | Reviewed 2026-11-09. **Grade A for brimmed hats: Lesson I (book pp. 7–24)** drafts a hat frame from head measures: round or oval brim with separate front, back and side depths; crown tip; straight, conical or bell crown side band. Lesson VII (children's bonnets, infant's cap, pp. 96–113) measures the head but fits the crown by pinning pleats: grade C/D. The rest (wire frames, covering, shirring, straw, trimming, flowers, business) isn't drafting. | Queued as BUILD_QUEUE 57, `brimmed-hat`. Add it to the corpus with the other supplied scans. |
| Vincent, *Making Shirts*, supplied as `vincentmakingshirts18xx.pdf` | Byte-identical to the held `vincentmakingshirts18xx` PDF. | No import needed. |

These scans do not yet supply a verified adult romper, denim draft, neckwear pattern, or non-Western construction source. The livery volume broadens occupational and ceremonial menswear but does not resolve those gaps.
