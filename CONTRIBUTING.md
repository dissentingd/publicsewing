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

**Building with an agent?** Three more files keep the cost down. [AGENTS.md](AGENTS.md) is the short
loop for every garment; this file is for reading once. [SOURCE_NOTES.md](SOURCE_NOTES.md) holds what's
known about each book. `BUILD_NOTES.md`, your own and git-ignored, holds what's true on your machine.
See "Your notes file" and "Spending fewer tokens", near the end.

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
machine that has the full Poppler, or install it. Pillow can do what `montage` does here, so you
needn't install ImageMagick as well.

The repo's own tools, run in `designs/` (those that make images or use a browser need
`NODE_PATH=$(npm root -g)` first):

| Tool | Answers |
|---|---|
| `tools/measures.mjs <set> [measurement ...]` | What do I divide this source number by? |
| `tools/probe.mjs <design> [set] [options json]` | Which parts drafted, and what are the errors, with stacks? |
| `tools/part.mjs <design> <set> <part,part> [options json]` | What does this one piece look like, large? |
| `tools/render.mjs <design> <set> ... --png` | What do all the pieces look like at these sizes? |
| `tools/compare.mjs <design> --pages <pdf pages>` | Does it match the plate, on one sheet? |
| `tools/buttons.mjs <design>` | Is every button on its piece at every size? |
| `tools/snapshot.mjs <design> save` / `compare` | Did my `lib/` change move this design? |
| `tools/preview.mjs <design>` | The preview PNG the site shows |
| `tools/page-look.mjs '' <design> [size]` | What does the built page's tool show, with console errors? |
| `tools/page-check.mjs <design>` | Does everything on the built page work? |

Scratch scripts go in `designs/tools/` named `_name.mjs`, where they can import the repo's modules
and git ignores them. ES module imports ignore `NODE_PATH`: load Playwright as `tools/render.mjs` does.

A few traps that catch most setups:
- `npm test` takes several minutes, longer than many agents' default command timeout. Run it in the
  background.
- On Windows, Python printing non-ASCII fails unless `PYTHONIOENCODING=utf-8` is set; always open files
  with `encoding='utf8'`. Line-ending warnings from git are noise, but do check a commit's `--stat`.
- In a script that edits files, compute all the new text first and write afterwards. A failed
  assertion after the file was opened for writing once emptied it.
- A fresh git worktree has no `node_modules`: `npm install` in `designs/` first.

## Step 1: Choose a garment and a source

**Garment.** Take the next open item in [BUILD_QUEUE.md](BUILD_QUEUE.md), the ordered list of
garments still to build (see "Taking an item" there), or propose one from WARDROBE_GAPS.md. A variant of something we already have (another
shirt, another trouser cut) also counts. Rank the candidates by how much they can reuse: a
garment that extends an existing design costs a fraction of one that needs a new block or a new
`lib/` module. When several are wanted, build the cheap ones first. Work through a list one
garment at a time, committing after each.

**Treat a queue item as a lead, not a specification.** Its notes, its "start from" design and
even its page numbers were written before anyone read the pages, and many have turned out wrong:
"plus-fours" whose plate was fitted through the knee, a page taken from a book's own mistaken
contents, a "kilt" that was one flared piece with no pleats or wrap. Read the source (Step 2),
then correct the item's notes. If the source can't carry the garment, ask the person running you
what they want rather than choosing for them.

**Design or variant?** Decide before making a folder:
- A look reached only by choosing options on an existing design is a **variant** of it, listed
  under `variants` in that design's spec (Step 10).
- A garment with a source of its own is a **design**, even if options could nearly reach it, so
  that one page doesn't mix two sources' credits.
