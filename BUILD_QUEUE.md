# Build queue

The garments still to be built, in order, and how an agent takes one. Rows 1–31 are
complete through 2026-11-05. Rows 32 onward use additional scans supplied in November 2026;
the first `open` row is next. The catalog is [designs/README.md](designs/README.md).

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
4. **Finish it**: set its status to `done (<design id>)` in the design's commit, or
   `blocked (<why>)` with a line saying what's needed. Don't push unless you've been told to;
   the person running you decides.

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
- **This file:** the item's status, in the design's commit.

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
Read open rows in order. Earlier priorities favored shirts, dresses and women's garments,
which were the thinnest parts of the catalog.

### Priority 1
| # | Design id | Garment | Source (folder id, pages) | Start from | Lane | Notes | Status |
|---|---|---|---|---|---|---|---|
| 1 | `dress-shirt` | Classic shirt: yoked back, buttoned front, collar on a band, cuffs | Vincent 1890 `vincentmakingshirts18xx` (tracked), "Yoked and fronted shirts" pp. 5–7, collars and cuffs p. 23 | `service-shirt` | D | Needs a collar-on-stand (band plus fall); the barrel cuff can be a strip | done (shirt) |
| 2 | `kimono-dress` | Dress with kimono sleeves cut in one with the body | Pivnick 1949 `pivnickdesignclothes1949` (untracked), Pattern 101 pp. 290–295; kimono sleeves from p. 183 | `shift-dress` | C | New construction: the sleeve in one with the body (a gusset or underarm ease) | done (kimono-dress) |
| 3 | `pleated-skirt` | Side- and box-pleated skirt | Mitchell 1921 `newstandardworko00mitc` (tracked), pp. 102–107 | `two-piece-skirt` | B | Pleats laid on the skirt layout; one design with a `pleatStyle` option | done (pleated-skirt) |
| 4 | `circular-skirt` | Two-piece circular skirt | Mitchell 1921, pp. 110–113 | `two-piece-skirt` | B | A circle (or part circle) on the waist; Sarah supplies measurements only. As built: Mitchell's is fitted to the hip and spread below it, not a circle at the waist | done (circular-skirt) |
| 5 | `norfolk-jacket` | Norfolk jacket: box pleats front and back, belt, patch pockets | Simons 1922 `designingboysjuv00simo` (tracked), Norfolk sack coat p. 33 (button-to-the-neck semi-Norfolk p. 32) | `boys-jacket` / `jacket` | F | Any size, men included. As built: Diagram 7 has a front and back with a side seam, so it's on `hunting-coat` (Brian, `lib/panels.mjs`), not the three-piece body | done (norfolk-jacket) |
| 6 | `sailor-pants` | Sailor trousers: drop-front (flap) opening, flared legs | Simons 1922, Diagram 46, pp. 127–129 | `trousers` | A | New front-flap opening on the trouser leg. As built: on `overall-pants` (cut in one, as the source says) | done (sailor-pants) |
| 7 | (option) | Turn-ups (cuff bottoms) for the trousers family | Simons 1916 `draftingpantsove00simo` (tracked), Diagrams F and G, pp. 26–27 | `trousers` | A | An option on `trouserLeg`, not a design; turn it on in `trousers`, `peg-pants` | done (`turnUps` on suit-trousers, peg-pants, each with a variant) |
| 8 | `kimono-jacket` | Semi-fitted kimono jacket | Mitchell 1921, pp. 40–41; kimono box coat pp. 20–25, set-in kimono sleeve pp. 26–29 | `tailored-jacket` | E | Kimono sleeve on the jacket library | done (kimono-jacket) |
| 9 | `dressing-gown` | Dressing gown / bath robe: long, shawl collar, belt | Vincent 1890, dressing gowns p. 27, bath robe pp. 30–31 | `mackinaw` (shawl collar) or `overcoat` | D | Wrap front, tie belt, patch pockets | done (dressing-gown) |
| 10 | `cape` | Circular cape (and the dolman cape) | Pivnick 1949, chapter XIX pp. 254–260; Mitchell 1921 "The Cape" p. 59 | — (new) | G | New family: a circle segment on the shoulders. As built: Mitchell's, `lib/cape.mjs`; Pivnick's dolman cape is `dolman-cape`, on Breanna in place of her lining | done (cape, dolman-cape) |

