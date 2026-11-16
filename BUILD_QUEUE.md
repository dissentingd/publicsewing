# Build queue

The garments still to be built, in order, and how an agent takes one; the first `open` row is next.
**Finished items are in [BUILT_QUEUE.md](BUILT_QUEUE.md)**, under the same ids (rows 1–44, F0–F12,
B1–B4, K1–K6, S1–S2, M1–M2): look there for an id cited in code or a brief, and for the "As built" notes.
The catalog is [designs/README.md](designs/README.md).

## Taking an item
1. **Pick the first item with status `open` below.** If several agents are working at once,
   each takes the first open item in a free lane (see Lanes). Items in the same lane go one
   after another because they may change the same shared library file.
2. **Claim it** before any other work, if anyone else is building: change its status to
   `claimed (<agent or branch>, <date>)` in this file and commit that alone. A push to `main`
   deploys the site, so don't push a claim to `main`: agents sharing a checkout see the commit, and
   the person running several agents gives each its own item and lane. An outside contributor says
   which item in an issue or draft pull request.
3. **Build it** by the per-garment workflow (below), in a branch or worktree of your own if
   other agents share the checkout.
4. **Finish it**: set its status to `done (<design id>)` and move its row to
   [BUILT_QUEUE.md](BUILT_QUEUE.md) in the design's commit, or set it to `blocked (<why>)` with a line
   saying what's needed. Don't push unless you've been told to; the person running you decides.

Before starting, read [AGENTS.md](AGENTS.md), the book's row in [SOURCE_NOTES.md](SOURCE_NOTES.md),
and your `BUILD_NOTES.md` if you have one. The item's notes, "start from" and pages are guesses made
before the pages were read: most items extend an existing design, but read the plate before choosing
which, and correct the row as you finish.

## Per-garment workflow
Follow [AGENTS.md](AGENTS.md), with [CONTRIBUTING.md](CONTRIBUTING.md) Steps 2–10 behind it, for the item you claimed: read the
source's pages (render the diagrams and read them as images, not only the OCR), map every
source number to an option default, extend the "start from" design, make every size pass,
snapshot every design whose shared `lib/` file you change, look at the renders, write the
brief, then the preview, illustration prompt and docs of Step 10. Also:
- **Threadloop:** note in the brief whether a free equivalent exists and whether any is drafted
  from measurements (SOURCING.md, "Free modern patterns").
- **Labels and variants:** every new menu option needs a label in `designs/labels.yaml`; add the
  test's variants to `designs/tools/variants.json`.
- **This file:** the item's status, and its row moved to BUILT_QUEUE.md, in the design's commit.

Sources are cited by corpus folder id ([corpus/MANIFEST.yaml](corpus/MANIFEST.yaml)). "Tracked"
means the PDF is in `corpus/<id>/` in this repo. For an untracked source, first check the
supplied local scans, then ask the person running you if it is unavailable. Do not add a scan
to the repo without checking [SOURCING.md](SOURCING.md) and the corpus conventions.

