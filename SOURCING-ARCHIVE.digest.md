# SOURCING-ARCHIVE.md: digest (rounds 1–11, archived 2026-10-27; current summary: SOURCING.md)

**Goal:** base patterns for complete timeless wardrobes in 5 styles (1 tailored,
2 workwear, 3 military outerwear, 4 simple everyday, 5 mid-century; children
within each), from sources that are cheap to vectorize.

**Proven pipelines:** grid-drafted sources vectorize almost mechanically at ~1%
accuracy (Walker pilot, `archive/pilot/GRID_FINDINGS.md`); prose+freehand sources are
costly (Browne pilot, `archive/pilot/FINDINGS.md`).

**Top sources (all PD-checked):**
- Walker *Needlework and Cutting Out* (1909): grid drafts; style 4 + children.
- Woman's Institute *Pattern Drafting* (1920): lettered-point blocks with a worked example.
  **Vetted 2026-10-23: reference only.** It has a waist, sleeve, collar and cuff, but no
  garments. There are two printed results; sleeve BC 8¾ fails the gate (8.60 by construction),
  and the back shoulder needs the Picken square digitized. The garments are in the WI sister
  papers.
- **Mitchell 1921 ladies' (vetted 2026-10-23, source #3 for women's tailored):** numbered-point
  text plus a to-scale diagram with every point marked. The text prints almost no results; the
  diagrams are the checks (fitted, rms 0.08 cm). Box coat built and in gate. Its drawn shoulder
  (5¾ in against a printed 6) is a report: the text governs (2026-10-24). See `archive/recipes/mitchell/FINDINGS.md`.