### Priority 2
| # | Design id | Garment | Source (folder id, pages) | Start from | Lane | Notes | Status |
|---|---|---|---|---|---|---|---|
| 11 | `surtout` | Two-button double-breasted surtout overcoat | Simons 1916 `designingovercoa00simo` (tracked), pp. 38–39 | `overcoat` | D | Fitted overcoat, waist seam in the source. As built: on `suit-jacket`, for its side body | done (surtout) |
| 12 | `french-overcoat` | Young men's French overcoat | Simons 1916, p. 19 (not pp. 42–44, a mackinaw) | `overcoat` | D | The book's contents name p. 19 French, but it's the form-fitting overcoat's diagram: built as `fitted-overcoat`, on `suit-jacket` | done (fitted-overcoat) |
| 13 | `prince-albert-jacket` | "Prince Albert" cut tight-fitted jacket | Mitchell 1921, pp. 48–51 | `fitted-jacket` | E | As built: on `fitted-jacket`, with a waist seam and a one-piece skirt added to `lib/jacket.mjs` | done (prince-albert-jacket) |
| 14 | `princess-coat` | Fitted princess coat | Pivnick 1949, chapter XXII pp. 275–279 (loose coat pp. 279–282) | `tailored-jacket` | E | Coat length; the loose coat is close to `womens-box-coat`. As built: on `womens-peacoat`, the fitted coat only; `lib/jacket.mjs` gained `hemFlare`, a flared CB, `buttonBottom`, `frontSeamMin` | done (princess-coat) |
| 15 | `eton-jacket` | Eton jacket: short, to the waist | Simons 1922, English Eton coat p. 46 | `boys-jacket` | F | As built: pp. 46-49, Diagram 13; no library changes | done (eton-jacket) |
| 16 | `golf-pants` | Golf pants (plus-fours) | Simons 1922, Diagram 43, pp. 120–123 | `boys-knickers` | A | As built: on `breeches`. The plate is fitted through the knee, not fuller than the knickers, and not plus-fours | done (golf-pants) |
| 17 | `high-waisted-skirt` | Two-piece high-waisted skirt | Mitchell 1921, pp. 88–89 | `two-piece-skirt` | B | Waist raised 2 in. As built: not a design, a `high-waisted` variant of `two-piece-skirt`; `skirtLayout` gained a rise | done (two-piece-skirt.high-waisted) |
| 18 | `kilt` | Pleated kilt (Scotch kilt suit's skirt) | Simons 1922, pp. 50–52 | `pleated-skirt` (item 3) | B | As built: not on the pleated skirt. Simons gives only a flared foundation, with no pleats or wrap; a wrap kilt (the maintainer's choice), `lib/kilt.mjs`, with Simons' hem and length | done (kilt) |
| 19 | `smoking-jacket` | Smoking jacket | Vincent 1890, p. 28 | `dressing-gown` (item 9) | D | After item 9 | done (smoking-jacket) |
| 20 | `raincoat` | Raincoat | Simons 1922, pp. 105–107 | `overcoat` or `balmacaan` | D | As built: on `overcoat`. The book's contents give p. 118, wrongly | done (raincoat) |
| 21 | `db-waistcoat` | Double-breasted waistcoat | Simons 1922, double-breasted vest p. 56 (single-breasted p. 53) | `waistcoat` | D | As built: a design, not a variant, for its own source: `waistcoat` is ЕМКО's | done (db-waistcoat) |
| 22 | `scout-coat` | Scout coat: standing collar, four pockets | Simons 1922, pp. 43–46 | `military-tunic` | D | As built: a turned-down collar and patch pockets, not the tunic's standing collar and welts | done (scout-coat) |
| 23 | `drawers` | Long drawers | Vincent 1890, pants or drawers p. 24 | `pyjama-trousers` | A | As built: on `overall-pants`, not the pyjama trousers: no side seam, each leg in one | done (drawers) |

