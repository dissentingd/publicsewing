# Contributing a design

This guide shows how a drafting book becomes a made-to-measure PublicSewing design. It covers
the tools, the order of work and the judgment calls, so you, or your own coding agent, can do
the same with another source.

Most of our designs were written by an AI coding agent working through these steps, with a
person choosing garments and reviewing the result. The reference docs say *what* a design is:
- [designs/SPEC.md](designs/SPEC.md), the spec format;
- [designs/README.md](designs/README.md), commands and the `lib/` modules;
- [SOURCING.md](SOURCING.md), which sources qualify and the rights rules;
- [WARDROBE_GAPS.md](WARDROBE_GAPS.md), which garments are wanted.

This file covers what those don't: *how* the work is done, and the decisions made along the way.

## The approach

- **The book is a design reference, not data to reproduce.** It says which pieces a garment has,
  where its style lines fall, how much ease it has, and how it's closed, pocketed and sewn.
- **Geometry comes from FreeSewing's tested blocks** (Brian, Bent, Breanna, Titan, Sarah),
  drafted from the wearer's own measurements. So every design drafts at any size, children's
  included, though fit is proven only by sewing.
- **Every number taken from the source becomes an option default**, expressed as a proportion
  of a body measurement or of the block. The user can change it. Nothing from the source is a
  hard-coded constant.
- **Historical accuracy isn't a goal.** Simplify and modernise freely, but write down what you
  changed.

## Ground rules

- **Rights.** Use sources that are public domain both in the US and where you are (US
  publications before 1931, US government works, non-US works whose authors died long enough
  ago), or openly licensed ones (credit them, e.g. CC BY). An in-copyright book may be used
  only for its methods, formulas and proportions, which copyright doesn't cover. Never commit
  its text, figures or scans. See SOURCING.md, "Rights".
- **Own words.** Briefs and construction steps are written fresh, never copied, even from a
  public-domain book.
- **Cite pages.** Every option default traces back to a page, figure or table, so a reviewer
  can check it.
- **Don't fix the source silently.** If the figure and the text disagree, record both and say
  which you followed.
- **Don't present your own numbers as the source's.** Where the source is silent (pocket size,
  button count), choose a value and mark it as ours.
- **Names.** Design ids are plain garment names (`work-pants`), not people's or brands'. The
  project is PublicSewing; don't call it FreeSewing.
- **Status.** A new design is `draft` until someone sews a muslin and records the result in its
  brief.

## Tools

| Tool | Used for |
|---|---|
| Node 22 + npm | Designs, tests, render and preview scripts (`designs/`), the site (`site/`) |
| Python 3 (with Pillow) | Small scripted edits, cropping renders to inspect them, the corpus scripts |
| Poppler: `pdftotext -layout`, `pdfinfo`, `pdftoppm` | Text of a scan, finding pages, rendering pages to PNG to read diagrams |
| ImageMagick (`montage`) | A contact sheet of a whole book, to find the diagram plates fast |
| Tesseract | OCR, when a PDF has no text layer |
| Playwright + Chromium (global) | PNG renders of patterns (`render.mjs --png`, `preview.mjs`) |
| git, GitHub CLI | One commit per garment; pull requests |
| An agent that can view images | Reading diagram pages and rendered patterns. This step matters most |
| Optional: a GPU machine with Docker | 3D drapes in GarmentCode ([designs/drape/README.md](designs/drape/README.md)) |

Setup:

```bash
cd designs
npm install
npm test
```

Playwright, for PNG renders:

```bash
npm install -g playwright
npx playwright install chromium
```

The local site:

```bash
cd site
npm install
npm start
```

On Windows, Git for Windows' bash ships `pdftotext` but not `pdftoppm`. Render pages on any
machine that has the full Poppler, or install it.

## Step 1: Choose a garment and a source

**Garment.** Take one from WARDROBE_GAPS.md. A variant of something we already have (another
shirt, another trouser cut) also counts. Rank the candidates by how much they can reuse: a
garment that extends an existing design costs a fraction of one that needs a new block or a new
`lib/` module. When several are wanted, build the cheap ones first. Work through a list one
garment at a time, committing after each.