- Overlap with an existing design is no reason to skip a garment.

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

   Search it for the garment's name, not just the contents page: contents pages can be wrong. If
   the PDF has no text layer, OCR it with Tesseract first.
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
6. **Read the plate as well as the words.** The plate often holds what the text doesn't: a button
   count, a belt's width, how far a collar's point reaches. Where they differ, the plate usually
   shows what was meant: "D.B." in one book's text is one row of frogs on a wide overlap on its
   plate. Record which you followed.
   - **Take a scale from the plate.** Find a length the text states, and divide. In the button-on
     middy's Diagram 10, S to C is ½ breast + 4 in = 16 in across 484 px, or about 30 px to the
     inch. Anything else can then be measured, and marked "read from the plate" in the brief.
     Figures with no numbers at all can be read the same way, from a known length such as neck
     point to waist.
   - **Use the scale to test the units.** The same draft says X to Y is "1/6 of breast", which
     would make a 24 in breast's neck 4 in deep. The plate shows 2 in: a sixth of the *half* breast.
   - **Know what a line means.** A heavy diagonal may be a lapel folded over the body, not a
     cutaway front. Crossing side seams belong to the other panel, and their flares can differ.
     Say what an unlabelled mark is taken to be ("read as tucks"), so a reviewer can disagree.
7. **Follow references to other diagrams.** "Drafted similar to the previous diagram" means pieces
   the plate doesn't draw, such as the sleeve and cuff, are on the previous diagram's pages.

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

**A book drafted at another size calibrates at that size.** A size 6 draft calibrates on
`usdaBoyC6`, and its `about.preview` is set to match. Print the stand-in's measurements before
working anything out. Divide by the stand-in's number when the book doesn't give the measure at
all: Simons' size 6 states no waist to seat, so his 4 in below the waist is 4 / 6¼ (`usdaBoyC6`),
or 64%. Then check the result: the middy's hem came out 36⅔ in round against his 36.