### Priority 3
| # | Design id | Garment | Source (folder id, pages) | Start from | Lane | Notes | Status |
|---|---|---|---|---|---|---|---|
| 24 | `button-middy` | Button-on middy: buttoned to the neck, belted at the waist | Simons 1922, Diagram 10, p. 42 | `middy-blouse` | D | As built: on `pyjama-jacket`, not the sailor middy: it opens all down the front on a cut-on stand, with a belt sewn to the hem | done (button-middy) |
| 25 | `scout-pants` | Scout pants | Simons 1922, Diagram 44, pp. 122, 124–125 | `knee-pants` | A | As built: on `suit-trousers`; the plate reaches the shank, with a shaped back knee and hem pleat, rather than ending at the knee | done (scout-pants) |
| 26 | `cape-overcoat` | Full-length cape overcoat | Simons 1916, pp. 30–31; boys' cape overcoat Simons 1922, Diagram 38, pp. 110–112 | `overcoat` + item 10 | G | As built: the plates show a whole-back cape and separate foreparts, with no coat body; on `cape`, with a standing military collar | done (cape-overcoat) |
| 27a | `riding-skirt` | Divided five-gore riding skirt | Mitchell 1921, pp. 116–117 | `gored-skirt` | B | Five-gore plate; narrow front overlap hangs free from the waist | done (riding-skirt) |
| 27b | `apron-riding-skirt` | Asymmetric apron riding skirt | Mitchell 1921, pp. 118–121 | — | B | Separate source-scaled Part I and Part II shapes, with long leg strap, short tab and back opening | done (apron-riding-skirt) |
| 28 | `painters-jacket` | Painter's jacket: knee length, three patch pockets | Vincent 1890, p. 35 | `barbers-coat` | D | As built: on `barbers-coat`, with five buttons and separate button cuffs; pocket and collar geometry approximate Vincent's plate | done (painters-jacket) |
| 29 | `aprons` | Work aprons (carpenter's, butcher's, barman's…) | Vincent 1890, pp. 39–40 | — | G | As built: one flat-cut pattern with eight selectable diagram styles, scaled from the fixed adult plate dimensions | done (aprons) |
| 30 | `reefer` | Boys' reefer | Simons 1922, Diagram 23, pp. 74–75 | `peacoat` | D | As built: double-breasted outline on the peacoat, with shorter regular collar and two pairs of shallow welts; the side-seam flare is not modelled | done (reefer) |
| 31 | `inverness-coat` | Women's Inverness coat | Merz 1911, Diagram XXIV, pp. 58–59 | `womens-box-coat` + cape | E | As built: long loose box body under a separate one-piece shoulder cape, closed front and turn collar; two marked cape darts and a 1-inch lowered armhole; the transferred shoulder and tight back remain approximated | done (inverness-coat) |

### Next from the supplied scans

These sources have point drafts or worked dimensions (grade A). Page pairs below are PDF pages;
printed pages are given where verified. The starting design is a lead, not a decision: read the
plate and the text before choosing the construction. They are in `corpus/MANIFEST.yaml`, not tracked in git.

| # | Design id | Garment | Source and pages | Start from | Lane | Why this is next / what to check | Status |
|---|---|---|---|---|---|---|---|
| 32 | `tunic-skirt` | Basque or tunic skirt | Schorr 1917 `expertdesignerpr00scho`, Diagram 7, PDF text 38, plate 39 | New radial layout on Sarah | B | As built: one radial half panel cut twice, a central dart, equal front and back seams. The source leaves length and bottom width to choice; the default is short and keeps the radial hem. | done (tunic-skirt) |
| 33 | `cycling-breeches` | Cyclists' breeches | d'Alessio 1906 `artofdesigningcu00ales`, Fig. 30, PDF plate 73, text 74 (printed p. 68) | `boys-knickers` | A | As built: the plate shows a full leg gathered into a 16 × 3 in band. The 2 in rise is at the back waist, already present on Titan at the worked size. Used the inch values where the metric text disagrees. | done (cycling-breeches) |
| 34 | `riding-habit-coat` | Women's riding habit coat | Weiler 1915 `weilerladiestail00weil`, PDF text 86, plate 87 (printed pp. 82–83) | `double-dart-jacket` | E | As built: six shaped panels a side, a narrow back, extra seat ease and long flared skirt. The 1¼ in back waist and 1¾ in hip widths inform defaults; the distinct upper/lower lap and back slit remain approximations. | done (riding-habit-coat) |
| 35 | `riding-frock-coat` | Women's riding frock coat | Merz 1911 `merzspracticalcu00merz`, Diagram XIV, PDF text 40, plate 41 (printed pp. 38–39) | `prince-albert-jacket` | E | Built on the fitted jacket's waist-seam construction: 36 in total length, ¾ in lap, ½ in ease on the 20 in half hip. Skirt sweep is read from the plate; back opening is omitted. | done (riding-frock-coat) |
| 36 | `four-gore-skirt` | Four-gore panel skirt | Schorr 1917 `expertdesignerpr00scho`, Diagram 65, PDF text 94, plate 95 | `gored-skirt` | B | Built as four pattern shapes across the half skirt: front on fold plus three cut in pairs; 5 in waist suppression divided ½, 2½ and 2 in. | done (four-gore-skirt) |
| 37 | `three-piece-long-coat` | Women's three-piece long coat | Merz 1911 `merzspracticalcu00merz`, Diagram XVII, PDF text 46, plate 47 (printed pp. 44–45) | `tailored-jacket` | E | Built on continuous princess panels; the plate's diagonal transfer lines are not seams. Local ⅜ and ¼ in hip increments are not overall ease. Four-panel layout approximates the source; front closes high. | done (three-piece-long-coat) |

### Catalog expansion (2026-11-09)

The maintainer's priorities: men's suits, trousers, casualwear, denim, dresses, shirts and
neckwear, and garments from outside Western tailoring. Pages are **book pages from each
contents list**: find the PDF page and the plate before starting, and add the offset to
SOURCE_NOTES.md. Same-source alternatives (a second button count, a double-breasted front)
are probably variants of the row above them, not designs: decide after reading the plate.

| # | Design id | Garment | Source and pages | Start from | Lane | Notes | Status |
|---|---|---|---|---|---|---|---|
| 38 | `sack-coat` | Men's single-breasted sack coat, the suit jacket | Simons, *Sack Coats* (1918) `designingsackcoa00simo` (tracked), Conservative Sack, Diagram III | `suit-jacket` | F | As built: on `suit-jacket` (Bent, `lib/body3.mjs`, so lane F), no library change; Simons' two-piece body becomes the three-piece one at his chest, waist and seat widths. Diagrams III–V, pp. 6–9 (PDF 10–13) | done (sack-coat) |
| 39 | (variant) | Double-breasted and two-button English sack coats | Same book, Diagrams VI and VIII | `sack-coat` | F | As built: variants `double` and `english`; `sack-coat` gained `doubleBreasted` and a peaked lapel, and `lib/spec.mjs` drops a list's null items | done (sack-coat.double, sack-coat.english) |
| 40 | `dinner-jacket` | Tuxedo | Same book, Young Men's Tuxedo, Diagram X | `sack-coat` | F | As built: on `sack-coat` at the English coat's ease; `body3Front` gained `cutaway` (the front cut away below the button). Peaked lapels; the slash pocket in the Vee isn't offered. Text p. 18, plate p. 19 (PDF 22–23) | done (dinner-jacket) |
| 41 | `tailcoat` | Full dress coat | Same book, Diagram XII | `surtout` | F | As built: on `surtout` (Bent, `lib/body3.mjs`, so lane F); `body3Skirt` gained `tailAt`/`tailWidth`, the skirt cut away in front to a tail. Text p. 22, plate p. 23 (PDF 26–27) | done (tailcoat) |
| 42 | `frock-coat` | Men's single-breasted frock coat | Same book, Diagram XI | `tailcoat` | F | As built: on `tailcoat`, options only: its skirt cut away from the front edge (Simons' is a cutaway frock). Text p. 20, plate p. 21 (PDF 24–25) | done (frock-coat) |
| 43 | `slacks` | Men's slacks with a continuous waistband | Simons, *Drafting Trousers* (1945) `simonsdraftingtrousers1945` (Cloudbox, laptop), Diagrams 9–10A, pp. 42–47 (PDF + 8) | `peg-pants` | A | As built: on `peg-pants` for its pleats; `trouserLeg` gained `bandRise` (the band cut on). Not renewed (NYPL 1972–73, checked 2026-11-11). Cotton slacks are the `cotton` variant | done (slacks) |
| 44 | `shorts` | Shorts, men's and women's | Same book, men's Diagram 21 p. 78 (plate p. 79, PDF 87), boys' p. 104, women's p. 121 | `suit-trousers` | A | As built: one design at any size on `suit-trousers` (a plain front and back dart, as Simons' men's); `trouserLeg` gained `shortInseam`, `cutFlare`, `matchInseam`. The women's cut-on band and darts are the `banded` variant. FreeSewing's shorts are listed too (F6) | done (shorts) |
| 45 | `womens-trousers` | Women's trousers and pleated slacks | Same book, pp. 116 and 119; Pivnick 1949 ch. XX, p. 261 | `suit-trousers` | A | Pleated slacks as a variant | open |
| 46 | `jeans` | Five-pocket jeans | **Our design:** Simons 1945 work trousers p. 33 for the leg; CBSE and Bharat Skills denim exercises for methods only | `work-pants` | A | Back yoke, patch back pockets, scooped front pockets, coin pocket, fly, waistband; rivet marks. Atacac is a reference only (SOURCING.md, Decisions). Needs four new elements: trouser back yoke, scooped pocket, coin pocket, patch back pockets | open |
| 47 | `denim-jacket` | Denim jacket (trucker) | **Our design**, on the field jacket or chore coat | `field-jacket` or `chore-coat` | D | Front and back yokes, chest flap pockets, waistband, button cuffs. No held draft: say so in the brief | dropped 2026-11-09: FreeSewing's Devon has these features; list it instead |
| 48 | `jodhpurs` | Jodhpurs, men's and women's | Simons 1945, pp. 70 and 133 | `breeches` | A | Flared thigh, close leg to the ankle | open |
| 49 | `football-shirt` | Woven pullover sports shirt | Vincent 1890 `vincentmakingshirts18xx` (tracked), pp. 29–31 | `work-shirt` | C | Casual: placket front, collar; the book separates it from a knitted jersey | open |
| 50 | `necktie` | Four-in-hand necktie | US Army purchase description GL-PD 19021 (2019, US government work); DLA A-A-55199A | — | G | Not held: fetch first. Regular 61 in and short 57 in, 3 in at the wide end. A bias `polygon` piece with interlining | dropped 2026-11-09: FreeSewing's Trayvon covers it (width and length options); list it instead |
| 51 | `bow-tie` | Bow tie | US Navy MIL-N-29113B | `necktie` | G | Not held: fetch and check its tables first | dropped 2026-11-09: FreeSewing's Benjamin covers it (four bow shapes, three end shapes); list it instead |
| 52 | `childs-dress` | Child's dress | Pivnick 1949, Patterns 105 and 106, pp. 296–305 | `shift-dress` | C | Two patterns: variants if one base serves | open |
| 53 | `salwar` | Salwar trousers | **Inspired by** CBSE, *Basic Pattern Development*, practicals | `pyjama-trousers` | A | Methods and proportions only (SOURCING.md, Decisions). Not held: fetch first | open |
| 54 | `kameez` | Kameez (long tunic), with kurta variants | **Inspired by** CBSE practicals; Bharat Skills, *Dress Making* vol. I | `shift-dress` | C | Methods only. Side slits, A-line and kalidar variants | open |
| 55 | `churidar` | Churidar pyjama | **Inspired by** CBSE practicals | `salwar` | A | Methods only; bias-cut, gathered at the ankle | open |
| 56 | `choli` | Choli (saree blouse) | **Inspired by** CBSE practicals | Bella block (B1) | I | Methods only; darted, short. After B1 | open |
| 57 | `brimmed-hat` | Brimmed hat (sailor or boater shape), with a soft bucket-hat variant | Ben-Yûsuf, *The Art of Millinery* (1909), Lesson I "Drafting Buckram Frames", book pp. 7–24 (supplied as `The_Art_of_Millinery.pdf`, not in the corpus) | — (no block: drafted from `head`) | G | The book drafts a buckram frame: an oval or round brim set out from the head's length and width with its own front, back and side depths; a crown tip (head size, smaller for a conical crown, larger for a bell crown); and the crown's side band, a straight strip or a curved band from the head size, tip size and crown height. Make it in fabric with interfacing, not wire and buckram. Head length and width aren't measurements we have: take them as options proportional to `head`. Opens a Hats section of our own beside FreeSewing's Florent; `garments/tree.yaml` needs a brimmed-hat type (`bucket-hat` exists) | open |

