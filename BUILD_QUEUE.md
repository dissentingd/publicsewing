# Build queue

The garments still to be built, in order, and how an agent takes one. Written 2026-10-30, when
every row of [WARDROBE_GAPS.md](WARDROBE_GAPS.md) was drafted or covered: from here on the work
is variants and new garments from sources already held. The catalog so far is
[designs/README.md](designs/README.md).

## Taking an item
1. **Pick the first item with status `open` in your lane** (see Lanes). Items in different lanes
   can be built at the same time; items in the same lane go one after another, because they
   change the same shared library file.
2. **Claim it** before any other work: change its status to `claimed (<agent or branch>,
   <date>)` in this file, commit that change alone, and push it. If the push is rejected
   because someone else claimed it first, pull and pick the next one.
3. **Build it** by the per-garment workflow (below), in a branch or worktree of your own if
   other agents share the checkout.
4. **Finish it**: set its status to `done (<design id>, <commit>)` in the same commit as the
   design, or `blocked (<why>)` with a line saying what's needed. Don't push unless you've been
   told to; the person running you decides.

Before starting, read [designs/README.md](designs/README.md) and [designs/SPEC.md](designs/SPEC.md),
and look at the item's "start from" design: most items extend an existing design.

## Per-garment workflow
Follow [CONTRIBUTING.md](CONTRIBUTING.md), Steps 2–10, for the item you claimed: read the
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
means the PDF is in `corpus/<id>/` in this repo; an untracked one is only in the full corpus
copies, so ask the person running you for it.