- Vincent *Systems of Cutting* (1903) + Croonborg (1907/17), Regal *Garment
  Cutter*/*Pattern Grader* (1904–17), Gordon (1910): menswear; styles 1 & 3.
- Pivnick *How to Design Beautiful Clothes* (1949, HathiTrust-cleared): modern
  flat pattern, trousers, coats, children's, graded size chart; style 5 + women's blocks.
- **ЕМКО СЭВ Vol. 3** (men's, 1988; held privately, SHA-256 `422145f8…e3b3`):
  formula table per point × sizes/heights/fullness + grading coefficients.
  A printed parametric program; needs Russian OCR. Vols 1,2,4,5,6 located
  (theory, women's, grading, girls, boys).

**Instructions sources (not geometry):** WI *Tailored Garments* (1925), Arny
*Clothing Construction* (1934), Hall (1943), *New Encyclopedia of Modern
Sewing* (1943–48, also a few grid patterns), *Distinctive Clothes* (1940),
MIL specs (construction op tables).

**Government:** open specs (US MIL via EverySpec, Ukrainian MoD) give
construction + graded finished measurements but never pattern shapes.
DLA patterns (AccuMark/paper) via public request form tied to a solicitation,
or FOIA. NARA WPA patterns and UK Utility patterns are not digitized.
Round 9 (2026-10-27): detail specs (MIL-DTL) beat CIDs (A-A-); MIL-DTL-44048H
+ G (combat coat) are a usable pair. ASSIST QuickSearch is the index (spec
PDFs only); SAM.gov notices and open DIBBS solicitations (PDF/DOCX/XLSX)
carry no pattern files; no public DXF-AAMA
collections found. Quickest geometry: measure a surplus garment.
Round 10: DTIC off limits. everyspec also has DOD-HDBK-743A (anthropometry),
MIL-STD-984A (women's sizes), quality-evaluation MIL-STDs, MIL-HDBK-150C/156A.
Older copies: QM uniform specifications 1912–17 (archive.org, PD) give
dimensioned style details (rated B); USDA Bureau of Home Economics leaflets
(Clarice L. Scott, 1929–52) are sketches and prose, not importable (D);
MIL-DTL-43455K (M-65 field coat) has sizes and a construction table (B).
Rating A geometry / B dimensions / C numeric support / D description only:
fetch A and B only.
Round 11 (grade A, archive.org subject-heading search; Google Books blocked):
Sheifer 1908 (girls'/women's coats, grading), d'Alessio 1906 (boys' jackets,
grading), Vincent *Jacket Cutting* (reefers, pyjamas) and *Military Uniforms*
(pea jacket), Merz 1911 (ladies' jackets/cloaks), Schorr 1917, Ratner 1908,
Weiler 1915. Downloaded to corpus/, not in MANIFEST.

**Renewed (trace-only):** Pepin 1942, Hillhouse 1948, Erwin, Picken *Modern
Dressmaking Made Easy*, Poulin, Mauck, Lewis 1960 ed.

**Gaps:** dedicated workwear geometry (fallback: derive from shirt/trouser/
jacket drafts, validate vs MIL spec finished measurements); HathiTrust needs
browser (Cloudflare); the maintainer's *Dressmaking Made Easy* edition unknown.

**ЕМКО pilot done:** tables self-validate (12/12 rows, ≤0.01 cm cross-check);
OCR+validation+vision-fallback pipeline viable (archive/pilot/emko/FINDINGS.md).
**Next:** full ЕМКО jacket (rows 13+, curves, other sizes via GOST); get Vols 2,4,5,6; DLA request
decision; per-style garment→source build list.

**Round 5 (2026-10-18, men's): new #2 source after ЕМКО = Harry Simons /
Clothing Designer Co. family** (1916–1924, US PD, LoC 300–400 ppi). One
lettered-point system: *Science of Grading* (1924; 4 graded sizes nested per
diagram + men's proportion table 34–52), *Drafting Pants and Overalls*
(1916), *Drafting Cotton Garments and Mackinaws* (1918: work coat, military
blouse, mackinaws; fills the workwear gap), *Designing Overcoat Patterns*
(1916), *Sack Coats, Dress Coats and Vests* (1918), *Boys' and Juveniles'*
(1922), *Drafting Trousers* (1945, no renewal found). Cross-check system:
Regal *American Garment Cutter* (1904; worked measures per lesson, 400 ppi).
Backups: Schorr 1915, Mitchell, *Modern Tailor Outfitter and Clothier*
(1919; multi-system). Vincent's archive.org scans are mostly ≤200 ppi, too
coarse. Navy *Uniform Regulations* 1922 = finished-size tables only
(validation). **Process: every good find gets an author + publisher
catalog search.**

**Round 6 (2026-10-19): candidates named by historical-tailoring.com.** Devere
*Handbook of Practical Cutting on the Centre Point System* (UK; 5th ed. 1883
full view + PDF on Google Books, text `Vak5c60mOnkC` + plates `20Sd-kXwXzcC`;
no 1866 scan exists online, archive.org only has the 1986 Shep reprint):
men's coats/paletots/waistcoats/trousers/boys' by graduated measures; style 1
candidate. *Sartorial Gazette* (London trade monthly): vol 25 1918 (Google
Books) + vol 26 1919 (archive.org); the 1915 Scriven skirt article isn't
located yet (HathiTrust, the maintainer's browser); secondary, multi-author.

**Round 7 (2026-10-19): Google Books full-view sweep** (`archive/scripts/gbooks_sweep.py`,
124 queries in `archive/sourcing/queries.yaml`; 1,631 PD volumes → 252 shortlisted in
`archive/sourcing/gbooks_relevant.tsv`). All vetted picks have a PDF download; browser-saved
Google PDFs are 600 ppi (an earlier "downsampled" note was wrong). **Top:**
Simons *Sack Coats* 1917 `qjUyAQAAMAAJ` (replaces the failed LoC download, source
#2) + *Pants and Overalls* 1915 + Simons' journal *Clothing Designer and
Manufacturer* 1916–17; Rosenfeld *Practical Designer* 1911/1918 (women's/misses'/children's, size
tables + grading nests; not men's) and Rude *New York Cutting School* 1906; Blakely & Patton public-school system 1907 (children); school texts
(Wake 1898, Ingalls 1911, Fales 1917, Baldt 1916/1929, Hanna 1922, WI 1924);
**USDA O'Brien body-measurement surveys 1939–41** (US-gov PD → size presets);
Klemm 1869 (civil/military/livery) and Ladevèze 1874 (uniforms): military gap;
Regal 1924 ed.; Sartorial Gazette 1915. Google Patents: ~840 pre-1931 US
drafting/measuring patents, mostly devices, so lower priority. Kidwell 1979
(Smithsonian index of US systems) pending download OK.
**Downloaded 2026-10-19** (Cloudbox corpus, via archive.org + `corpus_fetch.py`;
Google's own PDF downloads are CAPTCHA-gated, and archive.org `*goog` mirrors
are full-res 600 ppi): Blakely & Patton (children's candidate, crisp, dimensions
on drafts), Rosenfeld 1911+1918 (diagrams sideways), Regal 1914 (worked
measures per diagram), Carlstrom, USDA ×3, Wake + Ingalls (low geometry value),
Fales, Baldt 1916, Hanna; all 300–600 ppi and legible. **The maintainer saved the
Google-only items + Kidwell** → corpus `gb_*/`, `kidwell1979/` (600/400 ppi):
**Rude 1906 = strong men's source #3 candidate** (measure blocks + plates);
Devere 1883 text + plates (set complete); Klemm 1869 with all 16 fold-out Tafeln (300 ppi,
military/livery); WI 1924; Clothing Designer 1916/1917/1918; Devere's
*Gentleman's Magazine* 1873 + 1877 (Google says 1878); Sartorial Gazette 1918; Baldt 1929;
Vincent CPG part 1 (1902) + **new: Vincent *Coat Cutting & Making***; Sartorial
Gazette 1915, Clothing Designer 1918, Compaing 1855, Ladevèze 1874, WI 1928 +
tailoring + underwear, Longmans 1901, plain needlework 1898, Rosevear 1893.


**Round 8 (2026-10-20): the maintainer's links** (Chicago History Museum, sewingwithkenna,
empressofbuttons). 22 archive.org items fetched; the maintainer saved 6 Google Books
(Dobson & Humphreys 1885, Holding 1885, West-End System 1875, *Gazette of
Fashion* 1868/1881, *Record of Fashion* 1882). **Top:** Goldsberry *National
Garment Cutter Book of Diagrams* 1888 (`nationalgarment00gold`). Every piece is
dimensioned in apportioning-scale units, with seams and grain printed. That
makes it a **new source type (dimensioned diagram)** with grading built in.
Usable subset: children's, boys', undergarments, aprons (the women's
outerwear is bustle-era). **Gate check (2026-10-20): fails on size.** The
length of a scale space is never printed in the 1884, 1888, 1895 or 1903
books or the 1897 journals; it belonged to the physical rulers. Its other
checks (seam pairs, arithmetic) are scale-invariant, so Goldsberry is
**demoted to backup** unless an original ruler's unit is obtained. **Mitchell 1921 ladies'**
(`newstandardworko00mitc`): numbered-point steps plus diagrams for jackets,
sleeves, collars and skirts; the women's tailored candidate, same publisher as
the men's Mitchell. West-End 1875 (proportion table, disproportion plates)
and Dobson & Humphreys (block grading) are men's secondaries; Holding and
Merwin are prose. German 1912/1914 items need author death dates. Unheld
Google titles and unexplored leads (cuttersguide, the de Baerdemaeker uploads,
European pattern-sheet archives) are listed in SOURCING.md round 8.
**Blakely & Patton 1907 gate check: fails.** It's a single-size
direct-measure system; its printed inches are inputs, its seam checks are
equal by construction, and its figures aren't to scale (Fig. 11 −4.7%). It's
a reference only.
**Rosenfeld 1911 gate check: real checks, ¼" precision.** The children's
table prints width of back and collar (pattern results) for sizes 2–14.
The draft rule reproduces width of back within one ¼" step (size 6
−3.0%; 5 of 7 sizes match after rounding), and the source contradicts
itself on size-6 depth and sleeve. It can't meet strict 1%, because the
table's ¼" rounding alone is ±2%. A precision-aware gate is the project's call.
**Effect:** women's/children's no longer wait on ЕМКО vols 2/5/6. The
candidates are Mitchell 1921 (women's), Simons' boys' and juveniles' books
(extends source #2, no new adapter) and Rosenfeld 1911/1918 (graded
misses'/children's). Men's order is unchanged (Simons #2).

**German rights check (2026-10-20):** Klemm 1869 is cleared (author
1819–1886). Marie Niedner's *Haus-Schneiderei* (not anonymous; original ca. 1910) is
cleared too: German Wikipedia gives 1863–1945, with the death date
unsourced. Behrendsen 1912 is cleared: the Schumann-Briefdatenbank (person 15394)
gives Gertrud Behrendsen as 1855 (Königsberg) to 15 Feb 1936 (Potsdam),
daughter of the painter August Behrendsen and a teacher at the Potsdam
Gewerbeschule from 1890, which matches her 1912 preface. She's public
domain in Germany since 2007, and has no entries in the EUIPO orphan works
or out-of-commerce registers.
**All three German books are now cleared.** **Later saves:** Holding,
*Trousers Cutting* 1892 (`gb_holding1892_trousers`) and *Stone's Advanced
Superlative Trouser System* 1913 (`gb_stone1913_trousers`), both held,
neither vetted yet. The USDA Misc. Pub. 454 save duplicates
`womensmeasuremen454obri`.