### FreeSewing designs to list (2026-11-09)

Decided 2026-11-09: the catalog now grows with FreeSewing's own designs as well as ours. They are listed
under **Inspired Designs, by category**, each page crediting and linking FreeSewing and that design's
page there, and keeping FreeSewing's title brand on the printed pattern. They're npm dependencies at
the pinned FreeSewing version, wrapped, never re-specced as ours: no `spec.yaml`, no BRIEF, no muslin
status. A listed design adds a garment, not an element: see Blocks below for the ones our library
builds on. Their garment types are in `designs/garments/tree.yaml` (`freesewing:`).

| # | Item | What | Lane | Notes | Status |
|---|---|---|---|---|---|
| F0 | Listing mechanism | `designs/freesewing.yaml` (the registry), `test/freesewing-designs.test.mjs` (drafts at every set, no errors or NaN), pages from `site/scripts/generate.mjs` with a credit box and no brief or Variants, the Inspired Designs listing by category, and `collection.mjs` with each design's own i18n | H | Needs each design's undeclared dependencies installed too (record them in your notes). With it: FreeSewing's MIT notice for `site/patches/` and `site/static/img/measure/`, the LICENSE wording, and README and site text saying some designs are FreeSewing's. Editor: turn on `editSettings` and `timing`; point the `docs` view at our pages | done (2026-11-09) except the `docs` view, still FreeSewing's: re-pointing it needs a patch |
| F1 | Pilot: Teagan, Sven, Hugo, Bruce, Uma | T-shirt, sweatshirt, raglan hoodie, boxer briefs, briefs | H | After F0. Teagan sits beside our `t-shirt` | done (2026-11-09): all five listed |
| F2 | Lily, Lumina, Lumira, Aaron, Jett, Florent | Leggings, tank top, bomber jacket, flat cap | H | Florent opened a new Hats section (its link is text until `hats.jpg` is made from its PROMPTS.md entry) | done (2026-11-09): all six listed |
| F3 | Devon, Trayvon, Benjamin | Denim jacket, necktie, bow tie | H | In place of queue items 47, 50 and 51. Devon imports `@freesewing/noble` without declaring it. The ties and Hortensia opened an Accessories section (its link is text until `accessories.jpg` is made from PROMPTS.md) | done (2026-11-10): all three listed |
| F4 | Huey, Hannah, Yuri | Zip hoodie, women's hoodie, hooded sweater | H | Hannah imports `@freesewing/toni` without declaring it, and Toni's front dart fails at `stoutMale48`: that set is in its `skip:` (freesewing.yaml, new 2026-11-10: sets left out of the test and the size picker) | done (2026-11-10): all three listed |
| F5 | Charlie, Penelope, Paco, Waralee, Crux | Chinos, pencil skirt, summer trousers, wrap trousers, climbing trousers | H | Fill types we lack. Crux imports `@freesewing/cornelius` without declaring it and fails at `usdaGirlC4` (skipped) | done (2026-11-10): all five listed |
| F6 | Ashley, Shale, Percy | A-line, casual and fall-front shorts | H | Shale imports `@freesewing/i18n` and `plugin-ringsector` without declaring them. Queue 44 (Simons) is still ours | done (2026-11-10): all three listed |
| F7 | Tina, Tristan, Diana, Tamiko, Sophie, Sasha | Wrap top, princess top, draped-neck top, zero-waste top, slip dress, skater dress | H | Tristan and Sasha import `@freesewing/noble`, Tristan `plugin-ringsector` too, Tina `toni`, all undeclared. **Tina held:** its title point is NaN at every size (it reads `options.lengthBonus`, which it doesn't have); the geometry is fine. List it when FreeSewing fixes that | done (2026-11-10) except Tina: the other five listed |
| F8 | Shin, Bee, Sabrina, Shelly | Swim trunks, bikini top, sports tops, swim shirt | H | A new Swim & sport section (its link is text until `swim.jpg` is made from PROMPTS.md) | done (2026-11-10): all four listed |
| F9 | Cathrin, Holmes, Hortensia | Corset, deerstalker, handbag | H | Cathrin under Sleepwear & underwear, Holmes under Hats, Hortensia under Accessories | done (2026-11-10): all three listed |
| F10 | Otis, Onyx, Bob | Baby romper, one-piece, bib | H | Baby sets: `designs/sizes/babies.mjs` (CS151-50 and Snyder 1975, SOURCING.md). A registry entry's `sizes:` picks the sets it's tested at and offered: Otis `babies` only; Onyx and Bob `all`, since they draft at every size. Onyx imports `@freesewing/plugin-bust` without declaring it. New Babies & toddlers section (its link is text until `babies.jpg` is made from PROMPTS.md). Babies' waist = chest, kept after a cross-check with Snyder (2026-11-09, `sizes/babies.mjs`): it fits clothes over a nappy | done (2026-11-09): all three listed |
| F11 | Simon, Simone, Jaeger, Wahid, Carlton, Carlita, Cornelius, Opal, Sandy, Albert | Garments we also build | H | Decided 2026-11-09: list all, under Inspired Designs like the rest of FreeSewing's, not beside our historical versions; each page links to the other ("also as ..."). Simone (bust-shaped), Sandy (a true circle) and Carlton (a men's caped coat) also fill gaps | done (2026-11-10): all ten listed, each with `ours:` links both ways. Sophie's seam path is open, which crashed our Seamly export (`lib/export/seamly.mjs` `clockwise()`, fixed) |
| F12 | Umbra, Bibi; Brian, Bent, Breanna, Bella, Noble, Titan, Sarah | Undies, knit top or dress; FreeSewing's blocks | H | Decided 2026-11-10: list the blocks too, in a new Blocks section (its link is text until `blocks.jpg` is made from PROMPTS.md), for anyone drafting their own. Bibi is a garment, under Shirts & tops. Titan pinned exactly in designs/package.json (it was `^4.10.2`) | done (2026-11-10): all nine listed |
| — | Jane, Lucy, Lunetius, Tiberius, Walburga, Sunny; toys and costumes | Historical dress, plush toys | — | Out of scope | not planned |