**Source.** It must carry numbers (SOURCING.md's grades):
- **A:** point-by-point drafts, dimensioned pieces, proportion tables.
- **B:** finished measurements by size, or dimensioned pocket and collar placements.
- **C** (body data only) and **D** (sketches and prose) aren't enough.

Before you download, check the OCR text for measurement density: lots of "1/3 of breast plus 2
in" is a good sign. A worked example, where the book states its figure's measurements and then
drafts them, is worth a lot: you'll calibrate against it.

**Record it.** Held sources are in [corpus/MANIFEST.yaml](corpus/MANIFEST.yaml), cited by
folder id (e.g. `draftingpantsove00simo`). Fetch an archive.org item with
`python scripts/corpus_fetch.py <corpus_dir> <identifier>`. Settle the source's rights before
any work.

## Step 2: Find and read the source's pages

A scanned drafting book is hard to navigate. What works:

1. **Get the text.**

   ```bash
   pdftotext -layout book.pdf book.txt
   ```

   Search it for the garment's name and the contents page. If the PDF has no text layer, OCR it
   with Tesseract first.
2. **Map PDF pages to book pages.** They rarely match: front matter shifts them (one book ran
   six pages ahead), and some scans are out of order. Grep page by page to find which PDF pages
   hold the section:

   ```bash
   pdftotext -f N -l N -layout book.pdf - | grep -i "riding breeches"
   ```
3. **Find the diagram.** Diagrams are often on plates facing the text, or on otherwise blank
   pages, so a text search misses them. Render a range of pages at a low resolution (about 70
   dpi) and look. For a whole book, a contact sheet (`montage`) finds the plates in one look.
4. **Read the diagram at a readable resolution.** Render the page you need at about 110 dpi or
   more, and read it as an image. Crop to the part you need.

   ```bash
   pdftoppm -r 110 -png -f 34 -l 34 book.pdf page
   ```
5. **Check every fraction against the page image, not the OCR.** OCR confuses ½, ¼ and ¾, and
   drops fractions. One brief recorded "2¼ in" from the OCR where the page prints "2½ in", and a
   reader caught it. If you can't confirm a number from the image, leave it out of the brief
   rather than guess.

Write down, with page numbers:
- the pieces;
- each style line;
- the ease;
- the length;
- closures, pockets, collars and linings;
- the construction order.

Note what the source leaves out ("finish as represented", "length according to style"): those
become your choices.

## Step 3: Turn the source's numbers into proportions

Each source number becomes a proportion of something the wearer's measurements, or the block,
provide:

| Source says | Worked out | Option default |
|---|---|---|
| Half the chest is 61.65 cm across, on a 100 cm chest | (2 × 61.65 − 100) / 100 | `chestEase` 23% |
| 29.1 cm below the waist; waist to seat about 26.5 cm | 29.1 / 26.5 | `lengthBelowWaist` 110% of `waistToSeat` |
| Back yoke 16 cm down CB, of 27.75 cm from the nape to the underarm | 16 / 27.75 | `yokeDepth` 58% |
| "A 1¼ in lap", on a 38 in chest | 1.25 / 38 | `buttonExtension` 3.3% of chest |
| Bottom 17 in, knee 21 in | 17 / 21 | `hemWidth` 81% of the knee |

**Calibrate on a size 38.** Most books draft a 38 in chest (or 100 cm). FreeSewing's
`cisMaleAdult38` is the stand-in: set the defaults so the design at that size reproduces the
source's dimensions, then check them. For example, the pyjama trousers' hem came out 43.5 cm
round against Vincent's 17 in (43.2 cm). For a quick check, print the size set's measurements
and the drafted values from a scratch Node script (below).

**"Drafted N sizes up."** Overcoat books often draft a larger breast than the wearer's for
ease. Each size is about 2 in of chest, so turn it into extra `chestEase` over the parent's.

**Where the source is silent,** choose something sensible from a similar design we already
have. Label it as ours in the brief.

## Step 4: Choose what to build on

Choose in this order:

1. **Extend an existing design** with `extends:` when the garment is a variant of one. Most of
   our designs do this. The overcoat extends the peacoat, the breeches extend the trousers, the
   service shirt extends the pyjama jacket.

   Read the parent's spec and its brief first. Your spec then changes only option defaults and
   adds or replaces pieces.
2. **A block**, when nothing is close:

   | Block | For | Library |
   |---|---|---|
   | `brian` | Men's coats and jackets, loose bodies | `lib/coat.mjs` |
   | `bent` | Fitted jackets: side panel, two-piece sleeve | `lib/body3.mjs` |
   | `breanna` | Women's jackets and coats: princess seams or a box body | `lib/jacket.mjs` |
   | `titan` | Trousers, knickers, overalls | `lib/trousers.mjs` |
   | `sarah` | Skirts | `lib/skirt.mjs` |
   | `templates/yoke.yaml` | Yoke garments: nightshirts, smocks, frocks, shirts | `lib/yoke.mjs` |
   | none | Garments cut flat from rectangles (the jumpsuit) | `lib/flat.mjs` |

3. **Extend a library** when a construction isn't there yet: breeches needed a leg flared at
   the thigh and fitted below the knee, and the bib overall needed a straight-edged `polygon`
   piece. Add it as an option or operation any design can use, never as coordinates in one spec.

   Read the block's own source first, in `node_modules/@freesewing/<block>/src`, to learn its
   point names. They differ between pieces: Titan's front and back name their control points
   differently, and its front knee sits a few millimetres lower than the back's.

## Step 5: Write the spec, and draft it early

1. Create `designs/<design>/spec.yaml` ([SPEC.md](designs/SPEC.md)):
   - `about`: `id`, the name without hyphens (it prefixes piece names); `name`, `description`,
     `difficulty`, `tags`, `techniques`, `version: 0.1.0`, and `source`. Set `preview` for a
     women's or children's design: the size its site preview is drawn at, e.g.
     `cisFemaleAdult36` or `usdaGirlC8`.
   - Options, one per source number, each with a comment saying what it multiplies:
     `lengthBelowWaist: { pct: 110, min: 40, max: 200, menu: style } # x waistToSeat`.
   - Pieces: block parts with operations, or piece types.
2. Create `designs/<design>/src/index.mjs`. Copy the parent's or a sibling's and rename the
   exports.
3. **Draft at once, at three sizes:** `cisMaleAdult38`, a small child (`usdaBoyC5`) and a stout
   figure (`stoutMale48`). Don't wait for the full test suite. A scratch script that imports the
   design, drafts it and prints the store values and seam lengths you care about finds most
   problems in seconds:

   ```js
   // scratch.mjs, kept outside the repo
   const { Breeches } = await import('file:///.../designs/breeches/src/index.mjs')
   const { sets } = await import('file:///.../designs/test/coat-checks.mjs')
   for (const name of ['cisMaleAdult38', 'usdaBoyC5', 'stoutMale48']) {
     const p = new Breeches({ measurements: sets[name], sa: 10 }).draft()
     const s = p.setStores[0]
     console.log(name, s.logs.error, s.get('trousers.front')?.inseam, s.get('trousers.back')?.inseam)
   }
   ```
4. **Values are evaluated in order.** In a spec map, a value can only use the values above it.
   If an expression comes out undefined, reorder the entries.
5. **Store lookups.** Expressions can read only some store namespaces (see `lookupIn` in
   `lib/spec.mjs`). Keep new values under an existing prefix, or add the prefix there.
6. **Labels.** Every option shown in the pattern tool needs a title and a description: shared
   ones go in `designs/labels.yaml`, design-specific ones as `title:` and `description:` in the
   spec. `test/labels.test.mjs` enforces this.

## Step 6: Make every size work

The tests draft every design at every FreeSewing adult set, three stout figures and all 75 USDA
children's sets: 98 sets. Most of the work after the first draft goes here, and the fixes
follow a few patterns:

- **Find the cause before loosening a tolerance.** When the breeches' inseams differed by 4 mm,
  the cause was measuring heights from a shared level instead of from each piece's own knee.
  Fixed, they matched within 0.9 mm. Only raise a tolerance once you know why it's needed.
- **Clamp what can't hold at small sizes.** Children's proportions differ from adults', so a
  proportion that works at size 38 can push a point out of place on a 3-year-old. Examples:
  - a top button rising above the neck: kept at least 15% of the neck below the neck point;
  - a pocket running off the piece: narrowed to stay clear of the armhole, side seam and hem;
  - a tapered hem narrower than the knee: held to at least the knee;
  - waist ease shaped away on the smallest women's sets: a floor of 6–9%.

  Each clamp gets a line in the brief's "Changes" section.
- **Use real proportions for children** where they differ: the pyjama trousers' untapered hem
  is about 0.8 × the seat on the smallest children, not the adults' 0.95.

Then add the tests:

1. **`designs/test/<design>.test.mjs`.** For most garments it's one line calling the family's
   checks with option variants:

   ```js
   import { ChoreCoat } from '../chore-coat/src/index.mjs'
   import { testCoat } from './coat-checks.mjs'

   testCoat('chore coat', ChoreCoat, 'chorecoat.front', {
     default: {},
     square: { pocketShape: 'square', buttons: 6, hemCurve: 1 },
   })
   ```

   The families are `coat-checks.mjs` (Brian and Bent), `jacket-checks.mjs` (Breanna),
   `yoke-checks.mjs` and `suit-checks.mjs` (flat-cut). Trousers write their own asserts, as
   `test/peg-pants.test.mjs` does: matching outseams and inseams, a waistband that fits the
   waist, a fly above the fork. Add a check for whatever this garment could get wrong.
2. **Variants.** Pick a "plain" variant that turns the options off (no pockets, other closures),
   and add the same variants to `designs/tools/variants.json`.
3. **Run the tests.** Run the new design's tests and the labels test while you iterate, then
   `npm test` once at the end:

   ```bash
   node --test test/<design>.test.mjs test/labels.test.mjs
   ```

## Step 7: Prove you didn't move other designs

If you changed a shared file in `lib/`, every design using it must come out identical. Take the
"before" snapshot from the committed version of the file, without losing your edit:

```bash
cp lib/trousers.mjs /tmp/trousers.new.mjs
git show HEAD:designs/lib/trousers.mjs > lib/trousers.mjs
for d in trousers work-pants knickerbockers pyjama-trousers; do node tools/snapshot.mjs $d save; done
cp /tmp/trousers.new.mjs lib/trousers.mjs
for d in trousers work-pants knickerbockers pyjama-trousers; do node tools/snapshot.mjs $d compare; done
```

`compare` checks every point, path, snippet and stored value at every size and variant. New
behaviour should sit behind an option that's off by default, so the old designs can't change.

## Step 8: Look at it

Tests prove the pieces are consistent, not that they're the right garment. Render and look:

```bash
NODE_PATH=$(npm root -g) node tools/render.mjs <design> cisMaleAdult38 usdaBoyC5 stoutMale48 --png
```

Open the PNGs from `designs/out/` next to the source's diagram. Crop and zoom into a region when
a mark is small. Look for:
- the pieces' outlines against the source's;
- pocket, button and dart marks on their pieces, at the source's places (one bib-overall pocket
  mark first landed outside the front, and all the tests still passed);
