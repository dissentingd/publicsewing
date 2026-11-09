# Agent quick start

For any coding agent adding a design to PublicSewing. This is the short loop, meant to be read for
every garment. [CONTRIBUTING.md](CONTRIBUTING.md) has the reasoning and examples: read it once, then
go to the matching step only when something here isn't enough.

**If `BUILD_NOTES.md` exists at the repo root, read it first.** It's the git-ignored notes file for
this machine: its tools, what's been learned, and any private context. If it doesn't exist, make one
(CONTRIBUTING.md, "Your notes file") and add to it as you work. Never put machine details or people's
names in a tracked file.

**Don't push unless told to, each time:** a push to `main` deploys the site. Ask rather than guess
when the source can't carry the garment or a choice is the maintainer's.

## One garment
Work in `designs/`, with one commit per garment. Stage files by name.

1. **Take the item.** The first `open` row in [BUILD_QUEUE.md](BUILD_QUEUE.md), unless you've been
   given one. Its notes, base and pages are guesses.
2. **Check what's known.** The book's row in [SOURCE_NOTES.md](SOURCE_NOTES.md): page offset and
   quirks. Add to it whatever you learn about the book.
3. **Read the source.** Text first, then only the plate pages:
   ```bash
   pdftotext -layout ../corpus/<id>/<id>.pdf "$S/book.txt"           # search for the garment's name
   pdftoppm -f <pdf page> -l <pdf page> -r 130 -png ../corpus/<id>/<id>.pdf "$S/p"
   ```
   Read fractions from the image. Take a scale from the plate for what the text omits.
4. **Choose the base** from the construction the plate shows, then read that spec and its brief:
   `grep -l "<word>" */spec.yaml`. A look reached only by options is a variant, not a design.
5. **Write** `<design>/spec.yaml` and `src/index.mjs` (copy a sibling's). Each source number is an
   option default with a comment. `node tools/measures.mjs <set> <measurement>` gives the divisor.
   `grep -n "^  <name>:" labels.yaml` before naming an option.
6. **Draft now:** `node tools/probe.mjs <design> <set> '<options json>'`, at the source's size, then a
   child, an adult and `stoutMale48`.
7. **Test,** with a `plain` variant and one that pulls the defaults apart, also in `tools/variants.json`:
   ```bash
   node --test --test-reporter=dot test/<design>.test.mjs test/variants.test.mjs test/labels.test.mjs test/declared-measurements.test.mjs test/brief.test.mjs > "$S/t.txt" 2>&1; echo "exit $?"
   grep -E "AssertionError|Error:" "$S/t.txt" | sed 's/[0-9.]\+/N/g' | sort | uniq -c | sort -rn | head
   ```
8. **Shared `lib/` file changed?** Snapshot its family from the committed version (CONTRIBUTING.md, Step 7).
   Buttons on a front: `node tools/buttons.mjs <design>`.
9. **Look.** One sheet beside the plate; then a child and a stout size:
   ```bash
   NODE_PATH=$(npm root -g) node tools/compare.mjs <design> --pages <pdf pages> --sets <set>
   NODE_PATH=$(npm root -g) node tools/render.mjs <design> usdaBoyC5 stoutMale48 --png
   ```
10. **Write `BRIEF.md`** from the template in CONTRIBUTING.md, Step 9, keeping apart what the text states, what you read from the plate and what's ours. `test/brief.test.mjs` checks its sections.
11. **Finish.** Copy the shape of the last garment's commit: `git show --stat HEAD`, then
    `git show HEAD -- README.md designs/README.md SOURCING.md WARDROBE_GAPS.md BUILD_QUEUE.md`.
    Run `NODE_PATH=$(npm root -g) node tools/preview.mjs <design>`, add the illustration prompt, add the
    design to the muslin report, and set the queue status. Then `npm run build` in `site/` and
    `NODE_PATH=$(npm root -g) node tools/page-check.mjs <design>`.
12. **Report** what you changed from the source and anything you didn't run or verify. Add a line to
    your notes on what cost time.

`$S` is any scratch directory outside the repo. Run the full `npm test` (several minutes, in the
background) only before a push.