### Blocks: elements our library can't build yet (2026-11-09)

The missing elements that block the most garment types (`designs/garments/COVERAGE.md`, the first
table). Adopting a FreeSewing block the way we use Brian, under our landmark names in `designs/blocks/`
with a checks module, lets our own specs build on it. Each opens a branch of the tree.

| # | Item | Element it covers | Types it unblocks | Lane | Notes | Status |
|---|---|---|---|---|---|---|
| B1 | Bella block | `body-darted-bodice` | Shell top, choli, sheath dress, wrap dress, sundress, jumper dress | I | FreeSewing's womenswear bodice block. Then queue 56 (choli) starts from it | done (2026-11-10): `blocks/bella.mjs` (a landmark may now name a list, first match: `sideWaist` is the back's `waistSide`, the front's `sideHem`), `test/bodice-checks.mjs` (`testBodice`: side seams, both waist darts and the bust dart, shoulder ease up to 5%, sleeve cap within 2 mm, which is how closely Bella fits it at every size; Bella drops its front waist dart on stout figures), `test/bella-block.test.mjs` |
| B2 | Bibi block, and knit checks | `body-knit` | Polo, henley, rugby shirt, turtleneck, cardigan, T-shirt dress, undershirt | I | FreeSewing's knit top block. Knit garments need stretch-aware checks (negative ease) | done (2026-11-10): `blocks/bibi.mjs`, `test/knit-checks.mjs` (`testKnit`: side seams within 4% (Bibi gathers up to 2.7% at the bust; at −5% ease its front is 3.9% short at Women 28), finished chest = body × (1 + chestEase) within 1%, binding no longer than the neck, ribs; Bibi's own `bindingHeight` warning allowed), `test/bibi-block.test.mjs` with negative-ease and sleeveless-dress variants. A drafted piece now takes `if:` (SPEC.md): Bibi hides its sleeve with `sleeves` off and ours must follow |
| B3 | Rib bands and cuffs | `cuff-rib`, `leg-rib-cuff`, `waistband-jacket` | With B2: polo, rugby shirt, cardigan, joggers, Harrington jacket | I | A rib piece sized from the edge it finishes, at a stretch ratio (Sven and Hugo have them) | done (2026-11-10): the `rib` piece type (`lib/rib.mjs`, on `polygon`): `edge`, `stretch` (0.15), `height`, `round`; `rib.<piece>` in the store; `test/rib.test.mjs`. A piece type can't read another piece's points: the edge comes from a measurement or a store value an operation sets |
| B4 | Noble block | princess bodice for dresses | Princess-line dress | I | Optional: Breanna's princess layout may already serve | done (2026-11-10): `blocks/noble.mjs`, `checkPrincess`/`testPrincess` in `test/bodice-checks.mjs` (princess seams within 2 mm, side seams; Noble's back pieces keep Bella's whole back as `seam`, their outlines are `insideSeam`/`outsideSeam`), `test/noble-block.test.mjs` with the dart to the shoulder or the armhole |