- the child and stout renders still making sense;
- the source's worked example: at size 38, does a key dimension match what the book prints?

A 3D drape is an optional, stronger check that the pieces sew into the garment; see
[designs/drape/README.md](designs/drape/README.md).

## Step 9: Write the brief

Write `designs/<design>/BRIEF.md` as you go, and finish it last, from what was actually built:

```markdown
# <Garment name>

**Source:** author, title (place, year), corpus folder id; the pages, figures or tables used.

**Block:** the block or design this extends, and the lib/ operations it relies on.

**Status:** draft. Not sewn.

## What the source shows
The pieces, style lines, ease, length, closures and pockets, in the source's own numbers and
units, each with its page.

## How it maps onto the block
| Feature | Source | Here (option default) |
|---|---|---|

## Changes and what isn't modelled
Every deliberate difference: a simplification, a clamp, a number of our own.

## Pieces
What to cut, and how many.

## Construction
The sewing order, in our own words.
```

Before you commit, re-read the brief against the page images. Delete any claim you can't back
from the page.

## Step 10: Finish and commit

1. **Preview:** in `designs/`, run the command below and commit the
   `<design>/preview-<set>.png` it writes. The site shows it beside the illustration.

   ```bash
   NODE_PATH=$(npm root -g) node tools/preview.mjs <design>
   ```