**Then look at it at the other end of the range.** A share taken from a child can look odd on an
adult (that middy's 2 in belt becomes 3 in). Keep the source's number as the default, make the
option's range cover the alternative, and say so in the brief.

**Check an option's name before using it.** `designs/labels.yaml` has one namespace, and a label
says what the option is a share of. `grep` it first: `pleatHem` already meant something else, and
`strapWidth` was already "a share of the waist". Reuse a name only if its label's meaning fits.

**"Drafted N sizes up."** Overcoat books often draft a larger breast than the wearer's for
ease. Each size is about 2 in of chest, so turn it into extra `chestEase` over the parent's.

**Where the source is silent,** choose something sensible from a similar design we already
have. Label it as ours in the brief.

## Step 4: Choose what to build on

**Choose by how it's built, not by what it's called.** Name the construction from the diagram
first: where the seams are, whether the front opens on a cut-on stand or is cut on the fold, whether
it has a side body, whether a leg has a side seam. Then find the design that already builds that.
The button-on middy shares a name with `middy-blouse`, a pullover on the fold, but it opens all down
the front on a stand, so it's on `pyjama-jacket`. The drawers have no side seam, so they're on
`overall-pants`, not `pyjama-trousers`.

Choose in this order:

1. **Extend an existing design** with `extends:` when the garment is a variant of one. Most of
   our designs do this. The overcoat extends the peacoat, the breeches extend the trousers, the
   service shirt extends the pyjama jacket.

   Read the parent's spec and its brief first. Your spec then changes only option defaults and
   adds or replaces pieces. Try the spec alone before touching a library, and borrow pieces from
   sideways: the dress shirt's `cuff` and `sleevePlacket` work on any coat.

   Your design can have children too. Before adding a piece or option to a design that others
   extend, run `grep -l <design>/spec designs/*/spec.yaml`: they inherit it, and a spec can't remove
   a parent's piece.
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
   figure (`stoutMale48`), plus the source's own size if it isn't one of them. Don't wait for the
   full test suite. `tools/probe.mjs` shows which parts drafted, and any errors. A scratch script
   that drafts it and prints the store values and seam lengths you care about finds most problems in
   seconds:

   ```js
   // designs/tools/_check.mjs, ignored by git
   import { Breeches } from '../breeches/src/index.mjs'
   import { sets } from '../test/coat-checks.mjs'
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
7. **Overriding an inherited piece.** Spec errors that cost time, and what they mean:
   - To replace an inherited piece, use its name and the parent's `prefix:` (`prefix: barberscoat`),
     and copy its whole `ops:` list. Parts are then named by that prefix in tests too
     (`barberscoat.front`).
   - `Error: unknown option "x"`: something still reads an option that no piece declares. An
     overridden `front` must keep what the inherited pieces read, such as `breastPocket` for the
     pocket pieces, even when it's off the menu (`breastPocket: { bool: false, menu: false }`).
     Typed pieces (`part:`) take `options:` and `measurements:` too.
   - Replacing a piece also drops what it registered: a collar override must declare again the
     options the parent's collar brought.
   - An inherited piece can't be removed. Give it an `if:` on an option that's off, with `menu: false`.
   - A literal inside a spec value needs its own quotes: `shape: "'square'"`.
   - An option left on the menu must still do something in your override. `variants.test.mjs` catches
     this only for options a variant sets.
   - `Unable to draft part`: `tools/probe.mjs` prints the error's stack. When a key seems to do
     nothing, read its builder in `lib/spec.mjs` before trying another spelling.

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
   waist, a fly above the fork. Add a check for whatever this garment could get wrong: the family's
   checks don't know that a belt must fit the waist, or that a hem must be fuller than the belt it's
   gathered into. Check every button at its own height on its piece, not against the piece's bounding
   box: a stout figure shifts the front, and a dart can cross a button row.
2. **Variants.** Pick a "plain" variant that turns the options off (no pockets, other closures),
   and one that pulls the defaults apart, and add the same variants to
   `designs/tools/variants.json`. Pulling them apart finds what a default hid: the middy's last button
   sat level with the back's hem, which was clear of the dropped front until `frontDrop: 0`. Place
   marks from what they must clear, so they move with it.
3. **Run the tests.** Run these while you iterate, then `npm test` once before asking to push. It
   takes minutes, so run it in the background:

   ```bash
   node --test test/<design>.test.mjs test/variants.test.mjs test/labels.test.mjs test/declared-measurements.test.mjs
   ```

   Go by the exit code, not a filtered read of the output. `declared-measurements` matters because
   the tests hand a design every measurement while the site passes only those it declares, so a
   design can pass everything and fail on its live page.

   A sweep that says everything is broken is usually itself broken: check the sweep first.

## Step 7: Prove you didn't move other designs

If you changed a shared file in `lib/`, every design using it must come out identical, however
obviously safe the edit looks, a new default parameter included. Passing tests don't prove this.
Include the children of any design you touch. Take the "before" snapshot from the committed version
of the file, without losing your edit:

```bash
cp lib/trousers.mjs /tmp/trousers.new.mjs
git show HEAD:designs/lib/trousers.mjs > lib/trousers.mjs
for d in suit-trousers work-pants bloomers pyjama-trousers; do node tools/snapshot.mjs $d save; done
cp /tmp/trousers.new.mjs lib/trousers.mjs
for d in suit-trousers work-pants bloomers pyjama-trousers; do node tools/snapshot.mjs $d compare; done
```

`compare` checks every point, path, snippet and stored value at every size and variant. New
behaviour should sit behind an option that's off by default, so the old designs can't change.

## Step 8: Look at it

Tests prove the pieces are consistent, not that they're the right garment. Render and look:

```bash
NODE_PATH=$(npm root -g) node tools/render.mjs <design> cisMaleAdult38 usdaBoyC5 stoutMale48 --png
```

Or put them on one sheet with the source's diagram pages, numbered as PDF pages:

```bash
NODE_PATH=$(npm root -g) node tools/compare.mjs <design> --pages 53,55
```

It writes `designs/out/<design>-compare.png`, and takes `--source` for a PDF or image outside
`corpus/`, `--sets` and `--options`. Don't commit a sheet: the source may be in copyright.

Open the PNGs from `designs/out/` next to the source's diagram. Crop and zoom into a region when
a mark is small. Look for:
- the pieces' outlines against the source's;
- pocket, button and dart marks on their pieces, at the source's places (one bib-overall pocket
  mark first landed outside the front, and all the tests still passed);
- the child and stout renders still making sense, and an adult's if the source drafts a child;
- the source's worked example: at its size, does a key dimension match what the book prints?
- whether it can be worn. A stand-collar variant whose top button sat at the chest line, so it
  couldn't close, passed every test.

A 3D drape is an optional, stronger check that the pieces sew into the garment; see
[designs/drape/README.md](designs/drape/README.md).

## Step 9: Write the brief

Write `designs/<design>/BRIEF.md` as you go, and finish it last, from what was actually built:

```markdown
# <Garment name>

**Source:** author, title (place, year), corpus folder id; the pages, figures or tables used.

**Block:** the block or design this extends, the lib/ operations it relies on, and why, if that
isn't the design the queue suggested.

**Threadloop:** whether a free equivalent exists, and whether any is drafted from measurements
(SOURCING.md, "Free modern patterns"). Search the garment's name and its nearest modern word.

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

If the source covers only part of the garment (a kilt's hem and length, say), say so at the top.
Keep three things distinct: what the text states, what you read from the plate, and what's ours.

`test/brief.test.mjs` fails if a brief lacks any of these sections, or the Threadloop line. Briefs older
than the test are listed with what they lack in `test/brief-exemptions.json`. Never add a new design to
that list; remove an entry once its brief is complete.

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
   A choice that changes how the garment looks (a storm collar or lapels) is a **variant**: list
   it under `variants` in the spec ([designs/SPEC.md](designs/SPEC.md)) so its page explains it,
   rerun the preview, and add a prompt headed `<design>.<variant>` for its image,
   `site/illustrations/<design>.<variant>.jpg`.
   Adding a variant to an existing design also rewrites its default preview, with only the title
   block's date changed: restore that file with `git checkout` rather than committing it.
3. **Docs:**
   - BUILD_QUEUE.md: the item's status, `done (<design>)`, and an "As built" note on anything that
     differed from the item, in the design's own commit.
   - README.md: the Status table row; it sets the site's order.
   - designs/README.md: the Contents row, and the `lib/` row if you extended a library.
   - designs/SPEC.md: any new operation or piece type.
   - SOURCING.md: the source's row, listing the designs it feeds.
   - WARDROBE_GAPS.md: the garment's row and the progress count.
   - `.github/ISSUE_TEMPLATE/muslin-report.yml`: the design in its dropdown
     (`test/muslin-report.test.mjs` fails without it).
4. **Check the page:** `npm run build` in `site/`, then in `designs/`:

   ```bash
   NODE_PATH=$(npm root -g) node tools/page-check.mjs <design>
   ```

   It opens the built page in a browser: the tool drafts at a size, each variant's button changes
   the drawing, every download and the tiled PDFs are made, with no console errors.
5. **Commit one garment per commit.** Stage your files by name, not `git add -A`: other work may
   be in the same checkout. Check the commit's `--stat` for files rewritten only by line endings.
   Read the test result before committing: don't chain the commit after a test run with `;`.
6. **Pushing `main` deploys the site.** Don't push unless the person running you asks, each time.
   Run the full `npm test` first. If the push is rejected, look at what the new commits touch,
   rebase rather than merge, and rerun the tests for anything they could have affected.

## Step 11: Open a pull request

- [ ] The source's rights are checked; the brief cites it by folder id, with pages.
- [ ] No source text, figure or scan of an in-copyright work is committed.
- [ ] Every source number is an option default with a comment, mapped in the brief.
- [ ] Every fraction was read from the page image, not only the OCR, and the plate read as well
      as the text.
- [ ] The base was chosen from the diagram's construction, and any queue note it contradicts is
      corrected.
- [ ] Every change and clamp is listed in the brief.
- [ ] `npm test` passes, labels included; snapshots match for any shared `lib/` file you changed.
- [ ] You looked at the renders at an adult, a child and a stout size, and beside the source's
      diagram.
- [ ] The page check passes.
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
- **Have it re-read this file's checklists at the end.** Steps get skipped when an edit looks
  harmless. Ask it to report what it didn't run or couldn't verify, plainly.
- **Keep a working log.** One line per garment on what it decided that the next could reuse and
  what cost time. Most of the traps in this guide came from such a log. Whatever turns out general
  belongs here.

## Your notes file

An agent starts each session knowing nothing about your machine, so it spends tokens finding out
which tools you have, failing on the same trap, and re-deciding what you've settled. A notes file stops
that. It's what makes a second design from a source cheaper than the first.

Keep what you learn in the place where it will be found:

| What | Where | Why |
|---|---|---|
| Your machine: tools, paths, servers, recipes, traps, private context | `BUILD_NOTES.md` at the repo root | Git-ignored, so it's never published |
| A book: its page offset, unit quirks, wrong contents, how to read its plates | [SOURCE_NOTES.md](SOURCE_NOTES.md) | Tracked: every contributor gets it |
| A method that applies to any garment | This file, or AGENTS.md | Tracked |
| One garment's reasoning | Its `BRIEF.md` | Tracked |

**Set it up once:**

```bash
cp BUILD_NOTES.example.md BUILD_NOTES.md
git check-ignore BUILD_NOTES.md        # prints the name if it's ignored
```

Then have your agent fill in the Environment table from what it finds, rather than from what it
assumes:

```bash
for t in node npm python pdftotext pdftoppm pdfinfo tesseract git gh; do command -v $t || echo "MISSING $t"; done
node -v
python -c "import PIL; print('Pillow', PIL.__version__)"
NODE_PATH=$(npm root -g) node -e "require('playwright'); console.log('playwright ok')"
```

Record what's missing as well as what's there, so no one goes looking again. Note how long a full
`npm test` takes here, and where any source that isn't tracked is kept.

**Then keep it up as you build, not at the end.** When a command fails, a tool is missing, or a choice
would apply to the next garment, add a line straight away, and correct anything stale. Keep it short:
it's read in full every session, so it costs tokens each time. Move facts about a book to SOURCE_NOTES.md,
and methods to this file in a pull request.

**Never put in a tracked file:** addresses, hostnames, usernames, home paths, keys, or people's names.
Before committing, check the diff for them. Scratch scripts named `designs/tools/_*` and
`BUILD_NOTES.md` are ignored for you. Other private notes belong in your clone's `.git/info/exclude`.
Stage files by name, so nothing untracked is swept in.

**Handing over to another agent:** point it at AGENTS.md, which most agents read on their own and which
sends them to `BUILD_NOTES.md`. If your agent reads a different file by default, make that file one line
naming AGENTS.md, and keep the file out of git. Don't keep a second copy of the instructions: copies
go stale.

## Spending fewer tokens

What made these builds cheap, roughly in order of how much it saved:

- **Extend a design.** Our cheapest garments were a dozen lines of spec on the right parent. The time
  goes into choosing that parent, so read the plate first.
- **Don't read what you can search.** For a garment you need one queue row, one book's notes, the
  parent's spec and brief, and the plate. `grep -n` for an operation in `designs/SPEC.md` or `lib/`, then
  read that function. Don't open the large docs whole: for a table row, `grep` the row beside it.
- **Reuse the last commit as the template for the docs:** `git show --stat HEAD` lists every file a
  garment touches, and `git show HEAD -- <docs>` shows each row's form.
- **Text before images.** An image costs far more than the same page's text. Search the text to find the
  page, then render only the plate, at about 130 dpi. For a render, one `compare.mjs` sheet replaces
  several views; use `part.mjs` to see a detail rather than a whole render at a higher resolution.
- **Collapse test output.** A problem fails at up to 98 sizes per variant, identically. Send the output
  to a file, read the exit code, and count distinct failures:
  ```bash
  grep -E "AssertionError|Error:" out.txt | sed 's/[0-9.]\+/N/g' | sort | uniq -c | sort -rn | head
  ```
- **Run the small test set while you build,** and the full suite once, in the background, before a push.
- **Draft at one size first.** `probe.mjs` answers in about a second, against minutes for the tests.
- **Ask early.** A question costs a line. Building the wrong kilt costs a session.
- **Write down what cost time,** at once, in your notes file.
- **Use a cheaper model for mechanical work,** if your tools allow it: finding pages, filling in doc
  rows. Keep reading plates and choosing the base with your best one, since those decide the result.

## A starting prompt

> Read AGENTS.md, and CONTRIBUTING.md and designs/SPEC.md if you haven't. Add a design `<design-id>` for <garment> from
> <source title, folder id, pages>. Find the section by searching the book's text, render the
> diagram pages and read them as images, plate and text both. The item's notes and suggested base
> are guesses: choose the base from the construction the diagram shows, and say so if it differs.
> Ask me if the source can't carry the garment. Map every source number to an option default,
> showing the arithmetic and the page; take a scale from the plate for what the text omits. Draft
> early at the source's own size, an adult, a child and a stout figure. Make every size pass, and
> snapshot any design whose shared lib/ file you change. Render the design and compare it with the
> diagram, write the brief, and finish with Step 10. Commit only your own files, and don't push
> unless I ask. Tell me what you changed from the source and what you didn't verify.

## A worked example: the button-on middy

Simons 1922, Diagram 10, from queue item to commit, for the shape of the judgment calls. Its brief
is [designs/button-middy/BRIEF.md](designs/button-middy/BRIEF.md).

| Step | What happened |
|---|---|
| Find the pages | Book p. 42 is the text, and p. 41 the plate. Reading the page before p. 42 found the plate, which a text search misses. The text says "drafted similar to the previous diagrams", so the sleeve and cuff came from Diagram 9, p. 40 |
| Read the plate | The text gives no button count: five marks on the plate. The belt's 2 in width and the collar point's 1½ in were measured with a scale from the plate, and marked so in the brief. Four lens shapes at the hem were read as tucks |
| Check the units | "1/6 of breast" on a 24 in breast would be a 4 in neck. The plate's scale shows 2 in, so it means the half breast |
| Choose the base | The queue said `middy-blouse`, which is a pullover cut on the fold. The plate has a 1 in stand down the front, so it's on `pyjama-jacket`, and the queue item was corrected. The cuff and its placket were taken from `dress-shirt` |
| Map the numbers | 4 in below the waist / 6¼ in waist to seat at `usdaBoyC6` = `lengthBelowWaist` 64%. A 1½ in front drop = `frontDrop` 24%. A 1 in stand / 24 in breast = `buttonExtension` 4% |
| Library | The hem is sewn to a belt, so it mustn't take a turned hem's allowance: `hemSa` added to `coatBack` and `coatFront`, off by default, then snapshotted. A ruled hem already had `straightHem`, used because the text says "draw line 2, 4, 5" |
| Draft early | `Unknown option "breastPocket"`: the override had dropped options the inherited pockets read |
| Test | Added: the belt fits the waist plus both stands, the hem is fuller than the waist, the buttons clear the hem, the sleeve is fuller than the cuff. A `longer` variant with no front drop caught the last button on the hem |
| Look | Beside the plate at C6, then adult and stout. The adult's 3 in belt was kept, as an option, and noted |
| Brief | Lists what's ours (the sleeve opening, the buttoned cuff) and what's less than the source (the sleeve's fullness, an even collar depth), so a reviewer starts there |
| Finish | Preview, prompt, docs, queue status with an "As built" note, page check, one commit |