### Our own designs on the new blocks (2026-11-11)

Garments the Bella, Bibi and Noble blocks unblock, designed by us from the blocks with no book behind
them (Dave, 2026-11-11: own designs, the Bibi knits first). A look Bibi already reaches by its own
options (a T-shirt dress: `length: knee`; an undershirt: `sleeves: false`) is a variant of the Bibi
listing, not a design. Each uses `test/knit-checks.mjs` or `test/bodice-checks.mjs`.

| # | Design id | Garment | Start from | Lane | Notes | Status |
|---|---|---|---|---|---|---|
| K1 | `turtleneck` | Turtleneck, with a mock-neck variant | Bibi + `rib` collar | I | Neck raised, collar cut from the stored neck opening; collar and neck edge must stretch over the head (children: up to 83% and 65%). `brand` retitles Bibi's pieces; spec names `block.<key>` read Bibi's store | done (turtleneck, turtleneck.mockNeck) |
| K2 | `henley` | Henley, with polo and rugby-shirt variants (a knit or woven collar) | Bibi | I | As built: `placketBox` (`lib/knit.mjs`) marks the box on Bibi's front; the `knitPlacket` piece type (`lib/placket.mjs`) cuts the strips, as many buttons as fit; the band or collar is a `rib` piece | done (henley, henley.polo, henley.rugby) |
| K3 | `cardigan` | Cardigan | Bibi | I | As built: `openFront` (`lib/knit.mjs`) opens Bibi's front with a straight V and allowance all round; the `frontBand` piece type (`lib/placket.mjs`) runs up the fronts flat and round the neck stretched, as many buttons as fit | done (cardigan, cardigan.plain) |
| K4 | `fitted-dress` | Sheath, sundress, jumper dress | Bella | I | As built: one design, the three as variants: `bodiceNeck` reshapes Bella's neck (round, square, V), `bodiceWaist` records the waist seam, the `dressSkirt` piece type cuts a gathered, straight or A-line skirt to it, a back zip; `test/bodice-checks.mjs` `testDress` | done (fitted-dress, .sundress, .sheath, .jumper) |
| K4b | `shell-top`, `wrap-dress` | Shell top, wrap dress | Bella | I | As built: `bodiceHip` carries Bella's darts to the hip in a continuous shell; `wrapFront` extends two mirrored fronts across the waist, with overlapping A-line skirt fronts and separate ties | done (shell-top, wrap-dress) |
| K5 | `princess-dress` | Princess-line dress | Noble | I | As built: four continuous Noble panels flare below the waist, with shoulder- and armhole-seam variants and a centre-back zip | done (princess-dress) |
| K6 | `joggers`, `harrington-jacket` | Rib cuffs on existing bases | Titan, raglan | I | Harrington: short raglan zip jacket with stand collar, rib cuffs and waistband. Joggers: Titan pull-on tapered legs, matched outseams, in-seam pockets and rib cuffs sized from stored hem edges. | done (2026-11-12) |