2. **Illustration prompt:** add one to the bottom of
   [site/illustrations/PROMPTS.md](site/illustrations/PROMPTS.md). Describe the garment at its
   defaults, then end with a "Leave out" line naming what image models tend to add wrongly
   (cuffs, tabs, extra pockets). The image, `site/illustrations/<design>.jpg` (square, at least
   1024 px), can come later.
3. **Docs:**
   - README.md: the Status table row; it sets the site's order.
   - designs/README.md: the Contents row, and the `lib/` row if you extended a library.
   - designs/SPEC.md: any new operation or piece type.
   - SOURCING.md: the source's row, listing the designs it feeds.
   - WARDROBE_GAPS.md: the garment's row and the progress count.
   - `.github/ISSUE_TEMPLATE/muslin-report.yml`: the design in its dropdown.
4. **Check the page** with `npm start` in `site/`: the pattern tool drafts, and **Export** makes
   a PDF.
5. **Commit one garment per commit.** Stage your files by name, not `git add -A`: other work may
   be in the same checkout. Before pushing, check the commit's `--stat` for files rewritten only
   by line endings.

## Step 11: Open a pull request

- [ ] The source's rights are checked; the brief cites it by folder id, with pages.
- [ ] No source text, figure or scan of an in-copyright work is committed.
- [ ] Every source number is an option default with a comment, mapped in the brief.
- [ ] Every fraction was read from the page image, not only the OCR.
- [ ] Every change and clamp is listed in the brief.
- [ ] `npm test` passes, labels included; snapshots match for any shared `lib/` file you changed.
- [ ] You looked at the renders at an adult, a child and a stout size.
- [ ] The preview PNG is committed, the prompt added and the docs updated.
- [ ] The status says `draft`.

