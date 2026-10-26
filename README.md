# PublicSewing

Made-to-measure sewing patterns for practical, timeless garments, drafted from your own
measurements, children's sizes included.

PublicSewing adds garments that [FreeSewing](https://freesewing.org) doesn't have. Each design
takes its pieces, style lines, proportions and construction from a public-domain drafting book
(so far five, published 1909 to 1921, four American and one British). The geometry comes from FreeSewing's
tested blocks, so every design drafts at any size. The old books are design references: designs
are modernised and simplified freely, and historical accuracy is not a goal.

PublicSewing is a separate project built on FreeSewing's MIT-licensed packages. It is not part
of FreeSewing and isn't endorsed by it.

## Status

**Every design is a draft. None has been sewn yet.** Each one drafts cleanly at every
measurement set in the test suite, and its seams that sew together have matching lengths. That
doesn't prove the garment fits. A design is marked `tested` only after someone has sewn a
muslin and recorded the result in its brief. If you sew one, please report what happened.
Some designs are also draped in a 3D cloth simulator ([designs/drape](designs/drape/README.md)):
a check that the pieces sew together into the garment, not a fit result.

| Design | Garment | Source |
|---|---|---|
| `chore-coat` | Work coat | Simons 1918 |
| `mackinaw` | Double-breasted belted mackinaw (convertible, military or shawl collar; raglan option) | Simons 1918 |
| `peacoat` | Hip-length double-breasted coat: notched lapel and deep ulster collar, hand-warmer pockets, back vent, lining | Simons 1916 |
| `hunting-coat` | Belted field coat with an action-pleated back | Simons 1918 |
| `military-blouse` | Fitted blouse, two-piece sleeve, standing collar | Simons 1918 |
| `boys-work-coat` | The chore coat for children's sizes | Simons 1918 |
| `barbers-coat` | White service coat | Simons 1918 |
| `shop-coat` | Long work overcoat (grocer's gown, lab coat, duster) | Simons 1918 |
| `bar-vest` | Short white jacket | Simons 1918 |
| `nightshirt` | Yoked nightshirt | Walker 1909 |
| `nightgown` | Yoked, gathered nightgown | Walker 1909 |
| `smock` | Yoked smock / child's overall | Walker 1909 |
| `frock` | Bodice-and-skirt dress | Walker 1909 |
| `pinafore` | Sleeveless gathered pinafore | Walker 1909 |
| `knickerbockers` | Knickers gathered into knee bands | Walker 1909 |
| `shirtwaist-dress` | Buttoned work dress with a turn-down collar and cuffs | Woman's Institute, *Pattern Drafting* (1915) |
| `tailored-jacket` | Women's semi-fitted jacket, princess seams, peak lapel | Mitchell 1921 |
| `box-coat` | Women's loose box coat with a notched lapel and set-in flap pockets | Mitchell 1921 |

[WARDROBE_GAPS.md](WARDROBE_GAPS.md) compares a full wardrobe against what FreeSewing already
has and lists what's next.

## Using it

The designs are in [`designs/`](designs/), an npm workspace (Node 22).

```bash
cd designs
npm install
npm test                                              # every design at every size
node tools/render.mjs chore-coat cisMaleAdult38       # 1:1 SVG in out/
```

[designs/README.md](designs/README.md) covers rendering, previews and adding a design. Each
design's `BRIEF.md` records its source pages, its pieces and how the source's proportions became
options.

## What's in the repo

- `designs/`: the designs, shared drafting code (`lib/`) and tests.
- `designs/sizes/`: children's measurement sets transcribed from the USDA body-measurement
  surveys of 1939 (75 sets). FreeSewing ships none for children.
- `corpus/`: scans (PDF) of the books the designs draw on and of others kept for research,
  with [MANIFEST.yaml](corpus/MANIFEST.yaml) recording each one's origin and rights basis.
  Sources are cited by folder id, e.g. `draftingcottonga00simo`.
- `SOURCING.md` and `RESEARCH.md`: how the sources were found and vetted, and what else exists.
- **Archived:** `ccat/`, `recipes/`, `data/`, `catalog/`, `pilot/` and `drape/` hold an earlier
  approach: a Python pipeline that reproduced drafting systems point by point and checked them
  against the values the books print. It's kept for reference and isn't maintained.

## Sources and copyright

The designs draw on five drafting books:
- Simons, *Drafting Cotton Garments and Mackinaws* (New York, 1918), `draftingcottonga00simo`;
- Simons, *Designing Overcoat Patterns for Men and Young Men* (New York, 1916), `designingovercoa00simo`;
- Walker, *Manual of Needlework and Cutting Out* (London, 1909), `krl00366374`;
- Woman's Institute, *Pattern Drafting* (Scranton, ©1915), `patterdraftingpicken`;
- Mitchell, *The New "Standard" Work on Designing and Pattern-Making of Ladies' Tailor-Made
  Garments* (New York, 1921), `newstandardworko00mitc`.

Children's sizes come from the USDA's O'Brien surveys (1939), a US government work.

`corpus/` holds those books and 22 more kept for research: drafting books published from 1886
to 1924, mostly American, with three British and one German, and two more USDA
reports. All were published before 1931, so they are in the public domain in the United
States. Outside the US, a book's status depends on when its author died (70 years after, in
the UK and Germany). The British authors died long enough ago: Agnes Walker in 1908, M.
Prince Browne in 1921, W. D. F. Vincent in 1926. We haven't found when Gertrud Behrendsen
(*Anfertigung von Wäsche und Oberkleidung*, Leipzig, 1912) died; her book is public domain
in Germany only if she died before 1956. No design uses it.

Drafting methods, formulas, proportions and body measurements aren't copyrightable; the
expression of a book (its text, layout and illustrations) is. Each design takes its pieces,
proportions and construction from a book, gets its geometry from FreeSewing's blocks, and is
written in our own words. No source text or illustration is reproduced outside `corpus/`.

The archived pipeline (`ccat/` and the folders with it) also read the formulas and sizing
tables of ЕМКО СЭВ (1988), which is still in copyright. Only its numbers and methods are in
the repository, recomputed by our code; its text and scans are not.

## License

PublicSewing's own work is free for any noncommercial use: personal sewing, teaching, research,
charities and other noncommercial organisations.

Copyright © 2026 David Borowski II.

- **Source code** (JavaScript and Python files, Dockerfiles, build and test configuration,
  wherever they are): [PolyForm Noncommercial 1.0.0](LICENSE).
- **Everything else of ours** (design specs, which are the patterns, briefs, documentation,
  rendered patterns and drape renders):
  [Creative Commons Attribution-NonCommercial 4.0](LICENSE-CONTENT).
- **Not covered:** the scanned books in `corpus/` and the USDA measurements stay in the public
  domain; FreeSewing's packages, installed from npm, keep their own MIT licence; and the
  methods and measurements read from the books aren't anyone's to license.

Selling the patterns themselves needs permission. Sewing garments from them is a different
matter: copyright in a pattern doesn't extend to the clothes made from it.

**Not for AI training.** We ask that this repository not be used to train machine-learning
models. This is a request, not a licence term.