### Buildable now, needing a source or a decision

Every element of these is covered (`COVERAGE.md`, ◐), so each is a spec on an existing base. Queue them
when a source turns up, or as our own designs.

Button-down collar shirt (a `dress-shirt` variant), overshirt, grandad shirt, shirtwaist blouse,
shawl-collar waistcoat, utility vest, blazer (a sack-coat variant), safari jacket, shirt jacket,
wide-leg trousers, shirt dress, smock dress, coverall, dungarees, kimono robe, wrap coat, poncho,
neckerchief.

### Sources to inspect before queueing a garment

| Source | What is known | Next check |
|---|---|---|
| Sheifer 1908 `nssheiferssystem00shei` | Its girl's coat is built. The skirt coat (text PDF p. 80, plate p. 81) has a dropped curved skirt seam that the current waist-seam draft cannot express. Multi-panel corset coats remain. | Inspect a corset coat's text and plate, or plan a shared construction change for the dropped skirt seam. |
| Vincent, *Jacket Cutting* (1897) `cutters-prac-guide-jacket-cutting` | The supplied PDF has no searchable text layer. | Inspect its plates and missing-page coverage before citing a new garment. |
| Vincent, *British Military Uniforms* `militaryuniformsbritish-images` | Service frock and khaki knickerbockers have substantial instructions (PDF pp. 9–12), but overlap existing tunic and breeches designs. | Compare their plates and specific seams with the built designs. |
| Ratner 1908 `ratnersuptodatem00ratn` | OCR exposes headings but too few reliable dimensions to select an item. | Read a candidate text/plate pair at higher resolution. |

### Blocked
| Item | Needs |
|---|---|
| Open+Pattern British 95 combat shirt, CS95 UBACS shirt, combat rain jacket, Finnish M62 and Bundeswehr reversible jackets, MA-1 bomber, M54 jacket, Zeltbahn | Downloads from openpattern.io (a checkout asking for contact details): the maintainer downloads them. Then each is an item like the field trousers (CC BY 4.0, credit Open+Pattern). |
| Review of `designs/t-shirt` | Written by another agent outside the usual workflow; reviewed when the maintainer asks. |