A starting prompt for an agent (fill in the item's row):

> Read BUILD_QUEUE.md, CONTRIBUTING.md and designs/SPEC.md. Claim item <#> in BUILD_QUEUE.md
> (commit and push the claim alone). Build `<design id>`, <garment>, from <source, folder id,
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

`lib/spec.mjs`, `labels.yaml`, `tools/variants.json`, the READMEs and `PROMPTS.md` are touched
by every item; their changes are additions, so pull and rebase before committing and expect
small merge conflicts there.

## Queue
Priority 1 first: shirts, dresses and women's garments are the thinnest part of the catalog.

### Priority 1
| # | Design id | Garment | Source (folder id, pages) | Start from | Lane | Notes | Status |
|---|---|---|---|---|---|---|---|
| 1 | `shirt` | Classic shirt: yoked back, buttoned front, collar on a band, cuffs | Vincent 1890 `vincentmakingshirts18xx` (tracked), "Yoked and fronted shirts" pp. 5–7, collars and cuffs p. 23 | `service-shirt` | D | Needs a collar-on-stand (band plus fall); the barrel cuff can be a strip | open |
| 2 | `kimono-dress` | Dress with kimono sleeves cut in one with the body | Pivnick 1949 `pivnickdesignclothes1949` (untracked), Pattern 101 pp. 290–295; kimono sleeves from p. 183 | `shift-dress` | C | New construction: the sleeve in one with the body (a gusset or underarm ease) | open |
| 3 | `pleated-skirt` | Side- and box-pleated skirt | Mitchell 1921 `newstandardworko00mitc` (tracked), pp. 102–107 | `two-piece-skirt` | B | Pleats laid on the skirt layout; one design with a `pleatStyle` option | open |
| 4 | `circular-skirt` | Two-piece circular skirt | Mitchell 1921, pp. 110–113 | `two-piece-skirt` | B | A circle (or part circle) on the waist; Sarah supplies measurements only | open |
| 5 | `norfolk-jacket` | Norfolk jacket: box pleats front and back, belt, patch pockets | Simons 1922 `designingboysjuv00simo` (tracked), Norfolk sack coat p. 33 (button-to-the-neck semi-Norfolk p. 32) | `boys-jacket` / `jacket` | F | Any size, men included | open |
| 6 | `sailor-pants` | Sailor trousers: drop-front (flap) opening, flared legs | Simons 1922, Diagram 46, pp. 127–129 | `trousers` | A | New front-flap opening on the trouser leg | open |
| 7 | (option) | Turn-ups (cuff bottoms) for the trousers family | Simons 1916 `draftingpantsove00simo` (tracked), Diagrams F and G, pp. 26–27 | `trousers` | A | An option on `trouserLeg`, not a design; turn it on in `trousers`, `peg-pants` | open |
| 8 | `kimono-jacket` | Semi-fitted kimono jacket | Mitchell 1921, pp. 40–41; kimono box coat pp. 20–25, set-in kimono sleeve pp. 26–29 | `tailored-jacket` | E | Kimono sleeve on the jacket library | open |
| 9 | `dressing-gown` | Dressing gown / bath robe: long, shawl collar, belt | Vincent 1890, dressing gowns p. 27, bath robe pp. 30–31 | `mackinaw` (shawl collar) or `overcoat` | D | Wrap front, tie belt, patch pockets | open |
| 10 | `cape` | Circular cape (and the dolman cape) | Pivnick 1949, chapter XIX pp. 254–260; Mitchell 1921 "The Cape" p. 59 | — (new) | G | New family: a circle segment on the shoulders | open |

### Priority 2
| # | Design id | Garment | Source (folder id, pages) | Start from | Lane | Notes | Status |
|---|---|---|---|---|---|---|---|
| 11 | `surtout` | Two-button double-breasted surtout overcoat | Simons 1916 `designingovercoa00simo` (tracked), pp. 38–39 | `overcoat` | D | Fitted overcoat, waist seam in the source | open |
| 12 | `french-overcoat` | Young men's French overcoat | Simons 1916, pp. 42–44 | `overcoat` | D | | open |
| 13 | `prince-albert-jacket` | "Prince Albert" cut tight-fitted jacket | Mitchell 1921, pp. 48–51 | `fitted-jacket` | E | Archive readings: `archive/recipes/mitchell/FINDINGS.md` | open |
| 14 | `princess-coat` | Fitted princess coat | Pivnick 1949, chapter XXII pp. 275–279 (loose coat pp. 279–282) | `tailored-jacket` | E | Coat length; the loose coat is close to `box-coat` | open |
| 15 | `eton-jacket` | Eton jacket: short, to the waist | Simons 1922, English Eton coat p. 46 | `boys-jacket` | F | | open |
| 16 | `golf-pants` | Golf pants (plus-fours) | Simons 1922, Diagram 43, pp. 120–123 | `knickers` | A | Fuller and longer than the knickers | open |
| 17 | `high-waisted-skirt` | Two-piece high-waisted skirt | Mitchell 1921, pp. 88–89 | `two-piece-skirt` | B | Waist raised 2 in; may be an option instead | open |
| 18 | `kilt` | Pleated kilt (Scotch kilt suit's skirt) | Simons 1922, pp. 50–52 | `pleated-skirt` (item 3) | B | After item 3 | open |
| 19 | `smoking-jacket` | Smoking jacket | Vincent 1890, p. 28 | `dressing-gown` (item 9) | D | After item 9 | open |
| 20 | `raincoat` | Raincoat | Simons 1922, pp. 118–121 | `overcoat` or `balmacaan` | D | | open |
| 21 | `db-waistcoat` | Double-breasted waistcoat | Simons 1922, double-breasted vest p. 56 (single-breasted p. 53) | `waistcoat` | D | | open |
| 22 | `scout-coat` | Scout coat: standing collar, four pockets | Simons 1922, pp. 43–46 | `military-blouse` | D | | open |
| 23 | `drawers` | Long drawers | Vincent 1890, pants or drawers p. 24 | `pyjama-trousers` | A | | open |

### Priority 3
| # | Design id | Garment | Source (folder id, pages) | Start from | Lane | Notes | Status |
|---|---|---|---|---|---|---|---|
| 24 | `button-middy` | Button-on middy: buttoned to the neck, belted at the waist | Simons 1922, Diagram 10, p. 42 | `middy-blouse` | C | | open |
| 25 | `scout-pants` | Scout pants | Simons 1922, Diagram 44, pp. 123–125 | `knee-pants` | A | | open |
| 26 | `cape-overcoat` | Shoulder-cape overcoat | Simons 1916, p. 21; boys' cape overcoat Simons 1922 p. 126 | `overcoat` + item 10 | D | After item 10 | open |
| 27 | `riding-skirt` | Divided and apron riding skirts | Mitchell 1921, pp. 116–121 | `culottes` | B | | open |
| 28 | `painters-jacket` | Painter's jacket: knee length, three patch pockets | Vincent 1890, p. 35 | `barbers-coat` | D | | open |
| 29 | `aprons` | Work aprons (carpenter's, butcher's, barman's…) | Vincent 1890, pp. 39–40 | — | G | `polygon` pieces; FreeSewing's Albert covers one apron | open |
| 30 | `reefer` | Boys' reefer | Simons 1922, pp. 74–80; Vincent 1897 `cutters-prac-guide-jacket-cutting` (untracked) | `peacoat` | D | Close to `peacoat` | open |

### Blocked
| Item | Needs |
|---|---|
| Open+Pattern British 95 combat shirt, CS95 UBACS shirt, combat rain jacket, Finnish M62 and Bundeswehr reversible jackets, MA-1 bomber, M54 jacket, Zeltbahn | Downloads from openpattern.io (a checkout asking for contact details): the maintainer downloads them. Then each is an item like the field trousers (CC BY 4.0, credit Open+Pattern). |
| Review of `designs/t-shirt` | Written by another agent outside the usual workflow; reviewed when the maintainer asks. |