A starting prompt for an agent (fill in the item's row):

> Read AGENTS.md and BUILD_QUEUE.md, and CONTRIBUTING.md and designs/SPEC.md if you haven't. Claim
> item <#> in BUILD_QUEUE.md (commit the claim alone; don't push). Build `<design id>`, <garment>, from <source, folder id,
> pages>, extending `<start from>`. Find the section with pdftotext, render the diagram pages
> and read them as images. Map every source number to an option default, showing the
> arithmetic and the page. Make every size pass, and snapshot any design whose shared lib/
> file you change. Render and compare with the diagram, write the brief, finish with
> CONTRIBUTING.md Step 10, set the item's status to done, and commit only your own files, one
> garment per commit.

## Lanes
Each lane is the shared code its items are likely to touch. One agent per lane at a time.

| Lane | Shared code | Families |
|---|---|---|
| A | `lib/trousers.mjs` | trousers, knickers, drawers (Titan) |
| B | `lib/skirt.mjs` | skirts on Sarah |
| C | `lib/yoke.mjs` | yoke garments: shirts, dresses, blouses on the yoke template (Brian) |
| D | `lib/coat.mjs`, `pockets.mjs`, `raglan.mjs` | coats, jackets, shirts on Brian |
| E | `lib/jacket.mjs` | women's jackets and coats (Breanna) |
| F | `lib/body3.mjs` | three-piece jackets (Bent) |
| G | `lib/flat.mjs` or a new lib file | flat-cut and new families (capes, aprons) |
| H | `designs/freesewing.yaml`, `site/` | FreeSewing designs listed as theirs |
| I | `designs/blocks/`, a new checks module | new blocks (Bella, Bibi) |

`lib/spec.mjs`, `labels.yaml`, `tools/variants.json`, the READMEs and `PROMPTS.md` are touched
by every item; their changes are additions, so pull and rebase before committing and expect
small merge conflicts there.

## Queue
Read open rows in order. Rows 1–44 (the book queue, Priorities 1–3, the supplied scans and the
first catalog-expansion rows) are done: [BUILT_QUEUE.md](BUILT_QUEUE.md).

### Catalog expansion (2026-11-09)

The maintainer's priorities: men's suits, trousers, casualwear, denim, dresses, shirts and
neckwear, and garments from outside Western tailoring. Pages are **book pages from each
contents list**: find the PDF page and the plate before starting, and add the offset to
SOURCE_NOTES.md. Same-source alternatives (a second button count, a double-breasted front)
are probably variants of the row above them, not designs: decide after reading the plate.
Rows 38–46, 48, 49, 52–55 and 54b are done, and 47, 50 and 51 were dropped for FreeSewing's Devon, Trayvon and Benjamin:
[BUILT_QUEUE.md](BUILT_QUEUE.md).

| # | Design id | Garment | Source and pages | Start from | Lane | Notes | Status |
|---|---|---|---|---|---|---|---|
| 54c | `kalidar-kurta` | Kalidar kurta | **Inspired by** CBSE 2014, Practicals 11–12, Kalidar and Two-kali Kurta, book pp. 95–100 | — (cut flat, as the salwar) | G | Geometric panels: a centre panel on the fold, kalis like the salwar's, a straight armhole, a square underarm gusset | open |
| 56 | `choli` | Choli (saree blouse) | **Inspired by** CBSE practicals | Bella block (B1) | I | Methods only; darted, short. After B1 | open |
| 57 | `brimmed-hat` | Brimmed hat (sailor or boater shape), with a soft bucket-hat variant | Ben-Yûsuf, *The Art of Millinery* (1909), Lesson I "Drafting Buckram Frames", book pp. 7–24 (supplied as `The_Art_of_Millinery.pdf`, not in the corpus) | — (no block: drafted from `head`) | G | The book drafts a buckram frame: an oval or round brim set out from the head's length and width with its own front, back and side depths; a crown tip (head size, smaller for a conical crown, larger for a bell crown); and the crown's side band, a straight strip or a curved band from the head size, tip size and crown height. Make it in fabric with interfacing, not wire and buckram. Head length and width aren't measurements we have: take them as options proportional to `head`. Opens a Hats section of our own beside FreeSewing's Florent; `garments/tree.yaml` needs a brimmed-hat type (`bucket-hat` exists) | open |

### Modern books (2026-11-15)

The books in SOURCING.md "Sources in use" (Joseph-Armstrong 2010, Aldrich 2015 women's wear) and
"Next modern sources", used for methods and proportions only and credited "inspired by" with a
full citation and the spec's `about.taken` (M1–M2, done: [BUILT_QUEUE.md](BUILT_QUEUE.md)). Before
building, follow the item's pages back to the block they start from and read them as images. Pages
are **book pages**; PDF = book + 7 for Joseph-Armstrong, + 4 for Aldrich's women's wear and
menswear, + 6 for Aldrich's children's. Ordered by what each unblocks for the least new code. A
row in a book not yet in use also confirms that book.

| # | Design id | Garment | Source and pages | Start from | Lane | Unblocks / notes | Status |
|---|---|---|---|---|---|---|---|
| M3 | (variants) | Empire-waist and drop-waist dresses | Joseph-Armstrong 2010, empire (book pp. 186, 198, 448–462), low waist (pp. 278–281); Aldrich 2015 women's wear, high-waisted dress (pp. 103–104) | `fitted-dress` | I | Raised and dropped waist seams: one waist-height option on the Bella bodice; empire-waist and drop-waist dresses | open |
| M4 | `boxer-shorts` | Boxer shorts | Aldrich, *Metric Pattern Cutting for Menswear* (2006), leisurewear: boxer shorts (ch. 9), on the trouser block (book pp. 78–80) | `pyjama-trousers` | A | A buildable type with no source yet; confirms the menswear book | open |
| M5 | `slip` | Bias slip and slip dress | Joseph-Armstrong 2010, bias-cut dresses (book pp. 498–505: reducing bias stretch, slip dress) | Bella block | I | Bias-cut body (also the churidar's missing element); a rule for bias stretch | open |
| M6 | `formal-shirt` | Formal (tuxedo) shirt | Joseph-Armstrong 2010, pin and pleat tucks (book pp. 168–169), French cuffs (pp. 349–353); Aldrich 2015, double shirt cuff (p. 144) | `dress-shirt` | C | Tucks and French cuffs: unblocks the formal shirt | open |
| M7 | `t-shirt-dress`, `undershirt` | T-shirt dress, undershirt | Cole 2016, tops and dresses (chs. 6–7); Aldrich 2009 children's tee dresses | `t-shirt`, Bibi | I | Buildable on Bibi now; Cole's stretch categories as an option on the knit designs; confirms Cole | open |
| M8 | `camisole` | Camisole, chemise, petticoat | Aldrich 2015, lingerie block (p. 81), camisole (p. 107); Joseph-Armstrong 2010, bra-top torso (pp. 473–478) | Bella block | I | Camisole buildable now; chemise and petticoat leave research once read | open |
| M9 | `leggings` | Leggings | Cole 2016, pant slopers, four-way stretch (ch. 10) | new knit leg | I | Knit leg with negative ease, and its checks | open |
| M10 | `sleepsuit` | Infant sleepsuit | Aldrich, *Metric Pattern Cutting for Children's Wear and Babywear* (2009), flat jersey body block (book pp. 24–25), one-piece sleepsuit block (p. 30); snowsuits (p. 36) after | `lib/flat.mjs` | G | Leaves research once read; infant safety review in `designs/safety` before it's offered at baby sizes; confirms the children's book | open |
| M11 | `smock-dress`, `shirt-dress` | Smock dress, shirt dress (children's first) | Aldrich 2009, smocked dress (p. 62), shirt-style dresses (p. 68) | `childs-dress` or `shift-dress` | C | Buildable types with no source yet | open |
| M12 | `wide-leg-trousers` | Wide-leg trousers | Aldrich 2015, flared trousers (p. 50) | `womens-trousers` | A | After 45 | open |
| M13 | `dungarees`, `coverall` | Dungarees, coverall | Aldrich 2006 menswear, overalls and dungarees (ch. 10); Aldrich 2009 children's dungarees | `bib-overall`, `jumpsuit` | A | Buildable types with no source yet | open |
| M14 | `cowl-top` | Cowl-neck top | Joseph-Armstrong 2010, cowls (ch. 12, book pp. 240–265) | Bella block | I | Cowl neck | open |
| M15 | `duffle-coat` | Duffle coat, children's and adults' | Aldrich 2009, duffle coat (p. 72) | `mackinaw` or `box-overcoat` | D | Frog closures still ours to model | open |
| M16 | `strapless-dress` | Strapless dress | Joseph-Armstrong 2010, strapless foundation, bra-top and princess torsos (ch. 19, from book p. 473) | `princess-dress` | I | Boned panels (corsetry) | open |
| M17 | `halter-dress` | Halter dress | Cole 2016, dresses: halter (ch. 7, book p. 154) | `fitted-dress` or Bibi | I | Halter neck | open |
| M18 | `swimsuit` | Swimsuit and leotard | Cole 2016, swimwear slopers (ch. 12); Joseph-Armstrong 2010, swimwear (ch. 30, from book p. 767) | new knit body | I | Swim and sports knit: lining, elastic edges | open |
| M19 | — | Kim and Kim, *Patternmaking for Menswear* | On hold until the maintainer's print copy arrives | — | — | — | held |

### FreeSewing designs

FreeSewing's own designs are listed under Inspired Designs (decided 2026-11-09; F0–F12 done, see
[BUILT_QUEUE.md](BUILT_QUEUE.md) for the mechanism and each design's notes). Still open:
- **F0, the editor's `docs` view** still points at FreeSewing's docs: re-pointing it at our pages
  needs a patch.
- **Tina (F7) is held:** its title point is NaN at every size (it reads `options.lengthBonus`, which
  it doesn't have); the geometry is fine. List it when FreeSewing fixes that.
- Not planned: Jane, Lucy, Lunetius, Tiberius, Walburga, Sunny, the toys and costumes.

The Bella, Bibi, Noble blocks, rib bands (B1–B4) and our designs on them (K1–K6) are done:
[BUILT_QUEUE.md](BUILT_QUEUE.md).

### Buildable now, needing a source or a decision

Every element of these is covered (`COVERAGE.md`, ◐), so each is a spec on an existing base. Queue them
when a source turns up, or as our own designs.

Button-down collar shirt (a `dress-shirt` variant), overshirt, grandad shirt, shirtwaist blouse,
shawl-collar waistcoat, utility vest, blazer (a sack-coat variant), safari jacket, shirt jacket,
kimono robe, wrap coat, poncho, neckerchief, track jacket, blouson dress. (Wide-leg trousers, shirt
and smock dresses, coverall, dungarees, boxer shorts, camisole, T-shirt dress and undershirt are
queued above, from the modern books.)

### Sources to inspect before queueing a garment

| Source | What is known | Next check |
|---|---|---|
| Sheifer 1908 `nssheiferssystem00shei` | Its girl's coat is built. The skirt coat (text PDF p. 80, plate p. 81) has a dropped curved skirt seam that the current waist-seam draft cannot express. Multi-panel corset coats remain. | Inspect a corset coat's text and plate, or plan a shared construction change for the dropped skirt seam. |
| Vincent, *Jacket Cutting* (1897) `cutters-prac-guide-jacket-cutting` | The supplied PDF has no searchable text layer. | Inspect its plates and missing-page coverage before citing a new garment. |
| Vincent, *British Military Uniforms* `militaryuniformsbritish-images` | Service frock and khaki knickerbockers have substantial instructions (PDF pp. 9–12), but overlap existing tunic and breeches designs. | Compare their plates and specific seams with the built designs. |
| Ratner 1908 `ratnersuptodatem00ratn` | OCR exposes headings but too few reliable dimensions to select an item. | Read a candidate text/plate pair at higher resolution. |

### Infant wear safety

S1 (the review) and S2 (the automatic check) are done: [BUILT_QUEUE.md](BUILT_QUEUE.md). New infant
wear (sleepsuit, snowsuit) can go ahead: add its review before it's offered at the baby sets.

| # | Item | Scope | Status |
|---|---|---|---|
| S3 | Enforce restrictions in the editor | The site's pattern editor applies a review's `restrict` at baby sizes (Onyx: hide `zipperPosition: none`), instead of only stating it on the page | open |

### Blocked
| Item | Needs |
|---|---|
| Open+Pattern British 95 combat shirt, CS95 UBACS shirt, combat rain jacket, Finnish M62 and Bundeswehr reversible jackets, MA-1 bomber, M54 jacket, Zeltbahn | Downloads from openpattern.io (a checkout asking for contact details): the maintainer downloads them. Then each is an item like the field trousers (CC BY 4.0, credit Open+Pattern). |
| Review of `designs/t-shirt` | Written by another agent outside the usual workflow; reviewed when the maintainer asks. |