Contributions are under the repository's licences: PolyForm Noncommercial for code, CC BY-NC
for content (README.md, "License").

## Working with a coding agent

- **Give it the context:** this file, SPEC.md, the source's folder id and pages, and the nearest
  existing design.
- **Make it look.** An agent that can read images should open both the diagram pages and its own
  renders. Most mistakes we caught were caught by eye: a misread fraction, a mark off its piece.
- **Ask for the arithmetic.** Have it show, for each default, the source number, what it's
  divided by and the result.
- **Watch for coordinates.** If the agent starts writing coordinates into a spec, have it move
  them into a `lib/` operation instead.
- **Review "Changes" first.** It's where the agent records what it simplified, clamped or
  guessed.
- **One garment at a time,** each committed before the next starts.

A starting prompt:

> Read CONTRIBUTING.md and designs/SPEC.md. Add a design `<design-id>` for <garment> from
> <source title, folder id, pages>. Find the section with pdftotext, render the diagram pages
> and read them as images. Extend `<nearest design>` if it fits; otherwise build on `<block>`.
> Map every source number to an option default, showing the arithmetic and the page. Draft at
> cisMaleAdult38, usdaBoyC5 and stoutMale48 early. Make every size pass, and snapshot any
> design whose shared lib/ file you change. Render the design and compare it with the diagram,
> write the brief, and finish with Step 10. Commit only your own files.
